/**
 * Validator for content packs and party loadouts.
 *
 * Three layers of checks:
 *   1. Shape: the zod schema (types, required fields, closed enums).
 *   2. Meaning: every reference resolves, and every subject, selector and
 *      variable is used only where it has a meaning (e.g. event_source only
 *      inside a triggered rule).
 *   3. Design rules from the concept spec and the director's decisions, driven
 *      by the pack's `design` block, plus vocabulary honesty: the verbs an
 *      entity declares must match what its data does, and trait words must be
 *      backed by the enemy's numbers.
 *
 * Every issue carries a stable `code`, so tests and later tooling can rely on it.
 */
import * as S from "./schema.js";

export type Issue = { level: "error" | "warning"; code: string; path: string; message: string };
export type Pack = S.ContentPack;

type Rule = S.Rule;
type Cond = S.Condition;
type Sel = S.Selector;

// ─────────────────────────────────────────────────────────────────────────────
// Report
// ─────────────────────────────────────────────────────────────────────────────

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
  "stats", "damageTypes", "statuses", "verbs", "traits", "slots", "actions", "behaviours", "classes",
  "specializations", "abilities", "gear", "formations", "enemies", "perkFamilies", "perks", "dungeons",
] as const;
type Coll = (typeof COLLECTIONS)[number];

export class Index {
  readonly maps = new Map<Coll, Map<string, any>>();
  readonly used = new Map<Coll, Set<string>>();

  constructor(readonly pack: Pack, r?: Report) {
    const add = (coll: Coll, items: { id: string }[], path: string) => {
      const m = new Map<string, any>();
      items.forEach((it, i) => {
        if (m.has(it.id)) r?.error("id.duplicate", `${path}[${i}]`, `duplicate ${coll} id '${it.id}'`);
        if (it.id === S.BASIC) r?.error("id.reserved", `${path}[${i}]`, `'${S.BASIC}' is reserved for "this unit's basic action"`);
        m.set(it.id, it);
      });
      this.maps.set(coll, m);
      this.used.set(coll, new Set());
    };
    for (const c of COLLECTIONS) add(c, pack[c] as { id: string }[], c);
  }

