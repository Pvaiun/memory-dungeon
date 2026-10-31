/**
 * Unit sheets: what a class or an enemy is and does, in one place, laid out
 * to be read on a phone: a head with the face, the name and its line; the
 * stats as a grid of label-over-number cells with the build's change beside
 * each; then the passive, the gear with the weapon's own sprite, and each
 * ability as a card: its icon (shaded until it first comes round, as the
 * battle's rows draw it), its cost and cooldown as icons and numbers, the
 * documents' sentence, and its size for this unit with what it grows with
 * ("150 MAGICAL (125% MAG)"). Enemies get the same parts plus their Magic resist.
 * Designer view adds the worked-out numbers from describe.ts.
 */
import { headStart } from "../../src/engine/combat/stats.js";
import type { AbilityT, EnemyT, FormationT, GearT, WeaponT } from "../../src/schema.js";
import { combat, type Member } from "../../src/engine/combat/rules.js";
import { resolveWeapon, weaponOf } from "../../src/engine/combat/fight.js";
import { armorName, c, cls, disp, immuneTo, kindOf, offhandName, SHEET_STATS, shortName, SPECIAL_STATS, showStat, statCode, status, tagline } from "./content.js";
import { abilityInfo, abilityTag, damageTypeOf, evalNum, scalesOf, sizeParts, statusText, TYPE_TONE, TYPE_WORD, type Scale, type SizePart, type Stats } from "./describe.js";
import { gearIcon, SLOT_ICON, TAG_ICON, weaponLook } from "./art.js";
import { canEquip, handsOf } from "../../src/validate.js";
import { h, type Child } from "./dom.js";
import { actionIconOf, actorEl, faceEl, iconEl, pipEl, statusEl, weaponEl } from "./pixel.js";
import { gearFor, party, setup, soloParty } from "./state.js";

/** The four gear slots, in the order the sheets list them (step 5j). */
export const SLOTS = ["weapon", "armor", "offhand", "amulet"] as const;
export type GearSlot = (typeof SLOTS)[number];

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


/**
 * The stat grid: label over number, four to a row (five for a foe's line); a coloured change when gear or the formation
 * moved a stat off the class's base; then Magic resist where it isn't in the keys and isn't zero ("RES 40%").
 */
export function statGrid(stats: Stats, base: Stats | null, designer: boolean, keys: readonly string[] = SHEET_STATS): HTMLElement {
  const cell = (label: Child, value: Child, delta?: Child, cls = "") => h("div", { class: `cell${cls ? ` ${cls}` : ""}` }, h("span", { class: "lbl" }, label), h("span", { class: "val" }, value, delta ?? null));
  const cells: Child[] = [];
  for (const key of keys) {
    const v = stats[key] ?? 0;
    const b = base?.[key];
    const delta = b !== undefined ? v - b : 0;
    const dtext = !delta ? null : key === "crit_chance" ? `${delta > 0 ? "+" : ""}${Math.round(delta)}%` : key === "aggro" ? `${delta > 0 ? "+" : ""}${Math.round(delta)}` : `${delta > 0 ? "+" : ""}${disp(delta)}`;
    cells.push(cell(statCode(key), showStat(key, v), dtext ? h("i", { class: delta > 0 ? "good" : "bad" }, dtext) : undefined));
  }
  if (designer || !base) {
    for (const key of SPECIAL_STATS) {
      const v = stats[key] ?? 0;
      if (v === (c.stats.get(key)?.default ?? 0)) continue;
      cells.push(cell(statCode(key), showStat(key, v)));
    }
  }
  // A class's sheet: Magic resist only once something gives it (gear, a seat, Ward); a foe's sheets name it in their keys.
  if (base && !keys.includes("magic_resist") && stats.magic_resist) {
    const d = stats.magic_resist - (base.magic_resist ?? 0);
    cells.push(cell(statCode("magic_resist"), showStat("magic_resist", stats.magic_resist), d ? h("i", { class: d > 0 ? "good" : "bad" }, `${d > 0 ? "+" : ""}${Math.round(d)}%`) : undefined));
  }
  return h("div", { class: `stats${keys.length === 5 ? " five" : ""}` }, ...cells);
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
    // An immunity reads as what it keeps off ("NO SILENCE"), with no number.
    if (s.stat.startsWith("immune:")) return [i ? " " : null, h("span", { class: "nowrap good" }, statCode(s.stat))];
    const def = c.stats.get(s.stat);
    const v = s.flat ?? 0;
    const sign = v >= 0 ? "+" : "";
    // Amounts at the display scale, as the stat sheet shows them; percent stats as they are.
    const shown = s.stat === "crit_chance" || def?.kind === "points" ? `${sign}${v}%` : s.stat === "aggro" ? `${sign}${v}` : `${sign}${disp(v)}`;
    const pct = s.pct ? `${s.pct > 0 ? "+" : ""}${s.pct}%` : "";
    return [i ? " " : null, h("span", { class: `nowrap ${v < 0 || (s.pct ?? 0) < 0 ? "bad" : "good"}` }, `${statCode(s.stat)}${shown}${pct}`)];
  });
}

