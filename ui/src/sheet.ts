/**
 * Unit sheets: the pieces that show a class or an enemy (stats, passive,
 * abilities, gear), shared by the class screen, the gear screen, the bestiary
 * and the battle's inspect panel.
 */
import type { AbilityT, EnemyT, GearT } from "../../src/schema.js";
import { combat, type Member } from "../../src/engine/combat/rules.js";
import { weaponOf } from "../../src/engine/combat/fight.js";
import { c, cls, disp, elementName, kindOf, SHEET_STATS, SPECIAL_STATS, showStat, status } from "./content.js";
import { abilityInfo, castWord, cooldownWord, statusText, ticks, weaponInfo, type Stats } from "./describe.js";
import { ARMOR_ICON, AMULET_ICON, ELEMENT_ICON_COL, iconStyle, image, manifest, poseRect, url, WEAPON_ICON, type Pose } from "./art.js";
import { h, type Child } from "./dom.js";
import { party, setup, soloParty } from "./state.js";

/** The class's unit with its gear, formation slot and passive applied: what it brings to a fight. */
export function memberFor(id: string): Member {
  const inParty = setup.party.includes(id);
  const p = inParty ? party() : soloParty(id);
  const members = combat.party(c, { dungeon: c.pack.progression.dungeonOrder[0], party: p, seed: 1 }) as Member[];
  return members.find((m) => m.ref === id)!;
}

export function portrait(id: string, pose: Pose = "wait", scale = 0.5): HTMLElement {
  const sheet = image(manifest.classes[id]);
  const el = h("div", { class: `portrait${scale >= 1 ? " big" : ""}` });
  if (!sheet) return el;
  const [sx, sy, fw, fh] = poseRect(sheet, pose, 0);
  el.style.width = `${fw * scale}px`;
  el.style.height = `${fh * scale}px`;
  el.style.backgroundImage = `url(${url(manifest.classes[id])})`;
  el.style.backgroundSize = `${sheet.width * scale}px ${sheet.height * scale}px`;
  el.style.backgroundPosition = `${-sx * scale}px ${-sy * scale}px`;
  el.style.transform = "scaleX(-1)";
  return el;
}

export function enemyImage(ref: string, height = 56): HTMLElement {
  const art = manifest.enemies[ref];
  if (!art) return h("span", { class: "muted" }, "?");
  return h("img", { class: "enemy-thumb sprite", src: url(art.file), style: `height:${height}px` });
}

export function statusIcon(id: string, small = false): HTMLElement {
  const file = manifest.statuses[id];
  const d = c.statuses.get(id);
  if (!file) return h("span", { class: "tag" }, d?.name ?? id);
  return h("img", { class: `status-icon${small ? " sm" : ""}`, src: url(file), title: d ? `${d.name}: ${d.text ?? ""}` : id, alt: d?.name ?? id });
}

export const icon = (ref: [number, number], scale = 1) => h("span", { style: iconStyle(ref, scale) });
export const elementIcon = (el: string) => icon([ELEMENT_ICON_COL[el] ?? 0, 9]);
export const gearIcon = (g: GearT) => (g.slot === "weapon" ? icon(WEAPON_ICON[g.weapon?.kind ?? "sword"] ?? [8, 25]) : g.slot === "armor" ? icon(ARMOR_ICON[g.weight ?? "light"]) : icon(AMULET_ICON));

export function pips(n: number, max = 5): HTMLElement {
  const full = Math.max(0, Math.min(max, Math.round(n)));
  return h("span", { class: "pips" }, "●".repeat(full), h("span", { class: "off" }, "○".repeat(Math.max(0, max - full))), n > max ? ` +${Math.round(n - max)}` : "");
}

/** The stats table: final value, with the class's base in pips, and anything gear or the slot changed marked. */
export function statsTable(stats: Stats, base: Stats | null, opts: { pips?: boolean } = {}): HTMLElement {
  const rows: Child[] = [];
  for (const s of SHEET_STATS) {
    const v = stats[s.key] ?? 0;
    const b = base?.[s.key];
    const changed = b !== undefined && v !== b;
    rows.push(
      h("tr", null,
        h("td", null, s.name),
        h("td", { class: "num", style: changed ? `color:${v > (b ?? 0) ? "var(--good)" : "var(--bad)"}` : "" }, showStat(s.key, v, s.kind)),
        opts.pips && b !== undefined ? h("td", null, pips(s.key === "crit_chance" ? b / 5 : b / 1000)) : null,
      ),
    );
  }
  const specials = SPECIAL_STATS.filter((s) => (stats[s.key] ?? 0) !== (c.stats.get(s.key)?.default ?? 0));
  for (const s of specials) rows.push(h("tr", null, h("td", { class: "muted" }, s.name), h("td", { class: "num" }, showStat(s.key, stats[s.key], s.kind)), opts.pips ? h("td") : null));
  for (const [k, v] of Object.entries(stats)) {
    if (!k.startsWith("resist:") || !v) continue;
    rows.push(h("tr", null, h("td", { class: "muted" }, `${elementName(k.slice(7))} resist`), h("td", { class: "num", style: `color:${v > 0 ? "var(--good)" : "var(--bad)"}` }, `${v > 0 ? "+" : ""}${v}%${v >= 100 ? (v > 100 ? " (absorbs)" : " (immune)") : v <= -50 ? " (weak)" : ""}`), opts.pips ? h("td") : null));
    }
  if (stats.resist) rows.push(h("tr", null, h("td", { class: "muted" }, "All elements resist"), h("td", { class: "num" }, `${stats.resist}%`), opts.pips ? h("td") : null));
  if (stats["immune:dispel"]) rows.push(h("tr", null, h("td", { class: "muted" }, "Immune to Dispel"), h("td", { class: "num" }, "yes"), opts.pips ? h("td") : null));
  return h("table", { class: "stats" }, h("tbody", null, rows));
}

