/**
 * A simulated rogue player, for the rogue tuning: it drafts, routes, equips, shops, rests and picks spoils by rules
 * of thumb with a few dials, never by peeking at hidden numbers (encounters, enemy stats). Not a model of the director:
 * a fast, steady player whose win rate measures the run's difficulty, and whose dials (skill, greed, random picks)
 * measure what each decision is worth.
 *
 * Gear goes by the campaign's kit weights (src/sim/kits.ts); a legendary piece's status by a small table of what it
 * multiplies for each class. Class values start as rules of thumb and are replaced by what the simulations measure.
 */
import type { Content } from "./engine/run.js";
import { int, next, rngFor, type Rng } from "./engine/rng.js";
import { PROFILES, scoreGear } from "./sim/kits.js";
import { canEquip } from "./validate.js";
import {
  bench, choose, equip, itemGear, learnOptions, maxOf, member, options, registerGear, reachable, rogue, seat, setFormation, swap,
  useSupply, wearer, type Item, type MapNode, type Offer, type RogueRun, type Slot, SLOT_LIST,
} from "./rogue.js";

export type Dials = {
  /** Elite appetite: 0 avoids elites, 1 takes them when healthy, 2 seeks them. */
  greed: number;
  /** Share of decisions (spoils, route, draft, campfire, shop) taken at random among the options, to price a decision. */
  noise: number;
  /** Which decision kinds the noise applies to (all when empty). */
  noisy: string[];
  /** Never equips anything beyond the plain weapon: prices gear. */
  noGear: boolean;
  /** Class values, by id, in gear steps. */
  classValue: Record<string, number>;
};

/**
 * What a class is worth to a party, in gear steps: half its win rate as leader with random companions, in percent, plus one
 * (240 runs each, tuning round 6).
 */
export const CLASS_VALUE: Record<string, number> = {
  monk: 11, vampire: 10.5, knight: 7.5, bramble_knight: 7, valkyrie: 7, paladin: 6.5, pyromancer: 6, stormcaller: 6, geomancer: 5.5, ranger: 5,
  cleric: 4.5, hoplite: 4.5, assassin: 4.5, bard: 3.5, hexer: 3.5, frostweaver: 3,
};
export const DEFAULT_DIALS: Dials = { greed: 1, noise: 0, noisy: [], noGear: false, classValue: CLASS_VALUE };

const WALLS = new Set(["knight", "hoplite", "bramble_knight", "paladin", "geomancer"]);
const HEALERS = new Set(["cleric", "valkyrie", "bramble_knight", "vampire"]);
const CASTERS = new Set(["cleric", "paladin", "hexer", "frostweaver", "stormcaller", "geomancer", "pyromancer"]);

/** What a legendary piece's status is worth to a class, in gear steps. */
function statusValue(cls: string, id: string): number {
  const p = PROFILES[cls];
  const basic = p?.basic ?? 1;
  const dmg = Math.max(p?.w.attack ?? 0, p?.w.magic ?? 0, 1);
  const wall = WALLS.has(cls) ? 1 : 0;
  switch (id) {
    case "lg_ember": case "lg_rime": case "lg_sunder": case "lg_song": return 1.2 * basic;
    case "lg_cleave": return 1.6 * basic;
    case "lg_storm": return 2.2 * basic;
    case "lg_wounds": return 1 + 0.8 * (p?.w.crit_chance ?? 0);
    case "lg_judge": case "lg_execute": case "lg_fury": return 1.0 * dmg;
    case "lg_hunter": case "lg_cinder": case "lg_brittle": return 0.7 * dmg;
    case "lg_lantern": return 2 + wall;
    case "lg_soul": return CASTERS.has(cls) ? 2.5 : 1.5;
    case "lg_banner": return 3.5;
    case "lg_hourglass": return 2.5;
    case "lg_horn": return 3.5;
    case "lg_bell": return CASTERS.has(cls) ? 1.5 : 0.5;
    case "lg_idol": return cls === "geomancer" ? 3 : cls === "knight" ? 1.5 : 0.5;
    case "lg_coil": case "lg_frost": case "lg_briar": return 0.8 + 1.5 * wall;
    case "lg_spikes": return 0.5 + 2.5 * wall;
    case "lg_shade": return WALLS.has(cls) ? 0 : 1.5;
    case "lg_grave": return 1.5;
    default: return 0;
  }
}

