# Memory's tech stack

What the game's design needs to know about how Memory is built. Read from `Pvaiun/memoryapp` at commit `7bb5a22` (main, Oct 15, 2026), read-only. File paths are in that repo unless they say otherwise.

## What this changes in the design

1. **The engine can't rely on zod when it runs.** Memory doesn't use zod. It checks data by hand: `validateCurationPlan` in `src/worker/brain.ts`, and `typeof` checks in `src/worker/index.ts`. zod stays this repo's design tool. Content gets checked here before it ships, and the engine takes plain typed data (`import type` only). Shipping zod would add at least 25 KB gzipped, and Memory's whole app is 77 KB.
2. **Fights should run in the Worker, from pure shared code.** Game state, rewards and the event log all live in D1 behind the Worker, so running fights there keeps a single source of truth, and the phone just plays back the fight log. Because the engine stays pure, the browser can still run it later for previews or replays. Mass simulation stays in this repo and never runs in Memory. Step 2 should report the CPU time per fight and the size of a fight log.
3. **Some quest kinds have no Memory event that completes them.** This affects steps 17 to 19:
   - **Review:** "keep" leaves no trace, and Memory has no "skip a recurrence" action. Either Memory gains those events, or the game tab records the decision itself.
   - **Want:** "a goal created" only matches recurring items. Memory labels an item a Goal only when it recurs and has no hard deadline (`src/shared/flavour.ts`), so a one-off want like "try bouldering" counts as a Task.
   - **Events can't be completed.** An event closes on its own as `passed`, or the user marks it `missed`. Attending leaves no trace (`completeItem`, `src/worker/items.ts`), so no quest can pay out for attending something.
   - **Undo is everyday.** A second tap on a habit already done today unticks it and logs `completion_reverted`. So step 19's undo path is common, not an edge case.
   - **Notice edge cases:** a first step added from a Now card creates an item without a `created` event. Undoing a recapture creates the item later, at undo time.
4. **The day starts at 5am, in the user's time zone.** Memory's day boundary is its "sleep day" (`sleepDayKey`, `src/shared/dates.ts`). The weekly board and "this week" quests should use the same boundary, or they'll disagree with the Now map around midnight.
5. **There's no staging environment.** There's local, and there's production. Deploys and migrations are run by hand, and the production database is the director's real memory. Game tables must be additive, and each migration needs a backup first.

**Needs the director:** which Cloudflare Workers plan Memory runs on. See section 7.

## 1. Language and tooling

| | Memory | Evidence |
| --- | --- | --- |
| TypeScript | 5.9.3 (`^5.6.0`), `strict`, `isolatedModules`. Typechecked with Workers and Vite types, no Node types. | `package.json`, `package-lock.json`, `tsconfig.json` |
| Modules | ES modules, `moduleResolution: bundler`, relative imports without extensions | `package.json`, `tsconfig.json` |
| Package manager | npm (lockfile v3). No Node version pinned. | `package-lock.json` |
| Build | Vite 5.4 builds the app. Wrangler 3.114 bundles the Worker. | `vite.config.ts`, `wrangler.jsonc` |
| Tests | Vitest 2.1.9 (`vitest run`), with tests beside the code as `*.test.ts`. 362 tests pass. | `package.json`, `src/**/*.test.ts` |
| Linter, formatter | None. The style is by convention: 2 spaces, single quotes, semicolons. | No config files |
| Validation | None. zod appears only inside Wrangler's own dev tooling (3.22.3, pulled in by miniflare). | `package-lock.json` |
| Monorepo | No. It's one package with three source folders: `src/shared` (pure logic both sides use), `src/worker` and `src/app`. | Repo layout, `README.md` |

## 2. Where code runs

