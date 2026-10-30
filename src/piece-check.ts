/**
 * The piece check (step 5i, step 5, wave 3: steps/05-core-set/5i-synergy/build/plan.md): does every item do what its card
 * says? Each gear piece, mythic, formation and upgrade form is fielded on a party of three that can carry it, and plays a
 * fixed set of the rogue's own fights at their knobs on fixed seeds, logged, beside the same party without it (the control).
 *
 * Fielding. Everyone knows its class's three abilities, in the class's order, with cooldowns 60% charged (as a run carries
 * them), full HP and MP, a plain weapon and nothing else, in Neutral. The carrier is the class a build party wears the piece
 * on (src/build-parties.ts), else the first class that can wear it; its companions are that build party's, else two of the
 * Knight, the Cleric and the Ranger. A piece goes in its slot (a weapon's control is the plain weapon of its kind; an
 * offhand's carrier holds a one-handed plain weapon); a formation seats a build party that uses it, else the three
 * starters, against Neutral; an ability form takes its ability's place, a passive form is `PartyUnit.passive`.
 *
 * Read from the logs, per item:
 * - crashes (the error) and loops: the engine's safety stop or its event-depth guard, more often than in the control;
 * - its own statuses (what it grants, what its stats bring, what those apply, transitively) firing. Every status's hooks
 *   (reactions, triggers, pulses) carry a probe that logs each time they run (see `probe`); besides, a status gained in the
 *   fight, its damage, heal or MP, a strike, a shield soaking or breaking, a block, a cover, an immunity or a resist. A status
 *   the control shows too counts only for what the item adds past the control's count, or past its amounts; rider hits too;
 * - an ability form's casts, and what each dealt, healed and applied (applications, not stacks), against the base ability's;
 * - the party's damage dealt and the share of its max HP lost (over the ticks both fights lasted), healing, length and wins.
 *
 * Problems, listed first: a crash; a loop; never fires (a status it grants never shows, a form never cast or cast to no
 * effect, or hooks that should leave a trace and leave none); no effect (every fight identical to the control); the wrong
 * way (a card that reads all on the party's side, with no costs, trades or redirection in its words, but the party deals less
 * or loses more HP past the seeds' noise, 2.5 standard errors and 5%, and does better on nothing: dealt, taken, healing,
 * wins; of the upgrade forms only power steps are read so, a version being a trade against its base); a power step weaker
 * than its base per cast; untested (a form, or a passive form's hooks, whose base never fired in these fights either).
 *
 *   npx tsx src/piece-check.ts [--only <ids or a share>] [--seeds 3] [--quick] [--workers 4] [--out out/piece-check] [--show]
 *
 * --only takes a share (physical, magical, armor, offhands, formations, upgrades1, upgrades2) or ids: a piece, a mythic, a
 * formation, an upgrade (its five forms) or one form, comma-separated. --quick: one seed, and one regular fight, the elite
 * and the boss of each act. --show prints each item's fielded party and control as JSON, and plays nothing. Output:
 * out/piece-check/report.md and report.json. Child processes do the playing (worker threads don't get tsx's loader).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { availableParallelism } from "node:os";
import { fork, type ChildProcess } from "node:child_process";
import { combat, type Member as EngineMember } from "./engine/combat/rules.js";
import type { Entry } from "./engine/log.js";
import { ENGINE_VERSION, advance, loadContent, newRun, type Content } from "./engine/run.js";
import { fightDungeon, foesFor, knobFor, refFloors, rogue, type FightTier, type RogueRun } from "./rogue.js";
import { SUBTICKS, type EffectT, type FormationT, type GearT, type Party, type PartyUnitT, type RogueFightT, type StatusT, type UpgradeT } from "./schema.js";
import { canEquip, checkParty, handsOf } from "./validate.js";
import { BUILD_PARTIES } from "./build-parties.js";
import * as physical from "../content/core-set/pieces/weapons-physical.js";
import * as magical from "../content/core-set/pieces/weapons-magical.js";
import * as armor from "../content/core-set/pieces/armor-amulets.js";
import * as offhands from "../content/core-set/pieces/offhands.js";
import * as part1 from "../content/core-set/upgrades/part1.js";
import * as part2 from "../content/core-set/upgrades/part2.js";

const PACK = "content/core-set.pack.json";

// ─── The fights ─────────────────────────────────────────────────────────────

/** Two regular fights, an elite and a boss from each act: swarms, people, casters, summoners, armor, single bosses. */
const FIGHTS: { act: number; region: string; pool: "normal" | "elite" | "bosses"; id: string }[] = [
  { act: 1, region: "old_road", pool: "normal", id: "bandit_camp" },
  { act: 1, region: "old_road", pool: "normal", id: "wolf_pack" },
  { act: 1, region: "old_road", pool: "elite", id: "war_camp" },
  { act: 1, region: "old_road", pool: "bosses", id: "ogre_chief" },
  { act: 2, region: "crypt", pool: "normal", id: "dark_hall" },
  { act: 2, region: "fire_mine", pool: "normal", id: "imp_kennel" },
  { act: 2, region: "ice_pass", pool: "elite", id: "frost_trolls" },
  { act: 2, region: "fire_mine", pool: "bosses", id: "fire_giant" },
  { act: 3, region: "deep_crypt", pool: "normal", id: "coven" },
  { act: 3, region: "storm_tower", pool: "normal", id: "storm_front" },
  { act: 3, region: "deep_crypt", pool: "elite", id: "lich_court" },
  { act: 3, region: "tower_top", pool: "bosses", id: "storm_king" },
];
/** --quick: one regular fight, the elite and the boss of each act. */
const QUICK = [0, 2, 3, 4, 6, 7, 8, 10, 11];

type Fight = { id: string; act: number; tier: FightTier; knob: number; dungeon: string };

