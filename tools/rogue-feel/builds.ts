/**
 * The feel tool's build mode (`--builds`): the build test's parties (`tools/build-parties.ts`) played against the build test's
 * fights, or against named ones, each fight logged for a reading pack, and each build's card (`docs/build-cards.md`) gathered
 * for the reader. The fights start as the build test starts them (`START`: rolled, unless `--fixed-start`).
 */
import { readFileSync } from "node:fs";
import { advance, type Content } from "../../src/engine/run.js";
import { combat, type Member as EngineMember } from "../../src/engine/combat/rules.js";
import type { Entry } from "../../src/engine/log.js";
import type { FightTier } from "../../src/rogue.js";
import type { FoesT, Party } from "../../src/schema.js";
import { BUILD_PARTIES, BUILDS, ROUTES, type BuildId } from "../build-parties.js";
import { field, fightSeed, fightSet, fightsById, floorAt, setsOf, startRun, type FightSpec } from "../build-test.js";

/** Which build party a pack is: the build, its route and what the route is built around, its rung, and the fight's pool. */
export type BuildTag = { party: string; build: BuildId; name: string; route: string; note: string; rung: number; pool: string };

/** One fight as the feel tool records it (its `Rec`). */
export type BuildRec = {
  seed: number; act: number; floor: number; tier: FightTier; region: string; fightId: string; fightName: string; won: boolean; ticks: number;
  party: Party; members: { cls: string; hp: number; maxHp: number; mp: number; maxMp: number; stats: Record<string, number>; cooldowns?: Record<string, number> }[];
  foes: string[]; log: Entry[]; knob: FoesT; build: BuildTag;
};

export type BuildOpts = { builds: string[]; rungs: number[]; routes: string[]; fights: string[]; seeds: number; rolled: boolean };

/** Every chosen build party (its formation version) on every chosen fight: its rung's sets (`setsOf`), or the named fights. */
export function playBuilds(c: Content, o: BuildOpts): BuildRec[] {
  const all = o.builds.includes("all") ? Object.keys(BUILDS) : o.builds;
  const parties = BUILD_PARTIES.filter((p) => all.includes(p.build) && o.rungs.includes(p.rung) && (!o.routes.length || o.routes.includes(p.route)));
  const named = o.fights.length ? fightsById(c, o.fights) : [];
  if (o.fights.length && !named.length) throw new Error(`--fights: none of ${o.fights.join(", ")} is in a region's pools`);
  const sets = new Map([1, 2, 3].map((a) => [a, fightSet(c, a)]));
  const out: BuildRec[] = [];
  for (const p of parties) {
    const route = ROUTES.find((r) => r.build === p.build && r.id === p.route)!;
    const party = field(c, p);
    const fights: FightSpec[] = named.length ? named : setsOf(p.rung).flatMap((a) => sets.get(a)!);
    for (const f of fights) for (let i = 0; i < o.seeds; i++) {
      const seed = fightSeed(f.key, i);
      const er = startRun(c, party, f, seed, true, o.rolled);
      const members = (er.party as EngineMember[]).map((m) => ({ cls: m.ref, hp: m.hp, maxHp: m.stats.max_hp, mp: m.mp, maxMp: m.stats.max_mp, stats: { ...m.stats }, ...(m.cooldowns ? { cooldowns: { ...m.cooldowns } } : {}) }));
      advance(c, combat, er);
      const end = (er.log as Entry[]).find((e) => e.t === "fight_end");
      out.push({
        seed, act: f.act, floor: floorAt(c, f.tier, f.pool), tier: f.tier, region: f.region, fightId: f.fight.id, fightName: f.fight.name,
        won: er.outcome === "won", ticks: Number(end?.rounds ?? 0), party, members, foes: f.fight.enemies, log: er.log as Entry[], knob: f.foes,
        build: { party: p.id, build: p.build, name: BUILDS[p.build], route: p.route, note: route.note, rung: p.rung, pool: f.pool },
      });
    }
  }
  return out;
}

/**
 * The packs to read: for each build party, up to `per` fights, a spread first (a regular fight, an elite, a boss; the
 * rung's own act before act II's), losses before wins within each, then the longest of the rest.
 */
export function pickBuildPacks(recs: BuildRec[], per: number): BuildRec[] {
  const out: BuildRec[] = [];
  for (const id of [...new Set(recs.map((r) => r.build.party))]) {
    const mine = recs.filter((r) => r.build.party === id);
    const own = (r: BuildRec) => (r.act === (r.build.rung === 1 ? 1 : r.build.rung === 3 ? 3 : 2) ? 0 : 1);
    const order = (xs: BuildRec[]) => xs.sort((a, b) => own(a) - own(b) || Number(a.won) - Number(b.won) || b.ticks - a.ticks);
    const taken: BuildRec[] = [];
    for (const tier of ["fight", "elite", "boss"] as FightTier[]) { const r = order(mine.filter((x) => x.tier === tier))[0]; if (r && taken.length < per) taken.push(r); }
    for (const r of order(mine.filter((x) => !taken.includes(x)))) if (taken.length < per) taken.push(r);
    out.push(...taken);
  }
  return out;
}

/** The cards of the builds played, with the part every card shares (everything before the first build's heading). */
export function cardsFor(builds: BuildId[]): string {
  const doc = readFileSync("docs/build-cards.md", "utf8");
  const parts = doc.split(/^(?=## )/m);
  const names = new Set(builds.map((b) => BUILDS[b]));
  const isCard = (p: string) => Object.values(BUILDS).some((n) => p.startsWith(`## ${n}\n`));
  return parts.filter((p) => !isCard(p) || names.has(p.slice(3, p.indexOf("\n")))).join("");
}