- **Worker:** a single Cloudflare Worker using Hono (`src/worker/index.ts`). It serves the JSON API under `/api/*`, serves the built app as static assets, and runs the cron. All D1 access, AI calls and push sending happen here. There's no `nodejs_compat` flag, so Node built-ins aren't available (`wrangler.jsonc`).
- **Browser:** a React 18 single-page app built by Vite, installable as a PWA. The service worker caches only the app shell (`public/sw.js`). All data comes from the API, so Memory doesn't work offline.
- **Shared pure code** lives in `src/shared/` (dates, cadence, flavour, priority). The Descent renderer (`src/app/components/descent/engine.ts`) is a pure, deterministic, unit-tested module that React drives every frame. It's a good model for where a game engine would sit.
- **State management:** plain `useState` in `src/app/App.tsx`, passed down as props. There's no router, no Redux and no Context. Per-device preferences and a cached map go in `localStorage`. API calls go through `src/app/api.ts`.
- **Adding a tab:** in `src/app/App.tsx`, extend `type Tab`, add a render branch inside `<main>`, and add an entry to the tab-bar list. The view goes in `src/app/views/`. The bottom bar has four tabs today (Now, Browse, Calendar, Find). The capture box sits above the tab bar on every tab, so a game tab shares the screen with it unless it's hidden there.
- **Size and performance:** no budget is configured. Today the app is one script of 236 KB (77 KB gzipped) plus 36 KB of CSS, with no code splitting. The Worker uploads at 344 KB (86 KB gzipped). Both were measured by building a scratch copy. The game tab should load lazily (`React.lazy`) so the rest of Memory doesn't carry it. The UI smoke test uses a 390×844 phone screen (`scripts/ui-smoke.mjs`).

## 3. Data

- **Storage:** one D1 (SQLite) database, `memory-db`, bound as `DB`. There's no KV, Durable Objects, R2 or Queues. The Workers AI binding is used only for embeddings, with a crude local fallback (`src/worker/embeddings.ts`).
- **Single user:** one database is one person's memory. Nothing has a user ID, so game tables won't need one either.
- **Migrations:** numbered SQL files in `migrations/` (`0001_init.sql` to `0009_surfaced_days.sql`). They're applied by hand with `npm run db:migrate:local` and `npm run db:migrate:remote`, which run `wrangler d1 migrations apply`. There are no down migrations.
- **Conventions:**
  - Each migration opens with a comment saying why.
  - New columns use `ALTER TABLE … ADD COLUMN`. A changed CHECK constraint means rebuilding the table (`0004`), and backfills go in the same file.
  - IDs are `crypto.randomUUID()` text, times are ISO strings, JSON is stored as TEXT, and enums are CHECK constraints.
  - Columns are snake_case, mapped to camelCase in `src/worker/db.ts`.
  - Queries are raw SQL through `db.prepare().bind()`, with no ORM.
  - Singletons and settings go in the `app_state` key/value table.
- **Event log:** the `events` table, with an ID, a timestamp, an actor (`user`, `ai` or `system`), a type, an item ID, a bubble ID and a JSON payload. It's append-only, it's written only through `logEvent()` in `src/worker/db.ts`, and corrections are new events. Because `type` is free text, new game event types need no migration. The types in use today:
  - **user:** `captured`, `completed`, `completion_reverted`, `dismissed`, `edited`, `first_step_added`, `missed`, `re_themed`, `recapture_undone`, `rejected`, `reopened`, `snoozed`, `unsnoozed`
  - **ai:** `created`, `recaptured`, `recapture_refused`, `theme_merged`, `theme_renamed`
  - **system:** `deadline_rolled`, `event_rolled`, `map_rebuilt`, `passed`, `push_sent`, `snooze_expired`

  The profile reads only the types on an allow-list (`PROFILE_EVENT_TYPES`, `src/worker/brain.ts`), so game events stay out of it unless someone adds them on purpose. The backup (`/api/export`) includes every event, so game events would be backed up too.
