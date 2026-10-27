/**
 * The feel tool for the rogue mode (steps/05-core-set/5g-feel): the simulated player plays whole runs with every fight
 * logged, and a spread of those fights (each act, regular fights early and late, elites, bosses, with parties that cover
 * the classes) is written out as reading packs for a feel reader: the fight tick by tick in the designer's view (both
 * sides' HP, MP spent and gained, every status with its stacks), with the party's kit at the top and a tally at the
 * bottom (each unit's actions, its damage by source, the statuses' share). A summary of every fight played goes beside
 * the packs: the short simulation that sits next to the read.
 *
 *   npx tsx src/rogue-feel.ts [--runs 48] [--heat 0] [--packs 10] [--focus frostweaver,hexer] [--player] [--out out/feel] [--set path=value]...
 *
 * The leader cycles through every class and the draft picks at random, so every class is seen (the simulated player's own
 * drafter never takes the Frostweaver or the Hexer); --player plays it as the simulated player does, three leaders and its
 * own picks. --focus picks fights whose party holds those classes first. Seeds are fixed, so a round's packs can be compared
 * with the last's.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { advance, loadContent, type Content } from "./engine/run.js";
import { combat, type Member as EngineMember } from "./engine/combat/rules.js";
import type { Entry } from "./engine/log.js";
import { choose, endFight, newRogue, partyOf, registerGear, rogue, startFight, type FightTier, type RogueRun } from "./rogue.js";
import { aiPlayer } from "./rogue-ai.js";
import { parsePatches } from "./rogue-sim.js";
import { patch } from "./sim/content.js";
import type { AbilityT, GearT, NumT, Party } from "./schema.js";

const args = process.argv.slice(2);
const opt = (k: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const all = (k: string) => args.flatMap((a, i) => (a === k ? [args[i + 1]] : []));
const raw = patch(JSON.parse(readFileSync("content/core-set.pack.json", "utf8")), parsePatches(all("--set")));
const c = loadContent(raw);
const RUNS = Number(opt("--runs") ?? 48);
const HEAT = Number(opt("--heat") ?? 0);
const PACKS = Number(opt("--packs") ?? 10);
const FOCUS = (opt("--focus") ?? "").split(",").filter(Boolean);
const OUT = opt("--out") ?? "out/feel";
const PLAYER = args.includes("--player");
const LEADERS = PLAYER ? ["knight", "cleric", "ranger"] : c.pack.classes.map((k) => k.id);

type Rec = {
  seed: number; act: number; floor: number; tier: FightTier; region: string; fightId: string; fightName: string; won: boolean; ticks: number;
  party: Party; members: { cls: string; hp: number; maxHp: number; mp: number; maxMp: number; stats: Record<string, number> }[]; foes: string[]; log: Entry[];
  knob: { hp?: number; power?: number };
};

// ─── Playing ─────────────────────────────────────────────────────────────────

const recs: Rec[] = [];
for (let s = 1; s <= RUNS; s++) {
  const seed = 9000 + s;
  const run = newRogue(c, { seed, leader: LEADERS[s % LEADERS.length], heat: HEAT });
  const ai = aiPlayer(PLAYER ? {} : { noise: 1, noisy: ["draft"] }, seed);
  for (let i = 0; i < 3000 && run.pending.kind !== "over"; i++) {
    ai.prepare(c, run);
    const p = run.pending;
    if (p.kind !== "fight") { choose(c, run, ai.decide(c, run)); continue; }
    const party = partyOf(c, run);
    const er = startFight(c, run, { log: true });
    const members = (er.party as EngineMember[]).map((m) => ({ cls: m.ref, hp: m.hp, maxHp: m.stats.max_hp, mp: m.mp, maxMp: m.stats.max_mp, stats: { ...m.stats } }));
    advance(c, combat, er);
    const end = (er.log as Entry[]).find((e) => e.t === "fight_end");
    recs.push({
      seed, act: run.act, floor: run.floor, tier: p.tier, region: run.region, fightId: p.fight.id, fightName: p.fight.name, won: er.outcome === "won",
      ticks: Number(end?.rounds ?? 0), party, members, foes: p.fight.enemies, log: er.log as Entry[], knob: p.foes,
    });
    endFight(c, run, er);
  }
}

// ─── Reading the logs ────────────────────────────────────────────────────────

type Side = "party" | "enemy";
type UnitInfo = { id: string; ref: string; name: string; side: Side; max: number };
/** Per-unit tallies for one fight. */
type UT = { basics: number; casts: Record<string, number>; fizz: number; dealt: Record<string, number>; taken: number; healed: number; mpSpent: number; mpGained: number; downAt: number | null; firstCast: Record<string, number>; firstAct: number | null };
type StatusT2 = { apps: number; stacks: number; peak: number; dmg: number; byClass: Record<string, number> };
type Read = { units: Map<string, UnitInfo>; ut: Map<string, UT>; status: Map<string, StatusT2>; interrupts: number; holds: number; mpEnd: Map<string, number> };

