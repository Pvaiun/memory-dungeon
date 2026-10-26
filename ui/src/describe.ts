/**
 * Plain-language descriptions of abilities, targets, effects, statuses and
 * timings, in the documents' own words where the rules give them, with the
 * numbers worked out against a unit's stats when one is given.
 */
import type { AbilityT, EffectT, NumT, StatusT, TargetRuleT, WeaponT } from "../../src/schema.js";
import { resolveWeapon } from "../../src/engine/combat/fight.js";
import { c, disp, elementName, enemy, status } from "./content.js";
import { enemyDisplayName } from "./art.js";

export type Stats = Record<string, number>;

// ─── Timing words (content/core-set/scale.ts) ───
const CAST_WORD: Record<number, string> = { 0: "none", 0.5: "quick", 1.5: "normal", 4: "long", 8: "very long" };
const CD_WORD: Record<number, string> = { 6: "short", 12: "medium", 22: "long" };
export const castWord = (t: number) => CAST_WORD[t] ?? `${t} ticks`;
export const cooldownWord = (t: number) => CD_WORD[t] ?? `${t} ticks`;
export const ticks = (t: number) => `${Number(t.toFixed(2))}t`;

// ─── Numbers ───
/** base + Σ ratio × stat, for the stat terms; the rest is described in words. */
export function evalNum(n: NumT, stats: Stats | null, target: Stats | null = null): { value: number; extra: string[] } {
  if (typeof n === "number") return { value: n, extra: [] };
  let v = n.base ?? 0;
  const extra: string[] = [];
  for (const s of n.scale) {
    const who = s.of === "target" ? target : s.of === "holder" ? stats : stats;
    if (s.stat) {
      if (who && who[s.stat] !== undefined) v += s.ratio * who[s.stat];
      else extra.push(`${fmtRatio(s.ratio)} × ${statWord(s.stat)}${s.of === "target" ? " of the target" : ""}`);
    } else if (s.stacks) extra.push(`+${disp(s.ratio)} per ${status(s.stacks).name} stack on the target`);
    else if (s.hp) extra.push(`${fmtRatio(s.ratio)} × ${s.hp} HP`);
    else if (s.amount) extra.push(`${Math.round(s.ratio * 100)}% of the amount${s.times ? ` × ${statWord(s.times.stat)}` : ""}`);
    else if (s.when) extra.push("doubled when the condition holds");
  }
  return { value: v, extra };
}
const fmtRatio = (r: number) => (Number.isInteger(r) ? String(r) : String(Number(r.toFixed(3))));
export const statWord = (key: string) => c.stats.get(key)?.name ?? key;

/**
 * A damage or heal amount for display: "≈ 110" with its scaling in words. `scaling`: also name the stats a worked-out number
 * scales from, "≈ 18 (6 × Thorns)" (the designer view's effects; it showed the number alone, so Bramble lash didn't say Thorns).
 */
export function amountText(n: NumT, stats: Stats | null, target: Stats | null = null, scaling = false): string {
  const { value, extra } = evalNum(n, stats, target);
  const parts: string[] = [];
  const formula = scaling && typeof n !== "number" && n.scale.some((s) => s.stat) ? ` (${describeScale(n)})` : "";
  if (stats || typeof n === "number") parts.push(`≈ ${disp(value)}${formula}`);
  else parts.push(describeScale(n));
  if (extra.length) parts.push(extra.join(", "));
  return parts.join(", ");
}
function describeScale(n: NumT): string {
  if (typeof n === "number") return String(disp(n));
  return [n.base ? String(disp(n.base)) : "", ...n.scale.map((s) => (s.stat ? `${fmtRatio(s.ratio)} × ${statWord(s.stat)}` : ""))].filter(Boolean).join(" + ");
}

/** Stacks an application adds: "≈ 4 stacks (scales from Magic)". */
export function stacksText(n: NumT | undefined, stats: Stats | null, statusId?: string): string {
  if (n === undefined) return "1 stack";
  const { value } = evalNum(n, stats);
  const from = typeof n === "number" ? "" : n.scale.map((s) => s.stat).filter(Boolean).map((s) => statWord(s!)).join(", ");
  if (statusId === "shield") return stats || typeof n === "number" ? `≈ ${disp(value)} points${from ? ` (from ${from})` : ""}` : `points from ${from}`;
  if (typeof n === "number") return `${n} stack${n === 1 ? "" : "s"}`;
  return stats ? `≈ ${Math.round(value * 10) / 10} stacks (from ${from})` : `stacks from ${from}`;
}

