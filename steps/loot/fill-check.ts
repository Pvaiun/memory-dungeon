/**
 * The loot pass's fill check: a small script over the fill's files. Scratch, like the rest of this folder; it goes when the
 * step closes.
 *
 *   npx tsx steps/loot/fill-check.ts            prints what's missing, extra, over or under budget, or written twice
 *   npx tsx steps/loot/fill-check.ts --cards    also prints every card in one line, share by share, for a read
 *
 * It reads the spine's item lines and each kind's `*Commons (n):*` line, and the entries in `fill/*.md` (the layout in
 * `fill-brief.md`: a `### Name` heading, then `- **Is:**`, `- **Card:**`, `- **Stats:**` and the rest). It checks that every
 * item of the spine is written once, in its share, at its kind and rarity; that each kind has its commons; that every piece
 * carries exactly its budget of steps, counted as `content/core-set/pieces/kit.ts` counts them; that no name is used twice;
 * and it lists the cards that read the same sentence for sentence. It judges nothing else: the lead reads the rest.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { KIND_BUDGET, KIND_WORDS } from "../../content/core-set/scale.js";

const DIR = "steps/loot/fill";
const SHARE_OF_KIND: Record<string, string> = {
  dagger: "weapons-1", fist: "weapons-1", wand: "weapons-1", sword: "weapons-1", spear: "weapons-1", axe: "weapons-1",
  bow: "weapons-2", "rune sword": "weapons-2", hammer: "weapons-2", mace: "weapons-2", staff: "weapons-2", "great weapon": "weapons-2",
  plate: "armor", mail: "armor", leather: "armor", robes: "armor",
  "kite shield": "offhands-1", "round shield": "offhands-1", horn: "offhands-1", totem: "offhands-1", relic: "offhands-1", lantern: "offhands-1",
  tome: "offhands-2", orb: "offhands-2", idol: "offhands-2", vial: "offhands-2", trophy: "offhands-2", bell: "offhands-2", cloak: "offhands-2",
  amulet: "amulets",
};
const WEAPONS = ["dagger", "fist", "wand", "sword", "spear", "axe", "bow", "rune sword", "hammer", "mace", "staff", "great weapon"];
const HEADERS: Record<string, string> = { "fist weapons": "fist", amulets: "amulet" };
const RARITIES = ["common", "uncommon", "rare", "legendary"] as const;
type Rarity = (typeof RARITIES)[number];

// ─── The spine ───────────────────────────────────────────────────────────────
type Want = { name: string; share: string; kind: string; rarity: string };
const spine = readFileSync("steps/loot/spine.md", "utf8").split("\n");
const want: Want[] = [];
const commons: Record<string, number> = {};
let kind = "";
for (const l of spine) {
  const h = l.match(/^#{4,5} (.+)$/);
  if (h) { const k = h[1].toLowerCase(); kind = HEADERS[k] ?? k; continue; }
  if (/^## Commons and uncommons by kind/.test(l)) break; // The lines end here; the tables after repeat them.
  const c = l.match(/^- \*Commons \((\d+)\):\*/);
  if (c && kind in SHARE_OF_KIND) { commons[kind] = +c[1]; continue; }
  const m = l.match(/^- \*\*(.+?)\*\* · (.+?) · (.+?) · /);
  if (!m) continue;
  const [, name, f2, f3] = m;
  if (f3.startsWith("kit change")) want.push({ name, share: "versions-mythics", kind: "kit change", rarity: "" });
  else if (f2 === "formation") want.push({ name, share: "formations", kind: "formation", rarity: f3 });
  else if (f3.startsWith("version")) want.push({ name, share: "versions-mythics", kind: "version", rarity: "" });
  else if (f3.startsWith("mythic")) want.push({ name, share: "versions-mythics", kind: "mythic", rarity: "" });
  else if (f2 in SHARE_OF_KIND) want.push({ name, share: SHARE_OF_KIND[f2], kind: f2, rarity: f3 });
}

