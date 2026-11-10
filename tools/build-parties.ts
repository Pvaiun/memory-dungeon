/**
 * The build test's hand-built parties for every route of every one of the twelve builds, at each of its
 * three rungs, so the twelve can be played side by side on one set of the rogue's fights. Data only: no engine, no Node.
 *
 * They're the twelve builds today's loot was made for. `docs/gear-design/builds.md` holds the nine that replace them, and the
 * loot pass's build rewrites these parties for the nine.
 *
 * Where it comes from: each build's routes and rungs are the three its document named for it; each piece,
 * formation, version and mythic goes by the id the content derives from its name. Nothing here is balanced: a route is what
 * the documents name, not what wins.
 *
 * The rungs:
 * - **Rung 1, act I:** what most runs find. Commons and uncommons in the build's kinds, with their first-rung effects; a common
 *   formation; no trainings.
 * - **Rung 2, act II:** adds the build's rares and its rare formation, and versions toward the build on the abilities and
 *   passives that matter to it (no power steps).
 * - **Rung 3, act III:** its far end. Its legendaries, the mythic of each member whose class's mythic pulls first toward the
 *   build (at most two a party, one a unit), its legendary formation, and the power step on every version it took.
 * A later rung keeps whatever still serves the build; a slot that has nothing for it holds the plain-stat common that suits it.
 * Every member knows all three of its abilities at every rung, so the rungs differ only by what the build asks.
 *
 * Each rung also has a Neutral version (`neutralOf`): the same members and gear in the Neutral formation.
 *
 * The parties are in build-parties/: kit.ts (the types, the builds' names, the helpers) and one file a build, its three
 * routes. A new build is a new file, its id in kit.ts's BuildId and BUILDS, and a line in each list below.
 */
import { type Party, type Route, neutralOf } from "./build-parties/kit.js";
import { routes as landslide } from "./build-parties/landslide.js";
import { routes as cuts } from "./build-parties/cuts.js";
import { routes as bonfire } from "./build-parties/bonfire.js";
import { routes as snap } from "./build-parties/snap.js";
import { routes as hunt } from "./build-parties/hunt.js";
import { routes as harvest } from "./build-parties/harvest.js";
import { routes as ambush } from "./build-parties/ambush.js";
import { routes as overflow } from "./build-parties/overflow.js";
import { routes as lockdown } from "./build-parties/lockdown.js";
import { routes as toll } from "./build-parties/toll.js";
import { routes as pact } from "./build-parties/pact.js";
import { routes as phoenix } from "./build-parties/phoenix.js";

export { type BuildId, type Rung, type Act, type Slot, type Training, type Gear, type Member, type Party, type Route, BUILDS, FORMATION_SEATS, MYTHICS, neutralOf } from "./build-parties/kit.js";

/** Every route, build by build in the documents' order. */
export const ROUTES: Route[] = [...landslide, ...cuts, ...bonfire, ...snap, ...hunt, ...harvest, ...ambush, ...overflow, ...lockdown, ...toll, ...pact, ...phoenix];
/** Every rung of every route, in its formation: 12 builds × 3 routes × 3 rungs. */
export const BUILD_PARTIES: Party[] = ROUTES.flatMap((r) => r.rungs);
/** Every rung twice: in its formation, then in Neutral. */
export const ALL_PARTIES: Party[] = BUILD_PARTIES.flatMap((pt) => [pt, neutralOf(pt)]);
