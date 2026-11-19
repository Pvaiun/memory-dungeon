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
15. **The set's size is the target: "I'd like to reach 450 pieces of gear and 50 formations."** All loot, commons and plain pieces included. A plain number, not a share and not a gap count (the director: "a number quota and letting the web be what it ends up being"). It stops the agent calling the web done early, as it did at 81.
    - **Where the number comes from:** a finished run should have shown its player about a quarter of all the loot (`intent.md`, What it's for). The agent's rough count from the rogue mode's settings, not yet simulated: a run shows about 90 pieces, about 65 of them with an effect. That's about a fifth of 450, a little under the director's quarter, on the side they lean ("perhaps that number is low"). Measure it with whole runs at build.
    - **What it asks of every piece:** with a fifth of the loot shown, two named pieces meet in about one run in 25. A piece that needs one particular partner almost never works; a piece with many partners works every run, with a different one each time. That's the director's "as cross-build as possible", and the agent checks each answer for it (`brief.md`, Reading the answers).
    - **How many of the 450 are authored isn't set.** By the loot's rarity rules a common is stats and an uncommon a simple effect, so the authored pieces are mostly rares and legendaries. The agent's estimate: about 225 if half the set is rare or above, about 315 at the 70% the director first offered. The web holds 73 gear effects, so 150 to 240 are still to come: 13 to 20 batches at twelve placed a batch. The director is glad to answer that many.
    - **A batch carries three or four formation cards** (the director: "We can put 3 or 4 formations per batch if we want"). The web has about 19 formations (7 Great, 7 written, and the Fine formations that hold a starred seat), so about 31 are still to come: eight to ten batches at that rate. Each formation card still needs a stated job; a batch with fewer real ones carries fewer.

16. **A card may name two builds' keywords.** The director, on Bleed on a Marked foe: "it should probably be allowed because that feels pretty limiting to making builds cross-compatible". The line in `docs/gear-design/builds.md` (The director's rulings) is rewritten, and the word "affliction" keeps its use for a card that reaches every status road. The agent's check stays: a card that needs both words already in the party has few partners, and is told so.
17. **An answer may change a class,** and the director says what goes. The Mark's answer changed two versions (`web.md`, Kit changes, for build). The kits stay as they are until build.
18. **Nothing in the loot touches the bench:** "I don't think players should meta-game the bench in terms of affecting combat."

## The page

`https://claude.ai/artifact/EBRC2rs3Tw6JW2AWMgxZDf`. **The page is built: use it as it stands, and never make it again.** A session's whole flow goes through the page's store, with the ArtifactData tool on that address:

- **Seed a batch:** write its cards to `requests/<id>` with the next batch number, in one batch write. The page shows them by itself.
- **Read the answers:** query `answers` for the batch, once the director says they're done.
- **Write the reads and questions:** write each to `replies/<id>`; the director answers a question in its reply box.

None of these needs the page's source read, the page read back, a design skill loaded or anything republished. Where the flow needs something the page can't do yet, or the director asks for a change, edit the existing `requests-page.html` in place and republish it to the same address. Don't write a new page, and don't rewrite this one from scratch.

The store holds the requests (`requests/<id>`: batch, order, kind, title, ask, why, near) the director's answers (`answers/<id>`: text, status, reply, batch) and the agent's read of each (`replies/<id>`: kind, text, after; kind is placed, question, overused, withdrawn or again). A question and an overused read both show under Needs you until the director replies; overused is the read for ruling 12. A new batch is seeded into `requests` with the next batch number, and the answers are read back from `answers`.

- **A read that answers the director's reply carries that reply in `after`,** copied exactly from `answers/<id>.reply`. While their reply still matches it, the card is flagged: "Needs you" if the read's kind asks (question or overused), "Replied" if it doesn't. The flag clears when they change their reply. Set `after` on every read rewritten after a reply, so they don't have to reread the batch to find them.
- **A changed card redraws itself.** The page first draws from the copy each device keeps, then the store's live copy arrives; a card's ask, why and near lines are redrawn whenever its request changes, and what the director has typed stays.
- **A request's kind** is road, link, capstone, supply, function, pair (a piece two classes would both want), formation or open.
- **A near line's tag** is great, fine, seat (a seat the director starred), gform or fform (a Great or a Fine formation), or yours (an effect the director wrote in an earlier batch).
- **The page opens on a batch newer than any its device has shown,** and after that on the batch last picked.
- **Batch 1** is `batch-1.md`: six roads with no Great of their own, four links between the Greats' clusters, a change of target, two formations, a wall-less party, and an open card. **Batch 2** is `batch-2.md`: four roads, three links, two functions, two pairs of classes, two formations, and an open card. One of the pairs asks for a Burn piece (ruling 12). **What batch 2 taught about asking:** three of thirteen came back as the wrong question, each for a job the game already does by itself (foes act, every unit swings and casts, one ability is still a full cast rate), and two cards' near lines were called irrelevant. A card with nothing near it says so and lists nothing. **Batch 3** is `batch-3.md`: fourteen cards and the open one. A whole direction (the Mark, the first of its kind), the Hunt in a fight with one foe, a way to hide a unit, three functions (the wind-up, the bench, a count that grows), four pairs of classes (one asks for a Sunder piece), and four formations (who acts often, crits, what the seats wear, wide and narrow actions). Two pairs carry a constraint in the ask because their classes sit on a crowded mechanic (the Knight and the Ranger: no Shield or dodge piece; the Vampire and the Stormcaller: nothing on HP paid or held low), and three functions say what would only repeat a kept effect.

