# Memory's tech stack

What the game needs to know about how Memory is built, and how the game fits into it. Memory (`Pvaiun/memoryapp`) was read at commit `7bb5a22`, then rechecked at `9331f40` after the director's TypeScript 7 upgrade (Oct 15, 2026). The director reviewed this doc, and its decisions are in `DECISIONS.md`. File paths are in memoryapp unless they say otherwise.

## How the game fits into Memory

1. **The game is built like a game, and meets Memory only where it has to.** To the user it's part of Memory. Underneath, it's free to work the way a game works.
   - **Fixed:**
     - the same web app and build (React, Vite, the installable app)
     - a tab in Memory's tab bar
     - the same TypeScript version
     - reading and creating items through Memory's code
     - the quest board on Memory's timer, with a rule-based fallback if the AI fails, like the Brain's
     - game data synced through Memory's server
   - **Free:**
     - the engine running in the browser
     - the game's own state handling and animation loop
     - zod
     - save documents instead of tables
     - content shipped as data alongside the game's code
2. **Fights run in the browser.** A fight is seeded, so the seed, party, content and engine version rebuild its log exactly. No combat log is stored anywhere. The game saves on the device during play and syncs to the server in the background, for other devices and for backup. The server keeps that save, plus a short summary of each run: its replay record, outcome and loot (step 2 widened this from seed, outcome and loot; see `DECISIONS.md`). This means no waiting on the network during a run, and Cloudflare's server limits don't apply to fights. The same engine runs in Node for simulations, and it could run on the server later if a design ever needs fights while the app is closed.
3. **zod is allowed in the game's running code.** The cost is 25 to 50 KB, and it only loads with the game tab. It gives one definition of the game's data that both checks the data and supplies its types. It's most useful for checking anything that comes from outside the game's own code: the quest board's AI replies, and saves coming back from the server. Check content once, when it loads, not inside every fight.
4. **The quest board reads item state, not Memory's event log.** Quest kinds are the board's own vocabulary, with no link to Memory's item types. Each quest either points at an existing item of any type, or asks the user to make a new one. Memory only answers "is this item done?" (see "What the quest board reads" below). Rewards are claimed by hand on the board. If an item is unticked before its claim, the quest shows as incomplete again; once claimed, nothing rolls back. An event counts as done once its time passes, unless the user marks it missed. So Memory needs no new events and no changes for the board.
5. **The game's data lives apart from Memory's.**
   - **Its own database.** The game gets its own D1 database, bound next to Memory's. A broken game change can't touch the director's real memory, and wiping the game is always safe.
   - **Save documents.** Game state is a few JSON documents (the save, the boards), not many tables, so changing their format is a code change, not a migration.
   - **A reset button.** A "reset game" button in debug settings replaces test data. The live app is the test environment, so there's no staging and no test tables.
   - **No manual backups.** D1 keeps 30 days of restorable history automatically ("Time Travel"). Restores work per database, which is another reason to keep the game's separate.
   - **Out of Memory's log.** Game events stay out of Memory's permanent event log, at least during development, because that log is never edited.
6. **The game's day starts at 5am in the user's time zone, like Memory's.** Memory calls this the "sleep day" (`sleepDayKey`, `src/shared/dates.ts`). The weekly board should roll over on the same boundary, or it'll disagree with the Now map around midnight.

## For step 2, the engine

- **Location:** put it in `memory-dungeon/src/engine/`, which `tsconfig.core.json` covers, so a Node-only API fails the typecheck. Put its tests next to it.
- **Randomness:** use a seeded random-number generator inside the engine. Never `Math.random` or the clock.
- **The same seed, the same fight, on every device.** Basic arithmetic (+ − × ÷) and rounding give identical results in every browser. `Math.pow`, `Math.exp`, `Math.log` and the trig functions can differ in the last digit between browsers, such as Chrome and Safari, and over a whole fight that can change who wins. Keep combat math to the basic operations, or a run resumed on another device could play out differently.
- **Measure:** the time to compute one fight and one whole run, and the size of a fight log. The log is held in memory while it plays back, and it's never stored.

## Integration checklist (Phase 4 onward)

Steps that will go wrong if they're forgotten. This repo never changes Memory, so these are for whoever integrates the game.