  get<T = any>(coll: Coll, id: string): T | undefined {
    return this.maps.get(coll)!.get(id);
  }
  has(coll: Coll, id: string) {
    return this.maps.get(coll)!.has(id);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Facts: what an entity's data visibly does. Verb signals match against these.
// ─────────────────────────────────────────────────────────────────────────────

export type Fact = {
  op?: string;
  damageType?: string;
  statusFlag?: string;
  statusTicks?: true;
  statusDebuff?: true;
  /** apply_status only: which status (used for the roster niche check, not by signals). */
  status?: string;
  stat?: string;
  sign?: "positive" | "negative";
  flag?: string;
  from?: string;
  pick?: string;
  multiHit?: true;
  amountUp?: true;
  performs?: "counter" | "extra";
  trigger?: string;
  conditionAlive?: true;
  baseStat?: { stat: string; value: number };
};

function signOf(mode: "add" | "mul", value: number): Fact["sign"] {
  if (mode === "add") return value > 0 ? "positive" : value < 0 ? "negative" : undefined;
  return value > 1 ? "positive" : value < 1 ? "negative" : undefined;
}

/** Sign of a stat change written as an expression: a raise unless multiplied by a negative constant. */
function exprSign(mode: "add" | "mul", e: S.Expr): Fact["sign"] {
  if (typeof e === "number") return signOf(mode, e);
  if ("mul" in e) return e.mul.filter((x) => typeof x === "number" && x < 0).length % 2 ? "negative" : "positive";
  return "positive";
}

function readsStat(e: S.Expr): boolean {
  if (typeof e === "number") return false;
  if ("stat" in e) return true;
  if ("var" in e || "stacks" in e || "count" in e) return false;
  return (Object.values(e)[0] as S.Expr[]).some(readsStat);
}

function matches(sig: S.VerbDefSignal, f: Fact): boolean {
  for (const [k, v] of Object.entries(sig)) {
    if (k === "statAtLeast") {
      const s = v as { stat: string; value: number };
      if (!f.baseStat || f.baseStat.stat !== s.stat || f.baseStat.value < s.value) return false;
    } else if ((f as any)[k] !== v) return false;
  }
  return true;
}

export function deriveVerbs(pack: Pack, facts: Fact[]): Set<string> {
  const out = new Set<string>();
  for (const v of pack.verbs) if (v.signals.some((s) => facts.some((f) => matches(s, f)))) out.add(v.id);
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context-aware walker
// ─────────────────────────────────────────────────────────────────────────────

const GENERAL_FROMS: S.SelectorFrom[] = ["self", "allies", "allies_and_self", "enemies", "everyone"];
const ACTION_FROMS: S.SelectorFrom[] = ["action_target", "action_target_allies"];
const EVENT_FROMS: S.SelectorFrom[] = ["event_source", "event_target", "event_target_allies"];

type Ctx = {
  path: string;
  subjects: Set<S.Subject>;
  froms: Set<S.SelectorFrom>;
  vars: Set<S.Var>;
  /** Collector for verb facts. Absent: don't collect (e.g. "when to use" conditions). */
  facts?: Fact[];
  inSelector?: boolean;
};
type Base = { path: string; facts?: Fact[] };

const ctx = (path: string, subjects: S.Subject[], froms: S.SelectorFrom[], vars: S.Var[], facts?: Fact[]): Ctx => ({
  path,
  subjects: new Set(subjects),
  froms: new Set(froms),
  vars: new Set(vars),
  facts,
});
/** Context for a plain condition about one unit (`self`), e.g. useWhen, mode `when`, perk requires. */
const unitCtx = (path: string) => ctx(path, ["self"], GENERAL_FROMS, ["round"]);

class Walker {
  readonly statusFacts = new Map<string, Fact[]>();
  readonly actionFacts = new Map<string, Fact[]>();
  readonly behaviourFacts = new Map<string, Fact[]>();
  /** Where each action is used, for the basic/active target rules. */
  readonly basicUses = new Map<string, string>();
  readonly targetedUses = new Map<string, string>();

  constructor(readonly ix: Index, readonly r: Report) {}

  private get pack() {
    return this.ix.pack;
  }

  ref(coll: Coll, id: string, path: string, what: string = coll): boolean {
    if (!this.ix.has(coll, id)) {
      this.r.error("ref.missing", path, `unknown ${what} '${id}'`);
      return false;
    }
    this.ix.used.get(coll)!.add(id);
    return true;
  }

  actionRef(id: string, path: string) {
    if (id === S.BASIC) return;
    this.ref("actions", id, path, "action");
  }

  statusProps(id: string) {
    const st = this.ix.get<S.StatusDefT>("statuses", id);
    if (!st) return { ticks: false, debuff: false, flags: [] as string[] };
    const rules = st.rules ?? [];
    const ticks = rules.some(
      (r) => r.kind === "triggered" && (r.when.on === "turn_start" || r.when.on === "turn_end") && r.do.some((e) => e.op === "damage"),
    );
    const debuff = rules.some(
      (r) => r.kind === "passive" && r.do.some((e) => e.op === "stat" && exprSign(e.mode, e.value) === "negative"),
    );
    return { ticks, debuff, flags: st.flags ?? [] };
  }

  private subject(of: S.Subject | undefined, c: Ctx, path: string) {
    const s = of ?? "self";
    if (!c.subjects.has(s)) {
      this.r.error("ctx.subject", path, `'${s}' has no meaning here (available: ${[...c.subjects].join(", ")})`);
    }
  }

  private fact(c: Ctx, f: Fact) {
    c.facts?.push(f);
  }

  expr(e: S.Expr, c: Ctx): void {
    if (typeof e === "number") return;
    const p = c.path;
    if ("stat" in e) {
      this.ref("stats", e.stat, `${p}.stat`, "stat");
      this.subject(e.of, c, `${p}.of`);
    } else if ("stacks" in e) {
      this.ref("statuses", e.stacks, `${p}.stacks`, "status");
      this.subject(e.of, c, `${p}.of`);
    } else if ("var" in e) {
      if (!c.vars.has(e.var)) this.r.error("ctx.var", `${p}.var`, `variable '${e.var}' has no meaning here (available: ${[...c.vars].join(", ") || "none"})`);
    } else if ("count" in e) {
      this.selector(e.count, { ...c, facts: undefined, path: `${p}.count` });
    } else {
      const [k, args] = Object.entries(e)[0] as [string, S.Expr[]];
      args.forEach((a, i) => this.expr(a, { ...c, path: `${p}.${k}[${i}]` }));
    }
  }

  cond(cn: Cond, c: Ctx): void {
    const p = c.path;
    if ("all" in cn) return cn.all.forEach((x, i) => this.cond(x, { ...c, path: `${p}.all[${i}]` }));
    if ("any" in cn) return cn.any.forEach((x, i) => this.cond(x, { ...c, path: `${p}.any[${i}]` }));
    if ("not" in cn) return this.cond(cn.not, { ...c, path: `${p}.not` });
    if ("hpBelow" in cn || "hpAtLeast" in cn) return this.subject(cn.of, c, `${p}.of`);
    if ("hasStatus" in cn) {
      this.ref("statuses", cn.hasStatus, `${p}.hasStatus`, "status");
      return this.subject(cn.of, c, `${p}.of`);
    }
    if ("isClass" in cn) {
      cn.isClass.forEach((id, i) => this.ref("classes", id, `${p}.isClass[${i}]`, "class"));
      return this.subject(cn.of, c, `${p}.of`);
    }
    if ("isSpec" in cn) {
      cn.isSpec.forEach((id, i) => this.ref("specializations", id, `${p}.isSpec[${i}]`, "specialization"));
      return this.subject(cn.of, c, `${p}.of`);
    }
    if ("hasAbility" in cn) {
      this.ref("abilities", cn.hasAbility, `${p}.hasAbility`, "ability");
      return this.subject(cn.of, c, `${p}.of`);
    }
    if ("alive" in cn) return this.fact(c, { conditionAlive: true });
    if ("compare" in cn) {
      this.expr(cn.compare[0], { ...c, path: `${p}.compare[0]` });
      this.expr(cn.compare[2], { ...c, path: `${p}.compare[2]` });
    }
    // round: nothing to check
  }

  selector(s: Sel, c: Ctx) {
    const p = c.path;
    if (!c.froms.has(s.from)) {
      this.r.error("ctx.from", `${p}.from`, `'${s.from}' has no meaning here (available: ${[...c.froms].join(", ")})`);
    }
    const pick = s.pick ?? "all";
    if ((pick === "lowest" || pick === "highest") && !s.by) this.r.error("selector.by", p, `pick '${pick}' needs 'by'`);
    if (s.by && pick !== "lowest" && pick !== "highest") this.r.warn("selector.by", `${p}.by`, `'by' is ignored unless pick is lowest or highest`);
    if (s.count && pick === "all") this.r.warn("selector.count", `${p}.count`, `'count' is ignored when pick is all`);
    const inner: Ctx = { ...c, subjects: new Set([...c.subjects, "candidate"]), inSelector: true };
    if (s.where) this.cond(s.where, { ...inner, path: `${p}.where` });
    if (s.prefer) this.cond(s.prefer, { ...inner, path: `${p}.prefer` });
    if (s.by) this.expr(s.by, { ...inner, facts: undefined, path: `${p}.by` });
    this.fact(c, { from: s.from, pick });
  }

  instant(e: S.InstantEffect, c: Ctx) {
    const p = c.path;
    const at = (seg: string): Ctx => ({ ...c, path: `${p}.${seg}` });
    switch (e.op) {
      case "damage":
        this.ref("damageTypes", e.type, `${p}.type`, "damage type");
        this.expr(e.amount, at("amount"));
        this.selector(e.target, at("target"));
        this.fact(c, { op: "damage", damageType: e.type, from: e.target.from });
        break;
      case "heal":
        this.expr(e.amount, at("amount"));
        this.selector(e.target, at("target"));
        this.fact(c, { op: "heal", from: e.target.from });
        break;
      case "apply_status": {
        if (this.ref("statuses", e.status, `${p}.status`, "status")) {
          const st = this.ix.get<S.StatusDefT>("statuses", e.status)!;
          if (st.on === "self" && e.target.from !== "self") {
            this.r.error("status.onSelf", `${p}.target`, `'${e.status}' is a unit's own state, so only its bearer applies it (target self)`);
          }
          if (st.on === "others" && e.target.from === "self") {
            this.r.error("status.onOthers", `${p}.target`, `'${e.status}' is applied to other units, never to self`);
          }
          const sp = this.statusProps(e.status);
          this.fact(c, {
            op: "apply_status",
            status: e.status,
            from: e.target.from,
            ...(sp.ticks ? { statusTicks: true } : {}),
            ...(sp.debuff ? { statusDebuff: true } : {}),
          });
          sp.flags.forEach((f) => this.fact(c, { op: "apply_status", statusFlag: f }));
          (this.statusFacts.get(e.status) ?? []).forEach((f) => this.fact(c, f));
        }
        this.selector(e.target, at("target"));
        break;
      }
      case "remove_status":
        this.ref("statuses", e.status, `${p}.status`, "status");
        this.selector(e.target, at("target"));
        this.fact(c, { op: "remove_status", from: e.target.from });
        break;
      case "buff":
        this.ref("stats", e.stat, `${p}.stat`, "stat");
        this.selector(e.target, at("target"));
        this.fact(c, { op: "buff", stat: e.stat, sign: signOf(e.mode, e.value) });
        break;
      case "perform_action":
        this.actionRef(e.action, `${p}.action`);
        if (e.action !== S.BASIC) {
          if (!e.target) this.targetedUses.set(e.action, `${p}.action`);
          c.facts?.push(...(this.actionFacts.get(e.action) ?? []));
        }
        if (e.target) this.selector(e.target, at("target"));
        this.fact(c, { op: "perform_action", performs: e.target?.from === "event_source" ? "counter" : "extra" });
        break;
      case "adjust": {
        if (this.ref("stats", e.stat, `${p}.stat`, "stat")) {
          const st = this.ix.get<S.StatDefT>("stats", e.stat)!;
          if (st.kind !== "resource" || e.stat === this.pack.ruleset.defeat.stat) {
            this.r.error("effect.adjust", `${p}.stat`, `adjust changes resources other than '${this.pack.ruleset.defeat.stat}'; use damage or heal for that`);
          }
        }
        this.expr(e.amount, at("amount"));
        this.selector(e.target, at("target"));
        const sign = typeof e.amount === "number" ? signOf("add", e.amount) : undefined;
        this.fact(c, { op: "adjust", stat: e.stat, ...(sign ? { sign } : {}) });
        break;
      }
      case "grant_flag":
        this.selector(e.target, at("target"));
        this.fact(c, { op: "grant_flag", flag: e.flag });
        break;
      case "summon":
        this.ref("enemies", e.enemy, `${p}.enemy`, "enemy");
        this.fact(c, { op: "summon" });
        break;
    }
  }

  passive(e: S.PassiveEffect, c: Ctx) {
    const p = c.path;
    switch (e.op) {
      case "stat":
        this.ref("stats", e.stat, `${p}.stat`, "stat");
        if (typeof e.value !== "number") {
          this.expr(e.value, { ...c, facts: undefined, path: `${p}.value` });
          if (readsStat(e.value)) this.r.error("effect.statValue", `${p}.value`, `a stat change's value may not read stats (use a derived stat instead)`);
        }
        this.fact(c, { op: "stat", stat: e.stat, sign: exprSign(e.mode, e.value) });
        break;
      case "flag":
        this.fact(c, { op: "flag", flag: e.flag });
        break;
      case "modify_action": {
        this.actionRef(e.action, `${p}.action`);
        const withTarget = new Set<S.Subject>([...c.subjects, "target"]);
        if (e.if) this.cond(e.if, { ...c, subjects: withTarget, path: `${p}.if` });
        if (e.target) this.selector(e.target, { ...c, path: `${p}.target` });
        e.addEffects?.forEach((x, i) =>
          this.instant(x, { ...c, subjects: withTarget, froms: new Set([...c.froms, ...ACTION_FROMS]), path: `${p}.addEffects[${i}]` }),
        );
        if (e.hits && e.hits > 1) this.fact(c, { multiHit: true });
        if (e.amountMul && e.amountMul > 1) this.fact(c, { amountUp: true });
        this.fact(c, { op: "modify_action" });
        break;
      }
    }
  }

  /** Context for a triggered rule's effects, also reused by ability patches. */
  triggeredCtx(when: S.TriggerT, base: Base): Ctx {
    const vars: S.Var[] = ["round"];
    if (S.EVENTS_WITH_AMOUNT.includes(when.on)) vars.push("amount");
    return ctx(base.path, ["self", "event_source", "event_target"], [...GENERAL_FROMS, ...EVENT_FROMS], vars, base.facts);
  }

  rule(rule: Rule, base: Base) {
    const p = base.path;
    if (rule.kind === "passive") {
      const c = ctx(p, ["self"], GENERAL_FROMS, ["round"], base.facts);
      if (rule.if) this.cond(rule.if, { ...c, path: `${p}.if` });
      rule.do.forEach((e, i) => this.passive(e, { ...c, path: `${p}.do[${i}]` }));
      return;
    }
    const { when } = rule;
    if (when.on === "hp_below" && when.below === undefined) this.r.error("trigger.below", `${p}.when`, `hp_below needs 'below'`);
    if (when.on !== "hp_below" && when.below !== undefined) this.r.warn("trigger.below", `${p}.when.below`, `'below' only applies to hp_below`);
    if (when.action) {
      if (!S.EVENTS_WITH_ACTION.includes(when.on)) {
        this.r.error("trigger.action", `${p}.when.action`, `'${when.on}' events aren't caused by an action, so an action filter can't apply`);
      }
    }
    base.facts?.push({ trigger: when.on });
    const c = this.triggeredCtx(when, base);
    if (rule.if) this.cond(rule.if, { ...c, path: `${p}.if` });
    const effectCtx: Ctx = { ...c, subjects: new Set([...c.subjects, "target"]) };
    rule.do.forEach((e, i) => this.instant(e, { ...effectCtx, path: `${p}.do[${i}]` }));
  }

  rules(rules: Rule[] | undefined, base: Base) {
    const seen = new Set<string>();
    rules?.forEach((rule, i) => {
      const path = `${base.path}[${i}]`;
      if (seen.has(rule.id)) this.r.error("rule.duplicateId", path, `duplicate rule id '${rule.id}'`);
      seen.add(rule.id);
      this.rule(rule, { ...base, path });
    });
  }

  active(a: S.ActiveT, base: Base) {
    const p = base.path;
    if (this.ref("actions", a.action, `${p}.action`, "action")) {
      this.targetedUses.set(a.action, `${p}.action`);
      base.facts?.push(...(this.actionFacts.get(a.action) ?? []));
    }
    if (a.useWhen) this.cond(a.useWhen, unitCtx(`${p}.useWhen`));
  }

  modes(list: S.BehaviourModeT[], path: string) {
    list.forEach((m, i) => m.when && this.cond(m.when, unitCtx(`${path}[${i}].when`)));
    if (list.length && list[list.length - 1].when) {
      this.r.error("behaviour.fallback", `${path}[${list.length - 1}]`, `the last mode must have no 'when', so the unit always has something to try`);
    }
  }

  stats(block: Record<string, number> | undefined, path: string) {
    for (const k of Object.keys(block ?? {})) this.ref("stats", k, `${path}.${k}`, "stat");
  }

  basic(actionId: string, path: string, facts: Fact[]) {
    if (this.ref("actions", actionId, path, "action")) {
      this.basicUses.set(actionId, path);
      facts.push(...(this.actionFacts.get(actionId) ?? []));
    }
  }

  behaviour(id: string | undefined, path: string, facts: Fact[]) {
    const resolved = id ?? this.pack.ruleset.defaultBehaviour;
    if (this.ref("behaviours", resolved, id ? path : "ruleset.defaultBehaviour", "behaviour")) facts.push(...(this.behaviourFacts.get(resolved) ?? []));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Validation entry point
// ─────────────────────────────────────────────────────────────────────────────

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

  checkRegistries(pack, ix, w, r);
  const units = checkUnits(pack, ix, w, r);
  checkGear(pack, ix, w, r);
  checkFormations(pack, ix, w, r);
  checkEnemies(pack, ix, w, r);
  checkPerks(pack, ix, w, r);
  checkDungeons(pack, ix, w, r);
  checkStarterAndProgression(pack, ix, w, r);
  checkActionUse(pack, ix, w, r);
  if (opts.complete) checkComplete(pack, r, units.specFacts);
  checkUnused(pack, ix, r);

  const errors = r.issues.filter((i) => i.level === "error").length;
  return { pack, issues: r.issues, errors, warnings: r.issues.length - errors };
}

function compareVerbs(pack: Pack, w: Walker, r: Report, path: string, label: string, declared: string[], facts: Fact[]) {
  declared.forEach((v, i) => w.ref("verbs", v, `${path}.verbs[${i}]`, "verb"));
  const derived = deriveVerbs(pack, facts);
  for (const v of declared) {
    if (!derived.has(v)) r.warn("verb.unsupported", `${path}.verbs`, `${label} declares '${v}', but nothing in its data shows it`);
  }
  for (const v of derived) {
    if (!declared.includes(v)) r.warn("verb.undeclared", `${path}.verbs`, `${label} shows '${v}' in its data but doesn't declare it`);
  }
  const mechanical = facts.filter((f) => !f.baseStat && !(f.from && f.pick && Object.keys(f).length === 2));
  if (mechanical.length && !derived.size) r.warn("verb.unmapped", `${path}.verbs`, `${label} has mechanics, but none of them map to a verb`);
}

function effectiveStats(pack: Pack, ...blocks: (Record<string, number> | undefined)[]) {
  const out: Record<string, number> = {};
  for (const s of pack.stats) out[s.id] = s.default;
  for (const b of blocks) Object.assign(out, b ?? {});
  return out;
}

const baseStatFacts = (stats: Record<string, number>): Fact[] =>
  Object.entries(stats).map(([stat, value]) => ({ baseStat: { stat, value } }));

// ─── Registries and ruleset ──────────────────────────────────────────────────

function checkRegistries(pack: Pack, ix: Index, w: Walker, r: Report) {
  const d = pack.design;
  const rs = pack.ruleset;
  const rangeOk = (rg: [number, number], path: string) => {
    if (rg[0] > rg[1]) r.error("design.range", path, `range [${rg[0]}, ${rg[1]}] runs backwards`);
  };
  rangeOk(d.partySize, "design.partySize");
  rangeOk(d.perkPicksPerRun, "design.perkPicksPerRun");
  rangeOk(d.perkPoolSize, "design.perkPoolSize");
  rangeOk(d.keyholesPerBoss, "design.keyholesPerBoss");
  if (d.partySize[1] > d.formationPositions) r.error("design.partySize", "design.partySize", `party size can't exceed ${d.formationPositions} formation positions`);
  if (d.abilitiesEquipped > d.abilitiesPerSpec) r.error("design.abilities", "design.abilitiesEquipped", `can't equip more abilities than a specialization has`);


  // Stats
  pack.stats.forEach((s, i) => {
    const p = `stats[${i}]`;
    if (s.kind === "resource") {
      if (!s.maxStat) r.error("stat.resource", p, `resource '${s.id}' needs maxStat`);
      else if (w.ref("stats", s.maxStat, `${p}.maxStat`, "stat") && ix.get<S.StatDefT>("stats", s.maxStat)!.kind !== "attribute") {
        r.error("stat.resource", `${p}.maxStat`, `maxStat must be an attribute`);
      }
      if (!s.persistence) r.error("stat.resource", p, `resource '${s.id}' needs persistence (fight or run)`);
    } else if (s.maxStat || s.persistence) {
      r.error("stat.attribute", p, `maxStat and persistence only apply to resources`);
    }
    if (s.min !== undefined && s.max !== undefined && s.min > s.max) r.error("stat.range", p, `min is above max`);
    if (s.formula) {
      if (s.kind !== "attribute") r.error("stat.formula", `${p}.formula`, `only attributes can be derived`);
      w.expr(s.formula, ctx(`${p}.formula`, ["self"], GENERAL_FROMS, []));
    }
  });
  // Derived stats must not depend on themselves, directly or through others.
  const deps = new Map<string, string[]>();
  const collect = (e: S.Expr, acc: string[]) => {
    if (typeof e === "number") return;
    if ("stat" in e) acc.push(e.stat);
    else if (!("var" in e) && !("stacks" in e) && !("count" in e)) (Object.values(e)[0] as S.Expr[]).forEach((x) => collect(x, acc));
  };
  pack.stats.forEach((s) => {
    if (!s.formula) return;
    const acc: string[] = [];
    collect(s.formula, acc);
    deps.set(s.id, acc);
  });
  const visiting = new Set<string>();
  const done = new Set<string>();
  const visit = (id: string, trail: string[]): void => {
    if (done.has(id)) return;
    if (visiting.has(id)) return r.error("stat.cycle", "stats", `derived stats form a cycle: ${[...trail, id].join(" → ")}`);
    visiting.add(id);
    (deps.get(id) ?? []).forEach((dep) => visit(dep, [...trail, id]));
    visiting.delete(id);
    done.add(id);
  };
  [...deps.keys()].forEach((id) => visit(id, []));

  // Formulas
  const formulaCtx = (path: string, vars: S.Var[]) => ctx(path, ["attacker", "defender"], GENERAL_FROMS, vars);
  pack.damageTypes.forEach((dt, i) => w.expr(dt.mitigation, formulaCtx(`damageTypes[${i}].mitigation`, ["raw", "round"])));
  w.ref("stats", rs.turnOrder.stat, "ruleset.turnOrder.stat", "stat");
  w.ref("stats", rs.defeat.stat, "ruleset.defeat.stat", "stat");
  if (new Set(rs.damagePipeline).size !== rs.damagePipeline.length) r.error("ruleset.pipeline", "ruleset.damagePipeline", "a pipeline step appears twice");
  for (const [k, e] of Object.entries(rs.formulas)) {
    if (k !== "minDamage") w.expr(e as S.Expr, formulaCtx(`ruleset.formulas.${k}`, ["round"]));
  }

  // Turn logic and targeting
  w.ref("stats", rs.targeting.weightStat, "ruleset.targeting.weightStat", "stat");
  w.ref("behaviours", rs.defaultBehaviour, "ruleset.defaultBehaviour", "behaviour");
  w.modes(rs.defaultModes, "ruleset.defaultModes");
  rs.run.betweenFights.forEach((e, i) => w.instant(e, ctx(`ruleset.run.betweenFights[${i}]`, ["self", "target"], GENERAL_FROMS, [])));
  if (rs.run.perkOffer.options !== d.perkOptionsPerPick) {
    r.error("design.perkOptions", "ruleset.run.perkOffer.options", `perk picks offer ${d.perkOptionsPerPick} options (design.perkOptionsPerPick)`);
  }

  // Statuses (before actions, so applying a status carries its facts)
  pack.statuses.forEach((st, i) => {
    const facts: Fact[] = [];
    w.rules(st.rules, { path: `statuses[${i}].rules`, facts });
    w.statusFacts.set(st.id, facts);
    if (st.stacking === "stack" && !st.maxStacks) r.warn("status.maxStacks", `statuses[${i}]`, `stacking status '${st.id}' has no maxStacks`);
  });

  // Verbs
  const ops = new Set<string>([...S.InstantEffect.options.map((o) => o.shape.op.value), ...S.PassiveEffect.options.map((o) => o.shape.op.value)]);
  pack.verbs.forEach((v, i) =>
    v.signals.forEach((s, j) => {
      const p = `verbs[${i}].signals[${j}]`;
      if (s.op && !ops.has(s.op)) r.error("verb.signal", `${p}.op`, `'${s.op}' is not an effect op`);
      if (s.damageType) w.ref("damageTypes", s.damageType, `${p}.damageType`, "damage type");
      if (s.stat) w.ref("stats", s.stat, `${p}.stat`, "stat");
      if (s.statAtLeast) w.ref("stats", s.statAtLeast.stat, `${p}.statAtLeast.stat`, "stat");
    }),
  );

  // Traits
  const words = new Map<string, string>();
  const profiles = new Map<string, string>();
  pack.traits.forEach((t, i) => {
    const p = `traits[${i}]`;
    t.verbs.forEach((v, j) => w.ref("verbs", v, `${p}.verbs[${j}]`, "verb"));
    for (const word of [t.word, ...(t.forms ?? [])].map((x) => x.toLowerCase())) {
      if (words.has(word)) r.error("trait.word", p, `the word '${word}' is already used by trait '${words.get(word)}'`);
      words.set(word, t.id);
    }
    const key = [...new Set(t.verbs)].sort().join("+");
    if (profiles.has(key)) r.error("trait.profile", `${p}.verbs`, `trait '${t.id}' has the same verb profile as '${profiles.get(key)}'`);
    profiles.set(key, t.id);
  });

  pack.slots.forEach((s, i) => s.class && w.ref("classes", s.class, `slots[${i}].class`, "class"));

  // Actions (before behaviours and units, so their facts are ready)
  pack.actions.forEach((a, i) => {
    const p = `actions[${i}]`;
    const facts: Fact[] = [];
    if (a.target) w.selector(a.target, ctx(`${p}.target`, ["self"], GENERAL_FROMS, ["round"], facts));
    a.do.forEach((e, j) => w.instant(e, ctx(`${p}.do[${j}]`, ["self", "target"], [...GENERAL_FROMS, ...ACTION_FROMS], ["round"], facts)));
    if (a.hits && a.hits > 1) facts.push({ multiHit: true });
    w.actionFacts.set(a.id, facts);
    compareVerbs(pack, w, r, p, `action '${a.id}'`, a.verbs, facts);
  });

  // Behaviours
  pack.behaviours.forEach((b, i) => {
    const p = `behaviours[${i}]`;
    const facts: Fact[] = [];
    w.selector(b.basicTarget, ctx(`${p}.basicTarget`, ["self"], GENERAL_FROMS, ["round"], facts));
    if (b.modes) w.modes(b.modes, `${p}.modes`);
    w.behaviourFacts.set(b.id, facts);
  });
}

// ─── Classes, specializations, abilities ─────────────────────────────────────

function checkUnits(pack: Pack, ix: Index, w: Walker, r: Report) {
  const d = pack.design;
  const abilityFacts = new Map<string, Fact[]>();

  pack.abilities.forEach((a, i) => {
    const p = `abilities[${i}]`;
    w.ref("classes", a.class, `${p}.class`, "class");
    if (!a.rules?.length && !a.active) r.error("ability.empty", p, `ability '${a.id}' has no rules and no active`);
    const facts: Fact[] = [];
    w.rules(a.rules, { path: `${p}.rules`, facts });
    if (a.active) w.active(a.active, { path: `${p}.active`, facts });
    abilityFacts.set(a.id, facts);
    compareVerbs(pack, w, r, p, `ability '${a.id}'`, a.verbs, facts);
    const statsOnly = !a.active && (a.rules ?? []).every((ru) => ru.kind === "passive" && ru.do.every((e) => e.op === "stat"));
    if (d.rules.abilitiesAreBehaviour && a.rules?.length && statsOnly) {
      r.error("ability.notBehaviour", p, `ability '${a.id}' only changes stats; abilities change behaviour, gear changes numbers`);
    }
  });

  pack.classes.forEach((c, i) => {
    const p = `classes[${i}]`;
    c.slots.forEach((s, j) => {
      if (w.ref("slots", s, `${p}.slots[${j}]`, "slot") && ix.get<S.SlotDefT>("slots", s)!.class !== c.id) {
        r.error("class.slot", `${p}.slots[${j}]`, `slot '${s}' isn't marked as belonging to class '${c.id}'`);
      }
    });
    w.stats(c.stats, `${p}.stats`);
    if (!pack.specializations.some((s) => s.class === c.id)) r.warn("class.noSpecs", p, `class '${c.id}' has no specializations, so no units`);
  });

  const specFacts = new Map<string, Fact[]>();
  pack.specializations.forEach((s, i) => {
    const p = `specializations[${i}]`;
    const cls = w.ref("classes", s.class, `${p}.class`, "class") ? ix.get<S.ClassDefT>("classes", s.class) : undefined;
    w.stats(s.stats, `${p}.stats`);
    const facts: Fact[] = [];
    w.basic(s.basicAction, `${p}.basicAction`, facts);
    w.behaviour(s.behaviour, `${p}.behaviour`, facts);
    if (s.abilities.length !== d.abilitiesPerSpec) {
      r.error("spec.abilityCount", `${p}.abilities`, `'${s.id}' has ${s.abilities.length} abilities; every specialization has ${d.abilitiesPerSpec}`);
    }
    if (new Set(s.abilities).size !== s.abilities.length) r.error("spec.abilityDuplicate", `${p}.abilities`, `an ability is listed twice`);
    s.abilities.forEach((aid, j) => {
      if (!w.ref("abilities", aid, `${p}.abilities[${j}]`, "ability")) return;
      const a = ix.get<S.AbilityT>("abilities", aid)!;
      if (a.class !== s.class) {
        r.error("spec.abilityClass", `${p}.abilities[${j}]`, `ability '${aid}' belongs to class '${a.class}', not '${s.class}'; abilities don't cross classes`);
      }
      facts.push(...(abilityFacts.get(aid) ?? []));
    });
    facts.push(...baseStatFacts(effectiveStats(pack, cls?.stats, s.stats)));
    specFacts.set(s.id, facts);
    compareVerbs(pack, w, r, p, `specialization '${s.id}'`, s.verbs, facts);
  });

  pack.abilities.forEach((a, i) => {
    if (!pack.specializations.some((s) => s.abilities.includes(a.id))) r.warn("ability.unused", `abilities[${i}]`, `no specialization lists ability '${a.id}'`);
  });
  return { specFacts };
}

// ─── Gear ────────────────────────────────────────────────────────────────────

const SIMPLE_CONDITIONS = ["hpBelow", "hpAtLeast", "round", "alive"];

function lootGear(pack: Pack): Set<string> {
  const out = new Set<string>();
  const add = (t: S.LootTableT) => {
    t.guaranteed?.forEach((g) => out.add(g));
    t.table?.forEach((e) => out.add(e.gear));
  };
  for (const dn of pack.dungeons) {
    add(dn.loot.firstClear);
    add(dn.loot.replay);
    dn.challenges.forEach((c) => add(c.loot));
  }
  return out;
}

function checkGear(pack: Pack, ix: Index, w: Walker, r: Report) {
  const simple = pack.design.rules.efficacyGearSimple;
  const inLoot = lootGear(pack);
  pack.gear.forEach((g, i) => {
    const p = `gear[${i}]`;
    const slot = w.ref("slots", g.slot, `${p}.slot`, "slot") ? ix.get<S.SlotDefT>("slots", g.slot) : undefined;
    g.class?.forEach((c, j) => w.ref("classes", c, `${p}.class[${j}]`, "class"));
    if (slot?.class && (g.class?.length !== 1 || g.class[0] !== slot.class)) {
      r.error("gear.slotClass", `${p}.class`, `slot '${g.slot}' belongs to class '${slot.class}', so the gear must be restricted to exactly that class`);
    }
    const okSource = g.tier === "efficacy" ? g.source === "loot" || g.source === "starter" : g.source === "unlock";
    if (!okSource) r.error("gear.source", `${p}.source`, `${g.tier} gear can't come from '${g.source}' (efficacy: loot or starter; powerful and capstone: unlock)`);
    if (g.tier === "powerful" && !g.class) r.error("gear.powerfulClass", `${p}.class`, `powerful pieces are class-specific; give them a class`);
    if (g.tier === "efficacy" && simple) {
      if (g.rules?.length || g.active) r.error("gear.simple", p, `efficacy gear changes numbers only, so it carries no rules or actives`);
      g.stats.forEach((m, j) => {
        const cond = m.if;
        if (cond && !SIMPLE_CONDITIONS.some((k) => k in cond)) {
          r.error("gear.simpleCondition", `${p}.stats[${j}].if`, `efficacy gear allows one simple condition (${SIMPLE_CONDITIONS.join(", ")})`);
        }
      });
    }
    if (g.source === "loot" && !inLoot.has(g.id)) r.warn("gear.unreachable", p, `loot gear '${g.id}' isn't in any loot table`);
    const facts: Fact[] = [];
    g.stats.forEach((m, j) => {
      w.ref("stats", m.stat, `${p}.stats[${j}].stat`, "stat");
      if (m.if) w.cond(m.if, unitCtx(`${p}.stats[${j}].if`));
      facts.push({ op: "stat", stat: m.stat, sign: signOf(m.mode, m.value) });
    });
    w.rules(g.rules, { path: `${p}.rules`, facts });
    if (g.active) w.active(g.active, { path: `${p}.active`, facts });
    compareVerbs(pack, w, r, p, `gear '${g.id}'`, g.verbs, facts);
  });
}

// ─── Formations ──────────────────────────────────────────────────────────────

function checkFormations(pack: Pack, ix: Index, w: Walker, r: Report) {
  pack.formations.forEach((f, i) => {
    const p = `formations[${i}]`;
    if (f.positions.length !== pack.design.formationPositions) {
      r.error("formation.positions", `${p}.positions`, `'${f.id}' has ${f.positions.length} positions; formations always have ${pack.design.formationPositions}`);
    }
    const ids = new Set<string>();
    const cells = new Set<string>();
    const facts: Fact[] = [];
    f.positions.forEach((pos, j) => {
      const pp = `${p}.positions[${j}]`;
      if (ids.has(pos.id)) r.error("formation.positionId", pp, `duplicate position id '${pos.id}'`);
      ids.add(pos.id);
      const cell = `${pos.layout.line}:${pos.layout.column}`;
      if (cells.has(cell)) r.error("formation.layout", `${pp}.layout`, `two slots are drawn in the same place (${pos.layout.line}, column ${pos.layout.column})`);
      cells.add(cell);
      w.rules(pos.rules, { path: `${pp}.rules`, facts });
      if (pos.rules?.length && !pos.text) r.warn("formation.slotText", pp, `slot '${pos.id}' has effects but no text telling the player what it does`);
    });
    w.rules(f.rules, { path: `${p}.rules`, facts });
    compareVerbs(pack, w, r, p, `formation '${f.id}'`, f.verbs, facts);
  });
}

// ─── Enemies ─────────────────────────────────────────────────────────────────

function partyVerbs(pack: Pack) {
  return new Set<string>([
    ...pack.specializations.flatMap((s) => s.verbs),
    ...pack.gear.flatMap((g) => g.verbs),
    ...pack.formations.flatMap((f) => f.verbs),
    ...pack.perks.flatMap((p) => p.verbs),
  ]);
}

function checkEnemies(pack: Pack, ix: Index, w: Walker, r: Report) {
  const d = pack.design;
  const available = partyVerbs(pack);
  pack.enemies.forEach((e, i) => {
    const p = `enemies[${i}]`;
    w.stats(e.stats, `${p}.stats`);
    // Facts per mechanic (basic action, each active, each rule), so keyholes can point at one.
    const mechanics = new Map<string, Fact[]>();
    const mechanic = (id: string, f: Fact[]) => mechanics.set(id, [...(mechanics.get(id) ?? []), ...f]);
    const facts: Fact[] = [];
    const basicFacts: Fact[] = [];
    w.basic(e.basicAction, `${p}.basicAction`, basicFacts);
    mechanic(e.basicAction, basicFacts);
    facts.push(...basicFacts);
    w.behaviour(e.behaviour, `${p}.behaviour`, facts);
    e.actives?.forEach((a, j) => {
      const f: Fact[] = [];
      w.active(a, { path: `${p}.actives[${j}]`, facts: f });
      mechanic(a.action, f);
      facts.push(...f);
    });
    const ruleIds = new Set<string>();
    e.rules?.forEach((rule, j) => {
      const rp = `${p}.rules[${j}]`;
      if (ruleIds.has(rule.id)) r.error("rule.duplicateId", rp, `duplicate rule id '${rule.id}'`);
      ruleIds.add(rule.id);
      const f: Fact[] = [];
      w.rule(rule, { path: rp, facts: f });
      mechanic(rule.id, f);
      facts.push(...f);
    });
    facts.push(...baseStatFacts(effectiveStats(pack, e.stats)));
    compareVerbs(pack, w, r, p, `enemy '${e.id}'`, e.verbs, facts);
    const derived = deriveVerbs(pack, facts);

    // Traits: the word is in the text, and the data backs it.
    const text = e.text.toLowerCase();
    e.traits.forEach((tid, j) => {
      if (!w.ref("traits", tid, `${p}.traits[${j}]`, "trait")) return;
      const t = ix.get<S.TraitDefT>("traits", tid)!;
      const forms = [t.word, ...(t.forms ?? [])];
      if (!forms.some((f) => text.includes(f.toLowerCase()))) {
        r.error("enemy.traitText", `${p}.text`, `trait '${t.id}' isn't named in the enemy's text (expected one of: ${forms.map((f) => `"${f}"`).join(", ")})`);
      }
      const missing = t.verbs.filter((v) => !derived.has(v));
      if (missing.length) {
        r.error("enemy.traitUnsupported", `${p}.traits[${j}]`, `trait '${t.id}' promises ${missing.join(", ")}, but nothing in this enemy's data shows it`);
      }
    });

    // Keyholes: design intent, grounded in the enemy's own verbs.
    const kh = e.keyholes ?? [];
    if (e.rank === "boss" && (kh.length < d.keyholesPerBoss[0] || kh.length > d.keyholesPerBoss[1])) {
      r.error("enemy.keyholes", `${p}.keyholes`, `boss has ${kh.length} keyholes; bosses have ${d.keyholesPerBoss[0]}–${d.keyholesPerBoss[1]}`);
    }
    if (e.rank === "boss" && kh.length && !kh.some((k) => k.mechanic)) {
      r.warn("enemy.keyholeMechanics", `${p}.keyholes`, `every keyhole comes from base stats; bosses need gimmicks (rules, actives, states, summons) too`);
    }
    const khIds = new Set<string>();
    kh.forEach((k, m) => {
      const kp = `${p}.keyholes[${m}]`;
      if (khIds.has(k.id)) r.error("keyhole.id", kp, `duplicate keyhole id '${k.id}'`);
      khIds.add(k.id);
      if (w.ref("verbs", k.from, `${kp}.from`, "verb")) {
        if (k.mechanic !== undefined) {
          const mf = mechanics.get(k.mechanic);
          if (!mf) {
            r.error("keyhole.mechanic", `${kp}.mechanic`, `'${e.id}' has no rule, active or basic action '${k.mechanic}'`);
          } else if (!deriveVerbs(pack, mf).has(k.from)) {
            r.error("keyhole.from", `${kp}.from`, `keyhole comes from '${k.from}', but mechanic '${k.mechanic}' doesn't show it`);
          }
        } else if (!derived.has(k.from)) {
          r.error("keyhole.from", `${kp}.from`, `keyhole comes from '${k.from}', but nothing in this enemy's data shows it`);
        }
      }
      k.counteredBy.forEach((v, n) => w.ref("verbs", v, `${kp}.counteredBy[${n}]`, "verb"));
      k.strongAgainst?.forEach((v, n) => w.ref("verbs", v, `${kp}.strongAgainst[${n}]`, "verb"));
      const both = k.counteredBy.filter((v) => k.strongAgainst?.includes(v));
      if (both.length) r.error("keyhole.contradiction", kp, `${both.join(", ")} is listed as both countering and blunted`);
      if (!k.counteredBy.some((v) => available.has(v))) {
        r.warn("keyhole.unanswerable", kp, `nothing on the party side of this pack brings ${k.counteredBy.join(" or ")}`);
      }
    });
  });
}

// ─── Perks ───────────────────────────────────────────────────────────────────

function checkPerks(pack: Pack, ix: Index, w: Walker, r: Report) {
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
    if (!pk.rules?.length && !pk.patches?.length) r.error("perk.empty", p, `perk '${pk.id}' has no rules and no patches`);
    if (pk.requires) w.cond(pk.requires, unitCtx(`${p}.requires`));
    if (pk.appliesTo) w.cond(pk.appliesTo, unitCtx(`${p}.appliesTo`));
    const facts: Fact[] = [];
    w.rules(pk.rules, { path: `${p}.rules`, facts });
    pk.patches?.forEach((pt, j) => {
      const pp = `${p}.patches[${j}]`;
      if (!w.ref("abilities", pt.ability, `${pp}.ability`, "ability")) return;
      const ability = ix.get<S.AbilityT>("abilities", pt.ability)!;
      if (pt.rule === undefined) {
        // Patching the ability's active.
        if (!ability.active) return r.error("perk.patchActive", pp, `ability '${pt.ability}' has no active to patch; name a rule`);
        if (pt.addEffects || pt.chanceAdd !== undefined) r.error("perk.patchActive", pp, `an active can only be patched with amountMul or cooldownAdd`);
        // A perk that only tunes something shows that thing's verbs.
        facts.push(...(w.actionFacts.get(ability.active.action) ?? []));
        return;
      }
      const rule = ability.rules?.find((x) => x.id === pt.rule);
      if (!rule) return r.error("perk.patchRule", `${pp}.rule`, `ability '${pt.ability}' has no rule '${pt.rule}'`);
      if (pt.cooldownAdd !== undefined) r.error("perk.patchRule", pp, `cooldownAdd patches an active; leave out 'rule'`);
      if (rule.kind !== "triggered") {
        if (pt.addEffects || pt.chanceAdd !== undefined) r.error("perk.patchPassive", pp, `rule '${pt.rule}' is passive; only amountMul can patch it`);
        return;
      }
      if (pt.addEffects) {
        const c = w.triggeredCtx(rule.when, { path: `${pp}.addEffects`, facts });
        const ec = { ...c, subjects: new Set<S.Subject>([...c.subjects, "target"]) };
        pt.addEffects.forEach((e, k) => w.instant(e, { ...ec, path: `${pp}.addEffects[${k}]` }));
      } else {
        // A perk that only tunes a rule shows that rule's verbs.
        w.rule(rule, { path: `${pp}(${pt.ability}.${pt.rule})`, facts });
      }
      if (pt.amountMul && pt.amountMul > 1) facts.push({ amountUp: true });
    });
    if (pk.patches?.length && !pk.requires) {
      r.warn("perk.requires", p, `perk '${pk.id}' patches an ability but has no 'requires', so it can't tell whether a party can use it`);
    }
    compareVerbs(pack, w, r, p, `perk '${pk.id}'`, pk.verbs, facts);
    if (!pack.dungeons.some((dn) => dn.perkPool.includes(pk.id))) r.warn("perk.unused", p, `perk '${pk.id}' isn't in any dungeon's pool`);
  });
}

// ─── Dungeons and challenges ─────────────────────────────────────────────────

function checkLoot(pack: Pack, ix: Index, w: Walker, r: Report, t: S.LootTableT, path: string) {
  const ids = [...(t.guaranteed ?? []).map((g, i) => [g, `${path}.guaranteed[${i}]`]), ...(t.table ?? []).map((e, i) => [e.gear, `${path}.table[${i}].gear`])];
  for (const [g, p] of ids) {
    if (!w.ref("gear", g, p, "gear")) continue;
    const gear = ix.get<S.GearT>("gear", g)!;
    if (gear.source !== "loot") r.error("loot.source", p, `'${g}' is ${gear.source} gear; loot tables only drop loot gear`);
  }
  const rolls = t.rolls ?? 0;
  if (rolls > 0 && !t.table?.length) r.error("loot.table", path, `${rolls} roll(s) but no table`);
  if (rolls === 0 && t.table?.length) r.warn("loot.table", path, `a table with no rolls never drops`);
  if (!t.guaranteed?.length && rolls === 0) r.error("loot.empty", path, `this clear must pay gear`);
}

function checkDungeons(pack: Pack, ix: Index, w: Walker, r: Report) {
  const d = pack.design;
  pack.dungeons.forEach((dn, i) => {
    const p = `dungeons[${i}]`;
    const cap = dn.partySize.max;
    if (cap < d.partySize[0] || cap > d.partySize[1]) r.error("dungeon.partySize", `${p}.partySize.max`, `party size ${cap} is outside ${d.partySize[0]}–${d.partySize[1]}`);

    // Perk pool
    const pool = dn.perkPool;
    if (new Set(pool).size !== pool.length) r.error("dungeon.perkPoolDuplicate", `${p}.perkPool`, `a perk appears twice`);
    pool.forEach((id, j) => w.ref("perks", id, `${p}.perkPool[${j}]`, "perk"));
    if (pool.length < d.perkPoolSize[0] || pool.length > d.perkPoolSize[1]) {
      r.error("dungeon.perkPool", `${p}.perkPool`, `pool has ${pool.length} perks; pools hold ${d.perkPoolSize[0]}–${d.perkPoolSize[1]}`);
    }
    const regulars = pool.filter((id) => ix.get<S.PerkT>("perks", id)?.rarity === "regular");
    if (regulars.length < d.perkOptionsPerPick) r.error("dungeon.perkPoolRegular", `${p}.perkPool`, `fewer regular perks than options per pick`);
    pool.forEach((id, j) => {
      const pk = ix.get<S.PerkT>("perks", id);
      if (pk?.upgradeOf && !pool.includes(pk.upgradeOf)) r.warn("dungeon.premiumBase", `${p}.perkPool[${j}]`, `premium '${id}' upgrades '${pk.upgradeOf}', which isn't in this pool`);
    });

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
      if (k === "perk_pick" && (kinds[j - 1] !== "fight" || kinds[j + 1] !== "fight")) {
        r.error("dungeon.stageOrder", `${p}.stages[${j}]`, `perk picks happen between two fights`);
      }
    });
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

    // Loot
    checkLoot(pack, ix, w, r, dn.loot.firstClear, `${p}.loot.firstClear`);
    checkLoot(pack, ix, w, r, dn.loot.replay, `${p}.loot.replay`);

    // Challenges
    const chIds = new Set<string>();
    dn.challenges.forEach((ch, j) => {
      const cp = `${p}.challenges[${j}]`;
      if (chIds.has(ch.id)) r.error("challenge.id", cp, `duplicate challenge id '${ch.id}'`);
      chIds.add(ch.id);
      checkLoot(pack, ix, w, r, ch.loot, `${cp}.loot`);
      let minUnits = 0;
      ch.constraints.forEach((c, k) => {
        const kp = `${cp}.constraints[${k}]`;
        if ("partySize" in c) {
          const { min, max } = c.partySize;
          if (min !== undefined && max !== undefined && min > max) r.error("challenge.impossible", kp, `min is above max`);
          if (min !== undefined && min > cap) r.error("challenge.impossible", kp, `needs ${min} units, but the dungeon allows ${cap}`);
          minUnits = Math.max(minUnits, min ?? 0);
        } else if ("classCount" in c) {
          const { class: cls, min, max } = c.classCount;
          if (!w.ref("classes", cls, `${kp}.classCount.class`, "class")) return;
          const owned = pack.specializations.filter((s) => s.class === cls).length;
          if (min !== undefined && min > owned) r.error("challenge.impossible", kp, `needs ${min} '${cls}' units, but the class has ${owned} specializations and each is one unit`);
          if (min !== undefined && min > cap) r.error("challenge.impossible", kp, `needs ${min} '${cls}' units, but the dungeon allows ${cap}`);
          if (min !== undefined && max !== undefined && min > max) r.error("challenge.impossible", kp, `min is above max`);
          minUnits += min ?? 0;
        } else if ("includesSpec" in c) {
          w.ref("specializations", c.includesSpec, `${kp}.includesSpec`, "specialization");
        } else if ("excludesSpec" in c) {
          w.ref("specializations", c.excludesSpec, `${kp}.excludesSpec`, "specialization");
        } else if ("excludesClass" in c) {
          w.ref("classes", c.excludesClass, `${kp}.excludesClass`, "class");
        } else if ("formation" in c) {
          w.ref("formations", c.formation, `${kp}.formation`, "formation");
        }
      });
      if (minUnits > cap) r.error("challenge.impossible", cp, `constraints need at least ${minUnits} units, but the dungeon allows ${cap}`);
    });
  });
}

