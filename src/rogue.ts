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
import type { AbilityT, DungeonT, EffectT, FoesT, GearT, NumT, Party, RarityT, RogueEventT, RogueFightT, RogueNodeKindT, RogueRegionT, RogueT, EventOpT, SupplyIdT } from "./schema.js";
import { canEquip } from "./validate.js";

export const ROGUE_VERSION = 1;
export type Slot = "weapon" | "armor" | "amulet";
export const SLOT_LIST: Slot[] = ["weapon", "armor", "amulet"];

// ─── State ──────────────────────────────────────────────────────────────────

/** A piece of gear in a run: a base piece, its rarity and its affixes. Its id in the content is `uid`. */
export type Item = { uid: string; base: string; rarity: RarityT; affixes: string[] };
/** A class in the run's roster. HP and MP are kept as what's missing, so gear that raises the max raises the current too. */
export type Member = {
  cls: string; known: string[]; order: string[]; gear: Partial<Record<Slot, string>>; missHp: number; missMp: number; ko: boolean;
  /** Step 5g (the director's): ticks of cooldown each ability had left as the last fight ended; the next fight starts from there. */
  cooldowns?: Record<string, number>;
  /** Max HP and MP as the last fight ended: a heal by share of max counts from no more than this (see `healMax`). */
  lastMax?: { hp: number; mp: number };
};
export type MapNode = { id: string; floor: number; col: number; kind: RogueNodeKindT; next: string[] };
export type Offer =
  | { kind: "gear"; item: Item }
  | { kind: "tome"; cls: string; ability: string }
  | { kind: "recruit"; cls: string }
  | { kind: "formation"; id: string }
  | { kind: "supply"; id: SupplyIdT };
export type ShopSlot = { offer: Offer; price: number; sold: boolean };
export type FightTier = "fight" | "elite" | "boss";
export type FightSpec = { node: string; tier: FightTier; fight: RogueFightT; foes: FoesT; seed: number };
export type Pending =
  | { kind: "draft"; offers: string[]; left: number }
  | { kind: "map" }
  | ({ kind: "fight"; begun?: boolean } & FightSpec)
  | { kind: "spoils"; gold: number; offers: Offer[]; tier: FightTier; trophy?: Item }
  | { kind: "boon"; offers: Offer[] }
  | { kind: "shop"; stock: ShopSlot[]; learn: boolean; upgrade: boolean; trained?: number }
  | { kind: "campfire"; used?: boolean; resting?: string[] }
  | { kind: "event"; id: string }
  | { kind: "treasure"; offer: Offer; gold: number }
  | { kind: "choose"; what: "learn" | "upgrade" | "temper"; why: string }
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
  // Step 5g: the old party tonic is the potion, the old ether the tonic.
  const OLD: Record<string, SupplyIdT> = { ether: "tonic", tonic: "potion" };
  run.supplies = run.supplies.map((s) => OLD[s as string] ?? s);
  return run;
}

/** What a player keeps between runs: the classes a run can start with, and how far they've climbed. */
export type RogueMeta = { owned: string[]; heat: number; maxHeat: number; runs: number; wins: number; best: { act: number; floor: number } };

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

// ─── Content the run adds: its gear, upgraded abilities, its fight ─────────

const PLUS = "_plus";
export const isPlus = (id: string) => id.endsWith(PLUS);
export const baseAbility = (id: string) => (isPlus(id) ? id.slice(0, -PLUS.length) : id);

const scaleNum = (n: NumT, k: number): NumT =>
  typeof n === "number" ? Math.round(n * k) : { ...(n.base !== undefined ? { base: Math.round(n.base * k) } : {}), scale: n.scale.map((t) => ({ ...t, ratio: t.ratio * k })) };
/** True when an effect list deals, heals, shields or stacks anything. */
const hasAmount = (es: readonly EffectT[]): boolean => es.some((e) => e.op === "damage" || e.op === "heal" || e.op === "revive" || (e.op === "apply" && e.stacks !== undefined));
function upEffect(e: EffectT, k: number): EffectT {
  if (e.op === "damage") return { ...e, amount: scaleNum(e.amount, k), ...(e.apply ? { apply: e.apply.map((a) => (a.stacks !== undefined ? { ...a, stacks: scaleNum(a.stacks, k) } : a)) } : {}) };
  if (e.op === "heal") return { ...e, amount: scaleNum(e.amount, k) };
  if (e.op === "revive") return { ...e, hp: scaleNum(e.hp, k) };
  if (e.op === "apply" && e.stacks !== undefined) return { ...e, stacks: scaleNum(e.stacks, k) };
  return e;
}
/** The upgrade rule: + is 40% more of everything the ability deals, heals, shields or stacks; one with no amount comes off cooldown a quarter sooner. */
export const UPGRADE = { amount: 1.4, cooldown: 0.75 };
export function upgraded(c: Content, id: string): AbilityT {
  const pid = `${baseAbility(id)}${PLUS}`;
  const have = c.abilities.get(pid);
  if (have) return have;
  const a = c.abilities.get(baseAbility(id))!;
  const amounts = hasAmount(a.do);
  const up: AbilityT = {
    ...structuredClone(a), id: pid, name: `${a.name}+`,
    do: amounts ? a.do.map((e) => upEffect(e, UPGRADE.amount)) : structuredClone(a.do),
    cooldown: amounts ? a.cooldown : Math.round(a.cooldown * UPGRADE.cooldown * 1000) / 1000,
    text: amounts ? `${a.text} (+) 40% more of what it deals, heals, shields or stacks.` : `${a.text} (+) Comes off cooldown a quarter sooner.`,
  };
  c.abilities.set(pid, up);
  return up;
}

