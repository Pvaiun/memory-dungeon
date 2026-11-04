/**
 * Units leaving and joining: knockouts, the fight's end, revives, summons and splits, and enemy units made from
 * their definitions.
 */
import type { Content } from "../../run.js";
import { rngFor } from "../../rng.js";
import { batch, CARRIED_NONE, type CFight, type CUnit, def, derive, type Item, letter, living, refresh, unit, type W } from "./state.js";
import { applyStatus, endStatus } from "./statuses.js";
import { actDef, cooldownOf, type HitKind } from "./actions.js";
import { ev, fire, listeners, matches, react } from "./events.js";

// ─── KO, revival, leaving and joining (and the core set's revive and summoning) ──

/** Ends a unit's statuses as it leaves play, and the Per source statuses it gave that end with it. */
function strip(w: W, u: CUnit, all: boolean) {
  for (const s of u.statuses.slice()) if (all || !def(w, s.id).survivesKO) endStatus(w, u, s, "ko");
  for (const o of w.f.units) for (const s of o.statuses.slice()) if (s.src === u.id && def(w, s.id).perSource?.endsWithSource) endStatus(w, o, s, "ko");
}

/** `by` is the unit whose damage knocked it out, when known, and `kind` the hit's kind, both on the ko event. */
export function ko(w: W, u: CUnit, by: CUnit | null = null, kind: HitKind | null = null) {
  if (u.ko) return;
  u.ko = true;
  u.hp = 0;
  u.cast = null;
  // It loses its action in progress, and anything it would resolve later.
  w.f.queue = w.f.queue.filter((it) => it.unit !== u.id);
  w.log?.({ t: "down", vis: "player", at: w.f.now, unit: u.id });
  if (!living(w, "enemy").length) w.f.result = "won";
  else if (!living(w, "party").length) w.f.result = "lost";
  if (w.f.result) return void (w.f.result === "won" && won(w));
  strip(w, u, false);
  fire(w, ev("ko", u, by, { kind }));
}

/**
 * The moment the last foe falls, before statuses end, each party unit's fight_won, fallen ones included.
 * Its reactions resolve at once (the fight is over: no next sub-tick), in slot order, while the result waits; a fallen
 * unit's statuses (those that survived its knockout) act for it. Then the result stands, and endFight carries HP as ever.
 * Intensity triggers don't hear it.
 */
function won(w: W) {
  const f = w.f;
  const ids = listeners(w, "fight_won");
  if (!ids || w.after) return;
  const items: Extract<Item, { k: "react" }>[] = [];
  for (const owner of f.units.filter((x) => x.side === "party").sort((a, b) => a.slot - b.slot)) {
    const e = ev("fight_won", owner, null);
    for (const h of f.units) {
      for (const s of h.statuses) {
        if (!ids.has(s.id)) continue;
        def(w, s.id).reactions?.forEach((r, k) => {
          if (!matches(w, r.on, e, h, def(w, s.id))) return;
          const actor = unit(w, r.actor === "source" ? s.src : h.id);
          if (!actor || (actor.ko && actor !== h)) return;
          items.push({
            k: "react", at: f.now, b: batch(actor.side), g: 1, slot: actor.slot, seq: f.seq++, unit: actor.id, holder: h.id, status: s.id, which: k,
            nums: s.nums.slice(), src: s.src, per: 1, other: null, owner: owner.id, amount: 0, dead: actor.ko, ...CARRIED_NONE,
          });
        });
      }
    }
  }
  if (!items.length) return;
  items.sort((a, b) => a.b - b.b || a.slot - b.slot || a.seq - b.seq);
  w.after = true;
  for (const it of items) {
    f.result = null;
    react(w, it);
  }
  f.result = "won";
  w.after = false;
}

