/**
 * The statuses several content files use, defined once: the six counters, and the two markers that order healing past
 * full. Each counter is one status with one fixed meaning, an icon with a number on its holder, kept for the fight unless a
 * card spends it. A card decides who gets a stack and when, and says in a bracket what a stack does. One event adds one
 * stack to a holder, however many of its cards count it. Marked, which the pieces also use, is the vocabulary's.
 */
import type { StatusT } from "../../../src/schema.js";
import { vocabulary } from "../vocabulary.js";

const counter = (id: string, name: string, text: string, body: Partial<StatusT>): StatusT =>
  ({ id, name, text, label: "buff", show: "icon", stacking: "intensity", unremovable: true, oncePerEvent: true, ...body }) as StatusT;

/** The counters' own numbers: each one's cap, and what a stack is worth by itself where it's worth anything. */
export const COUNTER = {
  /** A hit its holder landed. Nothing by itself: the card says what a Cut is worth. */
  cuts: { cap: 25 },
  /** Given by a card, on its trigger: faster in everything. */
  heat: { speed: 5, cap: 10 },
  /** A hit its holder took. Nothing by itself. `thorns`: what Spite totem makes a Spite worth. */
  spite: { cap: 20, thorns: 15 },
  /** A hit taken by the unit the card names: its holder's next basic attack deals this much more for each, and spends them. */
  wrath: { pct: 20, cap: 10 },
  /** One more cast of the same ability this fight: that ability deals, heals and adds this much more for each. */
  crescendo: { pct: 20, cap: 10 },
  /** A shatter, anyone's. Nothing by itself. */
  cascade: { cap: 10 },
} as const;

export const counters: StatusT[] = [
  counter("cuts", "CUTS", "One per hit landed.", { cap: COUNTER.cuts.cap }),
  counter("heat", "HEAT", `${COUNTER.heat.speed}% faster in everything per Heat.`, {
    stats: ["attack_speed", "cooldown_reduction", "cast_time_reduction"].map((stat) => ({ stat, flat: COUNTER.heat.speed })), cap: COUNTER.heat.cap,
  }),
  counter("spite", "SPITE", "One per hit taken.", { cap: COUNTER.spite.cap }),
  // Spent by the swing it boosts: the drop comes with the basic attack's action_resolve, after its hits have read the stacks.
  counter("wrath", "WRATH", `Next basic attack deals +${COUNTER.wrath.pct}% per Wrath, and spends them.`, {
    boosts: [{ tag: "basic", pct: COUNTER.wrath.pct }], cap: COUNTER.wrath.cap, trigger: { on: { event: "action_resolve", kind: "basic" } }, drop: "all",
  }),
  // The engine keeps the count ability by ability (an ability change's `times: casts`) and shows the highest here.
  counter("crescendo", "CRESCENDO", `An ability does +${COUNTER.crescendo.pct}% for each earlier cast of it this fight.`, { cap: COUNTER.crescendo.cap, oncePerEvent: undefined }),
  counter("cascade", "CASCADE", "One per shatter this fight.", { cap: COUNTER.cascade.cap }),
];

/** What an ability change that counts Crescendo reads: a fifth more for each of the ability's own casts, shown as the status. */
export const CRESCENDO = { casts: true as const, cap: COUNTER.crescendo.cap, show: "crescendo" };

/**
 * Healing past full goes to the healed unit's own piece first (Red stone mail), then to the healer's (Phylactery), then to
 * the formation's (Shared cup). A piece that takes its wearer's own overhealing gives it `OVERHEAL.own`; one that takes
 * the overhealing its holder gives, `OVERHEAL.given`; whoever comes later in the order tests that the unit lacks them.
 */
export const OVERHEAL = { own: "overheal_own", given: "overheal_given" } as const;
const order: StatusT[] = [
  { id: OVERHEAL.own, name: "Keeps its overhealing", text: "Its overhealing goes to its own piece.", label: "marker", show: "sheet", stacking: "refresh" },
  { id: OVERHEAL.given, name: "Keeps the overhealing it gives", text: "Overhealing it gives goes to its own piece.", label: "marker", show: "sheet", stacking: "refresh" },
];

/** Marked is the vocabulary's (a class applies it: the Paladin's Condemn); the pieces and formations reach it here. */
export const marked: StatusT = vocabulary.find((s) => s.id === "marked")!;

export const sharedStatuses: StatusT[] = [...counters, ...order];
