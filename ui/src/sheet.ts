/**
 * Unit sheets: what a class or an enemy is and does, in one place, laid out
 * to be read on a phone: a head with the face, the name and the role; the
 * stats as a grid of label-over-number cells with the build's change beside
 * each; then the passive, the gear with the weapon's own sprite, and each
 * ability as a card with its icon, cost and the documents' sentence.
 * Designer view adds the worked-out numbers from describe.ts.
 */
import type { AbilityT, EnemyT, GearT, WeaponT } from "../../src/schema.js";
import { combat, type Member } from "../../src/engine/combat/rules.js";
import { weaponOf } from "../../src/engine/combat/fight.js";
import { c, cls, disp, kindOf, SHEET_STATS, SPECIAL_STATS, showStat, statCode, status, elementName } from "./content.js";
import { abilityInfo, abilityTag, castWord, statusText, weaponInfo, type Stats } from "./describe.js";
import { ELEMENTS, gearIcon, kindIcon, SLOT_ICON, TAG_ICON } from "./art.js";
import { h, type Child } from "./dom.js";
import { actorEl, faceEl, iconEl, statusEl, weaponEl } from "./pixel.js";
import { gearFor, party, setup, soloParty } from "./state.js";

/** The class's unit with its gear, formation slot and passive applied: what it brings to a fight. */
export function memberFor(id: string): Member {
  const inParty = setup.party.includes(id);
  const p = inParty ? party() : soloParty(id);
  const members = combat.party(c, { dungeon: c.pack.progression.dungeonOrder[0], party: p, seed: 1 }) as Member[];
  return members.find((m) => m.ref === id)!;
}

/** What stands for a class in a menu: its face or its figure with its weapon, by the PORTRAITS setting; `slot` is the party screen's cards. */
export function portraitEl(id: string, place: "slot" | "list" = "list"): HTMLCanvasElement {
  const p = setup.settings.portraits;
  const sprite = p === "sprites" || (p === "mixed" && place === "slot");
  return sprite ? actorEl(id, "wait", 1, gearFor(id).weapon) : faceEl(id);
}

/** The first sentence of a class or enemy text, as its role word. */
export const role = (text: string) => text.split(".")[0];

/** The head of a class sheet: face, name, role, and the figure with its weapon. */
export function classHead(id: string, right?: Child): HTMLElement {
  const k = cls(id);
  return h("div", { class: "sheet-head" },
    faceEl(id),
    h("div", { class: "grow" }, h("div", { class: "name hi" }, k.name.toUpperCase()), h("div", { class: "text dim small wrap" }, role(k.text)), right ?? null),
    actorEl(id, "wait", 1, gearFor(id).weapon),
  );
}

/** The stat grid: label over number, four to a row; a coloured change when gear or the formation moved a stat off the class's base. */
export function statGrid(stats: Stats, base: Stats | null, designer: boolean): HTMLElement {
  const cell = (label: Child, value: Child, delta?: Child, cls = "") => h("div", { class: `cell${cls ? ` ${cls}` : ""}` }, h("span", { class: "lbl" }, label), h("span", { class: "val" }, value, delta ?? null));
  const cells: Child[] = [];
  for (const key of SHEET_STATS) {
    const v = stats[key] ?? 0;
    const b = base?.[key];
    const delta = b !== undefined ? v - b : 0;
    const dtext = !delta ? null : key === "crit_chance" ? `${delta > 0 ? "+" : ""}${Math.round(delta)}%` : `${delta > 0 ? "+" : ""}${disp(delta)}`;
    cells.push(cell(statCode(key), showStat(key, v), dtext ? h("i", { class: delta > 0 ? "good" : "bad" }, dtext) : undefined));
  }
  if (designer || !base) {
    for (const key of SPECIAL_STATS) {
      const v = stats[key] ?? 0;
      if (v === (c.stats.get(key)?.default ?? 0)) continue;
      cells.push(cell(statCode(key), showStat(key, v)));
    }
  }
  for (const [k, v] of Object.entries(stats)) {
    if (!k.startsWith("resist:") || !v) continue;
    cells.push(cell(h("span", { class: k.slice(7) }, statCode(k)), h("span", { class: v > 0 ? "good" : "bad" }, `${v > 0 ? "+" : ""}${v}%`)));
  }
  if (stats.resist) cells.push(cell("RES", `${stats.resist}%`));
  return h("div", { class: "stats" }, ...cells);
}
/** The special stats a unit has above default, as "EVA 35%" lines. */
export function specialLines(stats: Stats): Child[] {
  const out: Child[] = [];
  for (const key of SPECIAL_STATS) {
    const v = stats[key] ?? 0;
    if (v === (c.stats.get(key)?.default ?? 0)) continue;
    out.push(h("span", { class: "nowrap" }, h("span", { class: "dim" }, `${statCode(key)} `), showStat(key, v)));
  }
  return out;
}