/** Every rogue piece the content can look up: the legendary pieces of the rogue block, and the run's items. */
export function registerGear(c: Content, run?: RogueRun) {
  for (const g of rogue(c).gear) if (!c.gear.has(g.id)) c.gear.set(g.id, g);
  if (run) for (const it of run.items) c.gear.set(it.uid, itemGear(c, it));
  if (run) for (const m of run.roster) for (const a of m.known) if (isPlus(a)) upgraded(c, a);
}

/** A run's item as gear: the base piece, with its affixes' stats added and a name to match. */
export function itemGear(c: Content, it: Item): GearT {
  registerGear(c);
  const base = c.gear.get(it.base)!;
  const affixes = it.affixes.map((id) => rogue(c).affixes.find((a) => a.id === id)!);
  const stats = new Map<string, number>();
  for (const s of [...(base.stats ?? []), ...affixes.flatMap((a) => a.stats)]) stats.set(s.stat, (stats.get(s.stat) ?? 0) + (s.flat ?? 0));
  const name = affixes.length === 0 ? base.name : affixes.length === 1 ? `${affixes[0].prefix} ${base.name}` : `${affixes[0].prefix} ${base.name} ${affixes[1].suffix}`;
  return {
    ...structuredClone(base), id: it.uid, name, tier: it.rarity === "legendary" ? "powerful" : "ordinary", source: "drop",
    ...(stats.size ? { stats: [...stats].filter(([, v]) => v !== 0).map(([stat, flat]) => ({ stat, flat })) } : {}),
    note: `rogue ${it.rarity}: ${it.base}${it.affixes.length ? ` + ${it.affixes.join(", ")}` : ""}`,
  };
}
export const itemOf = (run: RogueRun, uid: string) => run.items.find((i) => i.uid === uid);
/** Who wears an item, or null if it's in the bag. */
export const wearer = (run: RogueRun, uid: string) => run.roster.find((m) => Object.values(m.gear).includes(uid))?.cls ?? null;
export const bag = (run: RogueRun) => run.items.filter((i) => !wearer(run, i.uid));

