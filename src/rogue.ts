/**
 * The rogue mode (steps/05-core-set/5d-rogue): a run as plain data, moved forward one decision at a time. Three acts on
 * Slay the Spire's structure: an act is a map of branching paths through a themed region, from a first fight to a boss;
 * the player picks each next room. The party is a leader the player owns and two drafted companions. HP, MP and
 * knockouts carry from fight to fight; campfires, the shop, supplies and a few events are the only relief, and each new
 * act begins restored, with everyone learning an ability.
 *
 * Pure TypeScript with no Node APIs: the interface and the simulations both drive it. Every roll comes from the run's
 * seed, sliced by what it's for, so the same seed and the same choices make the same run. The data is the pack's
 * `rogue` block; fights are the engine's, one at a time.
 */
import { advance, newRun, type Content, type Run } from "./engine/run.js";
import { combat, type Member as EngineMember } from "./engine/combat/rules.js";
import { int, next, rngFor, shuffle, type Rng } from "./engine/rng.js";
import { formBase, formId, type DungeonT, type FoesT, type FormationRarityT, type GearT, type Party, type RarityT, type RogueEventT, type RogueFightT, type RogueNodeKindT, type RogueRegionT, type RogueT, type EventOpT, type SupplyIdT, type UpgradeFormT, type UpgradeT } from "./schema.js";
import { canEquip, handsOf } from "./validate.js";

/**
 * Step 5j: 2. A run saved before the cleanup holds pieces and affixes the content no longer has, so it's set aside.
 * Step 5i: 3. The old loot is retired (every piece but the plain weapons, every formation but Neutral, the affixes).
 * Step 5i: 4. Fixed pieces (no affixes), offers that pick a slot first, mythics, training as learn, power step or version.
 */
export const ROGUE_VERSION = 4;
/** Step 5j: four slots. The offhand stays empty until the next pass makes its pieces. */
export type Slot = "weapon" | "armor" | "offhand" | "amulet";
export const SLOT_LIST: Slot[] = ["weapon", "armor", "offhand", "amulet"];

// ─── State ──────────────────────────────────────────────────────────────────

/**
 * A piece of gear in a run: a piece of the content (`base`) and its rarity, the piece's own (step 5i: every piece is fixed, with no
 * affixes at any rarity; a plain weapon is common). Its id in the content is `uid`.
 */
export type Item = { uid: string; base: string; rarity: RarityT };
/** Step 5i: a version of an upgrade. */
export type Version = "a" | "b";
/** Step 5i: what a member has trained on one ability or its passive: the power step, a version, or both (in either order). */
export type Trained = { power?: boolean; version?: Version };
/**
 * A class in the run's roster. HP and MP are kept as what's missing, so gear that raises the max raises the current too.
 * Step 5i: `known` and `order` are base ability ids; `trained` records, by ability id or the passive's status id, the power
 * step and the version taken, and the engine's party gets the forms (`formOf`).
 */
export type Member = {
  cls: string; known: string[]; order: string[]; gear: Partial<Record<Slot, string>>; missHp: number; missMp: number; ko: boolean;
  trained?: Record<string, Trained>;
  /**
   * Step 5g (the director's): ticks of cooldown each ability had left as the last fight ended; the next fight starts from there.
   * Step 5i: by base ability id, so a carried cooldown follows its ability to a new form.
   */
  cooldowns?: Record<string, number>;
  /** Max HP and MP as the last fight ended: a heal by share of max counts from no more than this (see `healMax`). */
  lastMax?: { hp: number; mp: number };
};
export type MapNode = { id: string; floor: number; col: number; kind: RogueNodeKindT; next: string[] };
export type Offer =
  /** Round 6: `sealed`, its rarity and name hidden until taken (an unknown reward). */
  | { kind: "gear"; item: Item; sealed?: boolean }
  /** Round 6: a bundle, a piece and a supply together. */
  | { kind: "bundle"; item: Item; supply: SupplyIdT }
  | { kind: "tome"; cls: string; ability: string }
  /** Step 5h: a recruit comes knowing what its offer shows (rolled when offered), and a cage's recruit with a piece. */
  | { kind: "recruit"; cls: string; known?: string[]; item?: Item }
  | { kind: "formation"; id: string }
  | { kind: "supply"; id: SupplyIdT }
  /** Step 5h: one more seat at camp. */
  | { kind: "seat" };
export type ShopSlot = { offer: Offer; price: number; sold: boolean };
export type FightTier = "fight" | "elite" | "boss";
export type FightSpec = { node: string; tier: FightTier; fight: RogueFightT; foes: FoesT; seed: number };
export type Pending =
  | { kind: "draft"; offers: string[]; left: number; known?: Record<string, string[]> }
  | { kind: "map" }
  | ({ kind: "fight"; begun?: boolean } & FightSpec)
  /** Round 9 (the director's): a won fight offers a choice of one supply; `then` is what follows the pick (the spoils, or a boss's boon). */
  | { kind: "drop"; options: SupplyIdT[]; then: Pending }
  | { kind: "spoils"; gold: number; offers: Offer[]; tier: FightTier; trophy?: Item; then?: Pending }
  /**
   * Step 5h round 6 (the director's: formations came too late; "elites have a pick of a legendary and a pick of a formation"): an
   * elite's second pick, of formations, after its pick of legendaries.
   */
  | { kind: "trophy"; offers: Offer[]; then: Pending }
  /** Step 5h round 6: a captive freed after a fight against people: taken in, a lesson, or let go; `then` follows. */
  | { kind: "captive"; offer: Offer; then: Pending }
  | { kind: "boon"; offers: Offer[] }
  | { kind: "shop"; stock: ShopSlot[]; learn: boolean; upgrade: boolean; trained?: number }
  | { kind: "campfire"; used?: boolean; resting?: string[]; stranger?: Offer }
  | { kind: "event"; id: string; v?: number }
  /** Step 5h: the Muster (a pick of recruits) and the Drill ground (a pick of formations, or training). */
  | { kind: "muster"; offers: Offer[]; then?: Pending }
  | { kind: "drill"; offers: Offer[] }
  /**
   * Step 5h: `left` members each take one training (each member once); `then` is what follows. Round 6 (the director's: "you try
   * to see what the available upgrades are and get locked in"): `back`, the room it came from, while nobody is trained yet. Step 5i:
   * a training is learning an ability, or an ability's or the passive's power step or version (`trainOptions`).
   */
  | { kind: "train"; left: number; done: string[]; then: Pending; why: string; back?: Pending }
  | { kind: "treasure"; offer: Offer; gold: number }
  | { kind: "choose"; what: "learn" | "upgrade" | "temper"; why: string; from?: RarityT[]; risk?: number }
  | { kind: "levelup"; queue: string[] }
  | { kind: "region"; options: string[] }
  | { kind: "over"; won: boolean };

/** One line of what happened, for the run's summary and the playtest's diary. */
export type Note = { act: number; floor: number; text: string };

export type RogueRun = {
  v: number;
  seed: number;
  heat: number;
  leader: string;
  act: number;
  region: string;
  boss: RogueFightT;
  map: MapNode[];
  /** The node last entered, or null at an act's start. */
  at: string | null;
  visited: string[];
  /** Events met this run, so a run doesn't meet the same one twice until it has met them all. */
  seen: string[];
  /** Fights met this act, so an act doesn't repeat one while its pool has others. */
  met: string[];
  roster: Member[];
  /** Classes in the party, in formation slot order; the rest of the roster waits at camp. */
  party: string[];
  formation: string;
  formations: string[];
  /** Step 5h: seats at camp (the bench), from the config's start up to its max. */
  seats?: number;
  /** Step 5h round 6: the fight (by count) the last captive came after, so none comes two fights running. */
  captiveAt?: number;
  items: Item[];
  supplies: SupplyIdT[];
  gold: number;
  pending: Pending;
  uid: number;
  /** Counters for the summary and the simulations. */
  stats: { fights: number; elites: number; bosses: number; gold: number; spent: number; events: number; shops: number; campfires: number; picks: Record<string, number> };
  notes: Note[];
  /** How far the run got, for the summary: act and floor of the last room entered. */
  floor: number;
};

/** A saved run brought up to date: fields added since it was saved get their defaults. */
export function migrate(run: RogueRun): RogueRun {
  run.seen ??= [];
  run.met ??= [];
  // (Step 5g renamed the supplies here, the old tonic to the potion and the ether to the tonic, but a save from then carries an
  // older ROGUE_VERSION and is set aside; run on every load, the rename turned each of today's tonics into a potion.)
  return run;
}

/** What a player keeps between runs: the classes a run can start with, and how far they've climbed. */
export type RogueMeta = { owned: string[]; heat: number; maxHeat: number; runs: number; wins: number; best: { act: number; floor: number }; /** Step 5h round 6: the next run's dice, kept until a run starts (the start screen shows each leader's roll). */ next?: number };

export const freshMeta = (): RogueMeta => ({ owned: ["knight", "cleric", "ranger"], heat: 0, maxHeat: 0, runs: 0, wins: 0, best: { act: 0, floor: 0 } });

export function rogue(c: Content): RogueT {
  if (!c.pack.rogue) throw new Error("this pack has no rogue block");
  return c.pack.rogue;
}
const cfg = (c: Content) => rogue(c).config;
const regionOf = (c: Content, id: string): RogueRegionT => rogue(c).regions.find((r) => r.id === id)!;
export const member = (run: RogueRun, cls: string): Member => run.roster.find((m) => m.cls === cls)!;
export const bench = (run: RogueRun): string[] => run.roster.map((m) => m.cls).filter((cls) => !run.party.includes(cls));
const note = (run: RogueRun, text: string) => run.notes.push({ act: run.act, floor: run.floor, text });
const r = (run: RogueRun, label: string): Rng => rngFor(run.seed, `rogue:${label}`);
const between = (rng: Rng, [a, b]: readonly [number, number] | number[]) => a + int(rng, b - a + 1);

// ─── Content the run adds: its gear, its trained forms, its fight ─────────

const noteOf = (it: Item) => `rogue ${it.rarity}: ${it.base}`;
/** Every run's item as content the engine can look up by its `uid`. */
export function registerGear(c: Content, run?: RogueRun) {
  if (run) for (const it of run.items) if (c.gear.get(it.uid)?.note !== noteOf(it)) c.gear.set(it.uid, itemGear(c, it));
}
/** A run's item as gear: its piece, under the item's id (step 5i: a piece is fixed, so nothing else changes). */
export function itemGear(c: Content, it: Item): GearT {
  const base = c.gear.get(it.base)!;
  return { ...structuredClone(base), id: it.uid, source: "drop", note: noteOf(it) };
}
export const itemOf = (run: RogueRun, uid: string) => run.items.find((i) => i.uid === uid);
/** Who wears an item, or null if it's in the bag. */
export const wearer = (run: RogueRun, uid: string) => run.roster.find((m) => Object.values(m.gear).includes(uid))?.cls ?? null;
export const bag = (run: RogueRun) => run.items.filter((i) => !wearer(run, i.uid));

/** The engine's party for the run's party: formation, seats, abilities in order (their trained forms), the passive's form, gear. */
export function partyOf(c: Content, run: RogueRun): Party {
  const f = c.formations.get(run.formation)!;
  return {
    formation: run.formation,
    units: run.party.map((cls, i) => {
      const m = member(run, cls);
      const pid = passiveOf(c, cls);
      const passive = pid ? formOf(m, pid) : undefined;
      return {
        class: cls, position: f.positions[i].id, abilities: m.order.map((a) => formOf(m, a)), ...(passive && passive !== pid ? { passive } : {}),
        gear: Object.fromEntries(Object.entries(m.gear).filter(([, v]) => v)) as Record<string, string>,
      };
    }),
  };
}

/** The one-stage dungeon the engine plays for a fight. */
export const FIGHT_DUNGEON = "rogue_fight";
export function fightDungeon(c: Content, spec: FightSpec): DungeonT {
  const d: DungeonT = {
    id: FIGHT_DUNGEON, name: spec.fight.name, text: spec.fight.name, partySize: { max: 3 }, perkPool: [], challenges: [],
    ...(Object.keys(spec.foes).length ? { foes: spec.foes } : {}),
    stages: [{ kind: "fight", id: spec.fight.id, name: spec.fight.name, enemies: spec.fight.enemies, ...(spec.tier === "boss" ? { boss: true } : {}) }],
  };
  c.dungeons.set(FIGHT_DUNGEON, d);
  return d;
}

/** A new engine run for the pending fight, with the party's HP, MP and knockouts carried in. */
export function startFight(c: Content, run: RogueRun, opts: { log?: boolean } = {}): Run {
  const p = run.pending;
  if (p.kind !== "fight") throw new Error("no fight is pending");
  registerGear(c, run);
  fightDungeon(c, p);
  // From here the party is set: leaving and coming back replays this fight as it starts, the same way.
  p.begun = true;
  const er = newRun(c, combat, { dungeon: FIGHT_DUNGEON, party: partyOf(c, run), seed: p.seed }, { checked: true, log: opts.log });
  carryIn(run, er);
  return er;
}
/** Sets an engine run's party to the roster's HP, MP, knockouts and cooldowns (each under its ability's trained form). */
export function carryIn(run: RogueRun, er: Run) {
  for (const em of er.party as EngineMember[]) {
    const m = member(run, em.ref);
    em.hp = m.ko ? 0 : Math.max(1, em.stats.max_hp - m.missHp);
    em.mp = Math.max(0, em.stats.max_mp - m.missMp);
    if (m.cooldowns) em.cooldowns = Object.fromEntries(Object.entries(m.cooldowns).map(([id, v]) => [formOf(m, id), v]));
  }
}

