/**
 * Reads the authored-gaps step's web from its page, `steps/authored-gaps/web.md`: the list of threads with what each does
 * by the rules, the words that stand for several, the clocks, and a catalog row for every effect (what it wants, what it
 * gives, its clocks). It throws on a word the lists don't hold, so a typo in the catalog stops every tool that reads it.
 */
import { readFileSync } from "node:fs";

export const PAGE = "steps/authored-gaps/web.md";
/** The kind of the threads every unit has: tagged like the rest, left out of partners, joins and the map. */
export const COMMON = "every unit's";

export type Thread = { name: string; kind: string; wants: string[]; gives: string[] };
export type Clock = { name: string; what: string; builds: string[] };
/** `wants` and `gives` hold threads, with a word for several spelled out; `grouped` is the threads that came that way. */
export type Effect = { name: string; from: string; wants: string[]; gives: string[]; grouped: string[]; crosses: boolean; clocks: string[] };
export type Web = { threads: Thread[]; common: Set<string>; groups: Map<string, string[]>; clocks: Clock[]; effects: Effect[] };

const list = (cell: string) => (cell === "—" || !cell ? [] : cell.split(", ").map((w) => w.trim()));

export function readWeb(path: string = PAGE): Web {
  const page = readFileSync(path, "utf8");
  /** The rows of the first table that starts with `head` after a heading, as cells. */
  const table = (after: string, head: string): string[][] => {
    const from = page.indexOf(head, page.indexOf(after));
    if (from < 0) throw new Error(`no table "${head}" after "${after}"`);
    const rows: string[][] = [];
    for (const line of page.slice(from).split("\n").slice(2)) {
      if (!line.startsWith("|")) break;
      rows.push(line.slice(1, line.lastIndexOf("|")).split(" | ").map((c) => c.trim()));
    }
    return rows;
  };
  const rule = (cell: string, verb: string) => list(cell.split("; ").find((p) => p.startsWith(verb + " "))?.slice(verb.length + 1) ?? "");

  const threads: Thread[] = table("## The threads", "| Thread |").map(([name, kind, , , rules]) => ({ name, kind, wants: rule(rules, "wants"), gives: rule(rules, "gives") }));
  const known = new Set(threads.map((t) => t.name));
  const groups = new Map(table("## The threads", "| Word |").map(([word, stands]) => [word, list(stands)]));
  const clocks: Clock[] = table("## The clocks", "| Clock |").map(([name, what, builds]) => ({ name, what, builds: list(builds) }));
  const clockNames = new Set(clocks.map((c) => c.name));

  const errors: string[] = [];
  const effects: Effect[] = table("## The catalog", "| Effect |").map(([name, from, wants, gives, clock]) => {
    const e: Effect = { name, from, wants: [], gives: [], grouped: [], crosses: false, clocks: list(clock) };
    const words = (cell: string) =>
      list(cell).flatMap((raw) => {
        const word = raw.replace(/ \((an ally's|to an ally)\)$/, "");
        if (word !== raw) e.crosses = true;
        if (groups.has(word)) return groups.get(word)!.map((w) => (e.grouped.push(w), w));
        if (!known.has(word)) errors.push(`"${raw}" isn't a thread: ${name}`);
        return [word];
      });
    e.wants = words(wants);
    e.gives = words(gives);
    for (const c of e.clocks) if (!clockNames.has(c)) errors.push(`"${c}" isn't a clock: ${name}`);
    return e;
  });
  for (const t of threads) for (const w of [...t.wants, ...t.gives]) if (!known.has(w)) errors.push(`"${w}" isn't a thread: the rules of ${t.name}`);
  for (const [word, stands] of groups) for (const w of stands) if (!known.has(w)) errors.push(`"${w}" isn't a thread: ${word}`);
  if (errors.length) throw new Error(errors.join("\n"));
  return { threads, common: new Set(threads.filter((t) => t.kind === COMMON).map((t) => t.name)), groups, clocks, effects };
}
