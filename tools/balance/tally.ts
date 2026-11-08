/** Playing one run a moment at a time and reading its log into the tally: damage, casts, MP starvation, kills, statuses and the rest. */
import type { AbilityT, Party } from "../../src/schema.js";
import { advanceOnce, answer, type Content, newRun, type Picker, type Run } from "../../src/engine/run.js";
import { combat } from "../../src/engine/combat/rules.js";
import type { CFight } from "../../src/engine/combat/fight.js";
import type { Entry } from "../../src/engine/log.js";
import { add, type Job, T, type Tally } from "./plays.js";

// ─── Playing and reading ────────────────────────────────────────────────────

/** The classes document's roles, for the bands: the two walls draw (Aggro 5); the Paladin (the judge) stands at Aggro 3 beside the party and heals, so it's judged as a support; the Hoplite (the bruiser) and the Valkyrie (the shieldmaiden) are dealers by design. */
export const ROLE: Record<string, "wall" | "support" | "dealer"> = {
  knight: "wall", bramble_knight: "wall", paladin: "support",
  cleric: "support", bard: "support", hexer: "support",
  hoplite: "dealer", valkyrie: "dealer", ranger: "dealer", monk: "dealer", assassin: "dealer", vampire: "dealer", pyromancer: "dealer", frostweaver: "dealer", stormcaller: "dealer", geomancer: "dealer",
};
export const CASTERS = new Set(["cleric", "paladin", "hexer", "frostweaver", "stormcaller", "geomancer", "pyromancer", "bard", "valkyrie"]);

/** Which statuses an ability applies (its own `apply` effects and its hits' attached statuses), and whether it removes any. */
export function abilityShape(a: AbilityT): { applies: Set<string>; removes: boolean; kind: string } {
  const applies = new Set<string>();
  let removes = false, dmg = false, heal = false, shield = false, revive = false, buff = false, debuff = false, control = false;
  for (const e of a.do) {
    if (e.op === "damage") { dmg = true; for (const ap of e.apply ?? []) applies.add(ap.status); }
    if (e.op === "apply") applies.add(e.status);
    if (e.op === "remove") removes = true;
    if (e.op === "heal") heal = true;
    if (e.op === "revive") revive = true;
  }
  for (const s of applies) {
    if (s === "shield") shield = true;
    else if (["stun", "silence"].includes(s)) control = true;
    else if (["weaken", "slow", "rot", "sunder", "chill", "shock", "burn", "bleed", "doom"].includes(s)) debuff = true;
    else buff = true;
  }
  const kind = dmg ? "damage" : heal ? "heal" : revive ? "revive" : shield ? "shield" : control ? "control" : removes ? "cleanse" : debuff ? "debuff" : buff ? "buff" : "other";
  return { applies, removes, kind };
}

/**
 * The simulations' choice at a decision: at a campfire, a fallen member back (raise, the one with the most max HP) when
 * anyone is down; else HP back (rest) when anyone standing is below a third of their max HP, or the standing party has less
 * of its HP left than of its MP; else MP back (focus). Anything else, the first option.
 */
const simPick: Picker = (d, run) => {
  if (d.kind !== "campfire") return d.options[0];
  const party = run.party as unknown as { id: string; hp: number; mp: number; stats: Record<string, number> }[];
  const raise = d.options.filter((o) => o.startsWith("raise:")).map((o) => party.find((m) => m.id === o.slice(6))!).sort((a, b) => b.stats.max_hp - a.stats.max_hp);
  if (raise.length) return `raise:${raise[0].id}`;
  const up = party.filter((m) => m.hp > 0);
  if (up.some((m) => m.hp * 3 < m.stats.max_hp)) return "rest";
  const share = (k: "hp" | "mp") => up.reduce((a, m) => a + m[k] / Math.max(1, m.stats[`max_${k}`]), 0) / Math.max(1, up.length);
  return share("hp") <= share("mp") ? "rest" : "focus";
};

