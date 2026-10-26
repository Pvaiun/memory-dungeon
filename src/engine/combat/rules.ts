/**
 * The battle system, plugged into the run machinery as `Rules`. It replaces
 * step 2's stand-in. The fight itself is in fight.ts; this file builds units
 * from content, carries HP, MP and knockouts between fights, and runs perk
 * offers and loot (unused by the core set, which has no progression yet).
 *
 * - A party unit's stats are its class's, plus stat grants from its class
 *   passive, gear, formation slot, formation and perks.
 * - Statuses from those are applied at each fight start.
 * - HP and MP carry between fights, and nothing restores them. A knocked-out
 *   unit joins later fights knocked out, until something revives it.
 * - Each unit draws from its own dice: party units by class, enemies by
 *   their place in the fight. The same seed brings the same luck to the same
 *   unit, whatever else is in the fight.
 */
import { SLOTS, type FixedStatT, type LootTableT } from "../../schema.js";
import { next, rngFor, type Rng } from "../rng.js";
import type { Content, Rules, Unit } from "../run.js";
import { derive, makeUnit, step, world, type CFight, type CUnit } from "./fight.js";

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
  return { ...base, ko: base.hp <= 0, rng, acts: [...abilities.map((id) => ({ id, ready: 0 })), { id: "basic", ready: 0 }], cast: null, busy: 0, statuses: [] };
}

export const combat: Rules = {
  id: "combat-1",

  party(c, input) {
    const f = c.formations.get(input.party.formation)!;
    return input.party.units.map((pu, i): Member => {
      const cls = c.classes.get(pu.class)!;
      const slot = f.positions.findIndex((p) => p.id === pu.position);
      const m = { flat: {}, pct: {}, start: [] as string[] };
      grant(m, cls.passive);
      const gear = Object.keys(SLOTS).flatMap((s) => (pu.gear[s] ? [c.gear.get(pu.gear[s])!] : []));
      for (const g of gear) grant(m, g);
      grant(m, f.positions[slot]);
      grant(m, f);
      const base = { ...cls.stats };
      const stats = derive(c, { base, ...m });
      return {
        id: `p${i + 1}`, ref: cls.id, name: cls.name, side: "party", stats, hp: stats.max_hp, mp: stats.max_mp, slot, base, ...m,
        weapon: gear.find((g) => g.weapon)?.id ?? "unarmed", abilities: [...pu.abilities],
      };
    });
  },

  startFight(x, stage, _rng) {
    const seed = x.run.record.seed;
    const party = (x.run.party as Member[])
      .map(({ abilities, ...m }) => {
        const copy = { ...m, stats: { ...m.stats }, base: { ...m.base }, flat: { ...m.flat }, pct: { ...m.pct }, start: [...m.start] };
        return fighter(copy, abilities, rngFor(seed, `fight:${stage.id}:${m.ref}`));
      })
      .sort((a, b) => a.slot - b.slot);
    // A dungeon's change to its foes; a boss fight takes `bossFoes` instead when the dungeon sets one.
    const dn = x.c.dungeons.get(x.run.record.dungeon);
    const foes = stage.boss && dn?.bossFoes ? dn.bossFoes : dn?.foes;
    const f: CFight = {
      stage: stage.id, boss: stage.boss ?? false, units: party, round: 0, result: null, decided: false,
      now: 0, seq: 0, queue: [], moments: 0, begun: false, seed, ...(foes ? { foes } : {}),
    };
    const count = new Map<string, number>();
    stage.enemies.forEach((id) => count.set(id, (count.get(id) ?? 0) + 1));
    for (const id of stage.enemies) f.units.push(makeUnit(x.c, f, id, "enemy", count.get(id)! > 1));
    return f;
  },

  takeTurn(x, f) {
    step(world(x.c, f as CFight, x.log));
  },

  /** Every status ends with the fight: a max HP increase that ends caps current HP, and that HP carries over. A revived unit carries its HP too. */
  endFight(x, f) {
    const restore = f.result === "won" ? x.c.pack.ruleset.run.restore : undefined;
    for (const m of x.run.party as Member[]) {
      const u = (f as CFight).units.find((v) => v.id === m.id);
      if (!u) continue;
      m.hp = u.ko ? 0 : Math.min(u.hp, m.stats.max_hp);
      m.mp = Math.min(u.mp, m.stats.max_mp);
      // A what-if the campaign tuning priced (ruleset.run.restore); the core set restores nothing.
      if (restore && m.hp > 0) {
        m.hp = Math.min(m.stats.max_hp, m.hp + Math.floor((m.stats.max_hp * (restore.hp ?? 0)) / 100));
        m.mp = Math.min(m.stats.max_mp, m.mp + Math.floor((m.stats.max_mp * (restore.mp ?? 0)) / 100));
      }
    }
  },

  stage(x, stage, rng) {
    if (stage.kind === "campfire") {
      // RAISE is one option per knocked-out member ("raise:p2"), so the player picks who.
      const down = stage.revive ? (x.run.party as Member[]).filter((m) => m.hp <= 0).map((m) => `raise:${m.id}`) : [];
      return { kind: "campfire", at: stage.id, options: ["rest", "focus", ...down] };
    }
    if (stage.kind !== "perk_pick") throw new Error(`no '${stage.kind}' stage in combat-1`);
    const offer = x.c.pack.ruleset.run.perkOffer;
    const pool = x.c.dungeons.get(x.run.record.dungeon)!.perkPool.filter((p) => offer.repeatPicked || !x.run.perks.includes(p));
    return { kind: "perk", at: stage.id, options: shuffle(rng, pool).slice(0, offer.options) };
  },

  /** A picked perk gives its stat grants now, and its statuses at each later fight start, to the party units it's for. */
  apply(x, d, choice) {
    if (d.kind === "campfire") {
      // REST gives back a share of max HP, FOCUS a share of max MP, to every standing member; RAISE stands one fallen member up.
      const st = x.c.dungeons.get(x.run.record.dungeon)!.stages.find((s) => s.id === d.at);
      if (st?.kind !== "campfire") throw new Error(`no campfire '${d.at}'`);
      if (choice.startsWith("raise:")) {
        const m = (x.run.party as Member[]).find((p) => p.id === choice.slice(6) && p.hp <= 0);
        if (!m) throw new Error(`nobody to raise at '${choice}'`);
        m.hp = Math.max(1, Math.floor((m.stats.max_hp * (st.revive ?? 0)) / 100));
        return;
      }
      for (const m of x.run.party as Member[]) {
        if (m.hp <= 0) continue;
        if (choice === "rest") m.hp = Math.min(m.stats.max_hp, m.hp + Math.floor((m.stats.max_hp * st.hp) / 100));
        else m.mp = Math.min(m.stats.max_mp, m.mp + Math.floor((m.stats.max_mp * st.mp) / 100));
      }
      return;
    }
    if (d.kind !== "perk") throw new Error(`no '${d.kind}' decision in combat-1`);
    x.run.perks.push(choice);
    const perk = x.c.perks.get(choice)!;
    for (const m of x.run.party as Member[]) {
      if (perk.for?.classes && !perk.for.classes.includes(m.ref)) continue;
      grant(m, perk);
      restat(x.c, m);
    }
  },

  loot(x, rng) {
    const d = x.c.dungeons.get(x.run.record.dungeon)!;
    if (!d.loot) return [];
    return roll(x.run.record.firstClear ? d.loot.firstClear : d.loot.replay, rng);
  },
};

function shuffle<T>(rng: Rng, xs: readonly T[]): T[] {
  const out = xs.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next(rng) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

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
