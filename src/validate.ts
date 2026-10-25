/**
 * Validator for content packs and party loadouts.
 *
 * Three layers of checks:
 *   1. Shape: the zod schema (types, required fields, closed sets).
 *   2. Meaning: every reference resolves, and content follows the combat
 *      rules for what's valid (steps/04-combat-concepts/design.md and
 *      docs/core-set/rules-and-vocabulary.md): a physical instance has a
 *      subtype and no element, percent changes only on amount stats, a
 *      weapon belongs to a kind, and so on.
 *   3. Design rules from the core set, driven by the pack's `design` block.
 *
 * Every issue carries a stable `code`, so tests and later tooling can rely on it.
 */
import * as S from "./schema.js";

export type Issue = { level: "error" | "warning"; code: string; path: string; message: string };
export type Pack = S.ContentPack;

class Report {
  issues: Issue[] = [];
  error(code: string, path: string, message: string) {
    this.issues.push({ level: "error", code, path, message });
  }
  warn(code: string, path: string, message: string) {
    this.issues.push({ level: "warning", code, path, message });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Index
// ─────────────────────────────────────────────────────────────────────────────

const COLLECTIONS = [
  "stats", "elements", "weaponKinds", "statuses", "classes", "abilities", "gear", "formations", "enemies", "perkFamilies", "perks", "dungeons",
] as const;
type Coll = (typeof COLLECTIONS)[number];

export class Index {
  readonly maps = new Map<Coll, Map<string, any>>();
  readonly used = new Map<Coll, Set<string>>();

  constructor(readonly pack: Pack, r?: Report) {
    for (const coll of COLLECTIONS) {
      const m = new Map<string, any>();
      (pack[coll] as { id: string }[]).forEach((it, i) => {
        if (m.has(it.id)) r?.error("id.duplicate", `${coll}[${i}]`, `duplicate ${coll} id '${it.id}'`);
        m.set(it.id, it);
      });
      this.maps.set(coll, m);
      this.used.set(coll, new Set());
    }
  }

  get<T = any>(coll: Coll, id: string): T | undefined {
    return this.maps.get(coll)!.get(id);
  }
  has(coll: Coll, id: string) {
    return this.maps.get(coll)!.has(id);
  }
}

/** Resolves references, marking what's used. */
class Walker {
  constructor(readonly ix: Index, readonly r: Report) {}
  ref(coll: Coll, id: string, path: string, what: string): boolean {
    if (!this.ix.has(coll, id)) {
      this.r.error("ref.missing", path, `unknown ${what} '${id}'`);
      return false;
    }
    this.ix.used.get(coll)!.add(id);
    return true;
  }
}

export type ValidateOptions = { complete?: boolean };
export type ValidateResult = { pack?: Pack; issues: Issue[]; errors: number; warnings: number };

export function validatePack(raw: unknown, opts: ValidateOptions = {}): ValidateResult {
  const parsed = S.ContentPack.safeParse(raw);
  if (!parsed.success) {
    const issues: Issue[] = parsed.error.issues.map((i) => ({
      level: "error",
      code: "schema",
      path: i.path.map((s) => (typeof s === "number" ? `[${s}]` : `.${String(s)}`)).join("").replace(/^\./, ""),
      message: i.message,
    }));
    return { issues, errors: issues.length, warnings: 0 };
  }
  const pack = parsed.data;
  const r = new Report();
  const ix = new Index(pack, r);
  const w = new Walker(ix, r);
  const c = new Combat(pack, ix, w, r);

  checkDesign(pack, r);
  c.registries();
  c.statuses();
  c.abilities();
  checkUnits(pack, ix, w, r, c);
  checkGear(pack, ix, w, r, c);
  checkFormations(pack, r, c);
  checkEnemies(pack, w, r, c);
  checkPerks(pack, ix, w, r, c);
  checkDungeons(pack, ix, w, r);
  checkStarterAndProgression(pack, ix, w, r);
  if (opts.complete) checkComplete(pack, r);
  checkUnused(pack, ix, r);

  const errors = r.issues.filter((i) => i.level === "error").length;
  return { pack, issues: r.issues, errors, warnings: r.issues.length - errors };
}

function checkDesign(pack: Pack, r: Report) {
  const d = pack.design;
  const rangeOk = (rg: [number, number], path: string) => {
    if (rg[0] > rg[1]) r.error("design.range", path, `range [${rg[0]}, ${rg[1]}] runs backwards`);
  };
  rangeOk(d.partySize, "design.partySize");
  rangeOk(d.perkPicksPerRun, "design.perkPicksPerRun");
  rangeOk(d.perkPoolSize, "design.perkPoolSize");
  if (d.partySize[1] > d.formationPositions) r.error("design.partySize", "design.partySize", `party size can't exceed ${d.formationPositions} formation positions`);
  if (d.abilitiesEquipped > d.abilitiesPerClass) r.error("design.abilities", "design.abilitiesEquipped", `can't equip more abilities than a class has`);
  if (pack.ruleset.run.perkOffer.options !== d.perkOptionsPerPick) {
    r.error("design.perkOptions", "ruleset.run.perkOffer.options", `perk picks offer ${d.perkOptionsPerPick} options (design.perkOptionsPerPick)`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// The combat rule language (design sections 3 to 8, and the core set's additions)
// ─────────────────────────────────────────────────────────────────────────────

/** An Intensity total that every applier adds into: it has no single source (section 7.6). */
const shared = (st: S.StatusT) => st.stacking === "intensity" && !st.perSource;

/** Where a number, effect or rule sits: in an action, a status's pulse or trigger, or a reaction. */
type Where = "action" | "pulse" | "reaction";

const ACTION_EVENTS = ["action_start", "action_resolve", "action_interrupted"];
const HIT_EVENTS = ["hit_lands", "hit_taken", "hit_evaded", "hit_missed"];
const STATUS_EVENTS = ["status_gained", "status_triggered", "status_ended"];
const DAMAGE_EVENTS = ["damage_dealt", "damage_taken"];
const RESERVED_TAGS = ["basic", "ability", "extra", "physical", "magical", "none", "healing", "all", ...Object.keys(S.SUBTYPES)];
const WEIGHT_ORDER: Record<S.WeightT, number> = { light: 0, medium: 1, heavy: 2 };

class Combat {
  constructor(readonly pack: Pack, readonly ix: Index, readonly w: Walker, readonly r: Report) {}
  /** Set while checking a status that is a shared Intensity total. */
  shared = false;

  /** A stat key: a registry stat, or a family member whose parts exist. */
  statKey(key: string, path: string): S.StatDefT | null {
    const [head, ...rest] = key.split(":");
    if (!rest.length) return this.w.ref("stats", key, path, "stat") ? this.ix.get<S.StatDefT>("stats", key)! : null;
    if (head === "resist" && rest.length === 1) this.w.ref("elements", rest[0], path, "element");
    else if (head === "immune" && rest[0] === "status" && rest.length === 2) this.w.ref("statuses", rest[1], path, "status");
    else if (head === "immune" && rest[0] === "kind" && rest.length >= 2) {
      if (!(rest[1] in S.KINDS)) this.r.error("stat.family", path, `'${rest[1]}' isn't an effect kind (${Object.keys(S.KINDS).join(", ")})`);
    } else if (head !== "immune" || rest.length !== 1 || !["debuffs", "damage", "dispel"].includes(rest[0])) {
      this.r.error("stat.family", path, `'${key}' isn't a stat or a member of a stat family (${Object.keys(S.STAT_FAMILIES).join(", ")})`);
    }
    return null;
  }

  /** Family stats are counted in points or are binary, so they take flat changes only. */
  statChange(ch: { stat: string; flat?: unknown; pct?: unknown }, path: string) {
    const d = this.statKey(ch.stat, `${path}.stat`);
    if (ch.pct !== undefined && (!d || d.kind === "points")) {
      this.r.error("stat.pct", `${path}.pct`, `'${ch.stat}' is counted in points or percent, so it takes flat changes only`);
    }
    if (ch.flat === undefined && ch.pct === undefined) this.r.error("stat.empty", path, `a stat change needs flat or pct`);
  }

  ticks(t: number | undefined, path: string) {
    if (t !== undefined && Math.abs(t * S.SUBTICKS - Math.round(t * S.SUBTICKS)) > 1e-6) {
      this.r.error("timing.precision", path, `${t} ticks: timings count whole sub-ticks (1,000 per tick), so at most 3 decimals`);
    }
  }

  num(n: S.NumT, path: string, where: Where, inStatus: boolean) {
    if (typeof n === "number") return;
    n.scale.forEach((s, i) => {
      const p = `${path}.scale[${i}]`;
      if (s.stat) this.statKey(s.stat, `${p}.stat`);
      if (s.stacks) this.w.ref("statuses", s.stacks, `${p}.stacks`, "status");
      if (s.when) this.unitCond(s.when, `${p}.when`);
      if (s.amount && where !== "reaction") this.r.error("scale.amount", p, `only a reaction has an event amount to scale from`);
      if (!inStatus && (s.of === "holder" || s.of === "source")) this.r.error("scale.of", `${p}.of`, `'${s.of}' only means something inside a status; in an action, use self or target`);
      if (inStatus && s.stat && !s.of) this.r.error("scale.of", p, `in a status, say whose stat this is: source (fixed at application) or holder (read when used)`);
      if (inStatus && s.of === "source" && this.shared) this.r.error("scale.of", `${p}.of`, `a shared Intensity total has no single source; make the status Per source, or scale the stacks its applications add`);
      if (s.times) {
        this.statKey(s.times.stat, `${p}.times.stat`);
        if (s.amount && !s.times.of) this.r.error("scale.times", `${p}.times`, `an event amount has no unit of its own: say whose stat multiplies it (holder or self)`);
        if (!inStatus && (s.times.of === "holder" || s.times.of === "source")) this.r.error("scale.of", `${p}.times.of`, `'${s.times.of}' only means something inside a status`);
        if (inStatus && s.times.of === "source") this.r.error("scale.times", `${p}.times.of`, `a live multiplier can't read the source, which is only known at application; use holder or self`);
      }
    });
  }

  /** The design's rules for a damage instance (sections 5 and 7.5). */
  instance(i: { type: string; subtype?: string; element?: string; amount: S.NumT }, path: string, where: Where, inStatus: boolean) {
    if (i.type === "physical") {
      if (!i.subtype) this.r.error("instance.physical", path, `every physical instance has exactly one subtype (slash, pierce or blunt)`);
      if (i.element) this.r.error("instance.physical", `${path}.element`, `physical instances have no element`);
    } else if (i.type === "magical") {
      if (!i.element) this.r.error("instance.magical", path, `every magical instance has exactly one element`);
      if (i.subtype) this.r.error("instance.magical", `${path}.subtype`, `magical instances have no subtype`);
    } else if (where === "action") {
      this.r.error("instance.untyped", `${path}.type`, `every damage instance an action produces is physical or magical`);
    }
    if (i.element) this.w.ref("elements", i.element, `${path}.element`, "element");
    this.num(i.amount, `${path}.amount`, where, inStatus);
  }

  unitCond(c: S.UnitCondT, path: string) {
    for (const k of ["has", "lacks"] as const) {
      const v = c[k];
      if (v !== undefined) (Array.isArray(v) ? v : [v]).forEach((id, i) => this.w.ref("statuses", id, Array.isArray(v) ? `${path}.${k}[${i}]` : `${path}.${k}`, "status"));
    }
    if (c.stacks) this.w.ref("statuses", c.stacks.status, `${path}.stacks.status`, "status");
    for (const k of ["atCap", "belowCap"] as const) {
      const id = c[k];
      if (id === undefined) continue;
      if (this.w.ref("statuses", id, `${path}.${k}`, "status")) {
        const st = this.ix.get<S.StatusT>("statuses", id)!;
        if (st.stacking !== "intensity" || st.cap === undefined) this.r.error("cond.cap", `${path}.${k}`, `'${id}' isn't an Intensity status with a cap`);
      }
    }
  }

  rule(t: S.TargetRuleT, path: string, opts: { main?: boolean } = {}) {
    if (t.where) this.unitCond(t.where, `${path}.where`);
    if (t.ifNone && !t.where) this.r.error("target.ifNone", `${path}.ifNone`, `ifNone only means something with a where filter`);
    if (t.exclude && opts.main) this.r.error("target.exclude", `${path}.exclude`, `an action's own target rule has no earlier targets to exclude; use it on an effect's 'to' or a strike`);
    if ((t.pick === "lowest" || t.pick === "highest") && !t.by) this.r.error("target.by", path, `pick ${t.pick} needs 'by'`);
    if (t.by && typeof t.by === "object") {
      if ("stat" in t.by) this.statKey(t.by.stat, `${path}.by.stat`);
      else if ("stats" in t.by) t.by.stats.forEach((k, i) => this.statKey(k, `${path}.by.stats[${i}]`));
      else this.w.ref("statuses", t.by.stacks, `${path}.by.stacks`, "status");
    }
    if (t.side === "self" && t.count && t.count > 1) this.r.warn("target.count", path, `side self has one unit`);
  }

  apply(a: S.ApplyT, path: string, where: Where, inStatus: boolean) {
    if (!this.w.ref("statuses", a.status, `${path}.status`, "status")) return;
    const st = this.ix.get<S.StatusT>("statuses", a.status)!;
    if (a.stacks !== undefined) {
      if (st.stacking !== "intensity") this.r.error("apply.stacks", `${path}.stacks`, `'${a.status}' isn't an Intensity status, so it has no stacks to add`);
      // Stacks scale from whatever the applier states, Attack and Magic included; nothing scales them by default.
      this.num(a.stacks, `${path}.stacks`, where, inStatus);
    }
    if (a.duration === 0 && !st.lockout?.interrupt) {
      this.r.error("apply.instant", `${path}.duration`, `only a lockout set to interrupt can be applied for 0 ticks (an instant interrupt)`);
    }
    if (typeof a.duration === "number") this.ticks(a.duration, `${path}.duration`);
  }

  effect(e: S.EffectT, path: string, where: Where, st: S.StatusT | null, action?: S.AbilityT) {
    const inStatus = !!st;
    const to = "to" in e ? e.to : undefined;
    if (typeof to === "object") this.rule(to, `${path}.to`);
    else if (to) {
      if (where === "action" && ["holder", "source", "other"].includes(to)) this.r.error("effect.to", `${path}.to`, `'${to}' only means something inside a status`);
      if (where !== "action" && to === "target") this.r.error("effect.to", `${path}.to`, `'target' is an action's targets; in a status, use holder, self, other or a rule`);
      if (where === "pulse" && to === "other") this.r.error("effect.to", `${path}.to`, `a pulse has no event, so no 'other' unit`);
      if (to === "source" && (!st || shared(st))) this.r.error("effect.to", `${path}.to`, `only statuses with one applier at a time (Refresh, Fizzle, Per source) know their source`);
    }
    if (where === "reaction" && to === undefined && e.op !== "summon") this.r.error("reaction.to", path, `a reaction's effects state their target (holder, self, other, source or a rule)`);
    switch (e.op) {
      case "damage":
        this.instance(e, path, where, inStatus);
        if (where !== "action" && (e.hits || e.riders || e.apply)) this.r.error("effect.hitOnly", path, `hits, riders and attached statuses belong to an action's hits`);
        e.riders?.forEach((x, i) => this.instance(x, `${path}.riders[${i}]`, where, inStatus));
        e.apply?.forEach((x, i) => this.apply(x, `${path}.apply[${i}]`, where, inStatus));
        break;
      case "heal":
      case "mp":
        this.num(e.amount, `${path}.amount`, where, inStatus);
        break;
      case "apply":
        this.apply(e, path, where, inStatus);
        break;
      case "remove":
        if (e.status) this.w.ref("statuses", e.status, `${path}.status`, "status");
        if (e.tag && !e.kind) this.r.error("remove.tag", `${path}.tag`, `a tag narrows an effect kind; give the kind too`);
        break;
      case "revive": {
        this.num(e.hp, `${path}.hp`, where, inStatus);
        // Its targets must be knocked-out units: a rule asking for ko, or an action whose own target rule does.
        const asks = (rule: unknown) => typeof rule === "object" && rule !== null && (rule as S.TargetRuleT).where?.ko === true;
        const ok = typeof to === "object" ? asks(to) : (to === undefined || to === "target") && where === "action" && asks(action?.target);
        if (!ok) this.r.error("revive.target", path, `a revive targets knocked-out units: its rule (or the ability's target) must ask for 'ko: true'`);
        break;
      }
      case "summon":
      case "replace":
        this.w.ref("enemies", e.enemy, `${path}.enemy`, "enemy");
        break;
    }
  }

  event(spec: S.EventSpecT, path: string) {
    if (spec.kind && !ACTION_EVENTS.includes(spec.event) && !HIT_EVENTS.includes(spec.event)) this.r.error("event.kind", `${path}.kind`, `only action and hit events have a kind`);
    if (spec.tags && !HIT_EVENTS.includes(spec.event)) this.r.error("event.tags", `${path}.tags`, `only hit events carry tags`);
    if (spec.status) {
      if (!STATUS_EVENTS.includes(spec.event) && !DAMAGE_EVENTS.includes(spec.event)) this.r.error("event.status", `${path}.status`, `only status and damage events name a status`);
      this.w.ref("statuses", spec.status, `${path}.status`, "status");
    }
    if (spec.cause && spec.event !== "status_ended") this.r.error("event.cause", `${path}.cause`, `only status_ended has a cause`);
  }

  /** Tags that boosts, modifiers, lockouts, riders and event filters can name. */
  knownTags(): Set<string> {
    return new Set([...RESERVED_TAGS, ...this.pack.elements.map((e) => e.id), ...this.pack.statuses.flatMap((s) => [s.id, ...(s.tags ?? [])])]);
  }

  registries() {
    const pack = this.pack;
    const known = new Map(pack.stats.map((s) => [s.id, s]));
    for (const [id, [kind]] of Object.entries(S.ENGINE_STATS)) {
      const d = known.get(id);
      if (!d) this.r.error("stat.engine", "stats", `the engine reads stat '${id}'; add it to the registry (kind ${kind})`);
      else if (d.kind !== kind) this.r.error("stat.engine", `stats[${pack.stats.indexOf(d)}].kind`, `'${id}' is counted as ${kind}`);
    }
    pack.stats.forEach((s, i) => {
      const p = `stats[${i}]`;
      if (s.floor !== undefined && s.cap !== undefined && s.floor > s.cap) this.r.error("stat.range", p, `floor is above cap`);
      if (s.brings) this.w.ref("statuses", s.brings, `${p}.brings`, "status");
    });
    const aggro = known.get("aggro");
    if (aggro && !(aggro.floor !== undefined && aggro.floor > 0)) {
      this.r.error("stat.aggroFloor", `stats[${pack.stats.indexOf(aggro)}].floor`, `Aggro's floor must be above 0: weighted picks fail when every candidate is at 0`);
    }
    const hp = known.get("max_hp");
    if (hp && !(hp.floor !== undefined && hp.floor >= 1)) this.r.error("stat.hpFloor", `stats[${pack.stats.indexOf(hp)}].floor`, `max HP's floor must be at least 1`);
    pack.elements.forEach((e, i) => {
      if (RESERVED_TAGS.includes(e.id)) this.r.error("element.reserved", `elements[${i}]`, `'${e.id}' is already a tag (${RESERVED_TAGS.join(", ")})`);
    });
    pack.weaponKinds.forEach((k, i) => {
      const p = `weaponKinds[${i}]`;
      this.instance({ ...k, amount: 0 }, p, "action", false);
      this.ticks(k.cooldown, `${p}.cooldown`);
    });
    const rs = pack.ruleset;
    this.weapon(rs.unarmed, "ruleset.unarmed");
    this.ticks(rs.abilityCast, "ruleset.abilityCast");
    this.ticks(rs.abilityRecovery, "ruleset.abilityRecovery");
    if (rs.taken.floor > rs.taken.cap) this.r.error("ruleset.taken", "ruleset.taken", `floor is above cap`);
  }

  /** A weapon: its kind's type and cooldown, or its own. */
  weapon(wp: S.WeaponT, path: string) {
    const k = wp.kind && this.w.ref("weaponKinds", wp.kind, `${path}.kind`, "weapon kind") ? this.ix.get<S.WeaponKindT>("weaponKinds", wp.kind)! : undefined;
    const type = wp.type ?? k?.type;
    if (!type) this.r.error("weapon.kind", path, `a weapon names a kind, or states its own type and cooldown`);
    if (wp.cooldown === undefined && !k) this.r.error("weapon.kind", path, `a weapon without a kind states its cooldown`);
    this.instance({ type: type ?? "physical", subtype: wp.subtype ?? k?.subtype, element: wp.element ?? k?.element, amount: wp.amount }, path, "action", false);
    wp.riders?.forEach((x, i) => this.instance(x, `${path}.riders[${i}]`, "action", false));
    wp.apply?.forEach((x, i) => this.apply(x, `${path}.apply[${i}]`, "action", false));
    this.ticks(wp.cooldown, `${path}.cooldown`);
    this.ticks(wp.cast, `${path}.cast`);
    this.ticks(wp.recovery, `${path}.recovery`);
  }

  grants(g: { stats?: S.FixedStatT[]; statuses?: string[] } | undefined, path: string) {
    g?.stats?.forEach((s, i) => this.statChange(s, `${path}.stats[${i}]`));
    g?.statuses?.forEach((s, i) => this.w.ref("statuses", s, `${path}.statuses[${i}]`, "status"));
  }

  statBlock(b: Record<string, number> | undefined, path: string) {
    for (const k of Object.keys(b ?? {})) this.statKey(k, `${path}.${k}`);
  }

  statuses() {
    const tags = this.knownTags();
    const tag = (t: string | undefined, path: string) => {
      if (t !== undefined && !tags.has(t)) this.r.warn("tag.unknown", path, `no instance or status carries the tag '${t}'`);
    };
    this.pack.statuses.forEach((st, i) => {
      const p = `statuses[${i}]`;
      this.shared = shared(st);
      const intensity = st.stacking === "intensity";
      if (st.element) this.w.ref("elements", st.element, `${p}.element`, "element");
      this.ticks(st.duration, `${p}.duration`);
      if (!intensity) {
        for (const k of ["cap", "absorb", "trigger", "drop"] as const) {
          if (st[k] !== undefined) this.r.error("status.intensity", `${p}.${k}`, `'${k}' belongs to Intensity statuses`);
        }
      } else {
        if (st.pulse && st.trigger) this.r.error("status.trigger", p, `an Intensity status has one trigger: its pulse or an event`);
        if (st.drop && !st.pulse && !st.trigger) this.r.error("status.drop", `${p}.drop`, `a drop needs a trigger: a pulse or an event`);
        if (st.trigger && !st.drop && !st.trigger.do?.length) this.r.warn("status.trigger", `${p}.trigger`, `a trigger with no effects and no drop does nothing`);
      }
      if (st.pulse && !st.pulse.do?.length && !(intensity && st.drop)) this.r.error("status.pulse", `${p}.pulse`, `a pulse with no effects is only a timer for an Intensity drop`);
      if (shared(st)) {
        if (st.reactions?.some((x) => x.actor === "source")) this.r.error("status.source", `${p}.reactions`, `a shared Intensity total has no single source to act`);
        if (st.crit?.fromSource) this.r.error("status.source", `${p}.crit`, `a shared Intensity total has no single source's crit stats to use`);
      }
      if (st.crit && !st.pulse && !st.trigger) this.r.warn("status.crit", `${p}.crit`, `crits apply to pulses and triggers; this status has neither`);
      if (st.cap !== undefined) this.num(st.cap, `${p}.cap`, "pulse", true);
      st.stats?.forEach((ch, j) => {
        this.statChange(ch, `${p}.stats[${j}]`);
        if (ch.flat !== undefined) this.num(ch.flat, `${p}.stats[${j}].flat`, "pulse", true);
        if (ch.pct !== undefined) this.num(ch.pct, `${p}.stats[${j}].pct`, "pulse", true);
      });
      st.boosts?.forEach((b, j) => {
        tag(b.tag, `${p}.boosts[${j}].tag`);
        this.num(b.pct, `${p}.boosts[${j}].pct`, "pulse", true);
      });
      st.taken?.forEach((t, j) => {
        tag(t.tag, `${p}.taken[${j}].tag`);
        this.num(t.pct, `${p}.taken[${j}].pct`, "pulse", true);
      });
      if (st.lockout) tag(st.lockout.covers, `${p}.lockout.covers`);
      if (st.seek !== undefined && !["basic", "ability", "all"].includes(st.seek)) this.r.error("status.seek", `${p}.seek`, `seek covers basic, ability or all`);
      if (st.strike) {
        if (st.strike.scale) this.statKey(st.strike.scale, `${p}.strike.scale`);
        if (typeof st.strike.to === "object") this.rule(st.strike.to, `${p}.strike.to`);
      }
      st.riders?.forEach((x, j) => {
        tag(x.on, `${p}.riders[${j}].on`);
        this.instance(x.add, `${p}.riders[${j}].add`, "action", true);
      });
      if (st.convert?.element) this.w.ref("elements", st.convert.element, `${p}.convert.element`, "element");
      if (st.pulse) {
        this.ticks(st.pulse.every, `${p}.pulse.every`);
        st.pulse.do?.forEach((e, j) => this.effect(e, `${p}.pulse.do[${j}]`, "pulse", st));
      }
      if (st.trigger) {
        this.event(st.trigger.on, `${p}.trigger.on`);
        st.trigger.do?.forEach((e, j) => this.effect(e, `${p}.trigger.do[${j}]`, "pulse", st));
      }
      st.reactions?.forEach((x, j) => {
        this.event(x.on, `${p}.reactions[${j}].on`);
        if (x.on.event === "status_ended" && !x.on.status && (x.on.whose ?? "holder") === "holder") {
          this.r.warn("reaction.anyEnding", `${p}.reactions[${j}].on`, `a reaction to status_ended with no status fires for every status that ends on the unit; name one (its own id, for "when I end")`);
        }
        x.on.tags?.forEach((t, k) => tag(t, `${p}.reactions[${j}].on.tags[${k}]`));
        x.do.forEach((e, k) => this.effect(e, `${p}.reactions[${j}].do[${k}]`, "reaction", st));
      });
      const empty = !st.stats && !st.boosts && !st.taken && !st.absorb && !st.block && !st.lockout && !st.riders && !st.convert && !st.seek && !st.strike && !st.pulse && !st.trigger && !st.reactions;
      if (empty) this.r.warn("status.empty", p, `status '${st.id}' has no effects`);
    });
    this.shared = false;
  }

  abilities() {
    this.pack.abilities.forEach((a, i) => {
      const p = `abilities[${i}]`;
      if (a.class) this.w.ref("classes", a.class, `${p}.class`, "class");
      this.ticks(a.cast, `${p}.cast`);
      this.ticks(a.cooldown, `${p}.cooldown`);
      this.ticks(a.recovery, `${p}.recovery`);
      if (a.if) this.unitCond(a.if.where, `${p}.if.where`);
      if (typeof a.target === "object") this.rule(a.target, `${p}.target`, { main: true });
      a.do.forEach((e, j) => this.effect(e, `${p}.do[${j}]`, "action", null, a));
    });
  }
}

// ─── Classes ─────────────────────────────────────────────────────────────────

function checkUnits(pack: Pack, ix: Index, w: Walker, r: Report, c: Combat) {
  const d = pack.design;
  pack.classes.forEach((cl, i) => {
    const p = `classes[${i}]`;
    c.statBlock(cl.stats, `${p}.stats`);
    c.grants(cl.passive, `${p}.passive`);
    cl.weapons.forEach((k, j) => w.ref("weaponKinds", k, `${p}.weapons[${j}]`, "weapon kind"));
    if (new Set(cl.weapons).size !== cl.weapons.length) r.error("class.weapons", `${p}.weapons`, `a weapon kind is listed twice`);
    if (cl.abilities.length !== d.abilitiesPerClass) {
      r.error("class.abilityCount", `${p}.abilities`, `'${cl.id}' has ${cl.abilities.length} abilities; every class has ${d.abilitiesPerClass}`);
    }
    if (new Set(cl.abilities).size !== cl.abilities.length) r.error("class.abilityDuplicate", `${p}.abilities`, `an ability is listed twice`);
    cl.abilities.forEach((aid, j) => {
      if (!w.ref("abilities", aid, `${p}.abilities[${j}]`, "ability")) return;
      const a = ix.get<S.AbilityT>("abilities", aid)!;
      if (a.class !== cl.id) {
        r.error("class.abilityClass", `${p}.abilities[${j}]`, `ability '${aid}' belongs to class '${a.class ?? "none"}', not '${cl.id}'; abilities don't cross classes`);
      }
    });
  });

  pack.abilities.forEach((a, i) => {
    const used = pack.classes.some((cl) => cl.abilities.includes(a.id)) || pack.enemies.some((e) => e.abilities?.includes(a.id));
    if (!used) r.warn("ability.unused", `abilities[${i}]`, `no class or enemy lists ability '${a.id}'`);
  });
}

// ─── Gear ────────────────────────────────────────────────────────────────────

function checkGear(pack: Pack, ix: Index, w: Walker, r: Report, c: Combat) {
  pack.gear.forEach((g, i) => {
    const p = `gear[${i}]`;
    if (g.slot === "weapon") {
      if (!g.weapon) r.error("gear.weapon", p, `a weapon sets the basic attack: give it 'weapon'`);
      else if (!g.weapon.kind) r.error("gear.weapon", `${p}.weapon`, `a weapon piece belongs to a kind`);
    } else if (g.weapon) r.error("gear.weapon", `${p}.weapon`, `only the weapon slot sets a basic attack`);
    if (g.slot === "armor") {
      if (!g.weight) r.error("gear.weight", p, `armor has a weight (light, medium or heavy)`);
    } else if (g.weight) r.error("gear.weight", `${p}.weight`, `only armor has a weight`);
    const okSource = g.tier === "ordinary" ? g.source !== "unlock" : g.source === "unlock";
    if (!okSource) r.error("gear.source", `${p}.source`, `${g.tier} gear can't come from '${g.source}' (ordinary: starter or drop; powerful: unlock)`);
    if (g.weapon) c.weapon(g.weapon, `${p}.weapon`);
    c.grants(g, p);
  });
  const ids = new Set(pack.gear.map((g) => g.id));
  for (const cl of pack.classes) {
    // Each class arrives with the plain weapon of its first kind: a starter piece of that kind must exist.
    const plain = pack.gear.find((g) => g.slot === "weapon" && g.source === "starter" && g.weapon?.kind === cl.weapons[0]);
    if (!plain) r.warn("gear.plain", "gear", `no starter weapon of kind '${cl.weapons[0]}' for the ${cl.id} to arrive with`);
  }
  pack.starter.gear.forEach((id, i) => {
    if (ids.has(id) && ix.get<S.GearT>("gear", id)!.source !== "starter") r.error("starter.source", `starter.gear[${i}]`, `'${id}' isn't starter gear`);
  });
  void w;
}

// ─── Formations ──────────────────────────────────────────────────────────────

function checkFormations(pack: Pack, r: Report, c: Combat) {
  pack.formations.forEach((f, i) => {
    const p = `formations[${i}]`;
    if (f.positions.length !== pack.design.formationPositions) {
      r.error("formation.positions", `${p}.positions`, `'${f.id}' has ${f.positions.length} positions; formations always have ${pack.design.formationPositions}`);
    }
    const ids = new Set<string>();
    const cells = new Set<string>();
    f.positions.forEach((pos, j) => {
      const pp = `${p}.positions[${j}]`;
      if (ids.has(pos.id)) r.error("formation.positionId", pp, `duplicate position id '${pos.id}'`);
      ids.add(pos.id);
      const cell = `${pos.layout.line}:${pos.layout.column}`;
      if (cells.has(cell)) r.error("formation.layout", `${pp}.layout`, `two slots are drawn in the same place (${pos.layout.line}, column ${pos.layout.column})`);
      cells.add(cell);
      c.grants(pos, pp);
      if ((pos.stats?.length || pos.statuses?.length) && !pos.text) r.warn("formation.slotText", pp, `slot '${pos.id}' has effects but no text telling the player what it does`);
    });
    c.grants(f, p);
  });
}

// ─── Enemies ─────────────────────────────────────────────────────────────────

function checkEnemies(pack: Pack, w: Walker, r: Report, c: Combat) {
  pack.enemies.forEach((e, i) => {
    const p = `enemies[${i}]`;
    c.statBlock(e.stats, `${p}.stats`);
    if (e.weapon) c.weapon(e.weapon, `${p}.weapon`);
    e.abilities?.forEach((a, j) => w.ref("abilities", a, `${p}.abilities[${j}]`, "ability"));
    e.statuses?.forEach((s, j) => w.ref("statuses", s, `${p}.statuses[${j}]`, "status"));
  });
  void r;
}

// ─── Perks ───────────────────────────────────────────────────────────────────

function checkPerks(pack: Pack, ix: Index, w: Walker, r: Report, c: Combat) {
  pack.perks.forEach((pk, i) => {
    const p = `perks[${i}]`;
    w.ref("perkFamilies", pk.family, `${p}.family`, "perk family");
    if (pk.upgradeOf) {
      if (pk.rarity !== "premium") r.error("perk.upgradeOf", `${p}.upgradeOf`, `only premium perks upgrade another perk`);
      if (w.ref("perks", pk.upgradeOf, `${p}.upgradeOf`, "perk")) {
        const base = ix.get<S.PerkT>("perks", pk.upgradeOf)!;
        if (base.rarity !== "regular") r.error("perk.upgradeOf", `${p}.upgradeOf`, `'${pk.upgradeOf}' must be a regular perk`);
        if (base.family !== pk.family) r.warn("perk.upgradeFamily", `${p}.upgradeOf`, `upgrades a perk from another family`);
      }
    }
    if (!pk.stats?.length && !pk.statuses?.length) r.error("perk.empty", p, `perk '${pk.id}' gives no stats and no statuses`);
    pk.for?.classes?.forEach((cl, j) => w.ref("classes", cl, `${p}.for.classes[${j}]`, "class"));
    c.grants(pk, p);
    if (!pack.dungeons.some((dn) => dn.perkPool.includes(pk.id))) r.warn("perk.unused", p, `perk '${pk.id}' isn't in any dungeon's pool`);
  });
}

// ─── Dungeons and challenges ─────────────────────────────────────────────────

function checkLoot(pack: Pack, ix: Index, w: Walker, r: Report, t: S.LootTableT, path: string) {
  const ids = [...(t.guaranteed ?? []).map((g, i) => [g, `${path}.guaranteed[${i}]`]), ...(t.table ?? []).map((e, i) => [e.gear, `${path}.table[${i}].gear`])];
  for (const [g, p] of ids) {
    if (!w.ref("gear", g, p, "gear")) continue;
    const gear = ix.get<S.GearT>("gear", g)!;
    if (gear.source !== "drop") r.error("loot.source", p, `'${g}' is ${gear.source} gear; loot tables only drop 'drop' gear`);
  }
  const rolls = t.rolls ?? 0;
  if (rolls > 0 && !t.table?.length) r.error("loot.table", path, `${rolls} roll(s) but no table`);
  if (rolls === 0 && t.table?.length) r.warn("loot.table", path, `a table with no rolls never drops`);
  if (!t.guaranteed?.length && rolls === 0) r.error("loot.empty", path, `this clear must pay gear`);
  void pack;
}

function checkDungeons(pack: Pack, ix: Index, w: Walker, r: Report) {
  const d = pack.design;
  pack.dungeons.forEach((dn, i) => {
    const p = `dungeons[${i}]`;
    const cap = dn.partySize.max;
    if (cap < d.partySize[0] || cap > d.partySize[1]) r.error("dungeon.partySize", `${p}.partySize.max`, `party size ${cap} is outside ${d.partySize[0]}–${d.partySize[1]}`);

    // Stages
    const stageIds = new Set<string>();
    dn.stages.forEach((s, j) => {
      if (stageIds.has(s.id)) r.error("dungeon.stageId", `${p}.stages[${j}]`, `duplicate stage id '${s.id}'`);
      stageIds.add(s.id);
    });
    const kinds = dn.stages.map((s) => s.kind);
    const picks = kinds.filter((k) => k === "perk_pick").length;
    if (picks < d.perkPicksPerRun[0] || picks > d.perkPicksPerRun[1]) {
      r.error("dungeon.perkPicks", `${p}.stages`, `${picks} perk picks; runs have ${d.perkPicksPerRun[0]}–${d.perkPicksPerRun[1]}`);
    }
    kinds.forEach((k, j) => {
      if ((k === "perk_pick" || k === "campfire") && (kinds[j - 1] !== "fight" || kinds[j + 1] !== "fight")) {
        r.error("dungeon.stageOrder", `${p}.stages[${j}]`, `${k === "campfire" ? "a campfire sits" : "perk picks happen"} between two fights`);
      }
    });
    if (kinds.filter((k) => k === "campfire").length > 1) r.error("dungeon.campfires", `${p}.stages`, `a run has at most one campfire`);
    const bosses = dn.stages.flatMap((s, j) => (s.kind === "fight" && s.boss ? [j] : []));
    if (bosses.length !== 1 || bosses[0] !== dn.stages.length - 1) r.error("dungeon.boss", `${p}.stages`, `a run ends in exactly one boss fight, as its last stage`);

    dn.stages.forEach((s, j) => {
      if (s.kind !== "fight") return;
      const sp = `${p}.stages[${j}]`;
      if (s.enemies.length > pack.ruleset.maxEnemies) r.error("fight.size", `${sp}.enemies`, `${s.enemies.length} enemies; ruleset.maxEnemies is ${pack.ruleset.maxEnemies}`);
      s.enemies.forEach((id, k) => w.ref("enemies", id, `${sp}.enemies[${k}]`, "enemy"));
      if (s.boss && !s.enemies.some((id) => ix.get<S.EnemyT>("enemies", id)?.rank === "boss")) {
        r.error("fight.bossRank", sp, `a boss fight needs an enemy of rank boss`);
      }
    });

    // Perk pool, only where the run picks perks
    const pool = dn.perkPool;
    if (new Set(pool).size !== pool.length) r.error("dungeon.perkPoolDuplicate", `${p}.perkPool`, `a perk appears twice`);
    pool.forEach((id, j) => w.ref("perks", id, `${p}.perkPool[${j}]`, "perk"));
    if (pool.length < d.perkPoolSize[0] || pool.length > d.perkPoolSize[1]) {
      r.error("dungeon.perkPool", `${p}.perkPool`, `pool has ${pool.length} perks; pools hold ${d.perkPoolSize[0]}–${d.perkPoolSize[1]}`);
    }
    if (picks > 0) {
      const regulars = pool.filter((id) => ix.get<S.PerkT>("perks", id)?.rarity === "regular");
      if (regulars.length < d.perkOptionsPerPick) r.error("dungeon.perkPoolRegular", `${p}.perkPool`, `fewer regular perks than options per pick`);
    }
    pool.forEach((id, j) => {
      const pk = ix.get<S.PerkT>("perks", id);
      if (pk?.upgradeOf && !pool.includes(pk.upgradeOf)) r.warn("dungeon.premiumBase", `${p}.perkPool[${j}]`, `premium '${id}' upgrades '${pk.upgradeOf}', which isn't in this pool`);
    });

    // Loot
    if (dn.loot) {
      checkLoot(pack, ix, w, r, dn.loot.firstClear, `${p}.loot.firstClear`);
      checkLoot(pack, ix, w, r, dn.loot.replay, `${p}.loot.replay`);
    }

    // Challenges
    const chIds = new Set<string>();
    dn.challenges.forEach((ch, j) => {
      const cp = `${p}.challenges[${j}]`;
      if (chIds.has(ch.id)) r.error("challenge.id", cp, `duplicate challenge id '${ch.id}'`);
      chIds.add(ch.id);
      checkLoot(pack, ix, w, r, ch.loot, `${cp}.loot`);
      let minUnits = 0;
      let maxUnits = cap;
      const included = new Set<string>();
      ch.constraints.forEach((c, k) => {
        const kp = `${cp}.constraints[${k}]`;
        if ("partySize" in c) {
          const { min, max } = c.partySize;
          if (min !== undefined && max !== undefined && min > max) r.error("challenge.impossible", kp, `min is above max`);
          if (min !== undefined && min > cap) r.error("challenge.impossible", kp, `needs ${min} units, but the dungeon allows ${cap}`);
          minUnits = Math.max(minUnits, min ?? 0);
          maxUnits = Math.min(maxUnits, max ?? cap);
        } else if ("includesClass" in c) {
          if (w.ref("classes", c.includesClass, `${kp}.includesClass`, "class")) included.add(c.includesClass);
        } else if ("excludesClass" in c) {
          w.ref("classes", c.excludesClass, `${kp}.excludesClass`, "class");
        } else if ("formation" in c) {
          w.ref("formations", c.formation, `${kp}.formation`, "formation");
        }
      });
      minUnits = Math.max(minUnits, included.size);
      if (minUnits > maxUnits) r.error("challenge.impossible", cp, `constraints need at least ${minUnits} units, but allow ${maxUnits}`);
      for (const k of ch.constraints) if ("excludesClass" in k && included.has(k.excludesClass)) r.error("challenge.impossible", cp, `class '${k.excludesClass}' is both required and excluded`);
    });
  });
}

// ─── Starter and progression ─────────────────────────────────────────────────

function checkStarterAndProgression(pack: Pack, ix: Index, w: Walker, r: Report) {
  const st = pack.starter;
  const pairs: [Coll, string[], { id: string; source: string }[], string][] = [
    ["classes", st.classes, pack.classes, "class"],
    ["formations", st.formations, pack.formations, "formation"],
    ["gear", st.gear, pack.gear, "gear"],
  ];
  for (const [coll, list, all, what] of pairs) {
    list.forEach((id, i) => {
      if (!w.ref(coll, id, `starter.${coll}[${i}]`, what)) return;
      if (ix.get<{ source: string }>(coll, id)!.source !== "starter") r.error("starter.source", `starter.${coll}[${i}]`, `'${id}' is listed as starter content but its source isn't 'starter'`);
    });
    all.forEach((x) => {
      if (x.source === "starter" && !list.includes(x.id)) r.error("starter.missing", `starter.${coll}`, `'${x.id}' has source 'starter' but isn't in the starter list`);
    });
  }

  const order = pack.progression.dungeonOrder;
  order.forEach((id, i) => w.ref("dungeons", id, `progression.dungeonOrder[${i}]`, "dungeon"));
  if (new Set(order).size !== order.length) r.error("progression.duplicate", "progression.dungeonOrder", `a dungeon appears twice`);
  const inCampaign = new Set(pack.campaign?.nodes.map((n) => n.dungeon) ?? []);
  pack.dungeons.forEach((dn) => {
    if (!order.includes(dn.id) && !inCampaign.has(dn.id)) r.error("progression.missing", "progression.dungeonOrder", `dungeon '${dn.id}' isn't in the progression order or the campaign`);
  });
  pack.dungeons.forEach((dn, i) => dn.foes?.statuses?.forEach((id, j) => w.ref("statuses", id, `dungeons[${i}].foes.statuses[${j}]`, "status")));
  if (pack.campaign) checkCampaign(pack, ix, w, r, pack.campaign);
}

/**
 * The campaign: every reference resolves, nothing is unlocked twice, and every node can be entered with what the
 * player owns by then (its required classes and formation are owned, and enough classes meet its armor and weapon needs).
 */
function checkCampaign(pack: Pack, ix: Index, w: Walker, r: Report, cp: S.CampaignT) {
  const owned = { classes: new Set<string>(), formations: new Set<string>(), gear: new Set<string>() };
  const take = (coll: "classes" | "formations" | "gear", ids: string[], path: string) =>
    ids.forEach((id, i) => {
      if (!w.ref(coll, id, `${path}[${i}]`, coll === "classes" ? "class" : coll === "gear" ? "gear" : "formation")) return;
      if (owned[coll].has(id)) r.error("campaign.twice", `${path}[${i}]`, `'${id}' is already owned by then`);
      owned[coll].add(id);
    });
  const plain = (cls: string) => {
    const k = ix.get<S.ClassDefT>("classes", cls);
    const g = k && pack.gear.find((x) => x.slot === "weapon" && x.source === "starter" && x.weapon?.kind === k.weapons[0]);
    if (g) owned.gear.add(g.id);
  };
  take("classes", cp.start.classes, "campaign.start.classes");
  take("formations", cp.start.formations, "campaign.start.formations");
  take("gear", cp.start.gear, "campaign.start.gear");
  cp.start.classes.forEach(plain);
  const ids = new Set<string>();
  cp.nodes.forEach((n, i) => {
    const p = `campaign.nodes[${i}]`;
    if (ids.has(n.id)) r.error("campaign.id", p, `duplicate node id '${n.id}'`);
    ids.add(n.id);
    w.ref("dungeons", n.dungeon, `${p}.dungeon`, "dungeon");
    const need = { includes: [] as string[], excludes: [] as string[] };
    let size = pack.dungeons.find((d) => d.id === n.dungeon)?.partySize.max ?? 3;
    n.needs.forEach((nd, j) => {
      const q = `${p}.needs[${j}]`;
      if ("includes" in nd) nd.includes.forEach((c, k) => w.ref("classes", c, `${q}.includes[${k}]`, "class") && (need.includes.push(c), !owned.classes.has(c) && r.error("campaign.unowned", q, `needs class '${c}', which isn't owned by then`)));
      else if ("excludes" in nd) nd.excludes.forEach((c, k) => w.ref("classes", c, `${q}.excludes[${k}]`, "class") && need.excludes.push(c));
      else if ("formation" in nd) w.ref("formations", nd.formation, `${q}.formation`, "formation") && !owned.formations.has(nd.formation) && r.error("campaign.unowned", q, `needs formation '${nd.formation}', which isn't owned by then`);
      else if ("weapons" in nd) nd.weapons.forEach((k, m) => w.ref("weaponKinds", k, `${q}.weapons[${m}]`, "weapon kind"));
      else if ("size" in nd) size = Math.min(size, nd.size);
    });
    if (need.includes.some((c) => need.excludes.includes(c))) r.error("campaign.impossible", p, `a class is both required and excluded`);
    if (need.includes.length > size) r.error("campaign.impossible", p, `needs ${need.includes.length} classes in a party of ${size}`);
    // Enough owned classes can meet the armor and weapon needs.
    const fits = [...owned.classes].filter((c) => !need.excludes.includes(c) && n.needs.every((nd) => {
      const k = ix.get<S.ClassDefT>("classes", c)!;
      if ("armor" in nd) return nd.armor === "none" || [...owned.gear].some((g) => { const x = ix.get<S.GearT>("gear", g); return !!x && x.slot === "armor" && x.weight === nd.armor && canEquip(k, x); });
      if ("weapons" in nd) return [...owned.gear].some((g) => { const x = ix.get<S.GearT>("gear", g); return !!x && x.slot === "weapon" && !!x.weapon?.kind && nd.weapons.includes(x.weapon.kind) && canEquip(k, x); });
      return true;
    }));
    if (need.includes.some((c) => !fits.includes(c))) r.error("campaign.impossible", p, `a required class can't meet the node's armor or weapon needs with the gear owned by then`);
    take("classes", n.rewards.classes, `${p}.rewards.classes`);
    take("formations", n.rewards.formations, `${p}.rewards.formations`);
    take("gear", n.rewards.gear, `${p}.rewards.gear`);
    n.rewards.classes.forEach(plain);
  });
}

// ─── Totals for a full content set ───────────────────────────────────────────

function checkComplete(pack: Pack, r: Report) {
  const c = pack.design.complete;
  const inRange = (n: number, rg: [number, number]) => n >= rg[0] && n <= rg[1];
  if (!inRange(pack.classes.length, c.classes)) r.error("complete.classes", "classes", `${pack.classes.length} classes; a full set has ${c.classes[0]}–${c.classes[1]}`);
}

// ─── Unused registry entries ─────────────────────────────────────────────────

function checkUnused(pack: Pack, ix: Index, r: Report) {
  const used = (c: Coll) => ix.used.get(c)!;
  pack.statuses.forEach((s, i) => !used("statuses").has(s.id) && r.warn("status.unused", `statuses[${i}]`, `nothing applies or reads status '${s.id}'`));
  pack.weaponKinds.forEach((k, i) => !used("weaponKinds").has(k.id) && r.warn("weaponKind.unused", `weaponKinds[${i}]`, `no class or weapon uses kind '${k.id}'`));
  pack.perkFamilies.forEach((f, i) => !pack.perks.some((p) => p.family === f.id) && r.warn("perkFamily.unused", `perkFamilies[${i}]`, `family '${f.id}' has no perks`));
}

// ─────────────────────────────────────────────────────────────────────────────
// Party loadouts and challenges (engine input, checked against a valid pack)
// ─────────────────────────────────────────────────────────────────────────────

/** What a player owns. Gear is a count per item: copies can be equipped up to that count. */
export type Owned = { classes?: string[]; formations?: string[]; gear?: Record<string, number> };

/** Can this class equip this piece? Weapons by kind, armor by weight, amulets always. */
export function canEquip(cls: S.ClassDefT, g: S.GearT): boolean {
  if (g.slot === "weapon") return !!g.weapon?.kind && cls.weapons.includes(g.weapon.kind);
  if (g.slot === "armor") return !!g.weight && WEIGHT_ORDER[g.weight] <= WEIGHT_ORDER[cls.armor];
  return true;
}

export function checkParty(pack: Pack, raw: unknown, opts: { dungeon?: string; owned?: Owned } = {}): Issue[] {
  const parsed = S.Party.safeParse(raw);
  if (!parsed.success) {
    return parsed.error.issues.map((i) => ({ level: "error" as const, code: "schema", path: i.path.join("."), message: i.message }));
  }
  const party = parsed.data;
  const r = new Report();
  const ix = new Index(pack);
  const d = pack.design;
  const formation = ix.get<S.FormationT>("formations", party.formation);
  if (!formation) r.error("ref.missing", "formation", `unknown formation '${party.formation}'`);
  if (opts.owned?.formations && !opts.owned.formations.includes(party.formation)) r.error("party.notOwned", "formation", `formation '${party.formation}' isn't owned`);

  const cap = opts.dungeon ? ix.get<S.DungeonT>("dungeons", opts.dungeon)?.partySize.max : d.partySize[1];
  if (cap !== undefined && party.units.length > cap) r.error("party.size", "units", `${party.units.length} units; this dungeon allows ${cap}`);

  const classes = new Set<string>();
  const positions = new Set<string>();
  const gearUse = new Map<string, number>();
  party.units.forEach((u, i) => {
    const p = `units[${i}]`;
    const cls = ix.get<S.ClassDefT>("classes", u.class);
    if (!cls) return r.error("ref.missing", `${p}.class`, `unknown class '${u.class}'`);
    if (classes.has(u.class)) r.error("party.uniqueClass", `${p}.class`, `'${u.class}' is already in the party; each class is one unit`);
    classes.add(u.class);
    if (opts.owned?.classes && !opts.owned.classes.includes(u.class)) r.error("party.notOwned", `${p}.class`, `'${u.class}' isn't owned`);

    if (formation && !formation.positions.some((x) => x.id === u.position)) r.error("party.position", `${p}.position`, `formation '${formation.id}' has no position '${u.position}'`);
    if (positions.has(u.position)) r.error("party.position", `${p}.position`, `position '${u.position}' is already taken`);
    positions.add(u.position);

    if (u.abilities.length !== d.abilitiesEquipped) r.error("party.abilities", `${p}.abilities`, `${u.abilities.length} abilities equipped; units equip ${d.abilitiesEquipped}`);
    if (new Set(u.abilities).size !== u.abilities.length) r.error("party.abilities", `${p}.abilities`, `an ability is equipped twice`);
    u.abilities.forEach((a, j) => {
      if (!cls.abilities.includes(a)) r.error("party.abilityNotOwned", `${p}.abilities[${j}]`, `'${u.class}' doesn't have ability '${a}'`);
    });

    for (const [slot, gid] of Object.entries(u.gear)) {
      const gp = `${p}.gear.${slot}`;
      if (!(slot in S.SLOTS)) r.error("party.slot", gp, `there's no slot '${slot}': units carry a weapon, armor and an amulet`);
      const g = ix.get<S.GearT>("gear", gid);
      if (!g) {
        r.error("ref.missing", gp, `unknown gear '${gid}'`);
        continue;
      }
      if (g.slot !== slot) r.error("party.gearSlot", gp, `'${gid}' goes in slot '${g.slot}', not '${slot}'`);
      else if (!canEquip(cls, g)) {
        r.error("party.gearClass", gp, g.slot === "weapon" ? `a ${u.class} can't use a ${g.weapon?.kind}` : `a ${u.class} can wear ${cls.armor} armor at most, not ${g.weight}`);
      }
      gearUse.set(gid, (gearUse.get(gid) ?? 0) + 1);
    }
  });
  if (opts.owned?.gear) {
    for (const [gid, n] of gearUse) {
      const have = opts.owned.gear[gid] ?? 0;
      if (n > have) r.error("party.gearCount", "units", `'${gid}' is equipped ${n} times, but ${have} ${have === 1 ? "is" : "are"} owned`);
    }
  }
  return r.issues;
}

/** Which of a challenge's constraints a party misses. Empty: the party qualifies. */
export function unmetConstraints(pack: Pack, party: S.Party, dungeonId: string, challengeId: string): string[] {
  const ix = new Index(pack);
  const ch = ix.get<S.DungeonT>("dungeons", dungeonId)?.challenges.find((c) => c.id === challengeId);
  if (!ch) return [`unknown challenge '${dungeonId}/${challengeId}'`];
  const out: string[] = [];
  for (const c of ch.constraints) {
    if ("partySize" in c) {
      const n = party.units.length;
      if ((c.partySize.min !== undefined && n < c.partySize.min) || (c.partySize.max !== undefined && n > c.partySize.max)) out.push(`party size ${n}`);
    } else if ("includesClass" in c) {
      if (!party.units.some((u) => u.class === c.includesClass)) out.push(`no ${c.includesClass}`);
    } else if ("excludesClass" in c) {
      if (party.units.some((u) => u.class === c.excludesClass)) out.push(`includes a ${c.excludesClass}`);
    } else if ("formation" in c) {
      if (party.formation !== c.formation) out.push(`formation is ${party.formation}`);
    }
  }
  return out;
}

export type Teaser = { teased: boolean; needs: string[] };

/** Is this challenge a teaser for a player who owns `owned`? Lists the unlocks they'd need. */
export function teaser(pack: Pack, dungeonId: string, challengeId: string, owned: Owned): Teaser {
  const ix = new Index(pack);
  const ch = ix.get<S.DungeonT>("dungeons", dungeonId)?.challenges.find((c) => c.id === challengeId);
  if (!ch) return { teased: false, needs: [`unknown challenge '${dungeonId}/${challengeId}'`] };
  const ownedClasses = new Set(owned.classes ?? []);
  const needs: string[] = [];
  for (const c of ch.constraints) {
    if ("includesClass" in c && !ownedClasses.has(c.includesClass)) needs.push(`class ${c.includesClass}`);
    if ("formation" in c && owned.formations && !owned.formations.includes(c.formation)) needs.push(`formation ${c.formation}`);
  }
  return { teased: needs.length > 0, needs };
}