- [ ] **Add zod 4 to Memory's own dependencies** (`npm install zod@^4` in memoryapp) before any game code that imports zod goes in. Memory doesn't list zod today. But Wrangler's dev tooling brings zod 3.22.3 into `node_modules/zod`, so a bare `import 'zod'` silently picks up that old version, and the Worker build would ship it. Afterwards, `npm ls zod` should show 4.x at the top level.
- [ ] **Match TypeScript versions.** Keep both repos on the same TypeScript major version. Both are on 7.0.2 today.
- [ ] **Create the game's database.** Run `wrangler d1 create`, add a second entry to `d1_databases` in `wrangler.jsonc`, and give it its own migrations folder.
- [ ] **Lazy-load the tab.** Load the game tab with `React.lazy`, so its code and content only load when the tab opens.
- [ ] **Hide the game behind a switch.** Make the on/off switch a server-side `app_state` key, toggled in the Settings sheet, so it applies on every device.
- [ ] **Isolate the quest board's job.** Hook the weekly board build into the existing 5-minute `scheduled()` handler (`src/worker/index.ts`), wrapped so a failure can't stop the push scan. `morningRebuild` already works this way.
- [ ] **Keep game events out of Memory's log** (`events` table) while the game is in development.
- [ ] **Reformat moved code** to Memory's style: single quotes, and imports without file extensions.

## What the quest board reads

The game runs in the same app as Memory, so it can use Memory's own data and code: `GET /api/items` (each item as an `ItemView`), and the shared code in `src/shared/`.

- **One-off items:** an item is done when `status` is `completed`. Unticking it sets it back to `active`.
- **Habits** (recurring items) stay `active`. Each tick-off raises `completionCount` and sets `lastCompletedAt`, and an untick reverses both. "Every occurrence this week" means comparing the rise in `completionCount` since the board was dealt with how many times the habit came up that week. Memory's recurrence code works that out (`src/shared/cadence.ts`).
- **Events** have `eventAt` and `eventEnd`. Memory only marks a past event `passed` in the next morning's sweep, so the board should compare the time itself, and treat the event as done unless its `status` is `missed`.
- **Repeating events** can't be marked missed in Memory; only one-off events can (`missItem`, `src/worker/items.ts`). On the board, the user simply doesn't claim a missed occurrence, which fits the trust model. A repeating event moves to its next date the morning after it happens (`event_rolled`), so the board should note which occurrence a quest means.
- **New items** carry `createdAt`, so "made since the board was dealt" is a plain filter.
- **Dismissed and snoozed items** have `status` `dismissed`, or a future `snoozedUntil`. These are decisions, not completions. Quest cards that ask for a decision can call Memory's existing endpoints (`/api/items/:id/dismiss`, `/snooze`, `/complete`).

## Memory's stack, for reference

### Language and tooling

| | Memory | Evidence |
| --- | --- | --- |
| TypeScript | 7.0.2, with `strict` and `isolatedModules`. Typechecked with Workers and Vite types, and no Node types. | `package.json`, `tsconfig.json` |
| Modules | ES modules, with `moduleResolution: bundler` and relative imports without file extensions | `package.json`, `tsconfig.json` |
| Package manager | npm, with lockfile v3. No Node version is pinned. | `package-lock.json` |
| Build | Vite 5.4 builds the app, and Wrangler 3.114 bundles the Worker. Neither uses the TypeScript compiler; only `npm run check` does. | `vite.config.ts`, `wrangler.jsonc` |
| Tests | Vitest 2.1.9, with tests next to the code. | `src/**/*.test.ts` |
| Linter, formatter | None. The style is by convention: 2 spaces, single quotes and semicolons. | No config files |
| Validation | Hand-written checks. Memory has no zod of its own (see the checklist). | `src/worker/brain.ts` (`validateCurationPlan`) |
| Repo layout | One package, not a monorepo: `src/shared` holds pure logic both sides use, plus `src/worker` and `src/app`. | `README.md` |

### Where code runs

- **Worker:** a single Cloudflare Worker using Hono (`src/worker/index.ts`). It serves the API under `/api/*`, serves the built app as static files, and runs the cron. All database and AI access happens here. Node built-ins aren't available, because there's no `nodejs_compat` flag.
- **Browser:** a React 18 single-page app. The service worker caches only the app shell (`public/sw.js`), and all of Memory's data comes from the API.
- **App state:** plain `useState` in `src/app/App.tsx`, passed down as props. There's no router and no global store. Per-device preferences go in `localStorage`.
- **Adding a tab:** in `App.tsx`, extend `type Tab`, add a render branch in `<main>`, and add an entry to the tab-bar list. Views live in `src/app/views/`. There are four tabs today (Now, Browse, Calendar, Find). The capture box sits above the tab bar on every tab.
- **Precedent for a game engine:** the Descent renderer (`src/app/components/descent/engine.ts`) is a pure, deterministic, unit-tested module that React drives every frame.
- **Size:** there's no budget. The app is one 236 KB script (77 KB gzipped), and the Worker is 344 KB (86 KB gzipped).

### Data