// ─── Formations ───

type Seat = FormationT["positions"][number];
/**
 * What a formation's own statuses do to everyone, after its text (" Starts each fight with Regen."), in designer view only:
 * since step 5i a formation's text is its card and says the same (the hurricane read twice), so a player reads it once.
 */
export const formationNote = (f: FormationT): string => (setup.settings.designer && f.statuses?.length ? ` ${f.statuses.map((s) => c.statuses.get(s)?.text ?? "").join(" ")}` : "");
/** A seat's stat changes as codes on a card; "no change" only when it has neither codes nor statuses of its own (step 5i). */
export function seatCodes(p: Seat): Child[] {
  const codes = codeSpans(p.stats);
  return codes.length ? codes : p.statuses?.length ? [] : [h("span", { class: "dim" }, "no change")];
}
/** A formation's seats as lines, twin seats once with ×2: the name, the stat changes, and what its statuses do (step 5i). */
export function seatLines(f: FormationT): HTMLElement[] {
  const seen = new Map<string, { p: Seat; n: number }>();
  for (const p of f.positions) {
    const key = `${p.name}|${JSON.stringify(p.stats ?? [])}|${(p.statuses ?? []).join(",")}`;
    const s = seen.get(key);
    if (s) s.n++;
    else seen.set(key, { p, n: 1 });
  }
  return [...seen.values()].map(({ p, n }) => h("div", { class: "seat" },
    h("div", { class: "line wrap small" }, h("span", { class: "nowrap" }, `${p.name.toUpperCase()}${n > 1 ? ` ×${n}` : ""}`), ...codeSpans(p.stats)),
    ...(p.statuses ?? []).map((s) => h("div", { class: "text dim small wrap seat-text" }, c.statuses.get(s)?.text ?? ""))));
}
/** Seats whose statuses say what they do, as "PACER: When each fight starts, the others are Hasted." (the party screens). */
export function seatNotes(f: FormationT): string {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of f.positions) for (const s of p.statuses ?? []) {
    if (seen.has(s)) continue;
    seen.add(s);
    out.push(`${p.name.toUpperCase()}: ${c.statuses.get(s)?.text ?? ""}`);
  }
  return out.join(" ");
}

// ─── Amounts and timings ───

/** "(125% MAG)". */
export function scaleEl(scales: Scale[]): Child {
  if (!scales.length) return null;
  return h("span", { class: "scale" }, `(${scales.map((s) => s.text).join(", ")})`);
}
/** An ability's size: "150 MAGICAL (125% MAG) + 10 BURN (MAG)". */
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
/** A timing in words, as the director asked: "CD 8", "CAST 3". */
const timing = (label: string, n: string) => h("span", { class: "nowrap" }, `${label} ${n}`);
/** The sheets' ability icons: between the font's size and double it. */
const ICON_SCALE = 1.5;

/**
 * What a weapon's basic attack is, worked out for a unit: its look (`ref`, the weapon's gear id or "enemy:<id>", picks
 * its icon), its damage type, how often, whether it takes both hands, what it hits for and what it grows with.
 */
