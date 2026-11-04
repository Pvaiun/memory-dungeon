/**
 * The helpers the other eight classes' upgrades are written with (Hexer, Monk, Assassin, Vampire, Pyromancer, Frostweaver,
 * Stormcaller, Geomancer), and the lists their files add to. Each form is built from the class's own ability or passive in
 * classes.ts, so a form keeps everything of the base it doesn't name. The power step is the training rule's "two fifths
 * more" of the amount the card names, or a cooldown a word shorter (by the base's own id, so its jitter stays), or a rung
 * cheaper. The hooks are the engine's primitives (PRIMITIVES.md).
 */
import type { AbilityT, EffectT, GearT, NumT, StatusT, ToT, UpgradeT } from "../../../src/schema.js";
import { COOLDOWN, from, HIT, type HitWord, jitter } from "../scale.js";
import { abilities as baseAbilities, classes, passives } from "../classes.js";
import type { Build, Builds, BuildTag } from "../pieces/kit.js";

// ─── Words and helpers ───────────────────────────────────────────────────────

/** The power step's "more": two fifths more. */
export const POWER = 1.4;
/** Cold hex's own multiplier on the few word (classes.ts): enough Chill for a Hexer to reach a shatter alone. */
export const COLD_HEX = 1.3;
/** Burning fist's Burn, three fifths of the few word (classes.ts). */
export const FIST_BURN = 0.6;
/** Frost lance's and Blizzard's own multipliers (classes.ts). */
export const LANCE_CHILL = 0.6;
export const BLIZZARD_CHILL = 0.45;
export const STILLNESS_CHILL = 0.5;

type Form = "p" | "a" | "b" | "ap" | "bp";
type V = "" | "a" | "b";
const FORMS: [Form, V, boolean][] = [["p", "", true], ["a", "a", false], ["b", "b", false], ["ap", "a", true], ["bp", "b", true]];
const formId = (id: string, f: Form) => `${id}__${f}`;

export const apply = (status: string, extra: { stacks?: NumT; to?: ToT } = {}): EffectT => ({ op: "apply", status, ...extra }) as EffectT;
export const phys = (amount: NumT, extra: object = {}): EffectT => ({ op: "damage", type: "physical", amount, ...extra }) as EffectT;
export const magic = (amount: NumT, extra: object = {}): EffectT => ({ op: "damage", type: "magical", amount, ...extra }) as EffectT;
export const removeMine = (status: string, label: "buff" | "debuff" | "marker" = "buff", to: ToT = "holder"): EffectT => ({ op: "remove", label, status, to }) as EffectT;
/** An ability's hit, by its word, times k. */
export const hitOf = (stat: string, word: HitWord, k = 1): NumT => from(stat, HIT[word] * k);
/** A cooldown word, moved by the base ability's id as classes.ts moves the base's, so a form keeps its ability's place in the spread. */
export const cd = (word: keyof typeof COOLDOWN, baseId: string) => jitter(COOLDOWN[word], baseId);
export const both = (pct: number) => [{ tag: "physical", pct }, { tag: "magical", pct }];

/** Rounds away float noise (0.40599999 → 0.406), so the pack reads cleanly. */
export function tidy<T>(x: T): T {
  if (typeof x === "number") return (Number.isInteger(x) ? x : Math.round(x * 1e9) / 1e9) as T;
  if (Array.isArray(x)) return x.map(tidy) as T;
  if (x && typeof x === "object") return Object.fromEntries(Object.entries(x).filter(([, v]) => v !== undefined).map(([k, v]) => [k, tidy(v)])) as T;
  return x;
}

export const baseAbility = (id: string) => {
  const a = baseAbilities.find((x) => x.id === id);
  if (!a) throw new Error(`no ability '${id}' in classes.ts`);
  return a;
};
const basePassive = (id: string) => {
  const s = passives.find((x) => x.id === id);
  if (!s) throw new Error(`no passive status '${id}' in classes.ts`);
  return s;
};
const passiveCard = (cls: string) => classes.find((c) => c.id === cls)!.passive!.text;