/** The fight's result, carried back: HP, MP, knockouts; then spoils, the boss's boon, or the end. */
export function endFight(c: Content, run: RogueRun, er: Run) {
  const p = run.pending;
  if (p.kind !== "fight") throw new Error("no fight is pending");
  const won = er.outcome === "won";
  for (const em of er.party as EngineMember[]) {
    const m = member(run, em.ref);
    m.ko = em.hp <= 0;
    m.missHp = m.ko ? em.stats.max_hp : Math.max(0, em.stats.max_hp - em.hp);
    m.missMp = Math.max(0, em.stats.max_mp - em.mp);
    m.lastMax = { hp: em.stats.max_hp, mp: em.stats.max_mp };
    // Step 5i: kept by base ability id, so a cooldown follows its ability to a new form.
    if (em.cooldowns) m.cooldowns = Object.fromEntries(Object.entries(em.cooldowns).map(([id, v]) => [formBase(id), v]));
  }
  run.stats.fights++;
  if (p.tier === "elite") run.stats.elites++;
  if (!won) {
    // Step 5h (the director's): a wipe is a wipe. The reserves rule (those at camp took the road) is gone: it was there because
    // the party could change only at a campfire, and now it can change before any fight.
    note(run, `Fell to ${p.fight.name}.`);
    run.pending = { kind: "over", won: false };
    return;
  }
  // Step 5h (the director's): those who sat the fight out regain a flat share of their max MP (from the max they last fought
  // with, so MP gear put on at camp adds nothing), like a tonic; no gear touches it.
  const benchMp = cfg(c).benchMp ?? 0;
  if (benchMp) heal(c, run, bench(run).map((cls) => member(run, cls)), 0, benchMp);
  const down = run.party.filter((cls) => member(run, cls).ko);
  note(run, `Beat ${p.fight.name}${down.length ? ` (${down.map((k) => c.classes.get(k)!.name).join(", ")} down)` : ""}.`);
  const g = cfg(c).gold;
  const rng = r(run, `gold:${run.act}:${p.node}`);
  const gold = between(rng, g[p.tier === "fight" ? "fight" : p.tier]) + g.perAct * (run.act - 1);
  if (p.tier === "boss") {
    run.stats.bosses++;
    gainGold(run, gold);
    if (run.act >= cfg(c).knobs.length) {
      note(run, "The run is won.");
      run.pending = { kind: "over", won: true };
      return;
    }
    run.pending = offerDrop(c, run, { kind: "boon", offers: boonOffers(c, run) });
    return;
  }
  const offers = spoilOffers(c, run, p.tier, p.node);
  const s = cfg(c).spoils[p.tier === "elite" ? "elite" : "fight"];
  // What follows the pick: an elite's pick of formations (round 6), while there are any to win; then a captive, sometimes.
  let then: Pending = { kind: "map" };
  const cap = captiveFor(c, run, p.fight.enemies, p.node);
  if (cap) then = { kind: "captive", offer: cap, then };
  const fms = s.formations ? rollFormations(c, run, r(run, `trophy:${run.act}:${p.node}`), s.formations) : [];
  if (fms.length) then = { kind: "trophy", offers: fms, then };
  // Step 5i (a third more gear for the fourth slot): `extra` % of the time, a second pick of pieces follows the first, from the
  // same table, none of them a piece in the first pick.
  const xr = r(run, `spoils2:${run.act}:${p.node}`);
  if (s.extra && next(xr) * 100 < s.extra) {
    const taken = offers.flatMap((o) => (o.kind === "gear" || o.kind === "bundle" ? [o.item.base] : []));
    const more: Offer[] = [];
    for (let i = 0; i < s.count; i++) {
      const item = rollItem(c, run, xr, rollRarity(xr, s.rarity), false, true, undefined, taken);
      if (item) (taken.push(item.base), more.push({ kind: "gear", item }));
    }
    if (more.length) then = { kind: "spoils", gold: 0, offers: more, tier: p.tier, ...(then.kind !== "map" ? { then } : {}) };
  }
  const spoils: Pending = { kind: "spoils", gold, offers, tier: p.tier, ...(then.kind !== "map" ? { then } : {}) };
  // An elite's trophy: a legendary piece aimed at the party, won outright and in the bag already (before round 6); none with no piece to win.
  const prize = s.trophy ? rollItem(c, run, r(run, `trophy:${run.act}:${p.node}`), "legendary", true) : null;
  if (!prize) return void (run.pending = offerDrop(c, run, spoils));
  const piece: Offer = { kind: "gear", item: prize };
  take(c, run, piece);
  note(run, `Won ${offerText(c, run, piece)}.`);
  run.pending = offerDrop(c, run, { ...spoils, trophy: prize });
}

/** The supplies of a kind the party carries. */
export const carried = (run: RogueRun, id: SupplyIdT) => run.supplies.filter((s) => s === id).length;
/** Room in the bag's slot for this kind. */
export const bagRoom = (c: Content, run: RogueRun, id: SupplyIdT) => carried(run, id) < cfg(c).bag[id];
export const supplyName = (id: SupplyIdT) => (id === "phoenix" ? "a phoenix feather" : `a ${id}`);
/**
 * Round 9 (the director's): after every won fight the party picks one of the dropped kinds (a potion or a tonic), not one of each; a kind
 * whose slot is full isn't offered, one left is simply taken, none left is nothing.
 */
function offerDrop(c: Content, run: RogueRun, then: Pending): Pending {
  const options = (cfg(c).drops ?? []).filter((id) => bagRoom(c, run, id));
  if (options.length > 1) return { kind: "drop", options, then };
  if (options.length === 1) (run.supplies.push(options[0]), note(run, `Found ${supplyName(options[0])}.`));
  return then;
}

/**
 * Step 5h round 6: a captive after a won fight with people in it, `captive.chance` of the time, never two fights running (the
 * director's: "as long as it's not every other fight or every fight").
 */
function captiveFor(c: Content, run: RogueRun, enemies: string[], node: string): Offer | null {
  const k = cfg(c).captive;
  if (!k || !enemies.some((e) => k.people.includes(e)) || run.captiveAt === run.stats.fights - 1) return null;
  const rng = r(run, `captive:${run.act}:${node}`);
  if (next(rng) * 100 >= k.chance) return null;
  const o = rollRecruit(c, run, rng);
  if (o) run.captiveAt = run.stats.fights;
  return o;
}
/** Plays the pending fight at once (the simulations), and carries the result back. */
export function autoFight(c: Content, run: RogueRun): Run {
  const er = startFight(c, run);
  advance(c, combat, er);
  endFight(c, run, er);
  return er;
}

// ─── A new run ──────────────────────────────────────────────────────────────

/**
 * Step 5h (the director's): what a class knows is rolled: `n` of its abilities at random, in its own order. A starting unit
 * knows one; a recruit one to three, by the act's odds (`recruitKnown`). Raise and Valhalla are rolled like any other.
 */
export function rollKnown(c: Content, rng: Rng, cls: string, n: number): string[] {
  const all = c.classes.get(cls)!.abilities;
  const pick = new Set(shuffle(rng, all).slice(0, Math.max(1, Math.min(n, all.length))));
  return all.filter((a) => pick.has(a));
}
/** How many abilities a recruit offered now knows: one, two or three, weighted by the act (at least `min`). */
export function recruitKnown(c: Content, run: RogueRun, rng: Rng, min = 1): number {
  const odds = cfg(c).recruits?.known;
  const w = (odds?.[Math.min(run.act, odds.length) - 1] ?? [1, 0, 0]).map((x, i) => (i + 1 >= min ? x : 0));
  let x = next(rng) * w.reduce((s, v) => s + v, 0);
  for (let i = 0; i < 3; i++) if ((x -= w[i]) < 0) return i + 1;
  return Math.max(min, 1);
}
/** Seats at camp the run has now. */
export const seatsOf = (c: Content, run: RogueRun) => run.seats ?? cfg(c).bench;
/** A fresh ability's carried cooldown: what's left of its cooldown with the config's share already run. */
function freshCooldown(c: Content, ability: string): number {
  return Math.round(c.abilities.get(ability)!.cooldown * (100 - (cfg(c).fresh ?? 0))) / 100;
}
export function plainWeapon(c: Content, cls: string): string {
  const kind = c.classes.get(cls)!.weapons[0];
  return c.pack.gear.find((g) => g.slot === "weapon" && g.source === "starter" && g.weapon?.kind === kind)!.id;
}
/** A new item of a piece, at its rarity (the piece's own: `pieceRarity`). */
export function newItem(run: RogueRun, base: string, rarity: RarityT): Item {
  return { uid: `rg${run.seed % 100000}_${++run.uid}`, base, rarity };
}
/**
 * A class joins: its plain weapon, what it knows (rolled by the act's odds when not given), full HP and MP (or `hp` %), and
 * (step 5h) its abilities half charged. A cage's or a deserter's piece comes with it, worn if it fits. To the party if there's
 * room, else to camp.
 */
export function recruit(c: Content, run: RogueRun, cls: string, hp = 100, known?: string[], item?: Item): boolean {
  if (run.roster.some((m) => m.cls === cls) || !roomForRecruit(c, run)) return false;
  const w = newItem(run, plainWeapon(c, cls), "common");
  run.items.push(w);
  const k = known ?? rollKnown(c, r(run, `known:${cls}:${run.act}:${run.uid}`), cls, recruitKnown(c, run, r(run, `known-n:${cls}:${run.act}:${run.uid}`)));
  const m: Member = { cls, known: [...k], order: [...k], gear: { weapon: w.uid }, missHp: 0, missMp: 0, ko: false, cooldowns: Object.fromEntries(k.map((a) => [a, freshCooldown(c, a)])) };
  run.roster.push(m);
  if (item) run.items.push(item);
  registerGear(c, run);
  if (item) {
    const g = c.gear.get(item.uid)!;
    if (canEquip(c.classes.get(cls)!, g)) m.gear[g.slot as Slot] = item.uid;
    settle(c, m);
  }
  if (hp < 100) m.missHp = Math.floor((maxOf(c, run, cls, "max_hp") * (100 - hp)) / 100);
  if (run.party.length < cfg(c).party) run.party.push(cls);
  return true;
}

export type NewRun = { seed: number; leader: string; heat?: number };
/** The ability a leader would set out knowing on a run with this seed (the start screen shows it before the pick). */
export const leaderKnown = (c: Content, seed: number, leader: string): string[] => rollKnown(c, rngFor(seed, "rogue:known:leader"), leader, 1);
export function newRogue(c: Content, o: NewRun): RogueRun {
  const k = cfg(c);
  const run: RogueRun = {
    v: ROGUE_VERSION, seed: o.seed, heat: o.heat ?? 0, leader: o.leader, act: 1, region: "", boss: { id: "none", name: "none", enemies: ["wolf"] }, map: [], at: null, visited: [], seen: [], met: [],
    roster: [], party: [], formation: "neutral", formations: ["neutral"], items: [], supplies: [], gold: k.start.gold, pending: { kind: "map" }, uid: 0,
    stats: { fights: 0, elites: 0, bosses: 0, gold: 0, spent: 0, events: 0, shops: 0, campfires: 0, picks: {} }, notes: [], floor: 0,
  };
  registerGear(c);
  run.seats = k.bench;
  recruit(c, run, o.leader, 100, leaderKnown(c, o.seed, o.leader));
  run.supplies.push(...(k.start.supplies ?? []));
  note(run, `${c.classes.get(o.leader)!.name} sets out.`);
  const first = rogue(c).regions.filter((x) => x.act === 1);
  beginAct(c, run, first[int(r(run, "region:1"), first.length)].id, false);
  run.pending = k.start.picks > 0 ? draftPending(c, run, 1, k.start.picks) : { kind: "map" };
  return run;
}
/** Does a class heal or raise others (an ability that heals, gives Regen or revives)? */
export const heals = (c: Content, cls: string) =>
  c.classes.get(cls)!.abilities.some((id) => c.abilities.get(id)!.do.some((e) => e.op === "heal" || e.op === "revive" || (e.op === "apply" && e.status === "regen")));
/** A draft pick: its offers, and the one ability each would join knowing (rolled now, shown on its card). */
function draftPending(c: Content, run: RogueRun, n: number, left: number): Pending {
  const offers = draftOffers(c, run, n);
  return { kind: "draft", offers, left, known: Object.fromEntries(offers.map((cls) => [cls, rollKnown(c, r(run, `draft-known:${n}:${cls}`), cls, 1)])) };
}
function draftOffers(c: Content, run: RogueRun, n: number): string[] {
  const pool = c.pack.classes.map((k) => k.id).filter((id) => !run.roster.some((m) => m.cls === id));
  const offers = shuffle(r(run, `draft:${n}`), pool);
  const out = offers.slice(0, cfg(c).start.offers);
  // While the party has nobody who heals others, each draft offers one who does (a playtester: "two of my three runs
  // felt lost at the draft"; HP carries over, and without a healer it only leaks).
  if (cfg(c).start.healer && !run.roster.some((m) => heals(c, m.cls)) && !out.some((id) => heals(c, id))) {
    const h = offers.find((id) => heals(c, id));
    if (h) out[out.length - 1] = h;
  }
  return out;
}

// ─── Acts and maps ──────────────────────────────────────────────────────────

/** Slay the Spire's generator: paths walked up from the bottom, one column left, ahead or right a floor, never crossing. */
export function makeMap(c: Content, rng: Rng): MapNode[] {
  const m = cfg(c).map;
  const W = m.width, F = m.floors;
  const edges = new Set<string>();
  const used = new Set<string>();
  const key = (fl: number, col: number) => `${fl}:${col}`;
  let first = -1;
  for (let p = 0; p < m.paths; p++) {
    let col = int(rng, W);
    if (p === 0) first = col;
    if (p === 1) while (col === first) col = int(rng, W);
    used.add(key(1, col));
    for (let fl = 1; fl < F; fl++) {
      const opts = [col - 1, col, col + 1].filter((x) => x >= 0 && x < W && !(x !== col && edges.has(`${fl}:${x}>${col}`)));
      const nx = opts[int(rng, opts.length)];
      edges.add(`${fl}:${col}>${nx}`);
      used.add(key(fl + 1, nx));
      col = nx;
    }
  }
  const nodes: MapNode[] = [];
  for (let fl = 1; fl <= F; fl++)
    for (let col = 0; col < W; col++)
      if (used.has(key(fl, col))) nodes.push({ id: `f${fl}c${col}`, floor: fl, col, kind: "fight", next: [] });
  for (const e of edges) {
    const [fl, rest] = e.split(":");
    const [a, b] = rest.split(">").map(Number);
    const from = nodes.find((n) => n.floor === Number(fl) && n.col === a)!;
    const to = `f${Number(fl) + 1}c${b}`;
    if (!from.next.includes(to)) from.next.push(to);
  }
  const boss: MapNode = { id: "boss", floor: F + 1, col: Math.floor(W / 2), kind: "boss", next: [] };
  for (const n of nodes) if (n.floor === F) n.next.push(boss.id);
  nodes.push(boss);
  assignKinds(c, nodes, rng);
  return nodes;
}

