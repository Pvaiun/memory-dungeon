/** The gear and formation probes: each piece and formation against its baseline on the same parties and seeds, and their flags. */
import type { Content } from "../../src/engine/run.js";
import { registerGear } from "../../src/rogue.js";
import { get, rogueGear, type Tally } from "./plays.js";
import { BANDS, div, type Flag, mean, r1 } from "./sheet.js";

// ─── The probes ─────────────────────────────────────────────────────────────

type ProbeGear = Record<string, { probed: number; vsSlot: number; vsEmpty: number; dmgIdx: number; takenIdx: number; koIdx: number; healIdx: number; best: string; worst: string; byClass: Record<string, number> }>;
type ProbeForm = Record<string, { runs: number; winRate: number; vsNeutral: number; dmgIdx: number; takenIdx: number; koPerFight: number }>;

/** The probes' lines: each piece against the other pieces its wearers could have worn in that slot, and each formation against Neutral, on the same parties and seeds. */
export function computeProbes(c: Content, tallies: Record<string, Tally>): { gear: ProbeGear; formations: ProbeForm; flags: Flag[] } {
  const flags: Flag[] = [];
  const flag = (kind: string, id: string, name: string, band: string, value: number, text: string) => {
    const b = BANDS[band];
    if (!b || !Number.isFinite(value) || (value >= b.lo && value <= b.hi)) return;
    const width = Number.isFinite(b.hi) ? b.hi - b.lo : Math.max(1, Math.abs(b.lo));
    flags.push({ kind, id, name, band, value, set: "probe", severity: (value < b.lo ? b.lo - value : value - b.hi) / width, text });
  };
  registerGear(c);
  const pieces = [...c.pack.gear, ...rogueGear(c).filter((g) => !c.pack.gear.some((x) => x.id === g.id))];
  const slotOf = (g: string) => pieces.find((x) => x.id === g)?.slot ?? "none";
  // Gear: per class, each piece's win rate and the wearer's per-fight numbers, against the bare unit and the slot's mean.
  type Row = { win: number; dmg: number; taken: number; ko: number; heal: number; runs: number };
  const rows = new Map<string, Map<string, Row>>(); // class -> piece -> row
  for (const [key, t] of Object.entries(tallies)) {
    const m = key.match(/^probe:gear:([^:]+):(.+)$/);
    if (!m) continue;
    const [, cls, piece] = m;
    const fights = get(t, `cls|${cls}|fights|mob`) + get(t, `cls|${cls}|fights|boss`);
    const row: Row = { win: div(get(t, "won"), get(t, "runs")), dmg: div(get(t, `cls|${cls}|dmg`), fights), taken: div(get(t, `cls|${cls}|taken`), get(t, `cls|${cls}|alive`)), ko: div(get(t, `cls|${cls}|ko`), fights), heal: div(get(t, `cls|${cls}|healGiven`), fights), runs: get(t, "runs") };
    if (!rows.has(cls)) rows.set(cls, new Map());
    rows.get(cls)!.set(piece, row);
  }
  const gear: ProbeGear = {};
  const acc = new Map<string, { n: number; vsSlot: number; vsEmpty: number; dmg: number; taken: number; ko: number; koN: number; heal: number; healN: number; byClass: Record<string, number> }>();
  for (const [cls, byPiece] of rows) {
    const base = byPiece.get("none");
    if (!base) continue;
    for (const slot of ["weapon", "armor", "amulet"]) {
      const ids = [...byPiece.keys()].filter((g) => slotOf(g) === slot);
      const slotMean = mean(ids.map((g) => byPiece.get(g)!.win));
      for (const g of ids) {
        const r = byPiece.get(g)!;
        const a = acc.get(g) ?? { n: 0, vsSlot: 0, vsEmpty: 0, dmg: 0, taken: 0, ko: 0, koN: 0, heal: 0, healN: 0, byClass: {} };
        a.n++; a.vsSlot += 100 * (r.win - slotMean); a.vsEmpty += 100 * (r.win - base.win);
        a.dmg += div(r.dmg, base.dmg); a.taken += div(r.taken, base.taken);
        if (base.ko) { a.ko += div(r.ko, base.ko); a.koN++; }
        if (base.heal) { a.heal += div(r.heal, base.heal); a.healN++; }
        a.byClass[cls] = 100 * (r.win - slotMean);
        acc.set(g, a);
      }
    }
  }
  for (const [g, a] of acc) {
    const by = Object.entries(a.byClass).sort((x, y) => y[1] - x[1]);
    const name = (k: string) => c.classes.get(k)?.name ?? k;
    gear[g] = {
      probed: a.n, vsSlot: a.vsSlot / a.n, vsEmpty: a.vsEmpty / a.n, dmgIdx: a.dmg / a.n, takenIdx: a.taken / a.n, koIdx: div(a.ko, a.koN), healIdx: div(a.heal, a.healN),
      best: by.length ? `${name(by[0][0])} ${r1(by[0][1])}` : "–", worst: by.length > 1 ? `${name(by[by.length - 1][0])} ${r1(by[by.length - 1][1])}` : "–", byClass: a.byClass,
    };
    const piece = pieces.find((x) => x.id === g);
    if (!piece) continue;
    flag("gear", g, piece.name, "gear.win", gear[g].vsSlot, `probed on ${a.n} class${a.n > 1 ? "es" : ""}, its wearers win ${r1(gear[g].vsSlot)} points ${gear[g].vsSlot >= 0 ? "more" : "less"} than the slot's mean (best ${gear[g].best}, worst ${gear[g].worst})`);
    if (piece.slot !== "weapon") flag("gear", g, piece.name, "gear.empty", gear[g].vsEmpty, `its wearers win ${r1(gear[g].vsEmpty)} points against leaving the slot empty`);
  }
  // Formations: the same parties in each.
  const formations: ProbeForm = {};
  const ft = (fid: string) => tallies[`probe:form:${fid}`] ?? {};
  const neutral = div(get(ft("neutral"), "won"), get(ft("neutral"), "runs"));
  const cls = c.pack.classes.map((k) => k.id);
  const sumCls = (t: Tally, m: string) => cls.reduce((a, k) => a + get(t, `cls|${k}|${m}`), 0);
  const fightsOf = (t: Tally) => get(t, "fights|mob") + get(t, "fights|boss");
  const meanDmg = mean(c.pack.formations.map((f) => div(sumCls(ft(f.id), "dmg"), fightsOf(ft(f.id)))));
  const meanTaken = mean(c.pack.formations.map((f) => div(sumCls(ft(f.id), "taken"), fightsOf(ft(f.id)))));
  for (const f of c.pack.formations) {
    const t = ft(f.id);
    const line = { runs: get(t, "runs"), winRate: div(get(t, "won"), get(t, "runs")), vsNeutral: 100 * (div(get(t, "won"), get(t, "runs")) - neutral), dmgIdx: div(div(sumCls(t, "dmg"), fightsOf(t)), meanDmg), takenIdx: div(div(sumCls(t, "taken"), fightsOf(t)), meanTaken), koPerFight: div(sumCls(t, "ko"), fightsOf(t)) };
    formations[f.id] = line;
    if (f.id !== "neutral" && line.runs) flag("formation", f.id, f.name, "formation.win", line.vsNeutral, `the same parties win ${r1(line.vsNeutral)} points ${line.vsNeutral >= 0 ? "more" : "less"} in it than in Neutral`);
  }
  return { gear, formations, flags };
}
