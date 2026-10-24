/**
 * The menus: where to fight, who goes, in what formation, with what gear, and
 * the class sheets and bestiary. Each screen is a function that renders into
 * the app's content area; `go` switches screens.
 */
import { gearFor as gearThatFits } from "../../src/sim/parties.js";
import { c, classes, dungeons, enemies, formations, gearOf, singleFights, disp, SHEET_STATS, kindOf, elementName } from "./content.js";
import { enemyDisplayName, manifest } from "./art.js";
import { button, clear, h, type Child } from "./dom.js";
import { abilitiesFor, classIds, gearFor, reset, save, setup } from "./state.js";
import { classSheet, enemyImage, enemySheet, gearIcon, memberFor, portrait, statsTable, statusIcon } from "./sheet.js";
import { statWord } from "./describe.js";
import { startBattle } from "./battle/battle.js";

export type Screen = "home" | "party" | "formation" | "gear" | "classes" | "bestiary" | "settings" | "battle";
let current: Screen = "home";
let content: HTMLElement;
let navEl: HTMLElement;

export function mount(app: HTMLElement) {
  navEl = h("div", { class: "nav" });
  content = h("div", { class: "screen" });
  app.append(navEl, content);
  go("home");
}

export function go(s: Screen, arg?: unknown) {
  current = s;
  renderNav();
  clear(content);
  content.className = s === "battle" ? "screen battle-screen" : "screen";
  content.style.padding = s === "battle" ? "0" : "";
  const screens: Record<Screen, (arg?: unknown) => HTMLElement> = { home, party, formation, gear, classes: classesScreen, bestiary, settings, battle: () => h("div") };
  if (s === "battle") startBattle(content, arg as Parameters<typeof startBattle>[1]);
  else content.append(screens[s](arg));
}

function renderNav() {
  clear(navEl);
  const items: [Screen, string][] = [["home", "Fight"], ["party", "Party"], ["formation", "Formation"], ["gear", "Gear"], ["classes", "Classes"], ["bestiary", "Bestiary"], ["settings", "Settings"]];
  navEl.append(h("span", { class: "title" }, "MEMORY DUNGEON"));
  for (const [s, label] of items) navEl.append(button(label, () => go(s), current === s ? "active" : ""));
  navEl.append(h("span", { class: "spacer" }), h("span", { class: "muted small" }, `Party: ${setup.party.map((id) => c.classes.get(id)!.name).join(", ") || "nobody"} · ${c.formations.get(setup.formation)!.name}`));
}

// ─── Home: pick a run or a single fight ───
function home(): HTMLElement {
  const partyOk = setup.party.length >= 1;
  const seedRow = h("div", { class: "row", style: "align-items:center" },
    "Seed ",
    h("input", { type: "number", value: setup.seed, style: "width:100px", onChange: (e: Event) => { setup.seed = Number((e.target as HTMLInputElement).value) || 1; save(); } }),
    button("Random", () => { setup.seed = Math.floor(Math.random() * 100000) + 1; save(); go("home"); }, "small"),
    h("span", { class: "muted small" }, "The same seed replays the same luck."),
  );
  const partyPanel = h("div", { class: "panel" },
    h("h3", null, "Your party"),
    h("div", { class: "row" }, ...setup.party.map((id) => h("div", { style: "text-align:center" }, portrait(id), h("div", { class: "small" }, c.classes.get(id)!.name)))),
    h("div", { class: "muted small" }, `${c.formations.get(setup.formation)!.name} formation. `, setup.party.length < 3 ? h("span", { class: "warn" }, "Parties are meant to be 3.") : null),
    seedRow,
  );
  const runs = h("div", { class: "grid cols-2" }, ...dungeons.map((d) => h("div", { class: "panel" },
    h("div", { class: "row", style: "justify-content:space-between;align-items:center" }, h("h3", null, d.name), button("Run it", () => go("battle", { dungeon: d.id }), "primary")),
    h("div", { class: "muted small" }, d.text),
    h("div", { class: "list", style: "margin-top:6px" }, ...d.stages.map((s, i) => s.kind === "fight" ? h("div", { class: "row", style: "align-items:center;gap:6px" },
      h("span", { class: "muted small", style: "width:22px" }, `${i + 1}.`),
      h("span", { style: "width:170px" }, s.name ?? s.id, s.boss ? h("span", { class: "tag", style: "margin-left:4px;background:#6a2030" }, "boss") : null),
      ...countEnemies(s.enemies).map(([ref, n]) => h("span", { class: "small", title: enemyDisplayName(ref) }, enemyImage(ref, 36), n > 1 ? ` ×${n}` : "")),
      h("span", { class: "spacer", style: "flex:1" }),
      button("Fight only this", () => go("battle", { dungeon: `${d.id}~${s.id}` }), "small"),
    ) : null)),
  )));
  return h("div", { class: "col" },
    h("div", { class: "row" }, partyPanel, h("div", { class: "panel", style: "flex:1" }, h("h3", null, "How a run works"), h("div", { class: "small" }, "Fights run on their own: each unit uses the first of its abilities that's ready, in the order you slotted them, and otherwise its basic attack. HP, MP and knockouts carry from fight to fight; nothing heals between fights. A run ends when the party falls or the boss does. Losing costs nothing: retry with a different build."))),
    partyOk ? runs : h("div", { class: "panel warn" }, "Pick at least one class in Party."),
    h("div", { class: "muted small" }, `${singleFights.length} encounters across ${dungeons.length} runs.`),
  );
}

