/**
 * The rogue mode (docs/core-set/rogue-mode.md): a run as plain data, moved forward one decision at a time. Three acts on
 * Slay the Spire's structure: an act is a map of branching paths through a themed region, from a first fight to a boss;
 * the player picks each next room. The party is a leader the player owns and two drafted companions. HP, MP and
 * knockouts carry from fight to fight; campfires, the shop, supplies and a few events are the only relief, and each new
 * act begins restored, with everyone learning an ability.
 *
 * Pure TypeScript with no Node APIs: the interface and the simulations both drive it. Every roll comes from the run's
 * seed, sliced by what it's for, so the same seed and the same choices make the same run. The data is the pack's
 * `rogue` block; fights are the engine's, one at a time.
 *
 * This file is the mode's public face; the code is in rogue/, one file a part:
 *   state.ts      the run's data (RogueRun, Member, Offer, Pending), its shared helpers, and what a run leaves behind
 *   fights.ts     the run's gear as content, the party a fight takes, starting and ending fights, knobs and foes
 *   acts.ts       a new run (leader, draft, recruits' abilities) and each act's map and rooms
 *   offers.ts     the stock and every offer: gear, mythics, tomes, recruits, formations, supplies, prices, the shop
 *   training.ts   learning abilities and training power steps and versions
 *   party.ts      free actions between rooms: gear, formation, seats, ability order, swaps, supplies
 *   decisions.ts  what the pending decision offers, and answering it
 *   rooms.ts      entering a room, a campfire, the next region, an event's effects
 * A run's record, for balancing, is rogue/record.ts.
 */
export { ROGUE_VERSION, type Slot, SLOT_LIST, type Item, type Version, type Trained, type Member, type MapNode, type Offer, type ShopSlot, type FightTier, type FightSpec, type Pending, type Note, type RogueRun, migrate, type RogueMeta, freshMeta, rogue, member, bench, finish, unlockable } from "./rogue/state.js";
export { registerGear, itemGear, itemOf, wearer, bag, partyOf, FIGHT_DUNGEON, fightDungeon, startFight, carryIn, endFight, useShard, carried, bagRoom, supplyName, autoFight, knobFoes, refFloors, easyTo, knobFor, fightFor, foesFor, bossFoes } from "./rogue/fights.js";
export { rollKnown, recruitKnown, seatsOf, plainWeapon, newItem, recruit, type NewRun, leaderKnown, newRogue, heals, makeMap, actRoll, reachable } from "./rogue/acts.js";
export { pieceRarity, kindOf, kindsFor, stockOf, canRoll, usable, rollItem, rollMythic, formationRarity, priceOf, trainPrice, sellPrice, take, canTake, offerText } from "./rogue/offers.js";
export { type Training, trainingId, parseTraining, upgradeOf, passiveOf, formOf, unlearned, trainable, trainingsFor, trainingText, learn, train } from "./rogue/training.js";
export { equip, twoHanded, maxOf, setFormation, seat, setOrder, swap, dismiss, junk, discard, useSupply, canManage } from "./rogue/party.js";
export { options, whyNot, temperInto, learnOptions, improveOptions, eventOf, eventView, trainOptions, choose } from "./rogue/decisions.js";
export { arriveCamp } from "./rogue/rooms.js";
