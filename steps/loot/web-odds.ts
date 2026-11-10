// The loot pass's web check (run: npx tsx steps/loot/web-odds.ts [count|engines|roads|routes|onroad|party|items]). Reads steps/loot/spine.md's item lines and tags, and works out how often a run is offered each road's steps and
// each engine's keystone, from the offer roll (rogue-mode.md, Loot) and offer volumes counted over simulated runs.
import { readFileSync } from "node:fs";
const spine = readFileSync(new URL("./spine.md", import.meta.url), "utf8");

const CLASSES: Record<string, { weapon: string[]; offhand: string[]; armor: string[] }> = {
  knight: { weapon: ["sword", "hammer"], offhand: ["kite shield", "horn"], armor: ["plate"] },
  cleric: { weapon: ["mace", "staff"], offhand: ["relic", "lantern"], armor: ["robes"] },
  ranger: { weapon: ["bow", "dagger"], offhand: ["trophy", "cloak"], armor: ["leather"] },
  bramble: { weapon: ["hammer", "mace"], offhand: ["totem", "round shield"], armor: ["plate", "mail"] },
  hoplite: { weapon: ["spear", "great weapon"], offhand: ["round shield", "horn"], armor: ["plate"] },
  paladin: { weapon: ["mace", "great weapon"], offhand: ["kite shield", "relic"], armor: ["mail", "plate"] },
  valkyrie: { weapon: ["spear", "sword"], offhand: ["round shield", "cloak"], armor: ["mail", "leather"] },
  bard: { weapon: ["bow", "wand"], offhand: ["tome", "bell"], armor: ["leather", "robes"] },
  hexer: { weapon: ["wand", "sword"], offhand: ["tome", "idol"], armor: ["mail"] },
  monk: { weapon: ["fist weapons", "spear"], offhand: ["bell", "cloak"], armor: ["leather"] },
  assassin: { weapon: ["dagger", "axe"], offhand: ["vial", "trophy"], armor: ["leather"] },
  vampire: { weapon: ["fist weapons", "axe"], offhand: ["vial", "idol"], armor: ["mail"] },
  pyromancer: { weapon: ["staff", "wand"], offhand: ["lantern", "orb"], armor: ["robes"] },
  frostweaver: { weapon: ["staff", "rune sword"], offhand: ["tome", "orb"], armor: ["robes", "mail"] },
  stormcaller: { weapon: ["fist weapons", "rune sword"], offhand: ["totem", "bell"], armor: ["robes", "leather"] },
  geomancer: { weapon: ["hammer", "great weapon"], offhand: ["kite shield", "trophy"], armor: ["plate"] },
};
const CLS_NAME: Record<string, string> = { knight: "Knight", cleric: "Cleric", ranger: "Ranger", bramble: "Bramble knight", hoplite: "Hoplite", paladin: "Paladin", valkyrie: "Valkyrie", bard: "Bard", hexer: "Hexer", monk: "Monk", assassin: "Assassin", vampire: "Vampire", pyromancer: "Pyromancer", frostweaver: "Frostweaver", stormcaller: "Stormcaller", geomancer: "Geomancer" };
const slotOf = (kind: string) => (kind === "amulet" ? "amulet" : ["plate", "mail", "leather", "robes"].includes(kind) ? "armor" : Object.values(CLASSES).some((c) => c.weapon.includes(kind)) ? "weapon" : "offhand");
const W: Record<string, number> = { weapon: 0.3, offhand: 0.3, armor: 0.25, amulet: 0.15 };
// Offers an act makes, by rarity and source (40 simulated runs at today's content). open: spoils and chests (two in three for the
// roster), shop: the roster, aimed: an elite's first legendary (the party).
const OFFERS = [
  { U: { open: 8.0, shop: 1.15, aimed: 0 }, R: { open: 7.02, shop: 1.15, aimed: 0 }, L: { open: 4.83, shop: 0.57, aimed: 1.55 } },
  { U: { open: 6.62, shop: 1.84, aimed: 0 }, R: { open: 7.03, shop: 1.89, aimed: 0 }, L: { open: 5.0, shop: 1.78, aimed: 1.76 } },
];
const ROSTER = [3.65, 5.18];
const FORM = [{ common: 2.8, rare: 1.8, legendary: 0.1 }, { common: 1.84, rare: 3.19, legendary: 0.76 }];
const VERSION_MET = [0.5, 0.9];

