/**
 * Unit sheets, terse: stats as pips or codes, abilities as a name, a cost and
 * a line of text. Designer view adds the worked-out numbers from describe.ts.
 */
import type { AbilityT, EnemyT, WeaponT } from "../../src/schema.js";
import { combat, type Member } from "../../src/engine/combat/rules.js";
import { weaponOf } from "../../src/engine/combat/fight.js";
import { c, cls, disp, kindOf, SHEET_STATS, SPECIAL_STATS, showStat, statCode, status, statusCode, elementName } from "./content.js";
import { abilityInfo, castWord, statusText, weaponInfo, type Stats } from "./describe.js";
import { h, type Child } from "./dom.js";
import { party, setup, soloParty } from "./state.js";

/** The class's unit with its gear, formation slot and passive applied: what it brings to a fight. */
export function memberFor(id: string): Member {
  const inParty = setup.party.includes(id);
  const p = inParty ? party() : soloParty(id);
  const members = combat.party(c, { dungeon: c.pack.progression.dungeonOrder[0], party: p, seed: 1 }) as Member[];
  return members.find((m) => m.ref === id)!;
}

export function pips(n: number, max = 5): HTMLElement {
  const full = Math.max(0, Math.min(max, Math.round(n)));
  return h("span", { class: "pips" }, ...Array.from({ length: max }, (_, i) => h("i", { class: i < full ? "on" : "" })), n > max ? ` +${Math.round(n - max)}` : "");
}

/** The first sentence of a class or enemy text, as its role word. */
export const role = (text: string) => text.split(".")[0];

/** The stat grid: codes with pips of the class's base, or numbers (designer view, or no base to pip). */
export function statGrid(stats: Stats, base: Stats | null, designer: boolean): HTMLElement {
  const cells: Child[] = [];
  for (const key of SHEET_STATS) {
    const v = stats[key] ?? 0;
    const b = base?.[key];
    const value = b !== undefined && !designer ? pips(key === "crit_chance" ? b / 5 : b / 1000) : showStat(key, v);
    cells.push(h("div", null, h("span", null, statCode(key)), h("span", null, value)));
  }
  if (designer || !base) {
    for (const key of SPECIAL_STATS) {
      const v = stats[key] ?? 0;
      if (v === (c.stats.get(key)?.default ?? 0)) continue;
      cells.push(h("div", null, h("span", { class: "dim" }, statCode(key)), h("span", null, showStat(key, v))));
    }
    for (const [k, v] of Object.entries(stats)) {
      if (!k.startsWith("resist:") || !v) continue;
      cells.push(h("div", null, h("span", { class: "dim" }, statCode(k)), h("span", null, `${v > 0 ? "+" : ""}${v}%`)));
    }
    if (stats.resist) cells.push(h("div", null, h("span", { class: "dim" }, "RES ALL"), h("span", null, `${stats.resist}%`)));
  }
  return h("div", { class: "kv" }, ...cells);
}

const cdWord = (t: number) => `CD${t}`;

/** An ability: name with its cost, its text, and in designer view the timing, target and effects. */
export function abilityLines(a: AbilityT, stats: Stats | null, designer: boolean): Child[] {
  const i = abilityInfo(a, stats);
  const out: Child[] = [
    h("div", { class: "line" }, h("span", { class: "grow trunc" }, i.name), h("span", { class: "dim" }, `${cdWord(i.cooldown)}${i.mp ? ` MP${disp(i.mp)}` : ""}`)),
    h("div", { class: "text dim" }, i.text),
  ];
  if (designer) {
    out.push(h("div", { class: "text dim" }, `Wind-up ${i.cast}t (${castWord(i.cast)}), recovery ${i.recovery}t${i.seek ? ", Seek" : ""}. Target: ${i.target}${i.waits ? `; ${i.waits}` : ""}.`));
    for (const e of i.effects) out.push(h("div", { class: "text dim" }, `→ ${e}`));
  }
  return out;
}

/** The basic attack a weapon gives, worked out for a unit's stats. */
export function basicLine(wp: WeaponT, stats: Stats, designer: boolean): Child {
  const w = weaponInfo(wp, stats);
  return h("div", { class: "line" }, h("span", { class: "grow trunc" }, "ATTACK"), h("span", { class: "dim trunc" }, `${(w.type === "magical" ? elementName(w.element ?? "") : w.subtype ?? "").toUpperCase()} /${w.cooldown}T${designer ? ` ${w.hit.replace("≈ ", "~")}` : ""}`));
}

/** Everything about a class, with its current build. */
export function classSheet(id: string, designer: boolean, member: Member = memberFor(id)): Child[] {
  const k = cls(id);
  const out: Child[] = [
    h("div", { class: "text dim" }, k.text),
    statGrid(member.stats, k.stats, designer),
    h("div", { class: "line" }, h("span", { class: "dim" }, "WPN"), h("span", { class: "grow trunc" }, k.weapons.map((w) => kindOf(w).name).join(" "))),
    h("div", { class: "line" }, h("span", { class: "dim" }, "ARM"), h("span", { class: "grow trunc" }, k.armor)),
  ];
  if (k.passive) {
    out.push(h("div", { class: "line" }, h("span", { class: "grow trunc" }, k.passive.name), h("span", { class: "dim" }, "PASSIVE")), h("div", { class: "text dim" }, k.passive.text));
    const st = k.passive.statuses?.[0];
    if (designer && st) out.push(h("div", { class: "text dim" }, statusText(status(st)).slice(1).join(" ")));
  }
  out.push(basicLine(weaponOf(c, member.weapon), member.stats, designer));
  for (const a of k.abilities) out.push(...abilityLines(c.abilities.get(a)!, member.stats, designer));
  return out;
}

/** Everything about an enemy, for the bestiary and the inspect box. */
export function enemySheet(e: EnemyT, designer: boolean): Child[] {
  const stats = { ...Object.fromEntries(c.pack.stats.map((s) => [s.id, s.default])), ...e.stats };
  const out: Child[] = [h("div", { class: "text dim" }, e.text)];
  for (const s of e.statuses ?? []) {
    const d = status(s);
    out.push(h("div", { class: "line" }, h("span", { class: "grow trunc" }, d.name), h("span", { class: "dim" }, statusCode(s))), h("div", { class: "text dim" }, designer ? statusText(d).join(" ") : d.text ?? ""));
  }
  for (const a of e.abilities ?? []) out.push(...abilityLines(c.abilities.get(a)!, stats, designer));
  if (designer) {
    out.push(h("div", { class: "section" }, "HIDDEN STATS"), statGrid(stats, null, true));
    out.push(basicLine(e.weapon ?? c.pack.ruleset.unarmed, stats, true));
  }
  return out;
}