type Ver = {
  name: string;
  /** Its card. */
  text: string;
  /** The builds it serves, in order: the first is worth 2 to it, the rest 1. */
  builds: Build[];
  /** What the power step adds to this version's card, where it differs from the upgrade's own power card. */
  plus?: string;
};
type Up<B> = {
  id: string;
  cls: string;
  /** The power step's card. */
  power: string;
  a: Ver;
  b: Ver;
  /** A form's body: what differs from the base, for a version (or none) with or without the power step (k is 1 or POWER). */
  form: (v: V, k: number, plus: boolean) => Partial<B>;
  note?: string;
};

export const upgrades: UpgradeT[] = [];
export const abilities: AbilityT[] = [];
export const statuses: StatusT[] = [];
export const mythics: GearT[] = [];
export const builds: Builds = {};

const tags = (bs: Build[], rung: 2 | 3): BuildTag[] => bs.map((build, i) => ({ build, rung, worth: i === 0 ? 2 : 1 }));
function record(kind: "ability" | "passive", u: Up<unknown>) {
  upgrades.push(tidy({ id: u.id, class: u.cls, kind, power: u.power, a: { name: u.a.name, text: u.a.text }, b: { name: u.b.name, text: u.b.text }, ...(u.note ? { note: u.note } : {}) }));
  for (const [f, v] of [["a", "a"], ["b", "b"], ["ap", "a"], ["bp", "b"]] as const) builds[formId(u.id, f)] = tags(u[v].builds, f.length === 1 ? 2 : 3);
}
const formName = (baseName: string, u: Up<unknown>, v: V, plus: boolean) => `${v ? u[v].name : baseName}${plus ? "+" : ""}`;
const formText = (baseText: string, u: Up<unknown>, v: V, plus: boolean) => (v ? u[v].text : baseText) + (plus ? ` ${(v && u[v].plus) || u.power}` : "");

/** An ability's upgrade: five abilities of its class, each the base with the form's changes. */
export function abilityUp(u: Up<AbilityT>) {
  const base = baseAbility(u.id);
  if (base.class !== u.cls) throw new Error(`'${u.id}' is the ${base.class}'s, not the ${u.cls}'s`);
  record("ability", u);
  for (const [f, v, plus] of FORMS) {
    const body = u.form(v, plus ? POWER : 1, plus);
    abilities.push(tidy({ ...JSON.parse(JSON.stringify(base)), ...body, id: formId(u.id, f), class: u.cls, name: formName(base.name, u, v, plus), text: formText(base.text, u, v, plus) }) as AbilityT);
  }
}
/** A passive's upgrade: five statuses, each taking the passive status's place, the base with the form's changes. */
export function passiveUp(u: Up<StatusT>) {
  const base = basePassive(u.id);
  record("passive", u);
  for (const [f, v, plus] of FORMS) {
    const body = u.form(v, plus ? POWER : 1, plus);
    statuses.push(tidy({ ...JSON.parse(JSON.stringify(base)), ...body, id: formId(u.id, f), name: formName(base.name, u, v, plus), text: formText(passiveCard(u.cls), u, v, plus) }) as StatusT);
  }
}

/** A kit state: a status a kit keeps on a unit, shown on its icon, never a new word for the player (it takes its version's name). */
export const kit = (id: string, name: string, text: string, body: Partial<StatusT>): StatusT => ({ id, name, text, label: "buff", show: "icon", stacking: "refresh", ...body }) as StatusT;
/** Bookkeeping: neither buff nor debuff, lifted only by name. */
export const marker = (id: string, name: string, text: string, body: Partial<StatusT>): StatusT => ({ id, name, text, label: "marker", show: "sheet", stacking: "refresh", ...body }) as StatusT;
export const helper = (s: StatusT) => statuses.push(tidy(s));
