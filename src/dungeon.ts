/**
 * Run a dungeon from the command line, with the step 2 engine and stand-in fight.
 *
 *   tsx src/dungeon.ts [--seed N] [--party <party.json>] [--dungeon <id>] [--pick first|random]
 *                      [--first-clear] [--player] [--json]
 *   tsx src/dungeon.ts --explore [--seed N] [--party ...]
 *   tsx src/dungeon.ts --bench
 *   tsx src/dungeon.ts --digest     (one fingerprint of 10,000 runs' logs: compare it across JS engines,
 *                                    e.g. `bun src/dungeon.ts --digest` runs on Safari's engine)
 */
import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { explore } from "./engine/explore.js";
import { playerView, printLog } from "./engine/log.js";
import { firstOption, loadContent, play, randomPicker, type RunInput } from "./engine/run.js";
import { fingerprint } from "./engine/rng.js";
import { parties } from "./engine/testkit.js";
import { standin } from "./engine/standin.js";

const args = process.argv.slice(2);
const opt = (name: string, def: string) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : def;
};
const load = (p: string) => JSON.parse(readFileSync(p, "utf8"));

const c = loadContent(load(opt("--pack", "fixtures/hollow.pack.json")));
const seed = Number(opt("--seed", "1"));
const input: RunInput = {
  dungeon: opt("--dungeon", c.pack.dungeons[0].id),
  party: load(opt("--party", "fixtures/party.json")),
  seed,
  firstClear: args.includes("--first-clear"),
};

if (args.includes("--bench")) bench();
else if (args.includes("--digest")) {
  const ps = parties(c);
  const digests: string[] = [];
  for (let s = 1; s <= 10_000; s++) {
    const run = play(c, standin, { ...input, party: ps[s % ps.length], seed: s }, randomPicker(s), { log: true });
    digests.push(fingerprint(JSON.stringify(run.log)));
  }
  console.log(`10,000 runs, all parties: ${fingerprint(digests.join(""))}`);
}
else if (args.includes("--explore")) {
  const t0 = performance.now();
  const ex = explore(c, standin, input);
  const ms = performance.now() - t0;
  for (const p of ex.paths) console.log(`${p.picks.join(" → ").padEnd(50)} ${p.outcome}, ${p.hpLeft} HP left${p.loot.length ? `, loot ${p.loot.join(", ")}` : ""}`);
  console.log(`\n${ex.paths.length} paths, ${ex.fights} fights, ${ms.toFixed(2)} ms${ex.truncated ? " (truncated)" : ""}`);
} else {
  const picker = opt("--pick", "random") === "first" ? firstOption : randomPicker(seed);
  const run = play(c, standin, input, picker, { log: true });
  if (args.includes("--json")) console.log(JSON.stringify({ record: run.record, outcome: run.outcome, loot: run.loot, log: run.log }, null, 1));
  else console.log(printLog(run.log!, { hidden: !args.includes("--player") }));
}

/** Time per fight, per run and per exploration, and the size of a log. */
function bench() {
  const N = 20_000;
  const time = (f: () => void) => {
    const t0 = performance.now();
    f();
    return performance.now() - t0;
  };
  const runs = (log: boolean) => {
    let ms = 0, fights = 0, entries = 0, bytes = 0, gz = 0, seen = 0, record = 0;
    for (let s = 1; s <= N; s++) {
      const t0 = performance.now();
      const run = play(c, standin, { ...input, seed: s }, randomPicker(s), { log });
      ms += performance.now() - t0;
      fights += run.fights;
      if (log) {
        entries += run.log!.length;
        const json = JSON.stringify(run.log);
        bytes += json.length;
        if (s <= 1000) gz += gzipSync(json).length;
        if (s <= 1000) seen += gzipSync(JSON.stringify(playerView(run.log!))).length;
        record += JSON.stringify(run.record).length;
      }
    }
    return { ms, fights, entries, bytes, gz: gz / 1000, seen: seen / 1000, record };
  };
  const raw = load(opt("--pack", "fixtures/hollow.pack.json"));
  const loadMs = time(() => loadContent(raw));
  runs(false); // warm up
  const off = runs(false);
  const on = runs(true);
  const E = 1000;
  let paths = 0;
  const exMs = time(() => {
    for (let s = 1; s <= E; s++) paths += explore(c, standin, { ...input, seed: s }).paths.length;
  });
  const us = (ms: number, n: number) => `${((ms * 1000) / n).toFixed(1)} µs`;
  console.log(`${N} runs of ${input.dungeon}, party from ${opt("--party", "fixtures/party.json")}, random picks`);
  console.log(`  logs off: ${us(off.ms, off.fights)} per fight, ${us(off.ms, N)} per run (${(off.fights / N).toFixed(2)} fights per run)`);
  console.log(`  logs on:  ${us(on.ms, on.fights)} per fight, ${us(on.ms, N)} per run`);
  console.log(`  log size: ${(on.bytes / N / 1024).toFixed(1)} KB per run as JSON, ${(on.bytes / on.fights / 1024).toFixed(1)} KB per fight, ${(on.entries / N).toFixed(0)} entries per run`);
  console.log(`  log gzipped: ${(on.gz / 1024).toFixed(1)} KB per run; the player-visible part alone, gzipped: ${(on.seen / 1024).toFixed(1)} KB`);
  console.log(`  record (the run summary's replay data): ${(on.record / N).toFixed(0)} bytes`);
  console.log(`Loading and checking the content pack: ${loadMs.toFixed(1)} ms, once per session`);
  console.log(`${E} explorations: ${(exMs / E).toFixed(2)} ms each, ${(paths / E).toFixed(1)} paths each`);
}
