/**
 * The fight: the core set's combat system (docs/core-set/rules-and-vocabulary.md),
 * run on sub-ticks. Where the core set is silent, what this code does stands.
 *
 * A fight is plain data, so a run can be saved mid-fight. Each `step` plays one
 * moment, the next sub-tick on which anything happens, in this order:
 *   1. units that are ready start their first available action;
 *   2. everything due resolves one item at a time: the party batch, then the
 *      enemy batch; within a batch, pulses, then reactions, then actions, each
 *      in slot order, then in order of creation;
 *   3. statuses whose last sub-tick this is end.
 * A unit that becomes ready, or whose action becomes available, because of
 * something resolved in steps 2 or 3 starts on the next sub-tick.
 *
 * This file is the fight's public face; the code is in fight/, one file a part:
 *   state.ts      the fight's data, the shared helpers, stats and the numbers in actions and statuses
 *   actions.ts    what a unit can do: abilities, their changes and costs, starting, resolving, extra strikes
 *   targeting.ts  who an action picks: draw, Taunt, Hidden, Seek, target rules, conditions and seats
 *   effects.ts    what an action's effects do, but damage and healing: cooldowns, HP prices, revives
 *   damage.ts     damage and healing: the resolution order, crits, evasion, Shield, cover, floors
 *   statuses.ts   applying, ending, pulsing and removing statuses; control resistance; lockouts
 *   events.ts     events and the reactions and triggers that listen to them
 *   units.ts      knockouts, the fight's end, revives, summons and splits
 *   clock.ts      the fight's start and each step
 */
export { type SInst, type Act, type CUnit, type Carried, CARRIED_NONE, type Item, type CFight, LIMITS, world, stat, letter, derive } from "./fight/state.js";
export { weaponOf, resolveWeapon } from "./fight/actions.js";
export { drawOf } from "./fight/targeting.js";
export { applyStatus, type Ending } from "./fight/statuses.js";
export { type Ev } from "./fight/events.js";
export { makeUnit } from "./fight/units.js";
export { nextTime, step } from "./fight/clock.js";