// ─── The fill ────────────────────────────────────────────────────────────────
type Entry = { name: string; share: string; is: string; card: string; stats: string; fields: Set<string> };
const entries: Entry[] = [];
const ends: Record<string, string[]> = {};
const END = ["Challenges", "Links", "Loops", "Code support beyond the spine's list", "Least sure"];
const files = existsSync(DIR) ? readdirSync(DIR).filter((f) => f.endsWith(".md") && f !== "shared.md" && !f.startsWith("round-")) : [];
for (const f of files) {
  const share = f.replace(/\.md$/, "");
  let cur: Entry | undefined;
  let fence = false;
  ends[share] = [];
  for (const l of readFileSync(`${DIR}/${f}`, "utf8").split("\n")) {
    if (l.startsWith("```")) { fence = !fence; continue; }
    if (fence) continue;
    const end = l.match(/^#{1,3} (.+?):?\s*$/);
    if (end && END.some((e) => end[1].toLowerCase().startsWith(e.toLowerCase().slice(0, 12)))) { ends[share].push(end[1]); cur = undefined; continue; }
    const h = l.match(/^### (.+?)\s*$/);
    if (h) { cur = { name: h[1].replace(/\*/g, ""), share, is: "", card: "", stats: "", fields: new Set() }; entries.push(cur); continue; }
    if (/^#{1,2} /.test(l)) { cur = undefined; continue; }
    const fl = l.match(/^- \*\*(.+?):\*\*\s*(.*)$/);
    if (cur && fl) {
      cur.fields.add(fl[1]);
      if (fl[1] === "Is") cur.is = fl[2];
      if (fl[1] === "Card") cur.card = fl[2];
      if (fl[1] === "Stats") cur.stats = fl[2];
    }
  }
}
const real = entries.filter((e) => e.is); // A heading with no Is line is a kind's or a section's heading.

// ─── Steps ───────────────────────────────────────────────────────────────────
const AMOUNT = ["hp", "max hp", "mp", "max mp", "mp regen", "attack", "defense", "crit chance", "aggro"];
const SPECIAL = ["evasion", "accuracy", "crit damage", "double strike", "thorns", "lifesteal", "siphon", "attack speed", "cooldown", "cast speed"];
function steps(e: Entry): { n: number; trade: number; bad: string[]; high: boolean } {
  let n = 0, trade = 0, high = false;
  const bad: string[] = [];
  const body = e.stats.replace(/\(([^()]*\bof\b[^()]*)\)\s*\.?\s*$/, "").trim();
  for (const raw of body.split(/[·,;]/).map((t) => t.trim()).filter(Boolean)) {
    const t = raw.toLowerCase().replace(/[.`*]/g, "").trim();
    if (/heavier swing/.test(t)) { trade = -1; continue; }
    if (/lighter swing/.test(t)) { trade = 1; continue; }
    const a = t.match(/^(.+?) ([+\-−–])\s*(\d)$/);
    if (a && AMOUNT.includes(a[1])) {
      const v = +a[3], neg = a[2] !== "+";
      if (a[1] === "aggro") n += v; else if (!neg) n += v; else bad.push(raw);
      continue;
    }
    const s = t.match(/^(.+?) (medium|high)$/);
    if (s && SPECIAL.includes(s[1])) { n += s[2] === "high" ? 2 : 1; if (s[2] === "high") high = true; continue; }
    bad.push(raw);
  }
  return { n, trade, bad, high };
}
const budget = (k: string, r: Rarity, trade: number) => Math.max(0, KIND_BUDGET[WEAPONS.includes(k) ? KIND_WORDS[k.replace(" ", "_")].budget : "standard"][r] + trade);

// ─── The report ──────────────────────────────────────────────────────────────
const out: string[] = [];
const say = (title: string, lines: string[]) => out.push(`\n## ${title}: ${lines.length || "none"}`, ...lines.map((l) => `- ${l}`));
out.push(`Spine: ${want.length} lines and ${Object.values(commons).reduce((a, b) => a + b, 0)} commons. Fill: ${real.length} entries in ${files.length} files (${files.join(", ") || "none yet"}).`);

const norm = (s: string) => s.toLowerCase().replace(/[’']/g, "'").trim();
const byName = new Map<string, Entry[]>();
for (const e of real) byName.set(norm(e.name), [...(byName.get(norm(e.name)) ?? []), e]);

const present = new Set(files.map((f) => f.replace(/\.md$/, "")));
say("Missing from a share that's written", want.filter((w) => present.has(w.share) && !byName.has(norm(w.name))).map((w) => `${w.name} (${w.share}: ${w.kind} ${w.rarity})`));
say("Shares not written yet", [...new Set(Object.values(SHARE_OF_KIND).concat("formations", "versions-mythics"))].filter((s) => !present.has(s)));
say("Names used twice", [...byName.entries()].filter(([, v]) => v.length > 1).map(([, v]) => `${v[0].name}: ${v.map((e) => e.share).join(", ")}`));

const wantBy = new Map(want.map((w) => [norm(w.name), w]));
const wrong: string[] = [], extra: string[] = [], overUnder: string[] = [], badStat: string[] = [], highs: string[] = [], missingField: string[] = [];
const commonsHave: Record<string, number> = {};
for (const e of real) {
  const w = wantBy.get(norm(e.name));
  const is = e.is.toLowerCase();
  const isGear = Object.keys(SHARE_OF_KIND).some((k) => is.startsWith(k === "fist" ? "fist" : k));
  if (!w) {
    // A common isn't in the spine by name: it's counted against its kind's row.
    const k = Object.keys(SHARE_OF_KIND).sort((a, b) => b.length - a.length).find((k) => is.startsWith(k) || (k === "fist" && is.startsWith("fist")));
    if (k && /common/.test(is) && !/uncommon/.test(is)) {
      commonsHave[k] = (commonsHave[k] ?? 0) + 1;
      if (SHARE_OF_KIND[k] !== e.share) wrong.push(`${e.name}: a ${k} common written in ${e.share}`);
      const s = steps(e), b = budget(k, "common", s.trade);
      if (s.bad.length) badStat.push(`${e.name} (${e.share}): can't read "${s.bad.join('", "')}"`);
      else if (s.n !== b) overUnder.push(`${e.name} (${e.share}: ${k} common): ${s.n} steps, budget ${b}`);
      if (s.high) highs.push(`${e.name} (${e.share})`);
    } else extra.push(`${e.name} (${e.share}): ${e.is}`);
    continue;
  }
  if (w.share !== e.share) wrong.push(`${e.name}: written in ${e.share}, belongs to ${w.share}`);
  if (w.rarity && !is.includes(w.rarity)) wrong.push(`${e.name}: the spine has ${w.kind} · ${w.rarity}, the entry "${e.is}"`);
  if (w.kind in SHARE_OF_KIND) {
    if (!is.startsWith(w.kind === "fist" ? "fist" : w.kind)) wrong.push(`${e.name}: the spine has ${w.kind}, the entry "${e.is}"`);
    const s = steps(e), b = budget(w.kind, w.rarity as Rarity, s.trade);
    if (s.bad.length) badStat.push(`${e.name} (${e.share}): can't read "${s.bad.join('", "')}"`);
    else if (s.n !== b) overUnder.push(`${e.name} (${e.share}: ${w.kind} ${w.rarity}): ${s.n} steps, budget ${b}`);
    if (s.high && w.rarity !== "legendary") highs.push(`${e.name} (${e.share}: ${w.rarity})`);
  }
  const need = ["Card", "Numbers", "Code", "Serves"].concat(isGear ? ["Stats"] : []);
  const lack = need.filter((f) => !e.fields.has(f));
  if (lack.length) missingField.push(`${e.name} (${e.share}): no ${lack.join(", ")}`);
}
say("Not in the spine, and not a common", extra);
say("In the wrong share, kind or rarity", wrong);
say("Commons against each kind's row", Object.keys(commons).filter((k) => present.has(SHARE_OF_KIND[k]) && (commonsHave[k] ?? 0) !== commons[k]).map((k) => `${k}: ${commonsHave[k] ?? 0} written, ${commons[k]} in the stock`));
say("Steps that aren't the budget", overUnder);
say("Stats the check can't read", badStat);
say("A special stat high below legendary", highs);
say("Entries missing a field", missingField);
say("Files missing an end heading", Object.entries(ends).filter(([, v]) => v.length < END.length).map(([s, v]) => `${s}: has ${v.join(", ") || "none"}`));

const cards = new Map<string, Entry[]>();
for (const e of real) {
  const c = e.card.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
  if (c && c !== "nothing beyond its stats") cards.set(c, [...(cards.get(c) ?? []), e]);
}
say("Cards that read the same, word for word", [...cards.values()].filter((v) => v.length > 1).map((v) => `${v.map((e) => `${e.name} (${e.share})`).join(" = ")}: ${v[0].card}`));

console.log(out.join("\n"));
if (process.argv.includes("--cards")) {
  for (const f of files) {
    const share = f.replace(/\.md$/, "");
    console.log(`\n# ${share}\n`);
    for (const e of real.filter((x) => x.share === share)) console.log(`- **${e.name}** · ${e.is} · ${e.card}${e.stats ? ` · [${e.stats}]` : ""}`);
  }
}