const SPECIAL_ROOMS = new Set(["elite", "campfire", "shop", "muster", "drill"]);
function assignKinds(c: Content, nodes: MapNode[], rng: Rng) {
  const m = cfg(c).map;
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const parents = (n: MapNode) => nodes.filter((p) => p.next.includes(n.id));
  const fixed = new Set<string>();
  for (const n of nodes) {
    const k = m.fixed[String(n.floor)];
    if (k) (n.kind = k), fixed.add(n.id);
  }
  const kinds = Object.keys(m.odds);
  const total = (ks: string[]) => ks.reduce((s, k) => s + m.odds[k], 0);
  for (const n of nodes) {
    if (fixed.has(n.id) || n.kind === "boss") continue;
    const near = [...parents(n), ...n.next.map((id) => byId.get(id)!)].filter((x) => fixed.has(x.id) || x.floor < n.floor);
    const siblings = parents(n).flatMap((p) => p.next).filter((id) => id !== n.id).map((id) => byId.get(id)!).filter((x) => x.floor === n.floor && nodes.indexOf(x) < nodes.indexOf(n));
    let allowed = kinds.filter((k) => !(n.floor < m.lateFrom && (k === "elite" || k === "campfire")) && !(SPECIAL_ROOMS.has(k) && near.some((x) => x.kind === k)));
    const unique = allowed.filter((k) => !siblings.some((s) => s.kind === k));
    if (unique.length) allowed = unique;
    let roll = next(rng) * total(allowed);
    n.kind = (allowed.find((k) => (roll -= m.odds[k]) < 0) ?? allowed[0]) as RogueNodeKindT;
  }
  // At least so many rooms of a kind an act, where the rules allow them: two shops and two elites; step 5h, two Musters and
  // two Drill grounds (from floor 2), so routing toward a recruit or a formation is a choice.
  const ensure = (kind: RogueNodeKindT, count: number, from: number) => {
    while (nodes.filter((n) => n.kind === kind).length < count) {
      const cands = nodes.filter((n) => !fixed.has(n.id) && n.floor >= from && n.kind === "fight" && ![...parents(n), ...n.next.map((id) => byId.get(id)!)].some((x) => x.kind === kind));
      if (!cands.length) return;
      cands[int(rng, cands.length)].kind = kind;
    }
  };
  for (const [kind, count] of Object.entries(m.ensure ?? { shop: 2, elite: 2 })) ensure(kind as RogueNodeKindT, count, kind === "muster" || kind === "drill" ? 2 : m.lateFrom);
  // Step 5h round 6 (the director's): campfires are guaranteed only before the boss. Then (their word on the first measure, a
  // mid-act one on 37% of paths: "not a guarantee, but I think like 75 or 80% of paths should pass one"): mid-act campfires are
  // added on ways up that pass none until `campPaths` % of them pass one. (Before round 6: every way up passed one.)
  if (m.campPaths) {
    const last = Number(Object.keys(m.fixed).find((f) => m.fixed[f] === "campfire") ?? m.floors);
    const paths = (): MapNode[][] => {
      const out: MapNode[][] = [];
      const go = (n: MapNode, acc: MapNode[]) => (n.floor >= last ? out.push(acc) : n.next.forEach((id) => go(byId.get(id)!, [...acc, byId.get(id)!])));
      for (const n of nodes.filter((x) => x.floor === 1)) go(n, [n]);
      return out;
    };
    for (let tries = 0; tries < 40; tries++) {
      const all = paths();
      const bare = all.filter((p) => !p.some((n) => n.kind === "campfire" && n.floor < last));
      if (all.length - bare.length >= (all.length * m.campPaths) / 100) break;
      const cands = bare[int(rng, bare.length)].filter((n) => n.floor >= m.lateFrom && n.floor < last - 1 && (n.kind === "fight" || n.kind === "event") && ![...parents(n), ...n.next.map((id) => byId.get(id)!)].some((x) => x.kind === "campfire"));
      if (cands.length) cands[int(rng, cands.length)].kind = "campfire";
    }
  }
}

/** A new act: its region, its map and its boss. With `restore`, everyone stands up whole and learns an ability. */
/** An act's map and boss in a region, from the act's own dice: the fork shows each region's boss before the pick. */
export function actRoll(c: Content, run: RogueRun, region: string, act: number): { map: MapNode[]; boss: RogueFightT } {
  const reg = regionOf(c, region);
  const rng = r(run, `act:${act}`);
  const map = makeMap(c, rng);
  return { map, boss: reg.bosses[int(rng, reg.bosses.length)] };
}
function beginAct(c: Content, run: RogueRun, region: string, restore: boolean) {
  run.region = region;
  const reg = regionOf(c, region);
  ({ map: run.map, boss: run.boss } = actRoll(c, run, region, run.act));
  run.at = null;
  run.visited = [];
  run.met = [];
  run.floor = 0;
  // Round 9 (the director's): cooldowns are not reset with HP and MP ("totally arbitrary ... stunting the units at the start").
  if (restore) for (const m of run.roster) (m.missHp = 0), (m.missMp = 0), (m.ko = false);
  // Step 5h round 6: a seat at camp comes with each new act (never fewer than the run already has).
  const by = cfg(c).benchByAct;
  const seats = by?.[Math.min(run.act, by.length) - 1];
  if (seats !== undefined && seats > seatsOf(c, run)) (run.seats = seats), note(run, `Room for one more at camp: ${seats} seats.`);
  note(run, `Act ${run.act}: ${reg.name}. ${run.boss.name} waits at the end.`);
}

/** The rooms the party can go to next. */
export function reachable(run: RogueRun): MapNode[] {
  if (run.at === null) return run.map.filter((n) => n.floor === 1);
  const at = run.map.find((n) => n.id === run.at)!;
  return at.next.map((id) => run.map.find((n) => n.id === id)!);
}

// ─── The foes ───────────────────────────────────────────────────────────────

/** The campaign's knob: HP +k %, damage +k/2 %; a negative k takes k % off HP and k/2 % off damage. */
export const knobFoes = (k: number): FoesT =>
  k > 0 ? { hp: Math.round(k), power: Math.round(k / 2.5) } : k < 0 ? { hp: Math.max(-80, Math.round(k)), power: Math.max(-80, Math.round(k / 2.5)) } : {}; // Step 5g round 6 (the director's): damage k/2.5 (was k/2): a knob's basics one-shot casters less, without cutting its HP.
/** Each pool's reference floor: a fight's own knob is set there, and the act's ramp moves it from there. */
export const refFloors = (c: Content) => cfg(c).map.ref ?? { easy: 1, normal: 5, elite: 6 };
/** The easy pool's last floor: a start's fights (step 5h round 6: floors 1 to 3). */
export const easyTo = (c: Content) => cfg(c).map.easyTo ?? 2;
/**
 * A fight's knob: its own (set by the calibration, npm run rogue:calibrate), the act's offset for its tier and region,
 * the ramp from its pool's reference floor, and the heat.
 */
export function knobFor(c: Content, run: RogueRun, tier: FightTier, floor: number, fight: RogueFightT): number {
  const kn = cfg(c).knobs[Math.min(run.act, cfg(c).knobs.length) - 1];
  const reg = regionOf(c, run.region).knob;
  const heat = run.heat * cfg(c).heat.per;
  const own = fight.knob ?? 0;
  if (tier === "boss") return own + kn.boss + reg.boss + heat;
  const ref = refFloors(c);
  // The act's climb from the pool's reference floor; below it, `early` a floor (round 6: act I's measured against a party a few rooms in).
  const climb = (from: number) => (floor < from ? (kn.early ?? kn.step) : kn.step) * (floor - from);
  if (tier === "elite") return own + kn.elite + reg.elite + climb(ref.elite) + heat;
  return own + kn.mob + reg.mob + climb(floor <= easyTo(c) ? ref.easy : ref.normal) + heat;
}
/** The fight a room holds: from the region's easy pool on the first two floors, then its normal or elite pool, packs growing late. */
export function fightFor(c: Content, run: RogueRun, node: MapNode, tier: FightTier): RogueFightT {
  if (tier === "boss") return run.boss;
  const reg = regionOf(c, run.region);
  const rng = r(run, `enc:${run.act}:${node.id}:${tier}`);
  const all = tier === "elite" ? reg.elite : node.floor <= easyTo(c) ? reg.easy : reg.normal;
  // Not the same fight twice in an act while the pool has others.
  const fresh = all.filter((f) => !run.met.includes(f.id));
  const pool = fresh.length ? fresh : all;
  const base = pool[int(rng, pool.length)];
  const enemies = [...base.enemies];
  if (node.floor >= cfg(c).growFrom && tier !== "elite") {
    const counts = new Map<string, number>();
    for (const e of enemies) counts.set(e, (counts.get(e) ?? 0) + 1);
    // A pack that explodes never grows: two Bomb Bugs are a puzzle, three a wipe.
    // Snakes neither: their Bleed doesn't shrink with the knob, and eight-foe Viper Dens ended runs on act I's floor 7.
    for (const [e, n] of counts) if (n >= 2 && enemies.length < 8 && !c.enemies.get(e)?.statuses?.includes("volatile") && !cfg(c).neverGrow?.includes(e) && next(rng) < 0.5) enemies.splice(enemies.lastIndexOf(e) + 1, 0, e);
  }
  return { ...base, enemies };
}
/** The foes' change for a tier at a knob: the knob's HP and damage, and the tier's shape on top. */
export function foesFor(c: Content, tier: FightTier, k: number): FoesT {
  const f = knobFoes(k);
  const sh = cfg(c).shape?.[tier];
  if (!sh) return f;
  const hp = (f.hp ?? 0) + sh.hp, power = (f.power ?? 0) + sh.power;
  return { ...(hp ? { hp: Math.max(-90, hp) } : {}), ...(power ? { power: Math.max(-90, power) } : {}) };
}
/** The act's boss fight as it will be met: its foes' HP and damage changes (the boss screen shows its moves' sizes). */
export function bossFoes(c: Content, run: RogueRun, at?: { act: number; region: string }): FoesT {
  const r2 = at ? { ...run, ...at, boss: actRoll(c, run, at.region, at.act).boss } : run;
  return foesFor(c, "boss", knobFor(c, r2, "boss", cfg(c).map.floors + 1, r2.boss));
}
function fightSpec(c: Content, run: RogueRun, node: MapNode, tier: FightTier): FightSpec {
  const fight = fightFor(c, run, node, tier);
  run.met.push(fight.id);
  return { node: node.id, tier, fight, foes: foesFor(c, tier, knobFor(c, run, tier, node.floor, fight)), seed: rngFor(run.seed, `fight:${run.act}:${node.id}:${tier}`)[0] };
}

// ─── The stock: the pieces a run can be offered ────────────────────────────

const RARITIES = ["common", "uncommon", "rare", "legendary"] as const;
type Priced = (typeof RARITIES)[number];
/** Step 5j: a mythic is priced as a legendary. */
const priced = (rar: RarityT): Priced => (rar === "mythic" ? "legendary" : rar);
/** A piece's rarity: its own (step 5i); a plain weapon, which has none, is common. */
export const pieceRarity = (c: Content, id: string): RarityT => c.gear.get(id)?.rarity ?? "common";
/** A piece's kind in its slot: a weapon's kind, an armor's type, an offhand's kind; every amulet is one kind. */
export const kindOf = (g: GearT): string | undefined => (g.slot === "weapon" ? g.weapon?.kind : g.slot === "armor" ? g.armor : g.slot === "offhand" ? g.offhand : "amulet");
/** The kinds a class wears in a slot, in its own order. */
export function kindsFor(c: Content, cls: string, slot: Slot): string[] {
  const k = c.classes.get(cls)!;
  return slot === "weapon" ? k.weapons : slot === "armor" ? k.armor : slot === "offhand" ? k.offhands : ["amulet"];
}
type Stock = { all: GearT[]; at: Map<string, string[]>; mythics: GearT[] };
const STOCKS = new WeakMap<Content, Stock>();
/**
 * Step 5i: the stock, every piece a run can be offered: the pack's pieces but the starters, each at its own rarity (a piece without
 * one is common), filed by slot, kind and rarity. The plain weapons stay outside it as the starters; the mythics are apart
 * (`rollMythic`). (A piece's source doesn't matter beyond that: the validator files powerful pieces as `unlock`, ordinary as `drop`.)
 */
