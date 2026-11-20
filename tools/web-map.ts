/**
 * The authored-gaps step's map: the page at `steps/authored-gaps/map-page.html` filled with the web as `web.md` holds it,
 * so the map is redrawn from the catalog and never by hand. It draws the same threads and effects three ways: between the
 * nine builds, between the clocks, and by their own links alone. The page works out every count itself from this data.
 *
 *   npx tsx tools/web-map.ts [--out out/web-map.html]
 *
 * Publish the written file to the map's address (`steps/authored-gaps/report.md`, Next). Which words matter to which build
 * is copied here from `docs/gear-design/builds.md`, Threads the builds share, in the list's words: change both together.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { readWeb } from "./web-threads/read.js";

const TEMPLATE = "steps/authored-gaps/map-page.html";

/** The builds in the order of the rim, each beside builds it has a door to; the words that matter most and some to each. */
const BUILDS: { n: string; short: string; most: string[]; some: string[] }[] = [
  { n: "Landslide", short: "Land", most: ["Shield", "Defense", "Guard", "Might", "Crits", "Sunder"], some: ["Blows taken", "Stun", "HP paid or held low", "Focus", "The fight's start"] },
  { n: "Barrage", short: "Barr", most: ["Casts", "MP"], some: ["Blows taken", "Swings", "A kill", "The fight's start"] },
  { n: "Bonfire", short: "Bonf", most: ["What a hit carries", "Burn"], some: ["Blows taken", "Swings", "Casts", "MP", "Focus"] },
  { n: "The Hunt", short: "Hunt", most: ["Crits", "A kill", "Focus", "The Mark", "The fight's start"], some: ["Blows taken", "Might", "Casts", "Bleed"] },
  { n: "Thousand Cuts", short: "Cuts", most: ["Swings", "Extra strikes", "Crits", "Bleed", "Sunder", "The dodge"], some: ["Shield", "What a hit carries", "Heals", "Focus", "Lifesteal"] },
  { n: "Blood Pact", short: "Pact", most: ["HP paid or held low", "Heals", "Lifesteal"], some: ["Shield", "Might", "MP", "Weaken"] },
  { n: "Cold Snap", short: "Cold", most: ["What a hit carries", "Stun", "Chill"], some: ["Swings", "Extra strikes", "Focus", "The fight's start", "Sunder"] },
  { n: "The Storm", short: "Storm", most: ["Swings", "What a hit carries", "Spread", "Shock"], some: ["Blows taken", "Extra strikes", "Stun", "MP", "Sunder"] },
  { n: "The Toll", short: "Toll", most: ["Blows taken", "Defense", "Guard", "Weaken"], some: ["Shield", "Heals", "The fight's start", "Bleed", "Chill", "Shock", "The dodge"] },
];
/** The pairs the builds page names a door between. */
const DOORS = ["Bonfire|Cold Snap", "Bonfire|The Storm", "Bonfire|Thousand Cuts", "Cold Snap|The Storm", "Cold Snap|Thousand Cuts", "The Storm|Thousand Cuts", "Thousand Cuts|The Hunt", "Thousand Cuts|Blood Pact", "Thousand Cuts|Barrage", "The Toll|Thousand Cuts", "The Toll|Cold Snap", "The Toll|Landslide", "The Toll|The Storm", "The Toll|Blood Pact", "The Storm|The Hunt", "The Hunt|Bonfire", "Landslide|Cold Snap", "Landslide|Barrage", "Landslide|The Hunt", "Barrage|Bonfire", "Barrage|The Storm", "Barrage|Cold Snap", "Blood Pact|Barrage", "Blood Pact|Landslide"];
/** The clocks round the rim, each beside clocks an effect joins it to. */
const CLOCK_ORDER = ["Hits", "Fed", "Kills", "Breaks", "Load", "Fuel", "Foes"];
/** A shorter name under a dot, where the thread's own is long. */
const SHORT: Record<string, string> = { "HP paid or held low": "HP low", "The first-slotted ability": "First slot", "What a hit carries": "On a hit", "The fight's start": "Fight's start", "A foe acting": "A foe acts" };

const web = readWeb();
const known = new Set(web.threads.map((t) => t.name));
for (const b of BUILDS) for (const t of [...b.most, ...b.some]) if (!known.has(t)) throw new Error(`"${t}" isn't a thread: ${b.n}`);
const clockOf = (build: string) => web.clocks.find((c) => c.builds.includes(build))?.name;
for (const b of BUILDS) if (!clockOf(b.n)) throw new Error(`${b.n} is on no clock in the page's list`);
if (CLOCK_ORDER.length !== web.clocks.length || CLOCK_ORDER.some((c) => !web.clocks.some((k) => k.name === c))) throw new Error("the rim's clocks aren't the page's clocks");

const data = {
  threads: web.threads.map((t) => ({ n: t.name, s: SHORT[t.name] ?? t.name, kind: t.kind, common: web.common.has(t.name), wants: t.wants, gives: t.gives })),
  clocks: web.clocks.map((c) => ({ n: c.name, what: c.what, builds: c.builds })),
  clockOrder: CLOCK_ORDER,
  builds: BUILDS.map((b) => ({ ...b, clock: clockOf(b.n) })),
  doors: DOORS,
  effects: web.effects.map((e) => ({ name: e.name, from: e.from, w: e.wants, g: e.gives, c: e.clocks, wide: e.grouped.length > 0 })),
};

const template = readFileSync(TEMPLATE, "utf8");
if (!template.includes("/*DATA*/")) throw new Error(`${TEMPLATE} has no /*DATA*/ to fill`);
const argOut = process.argv.indexOf("--out");
const path = argOut > 0 ? process.argv[argOut + 1] : "out/web-map.html";
mkdirSync(dirname(path), { recursive: true });
writeFileSync(path, template.replace("/*DATA*/", JSON.stringify(data).replace(/</g, "\\u003c")));
console.log(`${path}: ${data.effects.length} effects, ${data.threads.length} threads, ${data.builds.length} builds, ${data.clocks.length} clocks.`);
