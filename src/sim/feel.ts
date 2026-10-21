/**
 * Feel checks. The harness picks runs worth reading by rule, replays them with
 * logs on, and writes each as a reading pack: only what a player would see,
 * plus each enemy's trait words, never its stats (enemy HP included, as in
 * classic Dragon Quest). A fresh AI reader answers a fixed sheet, and its
 * guess at the next party's colour is scored against the colours that win.
 */
import { play, randomPicker, type Content, type Rules } from "../engine/run.js";
import { playerView, type Entry } from "../engine/log.js";
import type { Party } from "../schema.js";
import type { Kept, Target } from "./combat.js";
import { label } from "./parties.js";
import { quantile } from "./sure.js";

export type Reading = { why: string; target: Target; party: Party; seed: number; won: boolean };

/** The closest loss, the biggest comeback, a typical win, a blowout, then one run from each dungeon not yet covered. */
export function pickRuns(kept: Kept): Reading[] {
  const runs = kept.filter((k) => !k.target.challenge);
  const out: Reading[] = [];
  const take = (why: string, k: Kept[number] | undefined) => {
    if (k && !out.some((o) => o.target.key === k.target.key && o.seed === k.result.seed && o.party === k.party))
      out.push({ why, target: k.target, party: k.party, seed: k.result.seed, won: k.result.won });
  };
  const by = (xs: Kept, f: (k: Kept[number]) => number) => [...xs].sort((a, b) => f(a) - f(b));
  const lost = runs.filter((k) => !k.result.won), won = runs.filter((k) => k.result.won);
  const lastLeft = (k: Kept[number]) => k.result.fights.at(-1)!.enemyLeft;
  take("the closest loss", by(lost, lastLeft)[0]);
  take("the biggest comeback", by(won, (k) => -Math.max(...k.result.fights.map((f) => f.behind)))[0]);
  const ends = won.map((k) => k.result.fights.at(-1)!.partyEnd);
  const mid = quantile(ends, 0.5);
  take("a typical win", by(won, (k) => Math.abs(k.result.fights.at(-1)!.partyEnd - mid))[0]);
  take("a blowout", by(lost, (k) => -lastLeft(k) * 1000 + k.result.fights.at(-1)!.rounds)[0]);
  for (const d of [...new Set(runs.map((k) => k.target.dungeon))]) {
    if (out.some((o) => o.target.dungeon === d)) continue;
    const here = runs.filter((k) => k.target.dungeon === d);
    const m = quantile(here.map((k) => k.result.progress), 0.5);
    take("one from each dungeon", by(here, (k) => Math.abs(k.result.progress - m))[0]);
  }
  return out;
}