export function stockOf(c: Content): Stock {
  let s = STOCKS.get(c);
  if (s) return s;
  const all = c.pack.gear.filter((g) => g.source !== "starter" && !g.mythic && g.rarity !== "mythic");
  const at = new Map<string, string[]>();
  for (const g of all) {
    const key = `${g.slot}|${kindOf(g)}|${g.rarity ?? "common"}`;
    at.set(key, [...(at.get(key) ?? []), g.id]);
  }
  s = { all, at, mythics: c.pack.gear.filter((g) => !!g.mythic) };
  STOCKS.set(c, s);
  return s;
}
const piecesAt = (c: Content, slot: Slot, kind: string, rar: RarityT) => stockOf(c).at.get(`${slot}|${kind}|${rar}`) ?? [];
/** Is there a piece to roll (at any rarity: an offer with none at its own falls to the nearest one that has some)? */
export const canRoll = (c: Content, _rarity?: RarityT) => stockOf(c).all.length > 0;
const rollRarity = (rng: Rng, odds: Partial<Record<RarityT, number>>): RarityT => {
  const ks = Object.keys(odds) as RarityT[];
  let x = next(rng) * ks.reduce((s, k) => s + (odds[k] ?? 0), 0);
  return ks.find((k) => (x -= odds[k] ?? 0) < 0) ?? "common";
};
/** A weighted pick among keys; the first when every weight is zero. */
function weighted<K extends string>(rng: Rng, ks: readonly K[], w: (k: K) => number): K {
  let x = next(rng) * ks.reduce((t, k) => t + w(k), 0);
  return ks.find((k) => (x -= w(k)) < 0) ?? ks[0];
}
/** Can anyone in the roster use this piece? */
export const usable = (c: Content, run: RogueRun, base: string) => run.roster.some((m) => canEquip(c.classes.get(m.cls)!, c.gear.get(base)!));
/** Legendary pieces the run holds, by piece: none is rolled again while others are left. */
const heldLegendaries = (run: RogueRun) => new Set(run.items.filter((it) => it.rarity === "legendary").map((it) => it.base));
/** Rarities from `rar` outward: the nearest first, down before up. */
function nearest(rar: RarityT): Priced[] {
  const i = RARITIES.indexOf(priced(rar));
  return [i, ...[1, 2, 3].flatMap((d) => [i - d, i + d])].filter((j) => j >= 0 && j < RARITIES.length).map((j) => RARITIES[j]);
}

/**
 * Step 5i: an offered piece. The slot first (the config's `slots` weights), then a class: `forCls` if given; for an elite's aimed
 * offer (`forParty`), someone in the party; for an `open` offer (spoils, chests; step 5h), a class not in the roster
 * `spoils.offRoster` % of the time, so a piece can make the run want a class; otherwise someone in the roster. Then a kind that class
 * wears in that slot, the rarity given (rolled by the caller's table), and a piece of that kind and rarity not already in the pick
 * (`taken`, by piece). A legendary the run already has isn't rolled again while others are left; with nothing at the rarity in that
 * kind, the nearest rarity, down then up. Where the content has gaps (a class with nothing in the slot), another class of the same
 * pool, then another slot. Null with an empty stock.
 */
export function rollItem(c: Content, run: RogueRun, rng: Rng, rarity: RarityT, forParty = false, open = false, forCls?: string, taken: readonly string[] = []): Item | null {
  if (!stockOf(c).all.length) return null;
  const w = cfg(c).slots;
  const slot = weighted(rng, SLOT_LIST, (x) => (w ? w[x] : 1));
  const all = c.pack.classes.map((k) => k.id);
  const roster = run.roster.map((m) => m.cls);
  const off = all.filter((id) => !roster.includes(id));
  let pool = forCls ? [forCls] : forParty && run.party.length ? run.party : roster.length ? roster : all;
  if (!forCls && !forParty && open && off.length && next(rng) * 100 < cfg(c).spoils.offRoster) pool = off;
  const kindsWith = (cls: string, sl: Slot) => kindsFor(c, cls, sl).filter((k) => RARITIES.some((rar) => piecesAt(c, sl, k, rar).length));
  for (const sl of [slot, ...SLOT_LIST.filter((x) => x !== slot)]) {
    const can = pool.filter((cls) => kindsWith(cls, sl).length);
    if (!can.length) continue;
    const kinds = kindsWith(can[int(rng, can.length)], sl);
    const base = pieceOf(c, run, rng, sl, kinds[int(rng, kinds.length)], rarity, taken);
    if (base) return newItem(run, base, pieceRarity(c, base));
  }
  return null;
}
/**
 * A piece of a slot and kind at a rarity, or at the nearest rarity that has one (down, then up): never one in `taken`, and not a
 * legendary the run holds while another is left.
 */
function pieceOf(c: Content, run: RogueRun, rng: Rng, slot: Slot, kind: string, rarity: RarityT, taken: readonly string[]): string | null {
  const held = heldLegendaries(run);
  for (const fresh of [true, false])
    for (const rar of nearest(rarity)) {
      const ids = piecesAt(c, slot, kind, rar).filter((id) => !taken.includes(id) && !(fresh && held.has(id)));
      if (ids.length) return ids[int(rng, ids.length)];
    }
  return null;
}
/**
 * Step 5i: a mythic for a boss's boon: one for a party member's class that the run doesn't hold, else for one at camp; none when
 * every roster class's mythic is held (or it has none). It fits its class, in its own slot; a unit wears one at most.
 */
export function rollMythic(c: Content, run: RogueRun, rng: Rng): Item | null {
  const held = new Set(run.items.filter((it) => it.rarity === "mythic").map((it) => it.base));
  const left = (classes: string[]) => stockOf(c).mythics.filter((g) => classes.includes(g.mythic!) && !held.has(g.id));
  const pool = [left(run.party), left(run.roster.map((m) => m.cls))].find((x) => x.length);
  if (!pool) return null;
  return newItem(run, pool[int(rng, pool.length)].id, "mythic");
}

// ─── Offers: gear, tomes, recruits, formations, supplies ───────────────────

function rollTome(c: Content, run: RogueRun, rng: Rng): Offer | null {
  const can = run.roster.filter((m) => unlearned(c, m).length);
  if (!can.length) return null;
  const m = can[int(rng, can.length)];
  const left = unlearned(c, m);
  return { kind: "tome", cls: m.cls, ability: left[int(rng, left.length)] };
}
const roomForRecruit = (c: Content, run: RogueRun) => run.roster.length < cfg(c).party + seatsOf(c, run);
/**
 * A recruit offer: a class not in the roster (a class a bagged legendary is for three times as likely), knowing what it will
 * know when it joins (rolled now, shown on its card; at least `min` abilities). Step 5h: offered with a full roster too, since
 * someone can be sent home to make room.
 */
function rollRecruit(c: Content, run: RogueRun, rng: Rng, taken: string[] = [], min = 1, n?: number): Offer | null {
  const pool = c.pack.classes.map((k) => k.id).filter((id) => !run.roster.some((m) => m.cls === id) && !taken.includes(id));
  if (!pool.length) return null;
  // A class that could wear a legendary piece nobody in the roster can is three times as likely: a piece found for a class
  // the run doesn't have makes that class worth hoping for, and the odds answer (an AI playtester's ask). Step 5i: a class that can
  // wear it (the aims are gone).
  const waiting = bag(run).filter((it) => it.rarity === "legendary" && !run.roster.some((m) => canEquip(c.classes.get(m.cls)!, c.gear.get(it.uid) ?? itemGear(c, it))));
  const weight = (id: string) => (waiting.some((it) => canEquip(c.classes.get(id)!, c.gear.get(it.uid) ?? itemGear(c, it))) ? 3 : 1);
  let x = int(rng, pool.reduce((t, id) => t + weight(id), 0));
  const cls = pool.find((id) => (x -= weight(id)) < 0) ?? pool[pool.length - 1];
  return { kind: "recruit", cls, known: rollKnown(c, rng, cls, n ?? recruitKnown(c, run, rng, min)) };
}
/** `n` recruit offers, all different. */
function rollRecruits(c: Content, run: RogueRun, rng: Rng, n: number, min = 1, known?: number): Offer[] {
  const out: Offer[] = [];
  for (let i = 0; i < n; i++) {
    const o = rollRecruit(c, run, rng, out.map((x) => (x as { cls: string }).cls), min, known);
    if (o) out.push(o);
  }
  return out;
}
/** A formation's rarity: its own (step 5i, `Formation.rarity`); one without is common. */
export const formationRarity = (c: Content, id: string): FormationRarityT => c.formations.get(id)?.rarity ?? "common";
/**
 * A formation offer, of a rarity rolled by the act's odds (or `rarity` if given, or no lower than `min`); with none left of that
 * rarity, the nearest one that has some.
 */
function rollFormation(c: Content, run: RogueRun, rng: Rng, taken: string[] = [], rarity?: RarityT, min?: FormationRarityT): Offer | null {
  const pool = c.pack.formations.map((f) => f.id).filter((id) => !run.formations.includes(id) && !taken.includes(id));
  if (!pool.length) return null;
  const tiers: FormationRarityT[] = ["common", "rare", "legendary"];
  const odds = cfg(c).formationOdds;
  // An event's "uncommon" formation is a common one (formations have no uncommon).
  let want: FormationRarityT | undefined = rarity === "uncommon" ? "common" : rarity === "mythic" ? "legendary" : rarity;
  if (!want && odds) {
    const o = odds[Math.min(run.act, odds.length) - 1];
    const w = tiers.map((t) => (min && tiers.indexOf(t) < tiers.indexOf(min) ? 0 : o[t as "common" | "rare" | "legendary"]));
    let x = next(rng) * w.reduce((a, b) => a + b, 0);
    want = tiers.find((_, i) => (x -= w[i]) < 0) ?? "common";
  }
  const at = (t: FormationRarityT) => pool.filter((id) => formationRarity(c, id) === t);
  // The nearest rarity with something left: down first, then up.
  const i0 = tiers.indexOf(want ?? "common");
  const order = [i0, ...[1, 2].flatMap((d) => [i0 - d, i0 + d])].filter((i) => i >= 0 && i < tiers.length);
  const from = order.map((i) => at(tiers[i])).find((x) => x.length) ?? pool;
  return { kind: "formation", id: from[int(rng, from.length)] };
}
/** `n` formation offers, all different. */
function rollFormations(c: Content, run: RogueRun, rng: Rng, n: number, min?: FormationRarityT): Offer[] {
  const out: Offer[] = [];
  for (let i = 0; i < n; i++) {
    const o = rollFormation(c, run, rng, out.map((x) => (x as { id: string }).id), undefined, min);
    if (o) out.push(o);
  }
  return out;
}
const SUPPLIES: SupplyIdT[] = ["potion", "tonic", "phoenix"];

/**
 * A fight's spoils: a pick of `count`. Step 5h (the director's): most picks are gear (a third of it for classes not in the
 * roster); a share of fights (`mixed`) mixes kinds: one piece, then another kind, then either. No supplies (every won fight
 * already drops one) and no recruits from regular fights (they have their own rooms).
 */
function spoilOffers(c: Content, run: RogueRun, tier: FightTier, node: string): Offer[] {
  const s = cfg(c).spoils[tier === "elite" ? "elite" : "fight"];
  const rng = r(run, `spoils:${run.act}:${node}`);
  const out: Offer[] = [];
  // No two offers of the same piece (step 5i: a piece of that kind and rarity not already in the pick).
  const taken = () => out.flatMap((x) => (x.kind === "gear" || x.kind === "bundle" ? [x.item.base] : []));
  const gear = (): Offer | null => {
    // Round 6: the first `aimed` offers are pieces someone in the party can wear (an elite's pick).
    const aimed = out.length < (s.aimed ?? 0);
    const item = rollItem(c, run, rng, rollRarity(rng, s.rarity), aimed, !aimed, undefined, taken());
    return item && { kind: "gear", item };
  };
  const other = (): Offer | null => {
    const m = s.mix;
    if (!m) return null;
    const kinds = (["tome", "formation", "recruit", "sealed", "bundle"] as const).filter((k) => (m[k] ?? 0) > 0);
    let x = next(rng) * kinds.reduce((t, k) => t + (m[k] ?? 0), 0);
    const k = kinds.find((kk) => (x -= m[kk] ?? 0) < 0) ?? kinds[0];
    // Round 6 (the director's: "an unknown reward, or even bundles"): a sealed piece, rare or better, or a common piece with a supply.
    if (k === "sealed") { const item = rollItem(c, run, rng, next(rng) < 0.25 ? "legendary" : "rare", false, true, undefined, taken()); return item && { kind: "gear", item, sealed: true }; }
    if (k === "bundle") { const item = rollItem(c, run, rng, "common", false, true, undefined, taken()); return item && { kind: "bundle", item, supply: next(rng) < 0.5 ? "potion" : "tonic" }; }
    if (k === "tome") {
      const o = rollTome(c, run, rng);
      return o && !out.some((y) => y.kind === "tome" && y.cls === (o as { cls: string }).cls && y.ability === (o as { ability: string }).ability) ? o : null;
    }
    if (k === "formation") return rollFormation(c, run, rng, out.filter((y) => y.kind === "formation").map((y) => (y as { id: string }).id));
    return rollRecruit(c, run, rng, out.filter((y) => y.kind === "recruit").map((y) => (y as { cls: string }).cls));
  };
  const mixed = !!s.mix && next(rng) * 100 < (s.mixed ?? 0);
  for (let i = 0; i < s.count; i++) {
    if (i < (s.legendaries ?? 0)) {
      const item = rollItem(c, run, rng, "legendary", false, true, undefined, taken());
      if (item) out.push({ kind: "gear", item });
      continue;
    }
    let o: Offer | null = null;
    if (mixed && i > 0 && (i === 1 || next(rng) < 0.5)) o = other();
    else if (!mixed) {
      const x = next(rng) * 100;
      if (x < s.tome) o = rollTome(c, run, rng);
      else if (x < s.tome + s.recruit) o = rollRecruit(c, run, rng, out.filter((y) => y.kind === "recruit").map((y) => (y as { cls: string }).cls));
      else if (x < s.tome + s.recruit + s.supply) o = { kind: "supply", id: SUPPLIES[int(rng, SUPPLIES.length)] };
      if (o?.kind === "tome" && out.some((y) => y.kind === "tome" && y.cls === (o as { cls: string }).cls && y.ability === (o as { ability: string }).ability)) o = null;
    }
    // Step 5i (the retire share): with no piece to roll, a pick that would be gear is nothing.
    const x = o ?? gear();
    if (x) out.push(x);
  }
  return out;
}
/**
 * The boss's boon: a pick of `count` from a legendary piece, a formation (rare or better), a recruit (knowing two or three)
 * and, step 5h, a seat at camp while there's one to win; with four on offer, one of them (at random) isn't. Step 5i: the boons
 * that open the acts in `boon.mythic` offer a mythic in the legendary piece's place, for a roster member's class (the party first)
 * that the run doesn't hold, while one is left; it always stays in the pick.
 */