const nameOf = (c: Content, src: string) => c.abilities.get(src)?.name ?? c.statuses.get(src)?.name ?? (src === "basic" ? "basic" : src);
/** Statuses the player sees as icons; passives, stat machinery and MP regen are left out of the reading. */
const shown = (id: unknown) => c.statuses.get(String(id))?.show === "icon";

function readLog(r: Rec): Read {
  const units = new Map<string, UnitInfo>();
  const ut = new Map<string, UT>();
  const status = new Map<string, StatusT2>();
  const mpEnd = new Map<string, number>();
  const fresh = (): UT => ({ basics: 0, casts: {}, fizz: 0, dealt: {}, taken: 0, healed: 0, mpSpent: 0, mpGained: 0, downAt: null, firstCast: {}, firstAct: null });
  const hpLeft = new Map<string, number>();
  let interrupts = 0, holds = 0;
  const add = (o: Record<string, number>, k: string, v: number) => { o[k] = (o[k] ?? 0) + v; };
  // A shared status (Burn, Shock, Bleed) names no applier on its pulses (one total, many appliers): its damage is split
  // among the party units by the stacks each added to that foe's total.
  const prevTotal = new Map<string, number>();
  const stackBy = new Map<string, Map<string, number>>();
  for (const e of r.log) {
    const at = typeof e.at === "number" ? e.at / 1000 : 0;
    switch (e.t) {
      case "fight_start":
        for (const u of e.units as (UnitInfo & { hp: number })[]) { units.set(u.id, u); ut.set(u.id, fresh()); hpLeft.set(u.id, u.hp); }
        break;
      case "join": { const u = e.unit as UnitInfo & { hp: number }; units.set(u.id, u); ut.set(u.id, fresh()); hpLeft.set(u.id, u.hp); break; }
      case "act": {
        const t = ut.get(String(e.by)); if (!t) break;
        if (t.firstAct === null) t.firstAct = at;
        if (e.act === "basic") t.basics++;
        else { add(t.casts, String(e.act), 1); if (t.firstCast[String(e.act)] === undefined) t.firstCast[String(e.act)] = at; }
        break;
      }
      case "fail": if (e.why === "mp") { const t = ut.get(String(e.by)); if (t) t.fizz++; } break;
      case "mp": {
        const t = ut.get(String(e.target)); if (!t) break;
        const v = Number(e.amount);
        if (v < 0) t.mpSpent += -v; else t.mpGained += v;
        mpEnd.set(String(e.target), Number(e.mp));
        break;
      }
      case "dmg": {
        const amt = Number(e.amount) || 0;
        const tgt = String(e.target);
        const real = Math.min(amt, Math.max(0, hpLeft.get(tgt) ?? amt));
        hpLeft.set(tgt, Number(e.hp));
        const tt = ut.get(tgt); if (tt) tt.taken += amt;
        if (e.part === "pulse" || e.part === "reaction") {
          const src = String(e.src);
          const from = e.from ? String(e.from) : e.by ? String(e.by) : null;
          if (from && ut.get(from)) add(ut.get(from)!.dealt, `status:${src}`, real);
          else {
            const shares = stackBy.get(`${tgt}|${src}`);
            const sum = shares ? [...shares.values()].reduce((a, b) => a + b, 0) : 0;
            if (shares && sum > 0) for (const [who, n] of shares) if (ut.get(who)) add(ut.get(who)!.dealt, `status:${src}`, (real * n) / sum);
          }
          if (units.get(tgt)?.side === "enemy") {
            const st = status.get(src) ?? { apps: 0, stacks: 0, peak: 0, dmg: 0, byClass: {} };
            st.dmg += real; status.set(src, st);
          }
        } else if (e.by) {
          const t = ut.get(String(e.by));
          if (t) add(t.dealt, e.part === "extra" ? "basic" : String(e.src), real);
        }
        break;
      }
      case "heal": {
        hpLeft.set(String(e.target), Number(e.hp));
        if (e.by && ut.get(String(e.by))) ut.get(String(e.by))!.healed += Number(e.amount) || 0;
        break;
      }
      case "status": {
        if (units.get(String(e.unit))?.side !== "enemy" || !shown(e.status)) break;
        const st = status.get(String(e.status)) ?? { apps: 0, stacks: 0, peak: 0, dmg: 0, byClass: {} };
        st.apps++;
        if (typeof e.total === "number") st.peak = Math.max(st.peak, e.total);
        status.set(String(e.status), st);
        if (typeof e.total === "number" && e.by && units.get(String(e.by))?.side === "party") {
          const key = `${String(e.unit)}|${String(e.status)}`;
          const added = Math.max(0, e.total - (prevTotal.get(key) ?? 0));
          prevTotal.set(key, e.total);
          const m = stackBy.get(key) ?? new Map<string, number>();
          m.set(String(e.by), (m.get(String(e.by)) ?? 0) + added);
          stackBy.set(key, m);
        }
        break;
      }
      case "status_end": { const key = `${String(e.unit)}|${String(e.status)}`; prevTotal.delete(key); stackBy.delete(key); break; }
      case "interrupt": if (units.get(String(e.unit))?.side === "enemy") interrupts++; break;
      case "hold": if (units.get(String(e.unit))?.side === "enemy") holds++; break;
      case "down": { const t = ut.get(String(e.unit)); if (t) t.downAt = at; hpLeft.set(String(e.unit), 0); break; }
      case "revive": hpLeft.set(String(e.unit), Number(e.hp)); break;
    }
  }
  return { units, ut, status, interrupts, holds, mpEnd };
}

