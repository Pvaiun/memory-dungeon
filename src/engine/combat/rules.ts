/**
 * The battle system, plugged into the run machinery as `Rules`. It replaces
 * step 2's stand-in. The fight itself is in fight.ts; this file builds units
 * from content, carries HP and MP between fights, and runs perk offers and loot.
 *
 * - A party unit's stats are its class and specialization's, plus stat grants
 *   from its class passive, gear, formation slot, formation and perks.
 * - Statuses from those are applied at each fight start.
 * - HP and MP carry between fights. Recovery between fights belongs to step 11,
 *   so there is none yet, and KO'd units stay down.
 * - Each unit draws from its own dice: party units by specialization, enemies by
 *   their place in the fight. The same seed brings the same luck to the same
 *   unit, whatever else is in the fight.
 */
import type { FixedStatT, LootTableT } from "../../schema.js";
import { next, rngFor, shuffle, type Rng } from "../rng.js";
import type { Content, Rules, Unit } from "../run.js";
import { derive, step, world, type CFight, type CUnit } from "./fight.js";

/** A party unit between fights: what it brings to each fight. */
export type Member = Unit & {
  mp: number;
  slot: number;
  base: Record<string, number>;
  flat: Record<string, number>;
  pct: Record<string, number>;
  start: string[];
  weapon: string;
  abilities: string[];
};

type Grant = { stats?: FixedStatT[]; statuses?: string[] };

function grant(m: Pick<Member, "flat" | "pct" | "start">, g: Grant | undefined) {
  for (const s of g?.stats ?? []) {
    if (s.flat) m.flat[s.stat] = (m.flat[s.stat] ?? 0) + s.flat;
    if (s.pct) m.pct[s.stat] = (m.pct[s.stat] ?? 0) + s.pct;
  }
  m.start.push(...(g?.statuses ?? []));
}

/** Re-derive a member's stats after a change; when max HP or MP rises, current rises by the same amount. */
function restat(c: Content, m: Member) {
  const old = m.stats;
  m.stats = derive(c, m);
  if (m.hp > 0) m.hp = Math.min(m.stats.max_hp, m.hp + Math.max(0, m.stats.max_hp - old.max_hp));
  m.mp = Math.min(m.stats.max_mp, m.mp + Math.max(0, m.stats.max_mp - old.max_mp));
}

function fighter(base: Omit<CUnit, "ko" | "rng" | "acts" | "cast" | "busy" | "statuses">, abilities: string[], rng: Rng): CUnit {
  return { ...base, ko: false, rng, acts: [...abilities.map((id) => ({ id, ready: 0 })), { id: "basic", ready: 0 }], cast: null, busy: 0, statuses: [] };
}

