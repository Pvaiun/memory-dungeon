# Decisions

What has been decided, step by step. Where this differs from the concept spec, this wins; the director will update the spec. Each step's report has the full reasoning.

Decisions are direction like any other (see `docs/method.md`): a designer can challenge one with evidence, and until it's changed here, it stands.

## Process

- **Method (Oct 15, 2026):** every design step runs intent, then design, then build and tune, as `docs/method.md` sets out. Direction is guidance: the AI challenges what doesn't fit, with evidence, and never changes it silently.

## Step 1: content schema

Schema 0.3, approved Oct 15, 2026, before the method existed. Full record: `SCHEMA.md`.

- **Units:** each unit is a class plus a specialization (e.g. Ranger: Duelist). There's no plain class unit, and each specialization is one unit the player owns once.
- **No battlefield geometry:** no rows and no reach.
- **Formations:** Romancing SaGa-style, with 5 bespoke slots each carrying its own effects (aggro, speed, damage multipliers, auto-defend…). Front, middle and back are only where a slot is drawn. A formation can also have party-wide effects.
- **Enemies:** a plain list, with no formation.
- **Targeting:** keep it simple. Units mostly attack by aggro, and a few go for the most wounded. Active abilities fire automatically off cooldown, each with its own targeting.
- **Keys and keyholes:** encounter-design terms only. Quest rewards are "unlocks". Keyholes are predictions, never win rules, and are mostly enemy gimmicks, each countered by several keys. They're tuned by mass simulation.
- **Statuses:** a status lands either on self or on others. Self-built stacks (like Lethality) are preferred. Enemy-facing statuses like bleed stay niche through roster design; some cross-pollination is expected.
- **Verbs:** design vocabulary over the numerical systems. The engine never reads them, and they never gate gameplay.
