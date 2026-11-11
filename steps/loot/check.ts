/**
 * The build's check of one share against its catalog (steps/loot/build/<share>.md). Scratch: it goes when the step closes.
 *
 *   npx tsx steps/loot/check.ts <share> [--no-play] [--only <ids>] [--seeds 1]
 *
 * <share>: weapons-1, weapons-2, armor, amulets, offhands-1, offhands-2, formations, versions-mythics, or all.
 *
 * It builds a pack from the base content and this share alone (so another share's half-written file can't break it), and then:
 *  1. validates it (the validator's errors, and its warnings about this share's items);
 *  2. compares every catalog entry with the content: the item exists under its name, with its kind, slot and rarity, its
 *     card word for word, and its stat steps exactly (a shape stat that counts no step is allowed beside them);
 *  3. plays the piece check on the share's items (quick: nine fights, one seed) and lists its problems: can't field, crash,
 *     loop, never fires, no effect. "Wrong way" is the balance pass's, and is listed apart.
 * Output: out/loot/<share>/report.md (the piece check's own), and a summary here. Exit code 1 on any mismatch or error.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import type { ContentPack, FormationT, GearT, StatusT, UpgradeT, AbilityT } from "../../src/schema.js";
import { validatePack } from "../../src/validate.js";
import { crit, MP_REGEN_STEP, SPECIAL, SPECIAL_KEY, stepFor, type SpecialStat } from "../../content/core-set/scale.js";
import { idOf, stepsOf } from "../../content/core-set/pieces/kit.js";

const GEAR_SHARES = ["weapons-1", "weapons-2", "armor", "amulets", "offhands-1", "offhands-2"];
const ALL = [...GEAR_SHARES, "formations", "versions-mythics"];
const args = process.argv.slice(2);
const share = args[0];
if (!share || (share !== "all" && !ALL.includes(share))) {
  console.error(`usage: npx tsx steps/loot/check.ts <${ALL.join(" | ")} | all> [--no-play] [--only ids] [--seeds n]`);
  process.exit(2);
}
const opt = (k: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const wanted = share === "all" ? ALL : [share];

// ─── The catalog ────────────────────────────────────────────────────────────

type Entry = { name: string; is: string; card: string; stats: string; section: string };
function catalog(sh: string): Entry[] {
  const md = readFileSync(`steps/loot/build/${sh}.md`, "utf8");
  const out: Entry[] = [];
  let section = "", cur: Entry | null = null;
  for (const line of md.split("\n")) {
    if (line.startsWith("## ")) section = line.slice(3).trim();
    else if (line.startsWith("### ")) out.push((cur = { name: line.slice(4).trim(), is: "", card: "", stats: "", section }));
    else if (cur) {
      const m = /^- \*\*(Is|Card|Stats):\*\*\s*(.*)$/.exec(line);
      if (m) cur[m[1].toLowerCase() as "is" | "card" | "stats"] = m[2].trim();
    }
  }
  return out;
}

const KIND: Record<string, { slot: GearT["slot"]; kind?: string }> = {
  dagger: { slot: "weapon", kind: "dagger" }, fist: { slot: "weapon", kind: "fist" }, wand: { slot: "weapon", kind: "wand" }, sword: { slot: "weapon", kind: "sword" },
  spear: { slot: "weapon", kind: "spear" }, axe: { slot: "weapon", kind: "axe" }, bow: { slot: "weapon", kind: "bow" }, "rune sword": { slot: "weapon", kind: "rune_sword" },
  hammer: { slot: "weapon", kind: "hammer" }, mace: { slot: "weapon", kind: "mace" }, staff: { slot: "weapon", kind: "staff" }, "great weapon": { slot: "weapon", kind: "great_weapon" },
  plate: { slot: "armor", kind: "plate" }, mail: { slot: "armor", kind: "mail" }, leather: { slot: "armor", kind: "leather" }, robes: { slot: "armor", kind: "robes" },
  amulet: { slot: "amulet" },
  ...Object.fromEntries(["kite shield", "round shield", "horn", "totem", "relic", "lantern", "tome", "orb", "idol", "vial", "trophy", "bell", "cloak"].map((k) => [k, { slot: "offhand" as const, kind: k.replace(" ", "_") }])),
};
const STAT: Record<string, string> = { attack: "attack", defense: "defense", hp: "max_hp", mp: "max_mp", "mp regen": "mp_regen", aggro: "aggro" };
const SPECIALS: Record<string, SpecialStat> = {
  "attack speed": "attack_speed", cooldown: "cooldown", "cast speed": "cast_speed", evasion: "evasion", accuracy: "accuracy", "crit damage": "crit_damage",
  "double strike": "double_strike", thorns: "thorns", lifesteal: "lifesteal", siphon: "siphon",
};
type Change = { stat: string; flat: number };
/** A catalog Stats line as stat changes: "Crit chance +1 · Attack speed medium (2 of 2)". A swing word isn't a stat. */
function statsOf(line: string): { changes: Change[]; trade?: "heavy" | "light"; steps: number } {
  const steps = Number(/\((\d+) of \d+\)\s*$/.exec(line)?.[1] ?? 0);
  const changes: Change[] = [];
  let trade: "heavy" | "light" | undefined;
  for (const part of line.replace(/\(\d+ of \d+\)\s*$/, "").split("·").map((x) => x.trim()).filter(Boolean)) {
    const p = part.toLowerCase();
    if (p === "a heavier swing") { trade = "heavy"; continue; }
    if (p === "a lighter swing") { trade = "light"; continue; }
    const step = /^(.+?)\s*([+−-])(\d+)$/.exec(p);
    const word = /^(.+?)\s+(medium|high)$/.exec(p);
    if (step && step[1] === "crit chance") changes.push({ stat: "crit_chance", flat: crit(Number(step[3])) });
    else if (step && STAT[step[1]]) changes.push({ stat: STAT[step[1]], flat: (step[2] === "+" ? 1 : -1) * Number(step[3]) * stepFor(STAT[step[1]]) });
    else if (word && SPECIALS[word[1]]) changes.push({ stat: SPECIAL_KEY[SPECIALS[word[1]]], flat: SPECIAL[SPECIALS[word[1]]][word[2] as "medium" | "high"] });
    else throw new Error(`a Stats line I can't read: '${part}' in '${line}'`);
  }
  return { changes, trade, steps };
}
void MP_REGEN_STEP;

