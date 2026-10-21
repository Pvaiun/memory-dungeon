/**
 * Parties: building them from what a player owns, listing them, their colour,
 * and the small changes ("tweaks") a player tries between runs.
 */
import type { Content } from "../engine/run.js";
import { next, type Rng } from "../engine/rng.js";
import type { Party } from "../schema.js";
import { unmetConstraints } from "../validate.js";

/** What a player owns. Gear is a count per item. */
export type Owned = { classes: string[]; formations: string[]; gear: Record<string, number> };

export const starter = (c: Content): Owned => ({
  classes: [...c.pack.starter.classes],
  formations: [...c.pack.starter.formations],
  gear: Object.fromEntries(c.pack.starter.gear.map((g) => [g, 1])),
});

/** Everything in the content, for combat studies: as if the player owned it all. */
export const everything = (c: Content): Owned => ({
  classes: c.pack.classes.map((cl) => cl.id),
  formations: c.pack.formations.map((f) => f.id),
  gear: Object.fromEntries(c.pack.gear.map((g) => [g.id, 5])),
});

/**
 * A party's colour: the broad kind of party it is. FOR NOW, it's the set of
 * classes in it (step 3's placeholder, kept through step 4). Steps 5 and 8 to
 * 10 replace it, likely with the party's verbs weighted by efficacy.
 */
export type Colour = (c: Content, p: Party) => string;
export const classColour: Colour = (c, p) => [...new Set(p.units.map((u) => u.class))].sort().join("+");

/** A stable key for a party, for memory and caches. */
export const partyKey = (p: Party) =>
  `${p.formation}|${p.units.map((u) => `${u.class}[${u.abilities.join(",")}]{${Object.entries(u.gear).sort().map(([s, g]) => `${s}=${g}`).join(",")}}`).join(";")}`;

/** A class's display name. */
export const short = (c: Content, cls: string) => c.classes.get(cls)!.name;

/** "Warrior, Ranger, Cleric (Phalanx)". */
export function label(c: Content, p: Party): string {
  const f = c.pack.formations.find((x) => x.id === p.formation)?.name ?? p.formation;
  return `${p.units.map((u) => short(c, u.class)).join(", ")} (${f})`;
}

/** A party of these classes in this order, with positions, abilities and gear filled in. */
export function make(c: Content, owned: Owned, classes: readonly string[], formation: string, keep?: Party): Party {
  const f = c.pack.formations.find((x) => x.id === formation)!;
  const left = { ...owned.gear };
  const units = classes.map((cls, i) => {
    const old = keep?.units.find((u) => u.class === cls);
    return { class: cls, position: f.positions[i].id, abilities: old?.abilities ?? c.classes.get(cls)!.abilities.slice(0, c.pack.design.abilitiesEquipped), gear: {} as Record<string, string> };
  });
  // Units kept from `keep` keep their gear; new units get the best-ranked owned gear left.
  const kept = (cls: string) => keep?.units.find((v) => v.class === cls);
  for (const u of units) for (const [slot, g] of Object.entries(kept(u.class)?.gear ?? {})) if ((left[g] ?? 0) > 0) (u.gear[slot] = g), left[g]--;
  for (const u of units) {
    if (kept(u.class)) continue;
    for (const slot of slotsOf(c, u.class)) {
      const g = gearFor(c, u.class, slot).find((id) => (left[id] ?? 0) > 0);
      if (g) (u.gear[slot] = g), left[g]--;
    }
  }
  return { formation, units };
}

export function slotsOf(c: Content, cls: string): string[] {
  return c.pack.slots.filter((s) => !s.class || s.class === cls).map((s) => s.id);
}

/** Gear that fits this class's slot, best rank first. */
export function gearFor(c: Content, cls: string, slot: string): string[] {
  return c.pack.gear
    .filter((g) => g.slot === slot && (!g.class || g.class.includes(cls)))
    .sort((a, b) => (b.rank ?? 0) - (a.rank ?? 0))
    .map((g) => g.id);
}

export const fits = (c: Content, p: Party, dungeon: string, challenge?: string) =>
  p.units.length <= c.dungeons.get(dungeon)!.partySize.max && (!challenge || !unmetConstraints(c.pack, p, dungeon, challenge).length);

/** Every set of owned classes up to `cap`, in every owned formation (or just the first). */
export function all(c: Content, owned: Owned, cap: number, formations: "first" | "all" = "all"): Party[] {
  const classes = owned.classes;
  const fs = formations === "all" ? owned.formations : owned.formations.slice(0, 1);
  const out: Party[] = [];
  for (let mask = 1; mask < 1 << classes.length; mask++) {
    const chosen = classes.filter((_, i) => mask & (1 << i));
    if (chosen.length > cap) continue;
    for (const f of fs) out.push(make(c, owned, chosen, f));
  }
  return out;
}

export type Tweak = { kind: "unit" | "add" | "drop" | "formation" | "gear" | "abilities" | "order"; party: Party };

/** Every party one small change away: swap, add or drop a unit, or change the formation, a piece of gear, a unit's abilities or the order. */
export function tweaks(c: Content, owned: Owned, p: Party, cap: number): Tweak[] {
  const classes = p.units.map((u) => u.class);
  const out: Tweak[] = [];
  const spare = owned.classes.filter((s) => !classes.includes(s));
  for (let i = 0; i < classes.length; i++) for (const s of spare) out.push({ kind: "unit", party: make(c, owned, classes.map((x, j) => (j === i ? s : x)), p.formation, p) });
  if (classes.length < cap) for (const s of spare) out.push({ kind: "add", party: make(c, owned, [...classes, s], p.formation, p) });
  if (classes.length > 1) for (let i = 0; i < classes.length; i++) out.push({ kind: "drop", party: make(c, owned, classes.filter((_, j) => j !== i), p.formation, p) });
  for (const f of owned.formations) if (f !== p.formation) out.push({ kind: "formation", party: make(c, owned, classes, f, p) });
  for (let i = 1; i < classes.length; i++) {
    const order = [...classes];
    [order[0], order[i]] = [order[i], order[0]];
    out.push({ kind: "order", party: make(c, owned, order, p.formation, p) });
  }
  p.units.forEach((u, i) => {
    for (const slot of slotsOf(c, u.class)) {
      for (const g of [...gearFor(c, u.class, slot), ""]) {
        if (g === (u.gear[slot] ?? "")) continue;
        if (g && (owned.gear[g] ?? 0) - p.units.filter((v) => v.gear[slot] === g).length <= 0) continue;
        const q = structuredClone(p);
        if (g) q.units[i].gear[slot] = g;
        else delete q.units[i].gear[slot];
        out.push({ kind: "gear", party: q });
      }
    }
    const all = c.classes.get(u.class)!.abilities;
    for (const a of all) {
      if (u.abilities.includes(a)) continue;
      for (let j = 0; j < u.abilities.length; j++) {
        const q = structuredClone(p);
        q.units[i].abilities[j] = a;
        out.push({ kind: "abilities", party: q });
      }
    }
  });
  return out;
}

/** Pick one of `xs`, weighted. */
export function weighted<T>(rng: Rng, xs: readonly T[], weight: (x: T) => number): T {
  const total = xs.reduce((s, x) => s + weight(x), 0);
  let r = next(rng) * total;
  for (const x of xs) if ((r -= weight(x)) < 0) return x;
  return xs[xs.length - 1];
}
