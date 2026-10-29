/**
 * The rogue mode as the interface keeps it: the run in progress (plain data, saved after every step, so a reload
 * lands where the player was) and what runs leave behind (the classes a run can start with, the heat reached, the
 * record). Kept in localStorage under its own key. A fight is saved as pending: a reload replays it from its start,
 * with the same dice and the same party, so leaving a fight changes nothing.
 */
import { combat, type Member as EngineMember } from "../../src/engine/combat/rules.js";
import { finish, freshMeta, member, migrate, newRogue, partyOf, registerGear, type RogueMeta, type RogueRun } from "../../src/rogue.js";
import { canEquip } from "../../src/validate.js";
import { manifest } from "./art.js";
import { c } from "./content.js";

const KEY = "memory-dungeon.rogue.v1";
type Saved = { run: RogueRun | null; meta: RogueMeta; last?: { won: boolean; unlocked: string[]; heat: boolean } | null };

let s: Saved = load();
function load(): Saved {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { run: null, meta: freshMeta() };
    const v = JSON.parse(raw) as Partial<Saved>;
    const meta = { ...freshMeta(), ...(v.meta ?? {}) };
    meta.owned = meta.owned.filter((id) => c.classes.has(id));
    const run = v.run && v.run.v === 1 && !stale(v.run) ? migrate(v.run) : null;
    return { run, meta, last: v.last ?? null };
  } catch {
    return { run: null, meta: freshMeta() };
  }
}
/**
 * A run saved under rules the content no longer has (step 5j took out the elemental pieces and affixes, the axe and the
 * plain staffs, and moved pieces to kinds some classes can't use): its pieces can't be built, or a member wears one
 * that no longer fits, and the run is set aside. The leaders, the heat and the record stay.
 */
function stale(run: RogueRun): boolean {
  try {
    registerGear(c);
    const affixes = new Set(c.pack.rogue?.affixes.map((a) => a.id) ?? []);
    // Every piece the run holds or offers (a pending pick's items too).
    const pieces: { base: string; affixes: string[] }[] = [];
    JSON.stringify(run, (_k, v: unknown) => {
      if (v && typeof v === "object" && "uid" in v && "base" in v && Array.isArray((v as { affixes?: unknown }).affixes)) pieces.push(v as unknown as { base: string; affixes: string[] });
      return v;
    });
    if (pieces.some((it) => !c.gear.has(it.base) || it.affixes.some((a) => !affixes.has(a)))) return true;
    if (run.roster.some((m) => !c.classes.has(m.cls))) return true;
    registerGear(c, run);
    return run.roster.some((m) => Object.values(m.gear).some((uid) => { const g = uid ? c.gear.get(uid) : undefined; return !g || !canEquip(c.classes.get(m.cls)!, g); }));
  } catch {
    return true;
  }
}
export function saveRogue() {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* private mode: nothing to do */
  }
}

/** The run in progress, with its gear and upgraded abilities known to the content and its weapons to the art. */
export function current(): RogueRun | null {
  if (s.run) prepare(s.run);
  return s.run;
}
export const meta = (): RogueMeta => s.meta;
export const lastRun = () => s.last ?? null;

/** Makes a run's items and upgrades lookups: content ids for its pieces, and each weapon's sprite from its base piece. */
export function prepare(run: RogueRun) {
  registerGear(c, run);
  for (const g of c.pack.rogue?.gear ?? []) if (g.weapon?.kind && !manifest.weapons[g.id]) manifest.weapons[g.id] = manifest.weapons[`plain_${g.weapon.kind}`];
  for (const it of run.items) {
    const base = c.gear.get(it.base);
    if (base?.weapon?.kind && !manifest.weapons[it.uid]) manifest.weapons[it.uid] = manifest.weapons[it.base] ?? manifest.weapons[`plain_${base.weapon.kind}`];
  }
}

/**
 * The next run's dice (step 5h round 6): drawn once and kept until a run starts, so the start screen can show the ability each
 * leader would set out knowing, and leaving the screen doesn't re-roll it. A run started (or abandoned after) draws new ones.
 */
export function nextSeed(): number {
  if (!s.meta.next) {
    s.meta.next = Math.floor(Math.random() * 1e9) + 1;
    saveRogue();
  }
  return s.meta.next;
}
export function startRun(leader: string, heat: number): RogueRun {
  const seed = nextSeed();
  delete s.meta.next;
  s.run = newRogue(c, { seed, leader, heat });
  s.last = null;
  prepare(s.run);
  saveRogue();
  return s.run;
}
/** Ends the run: a won run adds its party to the classes a run can start with. Returns what it unlocked. */
export function endRun(): { won: boolean; unlocked: string[]; heat: boolean } {
  const run = s.run;
  if (!run) return { won: false, unlocked: [], heat: false };
  const r = finish(s.meta, run);
  const won = run.pending.kind === "over" && run.pending.won;
  s.last = { won, ...r };
  s.run = null;
  saveRogue();
  return s.last;
}
/** Gives up the run in progress (it counts as a run, and lost). */
export function abandonRun() {
  if (!s.run) return;
  s.run.pending = { kind: "over", won: false };
  endRun();
}
export function setHeat(h: number) {
  s.meta.heat = Math.max(0, Math.min(s.meta.maxHeat, h));
  saveRogue();
}
/** Back to three starting classes and no record. */
export function resetRogue() {
  s = { run: null, meta: freshMeta(), last: null };
  saveRogue();
}

/** A roster member as it fights: its stats with its gear, its seat's changes if it's in the party. */
export function fighter(run: RogueRun, cls: string): EngineMember {
  prepare(run);
  const inParty = run.party.includes(cls);
  const p = inParty
    ? partyOf(c, run)
    : { formation: "neutral", units: [{ class: cls, position: c.formations.get("neutral")!.positions[0].id, abilities: [...member(run, cls).order], gear: Object.fromEntries(Object.entries(member(run, cls).gear)) as Record<string, string> }] };
  const units = combat.party(c, { dungeon: "rogue_fight", party: p, seed: 1 }) as EngineMember[];
  return units.find((u) => u.ref === cls)!;
}
/** HP and MP as shown: current and max. */
export function vitals(run: RogueRun, cls: string): { hp: number; maxHp: number; mp: number; maxMp: number; ko: boolean } {
  const f = fighter(run, cls);
  const m = member(run, cls);
  return { hp: m.ko ? 0 : Math.max(1, f.stats.max_hp - m.missHp), maxHp: f.stats.max_hp, mp: Math.max(0, f.stats.max_mp - m.missMp), maxMp: f.stats.max_mp, ko: m.ko };
}
