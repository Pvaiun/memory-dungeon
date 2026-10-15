# Memory Dungeon Game: design repo

## What this is

Design work for an optional game tab in Memory, the director's personal ADHD memory app. The game is a party-based JRPG dungeon crawler with automatic combat. Real-life quests pay unlocks, and dungeons pay gear. Everything here is design: a schema, a headless engine and simulations used to design the game. None of it runs in Memory yet.

- `docs/concept-spec.md`: what the game is and why.
- `docs/design-plan.md`: the 23 ordered design steps. **Work through them one at a time.**
- `docs/memory-app-overview.md`: how Memory works today.
- `SCHEMA.md`: step 1's output, and the **decisions record**. Where it differs from the concept spec, SCHEMA.md wins; the director will update the spec.
- Memory's code lives in `Pvaiun/memoryapp`. Never change it from here. Read it only to check that the design fits its tech stack.

## How to work

- **One step at a time.** For each step, produce what it lists under "Produces", check it against "Done when", then stop and wait for the director's review. Never start the next step unprompted.
- **Flag, don't guess.** When the concept spec is inconsistent or underspecified, say so. If a step can't wait, state the assumption plainly and continue.
- **Variants and simulation.** Propose variants, simulate them, report the data, your reading and a recommendation. The director judges results; they don't read data files. Write-ups are short, plain-language, and lead with decisions and open questions.
- **Design before implementation.** Don't integrate anything into Memory until the design steps are done. Code here (engine, harness) serves the design, so keep it small and don't polish it.
- **Placeholders.** Everything in `fixtures/` is placeholder, as are the `design` block's numbers. Don't present them as decided.

## Status

- **Step 1, content schema:** done and approved (schema 0.3). See SCHEMA.md.
- **Next, the tech-stack brief:** see `docs/tasks/memory-stack-brief.md`. Read Memory read-only and align this repo's tooling.
- **Then step 2:** headless engine. Content data plus a seed goes in, and a complete fight log comes out.
- **Session pattern:** one fresh session per step. Each ends by updating this Status section, committing, and stopping for review.

## The director's preferences

- Short, plain-language write-ups. Lead with decisions, open questions and anything that changes the design. They won't read data files, so summarize what they need to judge.
- Design before code. Code that serves the design stays small; avoid bug-fixing spirals.
- Mechanics map onto a few numerical systems (stats, statuses, damage types, flags, targeting). No bespoke words acting as locks, and no complexity that eats the player's brainpower, such as positional targeting.
- Content will come from human-given phrases and gimmicks, which AI interprets, filters and number-crunches through simulation. The pipeline gets designed later.

## Key decisions so far

These are summaries; SCHEMA.md has the full record.

- **Units:** each unit is a class plus a specialization (e.g. Ranger: Duelist). There's no plain class unit, and each specialization is one unit the player owns once.
- **No battlefield geometry:** no rows and no reach.
- **Formations:** Romancing SaGa-style, with 5 bespoke slots each carrying its own effects (aggro, speed, damage multipliers, auto-defend…). Front, middle and back are only where a slot is drawn. A formation can also have party-wide effects.
- **Enemies:** a plain list, with no formation.
- **Targeting:** keep it simple. Units mostly attack by aggro, and a few go for the most wounded. Active abilities fire automatically off cooldown, each with its own targeting.
- **Keys and keyholes:** encounter-design terms only. Quest rewards are "unlocks". Keyholes are predictions, never win rules, and are mostly enemy gimmicks, each countered by several keys. They're tuned by mass simulation.
- **Statuses:** a status lands either on self or on others. Self-built stacks (like Lethality) are preferred. Enemy-facing statuses like bleed stay niche through roster design; some cross-pollination is expected.
- **Verbs:** design vocabulary over the numerical systems. The engine never reads them, and they never gate gameplay.

## Tech

This is TypeScript with zod. The schema is in `src/schema.ts` and the validator in `src/validate.ts`.

Keep game logic pure TypeScript with no Node-only APIs, so it can later run in a Cloudflare Worker or the browser, wherever Memory needs it. Match Memory's stack (see `docs/memory-stack.md` once written).

```
npm install
npm test
npm run validate
```

When committing, follow any attribution instructions your session gives you.
