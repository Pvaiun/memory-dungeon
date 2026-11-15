/**
 * A new run (the leader, the draft, which abilities a recruit knows) and each act: its map of rooms and its boss.
 */
import type { Content } from "../engine/run.js";
import { int, next, type Rng, rngFor, shuffle } from "../engine/rng.js";
import type { RarityT, RogueFightT, RogueNodeKindT } from "../schema.js";
import { canEquip, startingWeapon } from "../validate.js";
import { cfg, type Item, type MapNode, type Member, note, type Pending, r, regionOf, rogue, ROGUE_VERSION, type RogueRun, type Slot } from "./state.js";
import { roomForRecruit } from "./offers.js";
import { registerGear } from "./fights.js";
import { maxOf, settle } from "./party.js";

// ─── A new run ──────────────────────────────────────────────────────────────

/**
 * What a class knows is rolled: `n` of its abilities at random, in its own order. A starting unit
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
export function freshCooldown(c: Content, ability: string): number {
  return Math.round(c.abilities.get(ability)!.cooldown * (100 - (cfg(c).fresh ?? 0))) / 100;
}
/** The plain weapon a class arrives with: its first one-handed kind's (startingWeapon). */
export function plainWeapon(c: Content, cls: string): string {
  return startingWeapon(c.pack, c.classes.get(cls)!)!.id;
}
/** A new item of a piece, at its rarity (the piece's own: `pieceRarity`). */
export function newItem(run: RogueRun, base: string, rarity: RarityT): Item {
  return { uid: `rg${run.seed % 100000}_${++run.uid}`, base, rarity };
}
/**
 * A class joins: its plain weapon, what it knows (rolled by the act's odds when not given), full HP and MP (or `hp` %), and
 * its abilities half charged. A cage's or a deserter's piece comes with it, worn if it fits. To the party if there's
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
export function draftPending(c: Content, run: RogueRun, n: number, left: number): Pending {
  const offers = draftOffers(c, run, n);
  return { kind: "draft", offers, left, known: Object.fromEntries(offers.map((cls) => [cls, rollKnown(c, r(run, `draft-known:${n}:${cls}`), cls, 1)])) };
}
function draftOffers(c: Content, run: RogueRun, n: number): string[] {
  const pool = c.pack.classes.map((k) => k.id).filter((id) => !run.roster.some((m) => m.cls === id));
  const offers = shuffle(r(run, `draft:${n}`), pool);
  const out = offers.slice(0, cfg(c).start.offers);
  // While the party has nobody who heals others, each draft offers one who does: HP carries over, and without a healer it
  // only leaks.
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
  // At least so many rooms of a kind an act, where the rules allow them (Musters and Drill grounds from floor 2), so routing
  // toward a recruit or a formation is a choice.
  const ensure = (kind: RogueNodeKindT, count: number, from: number) => {
    while (nodes.filter((n) => n.kind === kind).length < count) {
      const cands = nodes.filter((n) => !fixed.has(n.id) && n.floor >= from && n.kind === "fight" && ![...parents(n), ...n.next.map((id) => byId.get(id)!)].some((x) => x.kind === kind));
      if (!cands.length) return;
      cands[int(rng, cands.length)].kind = kind;
    }
  };
  for (const [kind, count] of Object.entries(m.ensure ?? { shop: 2, elite: 2 })) ensure(kind as RogueNodeKindT, count, kind === "muster" || kind === "drill" ? 2 : m.lateFrom);
  // Campfires are guaranteed only before the boss; mid-act campfires are added on ways up that pass none until `campPaths` %
  // of them pass one.
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
export function beginAct(c: Content, run: RogueRun, region: string, restore: boolean) {
  run.region = region;
  const reg = regionOf(c, region);
  ({ map: run.map, boss: run.boss } = actRoll(c, run, region, run.act));
  run.at = null;
  run.visited = [];
  run.met = [];
  run.floor = 0;
  // Cooldowns carry over: they aren't reset with HP and MP.
  if (restore) for (const m of run.roster) (m.missHp = 0), (m.missMp = 0), (m.ko = false);
  // A seat at camp comes with each new act (never fewer than the run already has).
  const by = cfg(c).benchByAct;
  const seats = by?.[Math.min(run.act, by.length) - 1];
  if (seats !== undefined && seats > seatsOf(c, run)) (run.seats = seats), note(run, `Room for 1 more at camp: ${seats} seats.`);
  note(run, `Act ${run.act}: ${reg.name}. ${run.boss.name} waits at the end.`);
}

/** The rooms the party can go to next. */
export function reachable(run: RogueRun): MapNode[] {
  if (run.at === null) return run.map.filter((n) => n.floor === 1);
  const at = run.map.find((n) => n.id === run.at)!;
  return at.next.map((id) => run.map.find((n) => n.id === id)!);
}