export const combat: Rules = {
  id: "combat-1",

  party(c, input) {
    const f = c.formations.get(input.party.formation)!;
    return input.party.units.map((pu, i): Member => {
      const spec = c.specs.get(pu.spec)!;
      const cls = c.classes.get(spec.class)!;
      const slot = f.positions.findIndex((p) => p.id === pu.position);
      const m = { flat: {}, pct: {}, start: [] as string[] };
      grant(m, cls.passive);
      const gear = c.pack.slots.flatMap((s) => (pu.gear[s.id] ? [c.gear.get(pu.gear[s.id])!] : []));
      for (const g of gear) grant(m, g);
      grant(m, f.positions[slot]);
      grant(m, f);
      const base = { ...cls.stats, ...(spec.stats ?? {}) };
      const stats = derive(c, { base, ...m });
      return {
        id: `p${i + 1}`, ref: spec.id, name: spec.name, side: "party", stats, hp: stats.max_hp, mp: stats.max_mp, slot, base, ...m,
        weapon: gear.find((g) => g.weapon)?.id ?? "unarmed", abilities: [...pu.abilities],
      };
    });
  },

  startFight(x, stage, _rng) {
    const seed = x.run.record.seed;
    const party = (x.run.party as Member[])
      .filter((m) => m.hp > 0)
      .map(({ abilities, ...m }) => {
        const copy = { ...m, stats: { ...m.stats }, base: { ...m.base }, flat: { ...m.flat }, pct: { ...m.pct }, start: [...m.start] };
        return fighter(copy, abilities, rngFor(seed, `fight:${stage.id}:${m.ref}`));
      })
      .sort((a, b) => a.slot - b.slot);
    const count = new Map<string, number>();
    stage.enemies.forEach((id) => count.set(id, (count.get(id) ?? 0) + 1));
    const seen = new Map<string, number>();
    const enemies = stage.enemies.map((id, i) => {
      const e = x.c.enemies.get(id)!;
      const n = seen.get(id) ?? 0;
      seen.set(id, n + 1);
      const m = { base: { ...e.stats }, flat: {}, pct: {} };
      const stats = derive(x.c, m);
      return fighter(
        {
          id: `e${i + 1}`, ref: id, name: count.get(id)! > 1 ? `${e.name} ${"ABCDEFGH"[n]}` : e.name, side: "enemy", stats, hp: stats.max_hp, mp: stats.max_mp,
          slot: i, ...m, start: [...(e.statuses ?? [])], weapon: e.weapon ? `enemy:${id}` : "unarmed",
        },
        e.abilities ?? [],
        rngFor(seed, `fight:${stage.id}:e${i + 1}`),
      );
    });
    const f: CFight = {
      stage: stage.id, boss: stage.boss ?? false, units: [...party, ...enemies], round: 0, result: null, decided: false,
      now: 0, seq: 0, queue: [], moments: 0, begun: false,
    };
    return f;
  },

  takeTurn(x, f) {
    step(world(x.c, f as CFight, x.log));
  },

  /** Every status ends with the fight: a max HP increase that ends caps current HP, and that HP carries over. */
  endFight(x, f) {
    for (const m of x.run.party as Member[]) {
      const u = (f as CFight).units.find((v) => v.id === m.id);
      if (!u) continue;
      m.hp = u.ko ? 0 : Math.min(u.hp, m.stats.max_hp);
      m.mp = Math.min(u.mp, m.stats.max_mp);
    }
  },

  stage(x, stage, rng) {
    if (stage.kind !== "perk_pick") throw new Error(`no '${stage.kind}' stage in combat-1`);
    const offer = x.c.pack.ruleset.run.perkOffer;
    const pool = x.c.dungeons.get(x.run.record.dungeon)!.perkPool.filter((p) => offer.repeatPicked || !x.run.perks.includes(p));
    return { kind: "perk", at: stage.id, options: shuffle(rng, pool).slice(0, offer.options) };
  },

  /** A picked perk gives its stat grants now, and its statuses at each later fight start, to the party units it's for. */
  apply(x, d, choice) {
    if (d.kind !== "perk") throw new Error(`no '${d.kind}' decision in combat-1`);
    x.run.perks.push(choice);
    const perk = x.c.perks.get(choice)!;
    for (const m of x.run.party as Member[]) {
      const spec = x.c.specs.get(m.ref)!;
      if (perk.for?.classes && !perk.for.classes.includes(spec.class)) continue;
      if (perk.for?.specs && !perk.for.specs.includes(spec.id)) continue;
      grant(m, perk);
      restat(x.c, m);
    }
  },

  loot(x, rng) {
    const d = x.c.dungeons.get(x.run.record.dungeon)!;
    return roll(x.run.record.firstClear ? d.loot.firstClear : d.loot.replay, rng);
  },
};

function roll(t: LootTableT, rng: Rng): string[] {
  const out = [...(t.guaranteed ?? [])];
  const table = t.table ?? [];
  const total = table.reduce((s, e) => s + e.weight, 0);
  for (let i = 0; i < (t.rolls ?? 0) && table.length; i++) {
    let r = next(rng) * total;
    const hit = table.find((e) => (r -= e.weight) < 0) ?? table[table.length - 1];
    out.push(hit.gear);
  }
  return out;
}