/** Raises a knocked-out unit: its fight-start statuses come back, and every action is on cooldown as at the start of a fight, unless `ready`. */
export function revive(w: W, by: CUnit, t: CUnit, hp: number, ready: boolean) {
  if (!t.ko || t.gone) return;
  t.ko = false;
  t.cast = null;
  t.busy = w.f.now;
  t.hp = Math.min(t.stats.max_hp, Math.max(1, Math.floor(hp)));
  for (const id of t.start) applyStatus(w, t, t, def(w, id), { stacks: 1, rng: t });
  refresh(w, t);
  t.hp = Math.min(t.hp, t.stats.max_hp);
  t.acts.forEach((a, i) => (a.ready = ready ? w.f.now : w.f.now + cooldownOf(w, t, actDef(w, t, i))));
  w.log?.({ t: "revive", vis: "player", at: w.f.now, by: by.id, unit: t.id, hp: t.hp, ready });
  fire(w, ev("revived", t, by));
}

/** A unit for the enemy side, from an enemy definition: at fight start or when summoned. */
export function makeUnit(c: Content, f: Pick<CFight, "units" | "seed" | "stage" | "foes">, enemyId: string, side: CUnit["side"], lettered: boolean): CUnit {
  const e = c.enemies.get(enemyId)!;
  const n = f.units.filter((u) => u.side === side).length + 1;
  const same = f.units.filter((u) => u.ref === enemyId).length;
  const id = `${side === "enemy" ? "e" : "p"}${n}`;
  const foes = side === "enemy" ? f.foes : undefined;
  const m: Pick<CUnit, "base" | "flat" | "pct"> = { base: { ...e.stats }, flat: {}, pct: {} };
  if (foes?.power) m.flat.power = foes.power;
  if (foes?.hp) m.pct.max_hp = foes.hp;
  const stats = derive(c, m);
  return {
    id, ref: enemyId, name: lettered ? `${e.name} ${letter(same)}` : e.name, side, stats, hp: stats.max_hp, mp: stats.max_mp,
    slot: n - 1, ...m, start: [...(e.statuses ?? []), ...(foes?.statuses ?? [])], weapon: e.weapon ? `enemy:${enemyId}` : "unarmed",
    ko: false, rng: rngFor(f.seed, `fight:${f.stage}:${id}`),
    acts: [...(e.abilities ?? []).map((a) => ({ id: a, ready: 0 })), { id: "basic", ready: 0 }], cast: null, busy: 0, statuses: [],
  };
}

/** Brings new units into the fight on a side, up to the cap, with every action on cooldown. */
export function summon(w: W, by: CUnit, side: CUnit["side"], enemyId: string, count: number) {
  const f = w.f;
  const lettered = f.units.filter((u) => u.ref === enemyId).length + count > 1;
  for (let n = 0; n < count; n++) {
    if (side === "enemy" && living(w, "enemy").length >= w.c.pack.ruleset.maxEnemies) {
      w.log?.({ t: "cap", vis: "hidden", at: f.now, by: by.id, enemy: enemyId });
      return;
    }
    const u = makeUnit(w.c, f, enemyId, side, lettered);
    f.units.push(u);
    for (const id of u.start) applyStatus(w, u, u, def(w, id), { stacks: 1, rng: u });
    refresh(w, u);
    u.acts.forEach((a, i) => (a.ready = f.now + cooldownOf(w, u, actDef(w, u, i))));
    w.log?.({ t: "join", vis: "player", at: f.now, by: by.id, unit: { id: u.id, ref: u.ref, name: u.name, side: u.side, hp: u.hp, max: u.stats.max_hp } });
  }
}

/** A unit leaves the fight without a knockout (Split) and `count` new units take its place. */
export function replace(w: W, t: CUnit, enemyId: string, count: number) {
  if (t.ko) return;
  t.ko = true;
  t.gone = true;
  t.hp = 0;
  t.cast = null;
  w.f.queue = w.f.queue.filter((it) => it.unit !== t.id);
  w.log?.({ t: "leave", vis: "player", at: w.f.now, unit: t.id });
  strip(w, t, true);
  summon(w, t, t.side, enemyId, count);
  if (!living(w, "enemy").length) (w.f.result = "won"), won(w);
  else if (!living(w, "party").length) w.f.result = "lost";
}
