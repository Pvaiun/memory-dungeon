/**
 * Unit sheets: what a class or an enemy is and does, in one place. Stats as
 * numbers with the build's change beside them, the passive, the gear with its
 * icons, each ability with its icon, cost and the documents' sentence.
 * Designer view adds the worked-out numbers from describe.ts.
 */
import type { AbilityT, EnemyT, GearT, WeaponT } from "../../src/schema.js";
import { combat, type Member } from "../../src/engine/combat/rules.js";
import { weaponOf } from "../../src/engine/combat/fight.js";
import { c, cls, disp, kindOf, SHEET_STATS, SPECIAL_STATS, showStat, statCode, status, elementName } from "./content.js";
import { abilityInfo, abilityTag, castWord, statusText, weaponInfo, type Stats } from "./describe.js";
import { gearIcon, kindIcon, SLOT_ICON, TAG_ICON } from "./art.js";
import { h, type Child } from "./dom.js";
import { glyphEl, iconEl } from "./pixel.js";
import { gearFor, party, setup, soloParty } from "./state.js";

/** The class's unit with its gear, formation slot and passive applied: what it brings to a fight. */
export function memberFor(id: string): Member {
  const inParty = setup.party.includes(id);
  const p = inParty ? party() : soloParty(id);
  const members = combat.party(c, { dungeon: c.pack.progression.dungeonOrder[0], party: p, seed: 1 }) as Member[];
  return members.find((m) => m.ref === id)!;
}

/** The first sentence of a class or enemy text, as its role word. */
export const role = (text: string) => text.split(".")[0];

const cd = (t: number) => `CD${t}`;

/** The stat grid: codes with the unit's numbers; a coloured delta when gear or the formation moved a stat off the class's base. */
export function statGrid(stats: Stats, base: Stats | null, designer: boolean): HTMLElement {
  const cells: Child[] = [];
  for (const key of SHEET_STATS) {
    const v = stats[key] ?? 0;
    const b = base?.[key];
    const delta = b !== undefined ? v - b : 0;
    const dtext = !delta ? null : key === "crit_chance" ? `${delta > 0 ? "+" : ""}${Math.round(delta)}%` : `${delta > 0 ? "+" : ""}${disp(delta)}`;
    cells.push(h("div", null, h("span", { class: "dim" }, statCode(key)), h("span", null, showStat(key, v), dtext ? h("span", { class: delta > 0 ? "good" : "bad" }, ` ${dtext}`) : null)));
  }
  if (designer || !base) {
    for (const key of SPECIAL_STATS) {
      const v = stats[key] ?? 0;
      if (v === (c.stats.get(key)?.default ?? 0)) continue;
      cells.push(h("div", null, h("span", { class: "dim" }, statCode(key)), h("span", null, showStat(key, v))));
    }
  }
  for (const [k, v] of Object.entries(stats)) {
    if (!k.startsWith("resist:") || !v) continue;
    cells.push(h("div", null, h("span", { class: `dim ${k.slice(7)}` }, statCode(k)), h("span", { class: v > 0 ? "good" : "bad" }, `${v > 0 ? "+" : ""}${v}%`)));
  }
  if (stats.resist) cells.push(h("div", null, h("span", { class: "dim" }, "RES ALL"), h("span", null, `${stats.resist}%`)));
  return h("div", { class: "kv" }, ...cells);
}
/** The special stats a unit has above default, as "EVA 35%" lines. */
export function specialLines(stats: Stats): Child[] {
  const out: Child[] = [];
  for (const key of SPECIAL_STATS) {
    const v = stats[key] ?? 0;
    if (v === (c.stats.get(key)?.default ?? 0)) continue;
    out.push(h("span", null, h("span", { class: "dim" }, `${statCode(key)} `), showStat(key, v)));
  }
  return out;
}