// ─── Targets, in the rules document's phrases ───
export function targetPhrase(t: AbilityT["target"] | "foe" | "ally" | "self" | TargetRuleT | undefined, seek = false): string {
  if (!t || t === "foe") return "a random foe";
  if (t === "ally") return "a random ally";
  if (t === "self") return "itself";
  const r = t;
  const side = r.side === "foes" ? "foe" : r.side === "allies" ? "ally" : r.side === "others" ? "other ally" : "itself";
  if (r.side === "self") return r.where ? `itself${whereText(r.where)}` : "itself";
  if (r.pick === "all") return `every ${side}${whereText(r.where)}`;
  const n = r.count ?? 1;
  const other = r.exclude === "targets" ? "other " : "";
  if (r.pick === "lowest" || r.pick === "highest") {
    const by = r.by!;
    let what: string;
    if (by === "hp") what = `the ${r.pick} current HP`;
    else if (by === "hp_share") what = `the ${r.pick} share of max HP`;
    else if (by === "buffs" || by === "debuffs") what = `the ${r.pick === "highest" ? "most" : "fewest"} ${by}`;
    else if ("stat" in by) what = `the ${r.pick} ${statWord(by.stat)}`;
    else if ("stats" in by) what = `the ${r.pick} ${by.stats.map(statWord).join(" or ")}`;
    else what = `the ${r.pick === "highest" ? "most" : "least"} ${status(by.stacks).name}`;
    const base = `the ${other}${side} with ${what}${whereText(r.where)}`;
    return r.ifNone === "any" || (by !== "hp" && by !== "hp_share" && typeof by === "object" && "stacks" in by) ? `${base} (if none, a random ${side})` : base;
  }
  const count = n > 1 ? `up to ${n} ${other}random ${side}s` : `a ${other}random ${side}`;
  return `${count}${whereText(r.where)}${r.ifNone === "any" ? ` (if none, any ${side})` : ""}${seek ? ", past Taunt" : ""}`;
}

function whereText(w: TargetRuleT["where"]): string {
  if (!w) return "";
  const parts: string[] = [];
  if (w.ko) parts.push("knocked out");
  if (w.buffs === true) parts.push("with a buff");
  if (w.buffs === false) parts.push("without a buff");
  if (w.debuffs === true) parts.push("with a debuff");
  if (w.debuffs === false) parts.push("without a debuff");
  if (w.has) parts.push(`with ${[w.has].flat().map((s) => status(s).name).join(" and ")}`);
  if (w.lacks) parts.push(`without ${[w.lacks].flat().map((s) => status(s).name).join(" or ")}`);
  if (w.hpBelow !== undefined) parts.push(`below ${w.hpBelow}% HP`);
  if (w.hpAtLeast !== undefined) parts.push(`at ${w.hpAtLeast}% HP or more`);
  if (w.belowCap) parts.push(`whose ${status(w.belowCap).name} isn't full`);
  if (w.atCap) parts.push(`whose ${status(w.atCap).name} is full`);
  if (w.stacks) parts.push(`with ${w.stacks.atLeast}+ ${status(w.stacks.status).name}`);
  return parts.length ? ` ${parts.join(", ")}` : "";
}

export function conditionText(a: AbilityT): string | null {
  if (!a.if) return null;
  const side = a.if.side === "foes" ? "foe" : "ally";
  const w = wherePredicate(a.if.where);
  if (a.if.side === "self") return `waits until it ${w}`;
  const n = a.if.atLeast ?? 1;
  return `waits until ${n > 1 ? `${n} ${side}s` : `an ${side}`} ${w}`;
}

/** A condition as a predicate: "has a debuff", "is knocked out". */
function wherePredicate(w: TargetRuleT["where"]): string {
  if (!w) return "exists";
  const parts: string[] = [];
  if (w.ko) parts.push("is knocked out");
  if (w.buffs === true) parts.push("has a buff");
  if (w.buffs === false) parts.push("has no buff");
  if (w.debuffs === true) parts.push("has a debuff");
  if (w.debuffs === false) parts.push("has no debuff");
  if (w.has) parts.push(`has ${[w.has].flat().map((s) => status(s).name).join(" and ")}`);
  if (w.lacks) parts.push(`lacks ${[w.lacks].flat().map((s) => status(s).name).join(" and ")}`);
  if (w.hpBelow !== undefined) parts.push(w.hpBelow === 100 ? "is hurt" : `is below ${w.hpBelow}% HP`);
  if (w.hpAtLeast !== undefined) parts.push(`is at ${w.hpAtLeast}% HP or more`);
  if (w.belowCap) parts.push(`has room for more ${status(w.belowCap).name}`);
  if (w.atCap) parts.push(`has full ${status(w.atCap).name}`);
  if (w.stacks) parts.push(`has ${w.stacks.atLeast}+ ${status(w.stacks.status).name}`);
  return parts.join(" and ") || "exists";
}