/** Each fight as the rogue sets it (its knob at its pool's reference floor, heat 0), registered as its own one-stage dungeon. */
function fightSet(c: Content, quick: boolean): Fight[] {
  const R = rogue(c), ref = refFloors(c);
  return (quick ? QUICK.map((i) => FIGHTS[i]) : FIGHTS).map((f, i) => {
    const fight = (R.regions.find((r) => r.id === f.region)?.[f.pool] as RogueFightT[] | undefined)?.find((x) => x.id === f.id);
    if (!fight) throw new Error(`piece-check: no fight ${f.region}/${f.pool}/${f.id} in the pack`);
    const tier: FightTier = f.pool === "bosses" ? "boss" : f.pool === "elite" ? "elite" : "fight";
    const floor = tier === "boss" ? R.config.map.floors + 1 : tier === "elite" ? ref.elite : ref.normal;
    const knob = knobFor(c, { act: f.act, region: f.region, heat: 0 } as RogueRun, tier, floor, fight);
    const d = { ...fightDungeon(c, { node: "check", tier, fight, foes: foesFor(c, tier, knob), seed: 0 }), id: `piece_check_${i}` };
    c.dungeons.set(d.id, d);
    return { id: f.id, act: f.act, tier, knob, dungeon: d.id };
  });
}

// ─── One fight, read ────────────────────────────────────────────────────────

/**
 * A log probe: every reaction, trigger and pulse that does something gets one more effect at the end of its list, an MP change
 * of 0 on every living unit of its actor's side (on all of them, not on itself, so a hook that runs as its holder falls still
 * shows). It changes nothing in the fight, rolls no dice, fires no event, and logs hidden `mp` entries naming the status, one
 * after another, so each time a status's hook runs (its tests passed and its effects ran, whatever they are) the log says so.
 */
function probe(c: Content) {
  const tag = (es: EffectT[]): EffectT[] => [...es, { op: "mp", amount: 0, to: { side: "allies", pick: "all" } }];
  for (const [id, d] of c.statuses) {
    if (!d.reactions?.length && !d.trigger?.do && !d.pulse?.do) continue;
    c.statuses.set(id, {
      ...d,
      ...(d.reactions ? { reactions: d.reactions.map((r) => ({ ...r, do: tag(r.do) })) } : {}),
      ...(d.trigger?.do ? { trigger: { ...d.trigger, do: tag(d.trigger.do) } } : {}),
      ...(d.pulse?.do ? { pulse: { ...d.pulse, do: tag(d.pulse.do) } } : {}),
    });
  }
}

const B = 5; // ticks a bucket of the damage curves
/**
 * One fight's log, boiled down. Per status: `fired`, the times one of its hooks ran (the probe); `ev`, its other traces past
 * its start grant; `amt`, the damage, healing and MP its hooks moved; `g0`, its start grants.
 */
type Sum = {
  err?: string;
  won: number;
  T: number;
  /** Damage dealt to foes and taken by the party, by bucket of B ticks. */
  dealt: number[];
  taken: number[];
  healed: number;
  /** The party's max HP, summed at the start (and over any party unit that joins). */
  pmax: number;
  stop: number;
  deep: number;
  hash: number;
  n: number;
  fired: Record<string, number>;
  ev: Record<string, number>;
  amt: Record<string, number>;
  g0: Record<string, number>;
  /** Each party ability used: [casts, dealt, healed, applied, MP moved]. */
  acts: Record<string, number[]>;
  /** Rider hits by party unit id. */
  riders: Record<string, number>;
};

const bump = (m: Record<string, number>, k: string, n = 1) => void (m[k] = (m[k] ?? 0) + n);
const addAt = (xs: number[], i: number, v: number) => { while (xs.length <= i) xs.push(0); xs[i] += v; };