// ─── The pack: the base content, and one share ──────────────────────────────

const NEUTRAL: FormationT = {
  id: "neutral", name: "Neutral", text: "Three slots that do nothing.", rarity: "common", source: "starter",
  positions: [{ id: "a", name: "Left", layout: { line: "front", column: 0 } }, { id: "b", name: "Centre", layout: { line: "middle", column: 1 } }, { id: "c", name: "Right", layout: { line: "back", column: 2 } }],
};

async function packFor(sh: string): Promise<{ pack: ContentPack; ids: string[]; gear: GearT[]; formations: FormationT[]; upgrades: UpgradeT[]; abilities: AbilityT[]; statuses: StatusT[] }> {
  const voc = await import("../../content/core-set/vocabulary.js");
  const cls = await import("../../content/core-set/classes.js");
  const foes = await import("../../content/core-set/enemies.js");
  const dun = await import("../../content/core-set/dungeons.js");
  const plain = await import("../../content/core-set/gear.js");
  const rogue = await import("../../content/core-set/rogue.js");
  const shared = await import("../../content/core-set/pieces/shared.js");
  let gear: GearT[] = [], statuses: StatusT[] = [], formations: FormationT[] = [NEUTRAL], upgrades: UpgradeT[] = [], abilities: AbilityT[] = [];
  if (GEAR_SHARES.includes(sh)) {
    const m = await import(`../../content/core-set/pieces/${sh}.js`);
    gear = m.gear; statuses = m.statuses;
  } else if (sh === "formations") {
    const m = await import("../../content/core-set/formations.js");
    formations = m.formations; statuses = m.effects;
  } else {
    const m = await import("../../content/core-set/upgrades/index.js");
    gear = m.mythics; statuses = m.statuses; upgrades = m.upgrades; abilities = m.abilities;
  }
  const pack: ContentPack = {
    schemaVersion: "0.12", id: `check_${sh.replace(/-/g, "_")}`, title: `The core set with ${sh} alone`, design: voc.design, ruleset: voc.ruleset,
    stats: voc.stats, weaponKinds: voc.weaponKinds, armorTypes: voc.armorTypes, offhandKinds: voc.offhandKinds,
    statuses: [...voc.vocabulary, ...voc.machinery, ...cls.passives, ...foes.enemyStatuses, ...shared.sharedStatuses, ...statuses],
    classes: cls.classes, abilities: [...cls.abilities, ...foes.enemyAbilities, ...abilities], upgrades,
    gear: [...plain.gear, ...gear], formations, enemies: foes.enemies, perkFamilies: [], perks: [], dungeons: dun.dungeons,
    starter: { classes: cls.classes.filter((c) => c.source === "starter").map((c) => c.id), formations: ["neutral"], gear: plain.gear.map((g) => g.id) },
    progression: { dungeonOrder: dun.dungeons.map((d) => d.id) },
    rogue: { config: rogue.ROGUE_CONFIG, regions: rogue.ROGUE_REGIONS, events: rogue.ROGUE_EVENTS },
  } as ContentPack;
  const ids = [...gear.map((g) => g.id), ...formations.filter((f) => f.id !== "neutral").map((f) => f.id), ...upgrades.map((u) => u.id)];
  return { pack: JSON.parse(JSON.stringify(pack)), ids, gear, formations, upgrades, abilities, statuses };
}

