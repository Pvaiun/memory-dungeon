import { configDefaults, defineConfig } from "vitest/config";

// Agents' worktrees live under .claude/worktrees/: their copies of the tests aren't this checkout's.
export default defineConfig({ test: { exclude: [...configDefaults.exclude, ".claude/**"] } });
