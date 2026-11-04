/** What the balance sheet plays: the fight sets (free play's runs, the rogue's fights at their knobs) and the parties: the spread, and the probes' parties. */
import type { Content } from "../../src/engine/run.js";
import type { DungeonT, GearT, Party } from "../../src/schema.js";
import { foesFor, knobFor, refFloors, registerGear, rogue, type RogueRun } from "../../src/rogue.js";
import { combos, makeBuild, ORDERS, seat, slotted, STYLES } from "../../src/sim/kits.js";
import { next, rngFor } from "../../src/engine/rng.js";
import { canEquip } from "../../src/validate.js";

/** The rogue has no pieces of its own (its stock is the pack's pieces, in pack.gear), so its legendary probes are empty. */
export const rogueGear = (_c: Content): GearT[] => [];

export const T = 1000; // sub-ticks a tick
export type Tally = Record<string, number>;
export const add = (t: Tally, k: string, v = 1) => { t[k] = (t[k] ?? 0) + v; };
export const get = (t: Tally, k: string) => t[k] ?? 0;

export type SetId = "rogue" | "free";
/** One thing to play: a dungeon (a free-play run at the documents' numbers, or a rogue fight as a one-stage dungeon). */
type Fight = { set: SetId; id: string; name: string; dungeon: string; kind: "run" | "fight"; probe: boolean };
export type Job = { set: string; dungeon: string; party: Party; kind: "spread" | "kit" | "probe"; seeds: number[] };

// ─── The fights ─────────────────────────────────────────────────────────────

/**
 * The seven free-play runs at the documents' numbers (no knob: the enemies as designed); and every rogue fight at its
 * calibrated knob (heat 0, its pool's reference floor). `probe` marks the shorter list the gear and formation probes play:
 * the free runs and the rogue bosses.
 */
export function fightSets(c: Content, sets: SetId[]): Fight[] {
  const out: Fight[] = [];
  if (sets.includes("free")) for (const id of c.pack.progression.dungeonOrder) out.push({ set: "free", id, name: c.dungeons.get(id)!.name, dungeon: id, kind: "run", probe: true });
  if (sets.includes("rogue")) {
    registerGear(c);
    for (const reg of rogue(c).regions) {
      const tiers = [["easy", "fight"], ["normal", "fight"], ["elite", "elite"], ["bosses", "boss"]] as const;
      for (const [pool, tier] of tiers) for (const f of reg[pool]) {
        const fake = { act: reg.act, region: reg.id, heat: 0 } as unknown as RogueRun;
        const ref = refFloors(c);
        const floor = tier === "boss" ? rogue(c).config.map.floors + 1 : pool === "easy" ? ref.easy : pool === "normal" ? ref.normal : ref.elite;
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
 * of them), seated by the kit weights, and twice: once wearing a rotation of every piece its class can wear (so what nobody
 * picks is still measured), once in a sensible kit (src/sim/kits.ts). Ability order alternates between the documents'
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
    const kit = makeBuild(c, trio, formation, STYLES[i % STYLES.length], undefined, ORDERS[(i + 1) % ORDERS.length]);
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
export function gearProbe(c: Content, cls: string, trios: string[][], refs = 4): { piece: string; party: Party }[] {
  registerGear(c);
  const plain = c.pack.gear.find((g) => g.slot === "weapon" && g.source === "starter" && g.weapon?.kind === c.classes.get(cls)!.weapons[0])!.id;
  const mine = trios.filter((t) => t.includes(cls)).slice(0, refs);
  const f = c.formations.get("neutral")!;
  const pieces = ["none", ...["weapon", "armor", "amulet"].flatMap((slot) => wearable(c, cls, slot)), ...rogueGear(c).filter((g) => canEquip(c.classes.get(cls)!, g)).map((g) => g.id)];
  const out: { piece: string; party: Party }[] = [];
  for (const piece of pieces) for (const trio of mine) {
    const kit = makeBuild(c, trio, "neutral", "plain");
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
export function formationProbe(c: Content, trios: string[][], n = 40): { formation: string; party: Party }[] {
  const out: { formation: string; party: Party }[] = [];
  for (const trio of trios.slice(0, n)) for (const f of c.pack.formations) {
    const kit = makeBuild(c, trio, f.id, "plain");
    if (kit) out.push({ formation: f.id, party: kit });
  }
  return out;
}

/** The rogue set's spread also wears the rogue mode's own legendary pieces, one per member, each coming round in turn. */
const legTurn = new Map<string, number>();
export function withLegendaries(c: Content, p: Party, _i: number): Party {
  registerGear(c);
  const legs = rogueGear(c);
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
