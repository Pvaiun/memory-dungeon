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

13. **The agent builds the web; the director fills its gaps, or originates the sections it doesn't have.** The classes and the roads are fair things to ask from. The earlier loot is no part of it and no decision rests on it ("not relevant to this at all").
14. **The web grows by batches, from what it holds, and is what it ends up being.** The director: "this batch thing of building based on what we have is working really well". No skeleton of each road's and class's needs is drawn up first: the agent proposed one, the director asked whether it was a mistake, and the agent agreed it was (`brief.md`, Tried and dropped).
15. **The set's size is the target: "I'd like to reach 450 pieces of gear and 50 formations."** A plain number, not a share and not a gap count (the director: "a number quota and letting the web be what it ends up being"). It stops the agent calling the web done early, as it did at 81.
    - **The agent reads it as the whole set,** commons and plain pieces included, and has said so to the director. If they meant 450 authored pieces, that reading is wrong and the work is about twice as long.
    - **How many of the 450 are authored isn't set.** By the loot's rarity rules a common is stats and an uncommon a simple effect, so the authored pieces are mostly rares and legendaries. The agent's estimate, given to the director: about 225 if half the set is rare or above, about 315 at the 70% they first offered. The web holds 62 gear effects, so 160 to 250 are still to come, which is 16 to 25 batches at ten placed a batch.
    - **Formations are the long way round:** the web has about 15 (7 Great, 3 written, and the Fine formations that hold a starred seat), and two a batch brings 35 more only after 17 batches. The agent suggested more formation cards a batch, or a batch of formations alone; not ruled.
    - **Two things the agent flagged, to watch and not to argue now.** A bigger pool makes it rarer for two parts of a found synergy to meet in one run; that's measured with whole runs at build, and it's less of a risk while the director's pieces keep serving many roads at once. And the plain parts come after, only where something needs one (ruling 3).

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
- **Batch 1** is `batch-1.md`: six roads with no Great of their own, four links between the Greats' clusters, a change of target, two formations, a wall-less party, and an open card. **Batch 2** is `batch-2.md`: four roads, three links, two functions, two pairs of classes, two formations, and an open card. One of the pairs asks for a Burn piece (ruling 12). **What batch 2 taught about asking:** three of thirteen came back as the wrong question, each for a job the game already does by itself (foes act, every unit swings and casts, one ability is still a full cast rate), and two cards' near lines were called irrelevant. A card with nothing near it says so and lists nothing.

## What the triage shows

- **The Greats are about a unit's own body and rhythm:** its HP bar (seven), its Shield (five), its MP and casts (seven), how its basic attacks come (six), its dodge (four), a stat read from somewhere else (four). Nearly all either move something to a place it doesn't normally go, or change how a unit acts at a price.
- **The Greats by road:** Landslide 9, the Toll 8, Thousand Cuts 8, Barrage 7, Blood Pact 7, the Hunt 4, the Storm 3, Bonfire 2, Cold Snap 2. Bonfire's two are a caster's pieces, not the fire's.

## Next: for the session that picks this up

Batches 1 and 2 are closed: every answer is placed, left out or withdrawn (`web.md`, Added by batch 1 and Added by batch 2; the director's words and each read in `batch-1-answers.md` and `batch-2-answers.md`). The web holds 81 effects. Nothing on the page waits on the director. The target is set (ruling 15: 450 pieces of gear, 50 formations). Two things in that ruling are the agent's reading and may be corrected: that 450 is the whole set, and how many formation cards a batch carries. Record a correction there if one comes.

**What went wrong at the end of batch 2, so it isn't repeated.** At 81 effects the agent said the gaps were few and offered to move to the plain parts; the director "felt like we were barely getting started". What had run thin was one way of finding cards (thin spots among the kept effects). The agent then reached for structure twice: the holes in the earlier loot (against ruling 4), and a skeleton of needs by road and class (ruling 14). Neither is the method. The method is the batches.

1. **Read `brief.md` first.** Its reading list (What to read) is closed.
2. **Write batch 3,** about fifteen cards, and seed it to the page with batch number 3. Put only a short summary in the chat. Where the cards come from, roughly in this order of how well each has worked:
   - **What placing the last answers found** (`web.md`, Found by placing them, and Gaps seen): something the web now supplies with nothing to do with it, or a set of parts one short of working.
   - **Two classes that share a kind,** asked for a piece both would want, each for its own reason. Placed both times it was asked. Read each class's section of `docs/core-set/classes.md` before naming it.
   - **A road's thin spot,** asked as a named job with the kind of thing wanted back. Half of these have come back as the wrong question, so say what a party on that road lacks without the piece before sending one.
   - **A formation with a stated job.**
   - **A whole direction,** where the web has almost nothing for a road's own lever. The director's intent names this kind of request, and it hasn't been asked yet.
   - **The open card,** every batch.
3. **Every card passes ruling 9,** and a batch is as long as its real jobs: if fifteen can't be found, send fewer and say so. Two short batches running is the sign to stop and talk, whatever the target says.
4. **Recount before treating a mechanic as closed.** The overused line moves as the web grows (one effect in twelve is 7 of 81).
5. **After the answers:** read them, place them, update the count, and tell the director where the web stands against the target: gear effects placed, and formations.
6. Still to come, in the director's order, once the authored pieces are in and they've looked at the whole web: the plain parts (the agent's, shown by sample), sizing and slotting what's placed, formations beyond those kept or written, mythics, then build. Slotting is where a class with too little to wear shows up; what it finds comes back as cards.
