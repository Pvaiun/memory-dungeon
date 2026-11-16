/**
 * An ability's or a passive's upgrades as cards: its power step (+) and its two versions (A, B), each with its name, its own
 * text and, for a unit's stats, what it changes from the base. The rogue mode's training screen decorates them with its
 * buttons; a class's sheet shows them all, to read.
 */
import { formId, type AbilityT } from "../../src/schema.js";
import { passiveOf, upgradeOf } from "../../src/rogue.js";
import { c, disp } from "./content.js";
import { abilityInfo, asRead, heldParts, sizeParts, sizeText, type Ally, type Stats } from "./describe.js";
import { h, type Child } from "./dom.js";
import { classPassive, section, sizeEl, tk } from "./sheet.js";

export type UpgradeChip = "+" | "A" | "B";
/** How one card is drawn: its right end (a button, a price, TAKEN), dimmed, its name lit, its chip on, its text hidden. */
export type CardLook = { right?: Child; dimmed?: boolean; hi?: boolean; on?: boolean; bodyless?: boolean };

/**
 * The power step and the two versions of `id` (an ability or a passive), each card the upgrade alone on the base. With
 * `stats`, an ability's card shows what it changes in those numbers, a passive's the stacks it lays.
 */
export function upgradeCards(id: string, stats: Stats | null, look: (chip: UpgradeChip) => CardLook = () => ({}), held: readonly string[] = [], allies: readonly Ally[] = []): HTMLElement[] {
  const u = upgradeOf(c, id);
  if (!u) return [];
  const ability = u.kind === "ability";
  const nameOf = (form: string) => (ability ? c.abilities.get(form)?.name : c.statuses.get(form)?.name) ?? form;
  const cards: { chip: UpgradeChip; text: string; form: string }[] = [
    { chip: "+", text: u.power, form: formId(id, "p") },
    { chip: "A", text: u.a.text, form: formId(id, "a") },
    { chip: "B", text: u.b.text, form: formId(id, "b") },
  ];
  return cards.map(({ chip, text, form }) => {
    const o = look(chip);
    // `held` and `allies`: the unit's statuses and its side, so a form reads the stat its abilities read (Even-keel plate, Borrowed hand).
    const was = stats && ability ? asRead(c.abilities.get(id)!, stats, held, allies) : null, now = stats && ability ? asRead(c.abilities.get(form)!, stats, held, allies) : null;
    const nums = !stats ? [] : was && now ? changeLines(was.a, now.a, { ...was.stats, ...now.stats }) : [passiveSize(form, stats)];
    return h("div", { class: `ab${o.dimmed ? " dimmed" : ""}` },
      h("div", { class: "head" }, h("span", { class: `chip${o.on ? " on" : ""}` }, chip), h("span", { class: `grow trunc${o.hi ? " hi" : ""}` }, nameOf(form).toUpperCase()), o.right ?? null),
      o.bodyless ? null : h("div", { class: "body" }, text), ...(o.bodyless ? [] : nums));
  });
}

/**
 * Everything a class can be trained on, to read: each of its abilities in order, then its passive, under its name, with
 * its power step and versions as cards in `stats`' numbers.
 */
export function classUpgrades(cls: string, stats: Stats): Child[] {
  const k = c.classes.get(cls)!;
  const out: Child[] = [];
  for (const a of k.abilities) {
    if (!upgradeOf(c, a)) continue;
    out.push(section(c.abilities.get(a)!.name.toUpperCase(), "UPGRADES"), ...upgradeCards(a, stats));
  }
  const pid = passiveOf(c, cls);
  if (pid) out.push(section((k.passive?.name ?? c.statuses.get(pid)?.name ?? "").toUpperCase(), "PASSIVE · UPGRADES"), ...classPassive(cls, undefined, stats), ...upgradeCards(pid, stats));
  return out;
}

/** A passive form's stacks for these stats, as "→ 5 CHILL (ATK)". */
function passiveSize(form: string, stats: Stats): HTMLElement | null {
  const el = sizeEl(heldParts([form], stats));
  el?.prepend(h("span", { class: "dim" }, "→ "));
  return el;
}
/** What an ability's form changes in these stats: MP, cooldown and wind-up as "CD 28→21" (green better), then its new size. */
function changeLines(was: AbilityT, now: AbilityT, stats: Stats): Child[] {
  const a = abilityInfo(was, stats), b = abilityInfo(now, stats);
  const cmp = (label: string, x: number, y: number, show: (n: number) => string) =>
    show(x) !== show(y) ? h("span", { class: `nowrap ${y < x ? "good" : "bad"}` }, `${label} ${show(x)}→${show(y)}`) : null;
  const cost = [cmp("MP", a.mp ?? 0, b.mp ?? 0, (n) => String(disp(n))), cmp("CD", a.cooldown, b.cooldown, tk), cmp("CAST", a.cast, b.cast, tk)].filter(Boolean);
  const out: Child[] = cost.length ? [h("div", { class: "size changes" }, ...cost)] : [];
  const sizeWas = sizeText(sizeParts(was, stats)), sizeNow = sizeText(sizeParts(now, stats));
  if (sizeNow && sizeNow !== sizeWas) {
    const el = sizeEl(sizeParts(now, stats));
    el?.prepend(h("span", { class: "dim" }, "→ "));
    out.push(el);
  }
  return out;
}