// ─── The packs ───────────────────────────────────────────────────────────────

const pts = (n: number) => Math.round(n / 100) / 10;
const n0 = (x: number) => Math.round(x).toLocaleString("en");
const n1 = (x: number) => (Math.round(x * 10) / 10).toString();
const pc = (a: number, b: number) => (b ? `${Math.round((100 * a) / b)}%` : "–");
const val = (n: NumT | undefined, st: Record<string, number>) => (n === undefined ? 1 : typeof n === "number" ? n : (n.base ?? 0) + n.scale.reduce((t, x) => t + (x.stat && x.of !== "target" ? x.ratio * (st[x.stat] ?? 0) : 0), 0));
function sizeOf(a: AbilityT, st: Record<string, number>): string {
  const out: string[] = [];
  const stacks = (id: string, n: NumT | undefined) => {
    const d = c.statuses.get(id)!;
    if (d.stacking !== "intensity") return d.name;
    return `${n1(val(n, st))} ${d.name}`;
  };
  for (const e of a.do) {
    if (e.op === "damage") {
      const kind = e.element ?? (e.type === "physical" ? e.subtype ?? "physical" : "untyped");
      const v = Math.round(val(e.amount, st));
      out.push(`${v ? `${n0(v)} ` : ""}${kind}${e.hits && e.hits > 1 ? ` x${e.hits}` : ""}${(e.apply ?? []).map((x) => ` + ${x.status === "shield" ? `${n0(val(x.stacks, st))} shield` : stacks(x.status, x.stacks)}`).join("")}`);
    } else if (e.op === "heal") out.push(`heals ${n0(val(e.amount, st))}`);
    else if (e.op === "mp") out.push(`MP ${n0(val(e.amount, st))}`);
    else if (e.op === "apply" && e.status === "shield") out.push(`shield ${n0(val(e.stacks, st))}`);
    else if (e.op === "apply") out.push(stacks(e.status, e.stacks));
    else if (e.op === "remove") out.push(`strips ${e.label}s`);
    else if (e.op === "revive") out.push("revives");
  }
  return out.join(" + ");
}
const statWord = (s: { stat: string; flat?: NumT; pct?: NumT }) => {
  const v = typeof s.flat === "number" ? s.flat : 0;
  const pctStat = /crit|evasion|accuracy|double|lifesteal|siphon|resist/.test(s.stat);
  const real = s.stat === "max_hp" || s.stat === "max_mp" || s.stat === "aggro" || s.stat === "thorns";
  return `${s.stat} ${v > 0 ? "+" : ""}${pctStat ? `${v}%` : real ? v : pts(v)}`;
};
function gearWords(g: GearT | undefined): string {
  if (!g) return "nothing";
  const fx = (g.statuses ?? []).map((id) => c.statuses.get(id)?.text).filter(Boolean).join(" ");
  return `${g.name}${g.stats?.length ? ` (${g.stats.map(statWord).join(", ")})` : ""}${fx ? `: ${fx}` : ""}`;
}

