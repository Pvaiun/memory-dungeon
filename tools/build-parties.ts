/**
 * The build test's parties: every route of every one of the nine builds (`docs/gear-design/builds.md`), at each of its three
 * rungs, so the nine can be played side by side on one set of the rogue's fights. Pure TypeScript: no engine, no Node.
 *
 * Each route is the three classes builds.md names for it and the build's formation at each rung (its common, rare and
 * legendary formation, by the formations' own tags). `build-parties/kit.ts` fills each rung from the loot's tags: the gear
 * worth most to the build at the rung's rarities, the versions toward it from rung 2, their power steps and the mythics that
 * pull toward it at rung 3, and the seats by role. Nothing here is balanced: a route is what the documents name, and its
 * gear is what the tags say serves it.
 *
 * The rungs:
 * - **Rung 1, act I:** commons and uncommons; the build's common formation; no trainings; one or two abilities a unit (the
 *   route's first and third classes two, its second one), as a run's first act has them.
 * - **Rung 2, act II:** rares too; its rare formation; a version on each ability and passive where one serves the build.
 * - **Rung 3, act III:** legendaries too; its legendary formation; the power step on every version it took; the mythics of the
 *   members whose class's mythic pulls first toward the build (at most two).
 * From rung 2 every member knows its class's three abilities. Each rung
 * also has a Neutral version (`neutralOf`): the same members and gear in the Neutral formation.
 */
import { type Party, type Route, neutralOf, route } from "./build-parties/kit.js";

export { type BuildId, type Rung, type Act, type Slot, type Training, type Gear, type Member, type Party, type Route, BUILDS, FORMATION_SEATS, MYTHICS, neutralOf } from "./build-parties/kit.js";

const LANDSLIDE: [string, string, string] = ["heavy_line", "hammer_and_anvil", "the_mountain"];
const CUTS: [string, string, string] = ["spur", "bloodied_ground", "the_whetstone"];
const BONFIRE: [string, string, string] = ["hearth", "pyre_line", "the_forge"];
const SNAP: [string, string, string] = ["hoarfrost_line", "icefall", "the_long_winter"];
const STORM: [string, string, string] = ["squall_line", "storm_front", "eye_of_the_storm"];
const HUNT: [string, string, string] = ["hunting_party", "the_pack", "open_season"];
const TOLL: [string, string, string] = ["thorn_hedge", "toll_gate", "the_palisade"];
const BARRAGE: [string, string, string] = ["wellspring", "the_stage", "the_cathedral"];
const PACT: [string, string, string] = ["shared_cup", "blood_oath", "the_covenant"];

/** Every route, build by build in the document's order. */
export const ROUTES: Route[] = [
  route("landslide", ["geomancer", "knight", "hoplite"], "Stone under the Geomancer's crits and the Knight's Vanguard; the slow blows come round when the stone holds.", LANDSLIDE),
  route("landslide", ["geomancer", "paladin", "bard"], "The Geomancer's stone and the Paladin's heavy Smite, with the Bard's Might on the slowest swing.", LANDSLIDE),
  route("landslide", ["knight", "hoplite", "bard"], "No earth: the weight is slow steel and Phalanx, and the Bard's Might sits on the slowest swings.", LANDSLIDE),
  route("cuts", ["vampire", "assassin", "monk"], "Three fast hitters: every hit opens a wound, and the wounds feed the Vampire.", CUTS),
  route("cuts", ["bramble_knight", "assassin", "ranger"], "Behind briars: the Bramble knight's thorns hold while two quick blades bleed the field.", CUTS),
  route("cuts", ["valkyrie", "ranger", "vampire"], "A Valkyrie in front, a Ranger's volleys and a Vampire's claws: a dense, even stream.", CUTS),
  route("bonfire", ["knight", "pyromancer", "monk"], "The Knight holds the door, the Pyromancer lights the field, the Monk's fists keep it burning.", BONFIRE),
  route("bonfire", ["paladin", "hexer", "pyromancer"], "Smite's Burn, the Hexer's curses and the Pyromancer's fire, rising all fight.", BONFIRE),
  route("bonfire", ["paladin", "monk", "hexer"], "No mage: Smite and the Monk's burning fists feed the fire, the Hexer deepens it.", BONFIRE),
  route("snap", ["frostweaver", "hexer", "ranger"], "Three that lay cold; every shatter rings a spell.", SNAP),
  route("snap", ["knight", "frostweaver", "monk"], "A Knight in frost: the foes chill themselves on the wall, the Frostweaver and the Monk break them.", SNAP),
  route("snap", ["hexer", "ranger", "geomancer"], "No Frostweaver: Cold hex, Frost arrow and the stone's slow blows.", SNAP),
  route("storm", ["hoplite", "stormcaller", "valkyrie"], "The Hoplite draws, the Stormcaller charges the field, the Valkyrie's Skyfall cashes it.", STORM),
  route("storm", ["knight", "stormcaller", "monk"], "A Knight's draw, the Stormcaller's chains and the Monk's quick hits keeping the charge topped up.", STORM),
  route("storm", ["valkyrie", "hexer", "bard"], "No Stormcaller: Gale spear and Skyfall, the Hexer's curses, the Bard's songs.", STORM),
  route("hunt", ["paladin", "assassin", "stormcaller"], "A judge who calls the target: Condemn Marks it and the party falls on it, one foe at a time.", HUNT),
  route("hunt", ["hoplite", "valkyrie", "ranger"], "No Assassin: the Hoplite holds, the Valkyrie and the Ranger take them one by one.", HUNT),
  route("hunt", ["assassin", "ranger", "valkyrie"], "The Assassin's first strike, the Ranger's reach and the Valkyrie's spear: a staircase of kills.", HUNT),
  route("toll", ["bramble_knight", "cleric", "stormcaller"], "The briar wall that every blow costs, kept up by the Cleric, with the Stormcaller's charge on the foes that hit it.", TOLL),
  route("toll", ["knight", "hexer", "hoplite"], "Two walls and a curse: what strikes the gate pays.", TOLL),
  route("toll", ["monk", "valkyrie", "bard"], "The dancer: the Monk dodges and answers, the Valkyrie and the Bard profit.", TOLL),
  route("barrage", ["knight", "bard", "pyromancer"], "The Pyromancer's great spell, again and again, its mana from the Knight and the Bard.", BARRAGE),
  route("barrage", ["frostweaver", "bard", "stormcaller"], "Two casters, the Bard's Encore on the bigger spell.", BARRAGE),
  route("barrage", ["cleric", "vampire", "geomancer"], "No Bard: the Vampire's life for mana and the Cleric's font keep the Geomancer casting.", BARRAGE),
  route("pact", ["vampire", "valkyrie", "cleric"], "The Vampire drinks, the Valkyrie stands over it, the Cleric's heals land past full.", PACT),
  route("pact", ["vampire", "bard", "hoplite"], "The Vampire's price paid in blood, the Bard's songs and the Hoplite's Aegis.", PACT),
  route("pact", ["assassin", "paladin", "monk"], "No Vampire: Lifesteal on the blades, the Paladin's heals, every price in HP.", PACT),
];
/** Every rung of every route, in its formation: 9 builds × 3 routes × 3 rungs. */
export const BUILD_PARTIES: Party[] = ROUTES.flatMap((r) => r.rungs);
/** Every rung twice: in its formation, then in Neutral. */
export const ALL_PARTIES: Party[] = BUILD_PARTIES.flatMap((pt) => [pt, neutralOf(pt)]);