// ─── Effects ───
export function effectText(e: EffectT, stats: Stats | null, inAction = true): string {
  const to = "to" in e && e.to ? (typeof e.to === "string" ? (e.to === "target" ? "" : e.to === "self" ? " on itself" : e.to === "holder" ? "" : e.to === "other" ? " on the attacker" : " on its source") : ` on ${targetPhrase(e.to)}`) : "";
  switch (e.op) {
    case "damage": {
      const kind = e.type === "physical" ? `${e.subtype ?? "physical"} damage` : e.type === "magical" ? `${elementName(e.element ?? "")} damage` : e.element ? `${elementName(e.element)} damage` : "untyped damage";
      const hits = e.hits && e.hits > 1 ? `${e.hits} hits of ` : "";
      const apply = (e.apply ?? []).map((a) => `applies ${status(a.status).name}${a.stacks !== undefined ? ` (${stacksText(a.stacks, stats, a.status)})` : ""}${a.chance !== undefined && a.chance < 100 ? `, ${a.chance}% chance` : ""}`);
      const riders = (e.riders ?? []).map((r) => `plus ${r.element ? elementName(r.element) : r.subtype} ${amountText(r.amount, stats, null, true)}`);
      return [`${hits}${kind}${to}: ${amountText(e.amount, stats, null, true)}`, ...riders, ...apply].join("; ");
    }
    case "heal":
      return `heals${to}: ${amountText(e.amount, stats, null, true)}`;
    case "mp":
      return `MP${to}: ${amountText(e.amount, stats)}`;
    case "apply": {
      const d = status(e.status);
      const dur = e.duration !== undefined ? (e.duration === "permanent" ? ", for the fight" : `, ${e.duration} ticks`) : "";
      return `applies ${d.name}${to}${d.stacking === "intensity" ? ` (${stacksText(e.stacks, stats, e.status)})` : ""}${dur}${e.chance !== undefined && e.chance < 100 ? `, ${e.chance}% chance` : ""}`;
    }
    case "remove":
      return `removes ${e.count ? `${e.count} ` : "all "}${e.status ? status(e.status).name : e.label === "buff" ? "buffs" : "debuffs"}${e.order === "random" ? " (at random)" : ""}${to}`;
    case "revive": {
      const { extra, value } = evalNum(e.hp, null);
      const share = typeof e.hp !== "number" && e.hp.scale[0]?.stat === "max_hp" ? `${Math.round(e.hp.scale[0].ratio * 100)}% of max HP` : extra.join(", ") || String(disp(value));
      return `revives${to} with ${share}${e.ready ? ", every action ready" : ", every action on cooldown"}`;
    }
    case "summon":
      return `summons ${e.count ?? 1} ${enemyDisplayName(e.enemy)}${(e.count ?? 1) > 1 ? "s" : ""}`;
    case "replace":
      return `is replaced by ${e.count ?? 1} ${enemyDisplayName(e.enemy)}s`;
  }
  return inAction ? "" : "";
}

// ─── Abilities ───
export type AbilityInfo = {
  id: string;
  name: string;
  text: string;
  target: string;
  waits: string | null;
  seek: boolean;
  mp: number;
  cast: number;
  cooldown: number;
  recovery: number;
  effects: string[];
  tag: string;
};

export function abilityInfo(a: AbilityT, stats: Stats | null): AbilityInfo {
  const rs = c.pack.ruleset;
  return {
    id: a.id, name: a.name, text: a.text, target: targetPhrase(a.target, a.seek), waits: conditionText(a), seek: a.seek ?? false,
    mp: a.mp ?? 0, cast: a.cast ?? rs.abilityCast, cooldown: a.cooldown, recovery: a.recovery ?? rs.abilityRecovery,
    effects: a.do.map((e) => effectText(e, stats)), tag: abilityTag(a),
  };
}

/** What kind of thing an ability is, for its icon and VFX: an element, a physical subtype, or support. */
export function abilityTag(a: AbilityT): string {
  for (const e of a.do) {
    if (e.op === "damage") return e.type === "magical" ? (e.element ?? "magical") : (e.subtype ?? "physical");
  }
  const first = a.do[0];
  if (first.op === "heal") return "heal";
  if (first.op === "revive") return "revive";
  if (first.op === "remove") return first.label === "buff" ? "dispel" : "cleanse";
  if (first.op === "apply") return status(first.status).label === "buff" ? (first.status === "shield" ? "shield" : "buff") : "debuff";
  if (first.op === "summon") return "summon";
  if (first.op === "replace") return "split";
  return "buff";
}