function countEnemies(ids: string[]): [string, number][] {
  const m = new Map<string, number>();
  for (const id of ids) m.set(id, (m.get(id) ?? 0) + 1);
  return [...m];
}

// ─── Party: pick up to 3 classes; the order is the formation slot order ───
function party(): HTMLElement {
  const render = () => { clear(content); content.append(party()); renderNav(); };
  const chosen = h("div", { class: "row", style: "align-items:flex-start" },
    ...[0, 1, 2].map((i) => {
      const id = setup.party[i];
      return h("div", { class: `slot${id ? " filled" : ""}`, style: "width:160px" },
        h("div", { class: "muted small" }, `Slot ${i + 1}: ${c.formations.get(setup.formation)!.positions[i].name}`),
        id ? portrait(id) : h("div", { class: "muted", style: "padding:20px" }, "empty"),
        id ? h("div", null, c.classes.get(id)!.name) : null,
        id ? h("div", { class: "row", style: "gap:4px" },
          i > 0 ? button("◀", () => { [setup.party[i - 1], setup.party[i]] = [setup.party[i], setup.party[i - 1]]; save(); render(); }, "small") : null,
          i < setup.party.length - 1 ? button("▶", () => { [setup.party[i + 1], setup.party[i]] = [setup.party[i], setup.party[i + 1]]; save(); render(); }, "small") : null,
          button("✕", () => { setup.party.splice(i, 1); save(); render(); }, "small"),
        ) : null,
      );
    }),
  );
  const cards = h("div", { class: "grid cols-4" }, ...classes.map((k) => {
    const inParty = setup.party.includes(k.id);
    return h("div", { class: `card${inParty ? " selected" : ""}`, onClick: () => {
      if (inParty) setup.party = setup.party.filter((x) => x !== k.id);
      else if (setup.party.length < 3) setup.party.push(k.id);
      else return;
      save(); render();
    } },
      h("div", { class: "row", style: "align-items:center;gap:8px" }, portrait(k.id), h("div", null, h("div", { style: "font-weight:700" }, k.name, k.source === "starter" ? h("span", { class: "tag", style: "margin-left:6px" }, "starter") : null), h("div", { class: "muted small" }, k.text.split(".")[0], "."))),
      h("div", { class: "small", style: "margin-top:4px" }, ...SHEET_STATS.slice(0, 6).map((s) => h("span", { class: "tag" }, `${s.name} ${disp(k.stats[s.key] ?? 0)}`))),
    );
  }));
  return h("div", { class: "col" },
    h("div", { class: "panel" }, h("h2", null, "Party"), h("div", { class: "muted small" }, "Pick up to three. The order is the slot order in the formation, which also breaks targeting ties."), chosen),
    cards,
  );
}

