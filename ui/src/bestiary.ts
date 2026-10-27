/**
 * The bestiary's record, a Pokédex's: the enemies met in a fight (in any mode), and which of those have been looked
 * at, for their NEW tags. In the journey and the rogue mode an enemy not met yet is a silhouette and ???; free play,
 * the sandbox, shows them all. Kept in localStorage under its own key. An install from before the record starts with
 * every enemy of the journey's cleared runs met, so a player who got far doesn't find an empty book.
 */
import { c } from "./content.js";
import { cleared, mode, nodes } from "./journey.js";

const KEY = "memory-dungeon.bestiary.v1";
type Rec = { met: string[]; seen: string[] };

let r: Rec = load();
function load(): Rec {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const v = JSON.parse(raw) as Partial<Rec>;
      return { met: Array.isArray(v.met) ? [...new Set(v.met)] : [], seen: Array.isArray(v.seen) ? v.seen : [] };
    }
  } catch {
    /* private mode: start empty */
  }
  // First load: what the journey's cleared runs met, already looked at.
  const met = new Set<string>();
  for (const n of nodes().slice(0, cleared())) for (const s of c.dungeons.get(n.dungeon)?.stages ?? []) if (s.kind === "fight") for (const e of s.enemies) met.add(e);
  return { met: [...met], seen: [...met] };
}
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(r));
  } catch {
    /* private mode: nothing to do */
  }
}

/** Shown in full: met, or free play. */
export const known = (id: string) => mode() === "free" || r.met.includes(id);
export const metCount = () => c.pack.enemies.filter((e) => known(e.id)).length;
/** Met and not looked at yet (never in free play). */
export const newEnemy = (id: string) => mode() !== "free" && r.met.includes(id) && !r.seen.includes(id);
export const anyNewEnemy = () => c.pack.enemies.some((e) => newEnemy(e.id));

/** Enemies that stepped into a fight: met from now on. */
export function meet(ids: string[]) {
  const add = [...new Set(ids)].filter((id) => c.enemies.has(id) && !r.met.includes(id));
  if (!add.length) return;
  r.met.push(...add);
  save();
}
/** An enemy's page was opened: its NEW tag goes. */
export function look(id: string) {
  if (r.seen.includes(id)) return;
  r.seen.push(id);
  save();
}