/** The basic attack a weapon gives, worked out for a unit's stats. */
export function weaponInfo(wp: WeaponT, stats: Stats | null): { kind: string; type: string; element?: string; subtype?: string; cooldown: number; cast: number; hit: string; tag: string } {
  const r = resolveWeapon(c, wp);
  const kind = wp.kind ? c.weaponKinds.get(wp.kind)?.name ?? wp.kind : r.type === "magical" ? `${elementName(r.element ?? "")} touch` : `${r.subtype} attack`;
  return {
    kind, type: r.type, element: r.element, subtype: r.subtype, cooldown: r.cooldown, cast: wp.cast ?? 0,
    hit: `${amountText(wp.amount, stats)}${wp.hits && wp.hits > 1 ? ` × ${wp.hits}` : ""}`,
    tag: r.type === "magical" ? (r.element ?? "magical") : (r.subtype ?? "physical"),
  };
}

// ─── Statuses ───
export function statusText(d: StatusT): string[] {
  const out: string[] = [];
  if (d.text) out.push(d.text);
  const mode = d.stacking === "refresh" ? "reapplying refreshes it" : d.stacking === "fizzle" ? "can't be reapplied while it lasts" : "stacks";
  const dur = d.duration ? `${d.duration} ticks` : "until the fight ends";
  out.push(`${d.label === "buff" ? "Buff" : "Debuff"}, ${dur}; ${mode}.`);
  for (const s of d.stats ?? []) {
    const flat = typeof s.flat === "number" ? s.flat : undefined;
    const pct = typeof s.pct === "number" ? s.pct : undefined;
    const isPts = c.stats.get(s.stat)?.kind === "points";
    out.push(`${statWord(s.stat)} ${flat !== undefined ? (isPts ? `${flat >= 0 ? "+" : ""}${flat}` : `${flat >= 0 ? "+" : ""}${disp(flat)}`) : ""}${pct !== undefined ? `${pct >= 0 ? "+" : ""}${pct}%` : ""}${d.stacking === "intensity" ? " per stack" : ""}`);
  }
  for (const b of d.boosts ?? []) out.push(`${b.tag} damage ${typeof b.pct === "number" ? `${b.pct >= 0 ? "+" : ""}${b.pct}%` : "scaled"}${d.stacking === "intensity" ? " per stack" : ""}`);
  for (const t of d.taken ?? []) out.push(`${t.tag ?? "all"} damage taken ${typeof t.pct === "number" ? `${t.pct >= 0 ? "+" : ""}${t.pct}%` : "changed"}`);
  if (d.absorb) out.push(`Soaks damage, one point per stack, before HP${typeof d.cap === "object" ? `; cap ${Math.round((d.cap.scale[0]?.ratio ?? 0) * 100)}% of max HP` : ""}.`);
  if (d.block) out.push(`Blocks the next damage above ${d.block.share}% of max HP, then ends.`);
  if (d.lockout) out.push(`Locks out ${d.lockout.covers === "all" ? "every action" : `${d.lockout.covers} actions`}${d.lockout.interrupt ? ", cancelling a wind-up" : ""}.`);
  if (d.pulse) {
    const doing = (d.pulse.do ?? []).map((e) => effectText(e, null, false)).join("; ");
    out.push(`Every ${d.pulse.every} ticks${doing ? `: ${doing}` : ""}${d.stacking === "intensity" ? " per stack" : ""}${d.drop ? `, then ${dropText(d.drop)}` : ""}.`);
  }
  if (d.trigger) out.push(`On ${d.trigger.on.event.replace(/_/g, " ")}: ${(d.trigger.do ?? []).map((e) => effectText(e, null, false)).join("; ") || "loses stacks"} per stack${d.drop ? `, then ${dropText(d.drop)}` : ""}.`);
  for (const r of d.reactions ?? []) out.push(`On ${r.on.event.replace(/_/g, " ")}${r.on.whose && r.on.whose !== "holder" ? ` (${r.on.whose})` : ""}: ${r.do.map((e) => effectText(e, null, false)).join("; ")}.`);
  if (d.seek) out.push(`${d.seek === "all" ? "Every action" : `${d.seek} actions`} ignore Taunt.`);
  if (d.strike) out.push("Basic attacks strike again.");
  if (d.unremovable) out.push("Can't be removed.");
  return out;
}
const dropText = (drop: NonNullable<StatusT["drop"]>) => (drop === "all" ? "ends" : "fraction" in drop ? `loses ${Math.round(drop.fraction * 100)}% of its stacks` : `loses ${drop.count} stack${drop.count === 1 ? "" : "s"}`);

export const enemyText = (id: string) => enemy(id).text;