function summarize(c: Content, log: Entry[]): Sum {
  const s: Sum = { won: 0, T: 0, dealt: [], taken: [], healed: 0, pmax: 0, stop: 0, deep: 0, hash: 0, n: 0, fired: {}, ev: {}, amt: {}, g0: {}, acts: {}, riders: {} };
  const side = new Map<string, string>(), hp = new Map<string, number>(), holding = new Map<string, Set<string>>();
  const meet = (u: { id: string; side: string; hp: number; max: number }) => { side.set(u.id, u.side); hp.set(u.id, u.hp); if (u.side === "party") s.pmax += u.max; };
  const isStatus = (id: string) => c.statuses.has(id) && !c.abilities.has(id);
  let cur: { at: number; v: number[] } | null = null;
  // One probe group (the same status's zero-MP entries in a row) is one run of its hook.
  let group = "";
  let h = 2166136261;
  const mix = (x: unknown) => { const t = String(x); for (let i = 0; i < t.length; i++) h = Math.imul(h ^ t.charCodeAt(i), 16777619); };
  for (const e of log) {
    const at = Number(e.at ?? 0);
    if (cur && at !== cur.at) cur = null;
    const probed = e.t === "mp" && Number(e.amount) === 0 && e.src !== undefined && isStatus(String(e.src));
    if (!probed) group = "";
    switch (e.t) {
      case "fight_start":
        for (const u of e.units as { id: string; side: string; hp: number; max: number }[]) meet(u);
        break;
      case "join":
        meet(e.unit as { id: string; side: string; hp: number; max: number });
        break;
      case "act":
        cur = null;
        if (side.get(String(e.by)) === "party" && e.act !== "basic") {
          const v = (s.acts[String(e.act)] ??= [0, 0, 0, 0, 0]);
          v[0]++;
          cur = { at, v };
        }
        break;
      case "cast":
      case "fail":
        cur = null;
        break;
      case "dmg": {
        // What the unit lost: a shield's soak and a block are not damage dealt or taken.
        const tgt = String(e.target), before = hp.get(tgt) ?? 0;
        hp.set(tgt, Number(e.hp));
        const real = Math.max(0, before - Number(e.hp));
        const b = Math.floor(at / SUBTICKS / B);
        if (side.get(tgt) === "enemy") { addAt(s.dealt, b, real); if (cur) cur.v[1] += real; } else addAt(s.taken, b, real);
        if (isStatus(String(e.src))) { bump(s.ev, String(e.src)); bump(s.amt, String(e.src), Number(e.amount) || 0); }
        if (e.part === "rider" && side.get(String(e.by)) === "party") bump(s.riders, String(e.by));
        const soaked = Number(e.soaked) > 0, aegis = e.word === "AEGIS";
        if (soaked || aegis) for (const id of holding.get(tgt) ?? []) { const d = c.statuses.get(id); if ((soaked && d?.absorb) || (aegis && d?.block)) bump(s.ev, id); }
        break;
      }
      case "heal":
        hp.set(String(e.target), Number(e.hp));
        if (side.get(String(e.target)) === "party") s.healed += Number(e.amount) || 0;
        if (cur) cur.v[2] += Number(e.amount) || 0;
        if (isStatus(String(e.src))) { bump(s.ev, String(e.src)); bump(s.amt, String(e.src), Number(e.amount) || 0); }
        break;
      case "mp":
        if (probed) {
          if (group !== String(e.src)) bump(s.fired, String(e.src));
          group = String(e.src);
        } else if (e.src !== undefined && isStatus(String(e.src))) { bump(s.ev, String(e.src)); bump(s.amt, String(e.src), Math.abs(Number(e.amount))); }
        if (cur) cur.v[4] += Math.abs(Number(e.amount) || 0);
        break;
      case "status": {
        const u = String(e.unit), id = String(e.status);
        if (!holding.has(u)) holding.set(u, new Set());
        holding.get(u)!.add(id);
        if (at === 0 && e.by === u) bump(s.g0, id);
        else bump(s.ev, id);
        if (cur) cur.v[3]++;
        break;
      }
      case "status_end":
        holding.get(String(e.unit))?.delete(String(e.status));
        if (e.cause === "spent" || e.cause === "stacks") bump(s.ev, String(e.status));
        break;
      case "strike":
      case "immune":
      case "resisted":
        bump(s.ev, String(e.status));
        break;
      case "cover":
        for (const id of holding.get(String(e.by)) ?? []) if (c.statuses.get(id)?.cover) bump(s.ev, id);
        break;
      case "revive":
        hp.set(String(e.unit), Number(e.hp));
        if (cur) cur.v[3]++;
        break;
      case "stop":
        if (String(e.why).startsWith("event chain")) s.deep++;
        else s.stop++;
        break;
      case "fight_end":
        s.T = Number(e.rounds) || 0;
        s.won = e.result === "won" ? 1 : 0;
        break;
    }
    if (e.vis === "player") { mix(e.t); mix(e.target ?? e.unit ?? e.by ?? ""); mix(e.amount ?? e.status ?? e.act ?? ""); s.n++; }
  }
  s.hash = h >>> 0;
  return s;
}

function playArm(c: Content, fights: Fight[], seeds: number[], party: Party): Sum[] {
  const out: Sum[] = [];
  fights.forEach((f, fi) => {
    for (const sd of seeds) {
      try {
        const er = newRun(c, combat, { dungeon: f.dungeon, party, seed: 7000 + 101 * fi + sd }, { checked: true, log: true });
        for (const em of er.party as EngineMember[]) em.cooldowns = Object.fromEntries(em.abilities.map((a) => [a, 0.4 * (c.abilities.get(a)?.cooldown ?? 0)]));
        advance(c, combat, er);
        out.push(summarize(c, er.log!));
      } catch (e) {
        const err = e instanceof Error ? `${e.message} @ ${(e.stack ?? "").split("\n").slice(1, 3).map((l) => l.trim()).join(" < ")}` : String(e);
        out.push({ err, won: 0, T: 0, dealt: [], taken: [], healed: 0, pmax: 0, stop: 0, deep: 0, hash: 0, n: 0, fired: {}, ev: {}, amt: {}, g0: {}, acts: {}, riders: {} });
      }
    }
  });
  return out;
}

// ─── The items ──────────────────────────────────────────────────────────────

const SHARES = {
  physical: "Physical weapons",
  magical: "Magical weapons",
  armor: "Armor and amulets",
  offhands: "Offhands",
  formations: "Formations",
  upgrades1: "Upgrades, part 1 (and mythics)",
  upgrades2: "Upgrades, part 2 (and mythics)",
} as const;
type Share = keyof typeof SHARES;
const FORMS = ["p", "a", "b", "ap", "bp"] as const;

type Item = {
  id: string;
  name: string;
  share: Share;
  what: "piece" | "mythic" | "formation" | "ability form" | "passive form";
  rarity: string;
  /** The card, as the player reads it (for a form: its upgrade's power step and version). */
  text: string;
  /** For a form: the ability or passive status it stands in for. */
  base?: string;
  form?: (typeof FORMS)[number];
  party: Party;
  control: Party;
  carrier: string;
  /** Engine unit ids that carry it: one, or the whole party for a formation. */
  carriers: string[];
  /** Statuses it gives at the fight's start (its own, and what its stats bring). */
  grants: string[];
  /** Every status it can put in play, transitively. */
  closure: string[];
  /** What should leave a trace: loud hooks log something when they work; silent ones (cooldowns, recasts, floors...) don't. */
  expect: "loud" | "silent" | "none";
  riders: boolean;
  partySide: boolean;
  issues: string[];
};

/** The statuses something can put in play: `statuses` lists and `status` fields that apply (not conditions, events or removals). */
function refs(x: unknown, out: Set<string>) {
  if (Array.isArray(x)) for (const y of x) refs(y, out);
  else if (x && typeof x === "object") {
    const o = x as Record<string, unknown>;
    if (typeof o.status === "string" && !("event" in o) && !("atLeast" in o) && o.op !== "remove") out.add(o.status);
    for (const [k, v] of Object.entries(o)) {
      if (k === "statuses" && Array.isArray(v)) v.forEach((s) => typeof s === "string" && out.add(s));
      else refs(v, out);
    }
  }
}
/** A stat change, read loosely: a status's may be a scaled number, which counts as positive. */
type Change = { stat?: string; flat?: unknown; pct?: unknown };
const sign = (x: unknown) => (typeof x === "number" ? Math.sign(x) : x === undefined ? 0 : 1);
const brought = (c: Content, stats: Change[] | undefined) =>
  (stats ?? []).filter((s) => sign(s.flat) > 0 || sign(s.pct) > 0).flatMap((s) => c.stats.get(s.stat ?? "")?.brings ?? []);