type Item = { name: string; kind: string; rarity: string; type: "piece" | "formation" | "version" | "mythic"; cls?: string; text: string };
const items: Item[] = [];
const lines = spine.split("\n");
let kind = "", section = "", formRarity = "";
const KIND_RE = /^#### (.+)$/;
for (const raw of lines) {
  const line = raw.trim();
  if (line.startsWith("### ")) { section = line.slice(4); kind = section.startsWith("Amulets") ? "amulet" : ""; }
  const km = line.match(KIND_RE); if (km) kind = km[1].toLowerCase();
  if (section.startsWith("Formations")) { const f = line.match(/^\*\*(Common|Rare|Legendary)\*\*$/); if (f) formRarity = f[1].toLowerCase(); }
  // Rares and legendaries.
  const m = line.match(/^- \*\*(.+?)\*\* · (R|L) · (.*)$/);
  if (m && kind) { items.push({ name: m[1], kind, rarity: m[2], type: "piece", text: m[3] }); continue; }
  // Formations.
  const f = line.match(/^- \*\*(.+?)\*\* · (.*)$/);
  if (f && section.startsWith("Formations") && formRarity) { items.push({ name: f[1], kind: "formation", rarity: formRarity, type: "formation", text: f[2] }); continue; }
  // Versions.
  const v = line.match(/^- \*\*(.+?), (.+?), (A|B): (.+?)\*\*(.*)$/);
  if (v && section.startsWith("Versions")) { const cls = Object.keys(CLS_NAME).find((k) => CLS_NAME[k] === v[1])!; items.push({ name: v[4], kind: "version", rarity: "V", type: "version", cls, text: v[5] }); continue; }
  // The uncommons table.
  const row = line.match(/^\| \*\*(.+?)\*\* \((.+?)\) \|(.*)$/);
  if (row && section.startsWith("Commons")) {
    const k = row[1].toLowerCase();
    const cells = row[3].split(" | ").slice(1);
    for (const cell of cells) for (const part of cell.split(" · **")) {
      const u = part.match(/\*?\*?(.+?)\*\*: (.*)$/);
      if (u) items.push({ name: u[1].replace(/^\*+/, ""), kind: k, rarity: "U", type: "piece", text: u[2] });
    }
  }
  // Mythics.
  const my = line.match(/^\| (Knight|Cleric|Ranger|Bramble knight|Hoplite|Paladin|Valkyrie|Bard|Hexer|Monk|Assassin|Vampire|Pyromancer|Frostweaver|Stormcaller|Geomancer) \| (.+?) \| (.+?) \| (.+?) \| (.+?) \|$/);
  if (my && section.startsWith("Mythics")) { const cls = Object.keys(CLS_NAME).find((k) => CLS_NAME[k] === my[1])!; items.push({ name: my[2].replace(/\*\*/g, "").replace(/ \(.*\)/, ""), kind: "mythic", rarity: "M", type: "mythic", cls, text: my[4] + " " + my[5] }); }
}
// Kits (always there with the class) and the versions that stay, as homes for road steps and engine keystones.
const KEEP: { cls: string; name: string; type: "kit" | "version"; text: string }[] = [
  { cls: "valkyrie", name: "Skyfall", type: "kit", text: "ST2●● held charge◆" },
  { cls: "bramble", name: "Briar", type: "kit", text: "TC1●● TL1●●● red rain◆" },
  { cls: "hexer", name: "Malison", type: "kit", text: "TC1● every colour· red rain◆" },
  { cls: "assassin", name: "Vanish", type: "kit", text: "HU1● two in the dark◆" },
  { cls: "assassin", name: "Coup de grâce", type: "version", text: "HU2●●● reaping◆" },
  { cls: "ranger", name: "Quick draw", type: "version", text: "TC2●● HU2● emptied quiver◆" },
  { cls: "assassin", name: "Smoke screen", type: "version", text: "BP2● two in the dark◆" },
  { cls: "knight", name: "Stonewall", type: "version", text: "LS2●●" }, { cls: "knight", name: "Grudge", type: "version", text: "TL2●●" },
  { cls: "knight", name: "Stone guard", type: "version", text: "LS2●●" }, { cls: "knight", name: "Valor", type: "version", text: "LS2●●" },
  { cls: "knight", name: "Rally the well", type: "version", text: "BA2●●" }, { cls: "knight", name: "Hold the line", type: "version", text: "TL1●●●" },
  { cls: "knight", name: "Crushing bash", type: "version", text: "LS2●●" },
  { cls: "cleric", name: "Shared rites", type: "version", text: "BP2●●" }, { cls: "cleric", name: "Font", type: "version", text: "BA2●●" },
  { cls: "cleric", name: "Anchor's blessing", type: "version", text: "TL2●●●" }, { cls: "cleric", name: "Triage", type: "version", text: "BP2●●" },
  { cls: "cleric", name: "Martyr's raise", type: "version", text: "BP2●●" },
  { cls: "ranger", name: "Quarry", type: "version", text: "HU2●●" }, { cls: "ranger", name: "Deep barbs", type: "version", text: "HU2●● TC2●" },
  { cls: "ranger", name: "Barbed quiver", type: "version", text: "TC2●●" }, { cls: "ranger", name: "Hail", type: "version", text: "CS2●●" },
  { cls: "ranger", name: "Armor breaker", type: "version", text: "LS2● TC2●" },
  { cls: "bramble", name: "Bloodroot", type: "version", text: "BP2●● TL2●" }, { cls: "bramble", name: "Spreading thorns", type: "version", text: "TC2●●" },
  { cls: "bramble", name: "Grove", type: "version", text: "LS2●●" }, { cls: "bramble", name: "Deep roots", type: "version", text: "TL2●●" },
  { cls: "bramble", name: "Blossom", type: "version", text: "BP2●●" }, { cls: "bramble", name: "Rebuke", type: "version", text: "TL2●●" },
  { cls: "hoplite", name: "Opening thrust", type: "version", text: "HU2●●" }, { cls: "hoplite", name: "Shieldbearer", type: "version", text: "LS2●●" },
  { cls: "hoplite", name: "Watch the anchor", type: "version", text: "TL2●●" }, { cls: "hoplite", name: "Locked shields", type: "version", text: "LS2● ST2●" },
  { cls: "hoplite", name: "Breach", type: "version", text: "LS2●●" }, { cls: "hoplite", name: "Skewer", type: "version", text: "ST2●●" },
  { cls: "paladin", name: "Zeal", type: "version", text: "BF1●●●" }, { cls: "paladin", name: "Verdict", type: "version", text: "HU2●●" },
  { cls: "paladin", name: "Challenge", type: "version", text: "TL2●●" }, { cls: "paladin", name: "Penance", type: "version", text: "BP2●●" },
  { cls: "paladin", name: "Pyre of judgement", type: "version", text: "BF2●●" },
  { cls: "valkyrie", name: "Chooser of the slain", type: "version", text: "HU2●●" }, { cls: "valkyrie", name: "Shield-sister", type: "version", text: "BP2●● TL2●" },
  { cls: "valkyrie", name: "Gale storm", type: "version", text: "ST2●●" }, { cls: "valkyrie", name: "Spear of the hunt", type: "version", text: "HU2●●" },
  { cls: "valkyrie", name: "Over the fallen", type: "version", text: "TL2●● BP2●" },
  { cls: "bard", name: "Harmony", type: "version", text: "BA2●● BP2●" }, { cls: "bard", name: "Battle song", type: "version", text: "LS2● TC2●" },
  { cls: "bard", name: "Lament", type: "version", text: "BP2●●" }, { cls: "bard", name: "Rousing chorus", type: "version", text: "LS2●●" },
  { cls: "bard", name: "Rubato", type: "version", text: "BA2●●" }, { cls: "bard", name: "Accelerando", type: "version", text: "TC2●●" },
  { cls: "bard", name: "Reprise", type: "version", text: "BA2●●" }, { cls: "bard", name: "Cadenza", type: "version", text: "TC2● ST2●" },
  { cls: "hexer", name: "Hex of flames", type: "version", text: "BF1●●●" }, { cls: "hexer", name: "Withering hex", type: "version", text: "TL2●●" },
  { cls: "hexer", name: "Wither", type: "version", text: "TL2●" }, { cls: "hexer", name: "Expose", type: "version", text: "HU2● TC2●" },
  { cls: "monk", name: "Hundred hands", type: "version", text: "TC2●●" }, { cls: "monk", name: "Drinking palm", type: "version", text: "TC2● BP2●" },
  { cls: "monk", name: "Flow state", type: "version", text: "TC2●●" }, { cls: "monk", name: "Stillness of mind", type: "version", text: "TL2●●" },
  { cls: "monk", name: "Frost fist", type: "version", text: "CS2●●" }, { cls: "monk", name: "Fanned flames", type: "version", text: "BF2●●" },
  { cls: "monk", name: "Vital strike", type: "version", text: "HU2●●" },
  { cls: "assassin", name: "Opening wound", type: "version", text: "HU2●● TC2●" }, { cls: "assassin", name: "Rupture", type: "version", text: "HU2●● TC2●●" },
  { cls: "assassin", name: "Shadow step", type: "version", text: "HU2●●" }, { cls: "assassin", name: "From the shadows", type: "version", text: "HU2●●" },
  { cls: "assassin", name: "Bleed them dry", type: "version", text: "BP2●●" },
  { cls: "vampire", name: "Shared feast", type: "version", text: "BP2●●" }, { cls: "vampire", name: "Savage drain", type: "version", text: "TC2●●" },
  { cls: "vampire", name: "Drain the well", type: "version", text: "BA2●●" }, { cls: "vampire", name: "Blood for mana", type: "version", text: "BA2●●" },
  { cls: "vampire", name: "Feeding frenzy", type: "version", text: "BP2●●" }, { cls: "vampire", name: "Bloodthirst", type: "version", text: "TC2●●" },
  { cls: "pyromancer", name: "Kindling", type: "version", text: "BF1●●●" }, { cls: "pyromancer", name: "Wildfire", type: "version", text: "BF2●●" },
  { cls: "pyromancer", name: "Slow burn", type: "version", text: "BF2●●" }, { cls: "pyromancer", name: "Flash bolt", type: "version", text: "BA2●●" },
  { cls: "pyromancer", name: "Conflagration", type: "version", text: "BF2●●" },
  { cls: "frostweaver", name: "Splinters", type: "version", text: "CS2●●" }, { cls: "frostweaver", name: "Icicles", type: "version", text: "CS2●●" },
  { cls: "frostweaver", name: "Avalanche", type: "version", text: "CS2●●" }, { cls: "frostweaver", name: "Deep calm", type: "version", text: "BA2●●" },
  { cls: "frostweaver", name: "Rime shield", type: "version", text: "TL2● LS2●" },
  { cls: "stormcaller", name: "Forked arc", type: "version", text: "ST2●●" }, { cls: "stormcaller", name: "Ball lightning", type: "version", text: "HU2●●" },
  { cls: "stormcaller", name: "Recharge", type: "version", text: "BA2●●" }, { cls: "stormcaller", name: "Static field", type: "version", text: "TL2●●" },
  { cls: "stormcaller", name: "Storm's eye", type: "version", text: "HU2● ST2●" }, { cls: "stormcaller", name: "Overcharge", type: "version", text: "BA2●●" },
  { cls: "stormcaller", name: "Storm shield", type: "version", text: "TL2●●" },
  { cls: "geomancer", name: "Faultline", type: "version", text: "LS2●●" }, { cls: "geomancer", name: "Stone skin", type: "version", text: "LS2●●" },
  { cls: "geomancer", name: "Boulder", type: "version", text: "LS2●●" }, { cls: "geomancer", name: "Fissure", type: "version", text: "LS2● CS2●" },
  { cls: "geomancer", name: "Stunning crits", type: "version", text: "CS2● LS2●" },
];
for (const k of KEEP) items.push({ name: k.name, kind: k.type, rarity: k.type === "kit" ? "K" : "V", type: k.type === "kit" ? ("kit" as any) : "version", cls: k.cls, text: k.text });
const n = (k: string, r: string) => items.filter((i) => i.type === "piece" && i.kind === k && i.rarity === r).length;