/** How much a piece is worth to a class, in gear steps: its stats and swing by the kit weights, its statuses by the table. */
export function itemValue(c: Content, cls: string, uid: string): number {
  const g = c.gear.get(uid)!;
  if (!canEquip(c.classes.get(cls)!, g)) return -Infinity;
  return scoreGear(c, cls, uid, "plain") + (g.statuses ?? []).reduce((s, id) => s + statusValue(cls, id), 0);
}

// ─── Gear: who wears what ──────────────────────────────────────────────────

/**
 * Hands out every item: greedily, the biggest gain first, the party before those at camp. A weapon always stays on.
 * Returns the total value of what the party wears.
 */
export function kitUp(c: Content, run: RogueRun): number {
  registerGear(c, run);
  const order = [...run.party, ...bench(run)];
  const val = (cls: string, uid: string | undefined) => (uid ? itemValue(c, cls, uid) : 0);
  // Start from nothing but weapons, then fill: a weapon slot can't be empty, so weapons go first.
  for (let moves = 0; moves < 300; moves++) {
    let best: { cls: string; slot: Slot; uid: string; gain: number } | null = null;
    for (const cls of order) {
      const m = member(run, cls);
      const w = run.party.includes(cls) ? 1 : 0.3;
      for (const slot of SLOT_LIST) {
        const cur = val(cls, m.gear[slot]);
        for (const it of run.items) {
          if (m.gear[slot] === it.uid) continue;
          const g = c.gear.get(it.uid)!;
          if (g.slot !== slot) continue;
          const v = val(cls, it.uid);
          if (!Number.isFinite(v)) continue;
          const holder = wearer(run, it.uid);
          // Taking it from someone else costs what they lose; they get this member's old piece if it fits them.
          const was = m.gear[slot];
          const back = holder && was && canEquip(c.classes.get(holder)!, c.gear.get(was)!) ? val(holder, was) : 0;
          if (holder && slot === "weapon" && !back && !(was && canEquip(c.classes.get(holder)!, c.gear.get(was)!))) continue;
          const loss = holder ? (run.party.includes(holder) ? 1 : 0.3) * (val(holder, it.uid) - back) : 0;
          const gain = w * (v - cur) - loss;
          if (gain > 0.05 && (!best || gain > best.gain)) best = { cls, slot, uid: it.uid, gain };
        }
      }
    }
    if (!best) break;
    if (!equip(c, run, best.cls, best.slot, best.uid)) break;
  }
  return run.party.reduce((s, cls) => s + SLOT_LIST.reduce((t, slot) => t + val(cls, member(run, cls).gear[slot]), 0), 0);
}

// ─── Formation and seats ───────────────────────────────────────────────────

const EFFECT_VALUE: Record<string, number> = { blitz: 3, caravan: 3, last_stand: 1, escort: 1.5 };
function slotValue(c: Content, cls: string, stats: { stat: string; flat?: number }[] | undefined): number {
  const p = PROFILES[cls];
  let n = 0;
  for (const s of stats ?? []) {
    const step = s.stat === "max_hp" ? 500 : s.stat === "crit_chance" ? 4 : s.stat === "evasion" ? 20 : 1000;
    let w = p?.w[s.stat] ?? 0;
    if (s.stat === "aggro") w = WALLS.has(cls) ? 1.5 : -1.2;
    n += (w * (s.flat ?? 0)) / step;
  }
  return n;
}
/** The owned formation and seating with the best slot value for this party. */
export function arrange(c: Content, run: RogueRun) {
  const perms = (xs: string[]): string[][] => (xs.length <= 1 ? [xs] : xs.flatMap((x, i) => perms([...xs.slice(0, i), ...xs.slice(i + 1)]).map((p) => [x, ...p])));
  let best = { f: run.formation, order: run.party, v: -Infinity };
  const living = run.party.filter((cls) => !member(run, cls).ko).length;
  for (const fid of run.formations) {
    const f = c.formations.get(fid)!;
    for (const order of perms(run.party)) {
      let v = order.reduce((s, cls, i) => s + slotValue(c, cls, f.positions[i]?.stats), 0) + (EFFECT_VALUE[fid] ?? 0);
      if (fid === "last_stand" && living < 3) v -= 1;
      if (v > best.v + 1e-9) best = { f: fid, order, v };
    }
  }
  setFormation(c, run, best.f);
  seat(c, run, best.order);
}

// ─── Values ────────────────────────────────────────────────────────────────