function pack(r: Rec, n: number): string {
  const rd = readLog(r);
  const reg = rogue(c).regions.find((x) => x.id === r.region)!;
  const out: string[] = [];
  out.push(`# Pack ${n}: ${r.fightName} (${r.tier}), act ${r.act} floor ${r.floor}, ${reg.name}`, "");
  out.push(`Run seed ${r.seed}. ${r.won ? "WON" : "LOST"} at t${r.ticks}. Foes' knob: HP ${r.knob.hp ? `${r.knob.hp > 0 ? "+" : ""}${r.knob.hp}%` : "±0"}, damage ${r.knob.power ? `${r.knob.power > 0 ? "+" : ""}${r.knob.power}%` : "±0"}.`, "");
  out.push(`## The party (formation ${c.formations.get(r.party.formation)!.name})`);
  const head = c.pack.ruleset.opening?.slots ?? [];
  r.party.units.forEach((u, i) => {
    const m = r.members[i];
    const k = c.classes.get(u.class)!;
    const st = m.stats;
    out.push(`- **${k.name}** (slot ${i + 1}): HP ${n0(m.hp)}/${n0(m.maxHp)}, MP ${n0(m.mp)}/${n0(m.maxMp)}. Attack ${pts(st.attack)}, Magic ${pts(st.magic)}, Armor ${pts(st.armor)}, Crit ${st.crit_chance}%, Aggro ${Math.round(st.aggro)}, MP regen ${pts(st.mp_regen)}. Passive: ${k.passive?.name ?? "Einherjar"}: ${k.passive?.text ?? "allies it revives come back ready."}`);
    out.push(`  - Gear: ${(["weapon", "armor", "amulet"] as const).map((s) => `${s}: ${gearWords(u.gear[s] ? c.gear.get(u.gear[s]!) : undefined)}`).join("; ")}.`);
    const abs = u.abilities.map((a, j) => { const ab = c.abilities.get(a)!; return `${ab.name} (MP ${ab.mp ?? 0}, every ${Math.round(ab.cooldown)}t, wind-up ${ab.cast ?? c.pack.ruleset.abilityCast}t, first ready ~t${Math.max(0, Math.round(ab.cooldown - (head[j] ?? 0)))}: ${sizeOf(ab, st) || ab.text})`; });
    out.push(`  - Abilities in slot order: ${abs.join("; ") || "none"}.`);
  });
  out.push("", "## The foes");
  for (const id of [...new Set(r.foes)]) {
    const en = c.enemies.get(id)!;
    const acts = (en.abilities ?? []).map((a) => { const ab = c.abilities.get(a)!; return `${ab.name} (every ${Math.round(ab.cooldown)}t, wind-up ${ab.cast ?? c.pack.ruleset.abilityCast}t: ${ab.text} ${sizeOf(ab, en.stats as Record<string, number>)})`; });
    const pas = (en.statuses ?? []).map((s) => `${c.statuses.get(s)!.name}: ${c.statuses.get(s)!.text}`);
    const res = Object.entries(en.stats).filter(([k]) => k.startsWith("resist")).map(([k, v]) => `${k} ${v}`);
    out.push(`- **${en.name}** (${en.rank}): ${en.text} HP ${n0(en.stats.max_hp)} before the knob, Armor ${pts(en.stats.armor ?? 0)}, Attack ${pts(en.stats.attack ?? 0)}, Magic ${pts(en.stats.magic ?? 0)}.${acts.length ? ` Abilities: ${acts.join("; ")}.` : ""}${pas.length ? ` ${pas.join(" ")}` : ""}${res.length ? ` Resist: ${res.join(", ")}.` : ""}`);
  }
  out.push("", "## Tick by tick", "");
  const who = (id: unknown) => rd.units.get(String(id))?.name ?? String(id);
  const isFoe = (id: unknown) => rd.units.get(String(id))?.side === "enemy";
  const hpWord = (id: unknown, hp: unknown, shield: unknown = 0) => {
    const u = rd.units.get(String(id));
    if (!u) return "";
    const h = Number(hp);
    return isFoe(id) ? ` [${pc(h, u.max)}${shield ? `, ${n0(Number(shield))} shield` : ""}]` : ` [${n0(h)}/${n0(u.max)}${shield ? `, ${n0(Number(shield))} shield` : ""}]`;
  };
  let lastAt = -1;
  const lastMp = new Map<string, { at: number; amount: number; mp: number }>();
  for (const e of r.log) {
    const atN = typeof e.at === "number" ? e.at : null;
    const t = atN !== null ? `t${Number((atN / 1000).toFixed(1))}` : "";
    const own = atN !== null && atN !== lastAt ? `${t} ` : "    ";
    if (atN !== null) lastAt = atN;
    switch (e.t) {
      case "fight_start": {
        const us = e.units as (UnitInfo & { hp: number })[];
        out.push(`Start. Party: ${us.filter((u) => u.side === "party").map((u) => `${u.name} ${n0(u.hp)}/${n0(u.max)}`).join(", ")}. Foes: ${us.filter((u) => u.side === "enemy").map((u) => `${u.name} (${n0(u.max)} HP)`).join(", ")}.`);
        break;
      }
      case "join": { const u = e.unit as UnitInfo & { hp: number }; out.push(`${own}${u.name} joins (${n0(u.max)} HP).`); break; }
      case "leave": out.push(`${own}${who(e.unit)} is gone.`); break;
      case "revive": out.push(`${own}${who(e.unit)} is raised by ${who(e.by)}${hpWord(e.unit, e.hp)}${e.ready ? ", ready" : ""}.`); break;
      case "strike": out.push(`${own}${who(e.by)} strikes again (${e.name}) at ${who(e.target)}.`); break;
      case "cast": out.push(`${own}${who(e.by)} begins ${e.name} (lands t${Number((Number(e.ends) / 1000).toFixed(1))}).`); break;
      case "mp": {
        const v = Number(e.amount);
        lastMp.set(String(e.target), { at: atN ?? 0, amount: v, mp: Number(e.mp) });
        // Gains worth seeing (Clarity, Refrain, Siphon, a jar): regen's small pulses are summed in the tally instead.
        if (v >= 100) out.push(`${own}${who(e.target)} MP +${n0(v)} → ${n0(Number(e.mp))}.`);
        break;
      }
      case "act": {
        const m = lastMp.get(String(e.by));
        const cost = m && m.at === atN && m.amount < 0 ? ` (MP −${n0(-m.amount)} → ${n0(m.mp)})` : "";
        const tg = (e.targets as string[]).map(who);
        out.push(`${own}${who(e.by)} ${e.act === "basic" ? "attacks" : `uses ${e.name} on`} ${tg.length > 3 ? `${tg.length} targets` : tg.join(", ")}${cost}.`);
        break;
      }
      case "fail": out.push(`${own}${who(e.by)}'s ${e.name} fails (${e.why === "mp" ? "no MP" : "no target"}).`); break;
      case "dmg": {
        const from = e.part === "pulse" || e.part === "reaction" ? ` from ${String(e.src).toUpperCase()}${e.from && who(e.from) !== String(e.from) ? ` (${who(e.from)}'s)` : ""}` : e.part === "extra" ? " (extra strike)" : "";
        if (e.word === "MISS") out.push(`${own}${who(e.target)}: MISS${from}.`);
        else out.push(`${own}${who(e.target)} takes ${e.crit ? "CRIT " : ""}${n0(Number(e.amount))}${e.kind ? ` ${e.kind}` : ""}${e.word ? ` ${e.word}` : ""}${from}${e.soaked ? `, ${n0(Number(e.soaked))} soaked` : ""}${hpWord(e.target, e.hp, e.shield)}.`);
        break;
      }
      case "heal":
        if (e.word === "ABSORB") out.push(`${own}${who(e.target)} ABSORBS it, healing ${n0(Number(e.amount))}${hpWord(e.target, e.hp)}.`);
        else out.push(`${own}${who(e.target)} is healed ${n0(Number(e.amount))}${e.src && e.src !== "basic" ? ` by ${nameOf(c, String(e.src))}` : ""}${hpWord(e.target, e.hp)}.`);
        break;
      case "status": if (shown(e.status)) out.push(`${own}${who(e.unit)}: ${e.name}${e.total !== null ? ` ${n1(Number(e.total))}` : ""}${e.by && who(e.by) !== who(e.unit) ? ` (from ${who(e.by)})` : ""}.`); break;
      case "status_end": if (shown(e.status) && e.cause !== "ko") out.push(`${own}${who(e.unit)}'s ${e.name} ends (${e.cause}).`); break;
      case "immune": out.push(`${own}${who(e.unit)}: IMMUNE to ${e.name}.`); break;
      case "interrupt": out.push(`${own}${who(e.unit)} is interrupted: ${e.name} is lost.`); break;
      case "hold": out.push(`${own}${who(e.unit)} is stunned: ${e.name} waits.`); break;
      case "down": out.push(`${own}${who(e.unit)} is DOWN.`); break;
      case "enrage": out.push(`${own}ENRAGE: every blow lands harder from here.`); break;
      case "fight_end": out.push(`${e.result === "won" ? "WON" : "LOST"} at t${e.rounds}.`); break;
    }
  }
  // The tally.
  out.push("", "## Tally", "");
  const partyIds = [...rd.units.values()].filter((u) => u.side === "party").map((u) => u.id);
  const foeIds = [...rd.units.values()].filter((u) => u.side === "enemy").map((u) => u.id);
  const totalDealt = partyIds.reduce((s, id) => s + Object.values(rd.ut.get(id)!.dealt).reduce((a, b) => a + b, 0), 0);
  for (const id of partyIds) {
    const u = rd.units.get(id)!, t = rd.ut.get(id)!;
    const dealt = Object.values(t.dealt).reduce((a, b) => a + b, 0);
    const basic = t.dealt.basic ?? 0;
    const statusD = Object.entries(t.dealt).filter(([k]) => k.startsWith("status:")).reduce((a, [, v]) => a + v, 0);
    const abil = dealt - basic - statusD;
    const casts = Object.entries(t.casts).map(([k, v]) => `${nameOf(c, k)} ×${v} (first t${n1(t.firstCast[k])})`).join(", ");
    const srcs = Object.entries(t.dealt).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k.startsWith("status:") ? nameOf(c, k.slice(7)) : nameOf(c, k)} ${n0(v)}`).join(", ");
    out.push(`- **${u.name}**: ${t.basics} basics, casts: ${casts || "none"}${t.fizz ? `, ${t.fizz} fizzled for MP` : ""}. Dealt ${n0(dealt)} (${pc(dealt, totalDealt)} of the party's): basic ${pc(basic, dealt)}, abilities ${pc(abil, dealt)}, statuses ${pc(statusD, dealt)}${srcs ? ` [${srcs}]` : ""}. Took ${n0(t.taken)}. Healed others ${n0(t.healed)}. MP spent ${n0(t.mpSpent)}, regained ${n0(t.mpGained)}, left ${rd.mpEnd.has(id) ? n0(rd.mpEnd.get(id)!) : "full"}.${t.downAt !== null ? ` DOWN at t${n1(t.downAt)}.` : ""}`);
  }
  for (const id of foeIds) {
    const u = rd.units.get(id)!, t = rd.ut.get(id)!;
    const dealt = Object.values(t.dealt).reduce((a, b) => a + b, 0);
    const casts = Object.entries(t.casts).map(([k, v]) => `${nameOf(c, k)} ×${v}`).join(", ");
    out.push(`- ${u.name}: ${t.basics} basics${casts ? `, ${casts}` : ""}, dealt ${n0(dealt)}, took ${n0(t.taken)}${t.downAt !== null ? `, down at t${n1(t.downAt)}` : ", standing"}${t.firstAct === null ? " (never acted)" : ""}.`);
  }
  const sts = [...rd.status].filter(([, s]) => s.apps).sort((a, b) => b[1].dmg - a[1].dmg);
  if (sts.length) out.push(`- Statuses on foes: ${sts.map(([k, s]) => `${nameOf(c, k)} ${s.apps} applications, peak ${n1(s.peak)}${s.dmg ? `, ${n0(s.dmg)} damage (${pc(s.dmg, totalDealt)} of the party's)` : ""}`).join("; ")}.`);
  if (rd.interrupts || rd.holds) out.push(`- Foes' casts lost to Silence: ${rd.interrupts}; held by Stun: ${rd.holds}.`);
  return out.join("\n") + "\n";
}

// ─── Picking the packs ───────────────────────────────────────────────────────

function pickPacks(): Rec[] {
  const out: Rec[] = [];
  const used = new Set<Rec>();
  const covered = new Map<string, number>();
  const take = (xs: Rec[], why: string) => {
    // Prefer fights whose party adds classes not yet covered, then a mix of outcomes.
    const scored = xs.filter((r) => !used.has(r)).map((r) => ({ r, s: r.party.units.reduce((s, u) => s + (FOCUS.includes(u.class) ? 5 : 0) + 1 / (1 + (covered.get(u.class) ?? 0)), 0) + (out.filter((o) => o.won).length > out.length / 2 ? (r.won ? 0 : 1) : (r.won ? 1 : 0)) }));
    scored.sort((a, b) => b.s - a.s);
    const pick = scored[0]?.r;
    if (!pick) return;
    used.add(pick); out.push(pick);
    for (const u of pick.party.units) covered.set(u.class, (covered.get(u.class) ?? 0) + 1);
    void why;
  };
  const focusRecs = FOCUS.length ? recs.filter((r) => r.party.units.some((u) => FOCUS.includes(u.class))) : recs;
  const pool = focusRecs.length >= 8 ? focusRecs : recs;
  const slots: [number, (r: Rec) => boolean][] = [
    [1, (r) => r.act === 1 && r.tier === "fight" && r.floor <= 2], [1, (r) => r.act === 1 && r.tier === "fight" && r.floor >= 6], [1, (r) => r.act === 1 && r.tier === "elite"], [1, (r) => r.act === 1 && r.tier === "boss"],
    [2, (r) => r.act === 2 && r.tier === "fight"], [2, (r) => r.act === 2 && r.tier === "elite"], [2, (r) => r.act === 2 && r.tier === "boss"],
    [3, (r) => r.act === 3 && r.tier === "fight"], [3, (r) => r.act === 3 && r.tier === "elite"], [3, (r) => r.act === 3 && r.tier === "boss"],
  ];
  for (const [, f] of slots) if (out.length < PACKS) take(pool.filter(f), "slot");
  // Fill the rest with the longest and the closest fights, for drama.
  while (out.length < PACKS) { const left = pool.filter((r) => !used.has(r)); if (!left.length) break; take(left.sort((a, b) => b.ticks - a.ticks), "long"); }
  return out;
}

// ─── The summary: every fight played ─────────────────────────────────────────

function summary(): string {
  const out: string[] = [`# Feel summary: ${recs.length} rogue fights from ${RUNS} runs at heat ${HEAT}`, ""];
  const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);
  const reads = recs.map((r) => ({ r, rd: readLog(r) }));
  // Fights by tier and act.
  out.push("## Fights", "", "| act | tier | fights | won | ticks (mean) | ticks (10%–90%) | party KOs a fight |", "| --- | --- | --- | --- | --- | --- | --- |");
  for (const act of [1, 2, 3]) for (const tier of ["fight", "elite", "boss"] as FightTier[]) {
    const xs = reads.filter((x) => x.r.act === act && x.r.tier === tier);
    if (!xs.length) continue;
    const ticks = xs.map((x) => x.r.ticks).sort((a, b) => a - b);
    const kos = mean(xs.map((x) => [...x.rd.units.values()].filter((u) => u.side === "party" && x.rd.ut.get(u.id)!.downAt !== null).length));
    out.push(`| ${act} | ${tier} | ${xs.length} | ${pc(xs.filter((x) => x.r.won).length, xs.length)} | ${n1(mean(ticks))} | ${ticks[Math.floor(ticks.length * 0.1)]}–${ticks[Math.floor(ticks.length * 0.9)]} | ${n1(kos)} |`);
  }
  // Classes.
  out.push("", "## Classes (over the fights the class was in)", "", "| class | fights | dealt a fight | share of party's | basic | abilities | statuses | healed a fight | taken a fight | KO per 100 | down at (mean t) | MP spent | regained | left % | fizzles a fight |", "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");
  const classRows: Record<string, { fights: number; dealt: number; share: number; basic: number; abil: number; status: number; healed: number; taken: number; ko: number; downAt: number[]; spent: number; gained: number; left: number[]; fizz: number }> = {};
  const abilRows: Record<string, { present: number; casts: number; first: number[]; fizz: number; dealt: number }> = {};
  for (const { r, rd } of reads) {
    const partyIds = [...rd.units.values()].filter((u) => u.side === "party");
    const total = partyIds.reduce((s, u) => s + Object.values(rd.ut.get(u.id)!.dealt).reduce((a, b) => a + b, 0), 0);
    partyIds.forEach((u, i) => {
      const t = rd.ut.get(u.id)!;
      const row = (classRows[u.ref] ??= { fights: 0, dealt: 0, share: 0, basic: 0, abil: 0, status: 0, healed: 0, taken: 0, ko: 0, downAt: [], spent: 0, gained: 0, left: [], fizz: 0 });
      const dealt = Object.values(t.dealt).reduce((a, b) => a + b, 0);
      const basic = t.dealt.basic ?? 0;
      const st = Object.entries(t.dealt).filter(([k]) => k.startsWith("status:")).reduce((a, [, v]) => a + v, 0);
      row.fights++; row.dealt += dealt; row.share += total ? dealt / total : 0; row.basic += basic; row.abil += dealt - basic - st; row.status += st; row.healed += t.healed; row.taken += t.taken;
      if (t.downAt !== null) { row.ko++; row.downAt.push(t.downAt); }
      row.spent += t.mpSpent; row.gained += t.mpGained; row.fizz += t.fizz;
      const m = r.members[i];
      if (m && m.maxMp > 0) row.left.push((rd.mpEnd.get(u.id) ?? m.mp) / m.maxMp);
      // Abilities slotted in this fight.
      const pu = r.party.units[i];
      for (const a of pu?.abilities ?? []) {
        const ar = (abilRows[a] ??= { present: 0, casts: 0, first: [], fizz: 0, dealt: 0 });
        ar.present++; ar.casts += t.casts[a] ?? 0; if (t.firstCast[a] !== undefined) ar.first.push(t.firstCast[a]); ar.dealt += t.dealt[a] ?? 0;
      }
    });
  }
  for (const [cls, r] of Object.entries(classRows).sort((a, b) => b[1].fights - a[1].fights)) {
    out.push(`| ${c.classes.get(cls)!.name} | ${r.fights} | ${n0(r.dealt / r.fights)} | ${pc(r.share, r.fights)} | ${pc(r.basic, r.dealt)} | ${pc(r.abil, r.dealt)} | ${pc(r.status, r.dealt)} | ${n0(r.healed / r.fights)} | ${n0(r.taken / r.fights)} | ${n1((100 * r.ko) / r.fights)} | ${r.downAt.length ? n1(mean(r.downAt)) : "–"} | ${n0(r.spent / r.fights)} | ${n0(r.gained / r.fights)} | ${r.left.length ? pc(mean(r.left), 1) : "–"} | ${n1(r.fizz / r.fights)} |`);
  }
  out.push("", "## Abilities (over the fights they were slotted)", "", "| ability | class | word | fights | casts a fight | first cast (mean t) | dealt a cast | fizzles a fight |", "| --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const [id, r] of Object.entries(abilRows).sort((a, b) => (c.abilities.get(a[0])?.class ?? "").localeCompare(c.abilities.get(b[0])?.class ?? ""))) {
    const ab = c.abilities.get(id)!;
    out.push(`| ${ab.name} | ${c.classes.get(ab.class ?? "")?.name ?? "?"} | every ${Math.round(ab.cooldown)}t, MP ${ab.mp ?? 0} | ${r.present} | ${(r.casts / r.present).toFixed(2)} | ${r.first.length ? n1(mean(r.first)) : "never"} | ${r.casts ? n0(r.dealt / r.casts) : "–"} | ${(r.fizz / r.present).toFixed(2)} |`);
  }
  // Statuses on foes.
  out.push("", "## Statuses on foes (a fight where applied)", "", "| status | fights applied | applications a fight | peak stacks (mean) | damage a fight | share of the party's damage in those fights |", "| --- | --- | --- | --- | --- | --- |");
  const stRows: Record<string, { fights: number; apps: number; peak: number; dmg: number; total: number }> = {};
  for (const { rd } of reads) {
    const total = [...rd.units.values()].filter((u) => u.side === "party").reduce((s, u) => s + Object.values(rd.ut.get(u.id)!.dealt).reduce((a, b) => a + b, 0), 0);
    for (const [id, s] of rd.status) {
      if (!s.apps) continue;
      const row = (stRows[id] ??= { fights: 0, apps: 0, peak: 0, dmg: 0, total: 0 });
      row.fights++; row.apps += s.apps; row.peak += s.peak; row.dmg += s.dmg; row.total += total;
    }
  }
  for (const [id, r] of Object.entries(stRows).sort((a, b) => b[1].fights - a[1].fights)) out.push(`| ${nameOf(c, id)} | ${r.fights} | ${n1(r.apps / r.fights)} | ${n1(r.peak / r.fights)} | ${n0(r.dmg / r.fights)} | ${pc(r.dmg, r.total)} |`);
  // Bosses and enemies.
  out.push("", "## Foes", "", "| foe | appearances | acted before dying | dealt an appearance | abilities cast an appearance |", "| --- | --- | --- | --- | --- |");
  const foeRows: Record<string, { n: number; acted: number; dealt: number; casts: Record<string, number> }> = {};
  for (const { rd } of reads) for (const u of rd.units.values()) {
    if (u.side !== "enemy") continue;
    const t = rd.ut.get(u.id)!;
    const row = (foeRows[u.ref] ??= { n: 0, acted: 0, dealt: 0, casts: {} });
    row.n++; if (t.firstAct !== null) row.acted++; row.dealt += Object.values(t.dealt).reduce((a, b) => a + b, 0);
    for (const [k, v] of Object.entries(t.casts)) row.casts[k] = (row.casts[k] ?? 0) + v;
  }
  for (const [id, r] of Object.entries(foeRows).sort((a, b) => b[1].n - a[1].n)) out.push(`| ${c.enemies.get(id)?.name ?? id} | ${r.n} | ${pc(r.acted, r.n)} | ${n0(r.dealt / r.n)} | ${Object.entries(r.casts).map(([k, v]) => `${nameOf(c, k)} ${(v / r.n).toFixed(2)}`).join(", ") || "–"} |`);
  return out.join("\n") + "\n";
}