/** The engine's party for the run's party: formation, seats, abilities in order, gear. */
export function partyOf(c: Content, run: RogueRun): Party {
  const f = c.formations.get(run.formation)!;
  return {
    formation: run.formation,
    units: run.party.map((cls, i) => {
      const m = member(run, cls);
      return { class: cls, position: f.positions[i].id, abilities: [...m.order], gear: Object.fromEntries(Object.entries(m.gear).filter(([, v]) => v)) as Record<string, string> };
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
/** Sets an engine run's party to the roster's HP, MP and knockouts. */
export function carryIn(run: RogueRun, er: Run) {
  for (const em of er.party as EngineMember[]) {
    const m = member(run, em.ref);
    em.hp = m.ko ? 0 : Math.max(1, em.stats.max_hp - m.missHp);
    em.mp = Math.max(0, em.stats.max_mp - m.missMp);
    if (m.cooldowns) em.cooldowns = { ...m.cooldowns };
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
    if (em.cooldowns) m.cooldowns = { ...em.cooldowns };
  }
  run.stats.fights++;
  if (p.tier === "elite") run.stats.elites++;
  if (!won) {
    // The reserves: those standing at camp take the fallen party's places, and a regular fight or elite is passed with
    // no spoils. A boss lost ends the run: met again by the reserves, it was either "a loss screen with extra steps" (back
    // at full HP) or a wipe that "cost nothing" (left wounded, finished by one Firebolt); AI playtests, rounds 5 and 6.
    if (reservesStand(c, run) && p.tier !== "boss") {
      run.party = bench(run).filter((cls) => !member(run, cls).ko).slice(0, cfg(c).party);
      note(run, `Fell to ${p.fight.name}. ${run.party.map((k) => c.classes.get(k)!.name).join(" and ")} take${run.party.length > 1 ? "" : "s"} up the road.`);
      run.pending = { kind: "map" };
      return;
    }
    note(run, `Fell to ${p.fight.name}.`);
    run.pending = { kind: "over", won: false };
    return;
  }
  const down = run.party.filter((cls) => member(run, cls).ko);
  note(run, `Beat ${p.fight.name}${down.length ? ` (${down.map((k) => c.classes.get(k)!.name).join(", ")} down)` : ""}.`);
  // Step 5g (the director's): every won fight hands the party a potion and a tonic, free, up to the bag.
  const dropped = (cfg(c).drops ?? []).filter((id) => run.supplies.length < cfg(c).bag && (run.supplies.push(id), true));
  if (dropped.length) note(run, `Found ${dropped.map((id) => (id === "phoenix" ? "a phoenix feather" : `a ${id}`)).join(" and ")}.`);
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
    run.pending = { kind: "boon", offers: boonOffers(c, run) };
    return;
  }
  const offers = spoilOffers(c, run, p.tier, p.node);
  // An elite's trophy: a legendary piece, won outright and in the bag already.
  let trophy: Item | undefined;
  if (cfg(c).spoils[p.tier === "elite" ? "elite" : "fight"].trophy) {
    trophy = rollItem(c, run, r(run, `trophy:${run.act}:${p.node}`), "legendary", true);
    take(c, run, { kind: "gear", item: trophy });
    note(run, `Won ${c.gear.get(trophy.uid)!.name}.`);
  }
  run.pending = { kind: "spoils", gold, offers, tier: p.tier, ...(trophy ? { trophy } : {}) };
}

/** Plays the pending fight at once (the simulations), and carries the result back. */
export function autoFight(c: Content, run: RogueRun): Run {
  const er = startFight(c, run);
  advance(c, combat, er);
  endFight(c, run, er);
  return er;
}

// ─── A new run ──────────────────────────────────────────────────────────────

/** The abilities a class knows on joining in act `act`: its first, then the rest in its own order, one more an act. */
export function joinKnown(c: Content, cls: string, act: number): string[] {
  const all = c.classes.get(cls)!.abilities;
  const first = cfg(c).firstAbility[cls] ?? all[0];
  const known = (cfg(c).startKnown?.[cls] ?? cfg(c).start.known ?? 1) + act - 1;
  return [first, ...all.filter((a) => a !== first)].slice(0, Math.max(1, Math.min(known, all.length)));
}
export function plainWeapon(c: Content, cls: string): string {
  const kind = c.classes.get(cls)!.weapons[0];
  return c.pack.gear.find((g) => g.slot === "weapon" && g.source === "starter" && g.weapon?.kind === kind)!.id;
}
export function newItem(run: RogueRun, base: string, rarity: RarityT, affixes: string[] = []): Item {
  return { uid: `rg${run.seed % 100000}_${++run.uid}`, base, rarity, affixes };
}
/** A class joins: its plain weapon, the abilities for this act, full HP and MP (or `hp` %). To the party if there's room, else to camp. */
export function recruit(c: Content, run: RogueRun, cls: string, hp = 100): boolean {
  if (run.roster.some((m) => m.cls === cls) || run.roster.length >= cfg(c).party + cfg(c).bench) return false;
  const w = newItem(run, plainWeapon(c, cls), "common");
  run.items.push(w);
  const known = joinKnown(c, cls, run.act);
  const m: Member = { cls, known, order: [...known], gear: { weapon: w.uid }, missHp: 0, missMp: 0, ko: false };
  run.roster.push(m);
  registerGear(c, run);
  if (hp < 100) m.missHp = Math.floor((maxOf(c, run, cls, "max_hp") * (100 - hp)) / 100);
  if (run.party.length < cfg(c).party) run.party.push(cls);
  return true;
}

export type NewRun = { seed: number; leader: string; heat?: number };
export function newRogue(c: Content, o: NewRun): RogueRun {
  const k = cfg(c);
  const run: RogueRun = {
    v: ROGUE_VERSION, seed: o.seed, heat: o.heat ?? 0, leader: o.leader, act: 1, region: "", boss: { id: "none", name: "none", enemies: ["wolf"] }, map: [], at: null, visited: [], seen: [], met: [],
    roster: [], party: [], formation: "neutral", formations: ["neutral"], items: [], supplies: [], gold: k.start.gold, pending: { kind: "map" }, uid: 0,
    stats: { fights: 0, elites: 0, bosses: 0, gold: 0, spent: 0, events: 0, shops: 0, campfires: 0, picks: {} }, notes: [], floor: 0,
  };
  registerGear(c);
  recruit(c, run, o.leader);
  note(run, `${c.classes.get(o.leader)!.name} sets out.`);
  const first = rogue(c).regions.filter((x) => x.act === 1);
  beginAct(c, run, first[int(r(run, "region:1"), first.length)].id, false);
  run.pending = k.start.picks > 0 ? { kind: "draft", offers: draftOffers(c, run, 1), left: k.start.picks } : { kind: "map" };
  return run;
}
/** Does a class heal or raise others (an ability that heals, gives Regen or revives)? */
export const heals = (c: Content, cls: string) =>
  c.classes.get(cls)!.abilities.some((id) => c.abilities.get(id)!.do.some((e) => e.op === "heal" || e.op === "revive" || (e.op === "apply" && e.status === "regen")));
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

const SPECIAL_ROOMS = new Set(["elite", "campfire", "shop"]);
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
  // At least one shop and two elites an act, where the rules allow them.
  const ensure = (kind: RogueNodeKindT, count: number) => {
    while (nodes.filter((n) => n.kind === kind).length < count) {
      const cands = nodes.filter((n) => !fixed.has(n.id) && n.floor >= m.lateFrom && n.kind === "fight" && ![...parents(n), ...n.next.map((id) => byId.get(id)!)].some((x) => x.kind === kind));
      if (!cands.length) return;
      cands[int(rng, cands.length)].kind = kind;
    }
  };
  ensure("shop", 2);
  ensure("elite", 2);
  // Every way up passes a campfire between the early floors and the last (the playtesters: recruits waited at camp all
  // act, and long stretches without one decided runs more than skill did).
  const last = Number(Object.keys(m.fixed).find((f) => m.fixed[f] === "campfire") ?? m.floors);
  const paths = (): MapNode[][] => {
    const out: MapNode[][] = [];
    const go = (n: MapNode, acc: MapNode[]) => (n.floor >= last ? out.push(acc) : n.next.forEach((id) => go(byId.get(id)!, [...acc, byId.get(id)!])));
    for (const n of nodes.filter((x) => x.floor === 1)) go(n, [n]);
    return out;
  };
  for (let tries = 0; tries < 40; tries++) {
    const bare = paths().find((p) => !p.some((n) => n.kind === "campfire" && n.floor >= m.lateFrom && n.floor < last));
    if (!bare) break;
    const cands = bare.filter((n) => n.floor >= m.lateFrom && n.floor < last - 1 && (n.kind === "fight" || n.kind === "event") && ![...parents(n), ...n.next.map((id) => byId.get(id)!)].some((x) => x.kind === "campfire"));
    if (!cands.length) break;
    cands[int(rng, cands.length)].kind = "campfire";
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
  if (restore) for (const m of run.roster) (m.missHp = 0), (m.missMp = 0), (m.ko = false), (m.cooldowns = {});
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
export const REF_FLOOR = { easy: 1, normal: 5, elite: 6 } as const;
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
  if (tier === "elite") return own + kn.elite + reg.elite + kn.step * (floor - REF_FLOOR.elite) + heat;
  return own + kn.mob + reg.mob + kn.step * (floor - (floor <= 2 ? REF_FLOOR.easy : REF_FLOOR.normal)) + heat;
}
/** The fight a room holds: from the region's easy pool on the first two floors, then its normal or elite pool, packs growing late. */
export function fightFor(c: Content, run: RogueRun, node: MapNode, tier: FightTier): RogueFightT {
  if (tier === "boss") return run.boss;
  const reg = regionOf(c, run.region);
  const rng = r(run, `enc:${run.act}:${node.id}:${tier}`);
  const all = tier === "elite" ? reg.elite : node.floor <= 2 ? reg.easy : reg.normal;
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

// ─── Offers: gear, tomes, recruits, formations, supplies ───────────────────

const ORDINARY = (c: Content) => c.pack.gear.filter((g) => g.source === "drop" && g.tier === "ordinary").map((g) => g.id);
const rollRarity = (rng: Rng, odds: Record<RarityT, number>): RarityT => {
  const ks = Object.keys(odds) as RarityT[];
  let x = next(rng) * ks.reduce((s, k) => s + odds[k], 0);
  return ks.find((k) => (x -= odds[k]) < 0) ?? "common";
};
/** Can anyone in the roster use this piece? */
/** Is a legendary piece aimed at this class (the content's aims; without them, any class that can wear it)? */
export const aimedAt = (c: Content, base: string, cls: string) => rogue(c).aims?.[base]?.includes(cls) ?? canEquip(c.classes.get(cls)!, c.gear.get(base)!);
export const usable = (c: Content, run: RogueRun, base: string) => run.roster.some((m) => canEquip(c.classes.get(m.cls)!, c.gear.get(base)!));
export function rollItem(c: Content, run: RogueRun, rng: Rng, rarity: RarityT, forParty = false): Item {
  registerGear(c);
  const pool = rarity === "legendary" ? rogue(c).legendaries : ORDINARY(c);
  // Won outright, a piece is one aimed at someone in the party (who can wear it), where any is.
  const wears = (id: string) => (forParty ? run.party.some((cls) => canEquip(c.classes.get(cls)!, c.gear.get(id)!)) : usable(c, run, id));
  const aimed = forParty ? pool.filter((id) => run.party.some((cls) => aimedAt(c, id, cls) && canEquip(c.classes.get(cls)!, c.gear.get(id)!))) : [];
  // A legendary piece the run already has isn't rolled again while others are left (two Thornhearts in one run: a playtester).
  const had = new Set(rarity === "legendary" ? run.items.filter((it) => it.rarity === "legendary").map((it) => it.base) : []);
  const fresh = (ids: string[]) => ids.filter((id) => !had.has(id));
  let fits = fresh(aimed);
  if (!fits.length) fits = fresh(pool.filter(wears));
  const anyFresh = fresh(pool);
  // Ordinary pieces are always ones the roster can wear (pieces for nobody felt like wasted offers to the playtesters);
  // a legendary piece sometimes wants a class the run doesn't have yet, except one won outright (forParty: an elite's
  // trophy, which a playtester got as Archmage's robes with no caster in the party).
  const from = fits.length && (rarity !== "legendary" || forParty || next(rng) * 100 < cfg(c).spoils.usable) ? fits : anyFresh.length ? anyFresh : pool;
  const base = from[int(rng, from.length)];
  // A legendary piece carries a rare's two affixes on top of what makes it legendary: the core set's powerful pieces are
  // sidegrades by design, and three of them at the start of a run were worth a third of three rares (tuning round 9).
  const n = rarity === "uncommon" ? 1 : rarity === "rare" || rarity === "legendary" ? 2 : 0;
  const affixes = shuffle(rng, rogue(c).affixes.map((a) => a.id)).slice(0, n);
  return newItem(run, base, rarity, affixes);
}
/** Abilities a member hasn't learned, in its class's order. */
export const unlearned = (c: Content, m: Member) => c.classes.get(m.cls)!.abilities.filter((a) => !m.known.some((k) => baseAbility(k) === a));
/** Known abilities that can still be upgraded. */
export const upgradable = (m: Member) => m.known.filter((a) => !isPlus(a));
function rollTome(c: Content, run: RogueRun, rng: Rng): Offer | null {
  const can = run.roster.filter((m) => unlearned(c, m).length);
  if (!can.length) return null;
  const m = can[int(rng, can.length)];
  const left = unlearned(c, m);
  return { kind: "tome", cls: m.cls, ability: left[int(rng, left.length)] };
}
const roomForRecruit = (c: Content, run: RogueRun) => run.roster.length < cfg(c).party + cfg(c).bench;
function rollRecruit(c: Content, run: RogueRun, rng: Rng, taken: string[] = []): Offer | null {
  if (!roomForRecruit(c, run)) return null;
  const pool = c.pack.classes.map((k) => k.id).filter((id) => !run.roster.some((m) => m.cls === id) && !taken.includes(id));
  if (!pool.length) return null;
  // A class that could wear a legendary piece nobody in the roster can is three times as likely: a piece found for a class
  // the run doesn't have makes that class worth hoping for, and the odds answer (an AI playtester's ask).
  const waiting = bag(run).filter((it) => it.rarity === "legendary" && !run.roster.some((m) => canEquip(c.classes.get(m.cls)!, c.gear.get(it.uid) ?? itemGear(c, it))));
  const weight = (id: string) => (waiting.some((it) => aimedAt(c, it.base, id)) ? 3 : 1);
  let x = int(rng, pool.reduce((t, id) => t + weight(id), 0));
  for (const id of pool) if ((x -= weight(id)) < 0) return { kind: "recruit", cls: id };
  return { kind: "recruit", cls: pool[pool.length - 1] };
}
function rollFormation(c: Content, run: RogueRun, rng: Rng, taken: string[] = []): Offer | null {
  const pool = c.pack.formations.map((f) => f.id).filter((id) => !run.formations.includes(id) && !taken.includes(id));
  return pool.length ? { kind: "formation", id: pool[int(rng, pool.length)] } : null;
}
const SUPPLIES: SupplyIdT[] = ["potion", "tonic", "phoenix"];

function spoilOffers(c: Content, run: RogueRun, tier: FightTier, node: string): Offer[] {
  const s = cfg(c).spoils[tier === "elite" ? "elite" : "fight"];
  const rng = r(run, `spoils:${run.act}:${node}`);
  const out: Offer[] = [];
  const recruits: string[] = [];
  for (let i = 0; i < s.count; i++) {
    if (i < (s.legendaries ?? 0)) {
      out.push({ kind: "gear", item: rollItem(c, run, rng, "legendary") });
      continue;
    }
    const x = next(rng) * 100;
    let o: Offer | null = null;
    if (x < s.tome) {
      o = rollTome(c, run, rng);
      // No tome twice in one offer (a playtester was offered Rending arrow twice).
      if (o?.kind === "tome" && out.some((y) => y.kind === "tome" && y.cls === (o as { cls: string }).cls && y.ability === (o as { ability: string }).ability)) o = null;
    } else if (x < s.tome + s.recruit) {
      o = rollRecruit(c, run, rng, recruits);
      if (o?.kind === "recruit") recruits.push(o.cls);
    } else if (x < s.tome + s.recruit + s.supply) o = { kind: "supply", id: SUPPLIES[int(rng, SUPPLIES.length)] };
    if (!o) {
      // No two offers of the same piece.
      let item = rollItem(c, run, rng, rollRarity(rng, s.rarity));
      for (let k = 0; k < 6 && out.some((x) => x.kind === "gear" && x.item.base === item.base); k++) (run.uid--, (item = rollItem(c, run, rng, item.rarity)));
      o = { kind: "gear", item };
    }
    out.push(o);
  }
  return out;
}
function boonOffers(c: Content, run: RogueRun): Offer[] {
  const rng = r(run, `boon:${run.act}`);
  const out: Offer[] = [{ kind: "gear", item: rollItem(c, run, rng, "legendary") }];
  out.push(rollFormation(c, run, rng) ?? { kind: "gear", item: rollItem(c, run, rng, "legendary") });
  out.push(rollRecruit(c, run, rng) ?? { kind: "gear", item: rollItem(c, run, rng, "legendary") });
  return out.slice(0, cfg(c).boon.count);
}
export function priceOf(c: Content, o: Offer): number {
  const p = cfg(c).prices;
  if (o.kind === "gear") return p[o.item.rarity];
  if (o.kind === "recruit") return p.recruit;
  if (o.kind === "formation") return p.formation;
  if (o.kind === "supply") return p.supply[o.id] ?? 40;
  return p.learn;
}
type ShopPending = Extract<Pending, { kind: "shop" }>;
/** A shop's training: its price, dearer by the step for each bought this visit (or once each a visit, with no step). */
export const trainPrice = (c: Content, p: ShopPending, verb: "learn" | "upgrade") => cfg(c).prices[verb] + (cfg(c).prices.trainStep ?? 0) * (p.trained ?? 0);
function trained(c: Content, p: ShopPending, verb: "learn" | "upgrade") {
  p.trained = (p.trained ?? 0) + 1;
  if (cfg(c).prices.trainStep === undefined) p[verb] = false;
}
export const sellPrice = (c: Content, it: Item) => Math.floor((cfg(c).prices[it.rarity] * cfg(c).prices.sell) / 100);
function shopStock(c: Content, run: RogueRun, node: string): ShopSlot[] {
  const s = cfg(c).shop;
  const rng = r(run, `shop:${run.act}:${node}`);
  const out: Offer[] = [];
  for (const rar of ["common", "uncommon", "rare", "legendary"] as RarityT[]) for (let i = 0; i < s.gear[rar]; i++) out.push({ kind: "gear", item: rollItem(c, run, rng, rar) });
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
  if (o.kind === "gear") {
    run.items.push(o.item);
    registerGear(c, run);
    return true;
  }
  if (o.kind === "tome") return learn(c, run, o.cls, o.ability);
  if (o.kind === "recruit") return recruit(c, run, o.cls);
  if (o.kind === "formation") {
    if (run.formations.includes(o.id)) return false;
    run.formations.push(o.id);
    return true;
  }
  if (run.supplies.length >= cfg(c).bag) return false;
  run.supplies.push(o.id);
  return true;
}
export function canTake(c: Content, run: RogueRun, o: Offer): boolean {
  if (o.kind === "tome") { const m = run.roster.find((x) => x.cls === o.cls); return !!m && unlearned(c, m).includes(o.ability); }
  if (o.kind === "recruit") return roomForRecruit(c, run) && !run.roster.some((m) => m.cls === o.cls);
  if (o.kind === "formation") return !run.formations.includes(o.id);
  if (o.kind === "supply") return run.supplies.length < cfg(c).bag;
  return true;
}

// ─── Abilities: learning and upgrading ─────────────────────────────────────

export function learn(c: Content, run: RogueRun, cls: string, ability: string): boolean {
  const m = run.roster.find((x) => x.cls === cls);
  if (!m || !unlearned(c, m).includes(ability)) return false;
  m.known.push(ability);
  m.order.push(ability);
  note(run, `${c.classes.get(cls)!.name} learns ${c.abilities.get(ability)!.name}.`);
  return true;
}
export function upgrade(c: Content, run: RogueRun, cls: string, ability: string): boolean {
  const m = run.roster.find((x) => x.cls === cls);
  if (!m || !m.known.includes(ability) || isPlus(ability)) return false;
  const up = upgraded(c, ability);
  m.known = m.known.map((a) => (a === ability ? up.id : a));
  m.order = m.order.map((a) => (a === ability ? up.id : a));
  note(run, `${c.classes.get(cls)!.name}'s ${up.name}.`);
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
  const old = wearer(run, uid);
  if (old && old !== cls) {
    // Taken from another member, who gets this member's old piece if it fits them (a weapon slot is never left empty).
    const om = member(run, old);
    const was = m.gear[slot];
    const fits = !!was && canEquip(c.classes.get(old)!, c.gear.get(was)!);
    if (slot === "weapon" && !fits) return false;
    if (fits) om.gear[slot] = was;
    else delete om.gear[slot];
  }
  m.gear[slot] = uid;
  return true;
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
 * At a campfire: one of the party and one at camp trade places. Or a party member steps back with nobody to replace it, while someone stands.
 * Any time between rooms, a fallen member can trade places with one standing at camp (both AI playtests of round 2 lost a run with
 * healthy members watching from camp), and one standing at camp can fill an empty seat.
 */
export function swap(c: Content, run: RogueRun, out: string, into: string | null): boolean {
  // Seats change stats, so whoever moves keeps the HP and MP it has.
  return holdCurrent(c, run, run.roster.map((m) => m.cls), () => swapNow(c, run, out, into));
}
function swapNow(c: Content, run: RogueRun, out: string, into: string | null): boolean {
  if (run.pending.kind !== "campfire") {
    if (!betweenRooms(run)) return false;
    // One standing at camp fills an empty seat (after the reserves took the road with fewer than a full party).
    if (into === null && bench(run).includes(out) && !member(run, out).ko && run.party.length < cfg(c).party) return run.party.push(out), true;
    const i = run.party.indexOf(out);
    if (i < 0 || !into || !member(run, out).ko || !bench(run).includes(into) || member(run, into).ko) return false;
    run.party[i] = into;
    return true;
  }
  const i = run.party.indexOf(out);
  if (i < 0) {
    // A camp member into an empty seat.
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
/** At a campfire, with someone at camp: sends a member home for good, to make room. */
export function dismiss(c: Content, run: RogueRun, cls: string): boolean {
  if (run.pending.kind !== "campfire" || run.party.includes(cls) || cls === run.leader) return false;
  const m = member(run, cls);
  if (!m) return false;
  m.gear = {};
  run.roster = run.roster.filter((x) => x.cls !== cls);
  return true;
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
/** Would a lost fight now pass the road to those standing at camp (the reserves)? Never at a boss. */
export const reservesStand = (c: Content, run: RogueRun) => !!cfg(c).reserves && run.pending.kind === "fight" && run.pending.tier !== "boss" && bench(run).some((cls) => !member(run, cls).ko);

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
    case "spoils": return [...p.offers.map((o, i) => (canTake(c, run, o) ? `take:${i}` : "")).filter(Boolean), "skip"];
    case "boon": return [...p.offers.map((o, i) => (canTake(c, run, o) ? `take:${i}` : "")).filter(Boolean), "skip"];
    case "treasure": return [canTake(c, run, p.offer) ? "take" : "", "leave"].filter(Boolean);
    case "shop": {
      const out = p.stock.map((s, i) => (!s.sold && s.price <= run.gold && canTake(c, run, s.offer) ? `buy:${i}` : "")).filter(Boolean);
      if (p.learn && run.gold >= trainPrice(c, p, "learn")) out.push(...learnOptions(c, run).map((o) => `learn:${o}`));
      if (p.upgrade && run.gold >= trainPrice(c, p, "upgrade")) out.push(...upgradeOptions(run).map((o) => `upgrade:${o}`));
      out.push(...bag(run).map((it) => `sell:${it.uid}`));
      return [...out, "leave"];
    }
    case "campfire": {
      // Once its pick is made, the campfire waits for LEAVE: swaps stay open until then (a playtester raised a member at
      // camp and found the swap window had closed with the pick).
      if (p.used) return ["leave"];
      const out = ["rest", "focus"];
      for (const m of run.roster) if (m.ko) out.push(`raise:${m.cls}`);
      out.push(...learnOptions(c, run).map((o) => `learn:${o}`), ...upgradeOptions(run).map((o) => `upgrade:${o}`));
      return out;
    }
    case "event": {
      const ev = eventOf(c, p.id);
      const ok = ev.options.filter((o) => (o.gold ?? 0) <= run.gold && o.do.every((op) => possible(c, run, op))).map((o) => o.id);
      // Nothing it offers can happen now: the party walks on.
      return ok.length ? ok : ["walk_on"];
    }
    case "choose":
      if (p.what === "learn") return learnOptions(c, run);
      if (p.what === "upgrade") return upgradeOptions(run);
      return run.items.filter((it) => it.rarity === "common" || it.rarity === "uncommon").map((it) => it.uid);
    case "levelup": {
      // Learn one more, or make one known better: breadth or depth, a real choice even with one ability left to learn.
      const m = member(run, p.queue[0]);
      // Or gold instead: a level-up late in a run can have one thing left, which was no choice (three playtesters).
      return [...unlearned(c, m), ...upgradable(m), ...(cfg(c).levelGold ? ["gold"] : [])];
    }
    case "region": return p.options;
    case "over": return [];
  }
}
/** Why an event's option can't be picked now, in a player's words (empty when it can). */
export function whyNot(c: Content, run: RogueRun, opt: RogueEventT["options"][number]): string {
  if ((opt.gold ?? 0) > run.gold) return "not enough gold";
  const op = opt.do.find((x) => !possible(c, run, x));
  if (!op) return "";
  return op.op === "recruit" ? "no room at camp" : op.op === "learn" ? "nothing left to learn" : op.op === "upgrade" ? "nothing left to upgrade" : op.op === "temper" ? "no common or uncommon piece to temper" : op.op === "formation" ? "every formation owned" : "can't happen now";
}
/** Can an event's verb happen now? A recruit needs room at camp, learning something to learn, tempering a piece to temper. */
function possible(c: Content, run: RogueRun, op: EventOpT): boolean {
  if (op.op === "recruit") return roomForRecruit(c, run);
  if (op.op === "learn") return learnOptions(c, run).length > 0;
  if (op.op === "upgrade") return upgradeOptions(run).length > 0;
  if (op.op === "temper") return run.items.some((it) => it.rarity === "common" || it.rarity === "uncommon");
  if (op.op === "formation") return c.pack.formations.some((f) => !run.formations.includes(f.id));
  return true;
}
/** `cls:ability` for every ability someone in the roster can learn. */
export const learnOptions = (c: Content, run: RogueRun) => run.roster.flatMap((m) => unlearned(c, m).map((a) => `${m.cls}:${a}`));
export const upgradeOptions = (run: RogueRun) => run.roster.flatMap((m) => upgradable(m).map((a) => `${m.cls}:${a}`));
export const eventOf = (c: Content, id: string): RogueEventT => rogue(c).events.find((e) => e.id === id)!;

/** Answers the pending decision. Throws on an option that isn't one. */
export function choose(c: Content, run: RogueRun, pick: string) {
  const opts = options(c, run);
  if (!opts.includes(pick)) throw new Error(`'${pick}' isn't an option at ${run.pending.kind}: ${opts.join(", ")}`);
  const p = run.pending;
  const tally = pickKind(run, pick);
  run.stats.picks[tally] = (run.stats.picks[tally] ?? 0) + 1;
  switch (p.kind) {
    case "draft": {
      recruit(c, run, pick);
      note(run, `${c.classes.get(pick)!.name} joins.`);
      run.pending = p.left > 1 ? { kind: "draft", offers: draftOffers(c, run, cfg(c).start.picks - p.left + 2), left: p.left - 1 } : { kind: "map" };
      return;
    }
    case "map": return enter(c, run, pick);
    case "spoils":
    case "boon": {
      if (p.kind === "spoils") gainGold(run, p.gold);
      if (pick !== "skip") {
        const o = p.offers[Number(pick.split(":")[1])];
        take(c, run, o);
        note(run, `Took ${offerText(c, run, o)}.`);
      }
      if (p.kind === "boon") return nextAct(c, run);
      run.pending = { kind: "map" };
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
      } else if (verb === "upgrade") {
        const [cls, ab] = arg.split(":");
        const price = trainPrice(c, p, "upgrade");
        if (!upgrade(c, run, cls, ab)) return;
        spend(run, price);
        trained(c, p, "upgrade");
      }
      return;
    }
    case "campfire": {
      const k = cfg(c).campfire;
      const party = run.party.map((cls) => member(run, cls));
      const camp = bench(run).map((cls) => member(run, cls));
      const [verb, ...rest] = pick.split(":");
      if (verb === "leave") return void (run.pending = { kind: "map" });
      if (verb === "rest") (heal(c, run, party, k.hp, 0), note(run, "Rested."));
      else if (verb === "focus") (heal(c, run, party, 0, k.mp), note(run, "Focused."));
      else if (verb === "raise") {
        const m = member(run, rest[0]);
        m.ko = false;
        m.missHp = Math.floor((maxOf(c, run, m.cls, "max_hp") * (100 - k.revive)) / 100);
        note(run, `Raised the ${c.classes.get(m.cls)!.name}.`);
      } else if (verb === "learn") learn(c, run, rest[0], rest[1]);
      else if (verb === "upgrade") upgrade(c, run, rest[0], rest[1]);
      // Those standing at camp rest and focus (a share of each) whatever the party picks: those who were at camp when the
      // campfire was reached, not a member stepped back just for it (a playtester's loop), nor one raised here just now.
      const share = (k.camp ?? 100) / 100;
      heal(c, run, camp.filter((m) => (p.resting ?? camp.map((x) => x.cls)).includes(m.cls) && !(verb === "raise" && m.cls === rest[0])), Math.round(k.hp * share), Math.round(k.mp * share));
      p.used = true;
      return;
    }
    case "event": {
      const ev = eventOf(c, p.id);
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
      else if (p.what === "upgrade") upgrade(c, run, ...(pick.split(":") as [string, string]));
      else {
        const it = itemOf(run, pick)!;
        it.rarity = it.rarity === "common" ? "uncommon" : "rare";
        const rest = rogue(c).affixes.map((a) => a.id).filter((a) => !it.affixes.includes(a));
        it.affixes.push(rest[int(r(run, `temper:${pick}`), rest.length)]);
        registerGear(c, run);
        note(run, `Tempered: ${c.gear.get(it.uid)!.name}.`);
      }
      run.pending = { kind: "map" };
      return;
    }
    case "levelup": {
      const cls = p.queue[0];
      const m = member(run, cls);
      if (pick === "gold") (gainGold(run, cfg(c).levelGold ?? 0), note(run, `${c.classes.get(cls)!.name} takes ${cfg(c).levelGold} gold instead.`));
      else if (unlearned(c, m).includes(pick)) learn(c, run, cls, pick);
      else upgrade(c, run, cls, pick);
      const queue = p.queue.slice(1).filter((x) => run.roster.some((mm) => mm.cls === x));
      run.pending = queue.length ? { kind: "levelup", queue } : { kind: "map" };
      return;
    }
    case "region": {
      run.act++;
      beginAct(c, run, pick, true);
      const queue = run.roster.map((m) => m.cls).filter((cls) => unlearned(c, member(run, cls)).length || upgradable(member(run, cls)).length);
      run.pending = queue.length ? { kind: "levelup", queue } : { kind: "map" };
      return;
    }
    default:
      throw new Error(`nothing to choose at ${p.kind}`);
  }
}
/** A pick as a counter's name: the decision and what kind of thing was picked ("map:elite", "spoils:gear", "shop:buy:recruit"). */
function pickKind(run: RogueRun, pick: string): string {
  const p = run.pending;
  const [verb, arg] = pick.split(":");
  switch (p.kind) {
    case "map": return `map:${run.map.find((n) => n.id === pick)?.kind}`;
    case "spoils": case "boon": return pick === "skip" ? `${p.kind}:skip` : `${p.kind}:${p.offers[Number(arg)].kind}`;
    case "shop": return verb === "buy" ? `shop:buy:${p.stock[Number(arg)].offer.kind}` : `shop:${verb}`;
    case "choose": return `choose:${p.what}`;
    case "levelup": return "levelup";
    case "draft": return "draft";
    case "region": return `region:${pick}`;
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
    case "campfire":
      run.stats.campfires++;
      run.pending = { kind: "campfire", resting: bench(run) };
      return;
    case "shop":
      run.stats.shops++;
      run.pending = { kind: "shop", stock: shopStock(c, run, id), learn: true, upgrade: true };
      return;
    case "treasure": {
      const rng = r(run, `chest:${run.act}:${id}`);
      const t = cfg(c).treasure;
      run.pending = { kind: "treasure", offer: { kind: "gear", item: rollItem(c, run, rng, rollRarity(rng, t.rarity)) }, gold: between(rng, t.gold) };
      return;
    }
    case "event": {
      run.stats.events++;
      const all = rogue(c).events;
      const fresh = all.filter((e) => !run.seen.includes(e.id));
      const pool = fresh.length ? fresh : all;
      const ev = pool[int(r(run, `event:${run.act}:${id}`), pool.length)];
      run.seen.push(ev.id);
      run.pending = { kind: "event", id: ev.id };
      return;
    }
  }
}

/** An event option's effects, in order. A fight, a camp or a choice ends the list there and waits on it. */
function doOps(c: Content, run: RogueRun, ops: readonly EventOpT[], rng: Rng) {
  const party = () => run.party.map((cls) => member(run, cls));
  // What happens at once happens first; a choice, a camp or a fight comes last and waits (the Old Master's lesson cost
  // nothing when its HP came after the choice: an AI playtester).
  const waits = (op: EventOpT) => ["learn", "upgrade", "temper", "camp", "fight"].includes(op.op);
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
      case "mp": heal(c, run, party(), 0, op.pct); break;
      case "gear": { const o: Offer = { kind: "gear", item: rollItem(c, run, rng, op.rarity) }; take(c, run, o); note(run, `Gained ${offerText(c, run, o)}.`); break; }
      case "recruit": {
        const o = rollRecruit(c, run, rng);
        if (o?.kind === "recruit") (recruit(c, run, o.cls, op.hp ?? 100), note(run, `${c.classes.get(o.cls)!.name} joins.`));
        break;
      }
      case "formation": { const o = rollFormation(c, run, rng); if (o) (take(c, run, o), note(run, `Gained ${offerText(c, run, o)}.`)); break; }
      case "supply": {
        if (op.id === "phoenix" && run.roster.some((m) => m.ko)) {
          const m = run.roster.find((x) => x.ko)!;
          m.ko = false;
          m.missHp = Math.floor(maxOf(c, run, m.cls, "max_hp") / 2);
        } else take(c, run, { kind: "supply", id: op.id });
        break;
      }
      case "learn": if (learnOptions(c, run).length) return void (run.pending = { kind: "choose", what: "learn", why: "event" }); break;
      case "upgrade": if (upgradeOptions(run).length) return void (run.pending = { kind: "choose", what: "upgrade", why: "event" }); break;
      case "temper": if (run.items.some((it) => it.rarity === "common" || it.rarity === "uncommon")) return void (run.pending = { kind: "choose", what: "temper", why: "event" }); break;
      case "camp": return void (run.pending = { kind: "campfire", resting: bench(run) });
      case "fight": {
        const node = run.map.find((n) => n.id === run.at)!;
        const tier: FightTier = op.tier === "elite" ? "elite" : "fight";
        return void (run.pending = { kind: "fight", ...fightSpec(c, run, { ...node, floor: Math.max(node.floor, 3) }, tier) });
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
  if (o.kind === "tome") return `a tome: the ${c.classes.get(o.cls)!.name} learns ${c.abilities.get(o.ability)!.name}`;
  if (o.kind === "recruit") return `the ${c.classes.get(o.cls)!.name}`;
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
