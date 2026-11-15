/**
 * The helpers every class's upgrades are written with, and the lists their files add to (index.ts gathers them). An
 * upgrade is a power step and two versions (A and B) of an ability or a passive, as five forms: the power step alone
 * (`p`), each version (`a`, `b`), and each version with the power step (`ap`, `bp`). Each form is built from the class's
 * own ability or passive in classes.ts, so a form keeps everything of the base it doesn't name. A file writes one
 * function, `form(v, k, plus)`, for all five: `k` is POWER on a form with the power step, so "two fifths more" is `× k`;
 * a step that isn't a multiplier (a cooldown word shorter, a rung cheaper) reads `plus`. A form's card is its version's
 * (or the base's) with the power step's line added, the upgrade's own `power` or the version's `plus` where it differs;
 * a power step marked `shown` adds nothing, since the ability's card shows its numbers.
 * The hooks are the engine's primitives (PRIMITIVES.md).
 */
import type { AbilityT, EffectT, GearT, NumT, StatusT, TargetRuleT, ToT, UpgradeT } from "../../../src/schema.js";
import { COOLDOWN, from, HIT, type HitWord, jitter } from "../scale.js";
import { abilities as baseAbilities, classes, passives } from "../classes.js";
import { serves as servesOf, type Build, type BuildTag, type Served } from "../pieces/kit.js";

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

export const apply = (status: string, extra: Partial<Extract<EffectT, { op: "apply" }>> = {}): EffectT => ({ op: "apply", status, ...extra }) as EffectT;
export const phys = (amount: NumT, extra: object = {}): EffectT => ({ op: "damage", type: "physical", amount, ...extra }) as EffectT;
export const removeMine = (status: string, label: "buff" | "debuff" | "marker" = "buff", to: ToT = "holder"): EffectT => ({ op: "remove", label, status, to }) as EffectT;
/** An ability's hit, by its word, times k. */
export const hitOf = (stat: string, word: HitWord, k = 1): NumT => from(stat, HIT[word] * k);
/** A cooldown word, moved by the base ability's id as classes.ts moves the base's, so a form keeps its ability's place in the spread. */
export const cd = (word: keyof typeof COOLDOWN, baseId: string) => jitter(COOLDOWN[word], baseId);
export const both = (pct: NumT) => [{ tag: "physical", pct }];
/** A status's stat read off its holder: `of: holder`, as a status must say. */
export const ofHolder = (ratio: number, stat: string): NumT => ({ scale: [{ ratio, stat, of: "holder" }] });
/** The phrase "the ally foes are most drawn to": a Taunting ally if there is one (the most Aggro among several), otherwise the most Aggro. */
export const DRAWN: TargetRuleT = { side: "allies", where: { has: "taunt" }, ifNone: "any", pick: "highest", by: { stat: "aggro" } };
/** The power step on the quick word, which has none below it: a quarter off. Whole sub-ticks. */
export const quarterOff = (t: number) => Math.round(t * 0.75 * 1000) / 1000;
export const r6 = (x: number) => Math.round(x * 1e6) / 1e6;

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
  /** Its Serves line, as the loot pass's catalog writes it (builds, rungs, worth, engines, threads). */
  serves?: string;
  /** A version the loot pass didn't tag: the builds it serves, in order: the first is worth 2 to it, the rest 1. */
  builds?: Build[];
  /** What the power step adds to this version's card, where it differs from the upgrade's own (or, with `shown`, where the numbers don't show it); "" adds nothing. */
  plus?: string;
};
type Up<B> = {
  id: string;
  cls: string;
  /** The power step's card. */
  power: string;
  /**
   * An ability's power step that only moves numbers its card already shows (MP, cooldown, wind-up, the size line): its card
   * stays on the training screen, and isn't added to the trained ability's card.
   */
  shown?: boolean;
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
/** Designer data, never in the pack: what each version form and mythic serves. */
export const served: Served = {};

const tags = (bs: Build[], rung: 2 | 3): BuildTag[] => bs.map((build, i) => ({ build, rung, worth: i === 0 ? 2 : 1 }));
function record(kind: "ability" | "passive", u: Up<unknown>) {
  upgrades.push(tidy({ id: u.id, class: u.cls, kind, power: u.power, a: { name: u.a.name, text: u.a.text }, b: { name: u.b.name, text: u.b.text }, ...(u.note ? { note: u.note } : {}) }));
  for (const [f, v] of [["a", "a"], ["b", "b"], ["ap", "a"], ["bp", "b"]] as const) {
    const ver = u[v];
    served[formId(u.id, f)] = ver.serves ? servesOf(ver.serves) : { builds: tags(ver.builds ?? [], f.length === 1 ? 2 : 3), engines: [], threads: [], other: [] };
  }
}
const formName = (baseName: string, u: Up<unknown>, v: V, plus: boolean) => `${v ? u[v].name : baseName}${plus ? "+" : ""}`;
function formText(baseText: string, u: Up<unknown>, v: V, plus: boolean): string {
  const text = v ? u[v].text : baseText;
  if (!plus) return text;
  const more = v && u[v].plus !== undefined ? u[v].plus : u.shown ? "" : u.power;
  return more ? `${text} ${more}` : text;
}

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
