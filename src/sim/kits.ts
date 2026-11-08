/**
 * Sensible builds from everything in the pack, for the simulations: a kit per class (a weapon, armor and amulet
 * scored against what its kit multiplies) and a formation with its slots handed out by the same scores. Not a
 * player model: a fast way to cover the space a thoughtful player would try.
 */
import type { Content } from "../engine/run.js";
import type { NumT, Party } from "../schema.js";
import { canEquip } from "../validate.js";

/**
 * What each class's kit multiplies, per gear step (an amount stat's +1, Crit chance's 5%, a special stat at medium).
 * `basic` is how much its basic attack is worth (Refrain, Phalanx, Kindling, Arc and Iron palm ride on it). Casters
 * weigh MP regen as much as Attack.
 * Aggro is negative for the fragile, who want fewer hits, and positive for the walls.
 */
export const PROFILES: Record<string, { w: Record<string, number>; basic: number }> = {
  knight: { w: { max_hp: 3, defense: 3, aggro: 1, attack: 0.5 }, basic: 0.5 },
  cleric: { w: { attack: 2.5, mp_regen: 3, max_mp: 1.5, max_hp: 1.5, crit_chance: 0.5, defense: 0.5, aggro: -1 }, basic: 1 },
  ranger: { w: { attack: 3, crit_multiplier: 1, crit_chance: 1, accuracy: 0.5, max_hp: 1.2, double_strike: 1, defense: 0.5, aggro: -0.5 }, basic: 2 },
  bramble_knight: { w: { thorns: 3, max_hp: 2.5, defense: 1.5, aggro: 1, attack: 0.5 }, basic: 0.5 },
  hoplite: { w: { attack: 2, defense: 2, max_hp: 2, crit_multiplier: 1, aggro: 0.5, crit_chance: 0.5 }, basic: 2.5 },
  paladin: { w: { attack: 2.5, defense: 1.5, max_hp: 1.5, max_mp: 1, mp_regen: 2 }, basic: 1 },
  valkyrie: { w: { attack: 2.5, max_hp: 1.5, defense: 0.8, mp_regen: 1 }, basic: 1 },
  bard: { w: { attack: 2, mp_regen: 2, max_hp: 1.5, defense: 0.5, aggro: -1 }, basic: 1 },
  hexer: { w: { attack: 2, mp_regen: 3, max_mp: 1, siphon: 1.5, max_hp: 1.5, aggro: -1 }, basic: 1.5 },
  monk: { w: { attack: 3, double_strike: 2, evasion: 1.5, crit_chance: 1, max_hp: 1, defense: 0.5 }, basic: 2.5 },
  assassin: { w: { crit_chance: 3, crit_multiplier: 2, attack: 2, evasion: 1, max_hp: 1, aggro: -0.5 }, basic: 1.5 },
  vampire: { w: { max_hp: 2.5, attack: 2, lifesteal: 2, defense: 0.8 }, basic: 1.5 },
  pyromancer: { w: { attack: 3, mp_regen: 3, max_mp: 1.5, max_hp: 1.5, aggro: -1, defense: 0.3 }, basic: 1.5 },
  frostweaver: { w: { attack: 3, mp_regen: 2.5, max_mp: 1, max_hp: 1.5, aggro: -0.7, defense: 0.3 }, basic: 1 },
  stormcaller: { w: { attack: 3, max_hp: 1.5, mp_regen: 2.5, max_mp: 1, aggro: -1, defense: 0.3 }, basic: 2 },
  geomancer: { w: { defense: 3, attack: 1.5, crit_chance: 2, crit_multiplier: 1.5, max_hp: 1.5, mp_regen: 2 }, basic: 1 },
};

/** One gear step of each stat. */
const STEP: Record<string, number> = { crit_chance: 5, evasion: 20, accuracy: 20, double_strike: 25, lifesteal: 15, siphon: 10, crit_multiplier: 50, thorns: 150, aggro: 10 };
const stepOf = (stat: string) => STEP[stat] ?? (stat.startsWith("resist") ? 30 : stat === "max_hp" ? 500 : 1000);

/** A style shifts the weights: sturdy doubles HP and Defense, sharp the damage stats. */
export type Style = "plain" | "sturdy" | "sharp";
export const STYLES: Style[] = ["plain", "sturdy", "sharp"];
const DAMAGE = new Set(["attack", "crit_chance", "crit_multiplier", "double_strike", "thorns"]);

function weight(cls: string, stat: string, style: Style): number {
  const p = PROFILES[cls];
  const base = p?.w[stat] ?? (stat.startsWith("resist") ? 0.15 : 0);
  if (style === "sturdy" && (stat === "max_hp" || stat === "defense" || stat === "evasion")) return base * 2 + (base ? 0 : 0.5);
  if (style === "sharp" && DAMAGE.has(stat)) return base * 1.6;
  return base;
}

const at = (n: NumT | undefined, base: Record<string, number>) =>
  typeof n === "number" ? n : n ? (n.base ?? 0) + n.scale.reduce((a, t) => a + t.ratio * (t.stat ? base[t.stat] ?? 0 : 0), 0) : 0;

