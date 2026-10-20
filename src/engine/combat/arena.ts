/**
 * Test helper: one fight, set up from units, statuses and abilities written
 * inline, so a test can check one rule exactly. Not game logic.
 *
 * The arena's stat registry is the worked example's, except that crit chance
 * defaults to 0, so nothing is random unless a test asks for it. A unit with
 * no weapon is "idle": its basic attack never comes off cooldown in a test.
 */
import * as S from "../../schema.js";
import type { Entry } from "../log.js";
import { rngFor } from "../rng.js";
import type { Content } from "../run.js";
import { derive, nextTime, step, world, type CFight, type CUnit } from "./fight.js";
import pack from "../../../fixtures/hollow.pack.json" with { type: "json" };

export type Spec = {
  name?: string;
  stats?: Record<string, number>;
  /** Static flat and percent changes, as gear would give. */
  flat?: Record<string, number>;
  pct?: Record<string, number>;
  weapon?: S.WeaponT;
  abilities?: string[];
  /** Applied at fight start. */
  statuses?: string[];
  hp?: number;
  mp?: number;
};

const IDLE: S.WeaponT = { type: "physical", subtype: "blunt", cooldown: 100_000 };

/** Weapons from the design's examples. */
export const weapons = {
  dagger: { type: "physical", subtype: "pierce", cooldown: 8 },
  axe: { type: "physical", subtype: "slash", cooldown: 20 },
  sword: { type: "physical", subtype: "slash", cooldown: 12 },
} satisfies Record<string, S.WeaponT>;

const base = S.ContentPack.parse(pack);
const STATS = base.stats.map((s) => (s.id === "crit_chance" ? { ...s, default: 0 } : s));

export type Arena = ReturnType<typeof arena>;

export function arena(o: { party: Spec[]; enemies: Spec[]; statuses?: unknown[]; abilities?: unknown[]; seed?: number; ruleset?: Partial<S.ContentPack["ruleset"]> }) {
  const statuses = [...base.statuses.filter((s) => s.id === "mp_regen" || s.id === "thorns"), ...(o.statuses ?? []).map((s) => S.Status.parse(s))];
  const abilities = (o.abilities ?? []).map((a) => S.Ability.parse({ name: "ability", text: "-", verbs: [], ...(a as object) }));
  const specs = [...o.party.map((s, i) => ({ s, side: "party" as const, id: `p${i + 1}`, slot: i })), ...o.enemies.map((s, i) => ({ s, side: "enemy" as const, id: `e${i + 1}`, slot: i }))];
  const enemies: S.EnemyT[] = specs.map(({ s, id }) => ({ id, name: s.name ?? id.toUpperCase(), text: "-", rank: "minion", traits: [], stats: s.stats ?? {}, weapon: s.weapon ?? IDLE, verbs: [] }));
  const p = { ...base, stats: STATS, statuses, abilities, enemies, ruleset: { ...base.ruleset, ...(o.ruleset ?? {}) } };
  const by = <T extends { id: string }>(xs: T[]) => new Map(xs.map((x) => [x.id, x]));
  const c: Content = {
    pack: p, fingerprint: "arena", dungeons: new Map(), enemies: by(enemies), specs: new Map(), classes: new Map(), stats: by(STATS),
    statuses: by(statuses), abilities: by(abilities), gear: new Map(), formations: new Map(), perks: new Map(),
  };
  const seed = o.seed ?? 1;
  const units: CUnit[] = specs.map(({ s, side, id, slot }) => {
    const m = { base: { ...(s.stats ?? {}) }, flat: { ...(s.flat ?? {}) }, pct: { ...(s.pct ?? {}) } };
    const stats = derive(c, m);
    return {
      id, ref: id, name: s.name ?? id.toUpperCase(), side, stats, hp: s.hp ?? stats.max_hp, mp: s.mp ?? stats.max_mp, slot, ...m,
      start: [...(s.statuses ?? [])], weapon: `enemy:${id}`, ko: false, rng: rngFor(seed, `arena:${id}`),
      acts: [...(s.abilities ?? []).map((a) => ({ id: a, ready: 0 })), { id: "basic", ready: 0 }], cast: null, busy: 0, statuses: [],
    };
  });
  const f: CFight = { stage: "arena", boss: false, units, round: 0, result: null, decided: false, now: 0, seq: 0, queue: [], moments: 0, begun: false };
  const log: Entry[] = [];
  const w = world(c, f, (e) => log.push(e));
  step(w);

  const unit = (name: string) => {
    const u = f.units.find((x) => x.name === name || x.id === name);
    if (!u) throw new Error(`no unit '${name}'`);
    return u;
  };
  const id = (name: string) => unit(name).id;
  return {
    f, c, log, unit,
    /** Play every moment up to and including `tick`. */
    to(tick: number) {
      while (!f.result && nextTime(w) <= tick * S.SUBTICKS) step(w);
      return this;
    },
    /** Play until the fight ends (or a safety stop). */
    run() {
      while (!f.result) step(w);
      return this;
    },
    entries: (t: string, pred: (e: Entry) => boolean = () => true) => log.filter((e) => e.t === t && pred(e)),
    /** Damage entries on a unit, by name. */
    hits: (target: string) => log.filter((e) => e.t === "dmg" && e.target === id(target)),
    /** When a unit's actions resolved, in ticks. */
    acts: (by: string, act?: string) => log.filter((e) => e.t === "act" && e.by === id(by) && (!act || e.act === act)).map((e) => (e.at as number) / S.SUBTICKS),
    has: (name: string, status: string) => unit(name).statuses.filter((s) => s.id === status),
  };
}