- **Counters:** these are columns on `items`, not a separate table: `completion_count`, `streak`, `last_completed_at`, `surfaced_count`, `last_surfaced_at`, `created_at`, `last_touched_at` and the priority boost. Undo restores them from the `completed` event's before-snapshot (`uncompleteItem`, `src/worker/items.ts`). "Neglected", "done today" and an item's flavour are computed when needed and never stored (`toItemView`, `src/worker/db.ts`).
- **Profile:** written once a day during the Brain's run, from 30 days of events, using the capture model. Past profiles are kept in `profiles` (one row per day), and the current text is in `app_state.profile_text`.

## 4. AI and scheduling

- **Schedule:** one cron, every 5 minutes (`wrangler.jsonc`). Each tick runs the push scan and `morningRebuild` (`src/worker/index.ts`, `src/worker/brain.ts`).
- **Gate:** `morningRebuild` works out the user's 5am from the time-zone offset their phone last reported (`app_state.tz_offset_minutes`). It then asks a pure function, `shouldMorningRebuild`, whether to build. The answer is no if today's map already exists, if the app hasn't been opened for 14 days, or if another tick started a build in the last 10 minutes. The timestamps it checks live in `app_state`.
- **Backstop:** if the cron missed, the first open of the day rebuilds the map on demand (`POST /api/map/rebuild`).
- **Provider:** the Anthropic Messages API, called with plain `fetch` and no SDK (`src/worker/ai.ts`). The key is the `ANTHROPIC_API_KEY` secret. The models are set in `wrangler.jsonc` vars: `CAPTURE_MODEL` (claude-sonnet-5-5) for capture and the profile, and `BRAIN_MODEL` (claude-opus-5-5) for the Brain.
- **Prompts** are template strings in the code (`brain.ts`, `capture.ts`). From the Settings sheet, the director can add to a prompt or replace it, and those edits are stored in `app_state`.
- **Model output is never trusted.** JSON is pulled out of the reply leniently (`extractJson`), then checked by hand (`validateCurationPlan`). Code enforces the guarantees, such as minimum bubble prominence, whatever the model says.
- **Fallback:** with no key, an error or a bad reply, Memory builds a rule-based map instead (`fallbackBubbles`) and shows a banner with a one-tap retry. There are no retries and no fallback model; a safety refusal is shown to the user (`ModelDeclinedError`). If the profile or the librarian fails, the map still gets built.
- **Debug:** `GET /api/debug/brain` returns what the Brain saw and what it built.
- **The quest board's version of this pattern:** run on the same tick, behind a pure `shouldBuildBoard` gate with timestamps in `app_state`. Back it up with a build on first open, check the AI's output by hand, fall back to a rule-based board with a banner, and add a debug snapshot.

## 5. Settings and flags

Memory has no feature-flag system. It uses two informal mechanisms instead:

- **Server-side** `app_state` keys, set through `/api/settings/*` (for example `brain_prompt_variant`). Every device sees them.
- **Per-device** `localStorage` keys (`memory.nowView`, `memory.fallSpeed`), in `src/app/App.tsx`.

The Settings sheet (`src/app/components/SettingsSheet.tsx`) already holds the director's workshop and debug buttons. A game on/off switch fits there as an `app_state` key, which would hide the tab on every device. Game debug tools fit in the same sheet.

## 6. Environments

- **Local:** run `npm run db:migrate:local`, then `npm run dev`, which builds with Vite and starts `wrangler dev` on port 8787. The local database is a SQLite file under `.wrangler/`. Secrets go in `.dev.vars`. Without an API key, the app runs on its rule-based parser and map. `npm run dev:app` gives hot reload against a running `wrangler dev`.
- **Production:** one Worker and one D1 database (its ID is in `wrangler.jsonc`). Deploys are by hand with `npm run deploy`, and migrations are by hand with `npm run db:migrate:remote`.
- **Missing:** there's no staging or preview environment, and no CI (there's no `.github/` folder).

## 7. Limits that matter

