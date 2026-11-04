/**
 * What a run can be offered: the stock of pieces and mythics, and every offer (gear, tomes, recruits, formations,
 * supplies), their prices, the shop, and taking one.
 */
import type { FormationRarityT, GearT, RarityT, SupplyIdT } from "../schema.js";
import type { Content } from "../engine/run.js";
import { int, next, type Rng, shuffle } from "../engine/rng.js";
import { canEquip } from "../validate.js";
import { cfg, type FightTier, type Item, type Offer, type Pending, r, type RogueRun, type ShopSlot, type Slot, SLOT_LIST } from "./state.js";
import { newItem, recruit, recruitKnown, rollKnown, seatsOf } from "./acts.js";
import { learn, unlearned } from "./training.js";
import { bag, bagRoom, itemGear, registerGear, supplyName } from "./fights.js";

// ─── The stock: the pieces a run can be offered ────────────────────────────

export const RARITIES = ["common", "uncommon", "rare", "legendary"] as const;
type Priced = (typeof RARITIES)[number];
/** A mythic is priced as a legendary. */
export const priced = (rar: RarityT): Priced => (rar === "mythic" ? "legendary" : rar);
/** A piece's rarity: its own; a plain weapon, which has none, is common. */
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
 * The stock, every piece a run can be offered: the pack's pieces but the starters, each at its own rarity (a piece without
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
export const piecesAt = (c: Content, slot: Slot, kind: string, rar: RarityT) => stockOf(c).at.get(`${slot}|${kind}|${rar}`) ?? [];
/** Is there a piece to roll (at any rarity: an offer with none at its own falls to the nearest one that has some)? */
export const canRoll = (c: Content, _rarity?: RarityT) => stockOf(c).all.length > 0;
export const rollRarity = (rng: Rng, odds: Partial<Record<RarityT, number>>): RarityT => {
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
export const heldLegendaries = (run: RogueRun) => new Set(run.items.filter((it) => it.rarity === "legendary").map((it) => it.base));
/** Rarities from `rar` outward: the nearest first, down before up. */
function nearest(rar: RarityT): Priced[] {
  const i = RARITIES.indexOf(priced(rar));
  return [i, ...[1, 2, 3].flatMap((d) => [i - d, i + d])].filter((j) => j >= 0 && j < RARITIES.length).map((j) => RARITIES[j]);
}

/**
 * An offered piece. The slot first (the config's `slots` weights), then a class: `forCls` if given; for an elite's aimed
 * offer (`forParty`), someone in the party; for an `open` offer (spoils, chests), a class not in the roster
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
 * A mythic for a boss's boon: one for a party member's class that the run doesn't hold, else for one at camp; none when
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
export const roomForRecruit = (c: Content, run: RogueRun) => run.roster.length < cfg(c).party + seatsOf(c, run);
/**
 * A recruit offer: a class not in the roster (a class a bagged legendary is for three times as likely), knowing what it will
 * know when it joins (rolled now, shown on its card; at least `min` abilities). Offered with a full roster too, since
 * someone can be sent home to make room.
 */
export function rollRecruit(c: Content, run: RogueRun, rng: Rng, taken: string[] = [], min = 1, n?: number): Offer | null {
  const pool = c.pack.classes.map((k) => k.id).filter((id) => !run.roster.some((m) => m.cls === id) && !taken.includes(id));
  if (!pool.length) return null;
  // A class that could wear a legendary piece nobody in the roster can is three times as likely: a piece found for a class
  // the run doesn't have makes that class worth hoping for, and the odds answer.
  const waiting = bag(run).filter((it) => it.rarity === "legendary" && !run.roster.some((m) => canEquip(c.classes.get(m.cls)!, c.gear.get(it.uid) ?? itemGear(c, it))));
  const weight = (id: string) => (waiting.some((it) => canEquip(c.classes.get(id)!, c.gear.get(it.uid) ?? itemGear(c, it))) ? 3 : 1);
  let x = int(rng, pool.reduce((t, id) => t + weight(id), 0));
  const cls = pool.find((id) => (x -= weight(id)) < 0) ?? pool[pool.length - 1];
  return { kind: "recruit", cls, known: rollKnown(c, rng, cls, n ?? recruitKnown(c, run, rng, min)) };
}
/** `n` recruit offers, all different. */
export function rollRecruits(c: Content, run: RogueRun, rng: Rng, n: number, min = 1, known?: number): Offer[] {
  const out: Offer[] = [];
  for (let i = 0; i < n; i++) {
    const o = rollRecruit(c, run, rng, out.map((x) => (x as { cls: string }).cls), min, known);
    if (o) out.push(o);
  }
  return out;
}
/** A formation's rarity: its own (`Formation.rarity`); one without is common. */
export const formationRarity = (c: Content, id: string): FormationRarityT => c.formations.get(id)?.rarity ?? "common";
/**
 * A formation offer, of a rarity rolled by the act's odds (or `rarity` if given, or no lower than `min`); with none left of that
 * rarity, the nearest one that has some.
 */
export function rollFormation(c: Content, run: RogueRun, rng: Rng, taken: string[] = [], rarity?: RarityT, min?: FormationRarityT): Offer | null {
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
export function rollFormations(c: Content, run: RogueRun, rng: Rng, n: number, min?: FormationRarityT): Offer[] {
  const out: Offer[] = [];
  for (let i = 0; i < n; i++) {
    const o = rollFormation(c, run, rng, out.map((x) => (x as { id: string }).id), undefined, min);
    if (o) out.push(o);
  }
  return out;
}
export const SUPPLIES: SupplyIdT[] = ["potion", "tonic", "phoenix"];

/**
 * A fight's spoils: a pick of `count`. Most picks are gear (a third of it for classes not in the
 * roster); a share of fights (`mixed`) mixes kinds: one piece, then another kind, then either. No supplies (every won fight
 * already drops one) and no recruits from regular fights (they have their own rooms).
 */
export function spoilOffers(c: Content, run: RogueRun, tier: FightTier, node: string): Offer[] {
  const s = cfg(c).spoils[tier === "elite" ? "elite" : "fight"];
  const rng = r(run, `spoils:${run.act}:${node}`);
  const out: Offer[] = [];
  // No two offers of the same piece.
  const taken = () => out.flatMap((x) => (x.kind === "gear" || x.kind === "bundle" ? [x.item.base] : []));
  const gear = (): Offer | null => {
    // The first `aimed` offers are pieces someone in the party can wear (an elite's pick).
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
    // A sealed piece, rare or better, or a common piece with a supply.
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
    // With no piece to roll, a pick that would be gear is nothing.
    const x = o ?? gear();
    if (x) out.push(x);
  }
  return out;
}
/**
 * The boss's boon: a pick of `count` from a legendary piece, a formation (rare or better), a recruit (knowing two or three)
 * and a seat at camp while there's one to win; with four on offer, one of them (at random) isn't. The boons that open the acts
 * in `boon.mythic` offer a mythic in the legendary piece's place, for a roster member's class (the party first) that the run
 * doesn't hold, while one is left; it always stays in the pick.
 */
export function boonOffers(c: Content, run: RogueRun): Offer[] {
  const rng = r(run, `boon:${run.act}`);
  // With no legendary to roll, its place is the next option's, or nothing.
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
export function trained(c: Content, p: ShopPending, verb: "learn" | "upgrade") {
  p.trained = (p.trained ?? 0) + 1;
  if (cfg(c).prices.trainStep === undefined) p[verb] = false;
}
export const sellPrice = (c: Content, it: Item) => Math.floor((cfg(c).prices[priced(it.rarity)] * cfg(c).prices.sell) / 100);
export function shopStock(c: Content, run: RogueRun, node: string): ShopSlot[] {
  const s = cfg(c).shop;
  const rng = r(run, `shop:${run.act}:${node}`);
  const out: Offer[] = [];
  const count = (rar: Priced) => (rar === "legendary" && s.legendaryByAct ? s.legendaryByAct[Math.min(run.act, s.legendaryByAct.length) - 1] : s.gear[rar]);
  // No piece twice on the shelf.
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
