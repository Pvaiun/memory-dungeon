# Task: Memory tech-stack brief (before step 2)

**Goal:** make sure the game design fits Memory's tech stack, without touching Memory.

Read `Pvaiun/memoryapp` **read-only**. Change nothing there: no commits, branches or pull requests. Then write `docs/memory-stack.md` in this repo. Keep it short and factual, and cite file paths as evidence. Answer only what affects the game's design:

1. **Language and tooling.** TypeScript version and strictness, module format, package manager, build tool, test runner, linter, and validation library (zod or another). Is it a monorepo with workspaces?
2. **Where code runs.** What runs in the Cloudflare Worker and what runs in the browser. The frontend framework and state management. How a tab or screen is added. Any bundle-size or performance limits.
3. **Data.** Which storage it uses (D1, KV, Durable Objects or other). How tables and migrations are defined and applied. How the event log, counters and profile are stored, including the event types. Any conventions for adding new tables.
4. **AI and scheduling.** How the Brain is scheduled, and how it calls the AI (provider, where prompts live, fallback). The quest board will copy this pattern.
5. **Settings and flags.** Is there a settings or feature-flag mechanism that could hide a tab or a debug feature?
6. **Environments.** The local development setup, any staging or preview environment, and how the database is handled locally versus in production.
7. **Limits that matter.** Worker CPU-time and memory limits relevant to running fights or simulations server-side, and whether running game logic in the browser would be simpler.
8. **Memory's design spec.** Find `memory-design-spec.md` (the design plan refers to it) and copy it into `docs/` here. Phase 4 works from it.

Then list every mismatch between Memory's stack and this repo's current tooling (TypeScript, zod 4, tsx, node:test, ES modules), with a recommendation for each. Make a change here only if it's small, like switching the test runner, and keep all tests passing. Propose anything bigger instead.

When done, update the Status section in `CLAUDE.md`, commit, and stop for the director's review. Write the summary for the director in plain language. Lead with anything that changes the design.
