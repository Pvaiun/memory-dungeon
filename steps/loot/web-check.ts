/**
 * The loot pass's web check: a small script over the spine's tags. Scratch, like the rest of this folder; it goes when the
 * step closes.
 *
 *   npx tsx steps/loot/web-check.ts            prints the tables
 *   npx tsx steps/loot/web-check.ts --write    also rewrites the generated tables inside spine.md (between its markers)
 *
 * It reads `spine.md`'s item lines:
 *
 *   - **Name** · kind · rarity · what it does → Road rung ●●, Road ● ⚙ engine (key), engine (half) ◆ part, part
 *
 * and each kind's header (`*Wears:* … *Signature:* … *Stats lean:* …`) and its `*Commons (n):*` line. From those it counts the
 * stock, lists where each recurring part and each engine's parts sit, and works out roughly how often a run is offered each
 * road's first step and each engine's keystone, from the offer roll in `src/rogue/offers.ts` and the weights in
 * `content/core-set/rogue.ts` (a slot, then a class, then one of its kinds there, then a piece of that kind at the rarity).
 * The offers an act makes are counted, not estimated: `RUN` below holds the averages of 40 runs of the simulated player
 * (`npx tsx steps/loot/offer-count.ts`). Its path and roster differ from a person's, so the numbers are for comparing threads
 * and finding the ones a run rarely meets, not for quoting to a decimal.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { ROGUE_CONFIG } from "../../content/core-set/rogue.js";

const SPINE = "steps/loot/spine.md";
const CLASSES = ["Knight", "Cleric", "Ranger", "Bramble knight", "Hoplite", "Paladin", "Valkyrie", "Bard", "Hexer", "Monk", "Assassin", "Vampire", "Pyromancer", "Frostweaver", "Stormcaller", "Geomancer"] as const;
type Cls = (typeof CLASSES)[number];
type Slot = "weapon" | "armor" | "offhand" | "amulet";
const KINDS: Record<string, { slot: Slot; wears: Cls[] }> = {
  dagger: { slot: "weapon", wears: ["Ranger", "Assassin"] },
  fist: { slot: "weapon", wears: ["Monk", "Vampire", "Stormcaller"] },
  wand: { slot: "weapon", wears: ["Bard", "Hexer", "Pyromancer"] },
  sword: { slot: "weapon", wears: ["Knight", "Hexer", "Valkyrie"] },
  spear: { slot: "weapon", wears: ["Hoplite", "Valkyrie", "Monk"] },
  axe: { slot: "weapon", wears: ["Vampire", "Assassin"] },
  bow: { slot: "weapon", wears: ["Ranger", "Bard"] },
  "rune sword": { slot: "weapon", wears: ["Frostweaver", "Stormcaller"] },
  hammer: { slot: "weapon", wears: ["Knight", "Bramble knight", "Geomancer"] },
  mace: { slot: "weapon", wears: ["Cleric", "Paladin", "Bramble knight"] },
  staff: { slot: "weapon", wears: ["Cleric", "Pyromancer", "Frostweaver"] },
  "great weapon": { slot: "weapon", wears: ["Hoplite", "Paladin", "Geomancer"] },
  plate: { slot: "armor", wears: ["Knight", "Bramble knight", "Hoplite", "Paladin", "Geomancer"] },
  mail: { slot: "armor", wears: ["Bramble knight", "Paladin", "Valkyrie", "Hexer", "Vampire", "Frostweaver"] },
  leather: { slot: "armor", wears: ["Ranger", "Valkyrie", "Bard", "Monk", "Assassin", "Stormcaller"] },
  robes: { slot: "armor", wears: ["Cleric", "Bard", "Pyromancer", "Frostweaver", "Stormcaller"] },
  "kite shield": { slot: "offhand", wears: ["Knight", "Paladin", "Geomancer"] },
  "round shield": { slot: "offhand", wears: ["Hoplite", "Bramble knight", "Valkyrie"] },
  horn: { slot: "offhand", wears: ["Knight", "Hoplite"] },
  totem: { slot: "offhand", wears: ["Bramble knight", "Stormcaller"] },
  relic: { slot: "offhand", wears: ["Cleric", "Paladin"] },
  lantern: { slot: "offhand", wears: ["Cleric", "Pyromancer"] },
  tome: { slot: "offhand", wears: ["Bard", "Hexer", "Frostweaver"] },
  orb: { slot: "offhand", wears: ["Pyromancer", "Frostweaver"] },
  idol: { slot: "offhand", wears: ["Hexer", "Vampire"] },
  vial: { slot: "offhand", wears: ["Vampire", "Assassin"] },
  trophy: { slot: "offhand", wears: ["Ranger", "Assassin", "Geomancer"] },
  bell: { slot: "offhand", wears: ["Bard", "Monk", "Stormcaller"] },
  cloak: { slot: "offhand", wears: ["Valkyrie", "Monk", "Ranger"] },
  amulet: { slot: "amulet", wears: [...CLASSES] },
};
const HEADERS: Record<string, string> = { "Fist weapons": "fist", Amulets: "amulet" };
const RARITIES = ["common", "uncommon", "rare", "legendary"] as const;
type Rarity = (typeof RARITIES)[number];
const ROADS = ["Landslide", "Cuts", "Bonfire", "Snap", "Storm", "Hunt", "Toll", "Barrage", "Pact"] as const;
type Road = (typeof ROADS)[number];
const ROAD_NAME: Record<Road, string> = { Landslide: "Landslide", Cuts: "Thousand Cuts", Bonfire: "Bonfire", Snap: "Cold Snap", Storm: "The Storm", Hunt: "The Hunt", Toll: "The Toll", Barrage: "Barrage", Pact: "Blood Pact" };
/** The builds' routes (docs/gear-design/builds.md), and where each road's sign sits in a base kit: 1 for a passive, 1/3 for one ability of three. */
const ROUTES: Record<Road, Cls[][]> = {
  Landslide: [["Geomancer", "Knight", "Hoplite"], ["Geomancer", "Paladin", "Bard"], ["Knight", "Hoplite", "Bard"]],
  Cuts: [["Vampire", "Assassin", "Monk"], ["Bramble knight", "Assassin", "Ranger"], ["Valkyrie", "Ranger", "Vampire"]],
  Bonfire: [["Knight", "Pyromancer", "Monk"], ["Paladin", "Hexer", "Pyromancer"], ["Paladin", "Monk", "Hexer"]],
  Snap: [["Frostweaver", "Hexer", "Ranger"], ["Knight", "Frostweaver", "Monk"], ["Hexer", "Ranger", "Geomancer"]],
  Storm: [["Hoplite", "Stormcaller", "Valkyrie"], ["Knight", "Stormcaller", "Monk"], ["Valkyrie", "Hexer", "Bard"]],
  Hunt: [["Paladin", "Assassin", "Stormcaller"], ["Hoplite", "Valkyrie", "Ranger"], ["Assassin", "Ranger", "Valkyrie"]],
  Toll: [["Bramble knight", "Cleric", "Stormcaller"], ["Knight", "Hexer", "Hoplite"], ["Monk", "Valkyrie", "Bard"]],
  Barrage: [["Knight", "Bard", "Pyromancer"], ["Frostweaver", "Bard", "Stormcaller"], ["Cleric", "Vampire", "Geomancer"]],
  Pact: [["Vampire", "Valkyrie", "Cleric"], ["Vampire", "Bard", "Hoplite"], ["Assassin", "Paladin", "Monk"]],
};
const SIGN: Record<Road, Partial<Record<Cls, number>>> = {
  Landslide: { Hoplite: 1, Geomancer: 2 / 3, Knight: 1 / 3 },
  Cuts: { "Bramble knight": 1, Assassin: 1, Ranger: 1 / 3, Hexer: 1 / 3 },
  Bonfire: { Pyromancer: 1, Paladin: 1 / 3, Monk: 1 / 3 },
  Snap: { Frostweaver: 1, Hexer: 1, Ranger: 1 / 3 },
  Storm: { Stormcaller: 1, Valkyrie: 1 / 3 },
  Hunt: { Ranger: 1, Assassin: 2 / 3, Valkyrie: 1 / 3, Paladin: 1 / 3, Monk: 1 / 3 },
  Toll: { "Bramble knight": 1, Knight: 1 / 3 },
  Barrage: { Pyromancer: 1, Frostweaver: 1, Stormcaller: 1, Bard: 1, Geomancer: 2 / 3 },
  Pact: { Vampire: 1 },
};

