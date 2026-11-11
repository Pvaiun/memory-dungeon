/** The combat rule language: what's valid in numbers, conditions, targeting, effects, statuses and actions (docs/core-set/rules-and-vocabulary.md). */
import * as S from "../schema.js";
import type { Index, Pack, Report, Walker } from "./core.js";

// ─────────────────────────────────────────────────────────────────────────────
// The combat rule language
// ─────────────────────────────────────────────────────────────────────────────

/** An Intensity total that every applier adds into: it has no single source. */
const shared = (st: S.StatusT) => st.stacking === "intensity" && !st.perSource;

/** Where a number, effect or rule sits: in an action, a status's pulse or trigger, or a reaction. */
type Where = "action" | "pulse" | "reaction";

const ACTION_EVENTS = ["action_start", "action_resolve", "action_interrupted"];
const HIT_EVENTS = ["hit_lands", "hit_taken", "hit_evaded", "hit_missed"];
const STATUS_EVENTS = ["status_gained", "status_triggered", "status_ended", "status_capped"];
const DAMAGE_EVENTS = ["damage_dealt", "damage_taken"];
const RESERVED_TAGS = ["basic", "ability", "extra", "bonus", "wide", "bare", "pulse", "physical", "none", "healing", "all", "crit", "area"];
/** Events with a kind besides action and hit events (the killing hit's, the healing action's). */
const KIND_EVENTS = [...ACTION_EVENTS, ...HIT_EVENTS, "ko", "healed", "overhealed"];
/** Events that carry tags: a hit's, the killing hit's, a heal's `pulse`, a status gained's `area`. */
const TAG_EVENTS = [...HIT_EVENTS, "ko", "healed", "overhealed", "status_gained"];
/** Events that carry an amount. */
const AMOUNT_EVENTS = ["action_resolve", "hit_lands", "hit_taken", ...DAMAGE_EVENTS, "hp_lost", "hp_paid", "mp_gained", "mp_over", "healed", "overhealed", "status_gained", "status_ended", "status_capped", "ko"];
/** Events that can be a repeat: a recast's action, the opening made to happen again, a copy of a status. */
const REPEAT_EVENTS = [...ACTION_EVENTS, "fight_start", "status_gained"];
/** The HP line events, which name their line. */
const LINE_EVENTS = ["hp_low", "hp_high"];
/** The relative seats a seat field can name; no formation's position may take these ids. */
export const RELATIVE_SEATS = ["next", "previous"];
/** What an ability filter's `does` can name besides a status. */
const DOES = ["revive", "heal", "damage"];

export class Combat {
  constructor(readonly pack: Pack, readonly ix: Index, readonly w: Walker, readonly r: Report) {}
  /** Set while checking a status that is a shared Intensity total. */
  shared = false;

