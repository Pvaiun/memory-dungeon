# Authored gaps: first report

For the director, Nov 17. Nothing in the game has changed: this is the first map of the web (`web.md`), made from the triage (`triage.md`) and today's loot, with the decisions it needs and a first batch of requests.

## Ruled by the director (Nov 17)

1. **The same nine builds, with a better web.** The web is rebuilt from what the director marked Great, and new Greats come from their answers to the requests.
2. **Status effects don't stay plain as a rule.** A road may have Greats on its own status.
3. **No filling from the Fines.** They were the bare minimum acceptable: the pool isn't started with mediocre pieces. Some basic pieces will exist, later. A Fine comes in only where something needs it.
4. **A clean slate.** Today's pieces aren't the skeleton: "What's in the build now is not better than what is in the list."
5. **Requests come in batches of about fifteen, on a page the director types into,** never in the chat. Requests and conversation don't share a message.
6. **Formations are in the pass,** triaged the same way (`triage-formations.md`: 7 Great, 19 Fine, with the seats the director liked starred). Upgrades and mythics weren't triaged; the agent's recommendation (upgrades stay as part of the kits, mythics last and from scratch) hasn't been ruled on.

7. **No size on a request unless it needs one.** The director writes whatever they find most interesting, with no numbers; where a request needs a particular size, its ask says so. The agent sizes afterwards, and says plainly when an answer is too small or too big.
8. **Answers won't be colour-coded.** The director's answer to a road's request may not name that road's status, and may serve many roads. It's placed by what it does, not by the card that asked.

9. **How the agent asks,** after batch 1 (six of fifteen marked as the wrong question): a request names a job in the game's own terms and says what kind of thing is wanted back (an applier, a payoff, a seat, a link between two named things). No request for coverage: before asking, check that nothing the director kept already does the job. No abstractions in the ask.
10. **The agent's read of each answer goes on the page,** on its card, with a reply box where it asks something. The chat carries only the summary and the decisions.

## The page

`https://claude.ai/artifact/EBRC2rs3Tw6JW2AWMgxZDf` (source: `requests-page.html`; republish that file to the same address). Its store holds the requests (`requests/<id>`: batch, order, kind, title, ask, why, near) the director's answers (`answers/<id>`: text, status, reply, batch) and the agent's read of each (`replies/<id>`: kind, text; kind is placed, question, withdrawn or again). A new batch is seeded into `requests` with the next batch number, and the answers are read back from `answers`. Batch 1 is `batch-1.md`: six roads with no Great of their own, four links between the Greats' clusters, a change of target, two formations, a wall-less party, and an open card.

## What the triage shows

- **The Greats are about a unit's own body and rhythm:** its HP bar (seven), its Shield (five), its MP and casts (seven), how its basic attacks come (six), its dodge (four), a stat read from somewhere else (four). Nearly all either move something to a place it doesn't normally go, or change how a unit acts at a price.
- **Today's loot keeps under half its effects.** Of 252 pieces with an effect below mythic, about 117 hold a kept effect (37 a Great) and about 135 are holes: about 52 uncommons, 55 rares, 28 legendaries.
- **Seven Greats have no piece today,** and about 70 Fines don't either.
- **Every road loses about half its pieces;** the Toll, Landslide and the Hunt lose about six in ten.
- **The Greats by road:** Landslide 9, the Toll 8, Thousand Cuts 8, Barrage 7, Blood Pact 7, the Hunt 4, the Storm 3, Bonfire 2, Cold Snap 2. Bonfire's two are a caster's pieces, not the fire's.

**How sure.** The counts come from matching the triage's lines to today's cards by their words. Edited lines match loosely, so each count is near, not exact. The slot-by-slot skeleton checks every piece.

## First requests

A trial of the format: six, each with the kept effects near it.

1. **Bonfire.** Nothing kept is about the fire beyond laying it, and the road's idea is a fire that dies unless it's fed. I need one piece about keeping something up that a player would stop for. Near it: Crescendo, Heat that's lost when hit, more Burn every 3 ticks on the hottest foe, Burn passed on when its foe falls.
2. **Cold Snap.** Everything kept on a shatter pays something small: MP, an ability ready, half a wait, half the cold moving on. I need a shatter that changes what the party does next. Near it: the ×3 swing that Stuns, Chill from max HP.
3. **The Hunt.** Nothing Great is about choosing who dies. I need a reason to care which foe falls first. Near it: both openings that happen again, ×2 while Hidden, every ally attacking at once when a Marked foe falls, foes below 50% HP falling with the first.
4. **The dodge and the hit that lands.** Four Greats fire on a dodge and none helps with the blow that gets through, which is why a dodger didn't hold as a front in play. I need the link from the dodge to cover: a Shield, HP or MP. The plain version (a Shield on each dodge) isn't in the kept lists, so I won't guess. Near it: the four dodge Greats, damage that hits MP, overheal as a Shield.
5. **A debuff held on purpose.** Three kept effects want a unit that carries one: its hits move its debuffs onto the target, a status it gives itself is shared with the lowest ally, and statuses hurt it 50% less. Nothing kept puts a debuff on its own wearer. I need a way to hold one on purpose.
6. **The crit.** Two Greats: crits heal the lowest ally, and +50% Crit chance with every other hit halved. I need one more thing a crit does that isn't damage or a status on its target. Near it, in the Fines: a crit adds Bleed, Marks, Slows or lands again; another ally's crit gives Might.

## Next: for the session that picks this up

Batch 1 is closed: every answer is placed or withdrawn and nothing waits on the director (`web.md`, Added by batch 1; their words in `batch-1-answers.md`).

1. Read `intent.md`, this report's rulings, `web.md` and `batch-1-answers.md`. The answers file is the best record of what the director likes and how they push back.
2. Write batch 2 from `web.md`, Gaps seen, by ruling 9. About fifteen cards, plus an open card. Seed them into the page's `requests` collection with `batch: 2` (the shape is under The page; `batch-1.md` shows a batch as seeded).
3. Tell the director in the chat only that the batch is out. When they say they're done, read `answers`, write a read of each into `replies` (kind and text), and put only the summary and the decisions in the chat. Don't read their answers before they say so.
4. Still to come, in the director's order: the basic pieces (the agent's, shown by sample), sizing and slotting what's placed, formations beyond the nine kept or written, mythics, then build.
