/**
 * The build's helper for a share's plain pieces. Scratch: it goes when the step closes.
 *
 *   npx tsx steps/loot/commons.ts <share>          the share's plain pieces as content lines, section by section
 *   npx tsx steps/loot/commons.ts <share> --rest   the catalog's other entries, without the plain ones (what's left to write)
 *
 * A plain piece is one whose card is only its stats ("Nothing beyond its stats.") or its swing trade alone. Each line calls
 * the share's own helper for its slot: weapon(kind, ...), armor(kind, ...), amulet(...), offhand(kind, ...).
 */
import { readFileSync } from "node:fs";

const [share, flag] = process.argv.slice(2);
if (!share) { console.error("usage: npx tsx steps/loot/commons.ts <share> [--rest]"); process.exit(2); }

type Entry = { name: string; section: string; lines: string[]; f: Record<string, string> };
const entries: Entry[] = [];
let section = "", cur: Entry | null = null;
for (const line of readFileSync(`steps/loot/build/${share}.md`, "utf8").split("\n")) {
  if (line.startsWith("## ")) { section = line.slice(3).trim(); cur = null; }
  else if (line.startsWith("### ")) entries.push((cur = { name: line.slice(4).trim(), section, lines: [], f: {} }));
  else if (cur && line.trim()) {
    cur.lines.push(line);
    const m = /^- \*\*(\w+):\*\*\s*(.*)$/.exec(line);
    if (m) cur.f[m[1].toLowerCase()] = m[2].trim();
  }
}
const PLAIN = ["Nothing beyond its stats.", "A heavier swing.", "A lighter swing."];
const plain = (e: Entry) => PLAIN.includes(e.f.card ?? "");

if (flag === "--rest") {
  let last = "";
  for (const e of entries.filter((x) => !plain(x))) {
    if (e.section !== last) console.log(`\n## ${(last = e.section)}`);
    console.log(`### ${e.name}`);
    for (const l of e.lines) console.log(l);
  }
  process.exit(0);
}

const STAT: Record<string, string> = { attack: "attack", defense: "defense", hp: "max_hp", mp: "max_mp", "mp regen": "mp_regen", aggro: "aggro" };
const SPECIALS: Record<string, string> = {
  "attack speed": "attack_speed", cooldown: "cooldown", "cast speed": "cast_speed", evasion: "evasion", accuracy: "accuracy", "crit damage": "crit_damage",
  "double strike": "double_strike", thorns: "thorns", lifesteal: "lifesteal", siphon: "siphon",
};
function stats(line: string): { code: string[]; trade?: string } {
  const code: string[] = [];
  let trade: string | undefined;
  for (const part of line.replace(/\(\d+ of \d+\)\s*$/, "").split("·").map((x) => x.trim().toLowerCase()).filter(Boolean)) {
    if (part === "a heavier swing") { trade = "heavy"; continue; }
    if (part === "a lighter swing") { trade = "light"; continue; }
    const step = /^(.+?)\s*([+−-])(\d+)$/.exec(part), word = /^(.+?)\s+(medium|high)$/.exec(part);
    const n = step ? (step[2] === "+" ? "" : "-") + step[3] : "";
    if (step && step[1] === "crit chance") code.push(`critStep(${n})`);
    else if (step && STAT[step[1]]) code.push(`st("${STAT[step[1]]}", ${n})`);
    else if (word && SPECIALS[word[1]]) code.push(`sp("${SPECIALS[word[1]]}", "${word[2]}")`);
    else throw new Error(`a Stats part I can't read: '${part}'`);
  }
  return { code, trade };
}
const KIND = (k: string) => k.replace(/ weapons?$/, "").replace(/ /g, "_");
let last = "";
for (const e of entries.filter(plain)) {
  if (e.section !== last) console.log(`\n// ${(last = e.section)}`);
  const [kindWord, rarity] = (e.f.is ?? "").split("·").map((x) => x.trim());
  const s = stats(e.f.stats ?? "");
  const body = `{ stats: [${s.code.join(", ")}]${s.trade ? `, trade: "${s.trade}"` : ""}, serves: ${JSON.stringify(e.f.serves ?? "")} }`;
  const fn = share.startsWith("weapons") ? "weapon" : share === "armor" ? "armor" : share === "amulets" ? "amulet" : "offhand";
  const head = fn === "amulet" ? `"${rarity}"` : `"${KIND(kindWord)}", "${rarity}"`;
  console.log(`${fn}(${head}, ${JSON.stringify(e.name)}, ${body});`);
}