Cloudflare's published limits, checked Oct 2026 ([Workers](https://developers.cloudflare.com/workers/platform/limits/), [D1](https://developers.cloudflare.com/d1/platform/limits/)):

| | Free plan | Paid plan |
| --- | --- | --- |
| CPU time per request | 10 ms | 30 s by default, up to 5 min |
| CPU time per cron run | 10 ms | 30 s (Memory's cron runs every 5 minutes) |
| Memory | 128 MB | 128 MB |
| D1 queries per invocation | 50 | 1,000 |
| D1 database size | 500 MB | 10 GB |

Time spent waiting on `fetch` or D1 doesn't count as CPU time.

- **The plan isn't recorded in the repo.** It's probably Paid: a map build runs one or two D1 queries per item on the map, plus dozens of others, which passes the Free plan's 50-query cap. The director should confirm.
- **One fight should fit either plan.** It's plain arithmetic over a handful of units, with no I/O. Step 2 will measure it.
- **Mass simulation** (thousands of fights) doesn't belong in Memory. It runs here, in Node.
- **Running fights in the browser wouldn't be simpler.** The Worker still has to write rewards, game state and log events, and Memory doesn't work offline. A fight run in the browser would therefore still need the Worker to check and record it. Running it in the Worker keeps one path, and a pure engine leaves the browser available for previews and replays.

## 8. Memory's design spec

It's copied word for word into `docs/memory-design-spec.md`, from commit `7bb5a22`. One gap: the spec deliberately doesn't fix a list of event types (§7.1, "a fixed list of event types is deliberately *not* committed"). Step 17 should use the list from the code in section 3 above.

## Mismatches with this repo's tooling

| This repo had | Memory | Recommendation | Done here? |
| --- | --- | --- | --- |
| TypeScript 7.0.2 | 5.9.3 | Match Memory, so code that moves still compiles there. Everything here already typechecks under 5.9 and under Memory's own `tsconfig.json`. | Yes: `typescript ^5.9.3` |
| node:test, run through tsx | Vitest 2.1.9 | Switch, so tests can move into Memory as they are. Vitest's snapshots also suit fight logs. | Yes: `npm test` runs `vitest run`, and all 93 tests pass. The existing tests keep `node:assert`, which Vitest runs fine. New tests can use `expect`, as Memory's do. |
| No `isolatedModules` | `isolatedModules: true` | Match it, because Vite and esbuild compile files one at a time. | Yes |
| Node types visible to all code | No Node types; Workers types instead | Add a guard so game logic can't use a Node-only API. | Yes: `tsconfig.core.json`, part of `npm run typecheck`, covers `src/schema.ts`, `src/validate.ts` and the future `src/engine/`, minus test files. A test file that used `process` and `node:fs` failed it as expected. |
| zod 4, imported as `{ z }` | No zod | Keep zod as design tooling, and keep it out of the engine (see the top of this doc). Import it as `* as z`: that form cuts zod's bundled size from about 93 KB to 25 KB gzipped, and this repo's schema plus validator from 112 KB to 48 KB. | Yes, the import changed. The exported JSON Schema is identical. |
| tsx for the CLI scripts | No equivalent; scripts are `.mjs` | Keep it. It's dev-only and never ships. | No change |
| Double quotes, `.js` import extensions | Single quotes, no extensions | Both build fine with Memory's bundler. Reformat the code when it moves into Memory; it isn't worth churning now. | No change |
| Tests in `tests/` | Tests next to the code | Either works with Vitest. Put engine tests next to the engine from step 2 onward, so they move with it. | No change |
| ES modules, npm | Same | Nothing to do | — |

**Proposed, not done (Phase 4):** where the game code lives in Memory. It could go in `src/shared/game/` for the engine plus `src/worker/game.ts` for the API, or it could be a package. Either way, Memory has to install zod 4 directly if it ever wants zod. Today a bare `import 'zod'` there would quietly resolve to the dev-only 3.22.3.
