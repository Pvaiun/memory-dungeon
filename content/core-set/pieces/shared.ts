/**
 * Step 5i, step 5: the statuses several content shares use, defined once (fill-rulings.md G2 to G4, and the counters each
 * share's fill names). The spine's one new word, Marked, and its seven counters: each counter is one status with one fixed
 * meaning, an icon with a number on its holder, kept for the fight. A piece decides who gets one and when; never what it does.
 */
import type { StatusT } from "../../../src/schema.js";

const both = (pct: number) => [{ tag: "physical", pct }, { tag: "magical", pct }];
const counter = (id: string, name: string, text: string, body: Partial<StatusT>): StatusT =>
  ({ id, name, text, label: "buff", show: "icon", stacking: "intensity", unremovable: true, ...body }) as StatusT;

/** The counters' numbers, from the fill (Cuts: weapons-physical; Spite, Tempo, Surge: armor-amulets; Heat G3; Fervor G4; Charge: Storm pike). */
export const COUNTER = {
  cuts: { pct: 2, cap: 25 },
  heat: { pct: 3, cap: 15 },
  spite: { thorns: 15, cap: 20 },
  tempo: { speed: 5, cap: 10 },
  surge: { pct: 5, cap: 10 },
  fervor: { pct: 5, cap: 20 },
  charge: { cap: 10 },
} as const;

export const counters: StatusT[] = [
  counter("cuts", "CUTS", "Deals 2% more damage with its hits for each Cut.", { boosts: both(COUNTER.cuts.pct), cap: COUNTER.cuts.cap }),
  counter("heat", "HEAT", "Deals 3% more damage with its hits for each stack.", { boosts: both(COUNTER.heat.pct), cap: COUNTER.heat.cap }),
  counter("spite", "SPITE", "Thorns up for each stack.", { stats: [{ stat: "thorns", flat: COUNTER.spite.thorns }], cap: COUNTER.spite.cap }),
  counter("tempo", "TEMPO", "Faster in everything for each stack; each hit taken spends half.", {
    stats: ["attack_speed", "cooldown_reduction", "cast_time_reduction"].map((stat) => ({ stat, flat: COUNTER.tempo.speed })),
    cap: COUNTER.tempo.cap, trigger: { on: { event: "hit_taken" } }, drop: { fraction: 0.5 },
  }),
  counter("surge", "SURGE", "Deals 5% more damage with its hits for each stack.", { boosts: both(COUNTER.surge.pct), cap: COUNTER.surge.cap }),
  counter("fervor", "FERVOR", "Deals 5% more damage with its hits for each stack, through a knockout.", { boosts: both(COUNTER.fervor.pct), cap: COUNTER.fervor.cap, survivesKO: true }),
  // Not unremovable: the Storm pike spends its Charges with a remove.
  counter("charge", "CHARGE", "Hits saved for one blow.", { cap: COUNTER.charge.cap, unremovable: false }),
];

/**
 * Marked (G2): a debuff on a foe, 14 ticks, Refresh. The party's basic attacks pick a Marked foe (by draw among several) inside the
 * Taunt rule; each unit keeps one Mark, so a new one it applies moves its old one. `focus` and `single` are the spec's X11
 * (build/engine-spec.md).
 */
export const MARKED = { duration: 14 } as const;
export const marked: StatusT = { id: "marked", name: "MARKED", text: "The party's basic attacks go to it.", label: "debuff", show: "icon", stacking: "refresh", duration: MARKED.duration, focus: true, single: true };

export const sharedStatuses: StatusT[] = [...counters, marked];