export function weaponParts(wp: WeaponT, stats: Stats | null, ref?: string): { tag: string; word: string; tone: string; cooldown: number; hands: 1 | 2; value: string | null; scales: Scale[] } {
  const r = resolveWeapon(c, wp);
  const value = stats ? `${wp.hits && wp.hits > 1 ? `${wp.hits}×` : ""}${disp(evalNum(wp.amount, stats).value)}` : null;
  return { tag: ref ? weaponLook(ref) : r.type, word: TYPE_WORD[r.type], tone: TYPE_TONE[r.type], cooldown: r.cooldown, hands: r.hands, value, scales: scalesOf(wp.amount) };
}
/** A weapon's hit and type, what the hit grows with, how often, and 2H when it takes both hands: "33 PHYSICAL", "(23% ATK)", "CD 8", "2H"; each part kept whole when the line wraps. */
export function weaponCode(g: GearT, stats: Stats | null): Child[] {
  if (!g.weapon) return [];
  const w = weaponParts(g.weapon, stats, g.id);
  return [h("span", { class: "wcode" }, w.value ? h("span", { class: "ink" }, w.value) : null, h("span", { class: w.tone }, w.word)), scaleEl(w.scales), timing("CD", tk(w.cooldown)), w.hands === 2 ? h("span", { class: "nowrap" }, "2H") : null];
}
/**
 * A piece's card beyond its numbers (step 5i): the piece's own text for anything above common (its effect, in the content's
 * words); a common piece's text only restates its codes. Before rarities, a powerful piece's sentence.
 */
export function gearEffect(g: GearT): string | null {
  if (g.rarity) return g.rarity === "common" ? null : g.text;
  return g.tier === "powerful" ? g.text : null;
}

/** The rarities' colours, the same everywhere a rarity shows: uncommon green, rare blue, legendary gold, mythic crimson. */
export const RARITY_TONE: Record<string, string> = { common: "", uncommon: "good", rare: "buff", legendary: "gold", mythic: "mythic" };
/** A piece's colour, by its rarity (mythic crimson, the director's pick); a piece with none, gold when powerful. */
export const pieceTone = (g: GearT) => (g.rarity ? RARITY_TONE[g.rarity] : g.mythic ? "mythic" : g.tier === "powerful" ? "gold" : "");
/** A ★ before a legendary or mythic piece's name. */
const starred = (g: GearT) => (g.rarity ? g.rarity === "legendary" || g.rarity === "mythic" : g.tier === "powerful");

/** A piece's kind in words (step 5i, on every card): its weapon kind, armor type or offhand kind, or AMULET. */
export function kindName(g: GearT): string {
  if (g.slot === "weapon") return g.weapon?.kind ? kindOf(g.weapon.kind).name : "weapon";
  if (g.slot === "armor") return g.armor ? armorName(g.armor) : "armor";
  if (g.slot === "offhand") return g.offhand ? offhandName(g.offhand) : "offhand";
  return "amulet";
}
/**
 * Who can wear a piece (step 5i, on every card): FITS, then the members of `roster` who can, then every other class that can,
 * dimmed; EVERYONE for an amulet; a mythic names its one class. When nobody in the roster can, it says so first, in the
 * debuffs' colour.
 */
export function wearersLine(g: GearT, roster: readonly string[]): HTMLElement {
  const all = c.pack.classes.filter((k) => canEquip(k, g)).map((k) => k.id);
  if (!g.mythic && all.length === c.pack.classes.length) return h("div", { class: "line wrap small who" }, h("span", { class: "dim" }, "FITS EVERYONE"));
  const mine = roster.filter((id) => all.includes(id)), rest = all.filter((id) => !roster.includes(id));
  const names = (ids: string[], tone: string) => (ids.length ? [h("span", { class: tone }, ids.map(shortName).join(", "))] : []);
  return h("div", { class: "line wrap small who" },
    mine.length ? h("span", { class: "dim" }, "FITS") : h("span", { class: "debuff" }, "NOBODY YET ·"),
    ...names(mine, g.mythic ? "mythic" : "ink"), mine.length && rest.length ? h("span", { class: "dim" }, "·") : null, ...names(rest, "dim"));
}

