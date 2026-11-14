/**
 * A fight's numbers, read from its log: for each unit, the damage it dealt and took and the healing it did, each action's
 * uses and output, the statuses it laid and when it went down; and what each status that shows did, by the side it served.
 * The fight's end shows the party's in a table (battle.ts), and its recap the rest (recap.ts). Pure: no DOM.
 *
 * Whose a number is:
 * - a hit, a rider or an extra strike is its attacker's, under the action (or piece, or passive) it came from;
 * - a status that shows as an icon (Burn, Regen, Shield) keeps its own: an Intensity status's stacks have no single
 *   applier, and its damage is its holder's (docs/rules.md). It serves the side it helps: damage to the foes, and healing
 *   and soaking on the party, are the party's;
 * - a hidden status (Thorns, a piece's or a passive's working) is part of a unit's kit: its applier's, else its actor's;
 * - a hit's amount includes what a Shield soaked: it counts in the damage dealt and taken, and the soak again under Shield.
 */
import type { Entry } from "../../../src/engine/log.js";
import { SUBTICKS } from "../../../src/schema.js";

export type Side = "party" | "enemy";
/** An action's or a source's output: uses (actions only), damage to the other side, healing. */
export type Source = { uses: number; dmg: number; heal: number };
export type UnitTally = {
  dealt: number; taken: number; healed: number;
  /** The tick it went down, if it's still down at the end. */
  down: number | null;
  /** By action or source id, in the order first seen. */
  by: Map<string, Source>;
  /** Statuses it laid, on anyone: stacks added for an Intensity status (a Shield's in HP), applications for others. */
  laid: Map<string, number>;
};
export type StatusTally = { dmg: number; heal: number; soak: number };
export type Tally = {
  units: Map<string, UnitTally>;
  /** What the statuses that show did for each side: the party's (damage to foes, healing and soaking on the party), the foes'. */
  served: Record<Side, Map<string, StatusTally>>;
};
export type TallyCtx = {
  side: (unit: string) => Side | undefined;
  /** The status shows as an icon. */
  shown: (status: string) => boolean;
  /** The status that soaks (Shield). */
  absorb: string;
};

const other = (s: Side | undefined): Side => (s === "enemy" ? "party" : "enemy");

/** The last fight in the log, from its start to now. */
export function tallyFight(log: readonly Entry[], x: TallyCtx): Tally {
  let start = log.length - 1;
  while (start > 0 && log[start].t !== "fight_start") start--;
  const units = new Map<string, UnitTally>();
  const served: Tally["served"] = { party: new Map(), enemy: new Map() };
  const unit = (id: string) => {
    let u = units.get(id);
    if (!u) units.set(id, (u = { dealt: 0, taken: 0, healed: 0, down: null, by: new Map(), laid: new Map() }));
    return u;
  };
  const source = (u: UnitTally, id: string) => {
    let s = u.by.get(id);
    if (!s) u.by.set(id, (s = { uses: 0, dmg: 0, heal: 0 }));
    return s;
  };
  const status = (side: Side, id: string) => {
    let s = served[side].get(id);
    if (!s) served[side].set(id, (s = { dmg: 0, heal: 0, soak: 0 }));
    return s;
  };
  const str = (v: unknown) => (v === undefined || v === null ? null : String(v));
  for (let i = start; i < log.length; i++) {
    const e = log[i];
    switch (e.t) {
      case "act":
        source(unit(String(e.by)), String(e.act)).uses++;
        break;
      case "dmg": {
        const amount = Number(e.amount) || 0;
        if (amount <= 0) break;
        const target = String(e.target), ts = x.side(target), src = String(e.src);
        // A hit owed is taken when the debt comes due, so it counts as taken then, not twice.
        if (e.word !== "OWED") unit(target).taken += amount;
        const soaked = Number(e.soaked) || 0;
        if (soaked > 0) status(ts ?? "party", x.absorb).soak += soaked;
        const fromStatus = e.part === "pulse" || e.part === "reaction";
        const credit = fromStatus ? (str(e.from) ?? str(e.by)) : str(e.by);
        if ((fromStatus && x.shown(src)) || !credit || x.side(credit) === ts) {
          if (fromStatus) status(other(ts), src).dmg += amount;
          break;
        }
        const u = unit(credit);
        u.dealt += amount;
        source(u, src).dmg += amount;
        break;
      }
      case "heal": {
        const amount = Number(e.amount) || 0;
        if (amount <= 0) break;
        const ts = x.side(String(e.target)), src = String(e.src);
        const fromStatus = e.part === "pulse" || e.part === "reaction";
        const credit = fromStatus ? (str(e.from) ?? str(e.by)) : str(e.by);
        if ((fromStatus && x.shown(src)) || !credit) {
          status(ts ?? "party", src).heal += amount;
          break;
        }
        const u = unit(credit);
        u.healed += amount;
        source(u, src).heal += amount;
        break;
      }
      case "status": {
        const by = str(e.by), id = String(e.status);
        if (!by || !x.shown(id)) break;
        const n = e.added === undefined ? 1 : Number(e.added) || 0;
        if (n <= 0) break;
        const u = unit(by);
        u.laid.set(id, (u.laid.get(id) ?? 0) + n);
        break;
      }
      case "down":
        unit(String(e.unit)).down = Math.floor((Number(e.at) || 0) / SUBTICKS);
        break;
      case "revive":
        unit(String(e.unit)).down = null;
        break;
    }
  }
  return { units, served };
}
