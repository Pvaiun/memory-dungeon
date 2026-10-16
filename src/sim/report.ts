/**
 * What studies print. A digest for the AI after every study: one screen, the
 * key numbers with their ranges, what changed since the last run, and flags.
 * A draft report for the director when one's needed: the facts in the fixed
 * shape (in short, questions, stories, charts, how it was run), for the AI to
 * write the words on top.
 */
import type { CombatResults, TargetResult } from "./combat.js";
import type { PlayerLog, ProgressionResults, Versus } from "./progression.js";
import { BLOCKS, num, pct, rangeNum, rangePct, said, type Comparison } from "./sure.js";

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

export function progressionHeadline(r: ProgressionResults): Headline {
  const h: Headline = {};
  for (const k of r.summaries) {
    h[`${k.kind}|dungeons by the last week`] = k.byWeek.at(-1)!.dungeons.value;
    h[`${k.kind}|stuck weeks`] = k.stuckWeeks;
    h[`${k.kind}|walled by quests`] = k.byQuests;
    h[`${k.kind}|walls`] = k.walls.count;
  }
  h["benchmark behind the optimizer"] = r.benchmarkBehind;
  return h;
}

/** Changes since the last run, and numbers outside their expected range. */
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

export function progressionDigest(r: ProgressionResults, ms: number, engine: string, before: Headline | null, versus: Versus[] = []): string {
  const s = r.study;
  const [opt, cas] = r.summaries;
  const L: string[] = [runLine(r, ms, engine), `${s.players} players of each kind × ${s.weeks} weeks · board ${s.board[0]}–${s.board[1]} · optimizer ${pct(s.optimizer.quests)} of quests, ${s.optimizer.tries} tries a week · casual ${s.casual.quests.join("–")} quests, ${s.casual.runs.join("–")} runs`, ""];
  L.push("Dungeons cleared by week (mean)   unlocks owned (optimizer)   share stuck: optimizer, casual");
  L.push("  week  optimizer  benchmark  casual");
  opt.byWeek.forEach((w, i) => {
    const c = cas.byWeek[i];
    L.push(`  ${String(w.week).padStart(4)}  ${num(w.dungeons.value).padStart(9)}  ${num(w.benchmark!.value).padStart(9)}  ${num(c.dungeons.value).padStart(6)}   ${num(w.owned.value).padStart(4)}   ${pct(w.stuck).padStart(4)} ${pct(c.stuck).padStart(4)}`);
  });
  for (const k of r.summaries) {
    const n = s.players * s.weeks;
    L.push(`${k.kind}: stuck ${k.stuckWeeks} of ${n} weeks: by quests ${k.byQuests}, by play ${k.byPlay.total} (owns a winner ${k.byPlay.ownsWinner}, challenges left ${k.byPlay.challengesLeft})`);
    L.push(`  walls ${k.walls.count}, ${rangeNum(k.walls.weeks)} weeks, longest ${k.walls.longest}; sorted → ended: ${Object.entries(k.walls.sortedThenEnded).sort((a, b) => b[1] - a[1]).map(([b, x]) => `${b} ${x}`).join("; ") || "–"}`);
    L.push(`  board ran dry for ${k.dry.players} players, median week ${k.dry.median ?? "–"}; choices matter for ${k.matters.players} players, median week ${k.matters.median ?? "–"}${k.perksChange !== null ? `; perks change the result at walls on ${pct(k.perksChange)} of seeds` : ""}`);
  }
  L.push(`Optimizer vs casual, dungeon-weeks: ${said(r.optimizerVsCasual)}. Benchmark behind the optimizer: ${r.benchmarkBehind} player-weeks`);
  L.push(`Benchmark: ${r.bench.questions.toLocaleString("en")} questions, ${r.bench.runs.toLocaleString("en")} runs, at most ${r.bench.maxRuns} each (budget ${s.benchmark.budget}); ran out ${r.bench.budgetOut} times`);
  for (const v of versus)
    L.push(`${v.name} vs ${s.variants[0].name}: optimizer dungeon-weeks ${brief(v.optimizer)}, casual ${brief(v.casual)}; optimizer stuck weeks ${v.stuck[0]} → ${v.stuck[1]}, walled by quests ${v.byQuests[0]} → ${v.byQuests[1]}`);
  L.push(`Strictness, colours / tweaks that win: ${r.dungeons.map((d) => `${short(d.name).replace("Hollow ", "H")} ${d.strictness.winning.length}/${d.strictness.colours}, ${d.strictness.tweaksWinning}/${d.strictness.tweaks}`).join(" · ")}`);
  L.push(...changesAndFlags(progressionHeadline(r), before, s.expect));
  return L.join("\n");
}

// ─── Drafts for the director ────────────────────────────────────────────────

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