// ─── Starter and progression ─────────────────────────────────────────────────

function checkStarterAndProgression(pack: Pack, ix: Index, w: Walker, r: Report) {
  const st = pack.starter;
  const pairs: [Coll, string[], { id: string; source: string }[], string][] = [
    ["specializations", st.specializations, pack.specializations, "specialization"],
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
  pack.dungeons.forEach((dn) => {
    if (!order.includes(dn.id)) r.error("progression.missing", "progression.dungeonOrder", `dungeon '${dn.id}' isn't in the progression order`);
  });
}

// ─── Basic actions vs targeted actions ───────────────────────────────────────

function checkActionUse(pack: Pack, ix: Index, w: Walker, r: Report) {
  for (const [id, path] of w.basicUses) {
    const a = ix.get<S.ActionT>("actions", id);
    if (a?.target) r.error("action.basicTarget", path, `'${id}' is a basic action, so it takes its target from the unit's behaviour; remove its target`);
    if (w.targetedUses.has(id)) r.error("action.dualUse", path, `'${id}' is used both as a basic action and as an active or reaction; split it in two`);
  }
  for (const [id, path] of w.targetedUses) {
    const a = ix.get<S.ActionT>("actions", id);
    if (a && !a.target) r.error("action.target", path, `'${id}' is used as an active or reaction, so it needs its own target`);
  }
}

// ─── Totals for a full content set ───────────────────────────────────────────

function checkComplete(pack: Pack, r: Report, specFacts: Map<string, Fact[]>) {
  const c = pack.design.complete;
  const inRange = (n: number, rg: [number, number]) => n >= rg[0] && n <= rg[1];
  if (!inRange(pack.classes.length, c.classes)) r.error("complete.classes", "classes", `${pack.classes.length} classes; a full set has ${c.classes[0]}–${c.classes[1]}`);
  for (const cl of pack.classes) {
    const n = pack.specializations.filter((s) => s.class === cl.id).length;
    if (!inRange(n, c.specsPerClass)) r.error("complete.specsPerClass", "specializations", `class '${cl.id}' has ${n} specializations; a full set has ${c.specsPerClass[0]}–${c.specsPerClass[1]}`);
  }
  if (!inRange(pack.verbs.length, c.verbs)) r.error("complete.verbs", "verbs", `${pack.verbs.length} verbs; a full set has ${c.verbs[0]}–${c.verbs[1]}`);

  // Roster niche: a status applied to other units should belong to few specializations.
  const total = pack.specializations.length;
  if (!total) return;
  for (const st of pack.statuses) {
    if (st.on === "self") continue;
    const users = pack.specializations.filter((s) => (specFacts.get(s.id) ?? []).some((f) => f.op === "apply_status" && f.status === st.id && f.from !== "self"));
    if (users.length / total > c.maxStatusShare) {
      r.warn(
        "complete.statusNiche",
        "specializations",
        `${users.length} of ${total} specializations apply '${st.id}' (${users.map((u) => u.id).join(", ")}); above the ${Math.round(c.maxStatusShare * 100)}% niche limit`,
      );
    }
  }
}

// ─── Unused registry entries ─────────────────────────────────────────────────

function checkUnused(pack: Pack, ix: Index, r: Report) {
  const declared = new Set<string>([
    ...pack.specializations.flatMap((s) => s.verbs),
    ...pack.abilities.flatMap((a) => a.verbs),
    ...pack.gear.flatMap((g) => g.verbs),
    ...pack.formations.flatMap((f) => f.verbs),
    ...pack.enemies.flatMap((e) => e.verbs),
    ...pack.perks.flatMap((p) => p.verbs),
  ]);
  pack.verbs.forEach((v, i) => !declared.has(v.id) && r.warn("verb.unused", `verbs[${i}]`, `no content uses verb '${v.id}'`));
  const used = (c: Coll) => ix.used.get(c)!;
  pack.statuses.forEach((s, i) => !used("statuses").has(s.id) && r.warn("status.unused", `statuses[${i}]`, `nothing applies or reads status '${s.id}'`));
  pack.actions.forEach((a, i) => !used("actions").has(a.id) && r.warn("action.unused", `actions[${i}]`, `no unit uses action '${a.id}'`));
  pack.behaviours.forEach((b, i) => !used("behaviours").has(b.id) && r.warn("behaviour.unused", `behaviours[${i}]`, `no unit uses behaviour '${b.id}'`));
  pack.traits.forEach((t, i) => !used("traits").has(t.id) && r.warn("trait.unused", `traits[${i}]`, `no enemy uses trait '${t.id}'`));
  pack.perkFamilies.forEach((f, i) => !pack.perks.some((p) => p.family === f.id) && r.warn("perkFamily.unused", `perkFamilies[${i}]`, `family '${f.id}' has no perks`));
}

// ─────────────────────────────────────────────────────────────────────────────
// Party loadouts and challenges (engine input, checked against a valid pack)
// ─────────────────────────────────────────────────────────────────────────────

/** What a player owns. Gear is a count per item: copies can be equipped up to that count. */
export type Owned = { specializations?: string[]; formations?: string[]; gear?: Record<string, number> };

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

  const specs = new Set<string>();
  const positions = new Set<string>();
  const gearUse = new Map<string, number>();
  party.units.forEach((u, i) => {
    const p = `units[${i}]`;
    const spec = ix.get<S.SpecializationT>("specializations", u.spec);
    if (!spec) return r.error("ref.missing", `${p}.spec`, `unknown specialization '${u.spec}'`);
    if (specs.has(u.spec)) r.error("party.uniqueSpec", `${p}.spec`, `'${u.spec}' is already in the party; each specialization is one unit`);
    specs.add(u.spec);
    if (opts.owned?.specializations && !opts.owned.specializations.includes(u.spec)) r.error("party.notOwned", `${p}.spec`, `'${u.spec}' isn't owned`);

    if (formation && !formation.positions.some((x) => x.id === u.position)) r.error("party.position", `${p}.position`, `formation '${formation.id}' has no position '${u.position}'`);
    if (positions.has(u.position)) r.error("party.position", `${p}.position`, `position '${u.position}' is already taken`);
    positions.add(u.position);

    if (u.abilities.length !== d.abilitiesEquipped) r.error("party.abilities", `${p}.abilities`, `${u.abilities.length} abilities equipped; units equip ${d.abilitiesEquipped}`);
    if (new Set(u.abilities).size !== u.abilities.length) r.error("party.abilities", `${p}.abilities`, `an ability is equipped twice`);
    u.abilities.forEach((a, j) => {
      if (!spec.abilities.includes(a)) r.error("party.abilityNotOwned", `${p}.abilities[${j}]`, `'${u.spec}' doesn't have ability '${a}'`);
    });

    const cls = ix.get<S.ClassDefT>("classes", spec.class);
    const generic = pack.slots.filter((s) => !s.class).map((s) => s.id);
    const allowed = new Set([...generic, ...(cls?.slots ?? [])]);
    for (const [slot, gid] of Object.entries(u.gear)) {
      const gp = `${p}.gear.${slot}`;
      if (!allowed.has(slot)) r.error("party.slot", gp, `a ${spec.class} has no slot '${slot}'`);
      const g = ix.get<S.GearT>("gear", gid);
      if (!g) {
        r.error("ref.missing", gp, `unknown gear '${gid}'`);
        continue;
      }
      if (g.slot !== slot) r.error("party.gearSlot", gp, `'${gid}' goes in slot '${g.slot}', not '${slot}'`);
      if (g.class && !g.class.includes(spec.class)) r.error("party.gearClass", gp, `'${gid}' can't be equipped by a ${spec.class}`);
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
  const classOf = (u: S.PartyUnitT) => ix.get<S.SpecializationT>("specializations", u.spec)?.class;
  const out: string[] = [];
  for (const c of ch.constraints) {
    if ("partySize" in c) {
      const n = party.units.length;
      if ((c.partySize.min !== undefined && n < c.partySize.min) || (c.partySize.max !== undefined && n > c.partySize.max)) out.push(`party size ${n}`);
    } else if ("classCount" in c) {
      const n = party.units.filter((u) => classOf(u) === c.classCount.class).length;
      if ((c.classCount.min !== undefined && n < c.classCount.min) || (c.classCount.max !== undefined && n > c.classCount.max)) out.push(`${n} ${c.classCount.class} units`);
    } else if ("includesSpec" in c) {
      if (!party.units.some((u) => u.spec === c.includesSpec)) out.push(`no ${c.includesSpec}`);
    } else if ("excludesSpec" in c) {
      if (party.units.some((u) => u.spec === c.excludesSpec)) out.push(`includes ${c.excludesSpec}`);
    } else if ("excludesClass" in c) {
      if (party.units.some((u) => classOf(u) === c.excludesClass)) out.push(`includes a ${c.excludesClass}`);
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
  const ownedSpecs = new Set(owned.specializations ?? []);
  const needs: string[] = [];
  for (const c of ch.constraints) {
    if ("includesSpec" in c && !ownedSpecs.has(c.includesSpec)) needs.push(`specialization ${c.includesSpec}`);
    if ("classCount" in c && c.classCount.min) {
      const ofClass = pack.specializations.filter((s) => s.class === c.classCount.class);
      const have = ofClass.filter((s) => ownedSpecs.has(s.id)).length;
      const short = c.classCount.min - have;
      if (short > 0) {
        const candidates = ofClass.filter((s) => !ownedSpecs.has(s.id)).map((s) => s.id);
        needs.push(`${short} more ${c.classCount.class} specialization(s): any of ${candidates.join(", ")}`);
      }
    }
    if ("formation" in c && owned.formations && !owned.formations.includes(c.formation)) needs.push(`formation ${c.formation}`);
  }
  return { teased: needs.length > 0, needs };
}
