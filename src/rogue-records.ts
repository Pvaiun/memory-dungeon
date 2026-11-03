/**
 * Reads the rogue runs the interface exports (memory-dungeon.rogue-run, format 2, from src/rogue-record.ts): replays each
 * under a pack with the fight logs on, and prints what the records can't say by themselves. Every fight with the party's
 * HP in and out and who fell to what; each run's road and where it ended; every fight id's cost across runs; what hurt the
 * party and what the party dealt; and the player's habits (map picks, drafts, campfires, drops, shop spending).
 *
 *   npx tsx src/rogue-records.ts <file.json>... [--pack <pack.json> | --packs <dir>] [--out <file.md>] [--fights]
 *
 * A record replays faithfully only under the content it was played on. `--pack` takes that build's pack (`git show
 * <build>:content/core-set.pack.json > out/pack-<build>.json`; the record's `build` field names the build), and `--packs`
 * a folder of them, one `pack-<build>.json` per build the records name (a build with no pack there gets the current one);
 * with neither the current pack is used. The tool says when a replay drifts (a fight that ended differently, an offer that
 * changed). `--fights` adds each fight as a player remembers it (src/play-summary.ts), lost fights first.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import { advance, loadContent, type Content, type Run } from "./engine/run.js";
import { combat, type Member as EngineMember } from "./engine/combat/rules.js";
import type { Entry } from "./engine/log.js";
import {
  newRogue, registerGear, choose, discard, dismiss, endFight, equip, options, seat, setFormation, setOrder, startFight, swap, useSupply, type RogueRun,
} from "./rogue.js";
import { summary } from "./play-summary.js";

type Rec = Record<string, any>;
type Fight = {
  file: string; run: number; leader: string; act: number; floor: number; tier: string; fight: string; enemies: string[]; foes: { hp?: number; power?: number };
  outcome: string; drift: string | null; ticks: number; party: string[]; formation: string; supplies: string[]; enteredKo: string[]; bench: string[];
  maxHp: number; hpIn: number; hpOut: number; mpIn: number; mpMax: number;
  taken: Map<string, number>; takenFrom: Map<string, number>; dealt: Map<string, number>; dealtBy: Map<string, number>;
  kos: { unit: string; at: number; by: string }[]; text: string;
};
type RunRow = {
  file: string; run: number; leader: string; drafted: string[]; roster: string[]; act: number; floor: number; fights: Fight[]; known: number; legendaries: number; worn: number;
  gold: number; spent: number; supplies: number; swaps: number; campfire: Record<string, number>;
};

const args = process.argv.slice(2);
const flag = (name: string) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const files = args.filter((a, i) => !a.startsWith("--") && !["--pack", "--packs", "--out"].includes(args[i - 1]));
const packs = new Map<string, Content>();
/** The content a record is replayed under: its build's pack when `--packs` holds one, else `--pack`'s or the current one. */
function contentFor(build: string | undefined): Content {
  const dir = flag("--packs");
  const path = dir && build && existsSync(`${dir}/pack-${build}.json`) ? `${dir}/pack-${build}.json` : flag("--pack") ?? "content/core-set.pack.json";
  let c = packs.get(path);
  if (!c) { c = loadContent(JSON.parse(readFileSync(path, "utf8"))); packs.set(path, c); }
  return c;
}
let c: Content = contentFor(undefined);
const nameOf = (src: string) => c.abilities.get(src)?.name ?? c.statuses.get(src)?.name?.toLowerCase() ?? (src === "basic" ? "attack" : src);
const add = (m: Map<string, number>, k: string, v: number) => m.set(k, (m.get(k) ?? 0) + v);
const pct = (a: number, b: number) => (b ? Math.round((100 * a) / b) : 0);
const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x)) as T;