/** Stat changes as coloured codes: "ARM+1 HP+2", green up, red down. */
export function codeSpans(stats: { stat: string; flat?: number; pct?: number }[] | undefined): Child[] {
  if (!stats?.length) return [];
  return stats.flatMap((s, i) => {
    const def = c.stats.get(s.stat);
    const v = s.flat ?? 0;
    const sign = v >= 0 ? "+" : "";
    const shown = s.stat === "crit_chance" || def?.kind === "points" || s.stat.startsWith("resist") ? `${sign}${v}%` : `${sign}${Math.round((v / 1000) * 10) / 10}`;
    const pct = s.pct ? `${s.pct > 0 ? "+" : ""}${s.pct}%` : "";
    const el = s.stat.startsWith("resist:") ? s.stat.slice(7) : "";
    return [i ? " " : null, h("span", { class: `${v < 0 || (s.pct ?? 0) < 0 ? "bad" : "good"}${el ? ` ${el}` : ""}` }, `${statCode(s.stat)}${shown}${pct}`)];
  });
}
/** A weapon's kind and speed: "SLASH/10". */
export function weaponCode(g: GearT): string {
  if (!g.weapon?.kind) return "";
  const k = kindOf(g.weapon.kind);
  return `${(k.type === "magical" ? elementName(k.element ?? "") : k.subtype ?? "").toUpperCase()}/${k.cooldown}`;
}
/** A piece of gear in one row: icon, name (★ powerful), its codes; `stats` works out the weapon's hit. */
export function gearRow(g: GearT | null, slot: string, stats: Stats | null, onClick?: () => void, arrow = true): HTMLElement {
  if (!g) return h("div", { class: "gear-row", onClick }, iconEl(SLOT_ICON[slot] ?? TAG_ICON.physical), h("span", { class: "dim w8" }, slot.toUpperCase()), h("span", { class: "dim grow" }, "— NOTHING —"), onClick && arrow ? h("span", { class: "dim" }, "▶") : null);
  const hit = g.weapon && stats ? ` ≈${weaponInfo(g.weapon, stats).hit.replace(/^≈ /, "").split(",")[0]}` : "";
  return h("div", { class: "gear-row", onClick },
    iconEl(gearIcon(g)),
    h("div", { class: "grow trunc" },
      h("div", { class: "line" }, h("span", { class: g.tier === "powerful" ? "gold" : "" }, `${g.tier === "powerful" ? "★" : ""}${g.name}`)),
      h("div", { class: "line small codes" }, g.weapon ? h("span", null, weaponCode(g), h("span", { class: "dim" }, hit)) : null, ...codeSpans(g.stats)),
    ),
    onClick && arrow ? h("span", { class: "dim" }, "▶") : null,
  );
}

/** An ability block: icon, name, cost, the documents' sentence, and in designer view the timing, target and effects. */
export function abilityBlock(a: AbilityT, stats: Stats | null, designer: boolean, opts: { n?: number; onN?: () => void; cur?: boolean } = {}): HTMLElement {
  const i = abilityInfo(a, stats);
  const tag = abilityTag(a);
  const head = h("div", { class: "head" },
    opts.n !== undefined ? h("span", { class: "n", onClick: opts.onN }, String(opts.n)) : null,
    TAG_ICON[tag] ? iconEl(TAG_ICON[tag]) : null,
    h("span", { class: `trunc ${tag in TAG_ICON && ["fire", "ice", "lightning", "wind", "earth", "light", "dark"].includes(tag) ? tag : ""}` }, i.name),
    h("span", { class: "cost" }, `${i.mp ? `MP${disp(i.mp)} ` : ""}${cd(i.cooldown)}`),
  );
  const body: Child[] = [h("div", { class: "body" }, i.text)];
  if (designer) {
    body.push(h("div", { class: "body" }, `Wind-up ${i.cast}t (${castWord(i.cast)}), recovery ${i.recovery}t${i.seek ? ", Seek" : ""}. Target: ${i.target}${i.waits ? `; ${i.waits}` : ""}.`));
    for (const e of i.effects) body.push(h("div", { class: "body" }, `→ ${e}`));
  }
  return h("div", { class: `ab${opts.cur ? " cur" : ""}` }, head, ...body);
}

/** The basic attack a weapon gives, worked out for a unit's stats. */
export function basicLine(wp: WeaponT, stats: Stats, designer: boolean): Child {
  const w = weaponInfo(wp, stats);
  const tag = w.tag;
  return h("div", { class: "line" }, TAG_ICON[tag] ? iconEl(TAG_ICON[tag]) : null, h("span", { class: "grow trunc" }, "ATTACK"), h("span", { class: "dim trunc" }, `${(w.type === "magical" ? elementName(w.element ?? "") : w.subtype ?? "").toUpperCase()} EVERY ${w.cooldown}T ${w.hit.replace("≈ ", "≈").split(",")[0]}${designer && w.hit.includes(",") ? ` (${w.hit.split(",").slice(1).join(",").trim()})` : ""}`));
}