/** Plays one run a moment at a time (so MP starvation can be read between moments), then reads its log into the tally. */
function playAndTally(c: Content, job: Job, seed: number, t: Tally) {
  const run = newRun(c, combat, { dungeon: job.dungeon, party: job.party, seed, firstClear: true }, { log: true, checked: true });
  const costOf = (id: string) => c.abilities.get(id)?.mp ?? 0;
  let last: CFight | null = null, prev = 0;
  let short = new Set<string>();
  const starved = new Map<string, number>(), alive = new Map<string, number>();
  const bump = (m: Map<string, number>, k: string, v: number) => m.set(k, (m.get(k) ?? 0) + v);
  while (!run.outcome) {
    if (run.pending) {
      const pick = simPick(run.pending, run);
      add(t, `camp|${pick.split(":")[0]}`);
      answer(c, combat, run, pick);
      continue;
    }
    const f = run.fight as CFight | null;
    if (f && f !== last) (last = f), (prev = 0), (short = new Set());
    if (f && f.begun && !f.result) {
      const now = f.now, dt = (now - prev) / T;
      const next = new Set<string>();
      for (const u of f.units) {
        if (u.side !== "party" || u.ko) continue;
        bump(alive, u.ref, dt);
        if (short.has(u.id)) bump(starved, u.ref, dt);
        if (u.acts.some((a) => a.id !== "basic" && a.ready <= now && u.mp < costOf(a.id))) next.add(u.id);
      }
      short = next;
      prev = now;
    }
    advanceOnce(c, combat, run);
  }
  for (const [cls, v] of alive) add(t, `cls|${cls}|alive`, v);
  for (const [cls, v] of starved) add(t, `cls|${cls}|starved`, v);
  readLog(c, run, job, t);
}