- **Database:** one D1 (SQLite) database, `memory-db`, bound as `DB`. There's no KV, Durable Objects or R2. Memory is single-user, so nothing has a user ID.
- **Migrations:** numbered SQL files in `migrations/`, applied by hand (`npm run db:migrate:local` and `npm run db:migrate:remote`). There are no down migrations.
- **Conventions:**
  - IDs come from `crypto.randomUUID()`, times are ISO strings, and JSON is stored as text.
  - Queries are raw SQL, with no ORM.
  - Settings and singletons go in the `app_state` key/value table.
- **Event log (background only):** the `events` table, with an actor (`user`, `ai` or `system`), a free-text type, an item, and a JSON payload. It's append-only and written through `logEvent()` (`src/worker/db.ts`). The types in use today:
  - **user:** captured, completed, completion_reverted, dismissed, edited, first_step_added, missed, re_themed, recapture_undone, rejected, reopened, snoozed, unsnoozed
  - **ai:** created, recaptured, recapture_refused, theme_merged, theme_renamed
  - **system:** deadline_rolled, event_rolled, map_rebuilt, passed, push_sent, snooze_expired

  Memory's design spec deliberately leaves this list open.
- **Counters:** columns on `items` (`completion_count`, `streak`, `last_completed_at` and others). Undo restores them.
- **Profile:** written daily from 30 days of events. The current text is in `app_state.profile_text`. The profile reads only an allow-list of event types, so game events wouldn't reach it.

### AI and scheduling (the quest board copies this)

- **Timer:** one cron runs every 5 minutes (`wrangler.jsonc`). Each tick runs the push scan and `morningRebuild`.
- **Gate:** a pure function, `shouldMorningRebuild`, decides whether to build. It works out the user's 5am from the time-zone offset their phone last reported, and skips the build if today's map exists, if the app hasn't been opened for 14 days, or if another build started in the last 10 minutes. Its timestamps live in `app_state`.
- **Backstop:** if the cron missed, the first open of the day builds the map.
- **Provider:** the Anthropic Messages API, called with plain `fetch` (`src/worker/ai.ts`). Model names are in `wrangler.jsonc` vars, and prompts are in the code. The Settings sheet can add to or replace a prompt.
- **Checking:** model replies are parsed leniently, then checked by code, and code enforces the guarantees.
- **Fallback:** if the AI fails, Memory builds a rule-based map and shows a banner with a retry. There are no retries and no fallback model. A safety refusal is shown to the user.
- **Debug:** a snapshot endpoint (`/api/debug/brain`) shows what the Brain saw and built.

### Settings and flags

Memory has no feature-flag system. Server-side settings are `app_state` keys, set through `/api/settings/*`, and every device sees them. Per-device settings are `localStorage` keys. The Settings sheet (`src/app/components/SettingsSheet.tsx`) already holds the director's debug tools, which makes it the place for the game's on/off switch and its debug buttons.

### Environments

There's local development (`npm run dev`, with a local SQLite file under `.wrangler/` and secrets in `.dev.vars`) and production. Deploys and migrations are run by hand, and there's no staging and no CI. Without an API key, Memory runs on its rule-based parser and map.

### Limits

Memory is on Cloudflare's Workers Paid plan. These limits only matter for server work, such as building the quest board, not for fights:

- 30 s of CPU per cron run, and 30 s by default per request. Waiting on the AI or the database doesn't count.
- 128 MB of memory.
- 1,000 database queries per invocation.
- 10 GB per database.

Source: [Workers limits](https://developers.cloudflare.com/workers/platform/limits/), [D1 limits](https://developers.cloudflare.com/d1/platform/limits/), [D1 Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/).

### Memory's design spec

It's copied word for word into `memory-dungeon/docs/memory-design-spec.md`, from commit `7bb5a22`. The TypeScript upgrade didn't change it.

## How this repo's tooling lines up

| This repo | Memory | Status |
| --- | --- | --- |
| TypeScript 7.0.2 | 7.0.2 | Same. |
| Vitest 2.1.9, replacing node:test | Vitest 2.1.9 | Same. The existing tests keep `node:assert`, which Vitest runs fine. |
| `isolatedModules` | `isolatedModules` | Same. |
| `tsconfig.core.json`: game logic typechecked without Node types | No Node types | Same effect. It's part of `npm run typecheck`. |
| zod 4, imported as `* as z` | No zod yet | zod is allowed. That import form bundles about 4 times smaller. Memory adds zod 4 at integration (see the checklist). |
| tsx for the CLI scripts | Scripts are `.mjs` | Keep tsx. It's dev-only and never ships. |
| Double quotes and `.js` import extensions | Single quotes, no extensions | Reformat at integration. |
| Tests in `tests/` | Tests next to the code | Engine tests go next to the engine from step 2. |
