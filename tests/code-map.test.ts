/**
 * docs/code-map.md lists every source file, and nothing that's gone. The map's Files block is a tree: two spaces of
 * indent a level, a folder ends in "/", a line can name several files (comma-separated), and two or more spaces
 * separate the names from what they are.
 */
import { test } from "vitest";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";

const ROOTS = ["src", "tools", "content/core-set", "ui/src", "tests"];

function listed(): Set<string> {
  const md = readFileSync("docs/code-map.md", "utf8");
  const block = md.slice(md.indexOf("## Files")).match(/```\n([\s\S]*?)```/)![1];
  const out = new Set<string>();
  const folders: string[] = [];
  for (const line of block.split("\n").filter((l) => l.trim())) {
    const depth = (line.length - line.trimStart().length) / 2;
    assert.ok(Number.isInteger(depth) && depth <= folders.length, `bad indent: ${line}`);
    folders.length = depth;
    const names = line.trim().split(/ {2,}/)[0].split(/, */);
    for (const name of names) {
      const path = [...folders, name].join("");
      if (name.endsWith("/")) folders.push(name);
      out.add(path.replace(/\/$/, ""));
    }
  }
  return out;
}

test("the code map lists every source file, and only files that exist", () => {
  const map = listed();
  const missing = ROOTS.flatMap((root) =>
    (readdirSync(root, { recursive: true }) as string[]).filter((f) => f.endsWith(".ts")).map((f) => `${root}/${f}`),
  ).filter((f) => !map.has(f));
  assert.deepEqual(missing, [], "add these to docs/code-map.md");
  const gone = [...map].filter((p) => !existsSync(p));
  assert.deepEqual(gone, [], "these are in docs/code-map.md but not on disk");
});
