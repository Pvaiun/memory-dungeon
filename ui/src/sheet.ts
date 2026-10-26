/**
 * Unit sheets: what a class or an enemy is and does, in one place, laid out
 * to be read on a phone: a head with the face, the name and its line; the
 * stats as a grid of label-over-number cells with the build's change beside
 * each; then the passive, the gear with the weapon's own sprite, and each
 * ability as a card: its icon (shaded until it first comes round, as the
 * battle's rows draw it), its cost and cooldown as icons and numbers, the
 * documents' sentence, and its size for this unit with what it grows with
 * ("50 LIGHT (125% MAG)"). Enemies get the same parts plus their elements.
 * Designer view adds the worked-out numbers from describe.ts.
 */
import type { AbilityT, EnemyT, GearT, WeaponT } from "../../src/schema.js";
import { combat, type Member } from "../../src/engine/combat/rules.js";
import { resolveWeapon, weaponOf } from "../../src/engine/combat/fight.js";
import { c, cls, disp, ELEMENT_CODE, kindOf, SHEET_STATS, SPECIAL_STATS, showStat, statCode, status, elementName, tagline } from "./content.js";
import { abilityInfo, abilityTag, evalNum, scalesOf, sizeParts, statusText, type Scale, type SizePart, type Stats } from "./describe.js";
import { amuletStatus, ELEMENTS, gearIcon, SLOT_ICON, TAG_ICON } from "./art.js";
import { h, type Child } from "./dom.js";
import { actorEl, faceEl, glyphEl, iconEl, pipEl, statusEl, weaponEl } from "./pixel.js";
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

/** A class's line, in one sentence. */
export const role = (id: string) => tagline(id);

/** The head of a class sheet: face, name, its line, and the figure with its weapon. */
export function classHead(id: string, right?: Child, weapon: string | undefined = gearFor(id).weapon): HTMLElement {
  const k = cls(id);
  return h("div", { class: "sheet-head" },
    faceEl(id),
    h("div", { class: "grow" }, h("div", { class: "name hi" }, k.name.toUpperCase()), h("div", { class: "text dim small wrap" }, tagline(id)), right ?? null),
    actorEl(id, "wait", 1, weapon),
  );
}

/** A stat's code in its colour: ATK warm, MAG violet, ARM steel, HP green; the same colours mark what an amount grows with. */
const STAT_TONE: Record<string, string> = { attack: "st-atk", magic: "st-mag", armor: "st-arm", max_hp: "st-hp", thorns: "st-hp", crit_chance: "gold", max_mp: "mp", mp_regen: "mp" };
export const statLabel = (key: string) => h("span", { class: STAT_TONE[key] ?? "" }, statCode(key));