// ─── Output ──────────────────────────────────────────────────────────────────

mkdirSync(OUT, { recursive: true });
const picked = pickPacks();
const index: string[] = [`# Packs (${picked.length}) from ${recs.length} fights`, ""];
picked.forEach((r, i) => {
  const text = pack(r, i + 1);
  writeFileSync(`${OUT}/pack-${String(i + 1).padStart(2, "0")}.md`, text);
  index.push(`- pack-${String(i + 1).padStart(2, "0")}: ${r.fightName} (${r.tier}, act ${r.act} floor ${r.floor}), ${r.party.units.map((u) => c.classes.get(u.class)!.name).join(" / ")}, ${r.won ? "won" : "lost"} at t${r.ticks}, ${text.split("\n").length} lines`);
});
writeFileSync(`${OUT}/index.md`, index.join("\n") + "\n");
writeFileSync(`${OUT}/summary.md`, summary());
// The rules a reader needs: what each status shown in a fight does, with its numbers.
const gl: string[] = ["# Glossary: the statuses a fight shows", ""];
for (const st of c.pack.statuses) if (st.show === "icon") {
  const bits: string[] = [];
  if (st.duration) bits.push(`lasts ${st.duration} ticks`);
  if (typeof st.cap === "number") bits.push(`cap ${st.cap} stacks`);
  if (st.pulse?.every) bits.push(`pulses every ${st.pulse.every} ticks`);
  const drop = st.drop as unknown;
  if (drop && typeof drop === "object" && "fraction" in drop) bits.push(`loses ${Math.round(Number((drop as { fraction: number }).fraction) * 100)}% of its stacks each time`);
  if (drop && typeof drop === "object" && "count" in drop) bits.push(`loses ${(drop as { count: number }).count} stack each time`);
  gl.push(`- ${st.name}: ${st.text ?? ""}${bits.length ? ` (${bits.join("; ")})` : ""}`);
}
gl.push("", "Time: a tick is the unit; a regular fight is meant to run about 45 ticks and a boss fight about 80. Basic attacks swing every 8 to 16 ticks by weapon kind. Ability cooldown words: short 16, medium 28, long 44, very long 60 ticks; wind-ups 1, 3, 6 or 10 ticks. Abilities start a fight partly charged by slot (8, 4, 0 ticks of head start).", "Stats: HP, MP, Attack, Magic, Armor on a 1 to 5 scale (shown ×1,000 in the data: HP 2 is 2,000). Armor cuts a physical hit to hit² ÷ (hit + 0.25 × Armor). Elites carry 15 and bosses 25 resistance to every element. Aggro: foes pick by draw; an ordinary unit draws 100, a Knight (Aggro 120) about 157, a caster (Aggro 80) about 64; Taunt forces the pick, Hidden forbids it.");
writeFileSync(`${OUT}/glossary.md`, gl.join("\n") + "\n");
console.log(index.join("\n"));
console.log(`\nWrote ${picked.length} packs and summary.md to ${OUT}/ (${recs.length} fights from ${RUNS} runs; ${recs.filter((r) => r.tier === "boss").length} boss fights; runs won: ${recs.filter((r) => r.tier === "boss" && r.act === 3 && r.won).length}).`);