function boonOffers(c: Content, run: RogueRun): Offer[] {
  const rng = r(run, `boon:${run.act}`);
  // Step 5i (the retire share): with no legendary to roll, its place is the next option's, or nothing.
  const taken: string[] = [];
  const legend = (): Offer | null => { const item = rollItem(c, run, rng, "legendary", false, false, undefined, taken); if (item) taken.push(item.base); return item && { kind: "gear", item }; };
  const mythic = (cfg(c).boon.mythic ?? []).includes(run.act + 1) ? rollMythic(c, run, rng) : null;
  const first: Offer | null = mythic ? { kind: "gear", item: mythic } : legend();
  const out: Offer[] = [first, rollFormation(c, run, rng, [], undefined, "rare") ?? legend(), rollRecruit(c, run, rng, [], 2) ?? legend()].filter((o): o is Offer => !!o);
  if (cfg(c).boon.seat && seatsOf(c, run) < (cfg(c).benchMax ?? cfg(c).bench)) out.push({ kind: "seat" });
  const n = cfg(c).boon.count;
  if (out.length <= n) return out;
  return mythic ? [out[0], ...shuffle(rng, out.slice(1)).slice(0, n - 1)] : shuffle(rng, out).slice(0, n);
}
export function priceOf(c: Content, o: Offer): number {
  const p = cfg(c).prices;
  if (o.kind === "gear" || o.kind === "bundle") return p[priced(o.item.rarity)];
  if (o.kind === "recruit") return p.recruit;
  if (o.kind === "formation") return p.formation;
  if (o.kind === "supply") return p.supply[o.id] ?? 40;
  if (o.kind === "seat") return p.recruit;
  return p.learn;
}
type ShopPending = Extract<Pending, { kind: "shop" }>;
/** A shop's training: its price, dearer by the step for each bought this visit (or once each a visit, with no step). */
export const trainPrice = (c: Content, p: ShopPending, verb: "learn" | "upgrade") => cfg(c).prices[verb] + (cfg(c).prices.trainStep ?? 0) * (p.trained ?? 0);
function trained(c: Content, p: ShopPending, verb: "learn" | "upgrade") {
  p.trained = (p.trained ?? 0) + 1;
  if (cfg(c).prices.trainStep === undefined) p[verb] = false;
}
export const sellPrice = (c: Content, it: Item) => Math.floor((cfg(c).prices[priced(it.rarity)] * cfg(c).prices.sell) / 100);
function shopStock(c: Content, run: RogueRun, node: string): ShopSlot[] {
  const s = cfg(c).shop;
  const rng = r(run, `shop:${run.act}:${node}`);
  const out: Offer[] = [];
  const count = (rar: Priced) => (rar === "legendary" && s.legendaryByAct ? s.legendaryByAct[Math.min(run.act, s.legendaryByAct.length) - 1] : s.gear[rar]);
  // Step 5i: no piece twice on the shelf.
  const taken: string[] = [];
  for (const rar of RARITIES) for (let i = 0; i < count(rar); i++) { const item = rollItem(c, run, rng, rar, false, false, undefined, taken); if (item) (taken.push(item.base), out.push({ kind: "gear", item })); }
  const recs: string[] = [];
  for (let i = 0; i < s.recruits; i++) {
    const o = rollRecruit(c, run, rng, recs);
    if (o?.kind === "recruit") (recs.push(o.cls), out.push(o));
  }
  const fms: string[] = [];
  for (let i = 0; i < s.formations; i++) {
    const o = rollFormation(c, run, rng, fms);
    if (o?.kind === "formation") (fms.push(o.id), out.push(o));
  }
  for (const id of shuffle(rng, SUPPLIES).slice(0, s.supplies)) out.push({ kind: "supply", id });
  return out.map((offer) => ({ offer, price: priceOf(c, offer), sold: false }));
}

/** Takes an offer: gear to the bag, a tome taught, a recruit in, a formation owned, a supply carried. False if it can't be taken. */
export function take(c: Content, run: RogueRun, o: Offer): boolean {
  if (o.kind === "gear" || o.kind === "bundle") {
    run.items.push(o.item);
    registerGear(c, run);
    if (o.kind === "bundle" && bagRoom(c, run, o.supply)) run.supplies.push(o.supply);
    return true;
  }
  if (o.kind === "tome") return learn(c, run, o.cls, o.ability);
  if (o.kind === "recruit") return recruit(c, run, o.cls, 100, o.known, o.item);
  if (o.kind === "seat") {
    if (seatsOf(c, run) >= (cfg(c).benchMax ?? cfg(c).bench)) return false;
    run.seats = seatsOf(c, run) + 1;
    return true;
  }
  if (o.kind === "formation") {
    if (run.formations.includes(o.id)) return false;
    run.formations.push(o.id);
    return true;
  }
  if (!bagRoom(c, run, o.id)) return false;
  run.supplies.push(o.id);
  return true;
}
export function canTake(c: Content, run: RogueRun, o: Offer): boolean {
  if (o.kind === "tome") { const m = run.roster.find((x) => x.cls === o.cls); return !!m && unlearned(c, m).includes(o.ability); }
  if (o.kind === "recruit") return roomForRecruit(c, run) && !run.roster.some((m) => m.cls === o.cls);
  if (o.kind === "formation") return !run.formations.includes(o.id);
  if (o.kind === "supply") return bagRoom(c, run, o.id);
  if (o.kind === "seat") return seatsOf(c, run) < (cfg(c).benchMax ?? cfg(c).bench);
  return true;
}

// ─── Abilities: learning and training ──────────────────────────────────────

/**
 * Step 5i: a training. Learning an ability; or, on a known ability or the class's passive, its power step or one of its two
 * versions (from the pack's upgrades). The power step and a version are two trainings, taken in either order; each once.
 */
export type Training = { verb: "learn" | "power" | "version"; cls: string; id: string; version?: Version };
/** A training as an option's id: `learn:<cls>:<ability>`, `power:<cls>:<id>`, `version:<cls>:<id>:a` (or `:b`). */
export const trainingId = (t: Training) => `${t.verb}:${t.cls}:${t.id}${t.version ? `:${t.version}` : ""}`;
/** An option's id as a training, or null when it isn't one. */
export function parseTraining(s: string): Training | null {
  const [verb, cls, id, v] = s.split(":");
  if (!cls || !id || !(verb === "learn" || verb === "power" || verb === "version")) return null;
  if (verb === "version") return v === "a" || v === "b" ? { verb, cls, id, version: v } : null;
  return { verb, cls, id };
}
const UPGRADES = new WeakMap<Content, Map<string, UpgradeT>>();
/** The upgrade of an ability or a passive status, by its id (the pack's `upgrades`). */
export function upgradeOf(c: Content, id: string): UpgradeT | undefined {
  let m = UPGRADES.get(c);
  if (!m) UPGRADES.set(c, (m = new Map((c.pack.upgrades ?? []).map((u) => [u.id, u]))));
  return m.get(id);
}
/** The status id of a class's passive that can be trained (its upgrade's id), if it has one. */
export const passiveOf = (c: Content, cls: string): string | undefined => (c.pack.upgrades ?? []).find((u) => u.class === cls && u.kind === "passive")?.id;
/** The form an ability or the passive plays as for this member: its own id untrained, else `<id>__p`, `__a`, `__b`, `__ap` or `__bp`. */
export function formOf(m: Member, id: string): string {
  const t = m.trained?.[id];
  if (!t?.power && !t?.version) return id;
  return formId(id, (t.version ? (t.power ? `${t.version}p` : t.version) : "p") as UpgradeFormT);
}
/** Abilities a member hasn't learned, in its class's order. */
export const unlearned = (c: Content, m: Member) => c.classes.get(m.cls)!.abilities.filter((a) => !m.known.includes(a));
/** What a member can be trained on beyond learning: its known abilities with an upgrade, in its class's order, and its passive. */
export function trainable(c: Content, m: Member): string[] {
  const pid = passiveOf(c, m.cls);
  return [...c.classes.get(m.cls)!.abilities.filter((a) => m.known.includes(a) && upgradeOf(c, a)?.class === m.cls), ...(pid ? [pid] : [])];
}
/** Every training a member can take now: learning first, then each ability's and the passive's power step and versions not yet taken. */
export function trainingsFor(c: Content, run: RogueRun, cls: string): Training[] {
  const m = member(run, cls);
  if (!m) return [];
  const out: Training[] = unlearned(c, m).map((id) => ({ verb: "learn" as const, cls, id }));
  for (const id of trainable(c, m)) {
    const t = m.trained?.[id] ?? {};
    if (!t.power) out.push({ verb: "power", cls, id });
    if (!t.version) out.push({ verb: "version", cls, id, version: "a" }, { verb: "version", cls, id, version: "b" });
  }
  return out;
}
/** A training's card: what it's on (an ability's or the passive's name) and what it does, in the content's words. */
export function trainingText(c: Content, t: Training): { name: string; what: string; text: string } {
  const u = upgradeOf(c, t.id);
  const name = c.abilities.get(t.id)?.name ?? (u?.kind === "passive" ? c.classes.get(t.cls)?.passive?.name : undefined) ?? c.statuses.get(t.id)?.name ?? t.id;
  if (t.verb === "learn") return { name, what: "learn", text: c.abilities.get(t.id)?.text ?? "" };
  if (t.verb === "power") return { name, what: "power step", text: u?.power ?? "" };
  const v = u?.[t.version!];
  return { name, what: v?.name ?? `version ${t.version!.toUpperCase()}`, text: v?.text ?? "" };
}

export function learn(c: Content, run: RogueRun, cls: string, ability: string): boolean {
  const m = run.roster.find((x) => x.cls === cls);
  if (!m || !unlearned(c, m).includes(ability)) return false;
  m.known.push(ability);
  m.order.push(ability);
  // Step 5h (the director's): an ability just learned starts half charged (a Raise learned after a knockout came round too late for the boss).
  m.cooldowns = { ...(m.cooldowns ?? {}), [ability]: freshCooldown(c, ability) };
  note(run, `${c.classes.get(cls)!.name} learns ${c.abilities.get(ability)!.name}.`);
  return true;
}
/**
 * Step 5i: takes a training (a training or its id). Learning as `learn`; a power step or a version on a known ability with an
 * upgrade, or on the passive, each once. The member keeps base ids: the fight gets the form (`formOf`), and a carried cooldown,
 * kept by base id, follows its ability to the form. False when it can't be taken.
 */
export function train(c: Content, run: RogueRun, t: Training | string): boolean {
  const x = typeof t === "string" ? parseTraining(t) : t;
  if (!x) return false;
  if (x.verb === "learn") return learn(c, run, x.cls, x.id);
  const m = run.roster.find((y) => y.cls === x.cls);
  if (!m || !trainable(c, m).includes(x.id)) return false;
  const was = m.trained?.[x.id] ?? {};
  if (x.verb === "power" ? was.power : was.version) return false;
  m.trained = { ...(m.trained ?? {}), [x.id]: x.verb === "power" ? { ...was, power: true } : { ...was, version: x.version } };
  const w = trainingText(c, x);
  note(run, `${c.classes.get(x.cls)!.name}'s ${w.name}: ${w.what}.`);
  return true;
}

// ─── Free actions between rooms: gear, formation, seats, order, supplies, the camp ─────

export function equip(c: Content, run: RogueRun, cls: string, slot: Slot, uid: string | null): boolean {
  if (!member(run, cls)) return false;
  const old = uid ? wearer(run, uid) : null;
  return holdCurrent(c, run, [cls, ...(old && old !== cls ? [old] : [])], () => equipNow(c, run, cls, slot, uid));
}
function equipNow(c: Content, run: RogueRun, cls: string, slot: Slot, uid: string | null): boolean {
  const m = member(run, cls);
  if (uid === null) {
    if (slot === "weapon") return false;
    delete m.gear[slot];
    return true;
  }
  const it = itemOf(run, uid);
  if (!it) return false;
  const g = c.gear.get(uid) ?? itemGear(c, it);
  if (g.slot !== slot || !canEquip(c.classes.get(cls)!, g)) return false;
  // Step 5j: an offhand needs a free hand (the interface shows the slot locked under a two-handed weapon).
  if (slot === "offhand" && twoHanded(c, m)) return false;
  const old = wearer(run, uid);
  if (old && old !== cls) {
    // Taken from another member, who gets this member's old piece if it fits them (a weapon slot is never left empty).
    const om = member(run, old);
    const was = m.gear[slot];
    const fits = !!was && canEquip(c.classes.get(old)!, c.gear.get(was)!);
    if (slot === "weapon" && !fits) return false;
    if (fits) om.gear[slot] = was;
    else delete om.gear[slot];
    settle(c, om);
  }
  // Step 5j: a unit wears one mythic at most; a new one sends the old one to the bag.
  if (g.mythic) for (const s of SLOT_LIST) if (s !== slot && m.gear[s] && c.gear.get(m.gear[s]!)?.mythic) delete m.gear[s];
  m.gear[slot] = uid;
  settle(c, m);
  return true;
}
/** Step 5j: does this member hold a two-handed weapon? */
export const twoHanded = (c: Content, m: Member) => !!m.gear.weapon && handsOf(c.pack, c.gear.get(m.gear.weapon)) === 2;
/** Step 5j: a two-handed weapon empties the offhand, which goes back to the bag. */
function settle(c: Content, m: Member) {
  if (m.gear.offhand && twoHanded(c, m)) delete m.gear.offhand;
}
/** A member's stats as they stand with its gear and seat. */
function statsOf(c: Content, run: RogueRun, cls: string): Record<string, number> {
  registerGear(c, run);
  const inParty = run.party.includes(cls);
  const p = inParty ? partyOf(c, run) : { formation: "neutral", units: [{ class: cls, position: c.formations.get("neutral")!.positions[0].id, abilities: [], gear: Object.fromEntries(Object.entries(member(run, cls).gear)) as Record<string, string> }] };
  const units = combat.party(c, { dungeon: FIGHT_DUNGEON, party: p, seed: 0 }) as EngineMember[];
  return units.find((u) => u.ref === cls)!.stats;
}
/** A member's max HP or MP as it stands with its gear and seat. */
export const maxOf = (c: Content, run: RogueRun, cls: string, stat: "max_hp" | "max_mp"): number => statsOf(c, run, cls)[stat];
/**
 * Gear, seats and formations change max HP and MP, never current HP and MP: what a member has stays (capped at the new
 * max). A +HP piece raises the ceiling, it doesn't heal; taking it off and putting it back is never a refill; and a piece
 * moved off a fallen member brings nobody HP. (Before: what was missing stayed missing, so current moved with the max,
 * and four AI playtesters used HP and MP gear as heals.)
 */