/** Stat changes as coloured codes: "ARM+10 HP+20", green up, red down, on the stat sheet's scale. */
export function codeSpans(stats: { stat: string; flat?: number; pct?: number }[] | undefined): Child[] {
  if (!stats?.length) return [];
  return stats.flatMap((s, i) => {
    const def = c.stats.get(s.stat);
    const v = s.flat ?? 0;
    const sign = v >= 0 ? "+" : "";
    // Amounts at the display scale, as the stat sheet shows them (a +2 step reads +20); percent stats as they are.
    const shown = s.stat === "crit_chance" || def?.kind === "points" || s.stat.startsWith("resist") ? `${sign}${v}%` : `${sign}${disp(v)}`;
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
/** A piece of gear as a two-line row: its sprite or icon, name (★ powerful), then its codes; `stats` works out the weapon's hit. */
export function gearRow(g: GearT | null, slot: string, stats: Stats | null, onClick?: () => void, arrow = true): HTMLElement {
  const slotName = h("span", { class: "dim" }, slot.toUpperCase());
  if (!g) return h("div", { class: "gear-row", onClick }, h("span", { class: "art" }, iconEl(SLOT_ICON[slot] ?? TAG_ICON.physical)), h("div", { class: "grow trunc" }, h("div", { class: "line" }, slotName), h("div", { class: "line small dim" }, "nothing")), onClick && arrow ? h("span", { class: "dim" }, "▶") : null);
  const hit = g.weapon && stats ? `≈${weaponInfo(g.weapon, stats).hit.replace(/^≈ /, "").split(",")[0]}` : "";
  const art = (g.slot === "weapon" ? weaponEl(g.id) : null) ?? iconEl(gearIcon(g));
  return h("div", { class: "gear-row", onClick },
    h("span", { class: "art" }, art),
    h("div", { class: "grow trunc" },
      h("div", { class: "line" }, h("span", { class: `trunc ${g.tier === "powerful" ? "gold" : ""}` }, `${g.tier === "powerful" ? "★" : ""}${g.name.toUpperCase()}`)),
      h("div", { class: "line small codes" }, g.weapon ? h("span", null, weaponCode(g), h("span", { class: "dim" }, ` ${hit}`)) : slotName, ...codeSpans(g.stats)),
    ),
    onClick && arrow ? h("span", { class: "dim" }, "▶") : null,
  );
}

/** An ability card: number, icon, name in its element's colour, cost; the documents' sentence; in designer view the timing, target and effects. */
export function abilityBlock(a: AbilityT, stats: Stats | null, designer: boolean, opts: { n?: number; onN?: () => void; cur?: boolean } = {}): HTMLElement {
  const i = abilityInfo(a, stats);
  const tag = abilityTag(a);
  const head = h("div", { class: "head" },
    opts.n !== undefined ? h("span", { class: "n", onClick: opts.onN }, String(opts.n)) : null,
    TAG_ICON[tag] ? iconEl(TAG_ICON[tag]) : null,
    h("span", { class: `trunc grow ${ELEMENTS.includes(tag) ? tag : tag === "heal" || tag === "revive" || tag === "cleanse" ? "good" : ""}` }, i.name.toUpperCase()),
  );
  const cost = h("div", { class: "cost" }, i.mp ? h("span", { class: "mp" }, `MP ${disp(i.mp)}`) : h("span", { class: "dim" }, "NO MP"), h("span", { class: "dim" }, ` · EVERY ${i.cooldown}T`), i.cast ? h("span", { class: "dim" }, ` · ${castWord(i.cast).toUpperCase()} CAST`) : null);
  const body: Child[] = [cost, h("div", { class: "body" }, i.text)];
  if (designer) {
    body.push(h("div", { class: "body" }, `Wind-up ${i.cast}t, recovery ${i.recovery}t${i.seek ? ", Seek" : ""}. Target: ${i.target}${i.waits ? `; ${i.waits}` : ""}.`));
    for (const e of i.effects) body.push(h("div", { class: "body" }, `→ ${e}`));
  }
  return h("div", { class: `ab${opts.cur ? " cur" : ""}` }, head, ...body);
}

/** The basic attack a weapon gives, worked out for a unit's stats. */
export function basicLine(wp: WeaponT, stats: Stats, designer: boolean): Child {
  const w = weaponInfo(wp, stats);
  const tag = w.tag;
  return h("div", { class: "ab" },
    h("div", { class: "head" }, h("span", { class: "n dim" }, "·"), TAG_ICON[tag] ? iconEl(TAG_ICON[tag]) : null, h("span", { class: "grow trunc" }, "ATTACK")),
    h("div", { class: "cost" }, h("span", { class: "dim" }, `${(w.type === "magical" ? elementName(w.element ?? "") : w.subtype ?? "").toUpperCase()} · EVERY ${w.cooldown}T · ${w.hit.replace("≈ ", "≈").split(",")[0]}${designer && w.hit.includes(",") ? ` (${w.hit.split(",").slice(1).join(",").trim()})` : ""}`)),
  );
}

/** A section title with a note at its right. */
export const section = (title: string, note?: Child) => h("div", { class: "section" }, title, note ? h("span", { class: "r dim small text" }, note) : null);
/** A passive's block: its icon when it has a status, its name, its text. */
export function passiveBlock(name: string, text: string, icon?: string | null, more?: string | null): Child[] {
  return [
    h("div", { class: "line" }, icon ? statusEl(icon) : null, h("span", { class: "grow trunc hi" }, name.toUpperCase())),
    h("div", { class: "text dim wrap small" }, text),
    more ? h("div", { class: "text dim wrap small" }, more) : null,
  ];
}

/** Everything about a class, with its current build: for the sheet overlay in a fight. */
export function classSheet(id: string, designer: boolean, member: Member = memberFor(id)): Child[] {
  const k = cls(id);
  const out: Child[] = [classHead(id), statGrid(member.stats, k.stats, designer)];
  const sp = specialLines(member.stats);
  if (sp.length) out.push(h("div", { class: "text up small wrap" }, ...sp.flatMap((s, i) => (i ? [" · ", s] : [s]))));
  out.push(h("div", { class: "text dim wrap small", style: "margin-top:.5rem" }, k.text));
  out.push(section("PASSIVE"));
  if (k.passive) {
    const st = k.passive.statuses?.[0];
    out.push(...passiveBlock(k.passive.name, k.passive.text, st, designer && st ? statusText(status(st)).slice(1).join(" ") : null));
  } else out.push(...passiveBlock("Einherjar", "", null));
  out.push(section("GEAR"));
  const g = gearFor(id);
  for (const slot of ["weapon", "armor", "amulet"] as const) out.push(gearRow(g[slot] ? c.gear.get(g[slot]) ?? null : null, slot, member.stats));
  out.push(h("div", { class: "line small dim wrap" }, h("span", null, "CAN USE "), ...k.weapons.map((w) => iconEl(kindIcon(w))), h("span", null, ` ${k.weapons.map((w) => kindOf(w).name).join(", ").toUpperCase()} · ${k.armor.toUpperCase()} ARMOR`)));
  out.push(section("ABILITIES"));
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
    out.push(section("ELEMENTS"));
    out.push(h("div", { class: "line wrap" }, ...resists.map(([k, v]) => h("span", { class: `${k.slice(7)} nowrap` }, `${elementName(k.slice(7)).toUpperCase()} ${v > 100 ? "ABSORBS" : v >= 100 ? "IMMUNE" : v > 0 ? "RESISTS" : "WEAK"}  `)), e.stats.resist ? h("span", null, `ALL RESIST ${e.stats.resist}%`) : null));
  }
  if (e.statuses?.length) out.push(section("PASSIVES"));
  for (const s of e.statuses ?? []) {
    const d = status(s);
    out.push(...passiveBlock(d.name, designer ? statusText(d).join(" ") : d.text ?? "", s));
  }
  out.push(section("ACTIONS"));
  if (designer) out.push(basicLine(e.weapon ?? c.pack.ruleset.unarmed, stats, true));
  else {
    const w = weaponInfo(e.weapon ?? c.pack.ruleset.unarmed, null);
    out.push(h("div", { class: "ab" }, h("div", { class: "head" }, TAG_ICON[w.tag] ? iconEl(TAG_ICON[w.tag]) : null, h("span", { class: "grow" }, "ATTACK")), h("div", { class: "cost dim" }, `${(w.type === "magical" ? elementName(w.element ?? "") : w.subtype ?? "").toUpperCase()} · EVERY ${w.cooldown}T`)));
  }
  for (const a of e.abilities ?? []) out.push(abilityBlock(c.abilities.get(a)!, stats, designer));
  if (designer) out.push(section("HIDDEN STATS"), statGrid(stats, null, true));
  return out;
}
