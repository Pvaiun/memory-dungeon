/**
 * What studies print. A digest for the AI after every study: one screen, the
 * key numbers with their ranges, what changed since the last run, and flags.
 * A draft report for the director when one's needed: the facts in the fixed
 * shape (in short, questions, stories, charts, how it was run), for the AI to
 * write the words on top.
 */
import type { CombatResults, TargetResult } from "./combat.js";
import { BLOCKS, num, pct, rangePct, said, type Comparison } from "./sure.js";

export type Headline = Record<string, number>;

const short = (name: string) => name.replace("Hollow of the Grey Mother", "Hollow");
const tries = (t: number) => (t === Infinity ? "never wins" : `${num(t)} tries`);
const best = (t: TargetResult) => [...t.parties].sort((a, b) => b.wins.value - a.wins.value || b.progress.value - a.progress.value)[0];

/** Short words for a comparison, for the digest: "+1.86 (20/20)", "≈ (11/20)", "identical". */
const brief = (c: Comparison) =>
  c.verdict === "identical" ? "identical" : c.verdict === "no clear difference" ? `≈ (${c.holds}/${BLOCKS})` : `${c.diff.value > 0 ? "+" : ""}${num(c.diff.value, 2)} (${c.holds}/${BLOCKS})`;

/** A bar drawn in text: "████▌ 4.5". */
export function bar(value: number, max: number, width = 20): string {
  const cells = max > 0 ? Math.round(Math.max(0, (value / max) * width) * 2) / 2 : 0;
  return "█".repeat(Math.floor(cells)) + (cells % 1 ? "▌" : "");
}

export function combatHeadline(r: CombatResults): Headline {
  const h: Headline = {};
  for (const v of r.variants) for (const t of v.targets) {
    const p = `${v.name}|${t.target.key}`;
    h[`${p}|best win`] = best(t).wins.value;
    h[`${p}|colours that win`] = t.strictness.winning.length;
  }
  return h;
}

function changesAndFlags(now: Headline, before: Headline | null, expect: { key: string; between: [number, number] }[]): string[] {
  const out: string[] = [];
  const flags = expect.filter((e) => now[e.key] === undefined || now[e.key] < e.between[0] || now[e.key] > e.between[1]);
  out.push(flags.length ? `FLAGS: ${flags.map((e) => `${e.key} is ${now[e.key] ?? "missing"}, expected ${e.between[0]}–${e.between[1]}`).join("; ")}` : "Flags: none");
  if (!before) out.push("Since last run: first run");
  else {
    const changed = Object.keys(now).filter((k) => before[k] !== now[k]);
    out.push(changed.length ? `Since last run: ${changed.length} changed: ${changed.slice(0, 4).map((k) => `${k} ${before[k] ?? "–"} → ${+now[k].toFixed(3)}`).join("; ")}${changed.length > 4 ? "; …" : ""}` : "Since last run: no change");
  }
  return out;
}

const runLine = (r: { study: { id: string; heldOut: boolean }; runs: number; rules: string; content: { id: string; fingerprint: string } }, ms: number, engine: string) =>
  `${r.study.id} · ${r.runs.toLocaleString("en")} runs in ${num(ms / 1000)} s · engine ${engine}, ${r.rules}, ${r.content.id}#${r.content.fingerprint.slice(0, 8)} · ${r.study.heldOut ? "HELD OUT" : "tuning"}`;

