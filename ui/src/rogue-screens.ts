/**
 * The rogue mode's screens. `rogue` shows whatever the run is waiting on: the leader and the draft, the map, the
 * spoils of a fight, a boss's boon, a chest, the shop, a campfire, an event, a level-up, the next region, the end.
 * `rparty`, `runit` and `rgear` manage the party any time outside a fight: gear, seats, who's in and who's at camp.
 * Every choice goes to src/rogue.ts, is saved, and the screen redraws from the run.
 *
 * This file is their public face; the screens are in rogue/:
 *   parts.ts   the navigation screens.ts hands over, small parts (item rows, offers, the party strip) and the scenes
 *   run.ts     the dispatcher, the leader, the draft, the map and a fight in waiting
 *   rooms.ts   spoils, a captive, the shop and training, the campfire, events, choices, the Muster and the Drill, level up, the next region
 *   end.ts     the run's end, its record, and a won run's moment
 *   party.ts   managing the party: seats, a unit's sheet and order, its gear
 *   state.ts   the run and the rogue meta, saved in localStorage (not re-exported here)
 */
export { bindRogue } from "./rogue/parts.js";
export { rogueScreen, rbossScreen, rogueMenuLine } from "./rogue/run.js";
export { rpartyScreen, runitScreen, rclassScreen, rgearScreen } from "./rogue/party.js";