const share = (c: Content, run: RogueRun, stat: "hp" | "mp", who = run.party) => {
  const ms = who.map((cls) => member(run, cls)).filter((m) => !m.ko);
  if (!ms.length) return 0;
  return ms.reduce((s, m) => {
    const max = maxOf(c, run, m.cls, stat === "hp" ? "max_hp" : "max_mp");
    return s + (max ? (max - (stat === "hp" ? m.missHp : m.missMp)) / max : 1);
  }, 0) / ms.length;
};
export const hpShare = (c: Content, run: RogueRun) => {
  const ms = run.party.map((cls) => member(run, cls));
  return ms.reduce((s, m) => s + (m.ko ? 0 : (maxOf(c, run, m.cls, "max_hp") - m.missHp) / maxOf(c, run, m.cls, "max_hp")), 0) / Math.max(1, ms.length);
};

function classScore(d: Dials, run: RogueRun, cls: string, party = run.party): number {
  let v = d.classValue[cls] ?? 3;
  const others = party.filter((x) => x !== cls);
  if (WALLS.has(cls) && !others.some((x) => WALLS.has(x))) v += 3;
  if (HEALERS.has(cls) && !others.some((x) => HEALERS.has(x))) v += 2.5;
  if (CASTERS.has(cls) && others.filter((x) => CASTERS.has(x)).length >= 2) v -= 2;
  return v;
}
/** What a recruit adds: its worth over the party's weakest, or a little as a reserve. */
function recruitValue(d: Dials, run: RogueRun, cls: string): number {
  const weakest = Math.min(...run.party.map((x) => classScore(d, run, x)));
  const as = Math.max(...run.party.map((x) => classScore(d, run, cls, run.party.map((y) => (y === x ? cls : y)))));
  return Math.max(0, as - weakest) * 0.8 + 1;
}
/** A learned ability, in gear steps: a third of a class's kit. */
const ABILITY_VALUE = 4;
function offerValue(c: Content, d: Dials, run: RogueRun, o: Offer): number {
  if (o.kind === "gear") {
    if (d.noGear) return 0.3;
    registerGear(c, run);
    c.gear.set(o.item.uid, itemGear(c, o.item));
    const slot = c.gear.get(o.item.uid)!.slot as Slot;
    const gain = Math.max(0, ...run.roster.map((m) => {
      const cur = m.gear[slot] ? itemValue(c, m.cls, m.gear[slot]!) : 0;
      return (run.party.includes(m.cls) ? 1 : 0.4) * (itemValue(c, m.cls, o.item.uid) - cur);
    }).filter(Number.isFinite));
    return gain + 0.3;
  }
  if (o.kind === "tome") return run.party.includes(o.cls) ? ABILITY_VALUE : 1.5;
  if (o.kind === "recruit") return recruitValue(d, run, o.cls);
  if (o.kind === "formation") return 2;
  return o.id === "phoenix" ? 1.8 : 1.4;
}

// ─── The route ─────────────────────────────────────────────────────────────

type Est = { h: number; v: number };
/** A rough walk of a path: HP spent and gained, and what the rooms are worth. Elites cost more and pay more; low HP makes fights frightening. */
function walk(c: Content, d: Dials, run: RogueRun, path: MapNode[], h0: number): number {
  let h = h0, v = 0, gold = run.gold;
  for (const n of path) {
    const danger = (cost: number) => (h - cost < 0.15 ? -8 : h - cost < 0.3 ? -3 : 0);
    switch (n.kind) {
      case "fight": v += 1.5 + danger(0.15); h -= 0.12; gold += 16; break;
      case "elite": v += (d.greed >= 1 ? 3.5 * d.greed : 0.5) + 2 * danger(0.3); h -= 0.25; gold += 35; break;
      case "campfire": { const heal = Math.min(0.4, 1 - h); v += heal > 0.2 ? heal * 10 : 2.5; h += heal > 0.2 ? heal : 0; break; }
      case "shop": v += gold >= 110 ? 3 : gold >= 60 ? 1.5 : 0.2; gold = Math.min(gold, 30); break;
      case "event": v += 1.6; break;
      case "treasure": v += 3; break;
      case "boss": v += h * 6; break;
    }
  }
  return v;
}
function bestPathValue(c: Content, d: Dials, run: RogueRun, from: MapNode, h: number): number {
  // Every path from `from` to the boss, by depth-first search (maps are small).
  const byId = new Map(run.map.map((n) => [n.id, n]));
  let best = -Infinity;
  const go = (n: MapNode, acc: MapNode[]) => {
    const path = [...acc, n];
    if (!n.next.length) return void (best = Math.max(best, walk(c, d, run, path, h)));
    for (const id of n.next) go(byId.get(id)!, path);
  };
  go(from, []);
  return best;
}

