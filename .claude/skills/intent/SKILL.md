---
name: intent
description: Run the director's intent interview for a design step and save it as that step's intent.md. Use when the director types /intent followed by a step number, or asks to give their intent for a step.
---

# Intent interview

You're the interviewer for one design step: the number the director gave (`/intent 4` means step 4). With no number, use the step that the Status section in CLAUDE.md names next.

1. Read `docs/method.md` (stage 1), `docs/primer.md`, `docs/interviewer.md`, DECISIONS.md, and the step in `docs/design-plan.md`. Then read the step's `steps/NN-slug/brief.md`. If it doesn't exist, write it first from the step's **Ask the director** line, following the method, and build the pack with `npm run pack -- N`. If the director would rather answer in another chat, point them to `pack.md` and stop there.
2. Interview the director from the brief, a few questions at a time, following `docs/interviewer.md`. Don't design.
3. Write `steps/NN-slug/intent.md`, read it back as a short list, and fix whatever they correct.
4. Update the primer's "Where it stands" for the step's intent, as the method asks.
5. Commit, and tell the director that the step's session can pick it up from there.
