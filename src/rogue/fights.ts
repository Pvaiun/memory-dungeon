/**
 * A run's fights: its items as content the engine can look up, the party a fight takes, starting a fight with HP and
 * MP carried in and ending it, and the foes: each fight's knob and the bosses.
 */
import { advance, type Content, newRun, type Run } from "../engine/run.js";
import { type DungeonT, type FoesT, formBase, type GearT, type Party, type RogueFightT, type SupplyIdT } from "../schema.js";
import { combat, type Member as EngineMember } from "../engine/combat/rules.js";
import { int, next, rngFor } from "../engine/rng.js";
import { bench, between, cfg, type FightSpec, type FightTier, type Item, type MapNode, member, note, type Offer, type Pending, r, regionOf, type RogueRun } from "./state.js";
import { formOf, passiveOf } from "./training.js";
import { gainGold, heal } from "./party.js";
import { boonOffers, offerText, rollFormations, rollItem, rollRarity, rollRecruit, spoilOffers, take } from "./offers.js";
import { actRoll } from "./acts.js";

// ─── Content the run adds: its gear, its trained forms, its fight ─────────

const noteOf = (it: Item) => `rogue ${it.rarity}: ${it.base}`;
/** Every run's item as content the engine can look up by its `uid`. */
export function registerGear(c: Content, run?: RogueRun) {
  if (run) for (const it of run.items) if (c.gear.get(it.uid)?.note !== noteOf(it)) c.gear.set(it.uid, itemGear(c, it));
}
/** A run's item as gear: its piece, under the item's id (a piece is fixed, so nothing else changes). */
export function itemGear(c: Content, it: Item): GearT {
  const base = c.gear.get(it.base)!;
  return { ...structuredClone(base), id: it.uid, source: "drop", note: noteOf(it) };
}
export const itemOf = (run: RogueRun, uid: string) => run.items.find((i) => i.uid === uid);
/** Who wears an item, or null if it's in the bag. */
export const wearer = (run: RogueRun, uid: string) => run.roster.find((m) => Object.values(m.gear).includes(uid))?.cls ?? null;
export const bag = (run: RogueRun) => run.items.filter((i) => !wearer(run, i.uid));

/** The engine's party for the run's party: formation, seats, abilities in order (their trained forms), the passive's form, gear. */
export function partyOf(c: Content, run: RogueRun): Party {
  const f = c.formations.get(run.formation)!;
  return {
    formation: run.formation,
    units: run.party.map((cls, i) => {
      const m = member(run, cls);
      const pid = passiveOf(c, cls);
      const passive = pid ? formOf(m, pid) : undefined;
      return {
        class: cls, position: f.positions[i].id, abilities: m.order.map((a) => formOf(m, a)), ...(passive && passive !== pid ? { passive } : {}),
        gear: Object.fromEntries(Object.entries(m.gear).filter(([, v]) => v)) as Record<string, string>,
      };
    }),
  };
}

/** The one-stage dungeon the engine plays for a fight. */
export const FIGHT_DUNGEON = "rogue_fight";
export function fightDungeon(c: Content, spec: FightSpec): DungeonT {
  const d: DungeonT = {
    id: FIGHT_DUNGEON, name: spec.fight.name, text: spec.fight.name, partySize: { max: 3 }, perkPool: [], challenges: [],
    ...(Object.keys(spec.foes).length ? { foes: spec.foes } : {}),
    stages: [{ kind: "fight", id: spec.fight.id, name: spec.fight.name, enemies: spec.fight.enemies, ...(spec.tier === "boss" ? { boss: true } : {}) }],
  };
  c.dungeons.set(FIGHT_DUNGEON, d);
  return d;
}

/** A new engine run for the pending fight, with the party's HP, MP and knockouts carried in. */
export function startFight(c: Content, run: RogueRun, opts: { log?: boolean } = {}): Run {
  const p = run.pending;
  if (p.kind !== "fight") throw new Error("no fight is pending");
  registerGear(c, run);
  fightDungeon(c, p);
  // From here the party is set: leaving and coming back replays this fight as it starts, the same way.
  p.begun = true;
  const er = newRun(c, combat, { dungeon: FIGHT_DUNGEON, party: partyOf(c, run), seed: p.seed }, { checked: true, log: opts.log });
  carryIn(run, er);
  return er;
}
/**
 * The whole run as it stands, without the snapshot it may hold or the interface's record (`src/rogue/record.ts`): taken as a
 * fight's preview opens (`choose`), for a Destiny Shard to return to.
 */
