/**
 * The helpers the first eight classes' upgrades are written with (Knight, Cleric, Ranger, Bramble knight, Hoplite, Paladin,
 * Valkyrie, Bard), and the lists their files add to. Every form is built from its class's ability or passive as classes.ts
 * has it: a form changes only what its line changes. The power step is two fifths more of an amount or stacks, one
 * cooldown word shorter, or one rung down the MP ladder. The hooks are the engine's primitives (PRIMITIVES.md).
 */
import { COOLDOWN, jitter } from "../scale.js";
import { type AbilityT, type EffectT, formId, type NumT, type StatusT, type TargetRuleT, type ToT, type UpgradeFormT, type UpgradeT } from "../../../src/schema.js";
import { abilities as classAbilities, passives as classPassives } from "../classes.js";
import type { Build, Builds } from "../pieces/kit.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

type CD = keyof typeof COOLDOWN;
/** A cooldown word, moved by the base ability's id as classes.ts moves it, so every form of an ability keeps its offset. */
export const cd = (word: CD, id: string) => jitter(COOLDOWN[word], id);
/** The power step on the quick word, which has none below it: a quarter off. Whole sub-ticks. */
export const quarterOff = (t: number) => Math.round(t * 0.75 * 1000) / 1000;
export const r6 = (x: number) => Math.round(x * 1e6) / 1e6;
export const MORE = 1.4;

export const apply = (status: string, extra: Partial<Extract<EffectT, { op: "apply" }>> = {}): EffectT => ({ op: "apply", status, ...extra }) as EffectT;
export const phys = (amount: NumT, extra: object = {}): EffectT => ({ op: "damage", type: "physical", amount, ...extra }) as EffectT;
export const magic = (amount: NumT, extra: object = {}): EffectT => ({ op: "damage", type: "magical", amount, ...extra }) as EffectT;
export const removeBuff = (status: string, to: ToT = "holder"): EffectT => ({ op: "remove", label: "buff", status, to }) as EffectT;
export const removeMarker = (status: string, to: ToT = "holder"): EffectT => ({ op: "remove", label: "marker", status, to }) as EffectT;
export const both = (pct: NumT) => [{ tag: "physical", pct }, { tag: "magical", pct }];
/** A status's stat read off its holder: `of: holder`, as a status must say. */
export const ofHolder = (ratio: number, stat: string): NumT => ({ scale: [{ ratio, stat, of: "holder" }] });

/** The phrase "the ally foes are most drawn to": a Taunting ally if there is one (the most Aggro among several), otherwise the most Aggro. */
export const DRAWN: TargetRuleT = { side: "allies", where: { has: "taunt" }, ifNone: "any", pick: "highest", by: { stat: "aggro" } };

const baseAbility = (id: string): AbilityT => {
  const a = classAbilities.find((x) => x.id === id);
  if (!a) throw new Error(`no class ability '${id}'`);
  return a as AbilityT;
};
const basePassive = (id: string): StatusT => {
  const s = classPassives.find((x) => x.id === id);
  if (!s) throw new Error(`no class passive '${id}'`);
  return s;
};
/** Drops keys set to undefined, so a form can take away a field its base had (a condition, Seek). */
const clean = <O extends object>(o: O): O => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as O;

type Version = { name: string; text: string };
export type Changes = Partial<Omit<AbilityT, "id" | "class" | "name">> & { text?: string };
/**
 * One ability's upgrade: its card lines, and each form as the changes from the base ability. `ap` and `bp` are written in full
 * (a version with the power step), so every number in a form is visible where it's set.
 */
export function abilityUpgrade(cls: string, id: string, u: { power: string; a: Version; b: Version; p: Changes; va: Changes; vb: Changes; ap: Changes; bp: Changes }) {
  const base = baseAbility(id);
  const form = (f: UpgradeFormT, name: string, text: string, ch: Changes): AbilityT =>
    clean({ ...base, ...ch, id: formId(id, f), class: cls, name, text: ch.text ?? text });
  const forms = [
    form("p", `${base.name}+`, base.text, u.p),
    form("a", u.a.name, u.a.text, u.va),
    form("b", u.b.name, u.b.text, u.vb),
    form("ap", `${u.a.name}+`, u.a.text, u.ap),
    form("bp", `${u.b.name}+`, u.b.text, u.bp),
  ];
  const up: UpgradeT = { id, class: cls, kind: "ability", power: u.power, a: u.a, b: u.b };
  return { up, forms };
}

type PassiveChanges = Partial<Omit<StatusT, "id" | "name">> & { text: string };
/** One passive's upgrade: each form a status that takes the passive status's place, as the base is (a buff on the sheet, unremovable). */
export function passiveUpgrade(cls: string, id: string, u: { power: string; a: Version; b: Version; p: PassiveChanges; va: PassiveChanges; vb: PassiveChanges; ap: PassiveChanges; bp: PassiveChanges }) {
  const base = basePassive(id);
  const form = (f: UpgradeFormT, name: string, ch: PassiveChanges): StatusT =>
    clean({ label: base.label, show: base.show, stacking: base.stacking, unremovable: base.unremovable, ...ch, id: formId(id, f), name }) as StatusT;
  const forms = [form("p", `${base.name}+`, u.p), form("a", u.a.name, u.va), form("b", u.b.name, u.vb), form("ap", `${u.a.name}+`, u.ap), form("bp", `${u.b.name}+`, u.bp)];
  const up: UpgradeT = { id, class: cls, kind: "passive", power: u.power, a: u.a, b: u.b };
  return { up, forms };
}

/** A helper status a version brings or applies: a buff with an icon unless it says otherwise. */
export const helper = (id: string, name: string, text: string, body: Partial<StatusT>): StatusT => ({ id, name, text, label: "buff", show: "icon", stacking: "refresh", ...body }) as StatusT;
/** Bookkeeping, a marker: neither buff nor debuff, lifted only by a remove that names it. */
export const marker = (id: string, name: string, text: string, body: Partial<StatusT>): StatusT => ({ id, name, text, label: "marker", show: "sheet", stacking: "refresh", ...body }) as StatusT;

export const ups: ReturnType<typeof abilityUpgrade | typeof passiveUpgrade>[] = [];
export const helpers: StatusT[] = [];
export const buildTags: Builds = {};
/** Designer data: version A's and B's builds, on their forms with and without the power step (worth ●● each). */
export function tag(id: string, a: Build[], b: Build[]) {
  for (const [f, list] of [["a", a], ["ap", a], ["b", b], ["bp", b]] as const) buildTags[formId(id, f)] = list.map((build) => ({ build, worth: 2 }));
}