export function combatDigest(r: CombatResults, ms: number, engine: string, before: Headline | null): string {
  const s = r.study;
  const base = r.variants[0];
  const dungeons = base.targets.filter((t) => !t.target.challenge);
  const challenges = base.targets.filter((t) => t.target.challenge);
  const L: string[] = [runLine(r, ms, engine), `Seeds ${s.seeds} in ${BLOCKS} blocks · perks ${s.perks === "random" ? "random" : "by a fixed list"} · "can win" = ${pct(s.bar)} of tries · versions: ${s.variants.map((v) => v.name).join(", ")}`, ""];
  L.push(`${base.name}: best party, its wins, tries to a first win, colours that can win, tweaks that win inside them`);
  for (const t of dungeons) {
    const b = best(t);
    const st = t.strictness;
    L.push(`  ${short(t.target.name).padEnd(9)} ${b.label.replace(/ \(.*\)/, "").padEnd(26)} ${rangePct(b.wins).padEnd(16)} ${tries(b.tries).padEnd(11)} ${st.winning.length}/${st.colours} colours  ${st.tweaksWinning} in ${st.tweaks} tweaks`);
  }
  if (challenges.length) {
    const none = challenges.filter((t) => !t.strictness.winning.length);
    L.push(`  Challenges: ${challenges.length - none.length} of ${challenges.length} winnable${none.length ? `; nothing wins ${none.map((t) => short(t.target.name).replace(/\.$/, "")).join("; ")}` : ""}`);
  }
  const losses = dungeons.flatMap((t) => t.parties.map((p) => ({ p, t })));
  const lostTotal = losses.reduce((n, { p }) => n + Object.values(p.lostIn).reduce((a, b) => a + b, 0), 0);
  const atBoss = losses.reduce((n, { p, t }) => n + (p.lostIn[lastFight(t)] ?? 0), 0);
  if (lostTotal) L.push(`Losses: ${pct(atBoss / lostTotal)} at the boss`);
  const hard = dungeons.at(-1);
  if (hard) {
    const eff = [...hard.classes, ...hard.sizes].map((e) => `${e.factor} ${brief(e.comparison)}`);
    L.push(`What matters, ${short(hard.target.name)}, in fights: ${eff.join("; ")}`);
    const pairs = hard.pairs.filter((p) => p.standsOut);
    L.push(`Synergies: ${pairs.length ? pairs.map((p) => `${p.pair} +${num(p.extra)} fights`).join("; ") : "no pair stands out"}`);
  }
  if (base.tweaks.length) L.push(`Tweaks, in fights: ${base.tweaks.map((e) => `${e.factor} ${brief(e.comparison)}`).join("; ")}`);
  const perks = dungeons.flatMap((t) => t.perks);
  if (perks.length) {
    const same = perks.every((p) => Math.abs(p.hindsight - p.worst) < 1e-9);
    const spread = Math.max(...perks.map((p) => p.hindsight - p.worst));
    L.push(`Perks, ${perks.length} party-dungeons: ${same ? "hindsight = knowable = random = worst on every one" : `best minus worst up to ${num(spread, 2)} (score: fights + 1 for a win)`}`);
  }
  for (const v of r.variants.slice(1)) {
    const vs = v.versus!.filter((x) => !x.target.includes(":"));
    const up = vs.filter((x) => x.wins.verdict === "higher").length, down = vs.filter((x) => x.wins.verdict === "lower").length;
    L.push(`${v.name} vs ${base.name}, wins by dungeon: ${up} higher, ${down} lower, ${vs.length - up - down} no clear difference or identical`);
  }
  L.push(...changesAndFlags(combatHeadline(r), before, s.expect));
  return L.join("\n");
}

const lastFight = (t: TargetResult) => Object.keys(t.parties[0]?.rounds ?? {}).at(-1) ?? "";

export function combatDraft(r: CombatResults, engine: string, fights: string[]): string {
  const base = r.variants[0];
  const dungeons = base.targets.filter((t) => !t.target.challenge);
  const hard = dungeons.at(-1)!;
  const facts = dungeons.map((t) => {
    const b = best(t);
    return `- ${short(t.target.name)}: ${t.strictness.winning.length} of ${t.strictness.colours} colours can win (${t.strictness.winning.join(", ") || "none"}); inside them ${t.strictness.tweaksWinning} in ${t.strictness.tweaks} tweaks win. Best: ${b.label}, ${rangePct(b.wins)}.`;
  });
  const chart = [...hard.parties].sort((a, b) => b.wins.value - a.wins.value).map((p) => `${p.label.replace(/ \(.*\)/, "").padEnd(26)} ${bar(p.wins.value, 1).padEnd(20)} ${pct(p.wins.value)}`);
  return [
    `# Combat: ${r.study.id}`,
    "",
    "## In short",
    "",
    "<!-- The AI writes a few sentences here, words first, each saying how sure it is. The facts: -->",
    ...facts,
    ...base.tweaks.map((e) => `- ${e.factor}: ${said(e.comparison)}.`),
    ...hard.classes.map((e) => `- ${short(hard.target.name)}, ${e.factor}: ${said(e.comparison)} (${num(e.comparison.diff.value, 2)} fights).`),
    "",
    "## Questions for you",
    "",
    "<!-- Only where a call is subjective. -->",
    "",
    "## Stories",
    "",
    "<!-- A fight retold in 3 to 5 lines, from a reading pack. Picked by rule: -->",
    ...fights.map((f) => `- ${f}`),
    "",
    "## Charts",
    "",
    `**${short(hard.target.name)}: how often each party wins**`,
    "```",
    ...chart,
    "```",
    "",
    `**How it was run:** ${r.study.seeds} seeds per party, ${r.runs.toLocaleString("en")} runs, engine ${engine}, ${r.rules}, content ${r.content.id}, versions: ${r.study.variants.map((v) => v.name).join(", ")}. Tables in the data file.`,
    "",
  ].join("\n");
}