// ─── Comparing the content with the catalog ─────────────────────────────────

const norm = (s: string) => s.replace(/\s+/g, " ").trim();
const same = (a: number, b: number) => Math.abs(a - b) < 1e-6;

function checkPiece(e: Entry, gear: GearT[], out: string[]) {
  const [kindWord, rarity] = e.is.split("·").map((x) => x.trim());
  const k = KIND[kindWord];
  if (!k) return void out.push(`${e.name}: the catalog's kind '${kindWord}' isn't one I know`);
  const g = gear.find((x) => x.id === idOf(e.name)) as (GearT & { rarity?: string }) | undefined;
  if (!g) return void out.push(`${e.name}: missing (no piece '${idOf(e.name)}')`);
  if (g.name !== e.name) out.push(`${e.name}: named '${g.name}'`);
  if (g.rarity !== rarity) out.push(`${e.name}: ${g.rarity}, not ${rarity}`);
  if (g.slot !== k.slot) out.push(`${e.name}: in the ${g.slot} slot, not ${k.slot}`);
  const kind = g.slot === "weapon" ? g.weapon?.kind : g.slot === "armor" ? g.armor : g.slot === "offhand" ? g.offhand : undefined;
  if (kind !== k.kind) out.push(`${e.name}: kind ${kind}, not ${k.kind}`);
  if (norm(g.text ?? "") !== norm(e.card)) out.push(`${e.name}: the card differs.\n      catalog: ${norm(e.card)}\n      content: ${norm(g.text ?? "")}`);
  const want = statsOf(e.stats);
  const have = (g.stats ?? []) as Change[];
  for (const c of want.changes) if (!have.some((h) => h.stat === c.stat && same(h.flat, c.flat))) out.push(`${e.name}: stats lack ${c.stat} ${c.flat} (the catalog: ${e.stats})`);
  if (stepsOf(have) !== want.steps) out.push(`${e.name}: carries ${stepsOf(have)} stat steps, not ${want.steps} (the catalog: ${e.stats}; content: ${have.map((h) => `${h.stat} ${h.flat}`).join(", ")})`);
}

