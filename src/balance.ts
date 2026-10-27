/**
 * The balance sheet (steps/05-core-set/5e-balance): what happens inside fights, read from the logs, for every class,
 * ability, status, enemy, gear piece and formation in the pack, in both modes, at frozen knobs and fixed seeds.
 *
 * A fixed spread of parties (every trio sampled evenly, every formation, every piece of gear a class can wear, plus the
 * sensible kits the campaign tuning uses) plays every campaign node's run and every rogue fight at its calibrated knob.
 * Each line is compared with the others of its kind and flagged at both ends against bands written down with their
 * reasons (BANDS below). Win rates are context here, never the measure: the knobs absorb them.
 *
 *   npm run balance [-- --trios 48] [--seeds 1] [--sets campaign,rogue] [--set path=value]... [--out out/balance] [--workers N]
 *
 * Output: out/balance/sheet.md (the sheet and the flags), sheet.json (every number), and the flags on screen.
 * Bundled by esbuild like the other tuners, so worker threads can load it.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { availableParallelism } from "node:os";
import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";
import { campaign, everything, simPick } from "./campaign.js";
import { combat } from "./engine/combat/rules.js";
import type { CFight } from "./engine/combat/fight.js";
import type { Entry } from "./engine/log.js";
import { advanceOnce, answer, loadContent, newRun, type Content, type Run } from "./engine/run.js";
import { next, rngFor } from "./engine/rng.js";
import { foesFor, knobFor, REF_FLOOR, registerGear, rogue, type RogueRun } from "./rogue.js";
import type { AbilityT, DungeonT, GearT, Party } from "./schema.js";
import { patch } from "./sim/content.js";
import { combos, makeBuild, ORDERS, seat, slotted, STYLES } from "./sim/kits.js";
import { canEquip } from "./validate.js";

const T = 1000; // sub-ticks a tick
type Tally = Record<string, number>;
const add = (t: Tally, k: string, v = 1) => { t[k] = (t[k] ?? 0) + v; };
const get = (t: Tally, k: string) => t[k] ?? 0;

type SetId = "campaign" | "rogue" | "free";
/** One thing to play: a dungeon (a campaign node's run, a free-play run at the documents' numbers, or a rogue fight as a one-stage dungeon). */
type Fight = { set: SetId; id: string; name: string; dungeon: string; kind: "run" | "fight"; probe: boolean };
type Job = { set: string; dungeon: string; party: Party; kind: "spread" | "kit" | "probe"; seeds: number[] };

// ─── The fights ─────────────────────────────────────────────────────────────

/**
 * Every campaign node's run at the pack's knobs; the seven free-play runs at the documents' numbers (no knob: the enemies as
 * designed); and every rogue fight at its calibrated knob (heat 0, its pool's reference floor). `probe` marks the shorter
 * list the gear and formation probes play: the campaign, the free runs and the rogue bosses.
 */
export function fightSets(c: Content, sets: SetId[]): Fight[] {
  const out: Fight[] = [];
  if (sets.includes("campaign")) for (const n of campaign(c).nodes) out.push({ set: "campaign", id: n.id, name: n.name, dungeon: n.dungeon, kind: "run", probe: true });
  if (sets.includes("free")) for (const id of c.pack.progression.dungeonOrder) out.push({ set: "free", id, name: c.dungeons.get(id)!.name, dungeon: id, kind: "run", probe: true });
  if (sets.includes("rogue")) {
    registerGear(c);
    for (const reg of rogue(c).regions) {
      const tiers = [["easy", "fight"], ["normal", "fight"], ["elite", "elite"], ["bosses", "boss"]] as const;
      for (const [pool, tier] of tiers) for (const f of reg[pool]) {
        const fake = { act: reg.act, region: reg.id, heat: 0 } as unknown as RogueRun;
        const floor = tier === "boss" ? 10 : pool === "easy" ? REF_FLOOR.easy : pool === "normal" ? REF_FLOOR.normal : REF_FLOOR.elite;
        const foes = foesFor(c, tier, knobFor(c, fake, tier, floor, f));
        const id = `rg_${reg.id}_${pool}_${f.id}`;
        const d: DungeonT = {
          id, name: `${reg.name}: ${f.name}`, text: f.name, partySize: { max: 3 }, perkPool: [], challenges: [],
          ...(Object.keys(foes).length ? { foes } : {}),
          stages: [{ kind: "fight", id: f.id, name: f.name, enemies: f.enemies, ...(tier === "boss" ? { boss: true } : {}) }],
        };
        c.dungeons.set(id, d);
        out.push({ set: "rogue", id, name: d.name, dungeon: id, kind: "fight", probe: tier === "boss" });
      }
    }
  }
  return out;
}

// ─── The parties ────────────────────────────────────────────────────────────

/**
 * The spread: `trios` trios picked so every class appears about equally often, each in a formation (round robin over all
 * ten), seated by the kit weights, and twice: once wearing a rotation of every piece its class can wear (so what nobody
 * picks is still measured), once in the campaign tuning's sensible kit. Ability order alternates between the documents'
 * and the shortest cooldown first.
 */
