# Authored gaps: rulings and handoff

The reasoning behind this step is in `brief.md`; read that first. This page holds the director's rulings, how the request page works, and what the next session does. Nothing in the game has changed.

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

11. **No Fines on a card** (after batch 2 went out with them). Most Fines won't be in the game, and the director's answer outranks any it overlaps, so there's nothing to steer around. "Near it" shows only Greats, starred seats, Great formations and the director's own placed answers. A card doesn't mention Fines at all: a job only a Fine does today is a job nothing in the web does, and the card says that. The director is never asked to replace one.

12. **The agent judges whether a mechanic is overused, and tells the director.** The director writes the pieces and doesn't manage the web, so they can use one trigger or mechanic too often without seeing it, which is how a player comes to take everything that shares a word. The judgement is the agent's, and the director is told, not asked.
    - **A count is kept in `web.md`** (The count): for every effect in the web, what sets it off, what it reads, and what it changes or moves, updated each time an answer is placed. The test is in `brief.md`, The count.
    - **An answer on an overused mechanic** gets a read that says so plainly: the idea is good, the web has too much on that mechanic, give me something else for the same job. It's marked as needing the director. The agent never moves their idea onto another mechanic: what replaces it is theirs. If they answer that they want it as written, that's the ruling and it's placed.
    - **A card may ask for its job to be done from a named underused mechanic,** in one plain sentence in the ask.
    - **How this fits ruling 9.** Ruling 9 is about whether to ask: a card needs a job the web lacks, and "nothing names this mechanic" is never that job. This ruling is about how to ask once there's a job: the card may name the underused mechanic it wants the job done from. An underused mechanic with no job waits in `web.md`, Gaps seen, until one turns up.

## The page

`https://claude.ai/artifact/EBRC2rs3Tw6JW2AWMgxZDf`. **The page is built: use it as it stands, and never make it again.** A session's whole flow goes through the page's store, with the ArtifactData tool on that address:

- **Seed a batch:** write its cards to `requests/<id>` with the next batch number, in one batch write. The page shows them by itself.
- **Read the answers:** query `answers` for the batch, once the director says they're done.
- **Write the reads and questions:** write each to `replies/<id>`; the director answers a question in its reply box.

None of these needs the page's source read, the page read back, a design skill loaded or anything republished. Where the flow needs something the page can't do yet, or the director asks for a change, edit the existing `requests-page.html` in place and republish it to the same address. Don't write a new page, and don't rewrite this one from scratch.

The store holds the requests (`requests/<id>`: batch, order, kind, title, ask, why, near) the director's answers (`answers/<id>`: text, status, reply, batch) and the agent's read of each (`replies/<id>`: kind, text; kind is placed, question, overused, withdrawn or again). A question and an overused read both show under Needs you until the director replies; overused is the read for ruling 12. A new batch is seeded into `requests` with the next batch number, and the answers are read back from `answers`.

- **A request's kind** is road, link, capstone, supply, function, pair (a piece two classes would both want), formation or open.
- **A near line's tag** is great, fine, seat (a seat the director starred), gform or fform (a Great or a Fine formation), or yours (an effect the director wrote in an earlier batch).
- **The page opens on a batch newer than any its device has shown,** and after that on the batch last picked.
- **Batch 1** is `batch-1.md`: six roads with no Great of their own, four links between the Greats' clusters, a change of target, two formations, a wall-less party, and an open card. **Batch 2** is `batch-2.md`: four roads, three links, two functions, two pairs of classes, two formations, and an open card. One of the pairs asks for a Burn piece (ruling 12).

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

Batch 1 is closed: every answer is placed or withdrawn (`web.md`, Added by batch 1; their words in `batch-1-answers.md`). Batch 2 is on the page and unanswered: thirteen cards and an open one (`batch-2.md`; `web.md`, Asked in batch 2, says where each came from and what was changed or dropped on the way out). Nothing else waits on the director.

1. Read `brief.md` first: what this step is for, how the work is split, what was tried and dropped, and what the first batch taught. Its reading list (What to read) is closed: read what it names for the job in hand, and nothing else whole.
2. Wait for the director to say they're done with batch 2. Don't read `answers` before that.
3. Then read the answers whose `batch` is 2 and write a read of each into `replies` (kind and text), as `brief.md` says under Reading the answers. Check each against the count (`web.md`, The count): an answer that names an overused mechanic gets an `overused` read and isn't placed until the director replies. Put only the summary and the decisions in the chat. When the batch closes, copy it to `batch-2-answers.md`, fold what's placed into `web.md`, and add each placed answer to the count.
4. Write batch 3 from what placing the answers shows and from `web.md`, Gaps seen, by rulings 9 and 12. Before a card goes out, check that nothing kept does its job and that its plain answer isn't something the director cut. Where its job can be done from a mechanic the count shows as underused, the ask names it.
5. Still to come, in the director's order: the basic pieces (the agent's, shown by sample), sizing and slotting what's placed, formations beyond those kept or written, mythics, then build.
