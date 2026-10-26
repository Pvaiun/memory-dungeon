/**
 * The journey: the pack's campaign as the player walks it. Clearing a node
 * (winning its whole run) pays its rewards once and opens the next; what's
 * owned is the start plus every cleared node's rewards. Kept in localStorage
 * under its own key: the nodes cleared (a count, with their ids), what's been
 * seen (for NEW badges) and the mode, journey or free play (everything owned,
 * the old sandbox). Free play has no NEW badges and pays nothing.
 */
import { campaign, everything, nodeIndex, ownedAt, type Owned } from "../../src/campaign.js";
import type { CampaignNodeT } from "../../src/schema.js";
import { canEquip } from "../../src/validate.js";
import { c } from "./content.js";

export type Mode = "journey" | "free" | "rogue";
type Kind = "classes" | "formations" | "gear" | "nodes";
type Journey = { mode: Mode; cleared: number; ids: string[]; seen: Record<Kind, string[]> };

const KEY = "memory-dungeon.journey.v1";
/** The pack might lack a campaign while it's being regenerated: then everything is free play. */
export const hasJourney = !!c.pack.campaign;
export const nodes = (): CampaignNodeT[] => (hasJourney ? campaign(c).nodes : []);

const fresh = (): Journey => ({ mode: "journey", cleared: 0, ids: [], seen: { classes: [], formations: [], gear: [], nodes: [] } });
let j: Journey = load();

function load(): Journey {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fresh();
    const s = JSON.parse(raw) as Partial<Journey>;
    const f = fresh();
    return { mode: s.mode === "free" || s.mode === "rogue" ? s.mode : "journey", cleared: Number(s.cleared) || 0, ids: Array.isArray(s.ids) ? s.ids : [], seen: { ...f.seen, ...(s.seen ?? {}) } };
  } catch {
    return fresh();
  }
}
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(j));
  } catch {
    /* private mode: nothing to do */
  }
}

export const mode = (): Mode => (hasJourney || j.mode === "rogue" ? j.mode : "free");
export const onRogue = () => mode() === "rogue";
export const onJourney = () => mode() === "journey";
export function setMode(m: Mode) {
  j.mode = m;
  save();
}

/**
 * How many nodes are cleared. The count, unless the content changed under it: then the node after the
 * furthest cleared id that still exists (the road is linear, so everything before it counts as cleared).
 */
export function cleared(): number {
  const ns = nodes();
  const n = Math.min(j.cleared, ns.length);
  if (!n || j.ids.includes(ns[n - 1].id)) return n;
  const known = j.ids.map((id) => nodeIndex(c, id)).filter((i) => i >= 0);
  return known.length ? Math.max(...known) + 1 : n;
}
/** The node to clear next, or null when the journey is complete. */
export const currentIndex = (): number | null => (cleared() < nodes().length ? cleared() : null);
export const isCurrent = (id: string) => currentIndex() !== null && nodes()[currentIndex()!].id === id;

/** Records node `i` cleared, if it's the current one. Saved at once, so a reload can't lose it. */
export function clear(i: number): boolean {
  if (!onJourney() || i !== cleared()) return false;
  setCleared(i + 1);
  return true;
}
/** Sets the cleared count directly (reset, the designer's CLEAR NEXT, window.__journey). */
export function setCleared(n: number) {
  const ns = nodes();
  j.cleared = Math.max(0, Math.min(n, ns.length));
  j.ids = ns.slice(0, j.cleared).map((x) => x.id);
  cache = null;
  save();
}
/** Back to the first node with nothing seen. Keeps the mode. */
export function resetJourney() {
  j = { ...fresh(), mode: j.mode };
  cache = null;
  save();
}

// ─── What's owned ───
let cache: { key: string; o: Owned } | null = null;
/** What the player owns: the journey's, or everything in free play. */
export function owned(): Owned {
  const key = `${mode()}|${cleared()}`;
  if (cache?.key !== key) cache = { key, o: onJourney() ? ownedAt(c, cleared()) : everything(c) };
  return cache.o;
}
export const ownsClass = (id: string) => owned().classes.includes(id);
export const ownsFormation = (id: string) => owned().formations.includes(id);
export const ownsGear = (id: string) => owned().gear.includes(id);
/** What the journey starts with: never NEW. */
const START: Owned = hasJourney ? ownedAt(c, 0) : everything(c);

// ─── NEW badges ───
const unseen = (kind: Exclude<Kind, "nodes">, id: string) => onJourney() && owned()[kind].includes(id) && !START[kind].includes(id) && !j.seen[kind].includes(id);
export const newClass = (id: string) => unseen("classes", id);
export const newFormation = (id: string) => unseen("formations", id);
/** New gear counts only once some owned class can wear it, so a badge always leads somewhere. */
export const newGear = (id: string) => {
  const g = c.gear.get(id);
  return !!g && unseen("gear", id) && owned().classes.some((k) => { const def = c.classes.get(k); return !!def && canEquip(def, g); });
};
/** New gear this class can wear, in this slot or any. */
export const newGearFor = (cls: string, slot?: string) => {
  const def = c.classes.get(cls);
  return !!def && owned().gear.some((id) => { const g = c.gear.get(id); return !!g && (!slot || g.slot === slot) && canEquip(def, g) && newGear(id); });
};
export const newNode = (id: string) => onJourney() && isCurrent(id) && !j.seen.nodes.includes(id);
export const anyNewClass = () => owned().classes.some(newClass);
export const anyNewFormation = () => owned().formations.some(newFormation);
export const anyNewGear = () => owned().gear.some(newGear);

export function markSeen(kind: Kind, ids: string | string[]) {
  if (!onJourney()) return;
  const list = j.seen[kind];
  let changed = false;
  for (const id of typeof ids === "string" ? [ids] : ids) if (!list.includes(id)) (list.push(id), (changed = true));
  if (changed) save();
}