// ─── Formation ───
function formation(): HTMLElement {
  const render = () => { clear(content); content.append(formation()); renderNav(); };
  const f = c.formations.get(setup.formation)!;
  const lineX: Record<string, number> = { front: 330, middle: 200, back: 70 };
  const map = h("div", { class: "formation-map", style: "width:480px" },
    h("div", { class: "muted small", style: "position:absolute;left:8px;top:6px" }, "back"),
    h("div", { class: "muted small", style: "position:absolute;left:338px;top:6px" }, "front → enemies"),
    ...f.positions.map((p, i) => {
      const id = setup.party[i];
      return h("div", { class: "unit", style: `left:${lineX[p.layout.line]}px;top:${22 + p.layout.column * 92}px` },
        id ? portrait(id) : h("div", { class: "muted", style: "height:72px;line-height:72px" }, "empty"),
        h("div", null, h("b", null, p.name), id ? ` · ${c.classes.get(id)!.name}` : ""),
        h("div", { class: "muted" }, p.text ?? "no change"),
      );
    }),
  );
  const cards = h("div", { class: "grid cols-2" }, ...formations.map((fm) => h("div", { class: `card${fm.id === setup.formation ? " selected" : ""}`, onClick: () => { setup.formation = fm.id; save(); render(); } },
    h("div", { style: "font-weight:700" }, fm.name, fm.source === "starter" ? h("span", { class: "tag", style: "margin-left:6px" }, "starter") : null),
    h("div", { class: "muted small" }, fm.text),
    h("div", { class: "small", style: "margin-top:4px" }, ...fm.positions.map((p) => h("div", null, h("b", null, p.name), ": ", statChanges(p.stats) || "nothing"))),
    fm.statuses?.length ? h("div", { class: "small" }, h("b", null, "Effect: "), fm.statuses.map((s) => c.statuses.get(s)!.text).join(" ")) : null,
  )));
  return h("div", { class: "col" },
    h("div", { class: "row" },
      h("div", { class: "panel" }, h("h2", null, f.name), h("div", { class: "muted small" }, f.text), map, h("div", { class: "muted small", style: "margin-top:6px" }, "Slots change numbers only; there's no battlefield geometry. Reorder the party in the Party screen to move units between slots.")),
      h("div", { class: "panel", style: "flex:1" }, h("h3", null, "Party stats in this formation"), ...setup.party.map((id) => {
        const m = memberFor(id);
        return h("div", { class: "row", style: "align-items:center;gap:8px;margin-bottom:4px" }, portrait(id, "wait", 0.35), h("b", { style: "width:120px" }, c.classes.get(id)!.name), h("span", { class: "small" }, ...SHEET_STATS.map((s) => h("span", { class: "tag" }, `${s.name} ${s.kind === "percent" ? `${m.stats[s.key]}%` : disp(m.stats[s.key])}`))));
      })),
    ),
    cards,
  );
}

export function statChanges(stats: { stat: string; flat?: number; pct?: number }[] | undefined): string {
  if (!stats?.length) return "";
  return stats.map((s) => {
    const def = c.stats.get(s.stat);
    const pts = def?.kind === "points";
    const v = s.flat ?? 0;
    const shown = s.stat === "crit_chance" ? `${v >= 0 ? "+" : ""}${v}%` : pts ? `${v >= 0 ? "+" : ""}${v}${s.stat.startsWith("resist") || ["evasion", "accuracy", "lifesteal", "siphon", "double_strike", "crit_multiplier"].includes(s.stat) ? "%" : ""}` : `${v >= 0 ? "+" : ""}${disp(v)}`;
    return `${statWord(s.stat)} ${shown}${s.pct ? ` (${s.pct > 0 ? "+" : ""}${s.pct}%)` : ""}`;
  }).join(", ");
}