function holdCurrent(c: Content, run: RogueRun, who: string[], fn: () => boolean): boolean {
  const st0 = statsAll(c, run, who);
  const before = new Map(who.map((cls) => {
    const st = st0.get(cls)!, m = member(run, cls);
    return [cls, { hp: m.ko ? 0 : Math.max(1, st.max_hp - m.missHp), mp: Math.max(0, st.max_mp - m.missMp) }] as const;
  }));
  if (!fn()) return false;
  const st1 = statsAll(c, run, who.filter((cls) => run.roster.some((x) => x.cls === cls)));
  for (const [cls, b] of before) {
    const m = run.roster.find((x) => x.cls === cls);
    const st = st1.get(cls);
    if (!m || !st) continue;
    m.missHp = m.ko ? st.max_hp : st.max_hp - Math.min(b.hp, st.max_hp);
    m.missMp = st.max_mp - Math.min(b.mp, st.max_mp);
  }
  return true;
}
/** Stats for several members at once: the party in one go (its seats), each one at camp on its own. */
function statsAll(c: Content, run: RogueRun, who: string[]): Map<string, Record<string, number>> {
  registerGear(c, run);
  const out = new Map<string, Record<string, number>>();
  if (who.some((cls) => run.party.includes(cls))) for (const u of combat.party(c, { dungeon: FIGHT_DUNGEON, party: partyOf(c, run), seed: 0 }) as EngineMember[]) if (who.includes(u.ref)) out.set(u.ref, u.stats);
  for (const cls of who) if (!out.has(cls)) out.set(cls, statsOf(c, run, cls));
  return out;
}
export function setFormation(c: Content, run: RogueRun, id: string): boolean {
  if (!run.formations.includes(id)) return false;
  if (run.formation === id) return true;
  return holdCurrent(c, run, [...run.party], () => ((run.formation = id), true));
}
/** Puts the party in this seat order (the same classes). */
export function seat(c: Content, run: RogueRun, order: string[]): boolean {
  if (order.length !== run.party.length || !order.every((x) => run.party.includes(x))) return false;
  if (order.every((x, i) => run.party[i] === x)) return true;
  return holdCurrent(c, run, [...run.party], () => ((run.party = [...order]), true));
}
/** An ability order: some or all of what the member knows, each once. What's left out isn't brought to fights. */
export function setOrder(run: RogueRun, cls: string, order: string[]): boolean {
  const m = member(run, cls);
  if (!m || new Set(order).size !== order.length || !order.every((a) => m.known.includes(a))) return false;
  m.order = [...order];
  return true;
}
/**
 * Step 5h (the director's): any time outside a fight, one of the party and one at camp trade places; a party member steps back
 * with nobody to replace it (while someone stays); or one at camp fills an empty seat. (Before: only at a campfire, with two
 * exceptions for the fallen.)
 */
export function swap(c: Content, run: RogueRun, out: string, into: string | null): boolean {
  // Seats change stats, so whoever moves keeps the HP and MP it has.
  return holdCurrent(c, run, run.roster.map((m) => m.cls), () => swapNow(c, run, out, into));
}
function swapNow(c: Content, run: RogueRun, out: string, into: string | null): boolean {
  if (!betweenRooms(run)) return false;
  const i = run.party.indexOf(out);
  if (i < 0) {
    // One at camp into an empty seat.
    if (into === null && bench(run).includes(out) && run.party.length < cfg(c).party) return run.party.push(out), true;
    return false;
  }
  if (into === null) {
    if (run.party.length <= 1) return false;
    run.party.splice(i, 1);
    return true;
  }
  if (!bench(run).includes(into)) return false;
  run.party[i] = into;
  return true;
}
/** Any time outside a fight: sends a member at camp home for good, to make room (never the leader). Its gear stays in the bag. */
export function dismiss(c: Content, run: RogueRun, cls: string): boolean {
  if (!betweenRooms(run) || run.party.includes(cls) || cls === run.leader) return false;
  const m = run.roster.find((x) => x.cls === cls);
  if (!m) return false;
  m.gear = {};
  run.roster = run.roster.filter((x) => x.cls !== cls);
  note(run, `The ${c.classes.get(cls)!.name} goes home.`);
  return true;
}
/** Step 5h: a piece nobody wears can be dropped from the bag any time outside a fight (more loot, and the bag stays readable). */
export function discard(run: RogueRun, uid: string): boolean {
  if (!betweenRooms(run) || wearer(run, uid)) return false;
  const n = run.items.length;
  run.items = run.items.filter((x) => x.uid !== uid);
  return run.items.length < n;
}
export function useSupply(c: Content, run: RogueRun, id: SupplyIdT, target?: string): boolean {
  const i = run.supplies.indexOf(id);
  if (i < 0 || !betweenRooms(run)) return false;
  const s = cfg(c).supplies;
  if (id === "phoenix") {
    const m = run.roster.find((x) => x.cls === target && x.ko) ?? run.roster.find((x) => x.ko && run.party.includes(x.cls));
    if (!m) return false;
    m.ko = false;
    m.missHp = Math.floor((maxOf(c, run, m.cls, "max_hp") * (100 - s.phoenix.revive)) / 100);
  } else {
    // Step 5g (the director's): a potion or a tonic goes to one unit: the one named, else the party member with the least share left.
    const standing = run.party.map((cls) => member(run, cls)).filter((m) => !m.ko);
    const stat = id === "potion" ? "max_hp" : "max_mp";
    const pool = standing.filter((m) => maxOf(c, run, m.cls, stat) > 0);
    const m = pool.find((x) => x.cls === target) ?? pool.sort((a, b) => (a[id === "potion" ? "missHp" : "missMp"] / maxOf(c, run, a.cls, stat)) - (b[id === "potion" ? "missHp" : "missMp"] / maxOf(c, run, b.cls, stat))).at(-1);
    if (!m) return false;
    if (id === "potion") m.missHp = Math.max(0, m.missHp - Math.floor((healMax(c, run, m, "max_hp") * s.potion.hp) / 100));
    else m.missMp = Math.max(0, m.missMp - Math.floor((healMax(c, run, m, "max_mp") * s.tonic.mp) / 100));
  }
  run.supplies.splice(i, 1);
  return true;
}
/** Between rooms, and before a fight has begun (its foes are shown, so the party can be prepared for them). */
const betweenRooms = (run: RogueRun) => !["over", "draft"].includes(run.pending.kind) && !(run.pending.kind === "fight" && run.pending.begun);
export const canManage = betweenRooms;

/**
 * The max a heal by share counts from: the max now, but no more than it was when the last fight ended. Putting on a
 * +HP piece to REST or drink a tonic, then taking it off, healed the piece's share for free (an AI playtester's exploit).
 */
function healMax(c: Content, run: RogueRun, m: Member, stat: "max_hp" | "max_mp"): number {
  const now = maxOf(c, run, m.cls, stat);
  const last = m.lastMax?.[stat === "max_hp" ? "hp" : "mp"];
  return last === undefined ? now : Math.min(now, last);
}
function heal(c: Content, run: RogueRun, who: Member[], hpPct: number, mpPct: number) {
  for (const m of who) {
    if (m.ko) continue;
    if (hpPct) m.missHp = Math.max(0, Math.min(maxOf(c, run, m.cls, "max_hp") - 1, m.missHp - Math.floor((healMax(c, run, m, "max_hp") * hpPct) / 100)));
    if (mpPct) m.missMp = Math.max(0, Math.min(maxOf(c, run, m.cls, "max_mp"), m.missMp - Math.floor((healMax(c, run, m, "max_mp") * mpPct) / 100)));
  }
}
function gainGold(run: RogueRun, n: number) {
  run.gold = Math.max(0, run.gold + n);
  if (n > 0) run.stats.gold += n;
}

// ─── Decisions ──────────────────────────────────────────────────────────────

/** The options of the pending decision, as ids. Free actions (gear, formation, seats, supplies, swaps) aren't among them. */
export function options(c: Content, run: RogueRun): string[] {
  const p = run.pending;
  switch (p.kind) {
    case "draft": return p.offers;
    case "map": return reachable(run).map((n) => n.id);
    case "fight": return [];
    case "drop": return p.options;
    case "spoils": return [...p.offers.map((o, i) => (canTake(c, run, o) ? `take:${i}` : "")).filter(Boolean), "skip"];
    case "boon": return [...p.offers.map((o, i) => (canTake(c, run, o) ? `take:${i}` : "")).filter(Boolean), "skip"];
    case "trophy": return [...p.offers.map((o, i) => (canTake(c, run, o) ? `take:${i}` : "")).filter(Boolean), "skip"];
    case "captive": return [canTake(c, run, p.offer) ? "take" : "", trainOptions(c, run, []).length ? "lesson" : "", "leave"].filter(Boolean);
    case "muster": return [...p.offers.map((o, i) => (canTake(c, run, o) ? `take:${i}` : "")).filter(Boolean), "skip"];
    case "drill": return [...p.offers.map((o, i) => (canTake(c, run, o) ? `take:${i}` : "")).filter(Boolean), ...(trainOptions(c, run, []).length ? ["train"] : []), "skip"];
    case "train": return [...trainOptions(c, run, p.done), p.back && !p.done.length ? "back" : "done"];
    case "treasure": return [canTake(c, run, p.offer) ? "take" : "", "leave"].filter(Boolean);
    case "shop": {
      const out = p.stock.map((s, i) => (!s.sold && s.price <= run.gold && canTake(c, run, s.offer) ? `buy:${i}` : "")).filter(Boolean);
      if (p.learn && run.gold >= trainPrice(c, p, "learn")) out.push(...learnOptions(c, run).map((o) => `learn:${o}`));
      // Step 5i: a power step or a version, at the upgrade price.
      if (p.upgrade && run.gold >= trainPrice(c, p, "upgrade")) out.push(...improveOptions(c, run));
      out.push(...bag(run).map((it) => `sell:${it.uid}`));
      return [...out, "leave"];
    }
    case "campfire": {
      // Once its pick is made, the campfire waits for LEAVE: swaps stay open until then (a playtester raised a member at
      // camp and found the swap window had closed with the pick).
      // Step 5h: TRAIN teaches or upgrades two members (the nested training screen); a stranger at the fire can be taken in
      // whatever the pick, and doesn't use it.
      const stranger = p.stranger ? [canTake(c, run, p.stranger) ? "recruit" : "", cfg(c).campfire.auto && trainOptions(c, run, []).length ? "lesson" : ""].filter(Boolean) : [];
      if (p.used) return [...stranger, "leave"];
      // Round 6: with the free share on arrival, one pick of two: REST or TRAIN.
      if (cfg(c).campfire.auto) return ["rest", ...(trainOptions(c, run, []).length ? ["train"] : []), ...stranger];
      const out = ["rest", "focus"];
      for (const m of run.roster) if (m.ko) out.push(`raise:${m.cls}`);
      if (trainOptions(c, run, []).length) out.push("train");
      return [...out, ...stranger];
    }
    case "event": {
      const ok = eventView(c, p).options.filter((o) => (o.gold ?? 0) <= run.gold && o.do.every((op) => possible(c, run, op))).map((o) => o.id);
      // Nothing it offers can happen now: the party walks on.
      return ok.length ? ok : ["walk_on"];
    }
    case "choose":
      if (p.what === "learn") return learnOptions(c, run);
      if (p.what === "upgrade") return improveOptions(c, run);
      return temperable(c, run, p.from).map((it) => it.uid);
    case "levelup":
      // Learn one more, or train one known (step 5i: a power step or a version): breadth or depth, a real choice even with one
      // ability left to learn. Or gold instead: a level-up late in a run can have one thing left, which was no choice (three playtesters).
      return [...trainingsFor(c, run, p.queue[0]).map(trainingId), ...(cfg(c).levelGold ? ["gold"] : [])];
    case "region": return p.options;
    case "over": return [];
  }
}
/** Why an event's option can't be picked now, in a player's words (empty when it can). */
export function whyNot(c: Content, run: RogueRun, opt: RogueEventT["options"][number]): string {
  if ((opt.gold ?? 0) > run.gold) return "not enough gold";
  const op = opt.do.find((x) => !possible(c, run, x));
  if (!op) return "";
  return op.op === "recruit" || op.op === "muster" ? "no room at camp" : op.op === "seat" ? "the camp is as big as it gets" : op.op === "train" ? "nothing left to train" : op.op === "trade" ? "nobody to trade" : op.op === "learn" ? "nothing left to learn" : op.op === "upgrade" ? "nothing left to train" : op.op === "temper" ? "no piece it can work on" : op.op === "formation" ? "every formation owned" : op.op === "gear" ? "nothing to find" : "can't happen now";
}
/**
 * Pieces a temper can take: of the rarities given (default common and uncommon), where a piece of the next rarity of its slot and
 * kind exists that its wearer can wear (step 5i; a rare one becomes a legendary of its kind, the Master Smith's reforge).
 */