/** A slot that can't be filled: the offhand under a two-handed weapon (step 5j). */
export function lockedRow(slot: string): HTMLElement {
  return h("div", { class: "gear-row locked" }, h("span", { class: "art" }, iconEl(SLOT_ICON[slot] ?? TAG_ICON.physical)), h("div", { class: "grow trunc" }, h("div", { class: "line" }, h("span", { class: "dim" }, slot.toUpperCase())), h("div", { class: "line small dim" }, "LOCKED")));
}
/** Is the weapon this gear holds two-handed? Then the offhand reads locked. */
export const twoHanded = (gear: Record<string, string | undefined>) => !!gear.weapon && handsOf(c.pack, c.gear.get(gear.weapon)) === 2;

/**
 * A piece of gear as a card: its sprite or icon (glowing in its rarity's colour), its name (★ legendary or mythic, in the
 * rarity's colour), then its rarity and kind with a weapon's hit and speed and the stat codes; with `who`, the line of who
 * can wear it, the roster first (step 5i); then what it does, in the content's words.
 */
export function gearRow(g: GearT | null, slot: string, stats: Stats | null, onClick?: () => void, arrow = true, who?: readonly string[]): HTMLElement {
  const slotName = h("span", { class: "dim" }, slot.toUpperCase());
  if (!g) return h("div", { class: "gear-row", onClick }, h("span", { class: "art" }, iconEl(SLOT_ICON[slot] ?? TAG_ICON.physical)), h("div", { class: "grow trunc" }, h("div", { class: "line" }, slotName), h("div", { class: "line small dim" }, "NOTHING")), onClick && arrow ? h("span", { class: "dim" }, "▶") : null);
  const art = (g.slot === "weapon" ? weaponEl(g.id) : null) ?? iconEl(gearIcon(g));
  const tone = pieceTone(g);
  const rare = g.rarity && g.rarity !== "common" ? g.rarity : null;
  // Everything wraps: a long name, a weapon's hit and its codes, the card's sentence.
  const effect = gearEffect(g);
  return h("div", { class: "gear-row", onClick },
    h("span", { class: `art${rare ? ` glow-${rare}` : ""}` }, art),
    h("div", { class: "grow" },
      h("div", { class: "line wrap name" }, h("span", { class: tone }, `${starred(g) ? "★" : ""}${g.name.toUpperCase()}`)),
      h("div", { class: "line wrap small codes" }, rare ? h("span", { class: `nowrap ${tone}` }, rare.toUpperCase()) : null, h("span", { class: "nowrap" }, kindName(g).toUpperCase()), ...(g.weapon ? weaponCode(g, stats) : []), ...codeSpans(g.stats)),
      who ? wearersLine(g, who) : null,
      effect ? h("div", { class: `text small wrap ${tone === "gold" || tone === "mythic" ? tone : "ink"} effect` }, effect) : null,
    ),
    onClick && arrow ? h("span", { class: "dim go" }, "▶") : null,
  );
}

/**
 * An ability card: the slot number to tap, the icon (shaded until it first comes round, the ticks in its corner), the
 * name in its damage type's colour (magical violet, heals green), the MP, cooldown and wind-up ("CAST") in words and whole numbers; the documents' sentence; and
 * its size for this unit with what it grows with. In designer view, the target and every effect in words.
 */