export function snapshot(run: RogueRun): RogueRun {
  const { retry: _, record: __, ...rest } = run as RogueRun & { record?: unknown };
  return structuredClone(rest);
}
/**
 * Spends a Destiny Shard after a lost fight: the run goes back to exactly where it stood as the fight's preview opened, its
 * supplies and everything else as they were, with one shard fewer. The interface's record, if any, carries on.
 */
export function useShard(run: RogueRun) {
  const back = run.retry;
  if (run.pending.kind !== "fate" || !back || !run.shards) throw new Error("no Destiny Shard to use");
  const fell = run.pending.fight;
  for (const k of Object.keys(run)) if (k !== "record") delete (run as Record<string, unknown>)[k];
  Object.assign(run, structuredClone(back));
  run.shards = (back.shards ?? 1) - 1;
  note(run, `Fell to ${fell}, and a Destiny Shard turned time back.`);
}
/** Sets an engine run's party to the roster's HP, MP, knockouts and cooldowns (each under its ability's trained form). */
export function carryIn(run: RogueRun, er: Run) {
  for (const em of er.party as EngineMember[]) {
    const m = member(run, em.ref);
    em.hp = m.ko ? 0 : Math.max(1, em.stats.max_hp - m.missHp);
    em.mp = Math.max(0, em.stats.max_mp - m.missMp);
    if (m.cooldowns) em.cooldowns = Object.fromEntries(Object.entries(m.cooldowns).map(([id, v]) => [formOf(m, id), v]));
  }
}

/** The fight's result, carried back: HP, MP, knockouts; then spoils, the boss's boon, or the end. */
export function endFight(c: Content, run: RogueRun, er: Run) {
  const p = run.pending;
  if (p.kind !== "fight") throw new Error("no fight is pending");
  const won = er.outcome === "won";
  for (const em of er.party as EngineMember[]) {
    const m = member(run, em.ref);
    m.ko = em.hp <= 0;
    m.missHp = m.ko ? em.stats.max_hp : Math.max(0, em.stats.max_hp - em.hp);
    m.missMp = Math.max(0, em.stats.max_mp - em.mp);
    m.lastMax = { hp: em.stats.max_hp, mp: em.stats.max_mp };
    // Kept by base ability id, so a cooldown follows its ability to a new form.
    if (em.cooldowns) m.cooldowns = Object.fromEntries(Object.entries(em.cooldowns).map(([id, v]) => [formBase(id), v]));
  }
  run.stats.fights++;
  if (p.tier === "elite") run.stats.elites++;
  if (!won) {
    // A wipe ends the run, even with members at camp, unless a Destiny Shard is spent to go back to the fight's preview.
    note(run, `Fell to ${p.fight.name}.`);
    run.pending = run.shards && run.retry ? { kind: "fate", fight: p.fight.name } : { kind: "over", won: false };
    if (run.pending.kind === "over") delete run.retry;
    return;
  }
  delete run.retry;
  // Those who sat the fight out regain a flat share of their max MP (from the max they last fought
  // with, so MP gear put on at camp adds nothing), like a tonic; no gear touches it.
  const benchMp = cfg(c).benchMp ?? 0;
  if (benchMp) heal(c, run, bench(run).map((cls) => member(run, cls)), 0, benchMp);
  const down = run.party.filter((cls) => member(run, cls).ko);
  note(run, `Beat ${p.fight.name}${down.length ? ` (${down.map((k) => c.classes.get(k)!.name).join(", ")} down)` : ""}.`);
  const g = cfg(c).gold;
  const rng = r(run, `gold:${run.act}:${p.node}`);
  const gold = between(rng, g[p.tier === "fight" ? "fight" : p.tier]) + g.perAct * (run.act - 1);
  if (p.tier === "boss") {
    run.stats.bosses++;
    gainGold(run, gold);
    if (run.act >= cfg(c).knobs.length) {
      note(run, "The run is won.");
      run.pending = { kind: "over", won: true };
      return;
    }
    // Every boss but the last leaves a Destiny Shard to take, while the run holds fewer than it can.
    const after = offerDrop(c, run, { kind: "boon", offers: boonOffers(c, run) });
    run.pending = (run.shards ?? 0) < (cfg(c).shards?.max ?? 0) ? { kind: "shard", then: after } : after;
    return;
  }
  const offers = spoilOffers(c, run, p.tier, p.node);
  const s = cfg(c).spoils[p.tier === "elite" ? "elite" : "fight"];
  // What follows the pick: an elite's pick of formations, while there are any to win; then a captive, sometimes.
  let then: Pending = { kind: "map" };
  const cap = captiveFor(c, run, p.fight.enemies, p.node);
  if (cap) then = { kind: "captive", offer: cap, then };
  const fms = s.formations ? rollFormations(c, run, r(run, `trophy:${run.act}:${p.node}`), s.formations) : [];
  if (fms.length) then = { kind: "trophy", offers: fms, then };
  // `extra` % of the time (a third more gear, for the fourth slot), a second pick of pieces follows the first, from the same
  // table, none of them a piece in the first pick.
  const xr = r(run, `spoils2:${run.act}:${p.node}`);
  if (s.extra && next(xr) * 100 < s.extra) {
    const taken = offers.flatMap((o) => (o.kind === "gear" || o.kind === "bundle" ? [o.item.base] : []));
    const more: Offer[] = [];
    for (let i = 0; i < s.count; i++) {
      const item = rollItem(c, run, xr, rollRarity(xr, s.rarity), false, true, undefined, taken);
      if (item) (taken.push(item.base), more.push({ kind: "gear", item }));
    }
    if (more.length) then = { kind: "spoils", gold: 0, offers: more, tier: p.tier, ...(then.kind !== "map" ? { then } : {}) };
  }
  const spoils: Pending = { kind: "spoils", gold, offers, tier: p.tier, ...(then.kind !== "map" ? { then } : {}) };
  // An elite's trophy: a legendary piece aimed at the party, won outright and in the bag already; none with no piece to win.
  const prize = s.trophy ? rollItem(c, run, r(run, `trophy:${run.act}:${p.node}`), "legendary", true) : null;
  if (!prize) return void (run.pending = offerDrop(c, run, spoils));
  const piece: Offer = { kind: "gear", item: prize };
  take(c, run, piece);
  note(run, `Won ${offerText(c, run, piece)}.`);
  run.pending = offerDrop(c, run, { ...spoils, trophy: prize });
}

