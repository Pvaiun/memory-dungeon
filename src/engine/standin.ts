/**
 * THE STAND-IN FIGHT. Crude on purpose, so nobody mistakes it for a design.
 * It exists only to exercise the machinery, and step 4 deletes it.
 *
 * - Units act in speed order (ties random). Each attacks a random enemy, hits
 *   if a roll is under its accuracy, and deals attack minus defence, at least 1.
 *   A side with nobody standing loses.
 * - Only base stats (class, then specialization, then the stat's default).
 *   No abilities, statuses, gear, formations or perks.
 * - HP carries between fights, with no healing. The fallen stay down.
 * - Perk offers are random picks from the dungeon's pool. A picked perk does nothing.
 * - Loot rolls from the dungeon's first-clear or replay table.
 */
import type { LootTableT } from "../schema.js";
import { next, pick, shuffle, type Rng } from "./rng.js";
import type { Content, Fight, Rules, Unit } from "./run.js";

const STATS = ["max_hp", "attack", "defence", "speed", "accuracy"];
/** Not a design rule: a safety stop in case content makes a fight that can't end. */
const SAFETY_ROUNDS = 500;

function stats(c: Content, blocks: (Record<string, number> | undefined)[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const id of STATS) {
    out[id] = c.stats.get(id)?.default ?? 0;
    for (const b of blocks) if (b && b[id] !== undefined) out[id] = b[id];
  }
  return out;
}

const living = (f: Fight, side?: Unit["side"]) => f.units.filter((u) => u.hp > 0 && (!side || u.side === side));

export const standin: Rules = {
  id: "standin-1",

  party(c, input) {
    return input.party.units.map((u, i) => {
      const spec = c.specs.get(u.spec)!;
      const s = stats(c, [c.classes.get(spec.class)?.stats, spec.stats]);
      return { id: `p${i + 1}`, ref: spec.id, name: spec.name, side: "party", stats: s, hp: s.max_hp };
    });
  },

  startFight(x, stage, rng) {
    const count = new Map<string, number>();
    stage.enemies.forEach((id) => count.set(id, (count.get(id) ?? 0) + 1));
    const seen = new Map<string, number>();
    const enemies: Unit[] = stage.enemies.map((id, i) => {
      const e = x.c.enemies.get(id)!;
      const n = seen.get(id) ?? 0;
      seen.set(id, n + 1);
      const s = stats(x.c, [e.stats]);
      const name = count.get(id)! > 1 ? `${e.name} ${"ABCDEFGH"[n]}` : e.name;
      return { id: `e${i + 1}`, ref: id, name, side: "enemy", stats: s, hp: s.max_hp };
    });
    const party = x.run.party.filter((u) => u.hp > 0).map((u) => structuredClone(u));
    return { stage: stage.id, boss: stage.boss ?? false, rng, units: [...party, ...enemies], round: 0, queue: [], result: null, decided: false };
  },

  takeTurn(x, f) {
    if (!f.queue.length) {
      f.round++;
      const order = shuffle(f.rng, living(f)).sort((a, b) => b.stats.speed - a.stats.speed);
      f.queue = order.map((u) => u.id);
      x.log?.({ t: "round", vis: "player", n: f.round, order: f.queue });
    }
    const u = f.units.find((v) => v.id === f.queue[0])!;
    f.queue.shift();
    const target = pick(f.rng, living(f, u.side === "party" ? "enemy" : "party"));
    const roll = next(f.rng);
    const hit = roll < u.stats.accuracy;
    const dmg = hit ? Math.max(1, u.stats.attack - target.stats.defence) : 0;
    target.hp = Math.max(0, target.hp - dmg);
    x.log?.({ t: "roll", vis: "hidden", by: u.id, chance: u.stats.accuracy, roll, attack: u.stats.attack, defence: target.stats.defence });
    x.log?.({ t: "attack", vis: "player", by: u.id, target: target.id, hit, dmg, hp: target.hp });
    if (target.hp === 0) {
      f.queue = f.queue.filter((id) => id !== target.id);
      x.log?.({ t: "down", vis: "player", unit: target.id });
    }
    if (!living(f, "enemy").length) f.result = "won";
    else if (!living(f, "party").length || (f.round >= SAFETY_ROUNDS && !f.queue.length)) f.result = "lost";
  },

  endFight(x, f) {
    for (const p of x.run.party) {
      const u = f.units.find((v) => v.id === p.id);
      if (u) p.hp = u.hp;
    }
  },

  stage(x, stage, rng) {
    if (stage.kind !== "perk_pick") throw new Error(`the stand-in can't play a '${stage.kind}' stage`);
    const offer = x.c.pack.ruleset.run.perkOffer;
    const pool = x.c.dungeons.get(x.run.record.dungeon)!.perkPool.filter((p) => offer.repeatPicked || !x.run.perks.includes(p));
    return { kind: "perk", at: stage.id, options: shuffle(rng, pool).slice(0, offer.options) };
  },

  apply(x, d, choice) {
    if (d.kind !== "perk") throw new Error(`the stand-in has no '${d.kind}' decision`);
    x.run.perks.push(choice);
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