/** The stat grid: label over number, four to a row; a coloured change when gear or the formation moved a stat off the class's base. */
export function statGrid(stats: Stats, base: Stats | null, designer: boolean, keys: readonly string[] = SHEET_STATS): HTMLElement {
  const cell = (label: Child, value: Child, delta?: Child, cls = "") => h("div", { class: `cell${cls ? ` ${cls}` : ""}` }, h("span", { class: "lbl" }, label), h("span", { class: "val" }, value, delta ?? null));
  const cells: Child[] = [];
  for (const key of keys) {
    const v = stats[key] ?? 0;
    const b = base?.[key];
    const delta = b !== undefined ? v - b : 0;
    const dtext = !delta ? null : key === "crit_chance" ? `${delta > 0 ? "+" : ""}${Math.round(delta)}%` : key === "aggro" ? `${delta > 0 ? "+" : ""}${Math.round(delta)}` : `${delta > 0 ? "+" : ""}${disp(delta)}`;
    cells.push(cell(statLabel(key), showStat(key, v), dtext ? h("i", { class: delta > 0 ? "good" : "bad" }, dtext) : undefined));
  }
  if (designer || !base) {
    for (const key of SPECIAL_STATS) {
      const v = stats[key] ?? 0;
      if (v === (c.stats.get(key)?.default ?? 0)) continue;
      cells.push(cell(statCode(key), showStat(key, v)));
    }
  }
  for (const [k, v] of Object.entries(stats)) {
    if (!k.startsWith("resist:") || !v || !base) continue;
    cells.push(cell(h("span", { class: k.slice(7) }, statCode(k)), h("span", { class: v > 0 ? "good" : "bad" }, `${v > 0 ? "+" : ""}${v}%`)));
  }
  if (stats.resist && base) cells.push(cell("RES", `${stats.resist}%`));
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

/** Stat changes as coloured codes: "ARM+30 HP+60", green up, red down, on the stat sheet's scale. */
export function codeSpans(stats: { stat: string; flat?: number; pct?: number }[] | undefined): Child[] {
  if (!stats?.length) return [];
  return stats.flatMap((s, i) => {
    const def = c.stats.get(s.stat);
    const v = s.flat ?? 0;
    const sign = v >= 0 ? "+" : "";
    // Amounts at the display scale, as the stat sheet shows them; percent stats as they are.
    const shown = s.stat === "crit_chance" || def?.kind === "points" || s.stat.startsWith("resist") ? `${sign}${v}%` : s.stat === "aggro" ? `${sign}${v}` : `${sign}${disp(v)}`;
    const pct = s.pct ? `${s.pct > 0 ? "+" : ""}${s.pct}%` : "";
    const el = s.stat.startsWith("resist:") ? s.stat.slice(7) : "";
    return [i ? " " : null, h("span", { class: `${v < 0 || (s.pct ?? 0) < 0 ? "bad" : "good"}${el ? ` ${el}` : ""}` }, `${statCode(s.stat)}${shown}${pct}`)];
  });
}

// ─── Amounts and timings ───

/** "(125% MAG)", each stat in its colour. */
export function scaleEl(scales: Scale[]): Child {
  if (!scales.length) return null;
  return h("span", { class: "scale" }, "(", ...scales.flatMap((s, i) => [i ? ", " : null, h("span", { class: s.stat ? STAT_TONE[s.stat] ?? "" : "" }, s.text)]), ")");
}
/** An ability's size: "50 LIGHT (125% MAG) + 10 BURN (MAG)". */
export function sizeEl(parts: SizePart[]): HTMLElement | null {
  if (!parts.length) return null;
  return h("div", { class: "size" }, ...parts.flatMap((p, i) => [
    i ? h("span", { class: "dim" }, " + ") : null,
    h("span", { class: "nowrap" }, p.value ? `${p.value} ` : "", h("span", { class: p.tone ?? "" }, p.word), p.chance ? h("span", { class: "dim" }, ` ${p.chance}%`) : null),
    p.scales.length ? " " : null, scaleEl(p.scales),
  ]));
}
/** A whole number of ticks: the director's "round it, even if it's off by a bit". */
export const tk = (t: number) => String(Math.max(t > 0 ? 1 : 0, Math.round(t)));
/** A glyph and a number: the cooldown's clock, the wind-up's swirl. */
const glyph = (id: string, n: string, cls = "") => h("span", { class: `glyph ${cls}` }, glyphEl(id), n);

/** What a weapon's basic attack is, worked out for a unit: its kind, how often, what it hits for and what it grows with. */
export function weaponParts(wp: WeaponT, stats: Stats | null): { tag: string; word: string; tone: string; cooldown: number; value: string | null; scales: Scale[] } {
  const r = resolveWeapon(c, wp);
  const magic = r.type === "magical";
  const value = stats ? `${wp.hits && wp.hits > 1 ? `${wp.hits}×` : ""}${disp(evalNum(wp.amount, stats).value)}` : null;
  return { tag: magic ? r.element ?? "magical" : r.subtype ?? "physical", word: (magic ? elementName(r.element ?? "") : r.subtype ?? "").toUpperCase(), tone: magic ? r.element ?? "" : "phys", cooldown: r.cooldown, value, scales: scalesOf(wp.amount) };
}
/** A weapon's kind and speed: "SLASH ⏲7". */
export function weaponCode(g: GearT, stats: Stats | null): Child[] {
  if (!g.weapon) return [];
  const w = weaponParts(g.weapon, stats);
  return [h("span", { class: w.tone }, w.word), " ", glyph("ui_cooldown", tk(w.cooldown)), w.value ? h("span", { class: "ink" }, ` ${w.value}`) : null, w.scales.length ? " " : null, scaleEl(w.scales)];
}

/** A piece of gear as a two-line row: its sprite or icon, name (★ powerful), then its kind, speed, hit and codes. */
export function gearRow(g: GearT | null, slot: string, stats: Stats | null, onClick?: () => void, arrow = true): HTMLElement {
  const slotName = h("span", { class: "dim" }, slot.toUpperCase());
  if (!g) return h("div", { class: "gear-row", onClick }, h("span", { class: "art" }, iconEl(SLOT_ICON[slot] ?? TAG_ICON.physical)), h("div", { class: "grow trunc" }, h("div", { class: "line" }, slotName), h("div", { class: "line small dim" }, "NOTHING")), onClick && arrow ? h("span", { class: "dim" }, "▶") : null);
  const lg = amuletStatus(g);
  const art = (g.slot === "weapon" ? weaponEl(g.id) : null) ?? (lg ? statusEl(lg) : iconEl(gearIcon(g)));
  return h("div", { class: "gear-row", onClick },
    h("span", { class: "art" }, art),
    h("div", { class: "grow trunc" },
      h("div", { class: "line" }, h("span", { class: `trunc ${g.tier === "powerful" ? "gold" : ""}` }, `${g.tier === "powerful" ? "★" : ""}${g.name.toUpperCase()}`)),
      h("div", { class: "line small codes" }, ...(g.weapon ? weaponCode(g, stats) : [slotName]), ...codeSpans(g.stats)),
    ),
    onClick && arrow ? h("span", { class: "dim" }, "▶") : null,
  );
}

/**
 * An ability card: the slot number to tap, the icon (shaded until it first comes round, the ticks in its corner), the
 * name in its element's colour, the MP, cooldown and wind-up as glyphs and whole numbers; the documents' sentence; and
 * its size for this unit with what it grows with. In designer view, the target and every effect in words.
 */
export function abilityBlock(a: AbilityT, stats: Stats | null, designer: boolean, opts: { n?: number; onN?: () => void; cur?: boolean; dmgMult?: number; opening?: boolean } = {}): HTMLElement {
  const i = abilityInfo(a, stats);
  const tag = abilityTag(a);
  const cell = TAG_ICON[tag] ?? TAG_ICON.physical;
  // Step 5c: an ability starts a fight charged by its slot (ruleset.opening.slots), so its first use is part of the plan.
  const head0 = opts.n !== undefined && opts.opening !== false ? c.pack.ruleset.opening?.slots?.[opts.n - 1] : undefined;
  const first = head0 !== undefined ? Math.max(0, i.cooldown - head0) : 0;
  const head = h("div", { class: "head" },
    opts.n !== undefined ? h("span", { class: "n", onClick: opts.onN }, String(opts.n)) : null,
    h("span", { class: "pip" }, pipEl(cell, first, i.cooldown, 2)),
    h("div", { class: "grow" },
      h("div", { class: `trunc ${ELEMENTS.includes(tag) ? tag : tag === "heal" || tag === "revive" || tag === "cleanse" ? "good" : ""}` }, i.name.toUpperCase()),
      h("div", { class: "cost" },
        i.mp ? h("span", { class: "mp" }, `MP ${disp(i.mp)}`) : null,
        glyph("ui_cooldown", tk(i.cooldown)),
        i.cast ? glyph("ui_cast", tk(i.cast), "dim") : null,
      ),
    ),
  );
  const body: Child[] = [h("div", { class: "body" }, i.text)];
  if (stats) body.push(sizeEl(sizeParts(a, stats, opts.dmgMult)));
  if (designer) {
    body.push(h("div", { class: "body" }, `Wind-up ${i.cast}t, cooldown ${i.cooldown}t, recovery ${i.recovery}t${i.seek ? ", Seek" : ""}. Target: ${i.target}${i.waits ? `; ${i.waits}` : ""}.`));
    for (const e of i.effects) body.push(h("div", { class: "body" }, `→ ${e}`));
  }
  return h("div", { class: `ab${opts.cur ? " cur" : ""}` }, head, ...body);
}

/** The basic attack a weapon gives, worked out for a unit's stats: kind, cooldown, hit, what it grows with. */
export function basicLine(wp: WeaponT, stats: Stats | null, opts: { mult?: number; slot?: boolean } = {}): HTMLElement {
  const w = weaponParts(wp, stats);
  const value = stats && opts.mult && opts.mult !== 1 ? `${wp.hits && wp.hits > 1 ? `${wp.hits}×` : ""}${disp(evalNum(wp.amount, stats).value * opts.mult)}` : w.value;
  return h("div", { class: "ab" },
    h("div", { class: "head" }, opts.slot === false ? null : h("span", { class: "n dim" }, "·"), h("span", { class: "pip" }, iconEl(TAG_ICON[w.tag] ?? TAG_ICON.physical, 2)),
      h("div", { class: "grow" }, h("div", null, "ATTACK"), h("div", { class: "cost" }, glyph("ui_cooldown", tk(w.cooldown))))),
    h("div", { class: "size" }, value ? `${value} ` : "", h("span", { class: w.tone }, w.word), w.scales.length ? " " : null, scaleEl(w.scales)),
  );
}

/** A section title with a note at its right. */
export const section = (title: string, note?: Child) => h("div", { class: "section" }, title, note ? h("span", { class: "r dim small text" }, note) : null);
/** A passive's block: its icon when it has a status, its name, its text. */
export function passiveBlock(name: string, text: string, icon?: string | null, more?: string | null): Child[] {
  return [
    h("div", { class: "line" }, icon ? statusEl(icon) : null, h("span", { class: "grow trunc hi" }, name.toUpperCase())),
    text ? h("div", { class: "text dim wrap small" }, text) : null,
    more ? h("div", { class: "text dim wrap small" }, more) : null,
  ];
}
/** A class's passive: its own, or the Valkyrie's Einherjar, which the content keeps on its revive. */
export function classPassive(id: string, designer = false): Child[] {
  const k = cls(id);
  if (!k.passive) return passiveBlock("Einherjar", "Allies it revives come back with every action ready.", null);
  const st = k.passive.statuses?.[0];
  return passiveBlock(k.passive.name, k.passive.text, st, designer && st ? statusText(status(st)).slice(1).join(" ") : null);
}

/** What a class can carry: its weapon kinds' icons and names, and its armor weight. */
export const canUse = (id: string) => {
  const k = cls(id);
  return h("div", { class: "text small dim up wrap", style: "margin-top:.25rem" }, `${k.weapons.map((w) => kindOf(w).name).join(", ")} · ${k.armor} armor`);
};

/** Everything about a class, with its current build, read-only: for a fight's inspect window. */
export function classSheet(id: string, designer: boolean, member: Member = memberFor(id), gear: Record<string, string> = gearFor(id)): Child[] {
  const k = cls(id);
  const out: Child[] = [statGrid(member.stats, k.stats, designer)];
  const sp = specialLines(member.stats);
  if (sp.length) out.push(h("div", { class: "text up small wrap" }, ...sp.flatMap((s, i) => (i ? [" · ", s] : [s]))));
  out.push(section("PASSIVE"), ...classPassive(id, designer));
  out.push(section("ABILITIES"));
  // In a fight the rows show each cooldown live: the sheet's icons stay plain.
  member.abilities.forEach((a, i) => out.push(abilityBlock(c.abilities.get(a)!, member.stats, designer, { n: i + 1, opening: false })));
  out.push(basicLine(weaponOf(c, member.weapon), member.stats));
  out.push(section("GEAR"));
  for (const slot of ["weapon", "armor", "amulet"] as const) out.push(gearRow(gear[slot] ? c.gear.get(gear[slot]) ?? null : null, slot, member.stats, undefined, false));
  return out;
}

// ─── Enemies ───

/** An enemy's stats with the defaults filled in. */
export const enemyStats = (e: EnemyT): Stats => ({ ...Object.fromEntries(c.pack.stats.map((s) => [s.id, s.default])), ...e.stats });

/** How an element treats a unit, from its resist (its own plus the general one): the word and its colour. */
function affinity(v: number): [string, string] {
  if (v > 100) return ["ABS", "good"];
  if (v >= 100) return ["IMM", "good"];
  if (v > 0) return ["RES", "buff"];
  if (v < 0) return ["WEAK", "bad"];
  return ["·", "dim"];
}
/** The seven elements in a row, each icon over how it lands: WEAK, RES, IMM, ABS or a dot. Final Fantasy's bestiary does it this way. */
export function elementRow(stats: Stats, designer = false): HTMLElement {
  return h("div", { class: "elements" }, ...ELEMENTS.map((el) => {
    const v = (stats[`resist:${el}`] ?? 0) + (stats.resist ?? 0);
    const [word, tone] = affinity(v);
    return h("div", { class: "el" }, iconEl(TAG_ICON[el]), h("span", { class: tone }, designer && v ? `${v > 0 ? "+" : ""}${v}` : word));
  }));
}
/** What a foe hits with: its attack's kind and every kind its abilities deal, as icons and words. */
export function hitsWith(e: EnemyT): Child[] {
  const kinds = new Map<string, string>();
  const w = resolveWeapon(c, e.weapon ?? c.pack.ruleset.unarmed);
  const add = (tag: string, tone: string) => kinds.set(tag, tone);
  add(w.type === "magical" ? w.element ?? "magical" : w.subtype ?? "physical", w.type === "magical" ? w.element ?? "" : "phys");
  for (const a of e.abilities ?? []) for (const d of c.abilities.get(a)!.do) if (d.op === "damage") add(d.type === "magical" ? d.element ?? "magical" : d.subtype ?? "physical", d.type === "magical" ? d.element ?? "" : "phys");
  return [...kinds].map(([tag, tone]) => h("span", { class: `nowrap ${tone}` }, iconEl(TAG_ICON[tag] ?? TAG_ICON.physical), ` ${(ELEMENT_CODE[tag] ?? tag).toUpperCase()}`));
}
/** The enemy stats a player reads: how much HP, how hard it hits each way, how much Armor; the rest only when it differs from the default. */
const ENEMY_STATS = ["max_hp", "attack", "magic", "armor"] as const;

/**
 * Everything about an enemy, for the bestiary and a fight's inspect window: its line, its stats (`live` for a fight's
 * unit, with the run's changes), how each element lands, what it hits with, what it can't be given, its passives and
 * its actions with their sizes. `power` is a fight's damage change, in percent.
 */
export function enemySheet(e: EnemyT, designer: boolean, live?: Stats, power = 0): Child[] {
  const stats = live ?? enemyStats(e);
  const mult = 1 + power / 100;
  const out: Child[] = [];
  if (e.text) out.push(h("div", { class: "text dim wrap small", style: "margin-bottom:.375rem" }, e.text));
  // A fight's foe has its HP just above, live: the grid leaves it out.
  out.push(statGrid(stats, null, designer, live ? ENEMY_STATS.slice(1) : ENEMY_STATS));
  out.push(section("ELEMENTS"), elementRow(stats, designer));
  out.push(h("div", { class: "line wrap small" }, h("span", { class: "dim" }, "HITS WITH"), ...hitsWith(e)));
  const immune = Object.entries(stats).filter(([k, v]) => k.startsWith("immune:") && v).map(([k]) => k.slice(7));
  if (immune.length) out.push(h("div", { class: "line wrap small" }, h("span", { class: "dim" }, "IMMUNE TO"), ...immune.map((s) => h("span", { class: "nowrap" }, c.statuses.has(s) ? statusEl(s) : null, ` ${(c.statuses.get(s)?.name ?? s).toUpperCase()}`))));
  if (e.statuses?.length) {
    out.push(section("PASSIVES"));
    for (const s of e.statuses) {
      const d = status(s);
      out.push(...passiveBlock(d.name, designer ? statusText(d).join(" ") : d.text ?? "", s));
    }
  }
  out.push(section("ACTIONS"));
  out.push(basicLine(e.weapon ?? c.pack.ruleset.unarmed, stats, { mult, slot: false }));
  for (const a of e.abilities ?? []) out.push(abilityBlock(c.abilities.get(a)!, stats, designer, { dmgMult: mult }));
  if (designer) out.push(section("HIDDEN STATS"), statGrid(stats, null, true, ["max_mp", "mp_regen", "crit_chance", "aggro"]));
  return out;
}