export function abilityBlock(a: AbilityT, stats: Stats | null, extra?: Child): HTMLElement {
  const i = abilityInfo(a, stats);
  return h("div", { class: "ability" },
    h("div", { class: "name" }, i.name, " ", h("span", { class: "muted small" }, i.text)),
    h("div", { class: "timing" }, `Cooldown ${i.cooldown}t (${cooldownWord(i.cooldown)}) · Wind-up ${i.cast}t (${castWord(i.cast)}) · ${disp(i.mp)} MP · recovery ${ticks(i.recovery)}${i.seek ? " · Seek" : ""}`),
    h("div", { class: "small" }, "Target: ", i.target, i.waits ? h("span", { class: "muted" }, ` · ${i.waits}`) : null),
    ...i.effects.map((e) => h("div", { class: "small" }, "→ ", e)),
    extra ?? null,
  );
}

export function weaponBlock(member: Pick<Member, "weapon" | "stats">): HTMLElement {
  const wp = weaponOf(c, member.weapon);
  const w = weaponInfo(wp, member.stats);
  return h("div", { class: "ability" },
    h("div", { class: "name" }, "Basic attack ", h("span", { class: "muted small" }, `${w.kind}, ${w.type === "magical" ? elementName(w.element ?? "") : w.subtype}`)),
    h("div", { class: "timing" }, `Every ${w.cooldown}t · Wind-up ${w.cast}t (${castWord(w.cast)}) · no MP`),
    h("div", { class: "small" }, "Target: a random foe · hit ", w.hit),
  );
}

export function passiveBlock(id: string): HTMLElement | null {
  const k = cls(id);
  if (!k.passive) return null;
  const st = k.passive.statuses?.[0];
  return h("div", { class: "ability" },
    h("div", { class: "name" }, st ? statusIcon(st, true) : null, " Passive: ", k.passive.name, " ", h("span", { class: "muted small" }, k.passive.text)),
    st ? h("div", { class: "small muted" }, statusText(status(st)).slice(1).join(" ")) : null,
  );
}

export function statusBlock(id: string, extra?: Child): HTMLElement {
  const d = status(id);
  return h("div", { class: "ability" },
    h("div", { class: "name" }, statusIcon(id, true), " ", d.name, " ", h("span", { class: `tag ${d.label}` }, d.label), extra ?? null),
    ...statusText(d).map((t) => h("div", { class: "small" }, t)),
  );
}

/** Everything about a class, with its current build. */
export function classSheet(id: string, member: Member = memberFor(id)): HTMLElement {
  const k = cls(id);
  const gear = Object.entries(member.flat).length ? null : null;
  void gear;
  const slotName = (() => {
    const f = c.formations.get(setup.party.includes(id) ? setup.formation : c.pack.starter.formations[0])!;
    const i = setup.party.indexOf(id);
    return i >= 0 ? `${f.name}: ${f.positions[i].name}` : "not in the party";
  })();
  return h("div", { class: "row" },
    h("div", { class: "col", style: "flex: 0 0 300px" },
      h("div", { class: "panel" },
        h("div", { class: "row", style: "align-items:center" }, portrait(id, "wait", 1), h("div", null, h("h2", null, k.name), h("div", { class: "muted small" }, k.text))),
        h("div", { class: "small", style: "margin-top:6px" }, "Weapons: ", k.weapons.map((w) => kindOf(w).name).join(", "), " · Armor: ", k.armor, " · Slot: ", slotName),
      ),
      h("div", { class: "panel" }, h("h3", null, "Stats"), statsTable(member.stats, k.stats, { pips: true }), h("div", { class: "muted small", style: "margin-top:4px" }, "Pips are the class's base on the documents' 1–5 scale; the number is the fight value with gear and formation slot, at 100 per point.")),
    ),
    h("div", { class: "col", style: "flex: 1; min-width: 360px" },
      h("div", { class: "panel" }, h("h3", null, "Kit"), passiveBlock(id), weaponBlock(member), ...k.abilities.map((a) => abilityBlock(c.abilities.get(a)!, member.stats))),
    ),
  );
}

/** Everything about an enemy, for the bestiary and the designer's inspect panel. */
export function enemySheet(e: EnemyT, designer: boolean): HTMLElement {
  const stats = { ...Object.fromEntries(c.pack.stats.map((s) => [s.id, s.default])), ...e.stats };
  const wp = e.weapon ?? c.pack.ruleset.unarmed;
  const w = weaponInfo(wp, stats);
  const basicText = `${w.kind}, ${w.type === "magical" ? elementName(w.element ?? "") : w.subtype}: ${w.hit}, every ${w.cooldown}t${w.cast ? `, wind-up ${w.cast}t (${castWord(w.cast)})` : ""}`;
  const abilityRow = (a: string) => {
    const ab = c.abilities.get(a)!;
    return designer ? abilityBlock(ab, stats) : h("div", { class: "ability" }, h("div", { class: "name" }, ab.name, " ", h("span", { class: "muted small" }, ab.text)));
  };
  return h("div", { class: "col" },
    designer ? h("div", null, h("h3", null, "Stats (hidden from players)"), statsTable(stats, null)) : h("div", { class: "muted small" }, "Enemy stats are hidden. Watch the fight."),
    h("div", null, h("h3", null, "Behaviour"),
      ...(e.statuses ?? []).map((s) => statusBlock(s)),
      designer ? h("div", { class: "ability" }, h("div", { class: "name" }, "Basic attack ", h("span", { class: "muted small" }, basicText))) : null,
      ...(e.abilities ?? []).map(abilityRow),
    ),
  );
}