// ─── The player ────────────────────────────────────────────────────────────

export type Player = { decide(c: Content, run: RogueRun): string; prepare(c: Content, run: RogueRun): void };

export function aiPlayer(dials: Partial<Dials> = {}, seed = 1): Player {
  const d: Dials = { ...DEFAULT_DIALS, ...dials };
  const rng: Rng = rngFor(seed, "ai");
  const noisy = (kind: string) => d.noise > 0 && (!d.noisy.length || d.noisy.includes(kind)) && next(rng) < d.noise;
  const randomOf = (xs: string[]) => xs[int(rng, xs.length)];

  function prepare(c: Content, run: RogueRun) {
    if (!d.noGear) kitUp(c, run);
    arrange(c, run);
    // Supplies before a room: HP if the party is low, MP if casters are dry, a phoenix for the fallen.
    const down = run.party.filter((cls) => member(run, cls).ko);
    if (down.length && run.supplies.includes("phoenix")) useSupply(c, run, "phoenix", down[0]);
    if (run.supplies.includes("tonic") && hpShare(c, run) < 0.5) useSupply(c, run, "tonic");
    if (run.supplies.includes("ether") && share(c, run, "mp") < 0.35 && run.party.some((x) => CASTERS.has(x))) useSupply(c, run, "ether");
  }

  function decide(c: Content, run: RogueRun): string {
    const p = run.pending;
    const opts = options(c, run);
    if (opts.length === 1) return opts[0];
    if (noisy(p.kind)) {
      // A random pick, but never leaving a shop before looking (that's a pass, not a choice).
      return randomOf(opts);
    }
    switch (p.kind) {
      case "draft": {
        let best = opts[0], bv = -Infinity;
        for (const cls of opts) { const v = classScore(d, run, cls, [...run.party, cls]); if (v > bv) (bv = v), (best = cls); }
        return best;
      }
      case "map": {
        const h = hpShare(c, run);
        let best = opts[0], bv = -Infinity;
        for (const id of opts) { const v = bestPathValue(c, d, run, run.map.find((n) => n.id === id)!, h) + next(rng) * 0.01; if (v > bv) (bv = v), (best = id); }
        return best;
      }
      case "spoils":
      case "boon": {
        let best = "skip", bv = 0.25;
        for (const o of opts) {
          if (o === "skip") continue;
          const v = offerValue(c, d, run, p.offers[Number(o.split(":")[1])]);
          if (v > bv) (bv = v), (best = o);
        }
        return best;
      }
      case "treasure": return opts.includes("take") ? "take" : "leave";
      case "shop": return shopPick(c, d, run, opts);
      case "campfire": return campfirePick(c, d, run, opts);
      case "event": return eventPick(c, d, run, opts);
      case "choose": {
        if (p.what === "temper") {
          let best = opts[0], bv = -Infinity;
          for (const uid of opts) { const w = wearer(run, uid); const v = (w && run.party.includes(w) ? 2 : 0) + (itemOf2(run, uid)?.rarity === "uncommon" ? 1 : 0); if (v > bv) (bv = v), (best = uid); }
          return best;
        }
        return pickTraining(c, run, opts);
      }
      case "levelup": return opts[0];
      case "region": return opts[0];
      default: return opts[0];
    }
  }

  function pickTraining(c: Content, run: RogueRun, opts: string[]): string {
    // A party member's ability first, in its class's order; an upgrade of a first ability otherwise.
    const inParty = opts.filter((o) => run.party.includes(o.split(":")[0]));
    return (inParty.length ? inParty : opts)[0];
  }

  function campfirePick(c: Content, d: Dials, run: RogueRun, opts: string[]): string {
    // Swaps are free: someone at camp who's worth more than a party member (and standing) takes their place.
    for (const out of [...run.party]) {
      const m = member(run, out);
      const sc = (cls: string) => classScore(d, run, cls) * (member(run, cls).ko ? 0 : 1);
      const better = bench(run).filter((x) => !member(run, x).ko).sort((a, b) => sc(b) - sc(a))[0];
      if (better && sc(better) > sc(out) + (m.ko ? -100 : 1.5)) swap(c, run, out, better);
    }
    const raise = opts.filter((o) => o.startsWith("raise:") && run.party.includes(o.slice(6)));
    if (raise.length) return raise[0];
    const h = hpShare(c, run);
    const mp = share(c, run, "mp");
    const nextBoss = reachable(run).some((n) => n.kind === "boss");
    if (h < 0.55 || (nextBoss && h < 0.8)) return "rest";
    if (mp < 0.35 && run.party.filter((x) => CASTERS.has(x)).length >= 1) return "focus";
    const learn = opts.filter((o) => o.startsWith("learn:") && run.party.includes(o.split(":")[1]));
    if (learn.length) return learn[0];
    const up = opts.filter((o) => o.startsWith("upgrade:") && run.party.includes(o.split(":")[1]));
    if (up.length && h > 0.7) return up[0];
    return "rest";
  }

  function shopPick(c: Content, d: Dials, run: RogueRun, opts: string[]): string {
    if (run.pending.kind !== "shop") return "leave";
    const p = run.pending;
    // Sell what nobody wears and nobody could wear better than what they have.
    for (const o of opts) if (o.startsWith("sell:")) {
      const uid = o.slice(5);
      const useful = run.roster.some((m) => { const v = itemValue(c, m.cls, uid); return Number.isFinite(v) && v > 0.5; });
      if (!useful) return o;
    }
    let best = "leave", bv = 0;
    for (const o of opts) {
      const [verb, ...rest] = o.split(":");
      let v = 0, price = 0;
      if (verb === "buy") {
        const s = p.stock[Number(rest[0])];
        v = offerValue(c, d, run, s.offer);
        if (s.offer.kind === "supply") v = s.offer.id === "tonic" && hpShare(c, run) < 0.6 ? 3 : s.offer.id === "phoenix" && run.party.some((x) => member(run, x).ko) ? 4 : 0.8;
        price = s.price;
      } else if (verb === "learn") {
        if (!run.party.includes(rest[0])) continue;
        v = 4; price = rogue(c).config.prices.learn;
      } else if (verb === "upgrade") {
        if (!run.party.includes(rest[0])) continue;
        v = 2; price = rogue(c).config.prices.upgrade;
      } else continue;
      // Gold has no other use than this: buy anything worth a gear step or more, the most value for the gold first.
      const ratio = v / Math.max(1, price);
      if (v >= 1 && ratio > bv) (bv = ratio), (best = o);
    }
    return best;
  }

  function eventPick(c: Content, d: Dials, run: RogueRun, opts: string[]): string {
    if (run.pending.kind !== "event") return opts[0];
    const h = hpShare(c, run);
    const id = run.pending.id;
    const has = (o: string) => opts.includes(o);
    switch (id) {
      case "wounded_traveller": return has("take") && run.roster.length < 5 ? "take" : "rob";
      case "blood_shrine": return h > 0.75 && has("bleed") ? "bleed" : "pray";
      case "gambler": return "leave";
      case "forge": return run.items.some((it) => (it.rarity === "common" || it.rarity === "uncommon") && wearer(run, it.uid) && run.party.includes(wearer(run, it.uid)!) && !c.gear.get(it.base)?.id.startsWith("plain_")) ? "temper" : "scrap";
      case "old_master": return h > 0.6 && learnOptions(c, run).some((o) => run.party.includes(o.split(":")[0])) ? "learn" : has("polish") ? "polish" : "leave";
      case "ambush": return h > 0.65 ? "fight" : "run";
      case "spring": return share(c, run, "mp") < 0.6 || h < 0.8 ? "drink" : "bottle";
      case "strange_chest": return h > 0.6 ? "open" : "leave";
      case "camp": return "camp";
      case "pilgrims": return has("donate") && (h < 0.7 || run.party.some((x) => member(run, x).ko)) ? "donate" : "leave";
      case "drill_yard": return has("hire") && run.roster.length < 4 ? "hire" : "drill";
      case "standard": return "take";
      default: return opts[0];
    }
  }

  return { decide, prepare };
}
const itemOf2 = (run: RogueRun, uid: string): Item | undefined => run.items.find((i) => i.uid === uid);

/** Plays a whole run with a player. Returns the run. */
export function playRogue(c: Content, run: RogueRun, player: Player, autoFight: (c: Content, run: RogueRun) => unknown, limit = 2000): RogueRun {
  for (let i = 0; i < limit && run.pending.kind !== "over"; i++) {
    player.prepare(c, run);
    if (run.pending.kind === "fight") autoFight(c, run);
    else choose(c, run, player.decide(c, run));
  }
  return run;
}