/** A reading pack: the run replayed with logs on, as the player sees it. */
export function readingPack(c: Content, rules: Rules, r: Reading, n: number): string {
  const run = play(c, rules, { dungeon: r.target.dungeon, party: r.party, seed: r.seed, firstClear: true }, randomPicker(r.seed), { log: true });
  const d = c.dungeons.get(r.target.dungeon)!;
  const names = new Map<string, string>();
  const enemyIds = new Set<string>();
  const out: string[] = [`# Reading pack ${n}`, "", `**Dungeon:** ${d.name}. ${d.text ?? ""}`, "", `**Your party:** ${label(c, r.party)}.`];
  for (const u of r.party.units) {
    const s = c.classes.get(u.class)!;
    const gear = Object.values(u.gear).map((g) => c.pack.gear.find((x) => x.id === g)!).map((g) => `${g.name} (${g.text})`);
    out.push(`- ${s.name}: ${s.text ?? ""}${gear.length ? ` Wears: ${gear.join("; ")}` : ""}`);
  }
  const traits = new Map(c.pack.traits.map((t) => [t.id, t.word]));
  const seenEnemies = new Map<string, string>();
  for (const s of d.stages) if (s.kind === "fight") for (const id of s.enemies) {
    const e = c.enemies.get(id)!;
    seenEnemies.set(e.name, (e.traits ?? []).map((t) => traits.get(t) ?? t).join(", "));
  }
  out.push("", "**Enemies, as the game describes them:**", ...[...seenEnemies].map(([name, words]) => `- ${name}: ${words || "no description"}`), "", "## What happened");
  const perkName = (id: string) => c.pack.perks.find((p) => p.id === id);
  const who = (id: unknown) => names.get(String(id)) ?? String(id);
  const hp = (id: unknown, n: unknown, shield: unknown = 0) => (enemyIds.has(String(id)) ? "" : ` (${n} HP${shield ? `, ${shield} shield` : ""})`);
  let lastAt = -1;
  for (const e of playerView(run.log!) as Entry[]) {
    // Players see timings in ticks, rounded for display. A line that happens later than the one above it gets its own time.
    const t = typeof e.at === "number" ? `t${Number((e.at / 1000).toFixed(1))} ` : "";
    const later = typeof e.at === "number" && e.at !== lastAt;
    if (typeof e.at === "number") lastAt = e.at;
    const own = later ? t : "  ";
    switch (e.t) {
      case "fight_start": {
        const units = e.units as { id: string; name: string; side: string; hp: number; max: number }[];
        for (const u of units) names.set(u.id, u.name), u.side === "enemy" && enemyIds.add(u.id);
        const party = units.filter((u) => u.side === "party").map((u) => `${u.name} ${u.hp}/${u.max} HP`).join(", ");
        const foes = units.filter((u) => u.side === "enemy").map((u) => u.name).join(", ");
        out.push("", `### ${e.boss ? "Boss fight" : "Fight"}: ${String(e.stage).replace(/_/g, " ")}`, `Your party: ${party}. Against: ${foes}.`);
        break;
      }
      case "cast":
        out.push(`${t}${who(e.by)} begins ${e.name}.`);
        break;
      case "act":
        out.push(`${t}${who(e.by)} ${e.act === "basic" ? "attacks" : `uses ${e.name} on`} ${(e.targets as string[]).map(who).join(", ")}.`);
        break;
      case "fail":
        out.push(`${t}${who(e.by)}'s ${e.name} fails${e.why === "mp" ? " (not enough MP)" : ""}.`);
        break;
      case "dmg": {
        const from = e.part === "pulse" || e.part === "reaction" ? ` from ${String(e.src).toUpperCase()}` : "";
        if (e.word === "MISS") out.push(`${own}${who(e.target)}: MISS${from}.`);
        else out.push(`${own}${who(e.target)} takes ${e.crit ? "CRIT " : ""}${e.amount}${e.word ? ` ${e.word}` : ""}${from}${e.soaked ? `, ${e.soaked} soaked by a shield` : ""}${hp(e.target, e.hp, e.shield)}.`);
        break;
      }
      case "heal":
        out.push(`${own}${who(e.target)} is healed for ${e.crit ? "CRIT " : ""}${e.amount}${hp(e.target, e.hp)}.`);
        break;
      case "status":
        out.push(`${own}${who(e.unit)}: ${e.name}${e.total !== null ? ` ${Number((e.total as number).toFixed(1))}` : ""}.`);
        break;
      case "status_end":
        out.push(`${own}${who(e.unit)}'s ${e.name} ends.`);
        break;
      case "immune":
        out.push(`${own}${who(e.unit)}: IMMUNE to ${e.name}.`);
        break;
      case "interrupt":
        out.push(`${own}${who(e.unit)} is interrupted: ${e.name} is lost.`);
        break;
      case "down":
        out.push(`${own}${who(e.unit)} is down.`);
        break;
      case "stop":
        out.push(`The fight stops: nobody can win it.`);
        break;
      case "fight_end":
        out.push(`${e.result === "won" ? "Won" : "Lost"} at t${Number((lastAt / 1000).toFixed(1))}.`);
        break;
      case "offer":
        out.push("", `**Perk pick.** Offered: ${(e.options as string[]).map((id) => `${perkName(id)?.name} (${perkName(id)?.text})`).join("; ")}.`);
        break;
      case "pick":
        out.push(`Picked ${perkName(String(e.pick))?.name}.`);
        break;
      case "run_end":
        out.push("", `**Run ${e.outcome}.**${(e.loot as string[]).length ? ` Loot: ${(e.loot as string[]).map((g) => c.pack.gear.find((x) => x.id === g)?.name ?? g).join(", ")}.` : ""}`);
        break;
    }
  }
  return out.join("\n") + "\n";
}

/** The fixed sheet every reader answers. */
export function sheet(c: Content, packs: number): string {
  const classes = c.pack.classes.map((x) => `${x.name} (${x.text})`).join("; ");
  return `# Feel check: the reader's sheet

You're reading ${packs} fight logs from a party-based dungeon crawler with automatic combat. The player builds a party, sends it in and watches; between fights they pick a perk. Enemy stats are hidden, as in classic Dragon Quest: the player only sees names, a few descriptive words, and what happens. You see exactly what the player sees. Nothing else is known about how the game works, so don't assume rules you can't see.

The classes a player can build from: ${classes}.

For **each pack**, answer:

1. Retell the fight in 3 to 5 lines.
2. What can you tell about each enemy?
3. If the run was lost: why, and what colour of party would you try next? A colour is the kind of party: which classes it has. End your answer with one line in exactly this form: \`Colour: \` followed by one or more class names, separated by commas. If the run was won, write \`Colour: -\`.
4. Were there dramatic moments: a comeback, a close call, a win on the last hit?
5. What felt flat or unclear?

Then, **across all the packs**:

6. Across a dungeon, did it build up to its boss? Across dungeons, did they feel different?

Be honest and plain. If something felt flat, say so; if you can't tell something, say that.
`;
}

/** Score the reader's colour guesses: how many lost runs got a guess that's a winning colour. */
export function scoreColours(answers: string, key: { pack: number; won: boolean; winning: string[] }[], classNames: Map<string, string>) {
  const sections = answers.split(/^#+\s*(?:Reading )?pack\s+(\d+)/im);
  const guesses = new Map<number, string>();
  for (let i = 1; i < sections.length; i += 2) {
    const line = sections[i + 1].match(/Colour:\s*([^\n]*)/i)?.[1] ?? "";
    const ids = line.split(/[,+/&]|\band\b/).map((w) => classNames.get(w.trim().toLowerCase())).filter((x): x is string => !!x);
    guesses.set(Number(sections[i]), [...new Set(ids)].sort().join("+"));
  }
  const lost = key.filter((k) => !k.won);
  const rows = lost.map((k) => ({ pack: k.pack, guess: guesses.get(k.pack) ?? "", wins: k.winning.includes(guesses.get(k.pack) ?? "") }));
  return { lost: lost.length, right: rows.filter((r) => r.wins).length, rows };
}