/** The supplies of a kind the party carries. */
export const carried = (run: RogueRun, id: SupplyIdT) => run.supplies.filter((s) => s === id).length;
/** Room in the bag's slot for this kind. */
export const bagRoom = (c: Content, run: RogueRun, id: SupplyIdT) => carried(run, id) < cfg(c).bag[id];
export const supplyName = (id: SupplyIdT) => (id === "phoenix" ? "a phoenix feather" : `a ${id}`);
/**
 * After every won fight the party picks one of the dropped kinds (a potion or a tonic); a kind whose slot is full isn't offered,
 * one left is simply taken, none left is nothing.
 */
function offerDrop(c: Content, run: RogueRun, then: Pending): Pending {
  const options = (cfg(c).drops ?? []).filter((id) => bagRoom(c, run, id));
  if (options.length > 1) return { kind: "drop", options, then };
  if (options.length === 1) (run.supplies.push(options[0]), note(run, `Found ${supplyName(options[0])}.`));
  return then;
}

/** A captive after a won fight with people in it, `captive.chance` of the time, never two fights running. */
function captiveFor(c: Content, run: RogueRun, enemies: string[], node: string): Offer | null {
  const k = cfg(c).captive;
  if (!k || !enemies.some((e) => k.people.includes(e)) || run.captiveAt === run.stats.fights - 1) return null;
  const rng = r(run, `captive:${run.act}:${node}`);
  if (next(rng) * 100 >= k.chance) return null;
  const o = rollRecruit(c, run, rng);
  if (o) run.captiveAt = run.stats.fights;
  return o;
}
/**
 * Plays the pending fight at once (the simulations), and carries the result back. A lost fight with a Destiny Shard held
 * leaves the choice pending only with `shards` (whole runs by the simulated player); otherwise the run ends, so a tool that
 * measures one fight sees a loss as a loss.
 */
export function autoFight(c: Content, run: RogueRun, opts: { shards?: boolean } = {}): Run {
  const er = startFight(c, run);
  advance(c, combat, er);
  endFight(c, run, er);
  if (run.pending.kind === "fate" && !opts.shards) (run.pending = { kind: "over", won: false }), delete run.retry;
  return er;
}

// ─── The foes ───────────────────────────────────────────────────────────────

/**
 * A knob's change to the foes: HP +k %, damage +k/2.5 %; a negative k takes k % off HP and k/2.5 % off damage. Damage moves
 * slower than HP so a high knob's basics one-shot casters less.
 */
export const knobFoes = (k: number): FoesT =>
  k > 0 ? { hp: Math.round(k), power: Math.round(k / 2.5) } : k < 0 ? { hp: Math.max(-80, Math.round(k)), power: Math.max(-80, Math.round(k / 2.5)) } : {};
