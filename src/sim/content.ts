/**
 * What a study plays: the content pack, any changes to it (a variant, such as
 * "the Ranger with double HP"), single fights pulled out of dungeons, and the
 * step 3 placeholder ladder.
 */
import { loadContent, type Content } from "../engine/run.js";
import type { DungeonT, EnemyT } from "../schema.js";

/** One change to the raw pack. `path` walks keys, and list items by id: "classes/ranger/stats/max_hp". */
export type Patch = { path: string; set?: unknown; mul?: number; add?: number };

export function patch(raw: unknown, changes: readonly Patch[]): unknown {
  const out = structuredClone(raw) as Record<string, unknown>;
  for (const ch of changes) {
    const keys = ch.path.split("/");
    const last = keys.pop()!;
    let at: any = out;
    for (const k of keys) {
      at = Array.isArray(at) ? (/^\d+$/.test(k) ? at[Number(k)] : at.find((x) => x?.id === k)) : at?.[k];
      if (at === undefined) throw new Error(`patch: nothing at '${ch.path}' (stopped at '${k}')`);
    }
    if (Array.isArray(at)) throw new Error(`patch: '${ch.path}' ends in a list; name an item's field`);
    const was = at[last];
    if (ch.set !== undefined) at[last] = ch.set;
    else if (typeof was !== "number") throw new Error(`patch: '${ch.path}' is ${JSON.stringify(was)}, not a number`);
    else {
      const v = was * (ch.mul ?? 1) + (ch.add ?? 0);
      at[last] = Number.isInteger(was) ? Math.round(v) : v;
    }
  }
  return out;
}

/**
 * PLACEHOLDER, for step 3's sample reports only: copies of the first dungeon
 * with its enemies scaled, as a ladder from weak to strong. Each copy keeps the
 * dungeon's challenges. Thrown away when real dungeons arrive.
 */
export function ladder(raw: unknown, scales: readonly number[]): unknown {
  const pack = structuredClone(raw) as { enemies: EnemyT[]; dungeons: DungeonT[]; progression: { dungeonOrder: string[] } };
  const base = pack.dungeons[0];
  const SCALED = ["max_hp", "attack", "magic"];
  const enemies: EnemyT[] = [];
  const dungeons = scales.map((scale, i) => {
    const n = i + 1;
    const ids = new Map<string, string>();
    for (const s of base.stages) if (s.kind === "fight") for (const e of s.enemies) ids.set(e, `${e}_${n}`);
    for (const [from, to] of ids) {
      const e = structuredClone(pack.enemies.find((x) => x.id === from)!);
      e.id = to;
      for (const k of SCALED) if (e.stats[k] !== undefined) e.stats[k] = Math.round(e.stats[k] * scale);
      enemies.push(e);
    }
    const d = structuredClone(base);
    d.id = `${base.id}_${n}`;
    d.name = `${base.name} ${n}`;
    d.stages = d.stages.map((s) => (s.kind === "fight" ? { ...s, enemies: s.enemies.map((e) => ids.get(e)!) } : s));
    return d;
  });
  pack.enemies = [...pack.enemies, ...enemies];
  pack.dungeons = dungeons;
  pack.progression.dungeonOrder = dungeons.map((d) => d.id);
  return pack;
}

/** Load the content, adding single fights ("dungeon/stage") as one-stage dungeons named "dungeon~stage". */
export function build(raw: unknown, fights: readonly string[] = []): Content {
  const c = loadContent(raw);
  for (const f of fights) {
    const [did, sid] = f.split("/");
    const d = c.dungeons.get(did);
    const stage = d?.stages.find((s) => s.id === sid && s.kind === "fight");
    if (!d || !stage) throw new Error(`no fight '${f}'`);
    c.dungeons.set(`${did}~${sid}`, { ...d, id: `${did}~${sid}`, name: `${d.name}: ${sid}`, stages: [stage], challenges: [] });
  }
  return c;
}