/** One fight's log read: damage by source and taker, who fell to what, as the digest a reader wants. */
function digest(log: Entry[], f: Fight, er: Run) {
  const names = new Map<string, string>(), side = new Map<string, string>(), hp = new Map<string, number>();
  let last = 0;
  for (const e of log) {
    if (typeof e.at === "number") last = Math.max(last, e.at);
    if (e.t === "fight_start" || e.t === "join") {
      const units = e.t === "join" ? [e.unit as Rec] : (e.units as Rec[]);
      for (const u of units) { names.set(u.id, u.name); side.set(u.id, u.side); hp.set(u.id, u.hp); }
    } else if (e.t === "dmg" && typeof e.amount === "number") {
      const tg = String(e.target), tn = names.get(tg) ?? tg;
      const real = Math.min(e.amount, Math.max(0, hp.get(tg) ?? e.amount));
      hp.set(tg, e.hp as number);
      const pulse = e.part === "pulse" || e.part === "reaction";
      const src = `${nameOf(String(e.src))}${pulse ? " (status)" : ""}`;
      // A status's pulse names who laid it when the log knows (Thorns does; Bleed and Burn don't): the rest count as "statuses".
      const who = (pulse && e.from ? names.get(String(e.from)) : undefined) ?? (e.by ? names.get(String(e.by)) : undefined) ?? (pulse ? "statuses" : "?");
      const from = who === "statuses" ? "" : ` from ${who.replace(/ [A-Z]$/, "")}`;
      if (side.get(tg) === "party") {
        add(f.taken, tn, real); add(f.takenFrom, `${src}${from}`, real);
        if ((e.hp as number) <= 0 && !f.kos.find((k) => k.unit === tn)) f.kos.push({ unit: tn, at: Math.round((e.at as number) / 1000), by: `${src}${from}, ${e.amount}` });
      } else { add(f.dealt, who, real); add(f.dealtBy, `${who}: ${src}`, real); }
    }
  }
  f.ticks = Math.round(last / 1000);
  f.hpOut = (er.party as EngineMember[]).reduce((s, m) => s + Math.max(0, m.hp), 0);
  f.text = summary(log.filter((e) => e.vis === "player" || e.t === "mp"), nameOf);
}

