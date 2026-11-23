# The wheel: report

## Now: stage 2 is yours

**Mark the plays: [The Play Inventory](https://claude.ai/artifact/Um9McV8JUm6tZ9tTykxdFm).**

- **515 plays**, one tab per way to win: burst 115, build up 99, debuff or disable 130, sustain 171. Within a way, they're grouped by the style question each one turns on.
- **Mark each play** alive, flat or never (you'd hate to see it in the game). A note is optional. A never is as useful as an alive.
- **Ramble** in the box at the top and in each way's box. Anything you add there that no play covers becomes a play.
- **It saves as you go,** so you can take it a section at a time. Keys on a play: 1 alive, 2 flat, 3 never, 0 clear, j/k next and previous, n note.
- **Two tags to mark like anything else:**
  - *needs a new block* (41 plays): the rules don't allow it yet, but one small addition to the engine would.
  - *needs a ruling changed* (8 plays): one of the sources' standing rulings is in its way. These are the party laying Doom or Bulwark, spending a status's stacks early, replacing a foe, and three sustain plays.
- **Say when you're done.** The next session reads your marks and rambles back and runs stage 3. Nothing happens until then.

One call you may want to check as you go. I merged plays that only differ in what rides on them when the fight would look the same; for example, a Mark that focuses the party's kills and a Mark that piles its stacks became one play. I kept plays apart where the same mechanism carries a payload that changes the fight; for example, a hit taken bringing the big hit closer and a hit taken bringing the shield closer stayed two plays. If the list feels too tight or too loose anywhere, say so in a note.

## Stage 1: the inventory (done)

- **Five agents ran apart:** one each for burst, build up, debuff or disable and sustain, and one for plays that only exist where two mechanics meet. Their prompts gave intent and ranges, with no examples (`inventory/prompts/`).
- **Their lists:**

  | List | Plays |
  | --- | --- |
  | Burst | 142 |
  | Build up | 101 |
  | Debuff or disable | 140 |
  | Sustain | 176 |
  | Where mechanics meet | 160 |
  | **Total** | **719** |

  The raw lists and each agent's notes are in `inventory/`.
- **The merge:** 204 plays were doubles of others in other words and were folded into the play they repeated. That leaves 515, in `plays.md`.
  - A kept play takes the other ways its doubles did as *also*, and lists the ids it absorbed.
  - Every decision is in `inventory/merges.txt`.
  - Most of the meeting agent's plays had already been found by a way agent; 37 stand as their own.
- **Gap check against `sources/threads.md`:**
  - Every word but one is touched by at least one play.
  - **A passive** is a word with nothing in it here. Passives belong to classes, which this workspace leaves out, and no building block doubles or lends one. The only play near it switches off a foe's passive, and it needs a block.
  - **Thin, but not gaps:**
    - *The first-slotted ability*: 3 plays.
    - *Between fights*: 4 plays, all about opening the next fight with an ability ready. The bounds rule out plays about lasting more fights.
  - No plays were added to fill gaps.

### Loose ends in the sources (no decision needed now)

The agents found places where the sources disagree or leave a rule open. These are for the main line, not for the wheel. Each agent's notes have the detail.

1. **Spending stacks:** the `spend` op sits against the ruling that a status runs its own course.
2. **Status damage and crits:** status pulses can crit (`crit`, `crit: fromSource`). That sits against "status damage can't crit" and "scales by its stacks, never by its applier".
3. **Status lengths:** `apply` has a `duration` field, against "lengths are universal".
4. **Boosts that name a status:** open whether they raise the stacks it lays or the damage it deals.
5. **Fields with no meaning given:** `remove`'s `move` and `order`; what `divert` counts as a gain.
6. **Revive:** `revive` has a `ready` field, against "comes back with every action on full cooldown".
7. **Units entering and leaving:** `replace` sits against "no unit leaves a fight alive". Party-side `summon` has no rule.
8. **Taunt calling the foes' actions early:** open whether every Taunt does it, or only an effect that says so.
9. **Control resistance** covers only Stun, Silence and Slow. Cooldown pushes and ability changes on a boss slip past it, which is likely a hole.
10. **Bosses:** no immunity is stated against `fell`, `trade` or `rewind`.
11. **Foes' MP:** open whether foes hold MP pools. The plays that drain foes' MP hang on it.
12. **Seats as targets:** seat targeting (`seat`, `next`/`previous`) sits against "no positional targeting" and "seat order only breaks ties".
13. **Two engine questions left open:** whether the enrage raises status damage, and the order of things that happen at the same moment.
14. **Might's `spare`:** Might can't have variants, so `spare` needs a Might-like status (marked as needing a block).

## For the next session

- The page's link is above, and its source is in `page/`: `plays.html`, plus `plays.json`, the list it shows.
- Marks are in the artifact's database:
  - collection `marks`: one document per play id, with fields `mark` (`alive`, `flat`, `never` or null) and `note`;
  - collection `rambles`: documents `top`, `burst`, `build`, `debuff` and `sustain`, each with a `text` field.
- Read them with `ArtifactData` `list` on the URL above.
