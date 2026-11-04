/**
 * The free actions between rooms: gear, formation, seats, ability order, swaps with the camp, dismissing, supplies;
 * and healing and gold.
 */
import type { Content } from "../engine/run.js";
import { canEquip, handsOf } from "../validate.js";
import { combat, type Member as EngineMember } from "../engine/combat/rules.js";
import type { SupplyIdT } from "../schema.js";
import { bench, cfg, member, type Member, note, type RogueRun, type Slot, SLOT_LIST } from "./state.js";
import { FIGHT_DUNGEON, itemGear, itemOf, partyOf, registerGear, wearer } from "./fights.js";

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
  // An offhand needs a free hand (the interface shows the slot locked under a two-handed weapon).
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
  // A unit wears one mythic at most; a new one sends the old one to the bag.
  if (g.mythic) for (const s of SLOT_LIST) if (s !== slot && m.gear[s] && c.gear.get(m.gear[s]!)?.mythic) delete m.gear[s];
  m.gear[slot] = uid;
  settle(c, m);
  return true;
}
/** Does this member hold a two-handed weapon? */
export const twoHanded = (c: Content, m: Member) => !!m.gear.weapon && handsOf(c.pack, c.gear.get(m.gear.weapon)) === 2;
/** A two-handed weapon empties the offhand, which goes back to the bag. */
export function settle(c: Content, m: Member) {
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
 * moved off a fallen member brings nobody HP.
 */
export function holdCurrent(c: Content, run: RogueRun, who: string[], fn: () => boolean): boolean {
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
 * Any time outside a fight, one of the party and one at camp trade places; a party member steps back with nobody to replace
 * it (while someone stays); or one at camp fills an empty seat.
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
/** A piece nobody wears can be dropped from the bag any time outside a fight (more loot, and the bag stays readable). */
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
    // A potion or a tonic goes to one unit: the one named, else the party member with the least share left.
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
 * The max a heal by share counts from: the max now, but no more than it was when the last fight ended, so putting on a
 * +HP piece to REST or drink a tonic, then taking it off, doesn't heal the piece's share for free.
 */
function healMax(c: Content, run: RogueRun, m: Member, stat: "max_hp" | "max_mp"): number {
  const now = maxOf(c, run, m.cls, stat);
  const last = m.lastMax?.[stat === "max_hp" ? "hp" : "mp"];
  return last === undefined ? now : Math.min(now, last);
}
export function heal(c: Content, run: RogueRun, who: Member[], hpPct: number, mpPct: number) {
  for (const m of who) {
    if (m.ko) continue;
    if (hpPct) m.missHp = Math.max(0, Math.min(maxOf(c, run, m.cls, "max_hp") - 1, m.missHp - Math.floor((healMax(c, run, m, "max_hp") * hpPct) / 100)));
    if (mpPct) m.missMp = Math.max(0, Math.min(maxOf(c, run, m.cls, "max_mp"), m.missMp - Math.floor((healMax(c, run, m, "max_mp") * mpPct) / 100)));
  }
}
export function gainGold(run: RogueRun, n: number) {
  run.gold = Math.max(0, run.gold + n);
  if (n > 0) run.stats.gold += n;
}