function readLog(c: Content, run: Run, job: Job, t: Tally) {
  const log = run.log as Entry[];
  const party = job.party;
  const won = run.outcome === "won";
  const shapes = new Map<string, ReturnType<typeof abilityShape>>();
  const shapeOf = (id: string) => { if (!shapes.has(id)) shapes.set(id, abilityShape(c.abilities.get(id)!)); return shapes.get(id)!; };
  // Run level.
  add(t, "runs"); if (won) add(t, "won"); add(t, "stages", run.stage);
  add(t, `kind|${job.kind}|runs`); if (won) add(t, `kind|${job.kind}|won`);
  add(t, `form|${party.formation}|runs`); if (won) add(t, `form|${party.formation}|won`);
  for (const u of party.units) {
    add(t, `cls|${u.class}|runs`); if (won) add(t, `cls|${u.class}|won`);
    for (const slot of ["weapon", "armor", "amulet"]) {
      const g = u.gear[slot] ?? `none:${slot}`;
      add(t, `gearc|${g}|${u.class}|runs`); if (won) add(t, `gearc|${g}|${u.class}|won`);
      if (job.kind === "kit") add(t, `gear|${g}|kit`);
    }
  }
  const member = (id: string) => party.units[Number(id.slice(1)) - 1];
  // Per fight state.
  const side = new Map<string, string>(), ref = new Map<string, string>(), max = new Map<string, number>(), born = new Map<string, number>();
  const acted = new Map<string, number>(), dealt = new Map<string, number>(), died = new Set<string>();
  const standing = new Set<string>();
  let kind = "mob", lastDown = -1;
  const held = new Map<string, number>(); // "unit|status" -> start
  const stacksOn = new Map<string, number>(); // "unit|status" -> total
  const pool = new Map<string, number>(); // unit -> shield pool
  const lastAct = new Map<string, { id: string; at: number; kind: string }>();
  const lastApplier = new Map<string, string>(); // "target|status" -> applier
  const firstCast = new Map<string, number>(); // "unit|ability"
  const pendingMp = new Map<string, number>();
  const statusAt = new Map<string, { status: string; by: string | null }>(); // unit -> last status applied to it this sub-tick
  const holdsStatus = (u: string, s: string) => held.has(`${u}|${s}`);
  const hpOf = new Map<string, number>();
  const isParty = (id: string) => side.get(id) === "party";
  const endFight = (ticks: number) => {
    // Statuses still held end with the fight.
    for (const [k, start] of held) {
      const [u, s] = k.split("|");
      add(t, `st|${s}|uptime|${side.get(u)}`, Math.max(0, ticks * T - start) / T);
    }
    held.clear(); stacksOn.clear(); pool.clear(); lastAct.clear(); firstCast.clear(); pendingMp.clear(); statusAt.clear(); hpOf.clear();
  };
  for (let i = 0; i < log.length; i++) {
    const e = log[i];
    add(t, `ev|${e.t}`);
    const at = (e.at as number) ?? 0;
    switch (e.t) {
      case "fight_start": {
        kind = e.boss ? "boss" : "mob";
        add(t, `fights|${kind}`);
        side.clear(); ref.clear(); max.clear(); born.clear(); acted.clear(); dealt.clear(); died.clear(); standing.clear();
        const seenEnemy = new Set<string>();
        for (const u of e.units as { id: string; ref: string; side: string; hp: number; max: number }[]) {
          side.set(u.id, u.side); ref.set(u.id, u.ref); max.set(u.id, u.max); born.set(u.id, 0); acted.set(u.id, 0); dealt.set(u.id, 0); hpOf.set(u.id, u.hp);
          if (u.side === "party") {
            if (u.hp <= 0) { died.add(u.id); continue; }
            standing.add(u.id);
            add(t, `cls|${u.ref}|fights|${kind}`); add(t, `cls|${u.ref}|maxHp`, u.max); add(t, `partyHp|${kind}`, u.max);
            const m = member(u.id);
            m.abilities.forEach((a, sl) => { add(t, `ab|${a}|owned|${kind}`); add(t, `ab|${a}|slot|${sl}|owned`); });
            for (const slot of ["weapon", "armor", "amulet"]) { const g = m.gear[slot] ?? `none:${slot}`; add(t, `gear|${g}|worn`); add(t, `gearc|${g}|${u.ref}|worn`); }
            add(t, `form|${party.formation}|fights`);
          } else {
            add(t, `en|${u.ref}|n`);
            if (!seenEnemy.has(u.ref)) { seenEnemy.add(u.ref); add(t, `en|${u.ref}|fights`); for (const a of c.enemies.get(u.ref)?.abilities ?? []) add(t, `eab|${a}|fights`); }
          }
        }
        lastDown = -1;
        break;
      }
      case "join": {
        const u = e.unit as { id: string; ref: string; side: string; hp: number; max: number };
        side.set(u.id, u.side); ref.set(u.id, u.ref); max.set(u.id, u.max); born.set(u.id, at); acted.set(u.id, 1); dealt.set(u.id, 0); hpOf.set(u.id, u.hp);
        // A unit that joins mid-fight (a summon, a split half) enters with its actions on cooldown, so it isn't counted among those killed before acting.
        if (u.side === "enemy") { add(t, `en|${u.ref}|n`); add(t, `en|${u.ref}|summoned`); }
        break;
      }
      case "cast": {
        if (isParty(String(e.by))) add(t, `cls|${ref.get(String(e.by))}|cast`);
        break;
      }
      case "act": {
        const by = String(e.by), r = ref.get(by)!, isAb = e.act !== "basic", id = String(e.act);
        acted.set(by, (acted.get(by) ?? 0) + 1);
        lastAct.set(by, { id, at, kind: isAb ? "ability" : "basic" });
        const targets = (e.targets as string[]).length;
        if (isParty(by)) {
          add(t, `cls|${r}|act|${isAb ? "ability" : "basic"}`);
          if (isAb) {
            add(t, `ab|${id}|casts|${kind}`); add(t, `ab|${id}|targets`, targets);
            const sl = member(by).abilities.indexOf(id); if (sl >= 0) add(t, `ab|${id}|slot|${sl}|casts`);
            const key = `${by}|${id}`;
            if (kind === "mob" && !firstCast.has(key)) { firstCast.set(key, at); add(t, `ab|${id}|first`, at / T); add(t, `ab|${id}|firstN`); }
            const mp = pendingMp.get(by) ?? 0; if (mp) { add(t, `ab|${id}|mp`, mp); pendingMp.delete(by); }
          } else {
            const g = member(by).gear.weapon ?? "none:weapon";
            add(t, `gear|${g}|swings`);
          }
        } else {
          add(t, `en|${r}|act|${isAb ? "ability" : "basic"}`);
          if (isAb) add(t, `eab|${id}|casts`);
        }
        break;
      }
      case "fail": {
        const by = String(e.by), id = String(e.act), why = String(e.why);
        if (isParty(by)) { add(t, `ab|${id}|fail|${why}`); add(t, `cls|${ref.get(by)}|fail|${why}`); } else add(t, `eab|${id}|fail|${why}`);
        break;
      }
      case "mp": {
        const u = String(e.target), v = e.amount as number;
        if (!isParty(u)) break;
        if (v < 0) { add(t, `cls|${ref.get(u)}|mpSpent`, -v); pendingMp.set(u, -v); } else add(t, `cls|${ref.get(u)}|mpGot`, v);
        break;
      }
      case "strike": {
        if (isParty(String(e.by))) add(t, `cls|${ref.get(String(e.by))}|extra`);
        break;
      }
      case "dmg": {
        const tgt = String(e.target), amt = e.amount as number, raw = (e.raw as number) ?? amt, soaked = (e.soaked as number) ?? 0;
        const by = e.by ? String(e.by) : null, part = String(e.part), src = String(e.src), word = e.word as string | null;
        const dk = String(e.kind ?? (part === "pulse" || part === "reaction" ? "untyped" : "physical"));
        const tside = side.get(tgt), dside = by ? side.get(by) : tside === "enemy" ? "party" : "enemy";
        const isHit = part === "hit" || part === "extra" || part === "rider";
        // Who gets the credit: the actor, or for a shared status (Burn, Shock, Bleed) its last applier on this target.
        const owner = by ?? (e.from ? String(e.from) : lastApplier.get(`${tgt}|${src}`) ?? null);
        const oref = owner ? ref.get(owner) : undefined;
        const srcKey = part === "pulse" ? `st:${src}` : part === "reaction" ? `re:${src}` : src === "basic" ? "basic" : `ab:${src}`;
        if (word === "MISS") {
          if (tside === "party") { add(t, `cls|${ref.get(tgt)}|dodged`); add(t, `cls|${ref.get(tgt)}|hitsTaken`); if (holdsStatus(tgt, "taunt")) add(t, `st|taunt|tauntHits`); }
          else { add(t, `en|${ref.get(tgt)}|dodged`); add(t, `en|${ref.get(tgt)}|hitsTaken`); }
          if (oref && dside === "party") { add(t, `cls|${oref}|miss`); if (srcKey.startsWith("ab:")) add(t, `ab|${src}|miss`); }
          break;
        }
        if (dside === "party" && oref) {
          add(t, `cls|${oref}|dmg`, amt); add(t, `cls|${oref}|dmg|${srcKey}`, amt); add(t, `cls|${oref}|dmgk|${dk}`, amt);
          if (isHit) { add(t, `cls|${oref}|hits`); if (e.crit) { add(t, `cls|${oref}|crit`); add(t, `cls|${oref}|critDmg`, amt); } }
          if (srcKey === "basic" && owner) { const g = member(owner).gear.weapon ?? "none:weapon"; add(t, `gear|${g}|swingDmg`, amt); }
          if (srcKey.startsWith("ab:")) { add(t, `ab|${src}|dmg`, amt); if (isHit) { add(t, `ab|${src}|hits`); if (e.crit) add(t, `ab|${src}|crit`); } }
          if (part === "pulse" || part === "reaction") add(t, `st|${src}|dmg`, amt);
          if (owner) { const m = member(owner); for (const slot of ["weapon", "armor", "amulet"]) { const g = m.gear[slot] ?? `none:${slot}`; add(t, `gear|${g}|dmg`, amt); add(t, `gearc|${g}|${oref}|dmg`, amt); } }
          add(t, `form|${party.formation}|dmg`, amt);
        } else if (dside === "enemy") {
          if (oref) { add(t, `en|${oref}|dmg`, amt); if (srcKey.startsWith("ab:")) add(t, `eab|${src}|dmg`, amt); }
          if (part === "pulse" || part === "reaction") add(t, `st|${src}|dmgOnParty`, amt);
        }
        if (owner) dealt.set(owner, (dealt.get(owner) ?? 0) + amt);
        if (dside === "party") add(t, `partyDmg|${kind}`, amt);
        if (tside === "party") {
          const r = ref.get(tgt)!;
          add(t, `cls|${r}|taken`, amt); add(t, `cls|${r}|takenRaw`, raw); add(t, `cls|${r}|taken|${dk}`, amt); add(t, `cls|${r}|takenRaw|${dk}`, raw);
          if (soaked) add(t, `cls|${r}|soaked`, soaked);
          if (word === "AEGIS") add(t, `cls|${r}|aegis`);
          if (isHit) { add(t, `cls|${r}|hitsTaken`); if (holdsStatus(tgt, "taunt")) add(t, `st|taunt|tauntHits`); }
          const m = member(tgt); for (const slot of ["weapon", "armor", "amulet"]) { const g = m.gear[slot] ?? `none:${slot}`; add(t, `gear|${g}|taken`, amt); add(t, `gearc|${g}|${r}|taken`, amt); }
          add(t, `form|${party.formation}|taken`, amt); add(t, `taken|${kind}`, amt);
          if (by && !isParty(by)) add(t, `en|${ref.get(by)}|dealtToParty`, amt);
        } else if (tside === "enemy") {
          const r = ref.get(tgt)!;
          add(t, `en|${r}|taken`, amt); add(t, `en|${r}|takenRaw`, raw); add(t, `en|${r}|taken|${dk}`, amt); add(t, `en|${r}|takenRaw|${dk}`, raw);
          if (isHit) add(t, `en|${r}|hitsTaken`);
        }
        // A killing blow: the entry that takes a unit to 0.
        const hpBefore = hpOf.get(tgt) ?? 0;
        hpOf.set(tgt, e.hp as number);
        if ((e.hp as number) <= 0 && hpBefore > 0 && oref) {
          if (tside === "enemy") { add(t, `cls|${oref}|kills`); if (srcKey.startsWith("ab:")) add(t, `ab|${src}|kills`); if (part === "pulse" || part === "reaction") add(t, `st|${src}|kills`); }
          else { add(t, `en|${oref}|kos`); if (srcKey.startsWith("ab:")) add(t, `eab|${src}|kos`); if (part === "pulse" || part === "reaction") add(t, `st|${src}|kos`); add(t, `koBy|${part === "pulse" ? "status" : srcKey === "basic" ? "basic" : "ability"}`); }
        }
        if (e.shield !== undefined) pool.set(tgt, e.shield as number);
        break;
      }
      case "heal": {
        const tgt = String(e.target), amt = e.amount as number, by = e.by ? String(e.by) : null, src = String(e.src);
        if (side.get(tgt) === "party") {
          add(t, `cls|${ref.get(tgt)}|healGot`, amt); add(t, `heal|${kind}`, amt);
          if (e.word === "ABSORB") add(t, `cls|${ref.get(tgt)}|absorbGot`, amt);
          hpOf.set(tgt, e.hp as number);
        } else if (side.get(tgt) === "enemy") { add(t, `en|${ref.get(tgt)}|healGot`, amt); hpOf.set(tgt, e.hp as number); }
        if (by && isParty(by) && e.word !== "ABSORB") {
          const r = ref.get(by)!;
          add(t, `cls|${r}|healGiven`, amt); add(t, `cls|${r}|heal|${src}`, amt);
          if (c.abilities.has(src)) add(t, `ab|${src}|heal`, amt); else add(t, `st|${src}|heal`, amt);
          const m = member(by); for (const slot of ["weapon", "armor", "amulet"]) { const g = m.gear[slot] ?? `none:${slot}`; add(t, `gear|${g}|heal`, amt); add(t, `gearc|${g}|${r}|heal`, amt); }
        } else if (by && !isParty(by) && e.word !== "ABSORB") { if (c.abilities.has(src)) add(t, `eab|${src}|heal`, amt); add(t, `en|${ref.get(by)}|healGiven`, amt); }
        break;
      }
      case "status": {
        const u = String(e.unit), s = String(e.status), by = e.by ? String(e.by) : null, total = e.total as number | null;
        const uside = side.get(u);
        if (!uside) break;
        add(t, `st|${s}|app|${uside}`);
        if (!held.has(`${u}|${s}`)) held.set(`${u}|${s}`, at);
        let added = 0;
        if (total !== null) { const was = stacksOn.get(`${u}|${s}`) ?? 0; added = Math.max(0, total - was); stacksOn.set(`${u}|${s}`, total); add(t, `st|${s}|stacks|${uside}`, added); }
        statusAt.set(u, { status: s, by });
        if (s === "shield") { const was = pool.get(u) ?? 0; const now = total ?? was; const given = Math.max(0, now - was); pool.set(u, now); if (by && isParty(by)) { add(t, `cls|${ref.get(by)}|shieldGiven`, given); const la = lastAct.get(by); if (la && la.at === at && la.kind === "ability" && shapeOf(la.id).applies.has("shield")) add(t, `ab|${la.id}|shield`, given); } }
        if (by) {
          const bside = side.get(by);
          if (bside && bside !== uside) lastApplier.set(`${u}|${s}`, by);
          if (bside === "party") {
            const r = ref.get(by)!;
            add(t, bside !== uside ? `cls|${r}|app|${s}` : `cls|${r}|appAlly|${s}`);
            // The ability that applied it: the one that resolved this moment and applies this status; otherwise a passive or a piece.
            const la = lastAct.get(by);
            if (la && la.at === at && la.kind === "ability" && shapeOf(la.id).applies.has(s)) { add(t, `ab|${la.id}|app|${s}`); add(t, `ab|${la.id}|stacks|${s}`, added); }
            else add(t, `cls|${r}|passiveApp|${s}`);
            // A formation's effect: at the fight's start, or on an ally's knockout (the same moment a member went down).
            if (at === 0 || (lastDown === at && ["might", "shield"].includes(s))) { const f = c.formations.get(party.formation)!; if (f.statuses?.length && !shapeOf2(c, member(by), s)) add(t, `form|${party.formation}|effect`); }
          }
        }
        break;
      }
      case "status_end": {
        const u = String(e.unit), s = String(e.status), cause = String(e.cause);
        const k = `${u}|${s}`;
        if (held.has(k)) { add(t, `st|${s}|uptime|${side.get(u)}`, (at - held.get(k)!) / T); held.delete(k); }
        stacksOn.delete(k);
        add(t, `st|${s}|end|${cause}`);
        if (s === "shield") pool.set(u, 0);
        if (cause === "removed") {
          // Credit the ability that resolved this moment and removes statuses.
          for (const [by, la] of lastAct) if (la.at === at && la.kind === "ability" && shapeOf(la.id).removes && isParty(by)) { add(t, `ab|${la.id}|removed`); break; }
        }
        break;
      }
      case "immune": { add(t, `st|${e.status}|immune`); break; }
      case "interrupt": {
        const u = String(e.unit), id = String(e.act);
        if (isParty(u)) { add(t, `cls|${ref.get(u)}|interrupted`); add(t, `ab|${id}|interrupted`); } else { add(t, `en|${ref.get(u)}|interrupted`); add(t, `eab|${id}|interrupted`); }
        const st = statusAt.get(u); if (st && st.by) { add(t, `st|${st.status}|interrupts`); if (isParty(st.by)) add(t, `cls|${ref.get(st.by)}|interrupts`); }
        break;
      }
      case "hold": {
        const u = String(e.unit), id = String(e.act);
        if (isParty(u)) { add(t, `cls|${ref.get(u)}|held`); add(t, `ab|${id}|held`); } else { add(t, `en|${ref.get(u)}|held`); add(t, `eab|${id}|held`); }
        const st = statusAt.get(u); if (st && st.by) { add(t, `st|${st.status}|holds`); if (isParty(st.by)) add(t, `cls|${ref.get(st.by)}|stuns`); }
        break;
      }
      case "down": {
        const u = String(e.unit);
        lastDown = at;
        if (isParty(u)) {
          const r = ref.get(u)!;
          add(t, `cls|${r}|ko`); add(t, `cls|${r}|koAt`, at / T); died.add(u); standing.delete(u);
          const m = member(u); for (const slot of ["weapon", "armor", "amulet"]) { const g = m.gear[slot] ?? `none:${slot}`; add(t, `gear|${g}|ko`); add(t, `gearc|${g}|${r}|ko`); }
          add(t, `form|${party.formation}|ko`); add(t, `ko|${kind}`);
        } else {
          const r = ref.get(u)!;
          add(t, `en|${r}|killed`); add(t, `en|${r}|life`, (at - (born.get(u) ?? 0)) / T); if (!acted.get(u)) add(t, `en|${r}|acted0`); died.add(u);
        }
        for (const k of [...held.keys()]) if (k.startsWith(`${u}|`)) { const s = k.split("|")[1]; add(t, `st|${s}|uptime|${side.get(u)}`, (at - held.get(k)!) / T); held.delete(k); stacksOn.delete(k); }
        break;
      }
      case "leave": {
        const u = String(e.unit), r = ref.get(u)!;
        add(t, `en|${r}|replaced`); add(t, `en|${r}|life`, (at - (born.get(u) ?? 0)) / T); died.add(u);
        for (const k of [...held.keys()]) if (k.startsWith(`${u}|`)) { const s = k.split("|")[1]; add(t, `st|${s}|uptime|${side.get(u)}`, (at - held.get(k)!) / T); held.delete(k); stacksOn.delete(k); }
        break;
      }
      case "revive": {
        const u = String(e.unit), by = String(e.by);
        if (isParty(by)) { add(t, `cls|${ref.get(by)}|revives`); const la = lastAct.get(by); if (la && la.at === at) add(t, `ab|${la.id}|revive`); }
        if (isParty(u)) { died.delete(u); standing.add(u); hpOf.set(u, e.hp as number); } else { add(t, `en|${ref.get(u)}|revived`); }
        break;
      }
      case "enrage": { add(t, `enrage|${kind}`); break; }
      case "fight_end": {
        const ticks = e.rounds as number;
        add(t, `ticks|${kind}`, ticks);
        if (e.result === "lost") { add(t, `lost|${kind}`); for (const [u, s] of side) if (s === "enemy" && !died.has(u)) add(t, `en|${ref.get(u)}|survived`); }
        // Enemies alive at the end: their life is the whole fight.
        for (const [u, s] of side) if (s === "enemy" && !died.has(u)) { add(t, `en|${ref.get(u)}|life`, (ticks * T - (born.get(u) ?? 0)) / T); if (!acted.get(u)) add(t, `en|${ref.get(u)}|acted0`); }
        for (const u of standing) { const r = ref.get(u)!; const m = member(u); for (const a of m.abilities) if (kind === "mob" && !firstCast.has(`${u}|${a}`)) add(t, `ab|${a}|silentMob`); }
        endFight(ticks);
        break;
      }
      case "run_end": {
        for (const m of run.party as unknown as { ref: string; hp: number; mp: number; stats: Record<string, number> }[]) {
          add(t, `cls|${m.ref}|endHp`, m.hp / Math.max(1, m.stats.max_hp)); add(t, `cls|${m.ref}|endMp`, m.stats.max_mp ? m.mp / m.stats.max_mp : 1); add(t, `cls|${m.ref}|endN`);
        }
        break;
      }
      default: break;
    }
  }
}
/** Whether a party member's own kit (passive or an ability) could have applied this status at the fight's start or a knockout, so a formation effect isn't credited. */
function shapeOf2(c: Content, m: Party["units"][number], s: string): boolean {
  for (const a of m.abilities) if (abilityShape(c.abilities.get(a)!).applies.has(s)) return true;
  const cls = c.classes.get(m.class)!;
  for (const id of cls.passive?.statuses ?? []) { const d = c.statuses.get(id); if (d?.reactions?.some((r) => r.do.some((x) => x.op === "apply" && x.status === s))) return true; }
  for (const g of Object.values(m.gear)) { const d = c.gear.get(g); for (const id of d?.statuses ?? []) { const st = c.statuses.get(id); if (st?.reactions?.some((r) => r.do.some((x) => x.op === "apply" && x.status === s))) return true; } }
  return false;
}

export function runJob(c: Content, job: Job): Tally {
  const t: Tally = {};
  for (const seed of job.seeds) {
    try { playAndTally(c, job, seed, t); }
    catch (e) { console.error(`balance: a fight crashed: set ${job.set} dungeon ${job.dungeon} seed ${seed} party ${JSON.stringify(job.party)}`); throw e; }
  }
  return t;
}
