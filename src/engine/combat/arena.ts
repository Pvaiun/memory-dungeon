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
  /** Starts the fight knocked out. */
  ko?: boolean;
};

const IDLE: S.WeaponT = { type: "physical", cooldown: 100_000, amount: 0 };

/** 1 × the wielder's Attack: the usual scaling for a physical weapon, which every weapon states for itself. */
export const ATK = { scale: [{ ratio: 1, stat: "attack" }] } satisfies S.NumT;

/** Weapons from the design's examples. */
export const weapons = {
  dagger: { type: "physical", cooldown: 8, amount: ATK },
  axe: { type: "physical", cooldown: 20, amount: ATK },
  sword: { type: "physical", cooldown: 12, amount: ATK },
} satisfies Record<string, S.WeaponT>;

const base = S.ContentPack.parse(pack);
const STATS = base.stats.map((s) => (s.id === "crit_chance" ? { ...s, default: 0 } : s));

export type Arena = ReturnType<typeof arena>;

export function arena(o: {
  party: Spec[];
  enemies: Spec[];
  statuses?: unknown[];
  abilities?: unknown[];
  /** Extra enemy definitions, for summoning, each with an id. */
  extras?: (Spec & { id: string })[];
  seed?: number;
  ruleset?: Partial<S.ContentPack["ruleset"]>;
  stats?: Partial<S.StatDefT>[];
}) {
  const statuses = [...base.statuses.filter((s) => s.id === "mp_regen" || s.id === "thorns"), ...(o.statuses ?? []).map((s) => S.Status.parse(s))];
  const abilities = (o.abilities ?? []).map((a) => S.Ability.parse({ name: "ability", text: "-", ...(a as object) }));
  const specs = [...o.party.map((s, i) => ({ s, side: "party" as const, id: `p${i + 1}`, slot: i })), ...o.enemies.map((s, i) => ({ s, side: "enemy" as const, id: `e${i + 1}`, slot: i }))];
  const enemyOf = (s: Spec, id: string): S.EnemyT => ({ id, name: s.name ?? id.toUpperCase(), text: "-", rank: "minion", stats: s.stats ?? {}, weapon: s.weapon ?? IDLE, abilities: s.abilities, statuses: s.statuses });
  const enemies: S.EnemyT[] = [...specs.map(({ s, id }) => enemyOf(s, id)), ...(o.extras ?? []).map((s) => enemyOf(s, s.id))];
  const stats = STATS.map((s) => ({ ...s, ...(o.stats?.find((x) => x.id === s.id) ?? {}) }));
  for (const x of o.stats ?? []) if (!stats.some((s) => s.id === x.id)) stats.push(S.StatDef.parse({ name: x.id, kind: "amount", default: 0, ...x }));
  const p = { ...base, stats, statuses, abilities, enemies, ruleset: { ...base.ruleset, ...(o.ruleset ?? {}) } };
  const by = <T extends { id: string }>(xs: T[]) => new Map(xs.map((x) => [x.id, x]));
  const c: Content = {
    pack: p, fingerprint: "arena", dungeons: new Map(), enemies: by(enemies), classes: new Map(), stats: by(stats), weaponKinds: by(base.weaponKinds),
    statuses: by(statuses), abilities: by(abilities), gear: new Map(), formations: new Map(), perks: new Map(),
  };
  const seed = o.seed ?? 1;
  const units: CUnit[] = specs.map(({ s, side, id, slot }) => {
    const m = { base: { ...(s.stats ?? {}) }, flat: { ...(s.flat ?? {}) }, pct: { ...(s.pct ?? {}) } };
    const stats = derive(c, m);
    return {
      id, ref: id, name: s.name ?? id.toUpperCase(), side, stats, hp: s.ko ? 0 : (s.hp ?? stats.max_hp), mp: s.mp ?? stats.max_mp, slot, ...m,
      start: [...(s.statuses ?? [])], weapon: `enemy:${id}`, ko: !!s.ko, rng: rngFor(seed, `arena:${id}`),
      acts: [...(s.abilities ?? []).map((a) => ({ id: a, ready: 0 })), { id: "basic", ready: 0 }], cast: null, busy: 0, statuses: [],
    };
  });
  const f: CFight = { stage: "arena", boss: false, units, round: 0, result: null, decided: false, now: 0, seq: 0, queue: [], moments: 0, begun: false, seed };
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