function closureOf(c: Content, roots: unknown[], grants: string[]): string[] {
  const set = new Set<string>(grants);
  for (const r of roots) refs(r, set);
  const todo = [...set];
  while (todo.length) {
    const d = c.statuses.get(todo.pop()!);
    if (!d) continue;
    const more = new Set<string>(brought(c, d.stats));
    refs({ ...d, id: undefined }, more);
    for (const m of more) if (!set.has(m)) { set.add(m); todo.push(m); }
  }
  return [...set].filter((id) => c.statuses.has(id));
}

/**
 * Whether a status's working leaves a trace in the log: its hooks (the probe), its strikes, shields and blocks, its riders, or
 * its being applied in the fight. A cover leaves a trace too; a floor or a rule for its revives works unseen; stats, boosts and the like are static.
 */
function statusExpect(d: StatusT, applied: boolean): "loud" | "silent" | "none" {
  if (applied || d.reactions?.length || d.trigger?.do || d.pulse?.do || d.strike || d.absorb || d.block || d.riders || d.cover) return "loud";
  if (d.floor || d.revives) return "silent";
  return "none";
}

const COST = /\bno\b|\btaunts?\b|\baggro\b|\bdraws?\b|−|(^|[\s(])-\d|\bless\b|\blos(e|es|t)\b|\bpays?\b|\bcosts?\b|\bslower\b|\bcan(not|'t|’t)\b|\bonly\b|\binstead\b|\bfewer\b|\bno longer\b|\bnever\b|\bbut\b|\bdown\b|\bgives? up\b|\bdrains?\b|\bsacrific|\bharms?\b|\bhurts?\b|\bweaker\b|\btakes? more\b|\bspends?\b|\bwithout\b/i;
/** A card that reads all on the party's side: no cost in its words, no stat it gives up, no HP paid, no buff that hurts its holder. */
function readsPartySide(c: Content, text: string, roots: unknown[], grants: string[]): boolean {
  const words = text.replace(/\btakes? less\b/gi, "");
  if (COST.test(words)) return false;
  const json = JSON.stringify(roots);
  if (/"op":"pay"/.test(json)) return false;
  const neg = (xs: Change[] | undefined) => (xs ?? []).some((s) => sign(s.flat) < 0 || sign(s.pct) < 0);
  for (const r of roots) {
    const o = r as { stats?: Change[]; positions?: { stats?: Change[] }[] };
    if (neg(o.stats) || (o.positions ?? []).some((p) => neg(p.stats))) return false;
  }
  for (const id of grants) {
    const d = c.statuses.get(id);
    if (!d || d.label === "debuff") continue;
    if (neg(d.stats) || (d.taken ?? []).some((t) => typeof t.pct === "number" && t.pct > 0) || (d.boosts ?? []).some((b) => typeof b.pct === "number" && b.pct < 0)) return false;
  }
  return true;
}

/** A class's plain weapon: of a kind (when it has one), else its first kind's, one-handed when asked. */
function plainFor(c: Content, cls: string, o: { kind?: string; oneHand?: boolean } = {}): string {
  const plain = (k: string) => c.pack.gear.find((g) => g.slot === "weapon" && g.source === "starter" && g.weapon?.kind === k);
  if (o.kind && plain(o.kind)) return plain(o.kind)!.id;
  const kinds = c.classes.get(cls)!.weapons;
  return (kinds.map(plain).find((g) => g && (!o.oneHand || handsOf(c.pack, g) === 1)) ?? plain(kinds[0]))!.id;
}

const STARTERS = ["knight", "cleric", "ranger"];
const pairFor = (cls: string) => STARTERS.filter((x) => x !== cls).slice(0, 2);

function makeParty(c: Content, classes: string[], formation: string, carrier: string | null, over: (cls: string) => Partial<PartyUnitT>, weaponOf: (cls: string) => string): Party {
  const f = c.formations.get(formation)!;
  return {
    formation,
    units: classes.map((cls, i) => ({
      class: cls, position: f.positions[i].id, abilities: [...c.classes.get(cls)!.abilities], gear: { weapon: weaponOf(cls) },
      ...(carrier === null || carrier === cls ? over(cls) : {}),
    })),
  };
}

function gearItem(c: Content, g: GearT, share: Share): Item {
  const wearers = c.pack.classes.filter((k) => canEquip(k, g)).map((k) => k.id);
  const bp = BUILD_PARTIES.find((p) => p.members.some((m) => Object.values(m.gear).includes(g.id) && wearers.includes(m.cls)));
  const carrier = bp ? bp.members.find((m) => Object.values(m.gear).includes(g.id) && wearers.includes(m.cls))!.cls : wearers[0];
  const classes = bp ? bp.members.map((m) => m.cls) : carrier ? [carrier, ...pairFor(carrier)] : STARTERS;
  const slot = g.slot;
  const kind = g.weapon?.kind;
  const weaponOf = (cls: string) => cls === carrier && slot === "weapon" ? plainFor(c, cls, { kind }) : plainFor(c, cls, { oneHand: cls === carrier && slot === "offhand" });
  const party = makeParty(c, classes, "neutral", carrier, (cls) => ({ gear: slot === "weapon" ? { weapon: g.id } : { weapon: weaponOf(cls), [slot]: g.id } }), weaponOf);
  const control = makeParty(c, classes, "neutral", null, () => ({}), weaponOf);
  const grants = [...(g.statuses ?? []), ...brought(c, g.stats)];
  const closure = closureOf(c, [g], grants);
  const issues = carrier ? checkParty(c.pack, party).filter((i) => i.level === "error").map((i) => i.message) : ["no class can wear it"];
  return {
    id: g.id, name: g.name, share, what: g.mythic ? "mythic" : "piece", rarity: String((g as GearT & { rarity?: string }).rarity ?? "-"), text: g.text ?? "",
    party, control, carrier: carrier ?? "-", carriers: carrier ? [`p${classes.indexOf(carrier) + 1}`] : [], grants, closure,
    expect: expectOf(c, closure, grants, !!(g.weapon?.riders || g.weapon?.apply)),
    riders: !!g.weapon?.riders || closure.some((id) => c.statuses.get(id)?.riders), partySide: readsPartySide(c, g.text ?? "", [g], grants), issues,
  };
}

function expectOf(c: Content, closure: string[], grants: string[], extra = false): Item["expect"] {
  const xs = closure.map((id) => statusExpect(c.statuses.get(id)!, !grants.includes(id)));
  return extra || xs.includes("loud") ? "loud" : xs.includes("silent") ? "silent" : "none";
}

function formationItem(c: Content, f: FormationT): Item {
  const bp = BUILD_PARTIES.find((p) => p.formation === f.id && p.version === "formation");
  const classes = bp ? bp.members.map((m) => m.cls) : STARTERS;
  const weaponOf = (cls: string) => plainFor(c, cls);
  const party = makeParty(c, classes, f.id, null, () => ({}), weaponOf);
  const control = makeParty(c, classes, "neutral", null, () => ({}), weaponOf);
  const grants = [...(f.statuses ?? []), ...brought(c, f.stats), ...f.positions.flatMap((p) => [...(p.statuses ?? []), ...brought(c, p.stats)])];
  const closure = closureOf(c, [f], grants);
  const text = [f.text, ...f.positions.map((p) => `${p.name}: ${p.text ?? ""}`)].join(" ");
  return {
    id: f.id, name: f.name, share: "formations", what: "formation", rarity: f.rarity ?? "-", text, party, control, carrier: classes.join("+"),
    carriers: ["p1", "p2", "p3"], grants, closure, expect: expectOf(c, closure, grants), riders: closure.some((id) => c.statuses.get(id)?.riders),
    partySide: readsPartySide(c, text, [f], grants), issues: checkParty(c.pack, party).filter((i) => i.level === "error").map((i) => i.message),
  };
}

function formItems(c: Content, u: UpgradeT, share: Share): Item[] {
  const bp = BUILD_PARTIES.find((p) => p.members.some((m) => m.cls === u.class && m.trained.some((t) => t.ability === u.id))) ?? BUILD_PARTIES.find((p) => p.members.some((m) => m.cls === u.class));
  const classes = bp ? bp.members.map((m) => m.cls) : [u.class, ...pairFor(u.class)];
  const weaponOf = (cls: string) => plainFor(c, cls);
  const control = makeParty(c, classes, "neutral", null, () => ({}), weaponOf);
  return FORMS.map((form): Item => {
    const id = `${u.id}__${form}`;
    const text = form === "p" ? u.power : form === "a" || form === "b" ? u[form].text : `${u[form[0] as "a" | "b"].text} ${u.power}`;
    const over = (cls: string): Partial<PartyUnitT> =>
      u.kind === "ability" ? { abilities: c.classes.get(cls)!.abilities.map((a) => (a === u.id ? id : a)) } : { passive: id };
    const party = makeParty(c, classes, "neutral", u.class, over, weaponOf);
    const root = u.kind === "ability" ? c.abilities.get(id) : c.statuses.get(id);
    const grants = u.kind === "passive" ? [id] : [];
    const closure = closureOf(c, [root], grants);
    const name = form === "p" ? `${u.id} power` : form === "a" || form === "b" ? u[form].name : `${u[form[0] as "a" | "b"].name} + power`;
    return {
      id, name, share, what: u.kind === "ability" ? "ability form" : "passive form", rarity: form, text, base: u.id, form, party, control, carrier: u.class,
      carriers: [`p${classes.indexOf(u.class) + 1}`], grants, closure, expect: u.kind === "ability" ? "loud" : expectOf(c, closure, grants),
      // A version is a trade against its base, so only the power step reads as a direction.
      riders: closure.some((x) => c.statuses.get(x)?.riders), partySide: form === "p" && readsPartySide(c, text, [root], grants),
      issues: root ? checkParty(c.pack, party).filter((i) => i.level === "error").map((i) => i.message) : [`no ${u.kind === "ability" ? "ability" : "status"} '${id}' in the pack`],
    };
  });
}

function allItems(c: Content): Item[] {
  const pieces = (share: Share, gear: GearT[]) => gear.map((g) => c.gear.get(g.id)).filter((g): g is GearT => !!g).map((g) => gearItem(c, g, share));
  return [
    ...pieces("physical", physical.gear),
    ...pieces("magical", magical.gear),
    ...pieces("armor", armor.gear),
    ...pieces("offhands", offhands.gear),
    ...c.pack.formations.filter((f) => f.id !== "neutral").map((f) => formationItem(c, f)),
    ...part1.upgrades.flatMap((u) => formItems(c, u, "upgrades1")),
    ...pieces("upgrades1", part1.mythics),
    ...part2.upgrades.flatMap((u) => formItems(c, u, "upgrades2")),
    ...pieces("upgrades2", part2.mythics),
  ];
}

// ─── Judging an item against its control ───────────────────────────────────

type Line = {
  id: string; name: string; share: Share; what: Item["what"]; rarity: string; carrier: string;
  problems: string[];
  notes: string[];
  error?: string;
  crashes: number;
  stops: [number, number];
  deep: [number, number];
  expect: Item["expect"];
  /** Traces past the control's, a fight. */
  fire: number;
  /** Each own status with any trace: [item, control], a fight. */
  statuses: Record<string, [number, number]>;
  casts?: { form: number[]; base: number[] };
  identical: boolean;
  partySide: boolean;
  dDealt: number; seDealt: number; dTaken: number; seTaken: number; dHeal: number; dLength: number; won: [number, number];
};

const sum = (xs: number[], n = xs.length) => { let t = 0; for (let i = 0; i < Math.min(n, xs.length); i++) t += xs[i]; return t; };
/** The mean paired change as a share of the control's mean, and its standard error. */
function paired(xs: number[], ys: number[]): [number, number] {
  const n = xs.length, my = sum(ys) / Math.max(1, n);
  if (n < 2 || my <= 0) return [0, 0];
  const r = xs.map((x, i) => (x - ys[i]) / my), m = sum(r) / n;
  const sd = Math.sqrt(r.reduce((a, x) => a + (x - m) ** 2, 0) / (n - 1));
  return [m, sd / Math.sqrt(n)];
}

function judge(c: Content, it: Item, I: Sum[], C: Sum[]): Line {
  const n = I.length, ok = I.map((s, k) => !s.err && !C[k].err);
  const per = (x: number) => Math.round((100 * x) / Math.max(1, n)) / 100;
  const crashes = I.filter((s) => s.err).length;
  const total = (xs: Sum[], f: (s: Sum) => number) => xs.reduce((a, s) => a + f(s), 0);
  const stops: [number, number] = [total(I, (s) => s.stop), total(C, (s) => s.stop)];
  const deep: [number, number] = [total(I, (s) => s.deep), total(C, (s) => s.deep)];
  const problems: string[] = [], notes: string[] = [];
  if (it.issues.length) problems.push("can't field");
  if (crashes) problems.push("crash");
  if (C.some((s) => s.err)) notes.push(`the control crashes too (${C.find((s) => s.err)!.err})`);
  if (deep[0] > deep[1] || stops[0] > stops[1]) problems.push("loop");

  // Its statuses' traces: hooks run, and their other traces. For a status the control shows too, only what the item adds past
  // the control's count, or (more of the same) the share of its damage, healing or MP past the control's.
  let fire = 0;
  const statuses: Record<string, [number, number]> = {};
  const past = (x: number, y: number) => x > 1.1 * y + 2;
  for (const id of it.closure) {
    const t = (xs: Sum[], m: "fired" | "ev" | "amt") => total(xs, (s) => s[m][id] ?? 0);
    const [fi, fk, ei, ek, ai, ak] = [t(I, "fired"), t(C, "fired"), t(I, "ev"), t(C, "ev"), t(I, "amt"), t(C, "amt")];
    if (fi + ei || fk + ek) statuses[id] = [per(fi + ei), per(fk + ek)];
    if (fk + ek === 0) fire += fi + ei;
    else if (past(fi, fk) || past(ei, ek)) fire += Math.max(fi - fk, ei - ek);
    else if (ai > 1.1 * ak + 1) fire += ei * (1 - ak / ai);
  }
  if (it.riders) {
    const r = (xs: Sum[]) => total(xs, (s) => it.carriers.reduce((a, u) => a + (s.riders[u] ?? 0), 0));
    const i = r(I), k = r(C);
    statuses["(rider hits)"] = [per(i), per(k)];
    if (past(i, k)) fire += i - k;
  }
  const missing = it.grants.filter((id) => total(I, (s) => (s.g0[id] ?? 0) + (s.ev[id] ?? 0) + (s.fired[id] ?? 0)) === 0);
  let casts: Line["casts"];
  const identical = I.every((s, k) => !s.err && !C[k].err && s.hash === C[k].hash && s.n === C[k].n);
  if (it.what === "ability form") {
    const tally = (xs: Sum[], id: string) => { const v = [0, 0, 0, 0, 0]; for (const s of xs) (s.acts[id] ?? []).forEach((x, j) => (v[j] += x)); return v; };
    const f = tally(I, it.id), b = tally(C, it.base!);
    const each = (v: number[]) => [per(v[0]), ...v.slice(1, 4).map((x) => Math.round(x / Math.max(1, v[0])))];
    casts = { form: each(f), base: each(b) };
    if (!crashes && f[0] === 0) {
      if (b[0]) problems.push("never fires"), notes.push("never cast");
      else problems.push("untested"), notes.push("never cast, nor the base: its moment never came in these fights");
    }
    else if (f[0] && f[1] + f[2] + f[3] + f[4] === 0 && b[1] + b[2] + b[3] + b[4] > 0) problems.push("never fires"), notes.push("cast, but deals, heals and applies nothing");
    if (it.form === "p" && f[0] >= 5 && b[0] >= 5 && f[0] < 1.1 * b[0]) {
      const [fd, fh, fa] = [f[1] / f[0], f[2] / f[0], f[3] / f[0]], [bd, bh, ba] = [b[1] / b[0], b[2] / b[0], b[3] / b[0]];
      const weak = (x: number, y: number) => y > 0 && x < 0.85 * y;
      if (weak(fd, bd) || weak(fh, bh) || (!bd && !bh && weak(fa, ba))) problems.push("weaker than its base");
    }
  } else if (!crashes && !it.issues.length) {
    if (missing.length) problems.push("never fires"), notes.push(`never given: ${missing.join(", ")}`);
    else if (it.expect === "loud" && fire === 0) {
      // A passive form whose base passive leaves no trace in the control either: its moment never came.
      const quiet = it.what === "passive form" && total(C, (s) => (s.fired[it.base!] ?? 0) + (s.ev[it.base!] ?? 0)) === 0;
      if (quiet) problems.push("untested"), notes.push("no trace of its hooks, nor of the base passive's: their moment never came in these fights");
      else problems.push("never fires"), notes.push("no trace of its hooks");
    }
  }
  if (!crashes && !it.issues.length && identical && !problems.includes("never fires") && !problems.includes("untested")) problems.push("no effect");
  if (identical && fire > 0) notes.push(`its hooks run (${per(fire)} a fight), but every fight is identical to the control`);
  else if (identical) notes.push("every fight identical to the control");

  // The party against the control, over the ticks both fights lasted.
  const ks = I.map((_, k) => k).filter((k) => ok[k]);
  const upTo = (k: number, xs: number[]) => sum(xs, Math.ceil(Math.min(I[k].T, C[k].T) / B));
  const [dDealt, seDealt] = paired(ks.map((k) => upTo(k, I[k].dealt)), ks.map((k) => upTo(k, C[k].dealt)));
  const share = (s: Sum, k: number) => upTo(k, s.taken) / Math.max(1, s.pmax);
  const [dTaken, seTaken] = paired(ks.map((k) => share(I[k], k)), ks.map((k) => share(C[k], k)));
  const [dHeal, seHeal] = paired(ks.map((k) => I[k].healed), ks.map((k) => C[k].healed));
  const dLength = ks.length ? ks.reduce((a, k) => a + I[k].T - C[k].T, 0) / ks.length : 0;
  const won: [number, number] = [total(I, (s) => s.won), total(C, (s) => s.won)];
  if (it.partySide && ks.length >= 6 && !identical && !problems.includes("never fires")) {
    // Worse on one count past the noise, and better on none (a trade, such as an action spent on defence, isn't the wrong way).
    const past = (x: number, se: number) => x > Math.max(0.05, 2.5 * se);
    const less = past(-dDealt, seDealt), more = past(dTaken, seTaken);
    const better = past(dDealt, seDealt) || past(-dTaken, seTaken) || past(dHeal, seHeal) || won[0] > won[1] + Math.max(2, 0.1 * n);
    if ((less || more) && !better) {
      problems.push("wrong way");
      if (less) notes.push(`deals ${Math.round(-100 * dDealt)}% less`);
      if (more) notes.push(`takes ${Math.round(100 * dTaken)}% more`);
    }
  }
  if (it.issues.length) notes.push(it.issues.join("; "));
  return {
    id: it.id, name: it.name, share: it.share, what: it.what, rarity: it.rarity, carrier: it.carrier, problems, notes,
    ...(crashes ? { error: I.find((s) => s.err)!.err } : {}), crashes, stops, deep, expect: it.expect, fire: per(fire), statuses,
    ...(casts ? { casts } : {}), identical, partySide: it.partySide, dDealt, seDealt, dTaken, seTaken, dHeal, dLength,
    won: [total(I, (s) => s.won), total(C, (s) => s.won)],
  };
}

// ─── The pool ───────────────────────────────────────────────────────────────

type Job = { key: string; party: Party };
type Done = { key: string; sums: Sum[] };

/** Child processes (worker threads don't get tsx's loader), each playing one party's fights at a time. */
class Pool {
  private idle: ChildProcess[] = [];
  private all: ChildProcess[] = [];
  private queue: { job: Job; done: (d: Done) => void }[] = [];
  private waiting = new Map<ChildProcess, (d: Done) => void>();
  private local: ((j: Job) => Done) | null;
  constructor(n: number, data: { quick: boolean; seeds: number[] }, local: ((j: Job) => Done) | null) {
    this.local = local;
    if (local) return;
    for (let i = 0; i < n; i++) {
      const w = fork(process.argv[1], [CHILD, JSON.stringify(data)], { execArgv: process.execArgv });
      w.on("message", (d: Done) => { const done = this.waiting.get(w)!; this.waiting.delete(w); this.idle.push(w); this.pump(); done(d); });
      w.on("exit", (code) => { if (code && this.waiting.has(w)) throw new Error(`piece-check: a child process died (exit ${code})`); });
      this.idle.push(w); this.all.push(w);
    }
  }
  run(job: Job): Promise<Done> {
    if (this.local) return Promise.resolve(this.local(job));
    return new Promise((done) => { this.queue.push({ job, done }); this.pump(); });
  }
  private pump() {
    while (this.idle.length && this.queue.length) { const w = this.idle.pop()!; const { job, done } = this.queue.shift()!; this.waiting.set(w, done); w.send(job); }
  }
  close() { for (const w of this.all) w.kill(); }
}

// ─── The report ─────────────────────────────────────────────────────────────

const pc = (x: number) => `${x >= 0 ? "+" : ""}${Math.round(100 * x)}%`;
const cell = (s: string) => s.replace(/\|/g, "/").replace(/\n/g, " ");
const ORDER = ["can't field", "crash", "loop", "never fires", "no effect", "wrong way", "weaker than its base", "untested"];

function firing(l: Line): string {
  const top = Object.entries(l.statuses).sort((a, b) => b[1][0] - a[1][0]).slice(0, 4).map(([id, [i, k]]) => `${id} ${i}${k ? ` (${k})` : ""}`);
  return top.join(", ") || "-";
}
function castCell(l: Line): string {
  if (!l.casts) return "";
  const [n, d, h, a] = l.casts.form, [bn, bd, bh, ba] = l.casts.base;
  return `${n}/f: ${d}d ${h}h ${a}a (base ${bn}/f: ${bd}d ${bh}h ${ba}a)`;
}

function writeReport(lines: Line[], info: string): string {
  const out: string[] = ["# Piece check", "", info, ""];
  const shares = (Object.keys(SHARES) as Share[]).filter((s) => lines.some((l) => l.share === s));
  out.push("| share | items | " + ORDER.join(" | ") + " | static |", "|---|---:|" + ORDER.map(() => "---:").join("|") + "|---:|");
  for (const s of shares) {
    const ls = lines.filter((l) => l.share === s);
    out.push(`| ${SHARES[s]} | ${ls.length} | ${ORDER.map((p) => ls.filter((l) => l.problems.includes(p)).length || "").join(" | ")} | ${ls.filter((l) => l.expect === "none").length} |`);
  }
  out.push(
    "",
    "Static: nothing in it should leave a trace of its own (stats, boosts and the like); it's judged by its effect on the fights only. " +
      "Fires: its statuses' traces a fight past the control's (a hook run, a status gained in the fight, its damage, heal or MP, a strike, a shield soaking or breaking, a block, a cover). " +
      "In the per-item tables, each status shows its traces a fight with the control's in brackets. Casts: a form's casts a fight, and per cast the damage dealt (d), healing (h) and statuses applied (a: applications, not stacks), against its base's. " +
      "Δ: the party with the item against the control, over the ticks both fights lasted (taken: the share of its max HP lost); ± is one standard error. Won: fights won, item/control.",
    "",
  );
  for (const s of shares) {
    const ls = lines.filter((l) => l.share === s);
    out.push(`## ${SHARES[s]} (${ls.length})`, "");
    const bad = ls.filter((l) => l.problems.length).sort((a, b) => ORDER.indexOf(a.problems[0]) - ORDER.indexOf(b.problems[0]));
    if (bad.length) {
      out.push("| item | carrier | problem | detail |", "|---|---|---|---|");
      for (const l of bad) out.push(`| ${l.id} (${l.rarity}) | ${l.carrier} | ${l.problems.join(", ")} | ${cell([l.error ?? "", ...l.notes, l.problems.includes("loop") ? `stops ${l.stops[0]} (control ${l.stops[1]}), depth ${l.deep[0]} (${l.deep[1]})` : ""].filter(Boolean).join("; "))} |`);
      out.push("");
    } else out.push("No problems.", "");
    out.push("| item | rarity | carrier | fires | its statuses, a fight | casts | Δdealt | Δtaken | Δheal | Δticks | won |", "|---|---|---|---:|---|---|---:|---:|---:|---:|---|");
    for (const l of ls) {
      out.push(
        `| ${l.id} | ${l.rarity} | ${l.carrier} | ${l.expect === "none" ? "static" : l.fire} | ${cell(firing(l))} | ${castCell(l)} | ${pc(l.dDealt)} ±${Math.round(100 * l.seDealt)} | ${pc(l.dTaken)} ±${Math.round(100 * l.seTaken)} | ${pc(l.dHeal)} | ${l.dLength >= 0 ? "+" : ""}${l.dLength.toFixed(0)} | ${l.won[0]}/${l.won[1]} |`,
      );
    }
    out.push("");
  }
  return out.join("\n");
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const opt = (k: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
  const quick = args.includes("--quick");
  const seeds = Array.from({ length: Number(opt("--seeds") ?? (quick ? 1 : 3)) }, (_, i) => i + 1);
  const outDir = opt("--out") ?? "out/piece-check";
  const t0 = Date.now();
  const raw = JSON.parse(readFileSync(PACK, "utf8"));
  const c = loadContent(raw);
  const fights = fightSet(c, quick);
  let items = allItems(c);
  const only = opt("--only")?.split(",").map((s) => s.trim()).filter(Boolean);
  if (only?.length) items = items.filter((it) => only.some((o) => o === it.share || o === it.id || o === it.base));
  if (!items.length) throw new Error(`piece-check: nothing matches --only ${only?.join(",")}`);
  if (args.includes("--show")) {
    for (const it of items) console.log(JSON.stringify({ id: it.id, carriers: it.carriers, grants: it.grants, closure: it.closure, expect: it.expect, partySide: it.partySide, party: it.party, control: it.control }));
    return;
  }

  const arms = new Map<string, Party>();
  const keyOf = (p: Party) => JSON.stringify(p);
  for (const it of items) for (const p of [it.party, it.control]) arms.set(keyOf(p), p);
  const workers = Math.max(1, Math.min(Number(opt("--workers") ?? Math.min(4, availableParallelism())), arms.size));
  if (workers <= 1) probe(c);
  const local = workers <= 1 ? (j: Job): Done => ({ key: j.key, sums: playArm(c, fights, seeds, j.party) }) : null;
  const pool = new Pool(workers, { quick, seeds }, local);
  const sums = new Map<string, Sum[]>();
  let done = 0;
  await Promise.all(
    [...arms].map(([key, party]) =>
      pool.run({ key, party }).then((d) => {
        sums.set(d.key, d.sums);
        if (++done % 100 === 0) process.stderr.write(`  ${done}/${arms.size} parties played\n`);
      }),
    ),
  );
  pool.close();
  const lines = items.map((it) => judge(c, it, sums.get(keyOf(it.party))!, sums.get(keyOf(it.control))!));
  const secs = ((Date.now() - t0) / 1000).toFixed(0);
  const nf = fights.length * seeds.length;
  const info =
    `${items.length} items, ${arms.size} parties (each item's and its control), ${fights.length} fights (${fights.map((f) => `${f.id} ${f.knob}`).join(", ")}) × ${seeds.length} seed${seeds.length > 1 ? "s" : ""} = ${nf} fights a party, ` +
    `${arms.size * nf} fights in ${secs} s on ${workers} worker${workers > 1 ? "s" : ""}. Engine ${ENGINE_VERSION}, content ${c.pack.id}#${c.fingerprint}.`;
  mkdirSync(outDir, { recursive: true });
  writeFileSync(`${outDir}/report.md`, writeReport(lines, info) + "\n");
  writeFileSync(`${outDir}/report.json`, JSON.stringify({ info, fights, seeds, items: lines }, null, 1));
  console.log(info);
  for (const p of ORDER) {
    const ls = lines.filter((l) => l.problems.includes(p));
    if (ls.length) console.log(`  ${p}: ${ls.length}${ls.length <= 8 ? ` (${ls.map((l) => l.id).join(", ")})` : ""}`);
  }
  console.log(`  static: ${lines.filter((l) => l.expect === "none").length}, fine: ${lines.filter((l) => !l.problems.length).length}`);
  console.log(`Written to ${outDir}/report.md and report.json.`);
}

const CHILD = "--piece-check-child";
if (process.argv[2] === CHILD) {
  const { quick, seeds } = JSON.parse(process.argv[3]) as { quick: boolean; seeds: number[] };
  const c = loadContent(JSON.parse(readFileSync(PACK, "utf8")));
  probe(c);
  const fights = fightSet(c, quick);
  process.on("message", (j: Job) => process.send!({ key: j.key, sums: playArm(c, fights, seeds, j.party) } satisfies Done));
} else if (/piece-check(\.mjs|\.ts)$/.test(process.argv[1] ?? "")) await main();