/** Replays one record: the run's row and its fights. */
function replay(file: string, run: number): RunRow {
  const rec = JSON.parse(readFileSync(file, "utf8")) as Rec;
  const record = rec.record as Rec[];
  const start = record[0];
  if (start.midRun) throw new Error(`${file}: a record that began mid-run can't be replayed from its seed`);
  c = contentFor(typeof start.build === "string" ? start.build : undefined);
  const r: RogueRun = newRogue(c, { seed: start.seed, leader: start.leader, heat: start.heat });
  const fights: Fight[] = [];
  let er: Run | null = null, cur: Fight | null = null, drift: string | null = null;
  const drafted: string[] = [];
  let supplies = 0, swaps = 0;
  const campfire: Record<string, number> = {};
  for (const d of record.slice(1)) {
    registerGear(c, r);
    try {
      switch (d.t) {
        case "choice": {
          if (d.kind === "draft") drafted.push(d.pick);
          if (d.kind === "campfire") campfire[d.pick] = (campfire[d.pick] ?? 0) + 1;
          if (JSON.stringify(options(c, r)) !== JSON.stringify(d.offered)) { drift = `step ${d.i}: the ${d.kind} offered something else`; break; }
          choose(c, r, d.pick);
          break;
        }
        case "equip": equip(c, r, d.cls, d.slot, d.uid); break;
        case "formation": setFormation(c, r, d.id); break;
        case "seat": seat(c, r, d.order); break;
        case "order": setOrder(r, d.cls, d.order); break;
        case "swap": swaps++; swap(c, r, d.out, d.into); break;
        case "dismiss": dismiss(c, r, d.cls); break;
        case "discard": discard(r, d.uid); break;
        case "supply": supplies++; useSupply(c, r, d.id, d.target ?? undefined); break;
        case "fight": {
          if (d.replay) break;
          er = startFight(c, r, { log: true });
          const st = d.state as Rec, fighters = d.fighters as Rec[];
          cur = {
            file: basename(file), run, leader: start.leader, act: d.act, floor: d.floor, tier: d.tier, fight: d.fight, enemies: d.enemies, foes: d.foes ?? {},
            outcome: "", drift: null, ticks: 0, party: st.party, formation: st.formation, supplies: st.supplies, enteredKo: fighters.filter((x) => x.hp <= 0).map((x) => x.name),
            bench: (st.roster as Rec[]).filter((m) => !st.party.includes(m.cls)).map((m) => m.cls),
            maxHp: fighters.reduce((s, x) => s + x.stats.max_hp, 0), hpIn: fighters.reduce((s, x) => s + Math.max(0, x.hp), 0), hpOut: 0,
            mpIn: fighters.reduce((s, x) => s + x.mp, 0), mpMax: fighters.reduce((s, x) => s + x.stats.max_mp, 0),
            taken: new Map(), takenFrom: new Map(), dealt: new Map(), dealtBy: new Map(), kos: [], text: "",
          };
          break;
        }
        case "result": {
          if (!er || !cur) break;
          advance(c, combat, er);
          digest(er.log as Entry[], cur, er);
          cur.outcome = er.outcome ?? "?";
          const party = (er.party as EngineMember[]).map((m) => ({ ref: m.ref, hp: m.hp }));
          const want = (d.party as Rec[]).map((m) => ({ ref: m.ref, hp: m.hp }));
          if (er.outcome !== d.outcome || JSON.stringify(party) !== JSON.stringify(want)) cur.drift = `recorded ${d.outcome}, replayed ${er.outcome}`;
          fights.push(cur);
          endFight(c, r, er);
          er = null; cur = null;
          break;
        }
        case "abandon": r.pending = { kind: "over", won: false }; break;
      }
    } catch (err) { drift = `step ${d.i}: ${err instanceof Error ? err.message : String(err)}`; }
    if (drift) break;
  }
  registerGear(c, r);
  const final = rec.final as Rec, roster = final.roster as Rec[], items = final.items as Rec[];
  const isLeg = (it: Rec) => it.rarity === "legendary" || it.rarity === "mythic";
  const row: RunRow = {
    file: basename(file), run, leader: start.leader, drafted, roster: roster.map((m) => m.cls), act: rec.act, floor: rec.floor, fights,
    known: roster.reduce((s, m) => s + m.known.length, 0), legendaries: items.filter(isLeg).length,
    worn: items.filter((it) => isLeg(it) && roster.some((m) => Object.values(m.gear).includes(it.uid))).length,
    gold: final.gold, spent: rec.stats.spent, supplies, swaps, campfire,
  };
  if (drift) console.error(`${basename(file)}: the replay drifted at ${drift} (play it under its own build's pack: ${start.build}); ${fights.length} fights read before it`);
  else console.error(`${basename(file)}: ${fights.length} fights replayed${fights.some((f) => f.drift) ? " (some ended differently: see the table)" : ""}`);
  return row;
}

const runs = files.map((f, i) => replay(f, i + 1));
const all = runs.flatMap((r) => r.fights);
const out: string[] = [];
const p = (s = "") => out.push(s);
const top = (m: Map<string, number>, n: number) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
const short = (cls: string) => cls.slice(0, 5);