/** Each pool's reference floor: a fight's own knob is set there, and the act's ramp moves it from there. */
export const refFloors = (c: Content) => cfg(c).map.ref ?? { easy: 1, normal: 5, elite: 6 };
/** The easy pool's last floor: a start's fights. */
export const easyTo = (c: Content) => cfg(c).map.easyTo ?? 2;
/**
 * A fight's knob: its own (set by the calibration, npm run rogue:calibrate), the act's offset for its tier and region,
 * the ramp from its pool's reference floor, and the heat.
 */
export function knobFor(c: Content, run: RogueRun, tier: FightTier, floor: number, fight: RogueFightT): number {
  const kn = cfg(c).knobs[Math.min(run.act, cfg(c).knobs.length) - 1];
  const reg = regionOf(c, run.region).knob;
  const heat = run.heat * cfg(c).heat.per;
  const own = fight.knob ?? 0;
  if (tier === "boss") return own + kn.boss + reg.boss + heat;
  const ref = refFloors(c);
  // The act's climb from the pool's reference floor; below it, `early` a floor (act I's measured against a party a few rooms in),
  // and the elites' own `eliteEarly` where the act has one.
  const climb = (from: number, below = kn.early ?? kn.step) => (floor < from ? below : kn.step) * (floor - from);
  if (tier === "elite") return own + kn.elite + reg.elite + climb(ref.elite, kn.eliteEarly ?? kn.early ?? kn.step) + heat;
  return own + kn.mob + reg.mob + climb(floor <= easyTo(c) ? ref.easy : ref.normal) + heat;
}
/** The fight a room holds: from the region's easy pool on the first floors (`easyTo`), then its normal or elite pool, packs growing late. */
export function fightFor(c: Content, run: RogueRun, node: MapNode, tier: FightTier): RogueFightT {
  if (tier === "boss") return run.boss;
  const reg = regionOf(c, run.region);
  const rng = r(run, `enc:${run.act}:${node.id}:${tier}`);
  const all = tier === "elite" ? reg.elite : node.floor <= easyTo(c) ? reg.easy : reg.normal;
  // Not the same fight twice in an act while the pool has others.
  const fresh = all.filter((f) => !run.met.includes(f.id));
  const pool = fresh.length ? fresh : all;
  const base = pool[int(rng, pool.length)];
  const enemies = [...base.enemies];
  if (node.floor >= cfg(c).growFrom && tier !== "elite") {
    const counts = new Map<string, number>();
    for (const e of enemies) counts.set(e, (counts.get(e) ?? 0) + 1);
    // A pack that explodes never grows: two Bomb Bugs are a puzzle, three a wipe. Nor does one in `neverGrow`.
    for (const [e, n] of counts) if (n >= 2 && enemies.length < 8 && !c.enemies.get(e)?.statuses?.includes("volatile") && !cfg(c).neverGrow?.includes(e) && next(rng) < 0.5) enemies.splice(enemies.lastIndexOf(e) + 1, 0, e);
  }
  return { ...base, enemies };
}
/** The foes' change for a tier at a knob: the knob's HP and damage, and the tier's shape on top. */
export function foesFor(c: Content, tier: FightTier, k: number): FoesT {
  const f = knobFoes(k);
  const sh = cfg(c).shape?.[tier];
  if (!sh) return f;
  const hp = (f.hp ?? 0) + sh.hp, power = (f.power ?? 0) + sh.power;
  return { ...(hp ? { hp: Math.max(-90, hp) } : {}), ...(power ? { power: Math.max(-90, power) } : {}) };
}
/** The act's boss fight as it will be met: its foes' HP and damage changes (the boss screen shows its moves' sizes). */
export function bossFoes(c: Content, run: RogueRun, at?: { act: number; region: string }): FoesT {
  const r2 = at ? { ...run, ...at, boss: actRoll(c, run, at.region, at.act).boss } : run;
  return foesFor(c, "boss", knobFor(c, r2, "boss", cfg(c).map.floors + 1, r2.boss));
}
export function fightSpec(c: Content, run: RogueRun, node: MapNode, tier: FightTier): FightSpec {
  const fight = fightFor(c, run, node, tier);
  run.met.push(fight.id);
  return { node: node.id, tier, fight, foes: foesFor(c, tier, knobFor(c, run, tier, node.floor, fight)), seed: rngFor(run.seed, `fight:${run.act}:${node.id}:${tier}`)[0] };
}
