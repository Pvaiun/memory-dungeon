# Step 5e intent: a balance audit, from what happens in fights

From the director's message in the session of Oct 27, 2026, after the 5c and 5d reports. Not an interview: their words, verbatim where quoted, and their brief in full below. They asked for it to be built and tuned overnight without stage gates, stopping at the report, so there was no read-back; correct anything here and the design follows.

## Their words

> there's also both the journey mode and the rogue mode, so there's a lot to balance. But right now the game
> is almost testable, but I believe the balance is too poor to really play it. […] I'm certain that there's
> way more, and I don't want the AI to just hyper-focus on the ones that I picked. […] I want it to strive
> for excellence itself. Because some of the stuff in this game is obviously wrong. […] I think it's because
> it balances using win rates. And what we wanted to do is take a look at what's happening in the fights and
> what does the share of what.

## Their brief

- [firm] **The job:** a full balance audit of the core set, in both modes, where I find the problems. "I'm giving you no list, on purpose. Past passes tuned toward win rates, and the foes' knobs absorbed whatever the classes did, so problems inside fights never showed. Balance this time from what happens in fights: who does what share of what."
- [firm] **1. A balance sheet before changing a number** (two hours at most): a tool (`npm run balance`) that plays a fixed set of fights from both modes at frozen knobs and fixed seeds, with a spread of parties (not only the best builds, so what nobody picks still gets measured), and reads the logs. Complete when every class, ability, status, enemy, gear piece and formation in the pack has a line, and every number a unit carries, every resource and every kind of log event has a measure. Compare each line with the others of its kind and flag both ends. Set the bands from the core set documents (what each thing is for) and from one principle: every option is a real choice, so nothing is useless, dominated or required, and nothing wins on its own. Write each band down with its reason.
- [firm] **2. Commit the full findings list, ranked worst first, before any fix.** "I read this first."
- [firm] **3. Fix from the top of the list, upstream first:** whatever sets how often units act and what they can afford, then what actions do, then who's worth bringing. Re-run the sheet after each round; a fix that raises a new flag isn't done. Knobs stay frozen. Commit, push and log each round in `tuning.md` so a fresh session could resume.
- [firm] **4. Then re-tune difficulty in both modes:** the campaign's knobs (best builds win 81–100% of first tries) and the rogue's (simulated player about 21% at heat 0). "Win rates set difficulty here, never balance."
- [firm] **5. Fresh eyes:** a separate agent that hasn't seen the tuning log runs the sheet and one AI playtest in each mode, and lists what still looks wrong or newly broke. Its list goes in the report as is.
- [firm] **6. Report, decisions first:** the biggest problems found, before and after, what's still flagged and why, what I'd do next. Bring the primer, `DECISIONS.md` and `CLAUDE.md`'s status up to date.

## Rules

- [firm] Keep their rules: a status scales by its stacks, not its applier; MP costs set by hand; the draw rule. "If one is the problem, show it with numbers; don't change it."
- [firm] Change numbers, not the engine, unless a fix needs a rule (then bump `ENGINE_VERSION` and flag it).
- [firm] Run `npm test`, typecheck and smoke before every push.
- [firm] If something makes no progress in three rounds, write down why and move on.
- [firm] Their own examples of what's wrong are held back on purpose, so the audit's findings are blind (the note was reverted from the repo before this session).