/** A formation's card: its line, then each seat ("**Name:** text", "**Name** (two seats): text"), and maybe "**The party:** text". */
function checkFormation(e: Entry, formations: FormationT[], out: string[]) {
  const f = formations.find((x) => x.id === idOf(e.name));
  if (!f) return void out.push(`${e.name}: missing (no formation '${idOf(e.name)}')`);
  const rarity = e.is.split("·")[1]?.trim();
  if (f.rarity !== rarity) out.push(`${e.name}: ${f.rarity}, not ${rarity}`);
  const parts = e.card.split(/\*\*(.+?)\*\*/);
  const summary = norm(parts[0]);
  let party = "";
  const seats: { name: string; text: string }[] = [];
  for (let i = 1; i < parts.length; i += 2) {
    const head = parts[i].trim(), body = parts[i + 1] ?? "";
    const m = /^\s*(?:\((two seats|all three seats)\))?:?\s*([\s\S]*)$/.exec(body)!;
    const name = head.replace(/:$/, "").trim(), text = norm(m[2]);
    if (name === "The party") party = text;
    else for (let n = m[1] === "two seats" ? 2 : m[1] === "all three seats" ? 3 : 1; n > 0; n--) seats.push({ name, text });
  }
  const wantText = party ? `${summary} The party: ${party}` : summary;
  if (norm(f.text) !== wantText) out.push(`${e.name}: the formation's text differs.\n      catalog: ${wantText}\n      content: ${norm(f.text)}`);
  if (f.positions.length !== 3) out.push(`${e.name}: ${f.positions.length} seats`);
  // Seats are compared as a set of (name, text): the catalog doesn't fix their order.
  const have = f.positions.map((p) => `${p.name}: ${norm(p.text ?? "Nothing of its own.")}`).sort();
  const want = seats.map((s) => `${s.name}: ${s.text}`).sort();
  if (have.join(" | ") !== want.join(" | ")) out.push(`${e.name}: the seats differ.\n      catalog: ${want.join(" | ")}\n      content: ${have.join(" | ")}`);
}

function checkVersions(entries: Entry[], x: Awaited<ReturnType<typeof packFor>>, out: string[]) {
  for (const e of entries) {
    const is = e.is.split("·").map((s) => s.trim());
    if (is[1] === "version") {
      const m = /^(.+?), (.+) ([AB])$/.exec(is[0]);
      if (!m) { out.push(`${e.name}: an Is line I can't read: '${e.is}'`); continue; }
      const u = x.upgrades.find((u2) => u2.id === idOf(m[2]) && u2.class === idOf(m[1]));
      if (!u) { out.push(`${e.name}: no upgrade for ${m[1]}'s ${m[2]}`); continue; }
      const v = u[m[3].toLowerCase() as "a" | "b"];
      if (v.name !== e.name) out.push(`${e.name}: ${m[2]} ${m[3]} is named '${v.name}'`);
      if (norm(v.text) !== norm(e.card)) out.push(`${e.name}: the card differs.\n      catalog: ${norm(e.card)}\n      content: ${norm(v.text)}`);
    } else if (is[1]?.startsWith("mythic")) {
      const slot = /\((\w+)\)/.exec(is[1])?.[1];
      const g = x.gear.find((g2) => g2.id === idOf(e.name));
      if (!g) { out.push(`${e.name}: missing (no mythic '${idOf(e.name)}')`); continue; }
      if (g.mythic !== idOf(is[0])) out.push(`${e.name}: fits ${g.mythic}, not ${idOf(is[0])}`);
      if (g.slot !== slot) out.push(`${e.name}: in the ${g.slot} slot, not ${slot}`);
      if (norm(g.text ?? "") !== norm(e.card)) out.push(`${e.name}: the card differs.\n      catalog: ${norm(e.card)}\n      content: ${norm(g.text ?? "")}`);
    } else if (e.name === "Marked") {
      const st = x.pack.statuses.find((s) => s.id === "marked");
      if (norm(st?.text ?? "") !== norm(e.card)) out.push(`Marked: the status's text differs.\n      catalog: ${norm(e.card)}\n      content: ${norm(st?.text ?? "")}`);
    } else if (e.name === "Malison") {
      const a = x.pack.abilities.find((s) => s.id === "malison");
      if (norm(a?.text ?? "") !== norm(e.card)) out.push(`Malison: the ability's text differs.\n      catalog: ${norm(e.card)}\n      content: ${norm(a?.text ?? "")}`);
    }
  }
  const mythics = x.gear.filter((g) => g.mythic);
  if (mythics.length !== 16 || new Set(mythics.map((g) => g.mythic)).size !== 16) out.push(`${mythics.length} mythics for ${new Set(mythics.map((g) => g.mythic)).size} classes: every class has one`);
}