## What the triage shows

- **The Greats are about a unit's own body and rhythm:** its HP bar (seven), its Shield (five), its MP and casts (seven), how its basic attacks come (six), its dodge (four), a stat read from somewhere else (four). Nearly all either move something to a place it doesn't normally go, or change how a unit acts at a price.
- **The Greats by road:** Landslide 9, the Toll 8, Thousand Cuts 8, Barrage 7, Blood Pact 7, the Hunt 3, the Storm 3, Bonfire 2, Cold Snap 2. Bonfire's two are a caster's pieces, not the fire's.

## Next: for the session that picks this up

Batches 1, 2 and 3 are closed: every answer is placed, left out or withdrawn (`web.md`, Added by batch 1, 2 and 3; the director's words and each read in the three answers files). The web holds 96 effects: 73 on gear and about 19 formations, against a target of 450 pieces and 50 formations (ruling 15). Two kit changes are settled and listed for build. Nothing on the page waits on the director.

**What went wrong at the end of batch 2, so it isn't repeated.** At 81 effects the agent said the gaps were few and offered to move to the plain parts; the director "felt like we were barely getting started". What had run thin was one way of finding cards (thin spots among the kept effects). The agent then reached for structure twice: the holes in the earlier loot (against ruling 4), and a skeleton of needs by road and class (ruling 14). Neither is the method. The method is the batches.

1. **Read `brief.md` first.** Its reading list (What to read) is closed.
2. **Check a price or a size against the numbers before placing it.** In batch 3 the director put a price of half its Attack on a piece that adds stacks; stacks follow Attack point for point, so the piece would have taken stacks away. Where an answer leans on how a number is made, read the constant.
3. **An answer may change a class.** The director, on the Mark: "I don't think we can have a type of build that only get enabled by gear and one class" (only the Paladin's kit Marks). A class change in an answer is theirs to make. Don't place it as loot: list it in `web.md` as a kit change, with the versions it touches, to be made at build. The kits stay as they are until then. Say what each change costs: which version goes, and what that version was doing.
4. **Then batch 4,** about fifteen cards, three or four of them formations, from the same places, roughly in this order of how well each has worked:
   - **What placing the last answers found** (`web.md`, Found by placing them, and Gaps seen): something the web now supplies with nothing to do with it, or a set of parts one short of working.
   - **Two classes that share a kind,** asked for a piece both would want, each for its own reason. Read each class's section of `docs/core-set/classes.md` before naming it. Pairs asked so far: Pyromancer and Bramble knight, Assassin and Cleric, Monk and Hoplite, Knight and Ranger (withdrawn), Bard and Hexer, Vampire and Stormcaller. The Paladin, the Valkyrie, the Frostweaver and the Geomancer haven't been in one. **Don't bar both classes' own mechanics in the ask:** the Knight and the Ranger with Shields and dodges set aside left the director nothing to join, and the answer joined neither. Where a pair's trunks both sit on a crowded mechanic, pick another pair.
   - **A whole direction.** The Mark card was the first, and it worked: five effects and two kit changes from one card. Ask it where the web has almost nothing for a road's own lever.
   - **A formation with a stated job.** All four in batch 3 were answered. The job that names something the seats trade (time, crits, gear, how many an action lands on) is the form.
   - **A road's thin spot,** asked as a named job with the kind of thing wanted back. Say what a party on that road lacks without the piece before sending one.
   - **A supply the last batch owes:** Silence from somewhere other than the Assassin and the Hexer, so the piece that counts a Silence as a foe falling has more than two classes for partners. The director has been told it's coming.
   - **A function with a plain constraint.** The wind-up and the count were answered; the bench was the wrong question (it's a lever the loot doesn't touch).
   - **The open card,** every batch.
5. **Every card passes ruling 9,** and a batch is as long as its real jobs: if fifteen can't be found, send fewer and say so. Two short batches running is the sign to stop and talk, whatever the target says.
6. **Recount before treating a mechanic as closed.** The overused line moves as the web grows (one effect in twelve is 8 of 96). The dodge and HP held low have dropped under it by number and stay on watch; crits and heals are on watch; Shield and the fight's start are still over.
7. **Tell the director when a seeded card changes or a read lands:** the page redraws by itself (The page), so no reload is needed.
8. Still to come, in the director's order, once the authored pieces are in and they've looked at the whole web: the plain parts (the agent's, shown by sample; Guard on gear is owed there), sizing and slotting what's placed, formations beyond those kept or written, mythics, then build. Slotting is where a class with too little to wear shows up; what it finds comes back as cards.