// ─── Gear and ability order, per party member ───
let gearTab = 0;
function gear(): HTMLElement {
  if (!setup.party.length) return h("div", { class: "panel warn" }, "Pick a party first.");
  gearTab = Math.min(gearTab, setup.party.length - 1);
  const id = setup.party[gearTab];
  const render = () => { clear(content); content.append(gear()); };
  const tabs = h("div", { class: "row" }, ...setup.party.map((cid, i) => button(c.classes.get(cid)!.name, () => { gearTab = i; render(); }, i === gearTab ? "active" : "")));
  const current = gearFor(id);
  const slots = ["weapon", "armor", "amulet"] as const;
  const slotUI = slots.map((slot) => {
    const fits = gearThatFits(c, id, slot);
    const chosen = current[slot];
    const list = h("div", { class: "list", style: "max-height:420px;overflow:auto" },
      slot !== "weapon" ? h("div", { class: `card${!chosen ? " selected" : ""}`, onClick: () => { const g = { ...(setup.gear[id] ?? {}) }; delete g[slot]; setup.gear[id] = g; save(); render(); } }, h("i", { class: "muted" }, "nothing")) : null,
      ...fits.map((gid) => {
        const g = gearOf(gid);
        return h("div", { class: `card${chosen === gid ? " selected" : ""}`, onClick: () => { setup.gear[id] = { ...(setup.gear[id] ?? {}), [slot]: gid }; save(); render(); } },
          h("div", null, gearIcon(g), " ", h("b", null, g.name), " ", g.tier === "powerful" ? h("span", { class: "tag", style: "background:#6a4a10" }, "powerful") : null, g.source === "starter" ? h("span", { class: "tag" }, "plain") : null),
          h("div", { class: "muted small" }, g.text),
          h("div", { class: "small" }, gearLine(g)),
        );
      }),
    );
    return h("div", { class: "panel", style: "flex:1;min-width:260px" }, h("h3", null, slot[0].toUpperCase() + slot.slice(1)), list);
  });
  const member = memberFor(id);
  const order = abilitiesFor(id);
  const abilityOrder = h("div", { class: "panel" }, h("h3", null, "Ability order"), h("div", { class: "muted small" }, "In a fight the unit uses the first of these that's ready. Earlier wins ties."),
    ...order.map((a, i) => h("div", { class: "row", style: "align-items:center;gap:6px;margin:3px 0" },
      button("▲", () => { if (i > 0) { const o = [...order]; [o[i - 1], o[i]] = [o[i], o[i - 1]]; setup.abilities[id] = o; save(); render(); } }, "small"),
      button("▼", () => { if (i < order.length - 1) { const o = [...order]; [o[i + 1], o[i]] = [o[i], o[i + 1]]; setup.abilities[id] = o; save(); render(); } }, "small"),
      h("b", null, `${i + 1}. ${c.abilities.get(a)!.name}`), h("span", { class: "muted small" }, c.abilities.get(a)!.text),
    )),
  );
  return h("div", { class: "col" },
    h("div", { class: "panel" }, h("h2", null, "Gear"), tabs),
    h("div", { class: "row" }, ...slotUI),
    h("div", { class: "row" }, h("div", { class: "panel", style: "flex:0 0 320px" }, h("h3", null, `${c.classes.get(id)!.name} with this kit`), statsTable(member.stats, c.classes.get(id)!.stats, { pips: true })), h("div", { style: "flex:1" }, abilityOrder)),
  );
}

export function gearLine(g: { stats?: { stat: string; flat?: number; pct?: number }[]; weapon?: { kind?: string; amount: unknown } }): string {
  const parts: string[] = [];
  if (g.weapon?.kind) {
    const k = kindOf(g.weapon.kind);
    parts.push(`${k.name}: ${k.type === "magical" ? elementName(k.element ?? "") : k.subtype}, every ${k.cooldown}t`);
  }
  const s = statChanges(g.stats);
  if (s) parts.push(s);
  return parts.join(" · ");
}

// ─── Classes: a sheet each ───
let sheetClass = classIds[0];
function classesScreen(arg?: unknown): HTMLElement {
  if (typeof arg === "string" && c.classes.has(arg)) sheetClass = arg;
  const render = () => { clear(content); content.append(classesScreen()); };
  const tabs = h("div", { class: "row", style: "gap:4px" }, ...classes.map((k) => button(k.name, () => { sheetClass = k.id; render(); }, k.id === sheetClass ? "active small" : "small")));
  return h("div", { class: "col" }, h("div", { class: "panel" }, h("h2", null, "Classes"), tabs), classSheet(sheetClass));
}