p(`# ${runs.length} recorded runs, ${all.length} fights`);
p();
p("## The runs");
p();
p("| # | leader | drafted | roster at the end | reached | fights W/L | died at (party HP in) | known | legendaries (worn) | gold left / spent | supplies | swaps | campfires |");
p("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");
for (const r of runs) {
  const last = r.fights.at(-1);
  const won = r.fights.filter((f) => f.outcome === "won").length;
  const died = last && last.outcome !== "won" ? `${last.tier} ${last.fight} a${last.act} f${last.floor} (${pct(last.hpIn, last.maxHp)}%)` : "(alive or abandoned)";
  const camp = Object.entries(r.campfire).filter(([k]) => k !== "leave").map(([k, v]) => `${k} ${v}`).join(", ");
  p(`| ${r.run} | ${r.leader} | ${r.drafted.join(", ")} | ${r.roster.map(short).join(" ")} | act ${r.act} floor ${r.floor} | ${won}/${r.fights.length - won} | ${died} | ${r.known} | ${r.legendaries} (${r.worn}) | ${r.gold} / ${r.spent} | ${r.supplies} | ${r.swaps} | ${camp} |`);
}
p();
p("## Every fight");
p();
p("Foes: the HP and damage change the fight was played at (the knob's and the tier's shape together). HP in and out: the fighting three's, as a share of their max.");
p();
p("| run | act.floor | tier | fight | foes | change | out | ticks | HP in | HP out | MP in | party | formation | supplies | fell |");
p("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");
for (const f of all) {
  const change = `${f.foes.hp ? `HP ${f.foes.hp > 0 ? "+" : ""}${f.foes.hp}%` : "HP 0"} ${f.foes.power ? `dmg ${f.foes.power > 0 ? "+" : ""}${f.foes.power}%` : "dmg 0"}`;
  const fell = f.kos.map((k) => `${k.unit} t${k.at} (${k.by})`).join("; ");
  p(`| ${f.run} ${f.leader} | ${f.act}.${f.floor} | ${f.tier} | ${f.fight} | ${f.enemies.length} | ${change} | ${f.outcome}${f.drift ? ` (${f.drift})` : ""} | ${f.ticks} | ${pct(f.hpIn, f.maxHp)}% | ${pct(f.hpOut, f.maxHp)}% | ${pct(f.mpIn, f.mpMax)}% | ${f.party.map(short).join(" ")}${f.enteredKo.length ? ` (${f.enteredKo.join(", ")} down)` : ""} | ${f.formation} | ${f.supplies.join(", ") || "none"} | ${fell} |`);
}
p();
p("## By fight");
p();
p("| tier | fight | n | lost | HP cost each time (%) | fell | ticks |");
p("| --- | --- | --- | --- | --- | --- | --- |");
const byFight = new Map<string, Fight[]>();
for (const f of all) { const k = `${f.act}|${f.tier}|${f.fight}`; byFight.set(k, [...(byFight.get(k) ?? []), f]); }
for (const [k, v] of [...byFight.entries()].sort((a, b) => a[0].localeCompare(b[0]) || b[1].length - a[1].length)) {
  const [act, tier, fight] = k.split("|");
  p(`| act ${act} ${tier} | ${fight} | ${v.length} | ${v.filter((f) => f.outcome !== "won").length} | ${v.map((f) => pct(f.hpIn - f.hpOut, f.maxHp)).join(", ")} | ${v.reduce((s, f) => s + f.kos.length, 0)} | ${v.map((f) => f.ticks).join(", ")} |`);
}
p();
p("## What hurt the party");
p();
const taken = new Map<string, number>(), takenLost = new Map<string, number>();
for (const f of all) for (const [k, v] of f.takenFrom) { add(taken, k, v); if (f.outcome !== "won") add(takenLost, k, v); }
const takenAll = [...taken.values()].reduce((a, b) => a + b, 0), takenLostAll = [...takenLost.values()].reduce((a, b) => a + b, 0);
p("| source | all fights | share | in lost fights | share |");
p("| --- | --- | --- | --- | --- |");
for (const [k, v] of top(taken, 25)) p(`| ${k} | ${Math.round(v)} | ${pct(v, takenAll)}% | ${Math.round(takenLost.get(k) ?? 0)} | ${pct(takenLost.get(k) ?? 0, takenLostAll)}% |`);
p();
const koBy = new Map<string, number>(), koOf = new Map<string, number>();
for (const f of all) for (const k of f.kos) { add(koBy, k.by.replace(/, \d+$/, ""), 1); add(koOf, k.unit, 1); }
p(`Knockouts: ${[...koOf.values()].reduce((a, b) => a + b, 0)}. By cause: ${top(koBy, 12).map(([k, v]) => `${k} ${v}`).join("; ")}. By class: ${top(koOf, 20).map(([k, v]) => `${k} ${v}`).join(", ")}.`);
p();
p("## What the party dealt");
p();
const dealt = new Map<string, number>(), dealtBy = new Map<string, number>();
for (const f of all) { for (const [k, v] of f.dealt) add(dealt, k, v); for (const [k, v] of f.dealtBy) add(dealtBy, k, v); }
const dealtAll = [...dealt.values()].reduce((a, b) => a + b, 0);
p(`By class (share of all damage, statuses counted under who laid them): ${top(dealt, 20).map(([k, v]) => `${k} ${pct(v, dealtAll)}%`).join(", ")}.`);
p();
p(`By source: ${top(dealtBy, 30).map(([k, v]) => `${k} ${pct(v, dealtAll)}%`).join("; ")}.`);
p();
p("## Entering fights");
p();
const fights = all.filter((f) => f.tier === "fight"), elites = all.filter((f) => f.tier === "elite"), bosses = all.filter((f) => f.tier === "boss");
const mean = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : 0);
p(`- Below 70% HP: ${all.filter((f) => pct(f.hpIn, f.maxHp) < 70).length} of ${all.length}; below 50%: ${all.filter((f) => pct(f.hpIn, f.maxHp) < 50).length}; with a member down: ${all.filter((f) => f.enteredKo.length).length}; with no supplies: ${all.filter((f) => !f.supplies.length).length}.`);
p(`- Mean ticks: regular ${mean(fights.map((f) => f.ticks))}, elite ${mean(elites.map((f) => f.ticks))}, boss ${bosses.map((f) => f.ticks).join(", ") || "none"}.`);
const lost = all.filter((f) => f.outcome !== "won");
p(`- Losses: ${lost.length}; the party entered at ${lost.map((f) => `${pct(f.hpIn, f.maxHp)}%`).join(", ")} of its HP (${lost.filter((f) => pct(f.hpIn, f.maxHp) >= 85).length} at 85% or more).`);
p();
p("## Habits");
p();
const mapPick = new Map<string, number>(), mapOffer = new Map<string, number>(), draftOffer = new Map<string, number>(), draftTake = new Map<string, number>();
const drops = new Map<string, number>(), camp = new Map<string, number>(), spend = new Map<string, number>();
for (const file of files) {
  const rec = JSON.parse(readFileSync(file, "utf8")) as Rec;
  for (const e of rec.record as Rec[]) {
    if (e.t !== "choice") continue;
    if (e.kind === "map" && e.nodes) {
      const kinds = new Map<string, string>((e.nodes as Rec[]).map((n) => [n.id, n.kind]));
      if (new Set(kinds.values()).size > 1) { add(mapPick, kinds.get(e.pick) ?? "?", 1); for (const k of new Set(kinds.values())) add(mapOffer, k, 1); }
    }
    if (e.kind === "draft") { for (const o of e.offered as string[]) add(draftOffer, o, 1); add(draftTake, e.pick, 1); }
    if (e.kind === "drop") add(drops, e.pick, 1);
    if (e.kind === "campfire" && e.pick !== "leave") add(camp, e.pick, 1);
    if (e.kind === "shop" && e.goldChange < 0) add(spend, /^(learn|version|power)/.test(e.pick) ? "training" : "gear, formations and supplies", -e.goldChange);
  }
}
p(`- Map, when rooms of different kinds were on offer: picked ${top(mapPick, 9).map(([k, v]) => `${k} ${v}`).join(", ")}; on offer ${top(mapOffer, 9).map(([k, v]) => `${k} ${v}`).join(", ")}.`);
p(`- Drafts, offered → taken: ${[...draftOffer.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v} → ${draftTake.get(k) ?? 0}`).join(", ")}.`);
p(`- Campfires: ${top(camp, 9).map(([k, v]) => `${k} ${v}`).join(", ")}. Drops: ${top(drops, 9).map(([k, v]) => `${k} ${v}`).join(", ")}. Shop gold: ${top(spend, 9).map(([k, v]) => `${k} ${v}`).join(", ")}.`);
if (args.includes("--fights")) {
  p();
  p("## The fights as a player remembers them (lost first)");
  for (const f of [...all].sort((a, b) => Number(a.outcome === "won") - Number(b.outcome === "won"))) {
    p();
    p(`### Run ${f.run} (${f.leader}), act ${f.act} floor ${f.floor}: ${f.tier} ${f.fight}, ${f.outcome}`);
    p();
    p("```");
    p(f.text.trim());
    p("```");
  }
}
const dest = flag("--out");
if (dest) { writeFileSync(dest, out.join("\n") + "\n"); console.error(`wrote ${dest}`); } else console.log(out.join("\n"));
