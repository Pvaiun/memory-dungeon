/** Learning abilities and training: a power step or a version (A or B) of an ability or a passive. */
import type { Content } from "../engine/run.js";
import { formId, type UpgradeFormT, type UpgradeT } from "../schema.js";
import { member, type Member, note, type RogueRun, type Version } from "./state.js";
import { freshCooldown } from "./acts.js";

// ─── Abilities: learning and training ──────────────────────────────────────

/**
 * A training. Learning an ability; or, on a known ability or the class's passive, its power step or one of its two
 * versions (from the pack's upgrades). The power step and a version are two trainings, taken in either order; each once.
 */
export type Training = { verb: "learn" | "power" | "version"; cls: string; id: string; version?: Version };
/** A training as an option's id: `learn:<cls>:<ability>`, `power:<cls>:<id>`, `version:<cls>:<id>:a` (or `:b`). */
export const trainingId = (t: Training) => `${t.verb}:${t.cls}:${t.id}${t.version ? `:${t.version}` : ""}`;
/** An option's id as a training, or null when it isn't one. */
export function parseTraining(s: string): Training | null {
  const [verb, cls, id, v] = s.split(":");
  if (!cls || !id || !(verb === "learn" || verb === "power" || verb === "version")) return null;
  if (verb === "version") return v === "a" || v === "b" ? { verb, cls, id, version: v } : null;
  return { verb, cls, id };
}
const UPGRADES = new WeakMap<Content, Map<string, UpgradeT>>();
/** The upgrade of an ability or a passive status, by its id (the pack's `upgrades`). */
export function upgradeOf(c: Content, id: string): UpgradeT | undefined {
  let m = UPGRADES.get(c);
  if (!m) UPGRADES.set(c, (m = new Map((c.pack.upgrades ?? []).map((u) => [u.id, u]))));
  return m.get(id);
}
/** The status id of a class's passive that can be trained (its upgrade's id), if it has one. */
export const passiveOf = (c: Content, cls: string): string | undefined => (c.pack.upgrades ?? []).find((u) => u.class === cls && u.kind === "passive")?.id;
/** The form an ability or the passive plays as for this member: its own id untrained, else `<id>__p`, `__a`, `__b`, `__ap` or `__bp`. */
export function formOf(m: Member, id: string): string {
  const t = m.trained?.[id];
  if (!t?.power && !t?.version) return id;
  return formId(id, (t.version ? (t.power ? `${t.version}p` : t.version) : "p") as UpgradeFormT);
}
/** Abilities a member hasn't learned, in its class's order. */
export const unlearned = (c: Content, m: Member) => c.classes.get(m.cls)!.abilities.filter((a) => !m.known.includes(a));
/** What a member can be trained on beyond learning: its known abilities with an upgrade, in its class's order, and its passive. */
export function trainable(c: Content, m: Member): string[] {
  const pid = passiveOf(c, m.cls);
  return [...c.classes.get(m.cls)!.abilities.filter((a) => m.known.includes(a) && upgradeOf(c, a)?.class === m.cls), ...(pid ? [pid] : [])];
}
/** Every training a member can take now: learning first, then each ability's and the passive's power step and versions not yet taken. */
export function trainingsFor(c: Content, run: RogueRun, cls: string): Training[] {
  const m = member(run, cls);
  if (!m) return [];
  const out: Training[] = unlearned(c, m).map((id) => ({ verb: "learn" as const, cls, id }));
  for (const id of trainable(c, m)) {
    const t = m.trained?.[id] ?? {};
    if (!t.power) out.push({ verb: "power", cls, id });
    if (!t.version) out.push({ verb: "version", cls, id, version: "a" }, { verb: "version", cls, id, version: "b" });
  }
  return out;
}
/** A training's card: what it's on (an ability's or the passive's name) and what it does, in the content's words. */
export function trainingText(c: Content, t: Training): { name: string; what: string; text: string } {
  const u = upgradeOf(c, t.id);
  const name = c.abilities.get(t.id)?.name ?? (u?.kind === "passive" ? c.classes.get(t.cls)?.passive?.name : undefined) ?? c.statuses.get(t.id)?.name ?? t.id;
  if (t.verb === "learn") return { name, what: "learn", text: c.abilities.get(t.id)?.text ?? "" };
  if (t.verb === "power") return { name, what: "power step", text: u?.power ?? "" };
  const v = u?.[t.version!];
  return { name, what: v?.name ?? `version ${t.version!.toUpperCase()}`, text: v?.text ?? "" };
}

export function learn(c: Content, run: RogueRun, cls: string, ability: string): boolean {
  const m = run.roster.find((x) => x.cls === cls);
  if (!m || !unlearned(c, m).includes(ability)) return false;
  m.known.push(ability);
  m.order.push(ability);
  // An ability just learned starts half charged.
  m.cooldowns = { ...(m.cooldowns ?? {}), [ability]: freshCooldown(c, ability) };
  note(run, `${c.classes.get(cls)!.name} learns ${c.abilities.get(ability)!.name}.`);
  return true;
}
/**
 * Takes a training (a training or its id). Learning as `learn`; a power step or a version on a known ability with an
 * upgrade, or on the passive, each once. The member keeps base ids: the fight gets the form (`formOf`), and a carried cooldown,
 * kept by base id, follows its ability to the form. False when it can't be taken.
 */
export function train(c: Content, run: RogueRun, t: Training | string): boolean {
  const x = typeof t === "string" ? parseTraining(t) : t;
  if (!x) return false;
  if (x.verb === "learn") return learn(c, run, x.cls, x.id);
  const m = run.roster.find((y) => y.cls === x.cls);
  if (!m || !trainable(c, m).includes(x.id)) return false;
  const was = m.trained?.[x.id] ?? {};
  if (x.verb === "power" ? was.power : was.version) return false;
  m.trained = { ...(m.trained ?? {}), [x.id]: x.verb === "power" ? { ...was, power: true } : { ...was, version: x.version } };
  const w = trainingText(c, x);
  note(run, `${c.classes.get(x.cls)!.name}'s ${w.name}: ${w.what}.`);
  return true;
}
