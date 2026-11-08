/**
 * The statuses several content files use, defined once: the spine's seven counters. Each counter is one status with one
 * fixed meaning, an icon with a number on its holder, kept for the fight. A piece decides who gets one and when; never what
 * it does. Marked, which the pieces also use, is the vocabulary's.
 */
import type { StatusT } from "../../../src/schema.js";
import { vocabulary } from "../vocabulary.js";

const both = (pct: number) => [{ tag: "physical", pct }];
const counter = (id: string, name: string, text: string, body: Partial<StatusT>): StatusT =>
  ({ id, name, text, label: "buff", show: "icon", stacking: "intensity", unremovable: true, ...body }) as StatusT;

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

/** Marked is the vocabulary's (a class applies it: the Paladin's Condemn); the pieces and formations reach it here. */
export const marked: StatusT = vocabulary.find((s) => s.id === "marked")!;

export const sharedStatuses: StatusT[] = [...counters];