function temperable(c: Content, run: RogueRun, from: readonly RarityT[] = ["common", "uncommon"]): Item[] {
  registerGear(c, run);
  return run.items.filter((it) => from.includes(it.rarity) && !!temperInto(c, run, it, null));
}
/**
 * Step 5i: the piece a temper makes of an item: one of the next rarity in the same slot and kind, that its wearer (or, in the bag,
 * someone in the roster who can wear this one) can wear; a legendary the run holds only when no other is left. Null when there's
 * none (a legendary or a mythic has no next rarity). Without dice, the first.
 */
export function temperInto(c: Content, run: RogueRun, it: Item, rng: Rng | null): string | null {
  const up = RARITIES[RARITIES.indexOf(priced(it.rarity)) + 1];
  const g = c.gear.get(it.base);
  const kind = g && kindOf(g);
  if (!up || it.rarity === "mythic" || !g || !kind) return null;
  const who = wearer(run, it.uid);
  const users = (who ? [who] : run.roster.map((m) => m.cls).filter((cls) => canEquip(c.classes.get(cls)!, g))).map((cls) => c.classes.get(cls)!);
  const fits = piecesAt(c, g.slot as Slot, kind, up).filter((id) => users.some((k) => canEquip(k, c.gear.get(id)!)));
  const held = heldLegendaries(run);
  const fresh = fits.filter((id) => !held.has(id));
  const pool = fresh.length ? fresh : fits;
  if (!pool.length) return null;
  return rng ? pool[int(rng, pool.length)] : pool[0];
}
/** Can an event's verb happen now? A recruit needs room at camp, learning something to learn, tempering a piece to temper. */
function possible(c: Content, run: RogueRun, op: EventOpT): boolean {
  if (op.op === "recruit" || op.op === "muster") return roomForRecruit(c, run);
  if (op.op === "seat") return seatsOf(c, run) < (cfg(c).benchMax ?? cfg(c).bench);
  if (op.op === "train") return trainOptions(c, run, []).length > 0;
  if (op.op === "trade") return run.roster.some((m) => m.cls !== run.leader);
  if (op.op === "learn") return learnOptions(c, run).length > 0;
  if (op.op === "upgrade") return improveOptions(c, run).length > 0;
  if (op.op === "temper") return temperable(c, run, op.from).length > 0;
  // Step 5i (the retire share): a piece needs a piece of its rarity to find.
  if (op.op === "gear") return canRoll(c, op.rarity);
  if (op.op === "revive") return true;
  if (op.op === "formation") return c.pack.formations.some((f) => !run.formations.includes(f.id));
  return true;
}
/** `cls:ability` for every ability someone in the roster can learn. */
export const learnOptions = (c: Content, run: RogueRun) => run.roster.flatMap((m) => unlearned(c, m).map((a) => `${m.cls}:${a}`));
/** Step 5i: every power step and version someone in the roster can take, as training ids (`power:…`, `version:…:a`). */
export const improveOptions = (c: Content, run: RogueRun) => run.roster.flatMap((m) => trainingsFor(c, run, m.cls).filter((t) => t.verb !== "learn").map(trainingId));
export const eventOf = (c: Content, id: string): RogueEventT => rogue(c).events.find((e) => e.id === id)!;
/** An event as it's met: its version's text and options (step 5h), else its own. */
export function eventView(c: Content, p: { id: string; v?: number }): { name: string; text: string; options: RogueEventT["options"] } {
  const ev = eventOf(c, p.id);
  const v = p.v !== undefined ? ev.variants?.[p.v] : undefined;
  return { name: ev.name, text: v?.text ?? ev.text, options: v?.options ?? ev.options };
}
/**
 * Step 5h: what a training opportunity can do, for every member not yet trained in it (the nested screen groups them by member,
 * then ability). Step 5i: as training ids: `learn:cls:ability`, `power:cls:id`, `version:cls:id:a` or `:b` (`parseTraining`).
 */
export const trainOptions = (c: Content, run: RogueRun, done: string[]) =>
  run.roster.filter((m) => !done.includes(m.cls)).flatMap((m) => trainingsFor(c, run, m.cls).map(trainingId));

/** Answers the pending decision. Throws on an option that isn't one. */
export function choose(c: Content, run: RogueRun, pick: string) {
  const opts = options(c, run);
  if (!opts.includes(pick)) throw new Error(`'${pick}' isn't an option at ${run.pending.kind}: ${opts.join(", ")}`);
  const p = run.pending;
  const tally = pickKind(run, pick);
  run.stats.picks[tally] = (run.stats.picks[tally] ?? 0) + 1;
  switch (p.kind) {
    case "draft": {
      recruit(c, run, pick, 100, p.known?.[pick] ?? rollKnown(c, r(run, `draft-known:${pick}`), pick, 1));
      note(run, `${c.classes.get(pick)!.name} joins.`);
      run.pending = p.left > 1 ? draftPending(c, run, cfg(c).start.picks - p.left + 2, p.left - 1) : { kind: "map" };
      return;
    }
    case "map": return enter(c, run, pick);
    case "drop": {
      run.supplies.push(pick as SupplyIdT);
      note(run, `Took ${supplyName(pick as SupplyIdT)}.`);
      run.pending = p.then;
      return;
    }
    case "spoils":
    case "boon": {
      if (p.kind === "spoils") gainGold(run, p.gold);
      if (pick !== "skip") {
        const o = p.offers[Number(pick.split(":")[1])];
        take(c, run, o);
        note(run, `Took ${offerText(c, run, o)}.`);
      }
      if (p.kind === "boon") return nextAct(c, run);
      run.pending = p.then ?? { kind: "map" };
      return;
    }
    case "captive": {
      const o = p.offer as Extract<Offer, { kind: "recruit" }>;
      if (pick === "take") (recruit(c, run, o.cls, cfg(c).captive?.hp ?? 100, o.known), note(run, `A captive ${c.classes.get(o.cls)!.name} joins.`));
      else if (pick === "lesson") return void (run.pending = { kind: "train", left: cfg(c).lesson ?? 3, done: [], then: p.then, why: "captive", back: p });
      run.pending = p.then;
      return;
    }
    case "trophy": {
      if (pick !== "skip") {
        const o = p.offers[Number(pick.split(":")[1])];
        take(c, run, o);
        note(run, `Took ${offerText(c, run, o)}.`);
      }
      run.pending = p.then;
      return;
    }
    case "muster": {
      if (pick !== "skip") {
        const o = p.offers[Number(pick.split(":")[1])];
        take(c, run, o);
        note(run, `${offerText(c, run, o)} joins.`);
      }
      run.pending = p.then ?? { kind: "map" };
      return;
    }
    case "drill": {
      if (pick === "train") return void (run.pending = { kind: "train", left: cfg(c).drill?.train ?? 3, done: [], then: { kind: "map" }, why: "drill", back: p });
      if (pick !== "skip") {
        const o = p.offers[Number(pick.split(":")[1])];
        take(c, run, o);
        note(run, `Took ${offerText(c, run, o)}.`);
      }
      run.pending = { kind: "map" };
      return;
    }
    case "train": {
      if (pick === "back") return void (run.pending = p.back!);
      // A campfire's pick is spent with the first member trained, not on opening the screen (round 6); a stranger's lesson spends the stranger.
      if (pick !== "done" && !p.done.length && p.then.kind === "campfire") {
        if (p.why === "stranger") (delete p.then.stranger, note(run, "The stranger teaches, and moves on."));
        else if (!p.then.used) (note(run, "Trained."), campUsed(c, run, p.then));
      }
      delete p.back;
      if (pick !== "done") {
        const t = parseTraining(pick)!;
        train(c, run, t);
        p.done.push(t.cls);
        p.left--;
      }
      if (pick === "done" || p.left <= 0 || !trainOptions(c, run, p.done).length) run.pending = p.then;
      return;
    }
    case "treasure": {
      gainGold(run, p.gold);
      if (pick === "take") (take(c, run, p.offer), note(run, `Found ${offerText(c, run, p.offer)}.`));
      run.pending = { kind: "map" };
      return;
    }
    case "shop": {
      if (pick === "leave") return void (run.pending = { kind: "map" });
      const [verb, ...rest] = pick.split(":");
      const arg = rest.join(":");
      if (verb === "buy") {
        const s = p.stock[Number(arg)];
        if (!take(c, run, s.offer)) return;
        s.sold = true;
        spend(run, s.price);
        note(run, `Bought ${offerText(c, run, s.offer)} for ${s.price}.`);
      } else if (verb === "sell") {
        const it = itemOf(run, arg)!;
        const price = sellPrice(c, it);
        run.items = run.items.filter((x) => x.uid !== arg);
        gainGold(run, price);
        note(run, `Sold ${c.gear.get(arg)?.name ?? it.base} for ${price}.`);
      } else if (verb === "learn") {
        const [cls, ab] = arg.split(":");
        const price = trainPrice(c, p, "learn");
        if (!learn(c, run, cls, ab)) return;
        spend(run, price);
        trained(c, p, "learn");
      } else if (verb === "power" || verb === "version") {
        // Step 5i: a power step or a version, at the upgrade price.
        const price = trainPrice(c, p, "upgrade");
        if (!train(c, run, pick)) return;
        spend(run, price);
        trained(c, p, "upgrade");
      }
      return;
    }
    case "campfire": {
      const k = cfg(c).campfire;
      const party = run.party.map((cls) => member(run, cls));
      const [verb, ...rest] = pick.split(":");
      if (verb === "leave") return void (run.pending = { kind: "map" });
      if (verb === "recruit") {
        // The stranger at the fire: taken in, and the campfire's own pick still waits.
        if (p.stranger) (take(c, run, p.stranger), note(run, `${offerText(c, run, p.stranger)} joins at the fire.`));
        delete p.stranger;
        return;
      }
      // Round 6: the stranger turned away for a lesson (one member), apart from the campfire's pick.
      if (verb === "lesson") return void (run.pending = { kind: "train", left: cfg(c).lesson ?? 3, done: [], then: p, why: "stranger", back: p });
      if (verb === "rest" && k.auto) {
        heal(c, run, run.roster.filter((m) => !m.ko), k.hp, k.mp);
        note(run, "Rested.");
        p.used = true;
        return;
      }
      if (verb === "train") return void (run.pending = { kind: "train", left: k.train ?? 1, done: [], then: p, why: "campfire", back: p });
      if (verb === "rest") (heal(c, run, party, k.hp, 0), note(run, "Rested."));
      else if (verb === "focus") (heal(c, run, party, 0, k.mp), note(run, "Focused."));
      else if (verb === "raise") {
        const m = member(run, rest[0]);
        m.ko = false;
        m.missHp = Math.floor((maxOf(c, run, m.cls, "max_hp") * (100 - k.revive)) / 100);
        note(run, `Raised the ${c.classes.get(m.cls)!.name}.`);
      }
      campUsed(c, run, p, verb === "raise" ? rest[0] : undefined);
      return;
    }
    case "event": {
      const ev = eventView(c, p);
      const o = ev.options.find((x) => x.id === pick);
      if (!o) return void ((run.pending = { kind: "map" }), note(run, `${ev.name}: walked on.`));
      if (o.gold) spend(run, o.gold);
      note(run, `${ev.name}: ${o.label.toLowerCase()}.`);
      run.pending = { kind: "map" };
      doOps(c, run, o.do, r(run, `event:${run.act}:${run.at}:${pick}`));
      return;
    }
    case "choose": {
      if (p.what === "learn") learn(c, run, ...(pick.split(":") as [string, string]));
      else if (p.what === "upgrade") train(c, run, pick);
      else {
        const it = itemOf(run, pick)!;
        const rng = r(run, `temper:${pick}`);
        // Round 6: a risky temper (the drunk smith) can crack the piece instead.
        if (p.risk && next(rng) * 100 < p.risk) {
          for (const m of run.roster) for (const s of SLOT_LIST) if (m.gear[s] === it.uid) delete m.gear[s];
          run.items = run.items.filter((x) => x.uid !== it.uid);
          note(run, `The ${c.gear.get(it.uid)?.name ?? "piece"} cracked in the forge and is lost.`);
        } else {
          // Step 5i: the piece becomes a piece of the next rarity of its slot and kind, one its wearer can wear (a rare one a
          // legendary: the reforge). It stays where it is; its wearer keeps the HP and MP it has.
          const was = c.gear.get(it.base)!.name;
          const into = temperInto(c, run, it, rng)!;
          const who = wearer(run, it.uid);
          holdCurrent(c, run, who ? [who] : [], () => ((it.base = into), (it.rarity = pieceRarity(c, into)), registerGear(c, run), true));
          note(run, `${it.rarity === "legendary" ? "Reforged" : "Tempered"}: ${was} into ${c.gear.get(it.uid)!.name}.`);
        }
      }
      run.pending = { kind: "map" };
      return;
    }
    case "levelup": {
      const cls = p.queue[0];
      const m = member(run, cls);
      if (pick === "gold") (gainGold(run, cfg(c).levelGold ?? 0), note(run, `${c.classes.get(cls)!.name} takes ${cfg(c).levelGold} gold instead.`));
      else train(c, run, pick);
      const queue = p.queue.slice(1).filter((x) => run.roster.some((mm) => mm.cls === x));
      run.pending = queue.length ? { kind: "levelup", queue } : { kind: "map" };
      return;
    }
    case "region": {
      run.act++;
      beginAct(c, run, pick, true);
      const queue = run.roster.map((m) => m.cls).filter((cls) => trainingsFor(c, run, cls).length);
      run.pending = queue.length ? { kind: "levelup", queue } : { kind: "map" };
      return;
    }
    default:
      throw new Error(`nothing to choose at ${p.kind}`);
  }
}
/**
 * A campfire's pick is spent. Those standing at camp rest (a share of REST) whatever the party picks: those who were at camp when
 * the campfire was reached, not a member stepped back just for it (a playtester's loop), nor one raised here just now. Step 5h:
 * HP only (the bench's MP comes back after every fight it sits out).
 */
