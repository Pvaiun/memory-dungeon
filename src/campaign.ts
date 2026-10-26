/**
 * The campaign: a fixed road of runs, cleared one at a time, each paying a fixed
 * reward once and revealing the next (the progression experiment, steps/05-core-set/5a-campaign).
 *
 * Pure TypeScript with no Node APIs: the interface and the simulations both read it.
 * The data is the pack's `campaign` block; this file answers what's owned when a
 * node is reached, what a node pays, and whether a party meets a node's needs.
 */
import type { Content, Picker } from "./engine/run.js";
import type { CampaignNodeT, CampaignT, DungeonT, NeedT, Party } from "./schema.js";

/** What the player owns. Gear is owned or not: any number of units can wear a piece they own. */
export type Owned = { classes: string[]; formations: string[]; gear: string[] };

export function campaign(c: Content): CampaignT {
  if (!c.pack.campaign) throw new Error("this pack has no campaign");
  return c.pack.campaign;
}

/** The plain weapon of a class's first kind, which it arrives with. */
export function plainWeaponOf(c: Content, cls: string): string | undefined {
  const kind = c.classes.get(cls)?.weapons[0];
  return c.pack.gear.find((g) => g.slot === "weapon" && g.source === "starter" && g.weapon?.kind === kind)?.id;
}

/** What a node pays, with each new class's plain weapon added to the gear (unless already owned by then). */
export function rewardsOf(c: Content, i: number): Owned {
  const n = campaign(c).nodes[i];
  const had = ownedAt(c, i);
  const gear = [...n.rewards.gear];
  for (const cls of n.rewards.classes) {
    const w = plainWeaponOf(c, cls);
    if (w && !had.gear.includes(w) && !gear.includes(w)) gear.unshift(w);
  }
  return { classes: [...n.rewards.classes], formations: [...n.rewards.formations], gear };
}

/** What's owned on reaching node `i` (0-based): the start, plus the rewards of every node before it. `i` = node count is everything. */
export function ownedAt(c: Content, i: number): Owned {
  const cp = campaign(c);
  const o: Owned = { classes: [...cp.start.classes], formations: [...cp.start.formations], gear: [...cp.start.gear] };
  const add = (list: string[], id: string) => { if (!list.includes(id)) list.push(id); };
  for (const cls of cp.start.classes) { const w = plainWeaponOf(c, cls); if (w) add(o.gear, w); }
  for (let k = 0; k < Math.min(i, cp.nodes.length); k++) {
    const n = cp.nodes[k];
    for (const cls of n.rewards.classes) { add(o.classes, cls); const w = plainWeaponOf(c, cls); if (w) add(o.gear, w); }
    for (const f of n.rewards.formations) add(o.formations, f);
    for (const g of n.rewards.gear) add(o.gear, g);
  }
  return o;
}

/** Everything the content holds, as if owned: free play. */
export function everything(c: Content): Owned {
  return { classes: c.pack.classes.map((x) => x.id), formations: c.pack.formations.map((x) => x.id), gear: c.pack.gear.map((x) => x.id) };
}

const list = (names: string[]) => (names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`);
const either = (names: string[]) => (names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")} or ${names.at(-1)}`);

/** A need in plain words, as the menus show it. */
export function needText(c: Content, nd: NeedT): string {
  if ("includes" in nd) return `Bring the ${list(nd.includes.map((id) => c.classes.get(id)?.name ?? id))}`;
  if ("excludes" in nd) return `No ${either(nd.excludes.map((id) => c.classes.get(id)?.name ?? id))}`;
  if ("formation" in nd) return `Stand in ${c.formations.get(nd.formation)?.name ?? nd.formation}`;
  if ("armor" in nd) return nd.armor === "none" ? "Nobody wears armor" : `Everyone in ${nd.armor} armor`;
  if ("weapons" in nd) return `Every weapon a ${either(nd.weapons.map((k) => (c.weaponKinds.get(k)?.name ?? k).toLowerCase()))}`;
  return nd.size === 1 ? "Go alone" : `A party of ${["", "one", "two", "three", "four", "five"][nd.size] ?? nd.size} at most`;
}

/** Does this party meet this need? */
export function meets(c: Content, nd: NeedT, p: Party): boolean {
  const classes = p.units.map((u) => u.class);
  if ("includes" in nd) return nd.includes.every((id) => classes.includes(id));
  if ("excludes" in nd) return !nd.excludes.some((id) => classes.includes(id));
  if ("formation" in nd) return p.formation === nd.formation;
  if ("armor" in nd) return p.units.length > 0 && p.units.every((u) => {
    const g = u.gear.armor ? c.gear.get(u.gear.armor) : undefined;
    return nd.armor === "none" ? !g : g?.weight === nd.armor;
  });
  if ("weapons" in nd) return p.units.length > 0 && p.units.every((u) => {
    const g = u.gear.weapon ? c.gear.get(u.gear.weapon) : undefined;
    return !!g?.weapon?.kind && nd.weapons.includes(g.weapon.kind);
  });
  return p.units.length <= nd.size;
}

/** The node's needs this party doesn't meet, in words. Empty: it can enter (an empty party never can). */
export function unmet(c: Content, node: CampaignNodeT, p: Party): string[] {
  const out = node.needs.filter((nd) => !meets(c, nd, p)).map((nd) => needText(c, nd));
  if (!p.units.length) out.unshift("Bring a party");
  return out;
}

/**
 * The foes' change in a node's run, in words, or null. Only a change written for the player (a trial's "every foe
 * starts each fight Hasted"): the difficulty knob's HP and damage are enemy stats, which stay hidden.
 */
export function foesText(d: DungeonT): string | null {
  return d.foes?.text ?? null;
}

/** The index of a node by id, or -1. */
export const nodeIndex = (c: Content, id: string) => campaign(c).nodes.findIndex((n) => n.id === id);

/**
 * The simulations' choice at a decision: at a campfire, a fallen member back (raise, the one with the most max HP) when
 * anyone is down; else HP back (rest) when anyone standing is below a third of their max HP, or the standing party has less
 * of its HP left than of its MP; else MP back (focus). Anything else, the first option. (A playtester saw the average alone
 * pick FOCUS with the tank on a tenth of its HP.)
 */
export const simPick: Picker = (d, run) => {
  if (d.kind !== "campfire") return d.options[0];
  const party = run.party as unknown as { id: string; hp: number; mp: number; stats: Record<string, number> }[];
  const raise = d.options.filter((o) => o.startsWith("raise:")).map((o) => party.find((m) => m.id === o.slice(6))!).sort((a, b) => b.stats.max_hp - a.stats.max_hp);
  if (raise.length) return `raise:${raise[0].id}`;
  const up = party.filter((m) => m.hp > 0);
  if (up.some((m) => m.hp * 3 < m.stats.max_hp)) return "rest";
  const share = (k: "hp" | "mp") => up.reduce((a, m) => a + m[k] / Math.max(1, m.stats[`max_${k}`]), 0) / Math.max(1, up.length);
  return share("hp") <= share("mp") ? "rest" : "focus";
};