// ─── The run's shape: estimates ──────────────────────────────────────────────
const cfg = ROGUE_CONFIG as unknown as {
  slots: Record<Slot, number>;
  formationOdds: Record<"common" | "rare" | "legendary", number>[];
  spoils: { fight: { count: number; rarity: Record<Rarity, number>; extra: number; mixed: number }; elite: { count: number; aimed: number }; offRoster: number };
  treasure: { rarity: Record<Rarity, number>; cage: number };
  shop: { gear: Record<Rarity, number>; legendaryByAct: number[] };
};
/**
 * What a run is offered in each act, from `offer-count.ts` over 40 simulated runs (the acts a run played through): pieces by
 * rarity and by who the offer is rolled for (open: a third for classes off the roster; party: an elite's first legendary;
 * roster: the shop), formation offers by rarity, regular fights, and the roster's size.
 */
const RUN = {
  gear: [
    { "common|open": 8.22, "common|roster": 1.62, "uncommon|open": 8, "uncommon|roster": 1.08, "rare|open": 7.16, "rare|roster": 1.08, "legendary|open": 5.08, "legendary|party": 1.65, "legendary|roster": 0.54 },
    { "common|open": 7.51, "common|roster": 2.76, "uncommon|open": 6.62, "uncommon|roster": 1.84, "rare|open": 7.03, "rare|roster": 1.89, "legendary|open": 4.97, "legendary|party": 1.78, "legendary|roster": 1.78 },
    { "common|open": 7.24, "common|roster": 2.84, "uncommon|open": 7, "uncommon|roster": 1.89, "rare|open": 5.97, "rare|roster": 1.95, "legendary|open": 5.03, "legendary|party": 1.7, "legendary|roster": 1.84 },
  ] as Record<string, number>[],
  formations: [{ common: 2.89, rare: 1.95, legendary: 0.11 }, { common: 1.84, rare: 3.19, legendary: 0.76 }, { common: 0.95, rare: 2.76, legendary: 0.89 }] as Record<string, number>[],
  fights: [4.97, 4.43, 4.3],
  /** Roster size by act: 3.8, 5.2 and 6.4 when counted, rounded for the sampled rosters. */
  roster: [4, 5, 6],
};