/** Everything about a class, with its current build: for the sheet overlay in a fight and the unit screen. */
export function classSheet(id: string, designer: boolean, member: Member = memberFor(id)): Child[] {
  const k = cls(id);
  const out: Child[] = [
    h("div", { class: "text dim wrap small" }, k.text),
    h("hr", { class: "rule" }),
    statGrid(member.stats, k.stats, designer),
  ];
  const sp = specialLines(member.stats);
  if (sp.length) out.push(h("div", { class: "text up small wrap" }, ...sp.flatMap((s, i) => (i ? [" · ", s] : [s]))));
  out.push(h("hr", { class: "rule" }));
  if (k.passive) {
    const st = k.passive.statuses?.[0];
    out.push(h("div", { class: "line" }, st ? glyphEl(st, null, 2) : null, h("span", { class: "grow trunc hi" }, k.passive.name), h("span", { class: "dim" }, "PASSIVE")), h("div", { class: "text dim wrap small" }, k.passive.text));
    if (designer && st) out.push(h("div", { class: "text dim wrap small" }, statusText(status(st)).slice(1).join(" ")));
  } else out.push(h("div", { class: "line" }, h("span", { class: "grow trunc hi" }, "EINHERJAR"), h("span", { class: "dim" }, "PASSIVE")));
  out.push(h("hr", { class: "rule" }));
  out.push(h("div", { class: "line" }, h("span", { class: "dim w8" }, "WEAPONS"), ...k.weapons.map((w) => iconEl(kindIcon(w))), h("span", { class: "dim trunc" }, k.weapons.map((w) => kindOf(w).name).join(", "))));
  out.push(h("div", { class: "line" }, h("span", { class: "dim w8" }, "ARMOR"), h("span", null, k.armor.toUpperCase())));
  const g = gearFor(id);
  for (const slot of ["weapon", "armor", "amulet"] as const) out.push(gearRow(g[slot] ? c.gear.get(g[slot]) ?? null : null, slot, member.stats));
  out.push(h("hr", { class: "rule" }));
  out.push(basicLine(weaponOf(c, member.weapon), member.stats, designer));
  member.abilities.forEach((a, i) => out.push(abilityBlock(c.abilities.get(a)!, member.stats, designer, { n: i + 1 })));
  return out;
}

/** Everything about an enemy, for the bestiary and the sheet overlay. */
export function enemySheet(e: EnemyT, designer: boolean): Child[] {
  const stats = { ...Object.fromEntries(c.pack.stats.map((s) => [s.id, s.default])), ...e.stats };
  const out: Child[] = [h("div", { class: "text dim wrap small" }, e.text)];
  const resists = Object.entries(e.stats).filter(([k, v]) => k.startsWith("resist:") && v);
  if (resists.length || e.stats.resist) {
    out.push(h("div", { class: "line wrap" }, h("span", { class: "dim" }, "ELEMENTS "), ...resists.map(([k, v]) => h("span", { class: `${k.slice(7)}` }, ` ${elementName(k.slice(7)).toUpperCase()} ${v > 100 ? "ABSORBS" : v >= 100 ? "IMMUNE" : v > 0 ? "RESISTS" : "WEAK"}`)), e.stats.resist ? h("span", null, ` ALL RESIST ${e.stats.resist}%`) : null));
  }
  for (const s of e.statuses ?? []) {
    const d = status(s);
    out.push(h("div", { class: "line" }, glyphEl(s, null, 2), h("span", { class: "grow trunc hi" }, d.name), h("span", { class: "dim" }, "PASSIVE")), h("div", { class: "text dim wrap small" }, designer ? statusText(d).join(" ") : d.text ?? ""));
  }
  if (e.abilities?.length) out.push(h("hr", { class: "rule" }));
  for (const a of e.abilities ?? []) out.push(abilityBlock(c.abilities.get(a)!, stats, designer));
  out.push(h("hr", { class: "rule" }));
  if (designer) {
    out.push(h("div", { class: "section" }, "HIDDEN STATS"), statGrid(stats, null, true));
    out.push(basicLine(e.weapon ?? c.pack.ruleset.unarmed, stats, true));
  } else {
    const w = weaponInfo(e.weapon ?? c.pack.ruleset.unarmed, null);
    out.push(h("div", { class: "line" }, TAG_ICON[w.tag] ? iconEl(TAG_ICON[w.tag]) : null, h("span", { class: "grow" }, "ATTACK"), h("span", { class: "dim" }, `${(w.type === "magical" ? elementName(w.element ?? "") : w.subtype ?? "").toUpperCase()} EVERY ${w.cooldown}T`)));
  }
  return out;
}