export function partySpread(c: Content, trios: number, seed = 5): { parties: { party: Party; kind: "spread" | "kit" }[]; trios: string[][] } {
  const classes = c.pack.classes.map((x) => x.id);
  const all = combos(classes, 3);
  const rng = rngFor(seed, "balance:trios");
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(next(rng) * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  // Greedy balance: each pick is the trio that keeps the most-used class lowest.
  const count = new Map(classes.map((x) => [x, 0]));
  const picked: string[][] = [];
  const left = all.slice();
  while (picked.length < trios && left.length) {
    let best = 0, bs = Infinity;
    for (let i = 0; i < left.length; i++) {
      const s = Math.max(...left[i].map((x) => count.get(x)!)) * 100 + left[i].reduce((a, x) => a + count.get(x)!, 0);
      if (s < bs) (bs = s), (best = i);
    }
    const t = left.splice(best, 1)[0];
    picked.push(t);
    for (const x of t) count.set(x, count.get(x)! + 1);
  }
  const owned = everything(c);
  const forms = c.pack.formations.map((f) => f.id);
  const out: { party: Party; kind: "spread" | "kit" }[] = [];
  // The rotation: for each class, every piece of every slot comes round in turn (an empty armor or amulet slot too, as a kit may leave it).
  // Each class starts its turn at its own offset, so the union over classes covers every piece even when a class appears in fewer parties than there are pieces.
  const turn = new Map<string, number>();
  const nextPiece = (cls: string, slot: string): string | undefined => {
    const xs = wearable(c, cls, slot);
    const n = xs.length + (slot === "weapon" ? 0 : 1);
    const k = `${cls}|${slot}`, i = turn.get(k) ?? classes.indexOf(cls) * 5;
    turn.set(k, i + 1);
    return xs[i % n];
  };
  picked.forEach((trio, i) => {
    const formation = forms[i % forms.length];
    const f = c.formations.get(formation)!;
    const order = seat(c, trio, formation, "plain");
    const abOrder = ORDERS[i % ORDERS.length];
    const units = order.map((cls, j) => {
      const gear: Record<string, string> = {};
      for (const slot of ["weapon", "armor", "amulet"]) {
        const pick = nextPiece(cls, slot);
        if (pick) gear[slot] = pick;
      }
      return { class: cls, position: f.positions[j].id, abilities: slotted(c, cls, abOrder), gear };
    });
    out.push({ party: { formation, units }, kind: "spread" });
    const kit = makeBuild(c, trio, formation, STYLES[i % STYLES.length], owned, [], undefined, ORDERS[(i + 1) % ORDERS.length]);
    if (kit) out.push({ party: kit, kind: "kit" });
  });
  return { parties: out, trios: picked };
}
/** The pieces of the pack a class can wear in a slot. */
const wearable = (c: Content, cls: string, slot: string) => c.pack.gear.filter((g) => g.slot === slot && canEquip(c.classes.get(cls)!, g)).map((g) => g.id);

/**
 * The gear probe: for one class, each piece it can wear, alone on an otherwise bare unit (its plain weapon, no armor, no amulet),
 * beside fixed kitted companions in Neutral. The same companions and seeds for every piece, so a piece's number is its own.
 * The baseline is the bare unit; `none` names it.
 */
export function gearProbe(c: Content, cls: string, trios: string[][], owned: ReturnType<typeof everything>, refs = 4): { piece: string; party: Party }[] {
  registerGear(c);
  const plain = c.pack.gear.find((g) => g.slot === "weapon" && g.source === "starter" && g.weapon?.kind === c.classes.get(cls)!.weapons[0])!.id;
  const mine = trios.filter((t) => t.includes(cls)).slice(0, refs);
  const f = c.formations.get("neutral")!;
  const pieces = ["none", ...["weapon", "armor", "amulet"].flatMap((slot) => wearable(c, cls, slot)), ...rogue(c).gear.filter((g) => canEquip(c.classes.get(cls)!, g)).map((g) => g.id)];
  const out: { piece: string; party: Party }[] = [];
  for (const piece of pieces) for (const trio of mine) {
    const kit = makeBuild(c, trio, "neutral", "plain", owned, []);
    if (!kit) continue;
    const g = piece === "none" ? undefined : c.gear.get(piece)!;
    const units = trio.map((k, j) => {
      if (k !== cls) return { ...kit.units.find((u) => u.class === k)!, position: f.positions[j].id };
      const gear: Record<string, string> = { weapon: plain };
      if (g) gear[g.slot] = g.id;
      return { class: k, position: f.positions[j].id, abilities: slotted(c, k, "doc"), gear };
    });
    out.push({ piece, party: { formation: "neutral", units } });
  }
  return out;
}

/** The formation probe: the same kitted parties in every formation (seated by the kit weights each time), so a formation's number is paired. */
export function formationProbe(c: Content, trios: string[][], owned: ReturnType<typeof everything>, n = 40): { formation: string; party: Party }[] {
  const out: { formation: string; party: Party }[] = [];
  for (const trio of trios.slice(0, n)) for (const f of c.pack.formations) {
    const kit = makeBuild(c, trio, f.id, "plain", owned, []);
    if (kit) out.push({ formation: f.id, party: kit });
  }
  return out;
}

/** The rogue set's spread also wears the rogue mode's own legendary pieces, one per member, each coming round in turn. */
const legTurn = new Map<string, number>();
export function withLegendaries(c: Content, p: Party, _i: number): Party {
  registerGear(c);
  const legs = rogue(c).gear;
  if (!legs.length) return p;
  return {
    ...p,
    units: p.units.map((u) => {
      const cls = c.classes.get(u.class)!;
      const mine = legs.filter((g) => canEquip(cls, g));
      if (!mine.length) return u;
      const n = legTurn.get(u.class) ?? 0;
      legTurn.set(u.class, n + 1);
      const g = mine[n % mine.length];
      return { ...u, gear: { ...u.gear, [g.slot]: g.id } };
    }),
  };
}

// ─── Playing and reading ────────────────────────────────────────────────────

const ROLE: Record<string, "wall" | "support" | "dealer"> = {
  knight: "wall", bramble_knight: "wall", hoplite: "wall", paladin: "wall",
  cleric: "support", bard: "support", hexer: "support", valkyrie: "support",
  ranger: "dealer", monk: "dealer", assassin: "dealer", vampire: "dealer", pyromancer: "dealer", frostweaver: "dealer", stormcaller: "dealer", geomancer: "dealer",
};
const CASTERS = new Set(["cleric", "paladin", "hexer", "frostweaver", "stormcaller", "geomancer", "pyromancer", "bard", "valkyrie"]);

/** Which statuses an ability applies (its own `apply` effects and its hits' attached statuses), and whether it removes any. */
function abilityShape(a: AbilityT): { applies: Set<string>; removes: boolean; kind: string } {
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
        side.set(u.id, u.side); ref.set(u.id, u.ref); max.set(u.id, u.max); born.set(u.id, at); acted.set(u.id, 0); dealt.set(u.id, 0); hpOf.set(u.id, u.hp);
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
          add(t, `cls|${oref}|dmg`, amt); add(t, `cls|${oref}|dmg|${srcKey}`, amt); add(t, `cls|${oref}|dmgk|${dk === "physical" || dk === "untyped" ? dk : "magical"}`, amt);
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

function runJob(c: Content, job: Job): Tally {
  const t: Tally = {};
  for (const seed of job.seeds) playAndTally(c, job, seed, t);
  return t;
}

// ─── The pool ───────────────────────────────────────────────────────────────

class Pool {
  private workers: Worker[] = [];
  private idle: Worker[] = [];
  private queue: { job: Job; done: (o: Tally) => void }[] = [];
  private waiting = new Map<Worker, (o: Tally) => void>();
  private local: Content | null = null;
  constructor(raw: unknown, n: number, sets: SetId[]) {
    if (n <= 1 || import.meta.url.endsWith(".ts")) { this.local = loadContent(raw); fightSets(this.local, sets); }
    else for (let i = 0; i < n; i++) {
      const w = new Worker(new URL(import.meta.url), { workerData: { raw, sets } });
      w.on("message", (o: Tally) => { const done = this.waiting.get(w)!; this.waiting.delete(w); this.idle.push(w); this.pump(); done(o); });
      w.on("error", (e) => { throw e; });
      this.workers.push(w); this.idle.push(w);
    }
  }
  run(job: Job): Promise<Tally> {
    if (this.local) return Promise.resolve(runJob(this.local, job));
    return new Promise((done) => { this.queue.push({ job, done }); this.pump(); });
  }
  private pump() {
    while (this.idle.length && this.queue.length) { const w = this.idle.pop()!; const { job, done } = this.queue.shift()!; this.waiting.set(w, done); w.postMessage(job); }
  }
  close() { for (const w of this.workers) void w.terminate(); }
}

// ─── The sheet ──────────────────────────────────────────────────────────────

const r1 = (x: number) => (Number.isFinite(x) ? (Math.abs(x) >= 100 ? Math.round(x).toLocaleString("en") : (Math.round(x * 10) / 10).toString()) : "–");
const r2 = (x: number) => (Number.isFinite(x) ? (Math.round(x * 100) / 100).toString() : "–");
const pc = (x: number) => (Number.isFinite(x) ? `${Math.round(100 * x)}%` : "–");
const div = (a: number, b: number) => (b ? a / b : NaN);
const mean = (xs: number[]) => { const ys = xs.filter(Number.isFinite); return ys.length ? ys.reduce((a, b) => a + b, 0) / ys.length : NaN; };
const median = (xs: number[]) => { const ys = xs.filter(Number.isFinite).sort((a, b) => a - b); return ys.length ? ys[Math.floor(ys.length / 2)] : NaN; };

/**
 * The bands, each with its reason: the core set documents say what each thing is for, and one principle sets the rest:
 * every option is a real choice, so nothing is useless, dominated or required, and nothing wins on its own.
 */
export const BANDS: Record<string, { lo: number; hi: number; unit: string; why: string; on?: string }> = {
  "class.win": { lo: -8, hi: 8, unit: "pts", why: "Every class is in about the same number of parties (the spread). A class whose parties win 8 points more than the parties without it carries them (required); 8 points less, and it's a passenger (useless). The documents: each class 'should be worth getting on its own', and every class is in at least one winning trio and has fights where it's the wrong pick." },
  "class.dmgDealer": { lo: 0.8, hi: 1.7, unit: "× an average unit", why: "A dealer's damage per unit-fight against the average unit's. The classes document names eight dealers (the three fighters, the four mages and the Ranger); one at 0.8 is outdamaged by the walls, one at 1.7 is the party's whole offence." },
  "class.dmgOther": { lo: 0.25, hi: 1.2, unit: "× an average unit", why: "A wall or support still swings (nothing is useless), but one that outdamages an average dealer (1.2) makes the dealers pointless." },
  "class.ko": { lo: 0, hi: 2.2, unit: "× the median class", why: "Knockouts per fight against the median class. The casters are fragile by design (HP 2), so up to about twice the median is their shape; past 2.2 a class is a liability nobody brings." },
  "class.takenWall": { lo: 1.1, hi: 2.4, unit: "× an average unit, per tick alive", why: "A wall's job is to be hit (Aggro 4–5, plate). Below 1.1 it isn't drawing; above 2.4 it takes everything and the draw rule's 'between a third and three times' is doing nothing for the others." },
  "class.takenOther": { lo: 0.35, hi: 1.25, unit: "× an average unit, per tick alive", why: "A dealer or support that takes more than 1.25 average units' damage per tick is the one being hit while the wall stands by; below 0.35 it can't be reached (the draw floor is a third)." },
  "class.starvedCaster": { lo: 0.03, hi: 0.3, unit: "share of time (campaign runs)", on: "campaign", why: "5c (the director's): casters are hungry, so some time with a spell ready and no MP is the design (above 3%); past 30% the caster is a basic-attacker with a staff. Read on the campaign's runs, where MP carries from fight to fight." },
  "class.starvedOther": { lo: 0, hi: 0.08, unit: "share of time (campaign runs)", on: "campaign", why: "5c (the director's): walls and fighters rarely run dry. Past 8% their cheap skills aren't cheap." },
  "class.casts": { lo: 1.6, hi: 6, unit: "casts a regular fight", why: "Three slotted abilities in a fight of 30 to 40 ticks on 24/32/42 cooldowns with slotted head starts: fewer than 1.6 casts a fight and the kit isn't playing (5c: 'those cooldowns are too long'); more than 6 and basic attacks are gone (5b's complaint)." },
  "ability.castsMob": { lo: 0.45, hi: 3, unit: "casts a regular fight owned", why: "An ability slotted by a standing member should fire in most regular fights; under 0.45 it fires in fewer than half, and the slot is dead (useless). Over 3 it's the unit's whole rhythm." },
  "ability.castsBoss": { lo: 0.9, hi: 6, unit: "casts a boss fight owned", why: "A boss fight is about one and a half regular fights long (5b); every slotted ability should come at least once, or it's a slot wasted where it matters most." },
  "ability.swings": { lo: 1.4, hi: 8, unit: "swings a cast", why: "scale.ts: a light hit is about 1.7 swings, a normal about 3, a heavy about 5 (on the same stat). Below 1.4 a basic attack does the job (dominated); above 8 the ability is the class and its other two don't matter." },
  "ability.share": { lo: 0, hi: 0.62, unit: "share of the class's damage", why: "A kit is three abilities and a passive on a basic attack. One ability over 62% of its class's damage means the rest is filler (nothing wins on its own)." },
  "ability.fail": { lo: 0, hi: 0.1, unit: "share of attempts", why: "A cast that fizzles (no MP at resolution, or no target) is a lost action and a lost cooldown. Past 10% the ability is unreliable." },
  "ability.healShare": { lo: 0.12, hi: 0.7, unit: "of an average unit's HP a cast", why: "Cure is 'a quick, small heal', Rally bigger; under 12% of a unit's HP a heal doesn't change a fight, over 70% a single cast undoes a boss's blow (nothing wins on its own)." },
  "ability.stacks": { lo: 1.5, hi: Infinity, unit: "stacks an application", why: "The scale: a few is about 2, several 4, many 7 (doubled on abilities). An application under 1.5 stacks is noise. The ceiling is the status's own cap (25 Might, 40 Shock, 8 Chill), or none (Burn, Bleed, Sunder), and its damage share is judged on the status's line." },
  "status.dmgShare": { lo: 0.05, hi: 0.35, unit: "share of its appliers' damage", why: "5c: Bleed level with Burn and Shock in their classes, 12% to 27%. Under 5% a damage status is a side dish nobody builds for; over 35% the status is the class." },
  "status.apps": { lo: 0.05, hi: Infinity, unit: "applications a fight", why: "A status nobody applies in the spread (fewer than one in twenty fights) is unreachable content; the tier check says every piece is used." },
  "enemy.acted0": { lo: 0, hi: 0.25, unit: "share killed before acting (free play)", on: "free", why: "5c put minions dying before acting at 12% ('the price of a fixed opening'). Past a quarter the foe is a number on the screen, not a fight. Read in free play, at the documents' numbers, where no knob has shrunk it." },
  "enemy.dmgRank": { lo: 0.3, hi: 3, unit: "× its rank's median (free play)", on: "free", why: "Damage dealt per appearance against the median of its rank (minion, elite, boss), at the documents' numbers. A foe at 0.3 is scenery; at 3 it's the only one that matters in its fights." },
  "enemy.lifeRank": { lo: 0.4, hi: 2.5, unit: "× its rank's median (free play)", on: "free", why: "Life in ticks against its rank's median, at the documents' numbers. Far below, it dies before its gimmick shows; far above, it's the fight's whole length." },
  "boss.signature": { lo: 0.9, hi: Infinity, unit: "casts a fight (free play)", on: "free", why: "The enemies document: a boss's signature move comes two or three times a fight (5b put it on a medium cooldown for that). A boss that casts it less than once a fight is a stat line." },
  "boss.kos": { lo: 0.15, hi: 2.5, unit: "knockouts a fight (free play)", on: "free", why: "A boss is the run's climax: one that never knocks anyone out isn't one; one that knocks out more than two and a half of three every fight decides the run on its own." },
  "gear.win": { lo: -7, hi: 7, unit: "pts against the slot's mean, probed", on: "probe", why: "The gear document: ordinary pieces are sidegrades, powerful pieces 'never a pure upgrade'. Probed alone on a bare unit beside the same companions: a piece 7 points under the mean of the pieces its wearers could have worn in that slot is dead weight; 7 over is the required piece." },
  "gear.empty": { lo: -2, hi: Infinity, unit: "pts against an empty slot, probed", on: "probe", why: "Nothing is useless: a piece of armor or an amulet should never lose to leaving the slot empty (2 points under, past noise). A weapon is probed against the class's plain one." },
  "gear.worn": { lo: 1, hi: Infinity, unit: "unit-fights", why: "Every piece must be measured; a piece never worn is a hole in the spread." },
  "formation.win": { lo: -7, hi: 7, unit: "pts against Neutral, probed", on: "probe", why: "The gear document: 'whether a slot at about one gear piece makes a formation a decision'. The same parties in every formation: one below Neutral by 7 points is dominated by doing nothing; one 7 above is the only formation." },
};

type Flag = { kind: string; id: string; name: string; band: string; value: number; set: string; severity: number; text: string };

type Lines = Record<string, Record<string, number>>;
type Sheet = {
  classes: Lines; abilities: Lines; enemyAbilities: Lines; statuses: Lines; enemies: Lines; gear: Lines; formations: Lines;
  resources: Record<string, number>; events: Record<string, number>; stats: Record<string, number>; flags: Flag[]; context: Record<string, number>;
};

function keys(t: Tally, prefix: string): string[] {
  const out = new Set<string>();
  for (const k of Object.keys(t)) if (k.startsWith(prefix)) out.add(k.slice(prefix.length).split("|")[0]);
  return [...out];
}

/** The lines of one tally (one set, or both pooled). */
export function compute(c: Content, t: Tally, setName: string): Sheet {
  const flags: Flag[] = [];
  /** A band is judged on the pooled numbers unless it names a set (`on`); then only that set's sheet raises it. */
  const flag = (kind: string, id: string, name: string, band: string, value: number, text: string) => {
    const b = BANDS[band];
    if (!b || !Number.isFinite(value)) return;
    if ((b.on ?? "pooled") !== (setName === "campaign" || setName === "rogue" || setName === "free" ? setName : "pooled")) return;
    if (value >= b.lo && value <= b.hi) return;
    const width = Number.isFinite(b.hi) ? b.hi - b.lo : Math.max(1, Math.abs(b.lo)) || 1;
    const dist = value < b.lo ? b.lo - value : value - b.hi;
    flags.push({ kind, id, name, band, value, set: setName, severity: dist / width, text });
  };
  const fightsMob = get(t, "fights|mob"), fightsBoss = get(t, "fights|boss"), fights = fightsMob + fightsBoss;
  const runs = get(t, "runs"), won = get(t, "won");
  const unitHp = div(get(t, "partyHp|mob") + get(t, "partyHp|boss"), c.pack.classes.reduce((a, k) => a + get(t, `cls|${k.id}|fights|mob`) + get(t, `cls|${k.id}|fights|boss`), 0));

  // Classes.
  const classes: Lines = {};
  const cls = c.pack.classes.map((k) => k.id);
  const perFight = (k: string, m: string) => div(get(t, `cls|${k}|${m}`), get(t, `cls|${k}|fights|mob`) + get(t, `cls|${k}|fights|boss`));
  const perTick = (k: string, m: string) => div(get(t, `cls|${k}|${m}`), get(t, `cls|${k}|alive`));
  const meanDmg = mean(cls.map((k) => perFight(k, "dmg"))), meanTaken = mean(cls.map((k) => perTick(k, "taken"))), meanHits = mean(cls.map((k) => perTick(k, "hitsTaken")));
  const koRates = cls.map((k) => perFight(k, "ko")), medKo = median(koRates);
  for (const k of cls) {
    const f = get(t, `cls|${k}|fights|mob`) + get(t, `cls|${k}|fights|boss`);
    const r = get(t, `cls|${k}|runs`), w = get(t, `cls|${k}|won`);
    const withRate = div(w, r), without = div(won - w, runs - r);
    const dmg = get(t, `cls|${k}|dmg`), basics = get(t, `cls|${k}|act|basic`), abs = get(t, `cls|${k}|act|ability`);
    const swing = div(get(t, `cls|${k}|dmg|basic`), basics);
    const stDmg = Object.keys(t).filter((x) => x.startsWith(`cls|${k}|dmg|st:`)).reduce((a, x) => a + t[x], 0);
    const reDmg = Object.keys(t).filter((x) => x.startsWith(`cls|${k}|dmg|re:`)).reduce((a, x) => a + t[x], 0);
    const abDmg = Object.keys(t).filter((x) => x.startsWith(`cls|${k}|dmg|ab:`)).reduce((a, x) => a + t[x], 0);
    const line = {
      fights: f, runs: r, win: 100 * (withRate - without), winWith: 100 * withRate,
      dmgIdx: div(perFight(k, "dmg"), meanDmg), dmgPerFight: perFight(k, "dmg"), swing,
      basicShare: div(get(t, `cls|${k}|dmg|basic`), dmg), abilityShare: div(abDmg, dmg), statusShare: div(stDmg, dmg), reactionShare: div(reDmg, dmg),
      physShare: div(get(t, `cls|${k}|dmgk|physical`), dmg), magShare: div(get(t, `cls|${k}|dmgk|magical`), dmg), untypedShare: div(get(t, `cls|${k}|dmgk|untyped`), dmg),
      takenIdx: div(perTick(k, "taken"), meanTaken), hitsIdx: div(perTick(k, "hitsTaken"), meanHits), takenPerFight: perFight(k, "taken"), alivePerFight: div(get(t, `cls|${k}|alive`), f),
      mitigated: 1 - div(get(t, `cls|${k}|taken`), get(t, `cls|${k}|takenRaw`)), dodge: div(get(t, `cls|${k}|dodged`), get(t, `cls|${k}|hitsTaken`)),
      soakedShare: div(get(t, `cls|${k}|soaked`), get(t, `cls|${k}|taken`) + get(t, `cls|${k}|soaked`)),
      ko: perFight(k, "ko"), koIdx: div(perFight(k, "ko"), medKo), koAt: div(get(t, `cls|${k}|koAt`), get(t, `cls|${k}|ko`)),
      actsPer10: div(10 * (basics + abs), get(t, `cls|${k}|alive`)), basicActShare: div(basics, basics + abs),
      castsMob: div(c.classes.get(k)!.abilities.reduce((a, ab) => a + get(t, `ab|${ab}|casts|mob`), 0), get(t, `cls|${k}|fights|mob`)),
      castsBoss: div(c.classes.get(k)!.abilities.reduce((a, ab) => a + get(t, `ab|${ab}|casts|boss`), 0), get(t, `cls|${k}|fights|boss`)),
      starved: div(get(t, `cls|${k}|starved`), get(t, `cls|${k}|alive`)), failMp: perFight(k, "fail|mp"), failTarget: perFight(k, "fail|target"),
      mpSpent: perFight(k, "mpSpent"), mpGot: perFight(k, "mpGot"), endMp: div(get(t, `cls|${k}|endMp`), get(t, `cls|${k}|endN`)), endHp: div(get(t, `cls|${k}|endHp`), get(t, `cls|${k}|endN`)),
      healGiven: perFight(k, "healGiven"), healGot: perFight(k, "healGot"), shieldGiven: perFight(k, "shieldGiven"),
      crit: div(get(t, `cls|${k}|crit`), get(t, `cls|${k}|hits`)), critDmgShare: div(get(t, `cls|${k}|critDmg`), dmg), miss: div(get(t, `cls|${k}|miss`), get(t, `cls|${k}|hits`) + get(t, `cls|${k}|miss`)),
      kills: perFight(k, "kills"), interrupts: perFight(k, "interrupts"), stuns: perFight(k, "stuns"), interrupted: perFight(k, "interrupted"), revives: perFight(k, "revives"),
      extraPerBasic: div(get(t, `cls|${k}|extra`), basics),
    };
    classes[k] = line;
    const name = c.classes.get(k)!.name;
    flag("class", k, name, "class.win", line.win, `parties with the ${name} win ${r1(line.win)} points ${line.win >= 0 ? "more" : "less"} than parties without it`);
    const role = ROLE[k];
    if (role === "dealer") flag("class", k, name, "class.dmgDealer", line.dmgIdx, `a dealer dealing ${r2(line.dmgIdx)}× an average unit's damage`);
    else flag("class", k, name, "class.dmgOther", line.dmgIdx, `a ${role} dealing ${r2(line.dmgIdx)}× an average unit's damage`);
    flag("class", k, name, "class.ko", line.koIdx, `knocked out ${r2(line.koIdx)}× as often as the median class (${r1(100 * line.ko)} per 100 fights)`);
    if (role === "wall") flag("class", k, name, "class.takenWall", line.takenIdx, `a wall taking ${r2(line.takenIdx)}× an average unit's damage`);
    else flag("class", k, name, "class.takenOther", line.takenIdx, `a ${role} taking ${r2(line.takenIdx)}× an average unit's damage`);
    if (CASTERS.has(k)) flag("class", k, name, "class.starvedCaster", line.starved, `${pc(line.starved)} of its time with a spell ready and no MP`);
    else flag("class", k, name, "class.starvedOther", line.starved, `${pc(line.starved)} of its time with an ability ready and no MP`);
    flag("class", k, name, "class.casts", line.castsMob, `${r1(line.castsMob)} casts a regular fight`);
  }

  // Abilities (the party's).
  const abilities: Lines = {};
  for (const a of c.pack.abilities) {
    if (!c.pack.classes.some((k) => k.abilities.includes(a.id))) continue;
    const owner = c.pack.classes.find((k) => k.abilities.includes(a.id))!;
    const shape = abilityShape(a);
    const casts = get(t, `ab|${a.id}|casts|mob`) + get(t, `ab|${a.id}|casts|boss`);
    const fails = get(t, `ab|${a.id}|fail|mp`) + get(t, `ab|${a.id}|fail|target`);
    const swing = classes[owner.id]?.swing ?? NaN;
    const apps = Object.keys(t).filter((x) => x.startsWith(`ab|${a.id}|app|`)).map((x) => x.split("|")[3]);
    const stacksPer = Object.fromEntries(apps.map((s) => [s, div(get(t, `ab|${a.id}|stacks|${s}`), get(t, `ab|${a.id}|app|${s}`))]));
    const line = {
      kind: ["damage", "heal", "revive", "shield", "control", "cleanse", "debuff", "buff", "other"].indexOf(shape.kind),
      ownedMob: get(t, `ab|${a.id}|owned|mob`), castsMob: div(get(t, `ab|${a.id}|casts|mob`), get(t, `ab|${a.id}|owned|mob`)), castsBoss: div(get(t, `ab|${a.id}|casts|boss`), get(t, `ab|${a.id}|owned|boss`)),
      silentMob: div(get(t, `ab|${a.id}|silentMob`), get(t, `ab|${a.id}|owned|mob`)),
      first: div(get(t, `ab|${a.id}|first`), get(t, `ab|${a.id}|firstN`)),
      dmgPerCast: div(get(t, `ab|${a.id}|dmg`), casts), swings: div(div(get(t, `ab|${a.id}|dmg`), casts), swing), share: div(get(t, `ab|${a.id}|dmg`), get(t, `cls|${owner.id}|dmg`)),
      healPerCast: div(get(t, `ab|${a.id}|heal`), casts), healShare: div(div(get(t, `ab|${a.id}|heal`), casts), unitHp), shieldPerCast: div(get(t, `ab|${a.id}|shield`), casts), shieldShare: div(div(get(t, `ab|${a.id}|shield`), casts), unitHp),
      fail: div(fails, casts + fails), failMp: get(t, `ab|${a.id}|fail|mp`), failTarget: get(t, `ab|${a.id}|fail|target`), interrupted: div(get(t, `ab|${a.id}|interrupted`), casts + get(t, `ab|${a.id}|interrupted`)),
      mpPerCast: div(get(t, `ab|${a.id}|mp`), casts), targets: div(get(t, `ab|${a.id}|targets`), casts), crit: div(get(t, `ab|${a.id}|crit`), get(t, `ab|${a.id}|hits`)), miss: div(get(t, `ab|${a.id}|miss`), get(t, `ab|${a.id}|hits`) + get(t, `ab|${a.id}|miss`)),
      kills: div(get(t, `ab|${a.id}|kills`), casts), removed: div(get(t, `ab|${a.id}|removed`), casts), revives: div(get(t, `ab|${a.id}|revive`), casts),
      slot0: div(get(t, `ab|${a.id}|slot|0|casts`), get(t, `ab|${a.id}|slot|0|owned`)), slot1: div(get(t, `ab|${a.id}|slot|1|casts`), get(t, `ab|${a.id}|slot|1|owned`)), slot2: div(get(t, `ab|${a.id}|slot|2|casts`), get(t, `ab|${a.id}|slot|2|owned`)),
      ...Object.fromEntries(Object.entries(stacksPer).map(([s, v]) => [`stacks:${s}`, v])),
      ...Object.fromEntries(apps.map((s) => [`apps:${s}`, div(get(t, `ab|${a.id}|app|${s}`), casts)])),
    };
    abilities[a.id] = line;
    const name = `${owner.name}'s ${a.name}`;
    const waits = !!a.if;
    if (!waits) { flag("ability", a.id, name, "ability.castsMob", line.castsMob, `cast ${r2(line.castsMob)} times a regular fight it's slotted in`); flag("ability", a.id, name, "ability.castsBoss", line.castsBoss, `cast ${r2(line.castsBoss)} times a boss fight`); }
    if (shape.kind === "damage") { flag("ability", a.id, name, "ability.swings", line.swings, `a cast deals ${r1(line.swings)} of its class's swings`); flag("ability", a.id, name, "ability.share", line.share, `${pc(line.share)} of its class's damage`); }
    flag("ability", a.id, name, "ability.fail", line.fail, `${pc(line.fail)} of its casts fizzle (${line.failMp} for MP, ${line.failTarget} for want of a target)`);
    if (shape.kind === "heal") flag("ability", a.id, name, "ability.healShare", line.healShare, `a cast heals ${pc(line.healShare)} of an average unit's max HP`);
    for (const [s, v] of Object.entries(stacksPer)) { const d = c.statuses.get(s); if (d?.stacking === "intensity" && s !== "shield") flag("ability", a.id, name, "ability.stacks", v, `an application adds ${r1(v)} ${d.name}`); }
  }

  // Enemy abilities.
  const enemyAbilities: Lines = {};
  for (const a of c.pack.abilities) {
    if (c.pack.classes.some((k) => k.abilities.includes(a.id))) continue;
    const casts = get(t, `eab|${a.id}|casts`), fts = get(t, `eab|${a.id}|fights`);
    enemyAbilities[a.id] = {
      fights: fts, castsPerFight: div(casts, fts), dmgPerCast: div(get(t, `eab|${a.id}|dmg`), casts), healPerCast: div(get(t, `eab|${a.id}|heal`), casts),
      kos: div(get(t, `eab|${a.id}|kos`), fts), interrupted: div(get(t, `eab|${a.id}|interrupted`), fts), held: div(get(t, `eab|${a.id}|held`), fts),
      failMp: div(get(t, `eab|${a.id}|fail|mp`), fts), failTarget: div(get(t, `eab|${a.id}|fail|target`), fts),
    };
  }

  // Statuses.
  const statuses: Lines = {};
  const stIds = c.pack.statuses.filter((s) => s.show === "icon").map((s) => s.id);
  // A status's appliers: the classes whose own kit (an ability or the passive) applies it, and did so here.
  const kitApplies = (k: string, s: string) => {
    const d = c.classes.get(k)!;
    if (d.abilities.some((a) => abilityShape(c.abilities.get(a)!).applies.has(s))) return true;
    return (d.passive?.statuses ?? []).some((id) => c.statuses.get(id)?.reactions?.some((r) => r.do.some((x) => x.op === "apply" && x.status === s)));
  };
  const applierClasses = (s: string) => cls.filter((k) => kitApplies(k, s) && get(t, `cls|${k}|app|${s}`) > 0);
  for (const s of stIds) {
    const d = c.statuses.get(s)!;
    const appP = get(t, `st|${s}|app|party`), appE = get(t, `st|${s}|app|enemy`), apps = appP + appE;
    const appliers = applierClasses(s);
    const applierDmg = appliers.reduce((a, k) => a + get(t, `cls|${k}|dmg`), 0);
    const applierStDmg = appliers.reduce((a, k) => a + get(t, `cls|${k}|dmg|st:${s}`) + get(t, `cls|${k}|dmg|re:${s}`), 0);
    const ends = Object.keys(t).filter((x) => x.startsWith(`st|${s}|end|`)).reduce((a, x) => a + t[x], 0);
    const line = {
      appsPerFight: div(apps, fights), onParty: div(appP, fights), onEnemy: div(appE, fights),
      stacksPerApp: div(get(t, `st|${s}|stacks|party`) + get(t, `st|${s}|stacks|enemy`), apps),
      uptimePerApp: div(get(t, `st|${s}|uptime|party`) + get(t, `st|${s}|uptime|enemy`), apps), uptimePerFight: div(get(t, `st|${s}|uptime|party`) + get(t, `st|${s}|uptime|enemy`), fights),
      dmg: get(t, `st|${s}|dmg`), dmgPerApp: div(get(t, `st|${s}|dmg`), appE), dmgShareOfAppliers: div(applierStDmg, applierDmg), dmgShareOfParty: div(get(t, `st|${s}|dmg`), get(t, "partyDmg|mob") + get(t, "partyDmg|boss")),
      dmgOnPartyPerFight: div(get(t, `st|${s}|dmgOnParty`), fights), healPerApp: div(get(t, `st|${s}|heal`), appP),
      kills: get(t, `st|${s}|kills`), kos: get(t, `st|${s}|kos`), immune: get(t, `st|${s}|immune`),
      endExpired: div(get(t, `st|${s}|end|expired`), ends), endStacks: div(get(t, `st|${s}|end|stacks`), ends), endRemoved: div(get(t, `st|${s}|end|removed`), ends), endFight: 1 - div(ends, apps),
      holdsPerApp: div(get(t, `st|${s}|holds`), apps), interruptsPerApp: div(get(t, `st|${s}|interrupts`), apps), tauntHitsPerFight: div(get(t, `st|${s}|tauntHits`), fights),
    };
    statuses[s] = line;
    const harms = !!(d.pulse?.do?.some((e) => e.op === "damage") || d.trigger?.do?.some((e) => e.op === "damage"));
    if (harms && d.label === "debuff" && appliers.length) flag("status", s, d.name, "status.dmgShare", line.dmgShareOfAppliers, `${pc(line.dmgShareOfAppliers)} of its appliers' damage (${appliers.map((k) => c.classes.get(k)!.name).join(", ")})`);
    if (!["doom", "bulwark", "bulwark_broken", "bedrock_on", "bloodlust_on", "lg_idol_on", "ice_crust"].includes(s)) flag("status", s, d.name, "status.apps", line.appsPerFight, `applied ${r2(line.appsPerFight)} times a fight`);
  }

  // Enemies.
  const enemies: Lines = {};
  const ens = c.pack.enemies;
  const byRank = (rank: string, m: (e: typeof ens[number]) => number) => median(ens.filter((e) => e.rank === rank && get(t, `en|${e.id}|n`) > 0).map(m));
  const dmgPer = (e: typeof ens[number]) => div(get(t, `en|${e.id}|dmg`), get(t, `en|${e.id}|n`));
  const lifePer = (e: typeof ens[number]) => div(get(t, `en|${e.id}|life`), get(t, `en|${e.id}|n`));
  const medDmg = { minion: byRank("minion", dmgPer), elite: byRank("elite", dmgPer), boss: byRank("boss", dmgPer) };
  const medLife = { minion: byRank("minion", lifePer), elite: byRank("elite", lifePer), boss: byRank("boss", lifePer) };
  for (const e of ens) {
    const n = get(t, `en|${e.id}|n`), fts = get(t, `en|${e.id}|fights`);
    if (!n) { enemies[e.id] = { n: 0 }; continue; }
    const sig = (e.abilities ?? []).map((a) => div(get(t, `eab|${a}|casts`), fts));
    const line = {
      n, fights: fts, life: lifePer(e), lifeIdx: div(lifePer(e), medLife[e.rank]), acted0: div(get(t, `en|${e.id}|acted0`), n), killed: div(get(t, `en|${e.id}|killed`), n), survived: div(get(t, `en|${e.id}|survived`), n),
      dmg: dmgPer(e), dmgIdx: div(dmgPer(e), medDmg[e.rank]), dmgPerTick: div(get(t, `en|${e.id}|dmg`), get(t, `en|${e.id}|life`)), kos: div(get(t, `en|${e.id}|kos`), fts),
      basics: div(get(t, `en|${e.id}|act|basic`), n), casts: div(get(t, `en|${e.id}|act|ability`), n), signature: sig.length ? Math.max(...sig) : NaN,
      mitigated: 1 - div(get(t, `en|${e.id}|taken`), get(t, `en|${e.id}|takenRaw`)), dodge: div(get(t, `en|${e.id}|dodged`), get(t, `en|${e.id}|hitsTaken`)),
      takenPhys: div(get(t, `en|${e.id}|taken|physical`), get(t, `en|${e.id}|taken`)), takenUntyped: div(get(t, `en|${e.id}|taken|untyped`), get(t, `en|${e.id}|taken`)),
      healGot: div(get(t, `en|${e.id}|healGot`), n), interrupted: div(get(t, `en|${e.id}|interrupted`), fts), held: div(get(t, `en|${e.id}|held`), fts),
    };
    enemies[e.id] = line;
    if (e.rank === "minion") flag("enemy", e.id, e.name, "enemy.acted0", line.acted0, `${pc(line.acted0)} killed before acting`);
    flag("enemy", e.id, e.name, "enemy.dmgRank", line.dmgIdx, `deals ${r2(line.dmgIdx)}× the median ${e.rank}'s damage per appearance`);
    flag("enemy", e.id, e.name, "enemy.lifeRank", line.lifeIdx, `lives ${r2(line.lifeIdx)}× the median ${e.rank}'s ticks`);
    if (e.rank === "boss") { flag("boss", e.id, e.name, "boss.signature", line.signature, `casts its signature move ${r2(line.signature)} times a fight`); flag("boss", e.id, e.name, "boss.kos", line.kos, `knocks out ${r2(line.kos)} party members a fight`); }
  }

  // Gear: each piece against its slot's mean for the same class, weighted by wearings.
  const gear: Lines = {};
  registerGear(c);
  const pieces = [...c.pack.gear, ...rogue(c).gear.filter((g) => !c.pack.gear.some((x) => x.id === g.id))];
  const slotOf = new Map<string, string>(pieces.map((g) => [g.id, g.slot]));
  for (const slot of ["weapon", "armor", "amulet"]) slotOf.set(`none:${slot}`, slot);
  const gearIds = keys(t, "gearc|");
  const baseline = new Map<string, { runs: number; won: number; worn: number; dmg: number; taken: number; ko: number }>(); // "slot|class"
  for (const g of gearIds) for (const k of cls) {
    const key = `${slotOf.get(g)}|${k}`, b = baseline.get(key) ?? { runs: 0, won: 0, worn: 0, dmg: 0, taken: 0, ko: 0 };
    b.runs += get(t, `gearc|${g}|${k}|runs`); b.won += get(t, `gearc|${g}|${k}|won`); b.worn += get(t, `gearc|${g}|${k}|worn`); b.dmg += get(t, `gearc|${g}|${k}|dmg`); b.taken += get(t, `gearc|${g}|${k}|taken`); b.ko += get(t, `gearc|${g}|${k}|ko`);
    baseline.set(key, b);
  }
  for (const g of [...pieces.map((x) => x.id), "none:armor", "none:amulet"]) {
    let wSum = 0, win = 0, dmg = 0, taken = 0, ko = 0, koW = 0, heal = 0;
    for (const k of cls) {
      const worn = get(t, `gearc|${g}|${k}|worn`), runsK = get(t, `gearc|${g}|${k}|runs`);
      if (!worn || !runsK) continue;
      const b = baseline.get(`${slotOf.get(g)}|${k}`)!;
      wSum += worn;
      win += worn * 100 * (div(get(t, `gearc|${g}|${k}|won`), runsK) - div(b.won, b.runs));
      dmg += worn * div(div(get(t, `gearc|${g}|${k}|dmg`), worn), div(b.dmg, b.worn));
      taken += worn * div(div(get(t, `gearc|${g}|${k}|taken`), worn), div(b.taken, b.worn));
      if (b.ko) { ko += worn * div(div(get(t, `gearc|${g}|${k}|ko`), worn), div(b.ko, b.worn)); koW += worn; }
      heal += get(t, `gearc|${g}|${k}|heal`);
    }
    const piece = pieces.find((x) => x.id === g);
    const line = {
      worn: get(t, `gear|${g}|worn`), kit: get(t, `gear|${g}|kit`), win: div(win, wSum), dmgIdx: div(dmg, wSum), takenIdx: div(taken, wSum), koIdx: div(ko, koW),
      swingDmg: div(get(t, `gear|${g}|swingDmg`), get(t, `gear|${g}|swings`)), healPerFight: div(heal, get(t, `gear|${g}|worn`)),
    };
    gear[g] = line;
    if (piece) flag("gear", g, piece.name, "gear.worn", line.worn, `worn in ${line.worn} unit-fights`);
  }

  // Formations.
  const formations: Lines = {};
  const neutral = div(get(t, "form|neutral|won"), get(t, "form|neutral|runs"));
  const formMeanDmg = mean(c.pack.formations.map((f) => div(get(t, `form|${f.id}|dmg`), get(t, `form|${f.id}|fights`))));
  const formMeanTaken = mean(c.pack.formations.map((f) => div(get(t, `form|${f.id}|taken`), get(t, `form|${f.id}|fights`))));
  for (const f of c.pack.formations) {
    const rr = get(t, `form|${f.id}|runs`), fts = get(t, `form|${f.id}|fights`);
    const line = {
      runs: rr, win: 100 * (div(get(t, `form|${f.id}|won`), rr) - neutral), winRate: div(get(t, `form|${f.id}|won`), rr),
      dmgIdx: div(div(get(t, `form|${f.id}|dmg`), fts), formMeanDmg), takenIdx: div(div(get(t, `form|${f.id}|taken`), fts), formMeanTaken), koPerFight: div(get(t, `form|${f.id}|ko`), fts), effectPerFight: div(get(t, `form|${f.id}|effect`), fts),
    };
    formations[f.id] = line;
  }

  // Resources and the party as a whole.
  const partyHpMob = div(get(t, "partyHp|mob"), fightsMob), partyHpBoss = div(get(t, "partyHp|boss"), fightsBoss);
  const resources = {
    "runs": runs, "runs won": div(won, runs), "fights (regular)": fightsMob, "fights (boss)": fightsBoss, "ticks a regular fight": div(get(t, "ticks|mob"), fightsMob), "ticks a boss fight": div(get(t, "ticks|boss"), fightsBoss),
    "HP: damage taken a regular fight, share of party max HP": div(div(get(t, "taken|mob"), fightsMob), partyHpMob), "HP: damage taken a boss fight, share": div(div(get(t, "taken|boss"), fightsBoss), partyHpBoss),
    "HP: healing a regular fight, share": div(div(get(t, "heal|mob"), fightsMob), partyHpMob), "HP: healing a boss fight, share": div(div(get(t, "heal|boss"), fightsBoss), partyHpBoss),
    "HP: shield soaked, share of damage": div(cls.reduce((a, k) => a + get(t, `cls|${k}|soaked`), 0), cls.reduce((a, k) => a + get(t, `cls|${k}|taken`) + get(t, `cls|${k}|soaked`), 0)),
    "HP: knockouts a regular fight": div(get(t, "ko|mob"), fightsMob), "HP: knockouts a boss fight": div(get(t, "ko|boss"), fightsBoss),
    "HP: knockouts by basic attacks, abilities, statuses": div(get(t, "koBy|basic"), get(t, "koBy|basic") + get(t, "koBy|ability") + get(t, "koBy|status")),
    "HP: knockouts by abilities": div(get(t, "koBy|ability"), get(t, "koBy|basic") + get(t, "koBy|ability") + get(t, "koBy|status")),
    "MP: spent a fight (party)": div(cls.reduce((a, k) => a + get(t, `cls|${k}|mpSpent`), 0), fights), "MP: regained a fight (party)": div(cls.reduce((a, k) => a + get(t, `cls|${k}|mpGot`), 0), fights),
    "MP: starved share of time (party)": div(cls.reduce((a, k) => a + get(t, `cls|${k}|starved`), 0), cls.reduce((a, k) => a + get(t, `cls|${k}|alive`), 0)),
    "MP: casts fizzled for MP, a fight": div(cls.reduce((a, k) => a + get(t, `cls|${k}|fail|mp`), 0), fights), "casts lost for want of a target, a fight": div(cls.reduce((a, k) => a + get(t, `cls|${k}|fail|target`), 0), fights),
    "campfire: rest": get(t, "camp|rest"), "campfire: focus": get(t, "camp|focus"), "campfire: raise": get(t, "camp|raise"),
    "fights that reached the enrage": get(t, "enrage|mob") + get(t, "enrage|boss"),
    "losses in regular fights": get(t, "lost|mob"), "losses in boss fights": get(t, "lost|boss"),
    "party damage a regular fight": div(get(t, "partyDmg|mob"), fightsMob), "party damage a boss fight": div(get(t, "partyDmg|boss"), fightsBoss),
    "runs won: the sensible kits": div(get(t, "kind|kit|won"), get(t, "kind|kit|runs")), "runs won: the gear rotation (any piece a class can wear)": div(get(t, "kind|spread|won"), get(t, "kind|spread|runs")),
  };
  const events: Record<string, number> = {};
  for (const k of Object.keys(t).filter((x) => x.startsWith("ev|")).sort()) events[k.slice(3)] = div(t[k], fights);
  // Every stat a unit carries, with what it did.
  const sumCls = (m: string) => cls.reduce((a, k) => a + get(t, `cls|${k}|${m}`), 0);
  const sumEn = (m: string) => ens.reduce((a, e) => a + get(t, `en|${e.id}|${m}`), 0);
  const elements = c.pack.elements.map((e) => e.id);
  const magTaken = (side: "cls" | "en") => elements.reduce((a, el) => a + (side === "cls" ? sumCls(`taken|${el}`) : sumEn(`taken|${el}`)), 0);
  const magRaw = (side: "cls" | "en") => elements.reduce((a, el) => a + (side === "cls" ? sumCls(`takenRaw|${el}`) : sumEn(`takenRaw|${el}`)), 0);
  const stats = {
    "HP: party HP lost a fight, share of max": div(sumCls("taken") - sumCls("soaked"), get(t, "partyHp|mob") + get(t, "partyHp|boss")),
    "MP: spent a fight as a share of the party's pools": div(sumCls("mpSpent"), fights * 3 * mean(cls.map((k) => c.classes.get(k)!.stats.max_mp))),
    "MP regen: regained as a share of spent": div(sumCls("mpGot"), sumCls("mpSpent")),
    "Attack / Magic: physical share of the party's damage": div(sumCls("dmgk|physical"), sumCls("dmg")), "Attack / Magic: magical share of the party's damage": div(sumCls("dmgk|magical"), sumCls("dmg")), "untyped (statuses, Thorns) share of the party's damage": div(sumCls("dmgk|untyped"), sumCls("dmg")),
    "Armor: share of physical damage the party's Armor took off": 1 - div(sumCls("taken|physical"), sumCls("takenRaw|physical")), "Armor: share of physical damage the foes' Armor took off": 1 - div(sumEn("taken|physical"), sumEn("takenRaw|physical")),
    "Resistances: share of magical damage the party's resistances took off": 1 - div(magTaken("cls"), magRaw("cls")), "Resistances: share the foes' resistances took off": 1 - div(magTaken("en"), magRaw("en")),
    "Crit chance: share of the party's hits that crit": div(sumCls("crit"), sumCls("hits")), "Crit damage: crits' share of the party's damage": div(sumCls("critDmg"), sumCls("dmg")),
    "Evasion: share of hits on the party dodged": div(sumCls("dodged"), sumCls("hitsTaken")), "Evasion: share of the party's hits dodged by foes": div(sumEn("dodged"), sumEn("hitsTaken")),
    "Accuracy: the Ranger's and Hawk's eye wearers' miss rate": div(get(t, "cls|ranger|miss"), get(t, "cls|ranger|hits") + get(t, "cls|ranger|miss")),
    "Aggro: hits taken by the walls, share of hits on the party": div(["knight", "bramble_knight", "hoplite", "paladin"].reduce((a, k) => a + get(t, `cls|${k}|hitsTaken`), 0), sumCls("hitsTaken")),
    "Double strike: extra strikes per basic attack (Monk)": div(get(t, "cls|monk|extra"), get(t, "cls|monk|act|basic")),
    "Thorns: share of the party's damage": div(get(t, "st|thorns|dmg"), sumCls("dmg")), "Lifesteal: share of the party's healing": div(cls.reduce((a, k) => a + get(t, `cls|${k}|heal|lifesteal`), 0), sumCls("healGiven")),
    "Siphon: MP the Hexer regains a fight, against the Frostweaver (both Magic 4, MP regen 3)": div(div(get(t, "cls|hexer|mpGot"), get(t, "cls|hexer|fights|mob") + get(t, "cls|hexer|fights|boss")), div(get(t, "cls|frostweaver|mpGot"), get(t, "cls|frostweaver|fights|mob") + get(t, "cls|frostweaver|fights|boss"))),
    "Attack speed, cooldowns, cast time (Haste/Slow/Chill): Haste uptime a fight (ticks)": div(get(t, "st|haste|uptime|party"), fights), "Slow uptime on the party a fight (ticks)": div(get(t, "st|slow|uptime|party"), fights), "Chill uptime on foes a fight (ticks)": div(get(t, "st|chill|uptime|enemy"), fights),
    "Taunting: hits drawn onto a taunting unit a fight": div(get(t, "st|taunt|tauntHits"), fights), "Hidden: uptime a fight (ticks)": div(get(t, "st|hidden|uptime|party"), fights),
    "Healing received (Rot): Rot uptime on foes a fight": div(get(t, "st|rot|uptime|enemy"), fights),
    "Power (a knob's damage): foes' damage a fight to the party, share of party HP": div(sumCls("taken"), get(t, "partyHp|mob") + get(t, "partyHp|boss")),
  };
  const context = { fights, runs, won, unitHp };
  return { classes, abilities, enemyAbilities, statuses, enemies, gear, formations, resources, events, stats, flags, context };
}

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
  const pieces = [...c.pack.gear, ...rogue(c).gear.filter((g) => !c.pack.gear.some((x) => x.id === g.id))];
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
  out.push(`# Balance sheet\n\n${info}\n\nEvery group of numbers is ${sets.join(" / ")}: the campaign's twenty runs at their knobs; the rogue's fights at their calibrated knobs (heat 0); free play, the seven runs at the documents' numbers with no knob. Flags are judged on the pooled numbers, except where a band names a set (the enemies in free play, MP in the campaign's runs, gear and formations in their probes).\n`);
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
  out.push(table(["Enemy", "rank", "appearances", "life (t) ×rank", "killed before acting", "dmg /appearance ×rank", "dmg /tick", "KOs /fight", "basics · casts /appearance", "signature /fight", "mitigated", "dodge", "taken: phys / untyped", "killed", "survived (party lost)", "interrupted · held /fight"],
    c.pack.enemies.filter((e) => pooled.enemies[e.id].n).map((e) => { const g = (s: Sheet) => s.enemies[e.id]; return [e.name, e.rank, both((s) => g(s).n, r1), `${both((s) => g(s).life, r1)} (${both((s) => g(s).lifeIdx, r2)})`, both((s) => g(s).acted0, pc), `${both((s) => g(s).dmg, r1)} (${both((s) => g(s).dmgIdx, r2)})`, both((s) => g(s).dmgPerTick, r1), both((s) => g(s).kos, r2), `${both((s) => g(s).basics, r1)} · ${both((s) => g(s).casts, r1)}`, both((s) => g(s).signature, r2), both((s) => g(s).mitigated, pc), both((s) => g(s).dodge, pc), `${both((s) => g(s).takenPhys, pc)} / ${both((s) => g(s).takenUntyped, pc)}`, both((s) => g(s).killed, pc), both((s) => g(s).survived, pc), `${both((s) => g(s).interrupted, r2)} · ${both((s) => g(s).held, r2)}`]; })));

  out.push(`\n## 6. Gear\n`);
  registerGear(c);
  const pieces = [...c.pack.gear, ...rogue(c).gear.filter((g) => !c.pack.gear.some((x) => x.id === g.id))];
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

// ─── Main ───────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const opt = (name: string) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };

async function main() {
  const sets = (opt("--sets") ?? "campaign,rogue,free").split(",") as SetId[];
  const probesOn = opt("--probes") !== "off";
  const patches = args.flatMap((a, i) => (a === "--set" ? [args[i + 1]] : [])).map((x) => ({ path: x.slice(0, x.indexOf("=")), set: JSON.parse(x.slice(x.indexOf("=") + 1)) }));
  const raw = patch(JSON.parse(readFileSync(opt("--pack") ?? "content/core-set.pack.json", "utf8")), patches);
  const c = loadContent(raw);
  const trios = Number(opt("--trios") ?? 48);
  const seeds = Array.from({ length: Number(opt("--seeds") ?? 1) }, (_, i) => 31 + i);
  const outDir = opt("--out") ?? "out/balance";
  const t0 = Date.now();
  const fights = fightSets(c, sets);
  const { parties: spread, trios: picked } = partySpread(c, trios);
  const pool = new Pool(raw, Number(opt("--workers") ?? availableParallelism()), sets);
  const tallies: Record<string, Tally> = {};
  const jobs: Promise<void>[] = [];
  let n = 0;
  const run = (set: string, job: Omit<Job, "set" | "seeds">, sd = seeds) => {
    const t = (tallies[set] ??= {});
    n += sd.length;
    jobs.push(pool.run({ set, seeds: sd, ...job }).then((o) => { for (const k in o) add(t, k, o[k]); }));
  };
  for (const f of fights) spread.forEach((p, i) => run(f.set, { dungeon: f.dungeon, party: f.set === "rogue" && p.kind === "spread" ? withLegendaries(c, p.party, i) : p.party, kind: p.kind }));
  let probeRuns = 0;
  if (probesOn) {
    const owned = everything(c);
    const probeFights = fights.filter((f) => f.probe);
    const probeSeeds = [seeds[0]];
    for (const { formation, party } of formationProbe(c, picked, owned)) for (const f of probeFights) { run(`probe:form:${formation}`, { dungeon: f.dungeon, party, kind: "probe" }, probeSeeds); probeRuns++; }
    for (const k of c.pack.classes) for (const { piece, party } of gearProbe(c, k.id, picked, owned)) for (const f of probeFights) { run(`probe:gear:${k.id}:${piece}`, { dungeon: f.dungeon, party, kind: "probe" }, probeSeeds); probeRuns++; }
  }
  await Promise.all(jobs);
  pool.close();
  const main: Record<string, Tally> = Object.fromEntries(Object.entries(tallies).filter(([k]) => !k.startsWith("probe:")));
  const pooled: Tally = {};
  for (const t of Object.values(main)) for (const k in t) add(pooled, k, t[k]);
  const sheets = Object.fromEntries(Object.entries(main).map(([s, t]) => [s, compute(c, t, s)]));
  const all = compute(c, pooled, "pooled");
  const probes = computeProbes(c, tallies);
  const secs = ((Date.now() - t0) / 1000).toFixed(0);
  const info = `${spread.length} parties (${trios} trios, each as a gear rotation and as a sensible kit) × ${fights.filter((f) => f.set === "campaign").length} campaign runs, ${fights.filter((f) => f.set === "free").length} free-play runs and ${fights.filter((f) => f.set === "rogue").length} rogue fights × ${seeds.length} seed${seeds.length > 1 ? "s" : ""}, plus ${probeRuns} probe runs (every piece on every class that can wear it, and every formation, on the same parties): ${n} runs, ${all.context.fights} fights in the main sets, in ${secs} s. Content ${c.pack.id}#${c.fingerprint}.`;
  mkdirSync(outDir, { recursive: true });
  const md = writeSheet(c, sheets, all, probes, info);
  writeFileSync(`${outDir}/sheet.md`, md + "\n");
  writeFileSync(`${outDir}/sheet.json`, JSON.stringify({ info, sets: sheets, pooled: all, probes: { gear: probes.gear, formations: probes.formations } }, null, 1));
  const ranked = allFlags(sheets, all, probes);
  console.log(info);
  console.log(`\n${ranked.length} flags, worst first:`);
  for (const f of ranked) console.log(`  ${f.kind.padEnd(10)} ${f.name.padEnd(30)} ${f.text}  [${f.band} ${r2(f.value)}; band ${r2(BANDS[f.band].lo)}–${Number.isFinite(BANDS[f.band].hi) ? r2(BANDS[f.band].hi) : "∞"}]`);
  console.log(`\nWritten to ${outDir}/sheet.md and sheet.json.`);
}

if (!isMainThread) {
  const { raw, sets } = workerData as { raw: unknown; sets: SetId[] };
  const c = loadContent(raw);
  fightSets(c, sets);
  parentPort!.on("message", (job: Job) => parentPort!.postMessage(runJob(c, job)));
} else if (/balance(\.mjs|\.ts)$/.test(process.argv[1] ?? "")) await main();