// ─── Bestiary ───
let bestiaryPick = enemies[0].id;
function bestiary(): HTMLElement {
  const render = () => { clear(content); content.append(bestiary()); };
  const list = h("div", { class: "list", style: "width:240px;max-height:75vh;overflow:auto" }, ...enemies.map((e) => h("div", { class: `card${e.id === bestiaryPick ? " selected" : ""}`, style: "display:flex;align-items:center;gap:8px;padding:4px 8px", onClick: () => { bestiaryPick = e.id; render(); } },
    enemyImage(e.id, 40), h("div", null, h("div", null, enemyDisplayName(e.id)), h("div", { class: "muted small" }, e.rank)))));
  const e = c.enemies.get(bestiaryPick)!;
  const art = manifest.enemies[e.id];
  const where = dungeons.flatMap((d) => d.stages.filter((s) => s.kind === "fight" && s.enemies.includes(e.id)).map((s) => `${d.name}: ${s.kind === "fight" ? s.name : s.id}`));
  return h("div", { class: "row" },
    h("div", { class: "panel" }, h("h2", null, "Bestiary"), list),
    h("div", { class: "panel", style: "flex:1;min-width:420px" },
      h("div", { class: "row", style: "align-items:flex-end" }, enemyImage(e.id, Math.min(220, (art?.h ?? 100) * (art?.scale ?? 1) * 1.2)), h("div", null, h("h2", null, enemyDisplayName(e.id), e.name !== enemyDisplayName(e.id) ? h("span", { class: "muted small" }, ` (${e.name} in the documents)`) : null), h("div", { class: "muted" }, e.text), h("div", { class: "small" }, h("span", { class: "tag" }, e.rank), where.length ? `Appears in: ${where.join("; ")}` : "Summoned only."))),
      enemySheet(e, setup.settings.designer),
    ),
  );
}

// ─── Settings ───
function settings(): HTMLElement {
  const s = setup.settings;
  const render = () => { clear(content); content.append(settings()); };
  const toggle = (label: string, key: keyof typeof s, note: string) => h("div", { class: "row", style: "align-items:center" }, button(s[key] ? "On" : "Off", () => { (s as unknown as Record<string, unknown>)[key] = !s[key]; save(); render(); }, s[key] ? "active small" : "small"), h("b", null, label), h("span", { class: "muted small" }, note));
  return h("div", { class: "col" },
    h("div", { class: "panel" }, h("h2", null, "Settings"),
      h("div", { class: "row", style: "align-items:center" }, "One tick lasts ", h("input", { type: "number", value: s.tickMs, min: 100, max: 3000, step: 50, style: "width:90px", onChange: (e: Event) => { s.tickMs = Math.max(100, Number((e.target as HTMLInputElement).value) || 500); save(); } }), " ms at 1× speed. ", h("span", { class: "muted small" }, "A regular fight is about 30 ticks; a boss fight about 100.")),
      toggle("Designer view", "designer", "shows enemy stats, HP numbers and cooldowns, which players never see."),
      toggle("Enemy HP numbers", "showEnemyNumbers", "numbers on enemy health bars (designer view only)."),
      toggle("Sound", "sound", "synthesized beeps for hits, heals, casts and knockouts."),
      toggle("Auto-continue", "autoContinue", "go straight to the next fight of a run after a win."),
      h("div", { class: "row", style: "margin-top:10px" }, button("Reset party, gear and settings", () => { reset(); go("home"); })),
    ),
    h("div", { class: "panel small muted" },
      h("h3", null, "Numbers"),
      "The data stores every amount at 1,000 per point of the documents' 1–5 scale. The interface shows amounts at 100 per point: a Knight's HP 5 reads as 500, a sword hit lands for about 110, a Poison tick for 9. Percent stats (crit, evasion, resistances) show as they are.",
    ),
  );
}

export const Fragment = (...children: Child[]) => h("div", null, ...children);
export { statusIcon };