const ROADS = ["LS", "TC", "BF", "CS", "ST", "HU", "TL", "BA", "BP"];
const roadTags = (t: string) => [...t.matchAll(/\b(LS|TC|BF|CS|ST|HU|TL|BA|BP)([123])?(●+)/g)].map((x) => ({ road: x[1], rung: x[2] ? Number(x[2]) : 0, worth: x[3].length }));
const ENGINES = ["detonation", "frozen gate", "mirror", "goad", "held charge", "reckoning", "reaping", "judge's drum", "opening again", "fuse", "avalanche", "spell on the swing", "red rain", "riposte", "every colour", "lead's colour", "emptied quiver", "blood mage", "resonance", "crescendo", "mana as armour", "shatter bell", "firecracker string", "brink", "two in the dark", "red stone", "borrowed gift", "carrier"];
const engineTags = (t: string) => ENGINES.flatMap((e) => (["◆", "◇", "·"] as const).filter((s) => t.toLowerCase().includes(e + s)).map((s) => ({ engine: e, role: s })));

// Expected offers of one item in an act, for a party holding class `cls`.
function rate(it: Item, cls: string, act: number): number {
  if ((it.type as string) === "kit") return it.cls === cls && act === 0 ? 1 : 0;
  if (it.type === "version") return it.cls === cls ? VERSION_MET[act] - (act ? VERSION_MET[0] : 0) : 0;
  if (it.type === "mythic") return it.cls === cls && act === 1 ? 1 / 3 : 0;
  if (it.type === "formation") { const nn = items.filter((i) => i.type === "formation" && i.rarity === it.rarity && i.name !== "Neutral").length; return FORM[act][it.rarity as "common"] / nn; }
  const slot = slotOf(it.kind);
  const r = ROSTER[act];
  const src = OFFERS[act][it.rarity as "U" | "R" | "L"];
  const nk = n(it.kind, it.rarity);
  if (slot === "amulet") return (src.open + src.shop + src.aimed) * W.amulet / nk;
  const kinds = (CLASSES[cls] as any)[slot] as string[];
  if (!kinds.includes(it.kind)) return 0;
  const perClassOpen = W[slot] * (0.67 / r) / kinds.length / nk;
  const perClassShop = W[slot] * (1 / r) / kinds.length / nk;
  const perClassAimed = W[slot] * (1 / 3) / kinds.length / nk;
  return src.open * perClassOpen + src.shop * perClassShop + src.aimed * perClassAimed;
}
const fmt = (x: number) => x.toFixed(2);
const pAny = (x: number) => 1 - Math.exp(-x);

