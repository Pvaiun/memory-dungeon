/** The clock: the next moment anything happens, the enrage, the fight's start and each step. */
import { sub } from "../stats.js";
import { next } from "../../rng.js";
import { def, LIMITS, NEVER, refresh, SUBTICKS, unit, type W } from "./state.js";
import { actDef, available, cooldownOf, resolve, start } from "./actions.js";
import { applyStatus, drain, endStatus, pulse } from "./statuses.js";
import { ev, fire, react } from "./events.js";
import { revive } from "./units.js";

// ─── The clock ──────────────────────────────────────────────────────────────

/** The next sub-tick on which anything can happen. */
export function nextTime(w: W): number {
  const f = w.f;
  let t = f.queue.length ? f.queue[0].at : NEVER;
  for (const u of f.units) {
    for (const s of u.statuses) if (s.end !== -1 && s.end < t) t = s.end;
    if (u.ko || u.cast) continue;
    if (u.busy > f.now) {
      t = Math.min(t, u.busy);
      continue;
    }
    if (u.acts.some((_, i) => available(w, u, i))) t = Math.min(t, f.now + 1);
    else for (const a of u.acts) if (a.ready > f.now) t = Math.min(t, a.ready);
  }
  return t;
}

/** ruleset.enrage: the extra damage, in percent, every unit deals once a fight has run long. */
export function enrage(w: W): number {
  const r = w.c.pack.ruleset.enrage;
  if (!r || w.f.now <= r.after * SUBTICKS) return 0;
  return (Math.floor((w.f.now - r.after * SUBTICKS) / (r.every * SUBTICKS)) + 1) * r.pct;
}

/** Fight start: statuses from passives, gear, formations and perks; every action on cooldown as if it had just resolved. */
function begin(w: W) {
  const f = w.f;
  for (const u of f.units) {
    for (const id of u.start) applyStatus(w, u, u, def(w, id), { stacks: 1, rng: u });
    refresh(w, u);
  }
  // ruleset.opening: each action starts partly charged, by its own roll, so a party's actions don't all come up together.
  // With `slots`, a party unit's abilities start charged by the order they're slotted in instead: preparation, not dice.
  const open = w.c.pack.ruleset.opening;
  for (const u of f.units) u.acts.forEach((a, i) => {
    const d = actDef(w, u, i);
    const cd = cooldownOf(w, u, d);
    // A party ability's cooldown carries from the last fight (what was left when it ended, or its full cooldown
    // the first time), and the slot's head start comes off that: slots as flat ticks, or slotShares as a share of the cooldown.
    const carried = u.side === "party" && d.kind === "ability" && u.cooldowns?.[d.id] !== undefined ? Math.min(cd, sub(u.cooldowns[d.id])) : cd;
    if (open?.slotShares?.length && u.side === "party" && d.kind === "ability") a.ready = Math.max(0, carried - Math.round(cd * (open.slotShares[i] ?? 0)));
    else if (open?.slots?.length && u.side === "party" && d.kind === "ability") a.ready = Math.max(0, carried - sub(open.slots[i] ?? 0));
    else a.ready = open ? Math.round(cd * (open.min + (open.max - open.min) * next(u.rng))) : cd;
  });
  // ruleset.stagger: the n-th copy of an enemy starts n × stagger ticks behind the first, so three Ghosts ripple rather than volley.
  const stagger = Math.round((w.c.pack.ruleset.stagger ?? 0) * SUBTICKS);
  if (stagger) {
    const seen = new Map<string, number>();
    for (const u of f.units) {
      if (u.side !== "enemy") continue;
      const n = seen.get(u.ref) ?? 0;
      seen.set(u.ref, n + 1);
      if (n) for (const a of u.acts) a.ready += n * stagger;
    }
  }
  for (const u of f.units) if (!u.ko) fire(w, ev("fight_start", u, null));
  f.begun = true;
}

/** Play one moment. The first call sets the fight up. */
export function step(w: W) {
  const f = w.f;
  if (f.result) return;
  if (!f.begun) return begin(w);
  const t = nextTime(w);
  f.moments++;
  if (t === NEVER || t > LIMITS.ticks * SUBTICKS || f.moments > LIMITS.moments) {
    const why = t === NEVER ? "stalemate" : "timeout";
    w.log?.({ t: "stop", vis: "player", at: f.now, why });
    f.result = "lost";
    return;
  }
  f.now = t;
  const rage = w.c.pack.ruleset.enrage;
  if (rage && !f.enraged && t > rage.after * SUBTICKS) {
    f.enraged = true;
    w.log?.({ t: "enrage", vis: "player", at: t });
  }
  for (const u of f.units) {
    if (u.ko || u.cast || u.busy > t) continue;
    const i = u.acts.findIndex((_, j) => available(w, u, j));
    if (i >= 0) start(w, u, i);
    if (f.result) return;
  }
  while (f.queue.length && f.queue[0].at === t && !f.result) {
    const it = f.queue.shift()!;
    if (it.k === "act") {
      const u = unit(w, it.unit)!;
      if (!u.ko) resolve(w, u, it.act);
    } else if (it.k === "pulse") pulse(w, it);
    else if (it.k === "react") react(w, it);
    else if (it.k === "drain") drain(w, it);
    else if (it.k === "revive") {
      // A revive on a timer stands its unit up, if nothing has raised it meanwhile.
      const t = unit(w, it.unit)!;
      if (t.ko && !t.gone) revive(w, unit(w, it.by) ?? t, t, it.hp, it.ready);
    }
  }
  if (!f.result) {
    for (const u of f.units) for (const s of u.statuses.slice()) if (s.end !== -1 && s.end <= t && !f.result) endStatus(w, u, s, "expired");
  }
  f.round = Math.ceil(t / SUBTICKS);
}