// ─── Reading the spine ───────────────────────────────────────────────────────
type Item = { name: string; kind: string; type: "gear" | "formation" | "version" | "mythic"; rarity: string; who?: string; text: string; sees?: string; roads: { road: string; rung?: number; worth: number }[]; engines: { engine: string; role: "key" | "half" }[]; parts: string[] };
type KindInfo = { name: string; kind: string; signature: string; commons: number; commonsRule: string; leans: string };
const items: Item[] = [];
const kinds: KindInfo[] = [];
const md = readFileSync(SPINE, "utf8");
{
  let cur: KindInfo | undefined;
  for (const line of md.split("\n")) {
    const h = /^##### (.+)$/.exec(line);
    if (h) { const kind = HEADERS[h[1]] ?? h[1].toLowerCase(); cur = KINDS[kind] ? { name: h[1], kind, signature: "", commons: 0, commonsRule: "", leans: "" } : undefined; if (cur) kinds.push(cur); continue; }
    if (/^#### Amulets/.test(line)) { cur = { name: "Amulet", kind: "amulet", signature: "(everyone)", commons: 0, commonsRule: "", leans: "" }; kinds.push(cur); continue; }
    if (/^#{2,4} /.test(line)) { cur = undefined; continue; }
    if (cur && line.startsWith("*Wears:*")) {
      cur.signature = /\*Signature:\* ([^.]+)\./.exec(line)?.[1] ?? (cur.kind === "amulet" ? "(everyone)" : "(by weight)");
      cur.leans = /\*Stats lean:\* (.+)$/.exec(line)?.[1] ?? "";
      continue;
    }
    const cm = /^- \*Commons \((\d+)\):\* (.+)$/.exec(line);
    if (cur && cm) { cur.commons = Number(cm[1]); cur.commonsRule = cm[2]; continue; }
    const m = /^- \*\*(.+?)\*\* · (.+?) · (.+?) · (.+)$/.exec(line);
    if (!m) continue;
    const [, name, f2, f3, rest] = m;
    if (f3.startsWith("kit change")) continue; // The two approved kit changes: lines for the reader, not items.
    const [body, tagStr = ""] = rest.split(" → ");
    const [roadStr, afterRoads = ""] = tagStr.split(" ⚙ ");
    const [engStr0, partStr0 = ""] = afterRoads.split(" ◆ ");
    // A line may carry parts without engines.
    const [roadOnly, partStr1 = ""] = roadStr.split(" ◆ ");
    const engStr = engStr0, partStr = partStr0 || partStr1;
    const type: Item["type"] = f2 === "formation" ? "formation" : f3.startsWith("version") ? "version" : f3.startsWith("mythic") ? "mythic" : "gear";
    if (type === "gear" && !KINDS[f2]) throw new Error(`unknown kind "${f2}" on ${name}`);
    if (type === "gear" && cur && cur.kind !== f2) throw new Error(`${name} is a ${f2} under ${cur.name}`);
    const roads = roadOnly.split(", ").map((s) => s.trim()).filter(Boolean).map((s) => {
      const r = /^(.+?)(?: (\d))?(?: (●+))?$/.exec(s)!;
      return { road: r[1], rung: r[2] ? Number(r[2]) : undefined, worth: r[3]?.length ?? 0 };
    });
    const engines = engStr.split(", ").map((s) => s.trim()).filter(Boolean).map((s) => {
      const e = /^(.+) \((key|half)\)$/.exec(s);
      if (!e) throw new Error(`bad engine tag "${s}" on ${name}`);
      return { engine: e[1], role: e[2] as "key" | "half" };
    });
    const [text, sees] = body.split(" *Sees:* ");
    items.push({ name, kind: type === "gear" ? f2 : type, type, rarity: type === "gear" || type === "formation" ? f3 : type, who: type === "version" || type === "mythic" ? f2 : undefined, text: text.trim(), sees: sees?.trim(), roads, engines, parts: partStr.split(", ").map((s) => s.trim()).filter(Boolean) });
  }
}
const gear = items.filter((i) => i.type === "gear");
const bad = items.flatMap((i) => i.roads.filter((r) => !(ROADS as readonly string[]).includes(r.road) && !["net", "exotic", "first move", "stops a cast", "foes do less"].includes(r.road)).map((r) => `${i.name}: ${r.road}`));
if (bad.length) throw new Error(`unknown road tags: ${bad.join("; ")}`);
const dup = items.map((i) => i.name).filter((n, i, a) => a.indexOf(n) !== i);
if (dup.length) throw new Error(`names used twice: ${dup.join(", ")}`);

// ─── The stock ───────────────────────────────────────────────────────────────
const cell = new Map<string, number>();
for (const k of kinds) cell.set(`${k.kind}|common`, k.commons);
for (const g of gear) cell.set(`${g.kind}|${g.rarity}`, (cell.get(`${g.kind}|${g.rarity}`) ?? 0) + 1);
const n = (kind: string, r: string) => cell.get(`${kind}|${r}`) ?? 0;
function stockTable(): string {
  const rows = ["| Kind | Wears | Common | Uncommon | Rare | Legendary | In all |", "| --- | --- | --- | --- | --- | --- | --- |"];
  const tot: Record<string, number> = {};
  for (const slot of ["weapon", "armor", "offhand", "amulet"] as Slot[]) {
    const sub: Record<string, number> = {};
    for (const k of kinds.filter((x) => KINDS[x.kind].slot === slot)) {
      const c = RARITIES.map((r) => n(k.kind, r));
      RARITIES.forEach((r, i) => { sub[r] = (sub[r] ?? 0) + c[i]; tot[r] = (tot[r] ?? 0) + c[i]; });
      rows.push(`| ${k.name} | ${k.kind === "amulet" ? "everyone" : KINDS[k.kind].wears.length} | ${c.join(" | ")} | ${c.reduce((a, b) => a + b, 0)} |`);
    }
    if (slot !== "amulet") rows.push(`| **${slot[0].toUpperCase()}${slot.slice(1)}s** | | **${RARITIES.map((r) => sub[r]).join("** | **")}** | **${RARITIES.reduce((a, r) => a + sub[r], 0)}** |`);
  }
  rows.push(`| **All** | | **${RARITIES.map((r) => tot[r]).join("** | **")}** | **${RARITIES.reduce((a, r) => a + tot[r], 0)}** |`);
  return rows.join("\n");
}
function kindTable(): string {
  const rows = ["| Kind | Signature | Commons | Uncommons, each effect named | Stats lean, by road |", "| --- | --- | --- | --- | --- |"];
  for (const k of kinds) {
    const us = gear.filter((g) => g.kind === k.kind && g.rarity === "uncommon").map((g) => `**${g.name}:** ${g.text}`);
    rows.push(`| ${k.name} | ${k.signature} | ${k.commons}: ${k.commonsRule} | ${us.join("<br>")} | ${k.leans} |`);
  }
  return rows.join("\n");
}
const where = (i: Item) => (i.type === "gear" ? `${i.kind}, ${i.rarity}` : i.type === "formation" ? `formation, ${i.rarity}` : i.type === "version" ? `version: ${i.who}` : `mythic: ${i.who}`);
const PARTS: Record<string, string> = {
  "shield-by-doing": "A Shield made by what a unit already does", draw: "A draw on one unit", "swing-status": "A status on a swing", "wide-hit": "A hit on many foes", held: "A foe held still",
  "kill-pays": "A kill that pays", "heavy-blow": "The slowest, heaviest blow", "lowest-ally": "The ally with the lowest share of HP", "free-cast": "A cast that's free, or mana given",
};
function partsTable(): string {
  const rows = ["| A part | Where it sits |", "| --- | --- |"];
  for (const [id, label] of Object.entries(PARTS)) {
    const its = items.filter((i) => i.parts.includes(id));
    const by = (r: string) => its.filter((i) => i.rarity === r).map((i) => `${i.name} (${i.kind})`).join(", ");
    rows.push(`| ${label} | ${[["Uncommon", by("uncommon")], ["Rare", by("rare")], ["Legendary", by("legendary")]].filter(([, v]) => v).map(([k, v]) => `*${k}:* ${v}`).join("<br>")} |`);
  }
  return rows.join("\n");
}
const unknownParts = items.flatMap((i) => i.parts.filter((p) => !PARTS[p]).map((p) => `${i.name}: ${p}`));
if (unknownParts.length) throw new Error(`unknown parts: ${unknownParts.join("; ")}`);

// ─── How often a run is offered a thing ──────────────────────────────────────
/** Kinds a class wears in a slot. */
const wornIn = (c: Cls, slot: Slot) => Object.entries(KINDS).filter(([, k]) => k.slot === slot && k.wears.includes(c)).length;
const slotW = (s: Slot) => cfg.slots[s] / Object.values(cfg.slots).reduce((a, b) => a + b, 0);
/** The chance one roll of the item's rarity, from a pool of classes, comes up as this item. */
const perRoll = (g: Item, pool: Cls[]) => {
  const k = KINDS[g.kind];
  const pick = pool.filter((c) => k.wears.includes(c)).reduce((a, c) => a + 1 / pool.length / wornIn(c, k.slot), 0);
  return (slotW(k.slot) * pick) / n(g.kind, g.rarity);
};
/** Rolls of each rarity in one act, by who they're rolled for: the roster, the party (an elite's aimed offer), or open (a third off the roster). */
function rollsInAct(act: number): { rarity: Rarity; n: number; pool: "open" | "roster" | "party" }[] {
  return Object.entries(RUN.gear[act]).map(([k, n]) => { const [rarity, pool] = k.split("|"); return { rarity: rarity as Rarity, n, pool: pool as "open" | "roster" | "party" }; });
}
/** Expected offers, in one act, of any of `set` that someone on the roster can wear. */
function expected(set: Item[], roster: Cls[], party: Cls[], act: number): number {
  const off = CLASSES.filter((c) => !roster.includes(c));
  let e = 0;
  for (const roll of rollsInAct(act))
    for (const g of set) {
      if (g.rarity !== roll.rarity) continue;
      const share = roll.pool === "open" ? 1 - cfg.spoils.offRoster / 100 : 1;
      e += roll.n * share * perRoll(g, roll.pool === "party" ? party : roster);
      void off;
    }
  return e;
}
let seed = 12345;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const shuffled = <T,>(a: readonly T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
/** The chance of at least one offer by the end of each act, averaged over rosters: `core` in the party, the rest filled at random as the roster grows. */
function met(set: Item[], cores: Cls[][], samples = 400): number[] {
  const acc = [0, 0, 0];
  for (let s = 0; s < samples; s++) {
    const core = cores[s % cores.length];
    const others = shuffled(CLASSES.filter((c) => !core.includes(c)));
    const party = [...core, ...others].slice(0, 3);
    let e = 0;
    for (let act = 0; act < 3; act++) {
      const roster = [...core, ...others].slice(0, Math.max(RUN.roster[act], core.length));
      e += expected(set, roster, party, act);
      acc[act] += 1 - Math.exp(-e);
    }
  }
  return acc.map((x) => x / samples);
}
const pct = (x: number) => `${Math.round(x * 100)}%`;
const randomCores = (k = 3) => Array.from({ length: 200 }, () => shuffled(CLASSES).slice(0, k));

const PASSIVES = ["Vanguard", "Last rites", "Hunter's eye", "Briar", "Phalanx", "Judgement", "Shieldmaiden", "Refrain", "Cold hex", "Iron palm", "Lacerate", "Bloodlust", "Stoke", "Shatterpoint", "Arc", "Bedrock"];
/**
 * A version offered to its class. A training offers every open training its member has (`trainOptions` in
 * src/rogue/decisions.ts), not three as docs/rules.md says, so a version is on offer whenever its member trains at all, once its
 * ability is known (a passive always is). Counted over simulated runs: a roster takes about nine trainings in act I, so nearly
 * every member trains; a unit in a fight knows half its abilities in act I and nearly all by act II. At three choices of a
 * member's eight, a given version would be in about three trainings in eight.
 */
function versionMet(v: Item, act: number): number {
  const passive = PASSIVES.some((p) => (v.who ?? "").includes(p));
  const known = passive ? 1 : [0.5, 0.95, 1][act];
  return known * [0.9, 1, 1][act];
}
function signTable(): string {
  const rows = ["| Road | Its sign in the starting three | A first-step piece offered, act I | By act II's end | With its versions and common formations, act I | First steps in the stock | Thinnest route in act I, pieces alone |", "| --- | --- | --- | --- | --- | --- | --- |"];
  for (const road of ROADS) {
    // The start: a leader of the three starters, and two drafts of one from three.
    let sign = 0;
    const S = 4000;
    for (let s = 0; s < S; s++) {
      const leader = (["Knight", "Cleric", "Ranger"] as Cls[])[Math.floor(rnd() * 3)];
      const seen = [leader, ...shuffled(CLASSES.filter((c) => c !== leader)).slice(0, 6)];
      const miss = seen.reduce((a, c) => a * (1 - (SIGN[road][c] ?? 0)), 1);
      sign += 1 - miss;
    }
    const first = (i: Item) => i.roads.some((r) => r.road === road && r.rung === 1);
    const steps = gear.filter(first);
    const m = met(steps, ROUTES[road]);
    const each = ROUTES[road].map((rt) => ({ rt, m: met(steps, [rt], 200)[0] })).sort((a, b) => a.m - b.m)[0];
    const forms = items.filter((i) => i.type === "formation" && i.rarity === "common" && first(i));
    const missForm = Math.pow(1 - formationMet("common")[0], forms.length);
    const vers = items.filter((i) => i.type === "version" && first(i));
    const missVer = ROUTES[road].map((rt) => vers.filter((v) => rt.some((c) => (v.who ?? "").startsWith(c))).reduce((a, v) => a * (1 - versionMet(v, 0)), 1)).reduce((a, b) => a + b, 0) / ROUTES[road].length;
    const all = 1 - (1 - m[0]) * missForm * missVer;
    rows.push(`| ${ROAD_NAME[road]} | ${pct(sign / S)} | ${pct(m[0])} | ${pct(m[1])} | ${pct(all)} | ${steps.length} pieces in ${new Set(steps.map((g) => g.kind)).size} kinds, ${vers.length} versions, ${forms.length} common formations | ${each.rt.join(", ")}: ${pct(each.m)} |`);
  }
  return rows.join("\n");
}
const ENGINES = ["detonation", "frozen gate", "mirror", "goad", "held charge", "reckoning", "reaping", "judge's drum", "opening again", "fuse", "avalanche", "spell on the swing", "red rain", "riposte", "every colour", "lead's colour", "emptied quiver", "blood mage", "resonance", "crescendo", "mana as armour", "shatter bell", "firecracker", "brink", "two in the dark", "red stone", "borrowed gift", "carrier"];
const unknownEngines = items.flatMap((i) => i.engines.filter((e) => !ENGINES.includes(e.engine)).map((e) => `${i.name}: ${e.engine}`));
if (unknownEngines.length) throw new Error(`unknown engines: ${unknownEngines.join("; ")}`);
/** The chance a formation of a rarity has been offered by the end of each act. */
function formationMet(rarity: "common" | "rare" | "legendary"): number[] {
  const pool = items.filter((i) => i.type === "formation" && i.rarity === rarity).length;
  let miss = 1;
  return [0, 1, 2].map((act) => { miss *= Math.pow(1 - 1 / pool, RUN.formations[act][rarity]); return 1 - miss; });
}
function engineTable(): string {
  const rows = ["| Engine | Its keystone, and where | A keystone piece offered to a roster that can wear it: act I, by II, by III | Its common half |", "| --- | --- | --- | --- |"];
  const cores = randomCores();
  for (const e of ENGINES) {
    const keys = items.filter((i) => i.engines.some((x) => x.engine === e && x.role === "key"));
    const halves = items.filter((i) => i.engines.some((x) => x.engine === e && x.role === "half"));
    const kg = keys.filter((i) => i.type === "gear");
    const m = kg.length ? met(kg, cores) : [0, 0, 0];
    const other = keys.filter((i) => i.type !== "gear").map((i) => (i.type === "formation" ? `${i.name} (${where(i)}: ${pct(formationMet(i.rarity as "common")[1])} by II)` : `${i.name} (${where(i)})`));
    const low = halves.filter((i) => i.rarity === "uncommon" || (i.type === "formation" && i.rarity === "common")).length;
    rows.push(`| ${e} | ${[...kg.map((i) => `${i.name} (${where(i)})`), ...other].join("; ") || "in the kits"} | ${kg.length ? m.map(pct).join(", ") : "no piece"} | ${halves.length} parts, ${low} of them uncommons or common formations |`);
  }
  return rows.join("\n");
}
function roadTable(): string {
  const rows = ["| Road | Rung 1 | Rung 2 | Rung 3 | Formations (common, rare, legendary) | Versions and mythics |", "| --- | --- | --- | --- | --- | --- |"];
  for (const road of ROADS) {
    const at = (rung: number) => gear.filter((g) => g.roads.some((r) => r.road === road && r.rung === rung));
    const f = (r: string) => items.filter((i) => i.type === "formation" && i.rarity === r && i.roads.some((x) => x.road === road && x.worth >= 2)).length;
    const v = items.filter((i) => (i.type === "version" || i.type === "mythic") && i.roads.some((x) => x.road === road && x.worth >= 2)).length;
    const cell2 = (rung: number) => { const a = at(rung); return `${a.length} pieces, ${new Set(a.map((g) => g.kind)).size} kinds`; };
    rows.push(`| ${ROAD_NAME[road]} | ${cell2(1)} | ${cell2(2)} | ${cell2(3)} | ${f("common")}, ${f("rare")}, ${f("legendary")} | ${v} |`);
  }
  return rows.join("\n");
}
/** Every class, on every road it walks: can it wear a first step, a second rung and a keystone? */
function classTable(): string {
  const rows = ["| Class | Pieces it can wear, by road (rung 1 / rung 2 / rung 3) |", "| --- | --- |"];
  for (const c of CLASSES) {
    const mine = gear.filter((g) => KINDS[g.kind].wears.includes(c));
    const cells = ROADS.map((road) => { const k = (rung: number) => mine.filter((g) => g.roads.some((r) => r.road === road && r.rung === rung)).length; return `${road} ${k(1)}/${k(2)}/${k(3)}`; });
    rows.push(`| ${c} | ${cells.join(" · ")} |`);
  }
  return rows.join("\n");
}

/**
 * A what-if for the gate, not a design: today's roll against one where one offer of each fight's three is aimed by the designer's
 * tags, drawn from the pieces of its rarity that someone in the party can wear and that are worth ●● or more to the party's road.
 * For each engine, on a party walking the road most of its keystone pieces serve.
 */
function whatIf(): string {
  const rows = ["| Engine | On | Today: act I, by II, by III | One offer in three aimed: act I, by II, by III |", "| --- | --- | --- | --- |"];
  const f = cfg.spoils.fight, tot = Object.values(f.rarity).reduce((a, b) => a + b, 0);
  const avg = [[0, 0, 0], [0, 0, 0]];
  let count = 0;
  for (const e of ENGINES) {
    const keys = gear.filter((i) => i.engines.some((x) => x.engine === e && x.role === "key"));
    if (!keys.length) continue;
    const tally = new Map<string, number>();
    for (const k of keys) for (const r of k.roads) if (r.worth >= 2 && (ROADS as readonly string[]).includes(r.road)) tally.set(r.road, (tally.get(r.road) ?? 0) + 1);
    const road = [...tally.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] as Road | undefined;
    if (!road) continue;
    const today = met(keys, ROUTES[road]);
    const acc = [0, 0, 0], S = 300;
    for (let s = 0; s < S; s++) {
      const core = ROUTES[road][s % 3];
      const others = shuffled(CLASSES.filter((c) => !core.includes(c)));
      let ex = 0;
      for (let act = 0; act < 3; act++) {
        const roster = [...core, ...others].slice(0, RUN.roster[act]);
        // The unaimed rolls: today's, less one a fight.
        ex += expected(keys, roster, core, act) - keys.reduce((a, g) => a + ((RUN.fights[act] * f.rarity[g.rarity as Rarity]) / tot) * (1 - cfg.spoils.offRoster / 100) * perRoll(g, roster), 0);
        for (const q of RARITIES) {
          const pool = gear.filter((g) => g.rarity === q && core.some((c) => KINDS[g.kind].wears.includes(c)) && g.roads.some((r) => r.road === road && r.worth >= 2));
          const hit = pool.filter((g) => keys.includes(g)).length;
          if (pool.length) ex += ((RUN.fights[act] * f.rarity[q]) / tot) * (hit / pool.length);
        }
        acc[act] += 1 - Math.exp(-ex);
      }
    }
    const aimed = acc.map((x) => x / S);
    today.forEach((x, i) => (avg[0][i] += x)); aimed.forEach((x, i) => (avg[1][i] += x)); count++;
    rows.push(`| ${e} | ${ROAD_NAME[road]} | ${today.map(pct).join(", ")} | ${aimed.map(pct).join(", ")} |`);
  }
  rows.push(`| **On average** | | **${avg[0].map((x) => pct(x / count)).join(", ")}** | **${avg[1].map((x) => pct(x / count)).join(", ")}** |`);
  return rows.join("\n");
}

/** The same what-if for each road's first step: a first-step piece offered in act I, today and with one offer in three aimed. */
function whatIfSteps(): string {
  const rows = ["| Road | Today, act I | One offer in three aimed, act I |", "| --- | --- | --- |"];
  const f = cfg.spoils.fight, tot = Object.values(f.rarity).reduce((a, b) => a + b, 0);
  for (const road of ROADS) {
    const steps = gear.filter((g) => g.roads.some((r) => r.road === road && r.rung === 1));
    let a = 0, b = 0;
    const S = 300;
    for (let s = 0; s < S; s++) {
      const core = ROUTES[road][s % 3];
      const roster = [...core, ...shuffled(CLASSES.filter((c) => !core.includes(c)))].slice(0, RUN.roster[0]);
      const e0 = expected(steps, roster, core, 0);
      let e1 = e0 - steps.reduce((x, g) => x + ((RUN.fights[0] * f.rarity[g.rarity as Rarity]) / tot) * (1 - cfg.spoils.offRoster / 100) * perRoll(g, roster), 0);
      for (const q of RARITIES) {
        const pool = gear.filter((g) => g.rarity === q && core.some((c) => KINDS[g.kind].wears.includes(c)) && g.roads.some((r) => r.road === road && r.worth >= 2));
        if (pool.length) e1 += ((RUN.fights[0] * f.rarity[q]) / tot) * (pool.filter((g) => steps.includes(g)).length / pool.length);
      }
      a += 1 - Math.exp(-e0); b += 1 - Math.exp(-e1);
    }
    rows.push(`| ${ROAD_NAME[road]} | ${pct(a / S)} | ${pct(b / S)} |`);
  }
  return rows.join("\n");
}

const tables: Record<string, string> = { stock: stockTable(), kinds: kindTable(), parts: partsTable(), roads: roadTable(), signs: signTable(), engines: engineTable(), classes: classTable() };
const exotics = items.filter((i) => i.roads.some((r) => r.road === "exotic"));
const rl = gear.filter((g) => g.rarity === "rare" || g.rarity === "legendary").length;
console.log(Object.entries(tables).map(([k, v]) => `## ${k}\n\n${v}`).join("\n\n"));
console.log(`\n## what if (printed only)\n\n${whatIf()}\n\n${whatIfSteps()}`);
console.log(`\nItems read: ${gear.length} pieces with an effect, ${items.filter((i) => i.type === "formation").length} formations, ${items.filter((i) => i.type === "version").length} versions listed, ${items.filter((i) => i.type === "mythic").length} mythics.`);
console.log(`Exotics: ${exotics.length} (${exotics.map((i) => i.name).join(", ")}), against ${rl} rares and legendaries and ${items.filter((i) => i.type === "formation").length} formations.`);
const noSees = items.filter((i) => (i.roads.some((r) => r.rung === 1) || i.engines.some((e) => e.role === "key")) && !i.sees && i.type !== "mythic" && !/\(kept\)/.test(md.split("\n").find((l) => l.includes(`**${i.name}**`)) ?? ""));
console.log(`First steps and keystones with no "Sees": ${noSees.map((i) => i.name).join(", ") || "none"}`);

if (process.argv.includes("--write")) {
  let out = md;
  for (const [k, v] of Object.entries(tables)) {
    const re = new RegExp(`(<!-- ${k}:start -->)[\\s\\S]*?(<!-- ${k}:end -->)`);
    if (re.test(out)) out = out.replace(re, `$1\n${v}\n$2`);
  }
  writeFileSync(SPINE, out);
  console.log(`\nWrote the generated tables into ${SPINE}.`);
}