export function abilityBlock(a: AbilityT, stats: Stats | null, designer: boolean, opts: { n?: number; onN?: () => void; cur?: boolean; target?: boolean; dmgMult?: number; opening?: boolean } = {}): HTMLElement {
  const i = abilityInfo(a, stats);
  const tag = abilityTag(a);
  // Step 5c: an ability starts a fight charged by its slot (ruleset.opening.slots), so its first use is part of the plan.
  const head0 = opts.n !== undefined && opts.opening !== false ? headStart(c.pack.ruleset.opening, i.cooldown, opts.n - 1) : undefined;
  const first = head0 !== undefined ? Math.max(0, i.cooldown - head0) : 0;
  const head = h("div", { class: "head" },
    // With another number picked, this one pulses: it's where the next tap goes.
    opts.n !== undefined ? h("span", { class: `n${opts.target ? " target" : ""}`, onClick: opts.onN }, String(opts.n)) : null,
    h("span", { class: "pip" }, pipEl(actionIconOf(tag, a.id), first, i.cooldown, ICON_SCALE)),
    h("div", { class: "grow" },
      h("div", { class: `trunc ${damageTypeOf(a) === "magical" ? "magic" : tag === "heal" || tag === "revive" || tag === "cleanse" ? "good" : ""}` }, i.name.toUpperCase()),
      h("div", { class: "cost" },
        i.mp ? h("span", { class: "mp" }, `MP ${disp(i.mp)}`) : null,
        timing("CD", tk(i.cooldown)),
        i.cast ? timing("CAST", tk(i.cast)) : null,
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

/** The basic attack a weapon gives, worked out for a unit's stats: type, cooldown, hit, what it grows with; `ref` gives its look. */
export function basicLine(wp: WeaponT, stats: Stats | null, opts: { mult?: number; slot?: boolean; ref?: string } = {}): HTMLElement {
  const w = weaponParts(wp, stats, opts.ref);
  const value = stats && opts.mult && opts.mult !== 1 ? `${wp.hits && wp.hits > 1 ? `${wp.hits}×` : ""}${disp(evalNum(wp.amount, stats).value * opts.mult)}` : w.value;
  return h("div", { class: "ab" },
    h("div", { class: "head" }, opts.slot === false ? null : h("span", { class: "n dim" }, "·"), h("span", { class: "pip" }, iconEl(TAG_ICON[w.tag] ?? TAG_ICON.physical, ICON_SCALE)),
      h("div", { class: "grow" }, h("div", null, "ATTACK"), h("div", { class: "cost" }, timing("CD", tk(w.cooldown))))),
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
/**
 * A class's passive: its own, or the Valkyrie's Einherjar. Step 5i: `form`, the status a trained passive plays as (a
 * version's name, "+" for the power step), shown in its place under the passive's icon.
 */
export function classPassive(id: string, designer = false, form?: string): Child[] {
  const k = cls(id);
  const st = k.passive?.statuses?.[0];
  const fd = form && form !== st ? c.statuses.get(form) : undefined;
  if (fd) return passiveBlock(fd.name, fd.text ?? "", st, designer ? statusText(fd).slice(1).join(" ") : null);
  if (!k.passive) return passiveBlock("Einherjar", "Allies it revives come back with every action ready.", null);
  return passiveBlock(k.passive.name, k.passive.text, st, designer && st ? statusText(status(st)).slice(1).join(" ") : null);
}

/** What a class can carry: its weapon kinds (2H for a two-handed one), its armor types and its offhand kinds. */
export const canUse = (id: string) => {
  const k = cls(id);
  const kinds = k.weapons.map((w) => `${kindOf(w).name}${kindOf(w).hands === 2 ? " 2H" : ""}`);
  return h("div", { class: "text small dim up wrap", style: "margin-top:.25rem" }, `${kinds.join(", ")} · ${k.armor.map(armorName).join(", ")} · ${k.offhands.map(offhandName).join(", ")}`);
};

/** Everything about a class, with its current build, read-only: for a fight's inspect window. */
export function classSheet(id: string, designer: boolean, member: Member = memberFor(id), gear: Record<string, string> = gearFor(id), passive?: string): Child[] {
  const k = cls(id);
  const out: Child[] = [statGrid(member.stats, k.stats, designer)];
  const sp = specialLines(member.stats);
  if (sp.length) out.push(h("div", { class: "text up small wrap" }, ...sp.flatMap((s, i) => (i ? [" · ", s] : [s]))));
  out.push(section("PASSIVE"), ...classPassive(id, designer, passive));
  out.push(section("GEAR"));
  for (const slot of SLOTS) out.push(slot === "offhand" && twoHanded(gear) ? lockedRow(slot) : gearRow(gear[slot] ? c.gear.get(gear[slot]) ?? null : null, slot, member.stats, undefined, false));
  out.push(section("ABILITIES"));
  // In a fight the rows show each cooldown live: the sheet's icons stay plain.
  member.abilities.forEach((a, i) => out.push(abilityBlock(c.abilities.get(a)!, member.stats, designer, { n: i + 1, opening: false })));
  out.push(basicLine(weaponOf(c, member.weapon), member.stats, { ref: member.weapon }));
  return out;
}

// ─── Enemies ───

/** An enemy's stats with the defaults filled in. */
export const enemyStats = (e: EnemyT): Stats => ({ ...Object.fromEntries(c.pack.stats.map((s) => [s.id, s.default])), ...e.stats });

/** What a foe hits with: its attack's damage type and every type its abilities deal, in words and their colours ("PHYSICAL · MAGICAL"). */
export function hitsWith(e: EnemyT): Child[] {
  const types = new Set<"physical" | "magical">([resolveWeapon(c, e.weapon ?? c.pack.ruleset.unarmed).type]);
  for (const a of e.abilities ?? []) for (const d of c.abilities.get(a)!.do) if (d.op === "damage" && d.type !== "none") types.add(d.type);
  const order = (["physical", "magical"] as const).filter((t) => types.has(t));
  return order.flatMap((t, i) => [i ? h("span", { class: "dim" }, "·") : null, h("span", { class: `nowrap ${TYPE_TONE[t]}` }, TYPE_WORD[t])]);
}
/** The enemy stats a player reads: how much HP, how hard it hits each way, how much Armor and Magic resist. */
export const ENEMY_STATS = ["max_hp", "attack", "magic", "armor", "magic_resist"] as const;

/**
 * Everything about an enemy, for the bestiary and a fight's inspect window: its line, its stats (`live` for a fight's
 * unit, with the run's changes) with its Magic resist, what it hits with, what it can't be given, its passives and
 * its actions with their sizes. `power` is a fight's damage change, in percent.
 */
export function enemySheet(e: EnemyT, designer: boolean, live?: Stats, power = 0): Child[] {
  const stats = live ?? enemyStats(e);
  const mult = 1 + power / 100;
  const out: Child[] = [];
  if (e.text) out.push(h("div", { class: "text dim wrap small", style: "margin-bottom:.375rem" }, e.text));
  // A fight's foe has its HP just above, live: the grid leaves it out.
  out.push(statGrid(stats, null, designer, live ? ENEMY_STATS.slice(1) : ENEMY_STATS));
  out.push(h("div", { class: "line wrap small" }, h("span", { class: "dim" }, "HITS WITH"), ...hitsWith(e)));
  const immune = Object.entries(stats).filter(([k, v]) => k.startsWith("immune:") && v).map(([k]) => immuneTo(k));
  if (immune.length) out.push(h("div", { class: "line wrap small" }, h("span", { class: "dim" }, "IMMUNE TO"), ...immune.map((s) => h("span", { class: "nowrap" }, c.statuses.has(s) ? statusEl(s) : null, ` ${(c.statuses.get(s)?.name ?? s).toUpperCase()}`))));
  if (e.statuses?.length) {
    out.push(section("PASSIVES"));
    for (const s of e.statuses) {
      const d = status(s);
      out.push(...passiveBlock(d.name, designer ? statusText(d).join(" ") : d.text ?? "", s));
    }
  }
  out.push(section("ACTIONS"));
  out.push(basicLine(e.weapon ?? c.pack.ruleset.unarmed, stats, { mult, slot: false, ref: e.weapon ? `enemy:${e.id}` : "unarmed" }));
  for (const a of e.abilities ?? []) out.push(abilityBlock(c.abilities.get(a)!, stats, designer, { dmgMult: mult }));
  if (designer) out.push(section("HIDDEN STATS"), statGrid(stats, null, true, ["max_mp", "mp_regen", "crit_chance", "aggro"]));
  return out;
}
