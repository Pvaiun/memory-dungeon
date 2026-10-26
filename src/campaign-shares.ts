/**
 * Which classes the campaign's best builds use: for each class, the share of each node's top ten builds that include it,
 * over the nodes where it's owned (a fair share for a party of three from n owned classes is 3/n of a node's builds; across
 * the road that comes to about 30%). Reads out/campaign/results.json.
 *
 *   npx tsx src/campaign-shares.ts [--results out/campaign/results.json]
 */
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const opt = (name: string) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
type R = { n: number; name: string; owned: { classes: number }; top: { label: string }[]; best: { label: string; rate: number } };
const results = Object.values(JSON.parse(readFileSync(opt("--results") ?? "out/campaign/results.json", "utf8")) as Record<string, R>).sort((a, b) => a.n - b.n);
const pack = JSON.parse(readFileSync("content/core-set.pack.json", "utf8")) as { classes: { id: string; name: string }[]; campaign: { start: { classes: string[] }; nodes: { rewards: { classes: string[] } }[] } };
const ownedFrom = new Map<string, number>(pack.campaign.start.classes.map((c) => [c, 1]));
pack.campaign.nodes.forEach((n, i) => n.rewards.classes.forEach((c) => ownedFrom.set(c, i + 2)));

const rows = pack.classes.map((k) => {
  const from = ownedFrom.get(k.id) ?? 99;
  let inTop = 0, slots = 0, fair = 0;
  for (const r of results) {
    if (r.n < from) continue;
    slots += r.top.length;
    fair += (r.top.length * 3) / r.owned.classes;
    inTop += r.top.filter((t) => t.label.split(" in ")[0].split(/\], /).some((u) => u.startsWith(k.name + "["))).length;
  }
  return { name: k.name, from, share: slots ? inTop / slots : 0, fair: slots ? fair / slots : 0, n: inTop };
});
rows.sort((a, b) => b.share - a.share);
console.log("| Class | owned from node | share of top builds while owned | a fair share | top builds |\n| --- | --- | --- | --- | --- |");
for (const r of rows) console.log(`| ${r.name} | ${r.from > 20 ? "–" : r.from} | ${Math.round(100 * r.share)}% | ${Math.round(100 * r.fair)}% | ${r.n} |`);
console.log("\nBest build per node:");
for (const r of results) console.log(`  ${r.n} ${r.name}: ${Math.round(100 * r.best.rate)}% ${r.best.label}`);