export function progressionDraft(r: ProgressionResults, engine: string): string {
  const [opt, cas] = r.summaries;
  const n = r.study.players * r.study.weeks;
  const max = Math.max(...opt.byWeek.map((w) => w.benchmark!.value), 1);
  const chart = opt.byWeek.map((w, i) => `${String(w.week).padStart(3)}  ${(bar(w.dungeons.value, max, 8) + " " + num(w.dungeons.value)).padEnd(13)} ${(bar(w.benchmark!.value, max, 8) + " " + num(w.benchmark!.value)).padEnd(13)} ${bar(cas.byWeek[i].dungeons.value, max, 8)} ${num(cas.byWeek[i].dungeons.value)}`);
  const names = new Map(r.dungeons.map((d) => [d.id, short(d.name)]));
  const sample = typical(r.players.filter((p) => p.kind === "optimizer"));
  const casual = typical(r.players.filter((p) => p.kind === "casual"));
  return [
    `# Progression: ${r.study.id}`,
    "",
    "## In short",
    "",
    "<!-- The AI writes a few sentences, words first, each saying how sure it is. The facts: -->",
    ...r.summaries.map((k) => `- ${k.kind}: ${num(k.byWeek.at(-1)!.dungeons.value)} of ${r.dungeons.length} dungeons by week ${r.study.weeks}. Stuck ${k.stuckWeeks} of ${n} player-weeks: ${k.byQuests} walled by quests, ${k.byPlay.total} by play (${k.byPlay.ownsWinner} owned a party that wins, ${k.byPlay.challengesLeft} had challenges left). ${k.walls.count} walls, ${rangeNum(k.walls.weeks)} weeks long, the longest ${k.walls.longest}; ended by ${Object.entries(k.walls.brokeBy).map(([b, x]) => `${b} ${x}`).join(", ") || "nothing"}.`),
    `- The benchmark was behind the optimizer in ${r.benchmarkBehind} player-weeks. The optimizer beat the casual player: ${said(r.optimizerVsCasual)}.`,
    `- Strictness: ${r.dungeons.map((d) => `${short(d.name)}, ${d.strictness.winning.length} of ${d.strictness.colours} colours`).join("; ")}.`,
    "",
    "## Questions for you",
    "",
    "<!-- Only where a call is subjective. -->",
    "",
    "## Stories",
    "",
    `<!-- A typical optimizer's weeks (player ${sample.seed}), as facts for a short diary: -->`,
    ...diary(sample, names),
    "",
    `<!-- A typical casual player's weeks (player ${casual.seed}): -->`,
    ...diary(casual, names),
    "",
    "## Charts",
    "",
    "**Dungeons cleared by week, with the same unlocks**",
    "```",
    "week  optimizer     benchmark     casual",
    ...chart,
    "```",
    "",
    `**How it was run:** ${r.study.players} players of each kind, ${r.study.weeks} weeks, ${r.runs.toLocaleString("en")} runs, engine ${engine}, ${r.rules}, content ${r.content.id}. Tables in the data file.`,
    "",
  ].join("\n");
}

/** The player whose dungeon curve is closest to the median player's. */
function typical(ps: PlayerLog[]): PlayerLog {
  const curve = (p: PlayerLog) => p.weeks.map((w) => w.dungeons);
  const med = ps[0].weeks.map((_, j) => [...ps.map((p) => p.weeks[j].dungeons)].sort((a, b) => a - b)[Math.floor(ps.length / 2)]);
  const dist = (p: PlayerLog) => curve(p).reduce((s, x, j) => s + Math.abs(x - med[j]), 0) + p.seed / 1e6;
  return [...ps].sort((a, b) => dist(a) - dist(b))[0];
}

function diary(p: PlayerLog, names: Map<string, string>): string[] {
  const out: string[] = [];
  const quiet = { weeks: [] as number[], challengeLosses: 0 };
  const s = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
  for (const w of p.weeks) {
    if (!w.quests && !w.cleared.length && !Object.keys(w.losses).length) {
      quiet.weeks.push(w.week);
      quiet.challengeLosses += w.challengeLosses;
      continue;
    }
    const losses = Object.entries(w.losses).map(([d, l]) => `Lost ${names.get(d)} ${s(l.n, "time")} (best: ${l.best.party}, out in ${l.best.lostIn.replace(/_/g, " ")} with the enemy on ${pct(l.best.enemyLeft)})`);
    const cleared = w.cleared.filter((k) => !k.includes(":")).map((k) => `${names.get(k)} (${w.winners[k]?.replace(/ \(.*\)$/, "")})`);
    const chs = w.cleared.filter((k) => k.includes(":")).length;
    out.push(`- Week ${w.week}: ${w.quests} of ${s(w.board, "quest")}${w.unlocks.length ? `, got ${w.unlocks.join(", ")}` : ""}. ${s(w.tries, "run")}.${cleared.length ? ` Cleared ${cleared.join(", ")}.` : ""}${chs ? ` ${s(chs, "challenge")} won.` : ""}${w.challengeLosses ? ` ${s(w.challengeLosses, "challenge")} lost.` : ""}${losses.length ? ` ${losses.join("; ")}.` : ""}${w.wall ? ` Stuck: walled by ${w.wall}${w.why ? ` (${w.why})` : ""}.` : ""}${w.benchmark !== undefined ? ` Benchmark: ${w.benchmark} dungeons.` : ""}`);
  }
  if (quiet.weeks.length)
    out.push(`- ${s(quiet.weeks.length, "quiet week")} (from week ${quiet.weeks[0]}): nothing new on the board and no dungeon left.${quiet.challengeLosses ? ` It lost ${s(quiet.challengeLosses, "challenge run")}.` : ""}`);
  return out;
}
