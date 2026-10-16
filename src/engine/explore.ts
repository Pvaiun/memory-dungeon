/**
 * The explorer: plays one seed down every combination of answers, branching
 * from saved points, and reports each path's outcome. It works for any kind of
 * decision. Paths share the fights before they split, so they cost less than
 * playing each one from the start.
 */
import { advance, answer, copyRun, newRun, type Content, type Rules, type Run, type RunInput } from "./run.js";

export type Path = { picks: string[]; outcome: "won" | "lost"; loot: string[]; hpLeft: number };
export type Exploration = { paths: Path[]; fights: number; truncated: boolean };

export function explore(c: Content, rules: Rules, input: RunInput, opts: { maxPaths?: number } = {}): Exploration {
  const max = opts.maxPaths ?? 10_000;
  const out: Exploration = { paths: [], fights: 0, truncated: false };
  const go = (run: Run) => {
    const before = run.fights;
    advance(c, rules, run);
    out.fights += run.fights - before;
    const d = run.pending;
    if (!d) {
      out.paths.push({
        picks: run.record.decisions.map((a) => a.pick),
        outcome: run.outcome!,
        loot: run.loot,
        hpLeft: run.party.reduce((s, u) => s + u.hp, 0),
      });
      return;
    }
    for (const option of d.options) {
      if (out.paths.length >= max) {
        out.truncated = true;
        return;
      }
      go(answer(c, rules, copyRun(run), option));
    }
  };
  go(newRun(c, rules, input));
  return out;
}