function campUsed(c: Content, run: RogueRun, p: Extract<Pending, { kind: "campfire" }>, raised?: string) {
  const k = cfg(c).campfire;
  // Round 6: with the free share on arrival there's no camp share on top.
  if (k.auto) return void (p.used = true);
  const camp = bench(run).map((cls) => member(run, cls));
  heal(c, run, camp.filter((m) => (p.resting ?? camp.map((x) => x.cls)).includes(m.cls) && m.cls !== raised), Math.round((k.hp * (k.camp ?? 100)) / 100), 0);
  p.used = true;
}
/** A pick as a counter's name: the decision and what kind of thing was picked ("map:elite", "spoils:gear", "shop:buy:recruit"). */
function pickKind(run: RogueRun, pick: string): string {
  const p = run.pending;
  const [verb, arg] = pick.split(":");
  switch (p.kind) {
    case "map": return `map:${run.map.find((n) => n.id === pick)?.kind}`;
    case "captive": return `captive:${pick}`;
    case "spoils": case "boon": case "muster": case "drill": case "trophy": return pick === "skip" || pick === "train" ? `${p.kind}:${pick}` : `${p.kind}:${p.offers[Number(arg)].kind}`;
    case "train": return `train:${verb}`;
    case "shop": return verb === "buy" ? `shop:buy:${p.stock[Number(arg)].offer.kind}` : `shop:${verb}`;
    case "choose": return `choose:${p.what}`;
    case "levelup": return "levelup";
    case "draft": return "draft";
    case "region": return `region:${pick}`;
    case "drop": return `drop:${pick}`;
    case "event": return `event:${p.id}:${pick}`;
    default: return `${p.kind}:${verb}`;
  }
}
function spend(run: RogueRun, n: number) {
  run.gold -= n;
  run.stats.spent += n;
}

/** After a boss's boon: the next act's region, from two (or the only one). */
function nextAct(c: Content, run: RogueRun) {
  const regs = rogue(c).regions.filter((x) => x.act === run.act + 1).map((x) => x.id);
  const opts = shuffle(r(run, `regions:${run.act + 1}`), regs).slice(0, 2);
  run.pending = { kind: "region", options: opts };
}

/** Enters a room. */
function enter(c: Content, run: RogueRun, id: string) {
  const node = run.map.find((n) => n.id === id)!;
  run.at = id;
  run.visited.push(id);
  run.floor = node.floor;
  switch (node.kind) {
    case "fight":
    case "elite":
    case "boss":
      run.pending = { kind: "fight", ...fightSpec(c, run, node, node.kind) };
      return;
    case "campfire": return arriveCamp(c, run, id);
    case "muster":
      run.pending = { kind: "muster", offers: rollRecruits(c, run, r(run, `muster:${run.act}:${id}`), cfg(c).muster?.offers ?? 2) };
      return;
    case "drill":
      run.pending = { kind: "drill", offers: rollFormations(c, run, r(run, `drill:${run.act}:${id}`), cfg(c).drill?.offers ?? 2) };
      return;
    case "shop":
      run.stats.shops++;
      run.pending = { kind: "shop", stock: shopStock(c, run, id), learn: true, upgrade: true };
      return;
    case "treasure": {
      const rng = r(run, `chest:${run.act}:${id}`);
      const t = cfg(c).treasure;
      // Step 5h: sometimes a cage, a recruit with a piece suited to it.
      let offer: Offer | null = null;
      if (next(rng) * 100 < (t.cage ?? 0)) {
        const o = rollRecruit(c, run, rng);
        if (o?.kind === "recruit") { const item = rollItem(c, run, rng, "uncommon", false, false, o.cls); offer = { ...o, ...(item ? { item } : {}) }; }
      }
      if (!offer) {
        // Step 5i (the retire share): with no piece to find, the chest holds a supply.
        const item = rollItem(c, run, rng, rollRarity(rng, t.rarity), false, true);
        offer = item ? { kind: "gear", item } : { kind: "supply", id: SUPPLIES[int(rng, SUPPLIES.length)] };
      }
      run.pending = { kind: "treasure", offer, gold: between(rng, t.gold) };
      return;
    }
    case "event": {
      run.stats.events++;
      const all = rogue(c).events;
      const fresh = all.filter((e) => !run.seen.includes(e.id));
      const pool = fresh.length ? fresh : all;
      const rng = r(run, `event:${run.act}:${id}`);
      const ev = pool[int(rng, pool.length)];
      run.seen.push(ev.id);
      // Step 5h: an event with versions rolls one, so a known event can still surprise.
      run.pending = { kind: "event", id: ev.id, ...(ev.variants?.length ? { v: int(rng, ev.variants.length) } : {}) };
      return;
    }
  }
}

/**
 * A campfire reached. Round 6: everyone, party and camp, recovers the free share on arrival (`campfire.auto`), the fallen rising
 * first; then the pick waits. Step 5h: sometimes a stranger at the fire asks to join (one recruit, take it or not; it doesn't use the
 * pick).
 */
export function arriveCamp(c: Content, run: RogueRun, key: string) {
  run.stats.campfires++;
  const k = cfg(c).campfire;
  if (k.auto) {
    const raised = run.roster.filter((m) => m.ko);
    for (const m of raised) (m.ko = false), (m.missHp = Math.floor((maxOf(c, run, m.cls, "max_hp") * (100 - k.auto.revive)) / 100));
    heal(c, run, run.roster.filter((m) => !raised.includes(m)), k.auto.hp, 0);
    heal(c, run, run.roster, 0, k.auto.mp);
    if (raised.length) note(run, `${raised.map((m) => c.classes.get(m.cls)!.name).join(", ")} back on their feet.`);
  }
  const rng = r(run, `stranger:${run.act}:${key}`);
  const stranger = next(rng) * 100 < (k.stranger ?? 0) ? rollRecruit(c, run, rng) : null;
  run.pending = { kind: "campfire", resting: bench(run), ...(stranger ? { stranger } : {}) };
}
/** An event option's effects, in order. A fight, a camp or a choice ends the list there and waits on it. */
function doOps(c: Content, run: RogueRun, ops: readonly EventOpT[], rng: Rng) {
  const party = () => run.party.map((cls) => member(run, cls));
  // What happens at once happens first; a choice, a camp or a fight comes last and waits (the Old Master's lesson cost
  // nothing when its HP came after the choice: an AI playtester).
  const waits = (op: EventOpT) => ["learn", "upgrade", "temper", "camp", "fight", "train", "muster"].includes(op.op);
  ops = [...ops.filter((op) => !waits(op)), ...ops.filter(waits)];
  for (const op of ops) {
    switch (op.op) {
      case "gold": gainGold(run, op.amount); note(run, `${op.amount > 0 ? "+" : ""}${op.amount} gold.`); break;
      case "hp": {
        const who = op.one ? [party().filter((m) => !m.ko)[0]].filter(Boolean) : party();
        if (op.pct >= 0) heal(c, run, who, op.pct, 0);
        else for (const m of who) if (!m.ko) m.missHp = Math.min(maxOf(c, run, m.cls, "max_hp") - 1, m.missHp + Math.floor((maxOf(c, run, m.cls, "max_hp") * -op.pct) / 100));
        break;
      }
      case "mp":
        if (op.pct >= 0) heal(c, run, party(), 0, op.pct);
        else for (const m of party()) m.missMp = Math.min(maxOf(c, run, m.cls, "max_mp"), m.missMp + Math.floor((maxOf(c, run, m.cls, "max_mp") * -op.pct) / 100));
        break;
      case "revive":
        for (const m of run.roster.filter((x) => x.ko)) (m.ko = false), (m.missHp = Math.floor((maxOf(c, run, m.cls, "max_hp") * (100 - op.pct)) / 100)), note(run, `The ${c.classes.get(m.cls)!.name} is back on their feet.`);
        break;
      case "gear": {
        // Step 5i (the retire share): nothing, with no piece to find (an option that only finds one isn't offered then).
        const item = rollItem(c, run, rng, op.rarity);
        if (!item) break;
        const o: Offer = { kind: "gear", item };
        take(c, run, o);
        note(run, `Gained ${offerText(c, run, o)}.`);
        break;
      }
      case "recruit": {
        const o = op.healer ? rollRecruit(c, run, rng, run.roster.length ? c.pack.classes.map((k) => k.id).filter((id) => !heals(c, id)) : [], 1, op.known) : rollRecruit(c, run, rng, [], 1, op.known);
        if (o?.kind === "recruit") {
          const item = (op.gear ? rollItem(c, run, rng, op.gear, false, false, o.cls) : null) ?? undefined;
          recruit(c, run, o.cls, op.hp ?? 100, o.known, item);
          note(run, `${c.classes.get(o.cls)!.name} joins.`);
        }
        break;
      }
      case "formation": { const o = rollFormation(c, run, rng, [], op.rarity); if (o) (take(c, run, o), note(run, `Gained ${offerText(c, run, o)}.`)); break; }
      case "seat": if (take(c, run, { kind: "seat" })) note(run, "Room for one more at camp."); break;
      case "trade": {
        // The newest member who isn't the leader leaves (its gear stays in the bag); a stranger joins knowing all three.
        const out = [...run.roster].reverse().find((m) => m.cls !== run.leader);
        if (!out) break;
        const seat = run.party.indexOf(out.cls);
        out.gear = {};
        run.roster = run.roster.filter((m) => m !== out);
        if (seat >= 0) run.party.splice(seat, 1);
        const o = rollRecruit(c, run, rng, [out.cls], 3, 3);
        note(run, `The ${c.classes.get(out.cls)!.name} leaves with the rival company.`);
        if (o?.kind === "recruit") (recruit(c, run, o.cls, 100, o.known), note(run, `${c.classes.get(o.cls)!.name} joins.`));
        break;
      }
      case "train": if (trainOptions(c, run, []).length) return void (run.pending = { kind: "train", left: op.n, done: [], then: { kind: "map" }, why: "event" }); break;
      case "muster": {
        if (!roomForRecruit(c, run)) break;
        // Round 6: each may carry a piece suited to it; a fight listed after the pick follows it (the Prisoner Convoy's guards).
        const offers = rollRecruits(c, run, rng, op.n, 1, op.known).map((o): Offer => {
          const item = op.gear && o.kind === "recruit" ? rollItem(c, run, rng, op.gear, false, false, o.cls) : null;
          return item ? { ...(o as Extract<Offer, { kind: "recruit" }>), item } : o;
        });
        const fight = ops.slice(ops.indexOf(op) + 1).find((x) => x.op === "fight");
        const node = run.map.find((n) => n.id === run.at);
        const then: Pending | undefined = fight?.op === "fight" && node ? { kind: "fight", ...fightSpec(c, run, { ...node, floor: Math.max(node.floor, easyTo(c) + 1) }, fight.tier === "elite" ? "elite" : "fight") } : undefined;
        return void (run.pending = { kind: "muster", offers, ...(then ? { then } : {}) });
      }
      case "supply": {
        if (op.id === "phoenix" && run.roster.some((m) => m.ko)) {
          const m = run.roster.find((x) => x.ko)!;
          m.ko = false;
          m.missHp = Math.floor(maxOf(c, run, m.cls, "max_hp") / 2);
        } else take(c, run, { kind: "supply", id: op.id });
        break;
      }
      case "learn": if (learnOptions(c, run).length) return void (run.pending = { kind: "choose", what: "learn", why: "event" }); break;
      case "upgrade": if (improveOptions(c, run).length) return void (run.pending = { kind: "choose", what: "upgrade", why: "event" }); break;
      case "temper": if (temperable(c, run, op.from).length) return void (run.pending = { kind: "choose", what: "temper", why: "event", ...(op.from ? { from: op.from } : {}), ...(op.risk ? { risk: op.risk } : {}) }); break;
      case "camp": return arriveCamp(c, run, `event:${run.at}`);
      case "fight": {
        const node = run.map.find((n) => n.id === run.at)!;
        const tier: FightTier = op.tier === "elite" ? "elite" : "fight";
        return void (run.pending = { kind: "fight", ...fightSpec(c, run, { ...node, floor: Math.max(node.floor, easyTo(c) + 1) }, tier) });
      }
      case "chance": {
        // A gamble says how it went (a playtester never learned whether the Gambler paid).
        const hit = next(rng) * 100 < op.pct;
        note(run, hit ? "Luck was with you." : "Luck was against you.");
        return doOps(c, run, hit ? op.then : op.else, rng);
      }
    }
  }
}

// ─── Words ──────────────────────────────────────────────────────────────────

export function offerText(c: Content, run: RogueRun, o: Offer): string {
  if (o.kind === "gear") return (c.gear.get(o.item.uid) ?? itemGear(c, o.item)).name;
  if (o.kind === "bundle") return `${(c.gear.get(o.item.uid) ?? itemGear(c, o.item)).name} and ${supplyName(o.supply)}`;
  if (o.kind === "tome") return `a tome: the ${c.classes.get(o.cls)!.name} learns ${c.abilities.get(o.ability)!.name}`;
  if (o.kind === "recruit") return `the ${c.classes.get(o.cls)!.name}${o.item ? ` (with ${(c.gear.get(o.item.uid) ?? itemGear(c, o.item)).name})` : ""}`;
  if (o.kind === "seat") return "a seat at camp";
  if (o.kind === "formation") return `the ${c.formations.get(o.id)!.name} formation`;
  return `${/^[aeiou]/.test(o.id) ? "an" : "a"} ${o.id}`;
}

// ─── Meta: what a run leaves behind ────────────────────────────────────────

/** A finished run: a win adds its final party to the classes a run can start with, and opens the next heat. */
export function finish(meta: RogueMeta, run: RogueRun): { unlocked: string[]; heat: boolean } {
  meta.runs++;
  if (run.act > meta.best.act || (run.act === meta.best.act && run.floor > meta.best.floor)) meta.best = { act: run.act, floor: run.floor };
  if (run.pending.kind !== "over" || !run.pending.won) return { unlocked: [], heat: false };
  meta.wins++;
  const unlocked = run.party.filter((cls) => !meta.owned.includes(cls));
  meta.owned.push(...unlocked);
  const heat = run.heat >= meta.maxHeat;
  if (heat) meta.maxHeat = run.heat + 1;
  return { unlocked, heat };
}