/** How much a piece is worth to a class, in gear steps. */
export function scoreGear(c: Content, cls: string, id: string, style: Style): number {
  const g = c.gear.get(id)!;
  const k = c.classes.get(cls)!;
  let n = 0;
  for (const s of g.stats ?? []) n += (weight(cls, s.stat, style) * (s.flat ?? 0)) / stepOf(s.stat);
  if (g.weapon) {
    // The basic attack's damage per tick, against a plain sword in an Attack-3 hand (about 110 a tick).
    const base: Record<string, number> = { ...k.stats };
    for (const s of g.stats ?? []) base[s.stat] = (base[s.stat] ?? 0) + (s.flat ?? 0);
    const kind = g.weapon.kind ? c.weaponKinds.get(g.weapon.kind) : undefined;
    const cd = g.weapon.cooldown ?? kind?.cooldown ?? 10;
    n += ((PROFILES[cls]?.basic ?? 1) * at(g.weapon.amount, base)) / cd / 110;
    // A class's first kind is what its passive was written around: a small nudge toward it.
    if (g.weapon.kind === k.weapons[0]) n += 0.3;
  }
  return n;
}

/** The pieces of the pack a class can wear in a slot. */
function fitting(c: Content, cls: string, slot: string): string[] {
  const k = c.classes.get(cls)!;
  return c.pack.gear.filter((g) => g.slot === slot && canEquip(k, g)).map((g) => g.id);
}

/** The best kit for a class in a style, or null when it has no weapon to wear. */
function kit(c: Content, cls: string, style: Style): Record<string, string> | null {
  const out: Record<string, string> = {};
  for (const slot of ["weapon", "armor", "amulet"]) {
    const fits = fitting(c, cls, slot);
    if (!fits.length) {
      if (slot === "weapon") return null;
      continue;
    }
    let best = fits[0], bs = -Infinity;
    for (const id of fits) {
      const s = scoreGear(c, cls, id, style);
      if (s > bs) (bs = s), (best = id);
    }
    // Armor and amulets are worn only when they're worth something to this class.
    if (slot === "weapon" || bs > 0) out[slot] = best;
  }
  return out;
}

/** How much a unit gains from a formation slot, by the same weights. */
function slotScore(c: Content, cls: string, pos: { stats?: { stat: string; flat?: number }[] }, style: Style) {
  let n = 0;
  for (const s of pos.stats ?? []) n += (weight(cls, s.stat, style) * (s.flat ?? 0)) / stepOf(s.stat);
  return n;
}

const PERMS3 = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
function perms(n: number): number[][] {
  if (n === 3) return PERMS3;
  if (n === 2) return [[0, 1], [1, 0]];
  return [[...Array(n).keys()]];
}

/** The classes in the order that best fits the formation's slots. */
export function seat(c: Content, classes: readonly string[], formation: string, style: Style): string[] {
  const f = c.formations.get(formation)!;
  let best = [...classes], bs = -Infinity;
  for (const p of perms(classes.length)) {
    const order = p.map((i) => classes[i]);
    const s = order.reduce((a, cls, i) => a + slotScore(c, cls, f.positions[i], style), 0);
    if (s > bs + 1e-9) (bs = s), (best = order);
  }
  return best;
}

/**
 * The order abilities are slotted in (the first starts a fight most charged): the documents' order, or the shortest
 * cooldown first, which casts most.
 */
export type Order = "doc" | "quick";
export const ORDERS: Order[] = ["doc", "quick"];
export function slotted(c: Content, cls: string, order: Order = "doc"): string[] {
  const own = c.classes.get(cls)!.abilities.slice(0, c.pack.design.abilitiesEquipped);
  return order === "doc" ? own : own.slice().sort((a, b) => c.abilities.get(a)!.cooldown - c.abilities.get(b)!.cooldown);
}

/** A whole build: seated, kitted, abilities in the documents' order (or the shortest cooldown first). Null if some class has no weapon. */
export function makeBuild(c: Content, classes: readonly string[], formation: string, style: Style, order?: string[], abOrder: Order = "doc"): Party | null {
  const f = c.formations.get(formation)!;
  const seated = order ?? seat(c, classes, formation, style);
  const units = [];
  for (let i = 0; i < seated.length; i++) {
    const cls = seated[i];
    const gear = kit(c, cls, style);
    if (!gear) return null;
    units.push({ class: cls, position: f.positions[i].id, abilities: slotted(c, cls, abOrder), gear });
  }
  return { formation, units };
}

/** Every combination of k from a list. */
export function combos<T>(xs: readonly T[], k: number): T[][] {
  const out: T[][] = [];
  const go = (start: number, acc: T[]) => {
    if (acc.length === k) return void out.push([...acc]);
    for (let i = start; i < xs.length; i++) (acc.push(xs[i]), go(i + 1, acc), acc.pop());
  };
  go(0, []);
  return out;
}