const out: string[] = [];
const mode = process.argv[2] ?? "all";
if (mode === "count" || mode === "all") {
  const by: Record<string, Record<string, number>> = {};
  for (const i of items) if (i.type === "piece") { by[i.kind] ??= {}; by[i.kind][i.rarity] = (by[i.kind][i.rarity] ?? 0) + 1; }
  out.push("COUNTS " + JSON.stringify(by));
  out.push("formations " + ["common", "rare", "legendary"].map((r) => r + ":" + items.filter((i) => i.type === "formation" && i.rarity === r).length).join(" "));
  out.push("versions " + items.filter((i) => i.type === "version").length + ", mythics " + items.filter((i) => i.type === "mythic").length);
}
// Engines: keystone offers by the end of act II, for the class that's offered it most, and how many classes can be.
if (mode === "engines" || mode === "all") {
  out.push("\nENGINE | keystone homes | best class: exp. offers act I / I+II, P(any) by II | classes that can meet a piece or version of it | common half (best class, act I exp.)");
  for (const e of ENGINES) {
    const keys = items.filter((i) => engineTags(i.text).some((t) => t.engine === e && t.role === "◆"));
    const halves = items.filter((i) => engineTags(i.text).some((t) => t.engine === e && t.role === "◇"));
    const per = Object.keys(CLASSES).map((c) => ({ c, a1: keys.reduce((s, i) => s + rate(i, c, 0), 0), a2: keys.reduce((s, i) => s + rate(i, c, 0) + rate(i, c, 1), 0), h1: halves.reduce((s, i) => s + rate(i, c, 0), 0) }));
    const best = per.slice().sort((a, b) => b.a2 - a.a2)[0];
    const reach = per.filter((p) => keys.some((i) => i.type !== "formation" && !(slotOf(i.kind) === "amulet" && i.type === "piece") && rate(i, p.c, 1) + rate(i, p.c, 0) > 0)).length;
    const anyone = keys.some((i) => i.type === "formation" || (i.type === "piece" && i.kind === "amulet"));
    const hb = per.slice().sort((a, b) => b.h1 - a.h1)[0];
    out.push(`${e} | ${keys.map((k) => k.name).join(", ")} | ${CLS_NAME[best.c]}: ${fmt(best.a1)} / ${fmt(best.a2)}, ${Math.round(pAny(best.a2) * 100)}% | ${anyone ? "any class (amulet or seat)" : reach + " classes"} | ${halves.length ? CLS_NAME[hb.c] + " " + fmt(hb.h1) : "kits"}`);
  }
}
// Roads: rung 1 offers in act I and rung 2 offers by the end of act II, per route class.
if (mode === "roads" || mode === "all") {
  out.push("\nROAD | class | rung-1 pieces, exp. offers in act I (P any) | rung-2 pieces and versions, exp. by end of act II (P any)");
  const ROUTES: Record<string, string[]> = { LS: ["geomancer", "knight", "hoplite", "paladin", "bard"], TC: ["vampire", "assassin", "monk", "bramble", "ranger", "valkyrie"], BF: ["knight", "pyromancer", "monk", "paladin", "hexer"], CS: ["frostweaver", "hexer", "ranger", "knight", "monk", "geomancer"], ST: ["hoplite", "stormcaller", "valkyrie", "knight", "monk", "hexer", "bard"], HU: ["paladin", "assassin", "stormcaller", "hoplite", "valkyrie", "ranger"], TL: ["bramble", "cleric", "stormcaller", "knight", "hexer", "hoplite", "monk", "valkyrie", "bard"], BA: ["knight", "bard", "pyromancer", "frostweaver", "stormcaller", "cleric", "vampire", "geomancer"], BP: ["vampire", "valkyrie", "cleric", "bard", "hoplite", "assassin", "paladin", "monk"] };
  for (const road of ROADS) for (const c of ROUTES[road]) {
    const r1 = items.filter((i) => roadTags(i.text).some((t) => t.road === road && t.rung === 1) && i.type !== "formation");
    const r2 = items.filter((i) => roadTags(i.text).some((t) => t.road === road && t.rung === 2) && i.type !== "formation");
    const e1 = r1.reduce((s, i) => s + rate(i, c, 0), 0);
    const e2 = r2.reduce((s, i) => s + rate(i, c, 0) + rate(i, c, 1), 0);
    out.push(`${road} | ${CLS_NAME[c]} | ${fmt(e1)} (${Math.round(pAny(e1) * 100)}%) | ${fmt(e2)} (${Math.round(pAny(e2) * 100)}%)`);
  }
  out.push("\nFORMATIONS: road's common formations, exp. offers in act I; rare by end of act II");
  for (const road of ROADS) {
    const c1 = items.filter((i) => i.type === "formation" && i.rarity === "common" && roadTags(i.text).some((t) => t.road === road));
    const r2 = items.filter((i) => i.type === "formation" && i.rarity === "rare" && roadTags(i.text).some((t) => t.road === road));
    const e1 = c1.reduce((s, i) => s + rate(i, "knight", 0), 0), e2 = r2.reduce((s, i) => s + rate(i, "knight", 0) + rate(i, "knight", 1), 0);
    out.push(`${road} | commons ${c1.map((x) => x.name).join(", ")}: ${fmt(e1)} (${Math.round(pAny(e1) * 100)}%) | rares ${r2.map((x) => x.name).join(", ")}: ${fmt(e2)} (${Math.round(pAny(e2) * 100)}%)`);
  }
}
const ROUTES3: Record<string, string[][]> = {
  LS: [["geomancer", "knight", "hoplite"], ["geomancer", "paladin", "bard"], ["knight", "hoplite", "bard"]],
  TC: [["vampire", "assassin", "monk"], ["bramble", "assassin", "ranger"], ["valkyrie", "ranger", "vampire"]],
  BF: [["knight", "pyromancer", "monk"], ["paladin", "hexer", "pyromancer"], ["paladin", "monk", "hexer"]],
  CS: [["frostweaver", "hexer", "ranger"], ["knight", "frostweaver", "monk"], ["hexer", "ranger", "geomancer"]],
  ST: [["hoplite", "stormcaller", "valkyrie"], ["knight", "stormcaller", "monk"], ["valkyrie", "hexer", "bard"]],
  HU: [["paladin", "assassin", "stormcaller"], ["hoplite", "valkyrie", "ranger"], ["assassin", "ranger", "valkyrie"]],
  TL: [["bramble", "cleric", "stormcaller"], ["knight", "hexer", "hoplite"], ["monk", "valkyrie", "bard"]],
  BA: [["knight", "bard", "pyromancer"], ["frostweaver", "bard", "stormcaller"], ["cleric", "vampire", "geomancer"]],
  BP: [["vampire", "valkyrie", "cleric"], ["vampire", "bard", "hoplite"], ["assassin", "paladin", "monk"]],
};
// A party's expected offers of a set of items: class-bound items for each class; amulets, formations once.
function partyRate(set: Item[], party: string[], act: number, kinds: ("kit" | "version" | "piece" | "formation" | "mythic")[] = ["piece", "version", "formation", "mythic", "kit"]) {
  let t = 0;
  for (const i of set) {
    if (!kinds.includes(i.type as any)) continue;
    const once = i.type === "formation" || (i.type === "piece" && i.kind === "amulet");
    if (once) t += rate(i, party[0], act);
    else for (const c of party) t += rate(i, c, act);
  }
  return t;
}
if (mode === "routes" || mode === "all") {
  out.push("\nROUTE | rung-1 pieces and formations in act I: exp. (P any) | the same, with versions | rung-2 pieces and formations by end of act II: exp. (P any) | with versions");
  for (const road of ROADS) for (const party of ROUTES3[road]) {
    const r1 = items.filter((i) => roadTags(i.text).some((t) => t.road === road && t.rung === 1) && (i.type as string) !== "kit");
    const r2 = items.filter((i) => roadTags(i.text).some((t) => t.road === road && t.rung === 2) && (i.type as string) !== "kit");
    const p1 = partyRate(r1, party, 0, ["piece", "formation"]), v1 = partyRate(r1, party, 0, ["version"]);
    const p2 = partyRate(r2, party, 0, ["piece", "formation", "mythic"]) + partyRate(r2, party, 1, ["piece", "formation", "mythic"]), v2 = partyRate(r2, party, 0, ["version"]) + partyRate(r2, party, 1, ["version"]);
    out.push(`${road} | ${party.map((c) => CLS_NAME[c]).join(", ")} | ${fmt(p1)} (${Math.round(pAny(p1) * 100)}%) | +${fmt(v1)} versions | ${fmt(p2)} (${Math.round(pAny(p2) * 100)}%) | +${fmt(v2)} versions`);
  }
}
if (mode === "party" || mode === "all") {
  // Every party of three, each engine's keystone offered by the end of act II (pieces, seats and mythics; then with kits and versions).
  const cls = Object.keys(CLASSES);
  const parties: string[][] = [];
  for (let a = 0; a < 16; a++) for (let b = a + 1; b < 16; b++) for (let c = b + 1; c < 16; c++) parties.push([cls[a], cls[b], cls[c]]);
  out.push("\nENGINE | keystone by end of act II, a random party: P(offered a piece or seat) | P(with its kit and versions) | parties that have it from the kit or a version");
  let sumP = 0, sumPV = 0;
  for (const e of ENGINES) {
    const keys = items.filter((i) => engineTags(i.text).some((t) => t.engine === e && t.role === "◆"));
    let ps = 0, pv = 0, kitParties = 0;
    for (const party of parties) {
      const a = partyRate(keys, party, 0, ["piece", "formation", "mythic"]) + partyRate(keys, party, 1, ["piece", "formation", "mythic"]);
      const kv = partyRate(keys, party, 0, ["version", "kit"]) + partyRate(keys, party, 1, ["version", "kit"]);
      ps += pAny(a); pv += 1 - (1 - pAny(a)) * (1 - Math.min(1, kv));
      if (kv > 0) kitParties++;
    }
    sumP += ps / parties.length; sumPV += pv / parties.length;
    out.push(`${e} | ${Math.round((ps / parties.length) * 100)}% | ${Math.round((pv / parties.length) * 100)}% | ${Math.round((kitParties / parties.length) * 100)}%`);
  }
  out.push(`engines whose keystone a random party is offered by the end of act II, on average: ${sumP.toFixed(1)} from pieces and seats; ${sumPV.toFixed(1)} with kits and versions`);
}
const ENGINE_ROADS: Record<string, string[]> = { detonation: ["LS"], "frozen gate": ["TL", "CS"], mirror: ["TL", "LS"], goad: ["ST", "TL"], "held charge": ["ST", "CS", "LS"], reckoning: ["TL", "LS"], reaping: ["HU", "ST", "BF", "TL"], "judge's drum": ["HU", "LS", "BF"], "opening again": ["HU"], fuse: ["BF", "HU"], avalanche: ["LS", "HU"], "spell on the swing": ["TC", "BA"], "red rain": ["TC", "ST", "TL"], riposte: ["TL", "TC"], "every colour": ["BF", "CS", "ST", "TC"], "lead's colour": ["BF", "CS", "ST", "TC"], "emptied quiver": ["TC", "HU"], "blood mage": ["BP", "BA"], resonance: ["BA", "ST", "BF", "CS"], crescendo: ["BA"], "mana as armour": ["BA", "BP"], "shatter bell": ["CS", "LS", "BF", "BA"], "firecracker string": ["CS"], brink: ["BP", "LS", "TL"], "two in the dark": ["TL", "BP", "HU"], "red stone": ["TC", "BP", "LS"], "borrowed gift": [], carrier: [] };
if (mode === "onroad" || mode === "all") {
  out.push("\nENGINE | on its roads' routes: keystone offered by end of act I / act II, pieces and seats (with kits and versions) | the route that meets it least");
  for (const e of ENGINES) {
    const keys = items.filter((i) => engineTags(i.text).some((t) => t.engine === e && t.role === "◆"));
    const routes = (ENGINE_ROADS[e] ?? []).flatMap((r) => ROUTES3[r]);
    if (!routes.length) { out.push(`${e} | exotic: no road`); continue; }
    const res = routes.map((party) => {
      const a1 = partyRate(keys, party, 0, ["piece", "formation", "mythic"]), a2 = a1 + partyRate(keys, party, 1, ["piece", "formation", "mythic"]);
      const k1 = partyRate(keys, party, 0, ["version", "kit"]), k2 = k1 + partyRate(keys, party, 1, ["version", "kit"]);
      return { party, p1: pAny(a1), p2: pAny(a2), v1: 1 - (1 - pAny(a1)) * (1 - Math.min(1, k1)), v2: 1 - (1 - pAny(a2)) * (1 - Math.min(1, k2)) };
    });
    const avg = (f: (x: typeof res[number]) => number) => Math.round((res.reduce((t, x) => t + f(x), 0) / res.length) * 100);
    const worst = res.slice().sort((a, b) => a.v2 - b.v2)[0];
    out.push(`${e} | ${avg((x) => x.p1)}% / ${avg((x) => x.p2)}% (${avg((x) => x.v1)}% / ${avg((x) => x.v2)}%) | ${worst.party.map((c) => CLS_NAME[c]).join(", ")}: ${Math.round(worst.v2 * 100)}%`);
  }
}
if (mode === "items") for (const i of items) out.push(`${i.type} ${i.kind} ${i.rarity} ${i.name} :: ${roadTags(i.text).map((t) => t.road + (t.rung || "") + "●".repeat(t.worth)).join(" ")} :: ${engineTags(i.text).map((t) => t.engine + t.role).join(", ")}`);
console.log(out.join("\n"));