// ─── Main ───────────────────────────────────────────────────────────────────

let failed = false;
for (const sh of wanted) {
  console.log(`\n══ ${sh} ══`);
  const entries = catalog(sh);
  let x: Awaited<ReturnType<typeof packFor>>;
  try {
    x = await packFor(sh);
  } catch (err) {
    console.log(`✗ the content doesn't load: ${err instanceof Error ? err.message : err}`);
    failed = true;
    continue;
  }
  // 1. The validator.
  const v = validatePack(x.pack);
  const mine = (path: string) => !/^(dungeons|rogue|enemies|classes|starter|progression|design)/.test(path);
  const errors = v.issues.filter((i) => i.level === "error");
  const warns = v.issues.filter((i) => i.level !== "error" && mine(i.path) && !["status.unused", "gear.plain", "upgrade.missing", "class.upgrades", "ability.unused"].includes(i.code) && !/status .(cuts|spite|crescendo|cascade). has no effects/.test(i.message));
  console.log(`validator: ${errors.length} errors, ${warns.length} warnings of this share's`);
  for (const i of [...errors, ...warns].slice(0, 60)) console.log(`  ${i.level === "error" ? "ERROR" : "warn "} [${i.code}] ${i.path}: ${i.message}`);
  if (errors.length) failed = true;

  // 2. The catalog.
  const out: string[] = [];
  if (GEAR_SHARES.includes(sh)) {
    for (const e of entries) checkPiece(e, x.gear, out);
    const extra = x.gear.filter((g) => !entries.some((e) => idOf(e.name) === g.id));
    if (extra.length) out.push(`not in the catalog: ${extra.map((g) => g.name).join(", ")}`);
  } else if (sh === "formations") {
    for (const e of entries) checkFormation(e, x.formations, out);
    const extra = x.formations.filter((f) => f.id !== "neutral" && !entries.some((e) => idOf(e.name) === f.id));
    if (extra.length) out.push(`not in the catalog: ${extra.map((f) => f.name).join(", ")}`);
  } else checkVersions(entries, x, out);
  console.log(`catalog: ${entries.length} entries, ${out.length} mismatches`);
  for (const line of out) console.log(`  ✗ ${line}`);
  if (out.length) failed = true;

  // 3. The piece check, on this share's pack.
  if (args.includes("--no-play") || errors.length) continue;
  mkdirSync(`out/loot/${sh}`, { recursive: true });
  const packPath = `out/loot/${sh}/pack.json`;
  writeFileSync(packPath, JSON.stringify(x.pack));
  const only = opt("--only");
  try {
    const res = execFileSync("npx", ["tsx", "tools/piece-check.ts", "--pack", packPath, "--out", `out/loot/${sh}`, "--seeds", opt("--seeds") ?? "1", "--quick", ...(only ? ["--only", only] : [])], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 1 << 26 });
    console.log(res.trim().split("\n").map((l) => `  ${l}`).join("\n"));
    const rep = JSON.parse(readFileSync(`out/loot/${sh}/report.json`, "utf8")) as { items: { id: string; problems: string[]; notes: string[]; error?: string }[] };
    const bad = rep.items.filter((it) => it.problems.some((p) => p !== "wrong way" && p !== "untested" && p !== "weaker than its base"));
    for (const it of bad) console.log(`  ✗ ${it.id}: ${it.problems.join(", ")}${it.error ? ` (${it.error})` : ""}${it.notes.length ? ` — ${it.notes.join("; ")}` : ""}`);
    const soft = rep.items.filter((it) => !bad.includes(it) && it.problems.length);
    if (soft.length) console.log(`  (for the balance pass, not this one: ${soft.map((it) => `${it.id} ${it.problems.join("/")}`).join(", ")})`);
    if (bad.some((it) => it.problems.some((p) => ["can't field", "crash", "loop"].includes(p)))) failed = true;
  } catch (err) {
    console.log(`✗ the piece check failed: ${(err as { stderr?: string }).stderr ?? err}`);
    failed = true;
  }
}
process.exit(failed ? 1 : 0);