  /** A stat key: a registry stat, or a family member whose parts exist. */
  statKey(key: string, path: string): S.StatDefT | null {
    const [head, ...rest] = key.split(":");
    if (!rest.length) return this.w.ref("stats", key, path, "stat") ? this.ix.get<S.StatDefT>("stats", key)! : null;
    if (head === "immune" && rest[0] === "status" && rest.length === 2) this.w.ref("statuses", rest[1], path, "status");
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
      if (s.count !== undefined) {
        if (s.count === "targets" && where !== "action") this.r.error("scale.count", `${p}.count`, `'targets' counts an action's targets: only an action has them`);
        if (s.count === "hit" && where === "pulse") this.r.error("scale.count", `${p}.count`, `'hit' counts the units an action's hits landed on: an action has them, and a reaction to action_resolve`);
        if (typeof s.count === "object") {
          if (s.count.where) this.unitCond(s.count.where, `${p}.count.where`);
          if (s.count.seat) this.seat(s.count.seat, `${p}.count.seat`);
          if (s.count.stacks) this.w.ref("statuses", s.count.stacks, `${p}.count.stacks`, "status");
        }
      }
      if (s.event && where !== "reaction") this.r.error("scale.event", p, `only a reaction to a hit has its raw amount, or what was stopped of it, to scale from`);
      if (s.seat !== undefined) {
        if (!inStatus) this.r.error("scale.seat", `${p}.seat`, `a seat is read from a status's holder: it only means something inside a status`);
        this.seat(s.seat, `${p}.seat`);
      }
      if (s.amount && where !== "reaction") this.r.error("scale.amount", p, `only a reaction has an event amount to scale from`);
      if (!inStatus && (s.of === "holder" || s.of === "source")) this.r.error("scale.of", `${p}.of`, `'${s.of}' only means something inside a status; in an action, use self or target`);
      if (inStatus && s.stat && !s.of && s.seat === undefined) this.r.error("scale.of", p, `in a status, say whose stat this is: source (fixed at application) or holder (read when used)`);
      if (inStatus && s.of === "source" && this.shared) this.r.error("scale.of", `${p}.of`, `a shared Intensity total has no single source; make the status Per source, or scale the stacks its applications add`);
      if (s.times) {
        if (s.times.stat !== undefined) this.statKey(s.times.stat, `${p}.times.stat`);
        if (s.times.stacks !== undefined) this.w.ref("statuses", s.times.stacks, `${p}.times.stacks`, "status");
        if ((s.amount || s.event || s.cost) && !s.times.of) this.r.error("scale.times", `${p}.times`, `an event amount has no unit of its own: say whose stat multiplies it (holder or self)`);
        if (!inStatus && (s.times.of === "holder" || s.times.of === "source")) this.r.error("scale.of", `${p}.times.of`, `'${s.times.of}' only means something inside a status`);
        if (inStatus && s.times.of === "source") this.r.error("scale.times", `${p}.times.of`, `a live multiplier can't read the source, which is only known at application; use holder or self`);
      }
    });
  }

  /** The rules for a damage instance. */
  instance(i: { type: string; amount: S.NumT }, path: string, where: Where, inStatus: boolean) {
    if (i.type === "none" && where === "action") {
      this.r.error("instance.untyped", `${path}.type`, `every damage instance an action produces is physical`);
    }
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
    // Any of several statuses, a stat against the reading unit's, the top of a side, a weapon kind.
    c.hasAny?.forEach((id, i) => this.w.ref("statuses", id, `${path}.hasAny[${i}]`, "status"));
    if (c.lower) this.statKey(c.lower.stat, `${path}.lower.stat`);
    c.top?.stats.forEach((k, i) => this.statKey(k, `${path}.top.stats[${i}]`));
    c.weapon?.forEach((k, i) => this.w.ref("weaponKinds", k, `${path}.weapon[${i}]`, "weapon kind"));
  }

  /** A seat names a position some formation has, or a relative seat. */
  seat(id: string, path: string) {
    if (RELATIVE_SEATS.includes(id)) return;
    if (!this.pack.formations.some((f) => f.positions.some((p) => p.id === id))) this.r.error("seat.unknown", path, `no formation has a seat '${id}' (or use ${RELATIVE_SEATS.join(" or ")})`);
  }

  /** An ability's or a pulse's conditions, or a reaction's tests. */
  condition(c: S.ConditionT, path: string) {
    this.unitCond(c.where, `${path}.where`);
    if (c.seat) this.seat(c.seat, `${path}.seat`);
    if (c.atLeast !== undefined && c.atMost !== undefined && c.atMost < c.atLeast) this.r.error("cond.range", path, `atMost is below atLeast: it can never hold`);
  }

  rule(t: S.TargetRuleT, path: string, opts: { main?: boolean; where?: Where } = {}) {
    if (t.where) this.unitCond(t.where, `${path}.where`);
    if (t.seat) this.seat(t.seat, `${path}.seat`);
    if (t.ifNone && !t.where) this.r.error("target.ifNone", `${path}.ifNone`, `ifNone only means something with a where filter`);
    if (t.exclude && opts.main) this.r.error("target.exclude", `${path}.exclude`, `an action's own target rule has no earlier targets to exclude; use it on an effect's 'to' or a strike`);
    if ((t.exclude === "other" || t.exclude === "owner") && opts.where !== "reaction") this.r.error("target.exclude", `${path}.exclude`, `only a reaction has an event's ${t.exclude} unit to skip`);
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
      // Stacks scale from whatever the applier states, Attack included; nothing scales them by default.
      this.num(a.stacks, `${path}.stacks`, where, inStatus);
    }
    if (a.duration === 0 && !st.lockout?.interrupt) {
      this.r.error("apply.instant", `${path}.duration`, `only a lockout set to interrupt can be applied for 0 ticks (an instant interrupt)`);
    }
    if (typeof a.duration === "number") this.ticks(a.duration, `${path}.duration`);
  }

  effect(e: S.EffectT, path: string, where: Where, st: S.StatusT | null, action?: S.AbilityT, on?: S.EventSpecT) {
    const inStatus = !!st;
    const to = "to" in e ? e.to : undefined;
    if (typeof to === "object") this.rule(to, `${path}.to`, { where });
    else if (to) {
      if (where === "action" && ["holder", "source", "other"].includes(to)) this.r.error("effect.to", `${path}.to`, `'${to}' only means something inside a status`);
      if (where !== "action" && to === "target") this.r.error("effect.to", `${path}.to`, `'target' is an action's targets; in a status, use holder, self, other or a rule`);
      if (where === "pulse" && to === "other") this.r.error("effect.to", `${path}.to`, `a pulse has no event, so no 'other' unit`);
      if (to === "source" && (!st || shared(st))) this.r.error("effect.to", `${path}.to`, `only statuses with one applier at a time (Refresh, Fizzle, Per source) know their source`);
    }
    if (where === "action" && to === "assailant") this.r.error("effect.to", `${path}.to`, `'assailant' is the unit that last hit a reaction's event's owner: it only means something in a reaction`);
    if (where === "reaction" && to === undefined && e.op !== "summon" && e.op !== "recast") this.r.error("reaction.to", path, `a reaction's effects state their target (holder, self, other, source or a rule)`);
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
        if (e.status && this.w.ref("statuses", e.status, `${path}.status`, "status")) {
          const named = this.ix.get<S.StatusT>("statuses", e.status)!;
          if (named.label !== e.label) this.r.warn("remove.label", `${path}.label`, `'${e.status}' is a ${named.label}, not a ${e.label}: this removes nothing`);
        }
        if (e.label === "marker" && !e.status) this.r.error("remove.label", `${path}.label`, `a marker is lifted only by name: give its status`);
        if (e.tag && !e.kind) this.r.error("remove.tag", `${path}.tag`, `a tag narrows an effect kind; give the kind too`);
        e.except?.forEach((id, i) => this.w.ref("statuses", id, `${path}.except[${i}]`, "status"));
        break;
      case "cooldown":
        if (typeof e.which === "object") e.which.ability.forEach((id, i) => this.w.ref("abilities", id, `${path}.which.ability[${i}]`, "ability"));
        if (e.which === "event" && where !== "reaction") this.r.error("cooldown.event", `${path}.which`, `only a reaction to an action event knows the ability that set it off`);
        if (e.which === "basic" && typeof e.set === "object" && "atMost" in e.set) this.r.warn("cooldown.basic", `${path}.set`, `atMost reads an ability's full cooldown; the basic attack's is its swing`);
        if (typeof e.set === "object" && "lessPct" in e.set) this.num(e.set.lessPct, `${path}.set.lessPct`, where, inStatus);
        break;
      case "pay":
        this.num(e.hp, `${path}.hp`, where, inStatus);
        break;
      case "strike":
        if (where !== "reaction") this.r.error("strike.where", path, `a strike effect is a reaction's (an action's own hits are its damage effects)`);
        if (e.amount !== undefined) this.num(e.amount, `${path}.amount`, where, inStatus);
        if (e.amount !== undefined && e.of) this.r.error("strike.size", path, `a strike is sized by 'of' or by an 'amount' of its own, not both`);
        if (e.apply && e.amount === undefined) this.r.error("strike.apply", `${path}.apply`, `only a strike with an 'amount' of its own applies statuses of its own`);
        e.apply?.forEach((x, i) => this.apply(x, `${path}.apply[${i}]`, where, inStatus));
        if (e.by) this.rule(e.by, `${path}.by`, { where });
        if (e.after !== undefined && e.of !== "dealt") this.r.error("strike.after", `${path}.after`, `only a second landing ('of: dealt') can come later`);
        if (e.of === "over" && on?.event !== "ko") this.r.error("strike.over", `${path}.of`, `only a reaction to ko has a killing blow's left-over`);
        if ((e.of === "hit" || e.of === "dealt") && on && !["hit_lands", "hit_taken"].includes(on.event)) this.r.error("strike.hit", `${path}.of`, `only a reaction to a hit has that hit to size a strike from`);
        this.ticks(e.after, `${path}.after`);
        break;
      case "one":
        e.of.forEach((x, i) => this.apply(x, `${path}.of[${i}]`, where, inStatus));
        if (e.count !== undefined && e.count > e.of.length) this.r.error("one.count", `${path}.count`, `it can't pick ${e.count} different statuses of ${e.of.length}`);
        if (e.pick === "most" && e.count !== undefined) this.r.error("one.count", `${path}.count`, `'most' picks one`);
        break;
      case "recast":
        if (where !== "reaction") this.r.error("recast.where", path, `recast answers an event: it belongs in a reaction`);
        break;
      case "spend": {
        if (this.w.ref("statuses", e.status, `${path}.status`, "status") && this.ix.get<S.StatusT>("statuses", e.status)!.stacking !== "intensity") {
          this.r.error("spend.stacks", `${path}.status`, `'${e.status}' isn't an Intensity status, so it has no stacks to spend`);
        }
        if (e.share !== undefined && e.count !== undefined) this.r.error("spend.amount", path, `spend takes a share or a count, not both`);
        break;
      }
      case "pass":
        e.except?.forEach((id, i) => this.w.ref("statuses", id, `${path}.except[${i}]`, "status"));
        break;
      case "share":
        if (where !== "reaction" || on?.event !== "status_gained") this.r.error("share.where", path, `share copies the status a reaction to status_gained answers`);
        break;
      case "riders":
        if (where !== "reaction") this.r.error("riders.where", path, `riders are laid by a reaction`);
        break;
      case "restart":
      case "fell":
        break;
      case "revive": {
        this.num(e.hp, `${path}.hp`, where, inStatus);
        this.ticks(e.after, `${path}.after`);
        // Its targets must be knocked-out units: a rule asking for ko, or an action whose own target rule does, or the
        // unit a reaction to `ko` is about, which has just fallen ("raises the ally that just fell").
        const asks = (rule: unknown) => typeof rule === "object" && rule !== null && (rule as S.TargetRuleT).where?.ko === true;
        const ok = typeof to === "object"
          ? asks(to)
          : ((to === undefined || to === "target") && where === "action" && asks(action?.target)) || (to === "owner" && where === "reaction" && on?.event === "ko");
        if (!ok) this.r.error("revive.target", path, `a revive targets knocked-out units: its rule (or the ability's target) must ask for 'ko: true', or a reaction to ko names its owner`);
        break;
      }
      case "summon":
      case "replace":
        this.w.ref("enemies", e.enemy, `${path}.enemy`, "enemy");
        break;
    }
  }

  event(spec: S.EventSpecT, path: string) {
    if (spec.kind && !KIND_EVENTS.includes(spec.event)) this.r.error("event.kind", `${path}.kind`, `only action and hit events, ko, healed and overhealed have a kind`);
    for (const k of ["tags", "notTags"] as const) if (spec[k] && !TAG_EVENTS.includes(spec.event)) this.r.error("event.tags", `${path}.${k}`, `only hit events, ko, heals and status_gained carry tags`);
    if (spec.status) {
      if (!STATUS_EVENTS.includes(spec.event) && !DAMAGE_EVENTS.includes(spec.event) && !["healed", "overhealed"].includes(spec.event)) this.r.error("event.status", `${path}.status`, `only status events, damage events and heals name a status`);
      this.w.ref("statuses", spec.status, `${path}.status`, "status");
    }
    if (LINE_EVENTS.includes(spec.event) !== (spec.line !== undefined)) this.r.error("event.line", path, `hp_low and hp_high name their line, and only they do`);
    if (spec.ability) {
      if (!ACTION_EVENTS.includes(spec.event) && spec.event !== "ko") this.r.error("event.ability", `${path}.ability`, `only action events and ko name the ability behind them`);
      spec.ability.forEach((id, i) => this.w.ref("abilities", id, `${path}.ability[${i}]`, "ability"));
    }
    if (spec.does) {
      if (!ACTION_EVENTS.includes(spec.event)) this.r.error("event.does", `${path}.does`, `only action events say what their action does`);
      spec.does.forEach((id, i) => DOES.includes(id) || this.w.ref("statuses", id, `${path}.does[${i}]`, `status (or ${DOES.join(", ")})`));
    }
    if (spec.paid && spec.event !== "action_resolve") this.r.error("event.paid", `${path}.paid`, `only action_resolve says what was paid`);
    if (spec.counted && !ACTION_EVENTS.includes(spec.event)) this.r.error("event.counted", `${path}.counted`, `only action events can be a free repeat`);
    if (spec.wasBelow !== undefined && !HIT_EVENTS.includes(spec.event)) this.r.error("event.wasBelow", `${path}.wasBelow`, `only hit events know the HP their target had`);
    if (spec.cause && spec.event !== "status_ended") this.r.error("event.cause", `${path}.cause`, `only status_ended has a cause`);
    // The filters that read who did it, where it sits, and the event's numbers.
    if (spec.source && !STATUS_EVENTS.includes(spec.event)) this.r.error("event.source", `${path}.source`, `only status events have a status whose source can be read`);
    if (spec.other && ["fight_start", "fight_won", "action_start", "action_interrupted", "hp_lost", "hp_paid", "hp_low", "hp_high", "status_triggered"].includes(spec.event)) this.r.error("event.other", `${path}.other`, `'${spec.event}' has no other unit`);
    if (spec.amountAtLeast !== undefined && !AMOUNT_EVENTS.includes(spec.event)) this.r.error("event.amount", `${path}.amountAtLeast`, `'${spec.event}' carries no amount`);
    if (spec.countAtLeast !== undefined && spec.event !== "action_resolve") this.r.error("event.count", `${path}.countAtLeast`, `only action_resolve counts the units its hits landed on`);
    if (spec.repeat !== undefined && !REPEAT_EVENTS.includes(spec.event)) this.r.error("event.repeat", `${path}.repeat`, `only an action event, fight_start or status_gained can be a repeat`);
    if (spec.seat) this.seat(spec.seat, `${path}.seat`);
  }

  /** A status's changes to its holder's abilities. */
  mod(m: S.AbilityModT, path: string) {
    m.of?.ability?.forEach((id, i) => this.w.ref("abilities", id, `${path}.of.ability[${i}]`, "ability"));
    m.of?.does?.forEach((id, i) => DOES.includes(id) || this.w.ref("statuses", id, `${path}.of.does[${i}]`, `status (or ${DOES.join(", ")})`));
    if (m.if) this.unitCond(m.if, `${path}.if`);
    this.ticks(m.cast, `${path}.cast`);
    m.stacks?.statuses?.forEach((id, i) => {
      if (!this.w.ref("statuses", id, `${path}.stacks.statuses[${i}]`, "status")) return;
      if (this.ix.get<S.StatusT>("statuses", id)!.stacking !== "intensity") this.r.error("mod.stacks", `${path}.stacks.statuses[${i}]`, `'${id}' isn't an Intensity status, so it has no stacks to add`);
    });
    if (m.target) this.rule(m.target, `${path}.target`, { main: true });
    if (m.wait) [m.wait].flat().forEach((c, i) => this.condition(c, `${path}.wait${Array.isArray(m.wait) ? `[${i}]` : ""}`));
    m.apply?.forEach((x, i) => this.apply(x, `${path}.apply[${i}]`, "action", false));
    if (m.pay !== undefined) this.num(m.pay, `${path}.pay`, "action", false);
    if (m.times && "stacks" in m.times) this.w.ref("statuses", m.times.stacks, `${path}.times.stacks`, "status");
    if (m.times && "casts" in m.times && m.times.show) this.w.ref("statuses", m.times.show, `${path}.times.show`, "status");
    if (m.of?.basic && [m.mp, m.hp, m.cast, m.wind, m.cooldown, m.damage, m.stacks, m.heal, m.target, m.seek, m.apply, m.times].some((x) => x !== undefined)) {
      this.r.error("mod.basic", path, `on the basic attack an ability change can only add a price (pay) or a wait`);
    }
    const changes = [m.mp, m.hp, m.pay, m.cast, m.wind, m.cooldown, m.damage, m.stacks, m.heal, m.target, m.seek, m.wait, m.apply].filter((x) => x !== undefined).length;
    if (!changes) this.r.error("mod.empty", path, `an ability change changes something: mp, hp, pay, cast, wind, cooldown, damage, stacks, heal, target, seek, wait or apply`);
  }

  /** Tags that boosts, modifiers, lockouts, riders and event filters can name. */
  knownTags(): Set<string> {
    return new Set([...RESERVED_TAGS, ...this.pack.statuses.flatMap((s) => [s.id, ...(s.tags ?? [])])]);
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
    // Control resistance names statuses that exist, and resists before it's immune.
    if (rs.control) {
      rs.control.statuses.forEach((id, i) => this.w.ref("statuses", id, `ruleset.control.statuses[${i}]`, "status"));
      if (rs.control.resist.at >= rs.control.cap) this.r.error("ruleset.control", "ruleset.control.resist.at", `control is resisted from ${rs.control.resist.at} stacks, but immune at ${rs.control.cap}: resist below the cap`);
      this.ticks(rs.control.drain, "ruleset.control.drain");
    }
  }

  /** A weapon: its kind's type and cooldown, or its own. */
  weapon(wp: S.WeaponT, path: string) {
    const k = wp.kind && this.w.ref("weaponKinds", wp.kind, `${path}.kind`, "weapon kind") ? this.ix.get<S.WeaponKindT>("weaponKinds", wp.kind)! : undefined;
    const type = wp.type ?? k?.type;
    if (!type) this.r.error("weapon.kind", path, `a weapon names a kind, or states its own type and cooldown`);
    if (wp.cooldown === undefined && !k) this.r.error("weapon.kind", path, `a weapon without a kind states its cooldown`);
    this.instance({ type: type ?? "physical", amount: wp.amount }, path, "action", false);
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
        st.strike.apply?.forEach((x, j) => this.apply(x, `${p}.strike.apply[${j}]`, "action", false));
        if (st.strike.when) this.unitCond(st.strike.when, `${p}.strike.when`);
        if (st.strike.carry && (st.strike.kind ?? "extra") === "extra") this.r.warn("strike.carry", `${p}.strike.carry`, `an extra strike carries the riders under echo; 'carry' is a bonus strike's`);
        if (st.strike.chain && st.strike.chance === undefined && !st.strike.scale) this.r.warn("strike.chain", `${p}.strike.chain`, `a strike that always lands would always chain to its most`);
      }
      // Marked, aims, ability changes, crits, stats set, revives.
      if (st.single && shared(st)) this.r.error("status.single", `${p}.single`, `a shared Intensity total has no applier to keep one copy each; make it Refresh, Fizzle or Per source`);
      if (st.focus && st.label === "buff") this.r.warn("status.focus", `${p}.focus`, `a focus draws the holder's foes' basic attacks: usually a debuff (Marked)`);
      if (st.aim) this.rule(st.aim.rule, `${p}.aim.rule`, { main: true });
      st.mods?.forEach((m, j) => this.mod(m, `${p}.mods[${j}]`));
      st.crits?.forEach((x, j) => {
        tag(x.tag, `${p}.crits[${j}].tag`);
        if (x.when) this.unitCond(x.when, `${p}.crits[${j}].when`);
        if (x.chance === undefined && x.bonus === undefined && x.times === undefined && x.set === undefined) this.r.error("crit.empty", `${p}.crits[${j}]`, `a crit rule adds chance, multiplies it, sets it, adds bonus, or several of these`);
      });
      st.set?.forEach((x, j) => this.statKey(x.stat, `${p}.set[${j}].stat`));
      if (st.revives?.hp !== undefined) this.num(st.revives.hp, `${p}.revives.hp`, "action", false);
      if (st.pulse?.if) [st.pulse.if].flat().forEach((c, j) => this.condition(c, `${p}.pulse.if${Array.isArray(st.pulse!.if) ? `[${j}]` : ""}`));
      st.reactions?.forEach((x, j) => {
        if (!x.if) return;
        [x.if].flat().forEach((t, k) => {
          const tp = `${p}.reactions[${j}].if${Array.isArray(x.if) ? `[${k}]` : ""}`;
          if ("unit" in t) this.unitCond(t.where, `${tp}.where`);
          else this.condition(t, tp);
        });
      });
      st.stats?.forEach((ch, j) => {
        if (ch.live && typeof ch.flat !== "object" && typeof ch.pct !== "object") this.r.warn("stat.live", `${p}.stats[${j}].live`, `a live change reads other stats; a plain number never changes`);
      });
      st.riders?.forEach((x, j) => {
        tag(x.on, `${p}.riders[${j}].on`);
        this.instance(x.add, `${p}.riders[${j}].add`, "action", true);
      });
      st.adds?.forEach((x, j) => {
        tag(x.on, `${p}.adds[${j}].on`);
        this.num(x.amount, `${p}.adds[${j}].amount`, "action", true);
      });
      if (st.divert) {
        if (st.divert.what !== "mp") this.w.ref("statuses", st.divert.what, `${p}.divert.what`, "status (or mp)");
        if (typeof st.divert.to === "object") this.rule(st.divert.to, `${p}.divert.to`);
        else if (shared(st)) this.r.error("status.source", `${p}.divert.to`, `a shared Intensity total has no single source to send to`);
      }
      if (st.borrow) this.rule(st.borrow.from, `${p}.borrow.from`);
      if (st.damp && (!intensity || st.cap === undefined)) this.r.error("status.damp", `${p}.damp`, `damp belongs to an Intensity status with a cap`);
      st.swap?.forEach((k, j) => this.statKey(k, `${p}.swap[${j}]`));
      if (st.mods?.some((m) => m.hp?.payer) && shared(st)) this.r.error("status.source", `${p}.mods`, `a shared Intensity total has no single source to pay`);
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
        x.do.forEach((e, k) => this.effect(e, `${p}.reactions[${j}].do[${k}]`, "reaction", st, undefined, x.on));
      });
      const empty = !st.stats && !st.boosts && !st.taken && !st.absorb && !st.block && !st.lockout && !st.riders && !st.seek && !st.strike && !st.pulse && !st.trigger && !st.reactions
        && !st.focus && !st.aim && !st.mods && !st.crits && !st.echo && !st.set && !st.cover && !st.floor && !st.heals && !st.revives
        && !st.adds && !st.healCap && !st.soak && !st.divert && !st.swap && !st.tireless && !st.order && !st.borrow;
      // A marker is bookkeeping, read by name, so it may have no effects of its own.
      if (empty && st.label !== "marker") this.r.warn("status.empty", p, `status '${st.id}' has no effects`);
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
      if (a.if) {
        const list = "any" in a.if ? a.if.any : [a.if].flat();
        const at = (k: number) => ("any" in a.if! ? `.any[${k}]` : Array.isArray(a.if) ? `[${k}]` : "");
        list.forEach((cnd, k) => this.condition(cnd, `${p}.if${at(k)}`));
      }
      if (typeof a.target === "object") this.rule(a.target, `${p}.target`, { main: true });
      a.do.forEach((e, j) => this.effect(e, `${p}.do[${j}]`, "action", null, a));
      a.statuses?.forEach((s, j) => this.w.ref("statuses", s, `${p}.statuses[${j}]`, "status"));
    });
  }
}
