/** The balance sheet as markdown: the flags worst first, then every line by kind. */
import type { Content } from "../../src/engine/run.js";
import { registerGear } from "../../src/rogue.js";
import { BANDS, type Flag, pc, r1, r2, type Sheet } from "./sheet.js";
import type { computeProbes } from "./probes.js";
import { ROLE } from "./tally.js";
import { rogueGear } from "./plays.js";

// ─── Writing ────────────────────────────────────────────────────────────────

function table(head: string[], rows: string[][]): string {
  return [`| ${head.join(" | ")} |`, `| ${head.map(() => "---").join(" | ")} |`, ...rows.map((r) => `| ${r.join(" | ")} |`)].join("\n");
}

export function allFlags(sheets: Record<string, Sheet>, pooled: Sheet, probes: ReturnType<typeof computeProbes>): Flag[] {
  return [...pooled.flags, ...Object.values(sheets).flatMap((s) => s.flags), ...probes.flags].sort((a, b) => b.severity - a.severity);
}

export function writeSheet(c: Content, sheets: Record<string, Sheet>, pooled: Sheet, probes: ReturnType<typeof computeProbes>, info: string): string {
  const out: string[] = [];
  const sets = Object.keys(sheets);
  const both = (get: (s: Sheet) => number, fmt: (x: number) => string) => sets.map((s) => fmt(get(sheets[s]))).join(" / ");
  out.push(`# Balance sheet\n\n${info}\n\nEvery group of numbers is ${sets.join(" / ")}: the rogue's fights at their calibrated knobs (heat 0); free play, the seven runs at the documents' numbers with no knob. Flags are judged on the pooled numbers (each mode counting once: the three sets' rates averaged), except where a band names a set (the enemies and MP in free play, gear and formations in their probes).\n`);
  const ranked = allFlags(sheets, pooled, probes);
  out.push(`## Flags (${ranked.length}), worst first\n`);
  out.push(table(["#", "kind", "what", "measure", "band", "finding"], ranked.map((f, i) => [String(i + 1), f.kind, f.name, `${r2(f.value)} ${BANDS[f.band].unit}`, `${r2(BANDS[f.band].lo)}–${Number.isFinite(BANDS[f.band].hi) ? r2(BANDS[f.band].hi) : "∞"}`, f.text])));

  out.push(`\n## 1. Classes\n`);
  const cls = c.pack.classes.map((k) => k.id);
  out.push(table(["Class", "role", "win ±pts", "dmg ×avg", "basic / abil / status / react", "taken ×avg", "hits ×avg", "mitig.", "KO /100", "KO at", "acts/10t", "casts mob / boss", "starved", "MP end", "heal given", "shield given", "crit", "kills /fight"],
    cls.map((k) => [c.classes.get(k)!.name, ROLE[k], both((s) => s.classes[k].win, r1), both((s) => s.classes[k].dmgIdx, r2),
      both((s) => s.classes[k].basicShare, pc) + " · " + both((s) => s.classes[k].abilityShare, pc) + " · " + both((s) => s.classes[k].statusShare, pc) + " · " + both((s) => s.classes[k].reactionShare, pc),
      both((s) => s.classes[k].takenIdx, r2), both((s) => s.classes[k].hitsIdx, r2), both((s) => s.classes[k].mitigated, pc), both((s) => 100 * s.classes[k].ko, r1), both((s) => s.classes[k].koAt, r1), both((s) => s.classes[k].actsPer10, r2),
      both((s) => s.classes[k].castsMob, r1) + " / " + both((s) => s.classes[k].castsBoss, r1), both((s) => s.classes[k].starved, pc), both((s) => s.classes[k].endMp, pc), both((s) => s.classes[k].healGiven, r1), both((s) => s.classes[k].shieldGiven, r1), both((s) => s.classes[k].crit, pc), both((s) => s.classes[k].kills, r2)])));
  out.push(`\nwin ±pts: the win rate of parties with the class minus parties without it. dmg ×avg: damage per unit-fight against the average unit's. taken, hits: the same for damage and hits taken (draw). KO at: the mean tick a knockout comes. starved: share of its time alive with an ability ready and no MP for it.\n`);

  out.push(`## 2. Abilities\n`);
  const kinds = ["damage", "heal", "revive", "shield", "control", "cleanse", "debuff", "buff", "other"];
  const abRows: string[][] = [];
  for (const k of c.pack.classes) for (const a of k.abilities) {
    const d = c.abilities.get(a)!;
    const g = (s: Sheet) => s.abilities[a];
    const stacks = Object.keys(pooled.abilities[a]).filter((x) => x.startsWith("stacks:")).map((x) => `${x.slice(7)} ${both((s) => g(s)[x], r1)}`).join(", ");
    abRows.push([k.name, d.name, kinds[pooled.abilities[a].kind], `${d.mp ?? 0} / ${d.cooldown}t / ${d.cast ?? c.pack.ruleset.abilityCast}t`, both((s) => g(s).castsMob, r2), both((s) => g(s).castsBoss, r2), both((s) => g(s).first, r1), both((s) => g(s).swings, r1), both((s) => g(s).share, pc),
      both((s) => g(s).healShare, pc), both((s) => g(s).shieldShare, pc), stacks || "–", both((s) => g(s).fail, pc), both((s) => g(s).interrupted, pc), both((s) => g(s).targets, r1), both((s) => g(s).kills, r2), `${both((s) => g(s).slot0, r1)} · ${both((s) => g(s).slot1, r1)} · ${both((s) => g(s).slot2, r1)}`]);
  }
  out.push(table(["Class", "Ability", "kind", "MP / cd / cast", "casts /mob", "casts /boss", "first (t)", "swings /cast", "share of class dmg", "heal %HP", "shield %HP", "stacks /app", "fizzle", "interrupted", "targets", "kills /cast", "casts by slot 1·2·3"], abRows));
  out.push(`\ncasts /mob: casts per regular fight in which a standing member had it slotted; first: the median-ish mean tick of its first cast; swings: damage a cast against the class's own basic attack; fizzle: casts lost for MP or a missing target; casts by slot: per fight owned in that slot.\n`);

  out.push(`## 3. Enemy abilities\n`);
  out.push(table(["Ability", "fights", "casts /fight", "dmg /cast", "heal /cast", "KOs /fight", "interrupted /fight", "held /fight", "fizzle /fight"],
    Object.keys(pooled.enemyAbilities).map((a) => { const g = (s: Sheet) => s.enemyAbilities[a]; return [c.abilities.get(a)!.name, both((s) => g(s).fights, r1), both((s) => g(s).castsPerFight, r2), both((s) => g(s).dmgPerCast, r1), both((s) => g(s).healPerCast, r1), both((s) => g(s).kos, r2), both((s) => g(s).interrupted, r2), both((s) => g(s).held, r2), both((s) => g(s).failMp + g(s).failTarget, r2)]; })));

  out.push(`\n## 4. Statuses\n`);
  out.push(table(["Status", "tier/label", "apps /fight (party, foes)", "stacks /app", "uptime /app (t)", "dmg /app", "share of appliers' dmg", "share of all party dmg", "dmg on party /fight", "heal /app", "ends: expired · stacks · removed · fight", "holds · interrupts /app", "kills · KOs", "immune"],
    Object.keys(pooled.statuses).map((s) => { const d = c.statuses.get(s)!; const g = (x: Sheet) => x.statuses[s]; return [d.name, `${d.label}`, `${both((x) => g(x).onParty, r2)}, ${both((x) => g(x).onEnemy, r2)}`, both((x) => g(x).stacksPerApp, r1), both((x) => g(x).uptimePerApp, r1), both((x) => g(x).dmgPerApp, r1), both((x) => g(x).dmgShareOfAppliers, pc), both((x) => g(x).dmgShareOfParty, pc), both((x) => g(x).dmgOnPartyPerFight, r1), both((x) => g(x).healPerApp, r1),
      `${both((x) => g(x).endExpired, pc)} · ${both((x) => g(x).endStacks, pc)} · ${both((x) => g(x).endRemoved, pc)} · ${both((x) => g(x).endFight, pc)}`, `${both((x) => g(x).holdsPerApp, r2)} · ${both((x) => g(x).interruptsPerApp, r2)}`, `${both((x) => g(x).kills, r1)} · ${both((x) => g(x).kos, r1)}`, both((x) => g(x).immune, r1)]; })));

  out.push(`\n## 5. Enemies\n`);
  out.push(table(["Enemy", "rank", "appearances", "life (t) ×rank", "killed before acting", "dmg /appearance ×rank", "dmg /tick", "KOs /fight", "basics · casts /appearance", "signature /fight", "mitigated", "dodge", "taken: hits / untyped", "killed", "survived (party lost)", "interrupted · held /fight"],
    c.pack.enemies.filter((e) => pooled.enemies[e.id].n).map((e) => { const g = (s: Sheet) => s.enemies[e.id]; return [e.name, e.rank, both((s) => g(s).n, r1), `${both((s) => g(s).life, r1)} (${both((s) => g(s).lifeIdx, r2)})`, both((s) => g(s).acted0, pc), `${both((s) => g(s).dmg, r1)} (${both((s) => g(s).dmgIdx, r2)})`, both((s) => g(s).dmgPerTick, r1), both((s) => g(s).kos, r2), `${both((s) => g(s).basics, r1)} · ${both((s) => g(s).casts, r1)}`, both((s) => g(s).signature, r2), both((s) => g(s).mitigated, pc), both((s) => g(s).dodge, pc), `${both((s) => g(s).takenHits, pc)} / ${both((s) => g(s).takenUntyped, pc)}`, both((s) => g(s).killed, pc), both((s) => g(s).survived, pc), `${both((s) => g(s).interrupted, r2)} · ${both((s) => g(s).held, r2)}`]; })));

  out.push(`\n## 6. Gear\n`);
  registerGear(c);
  const pieces = [...c.pack.gear, ...rogueGear(c).filter((g) => !c.pack.gear.some((x) => x.id === g.id))];
  const gearRows = pieces.map((g) => {
    const f = (s: Sheet) => s.gear[g.id];
    const p = probes.gear[g.id];
    return [g.name, g.slot + (g.tier === "powerful" ? " (powerful)" : "") + (c.pack.gear.some((x) => x.id === g.id) ? "" : " (rogue)"), p ? String(p.probed) : "–", p ? r1(p.vsSlot) : "–", p ? (g.slot === "weapon" ? "–" : r1(p.vsEmpty)) : "–", p ? r2(p.dmgIdx) : "–", p ? r2(p.takenIdx) : "–", p ? r2(p.koIdx) : "–", p ? p.best : "–", p ? p.worst : "–",
      both((s) => f(s)?.worn ?? 0, r1), both((s) => f(s)?.kit ?? 0, r1), both((s) => f(s)?.win ?? NaN, r1), both((s) => f(s)?.swingDmg ?? NaN, r1)];
  });
  out.push(table(["Piece", "slot", "classes probed", "probe: ±pts vs slot mean", "probe: ±pts vs empty", "probe: wearer dmg ×", "wearer taken ×", "wearer KO ×", "best for", "worst for", "spread: worn (unit-fights)", "picked by kits", "spread: win ±pts", "swing dmg"], gearRows));
  out.push(`\nThe probe: each piece alone on a bare unit of each class that can wear it (its plain weapon, no armor, no amulet), beside the same kitted companions in Neutral, on the same fights and seeds; ±pts vs slot mean is its wearers' win rate against the mean of every piece they could have worn in that slot, vs empty against the bare unit; dmg, taken and KO are the wearer's against the bare unit's. The spread columns are from the rotation (party composition varies, so they're context).\n`);

  out.push(`## 7. Formations\n`);
  out.push(table(["Formation", "probe: runs", "probe: win rate", "probe: ±pts vs Neutral", "probe: party dmg ×", "probe: taken ×", "probe: KOs /fight", "spread: win rate", "spread: ±pts vs Neutral", "effect /fight"],
    c.pack.formations.map((f) => { const g = (s: Sheet) => s.formations[f.id]; const p = probes.formations[f.id]; return [f.name, p ? r1(p.runs) : "–", p ? pc(p.winRate) : "–", p ? r1(p.vsNeutral) : "–", p ? r2(p.dmgIdx) : "–", p ? r2(p.takenIdx) : "–", p ? r2(p.koPerFight) : "–", both((s) => g(s).winRate, pc), both((s) => g(s).win, r1), both((s) => g(s).effectPerFight, r2)]; })));
  out.push(`\nThe probe: the same forty kitted parties in every formation, seated by the kit weights, on the same fights and seeds.\n`);

  out.push(`\n## 8. Resources and the party\n`);
  const cols = sets.join(" / ");
  out.push(table(["Measure", cols], Object.keys(pooled.resources).map((k) => [k, both((s) => s.resources[k], (x) => (/share|won|by basic|by abilities|starved/.test(k) ? pc(x) : r1(x)))])));
  out.push(`\n## 9. Every stat, what it did\n`);
  out.push(table(["Stat and measure", cols], Object.keys(pooled.stats).map((k) => [k, both((s) => s.stats[k], (x) => (/share|rate|lost|took off|crit|dodged|spent a fight as/.test(k) ? pc(x) : r2(x)))])));
  out.push(`\n## 10. Log events a fight\n`);
  out.push(table(["Event", cols], Object.keys(pooled.events).map((k) => [k, both((s) => s.events[k] ?? 0, r2)])));

  out.push(`\n## The bands, and why\n`);
  out.push(table(["Band", "lo", "hi", "unit", "why"], Object.entries(BANDS).map(([k, b]) => [k, r2(b.lo), Number.isFinite(b.hi) ? r2(b.hi) : "∞", b.unit, b.why])));
  return out.join("\n");
}
