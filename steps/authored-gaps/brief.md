# Authored gaps: the brief

Read this first. It says what this step is trying to do and why, how the work is split between the director and the agent, what was tried and dropped on the way here, and what two batches have taught. `intent.md` is the director's intent in their words; `report.md` is their rulings and the handoff; this page is the reasoning behind both, written by the agent that ran the first session. Where the director's word differs, theirs wins.

## What to read

**Read little.** The work is judgement: writing a request that isn't the wrong question, and reading an answer against the rules. The director found that the judgement gets worse as the reading piles up, so this list is closed. What isn't on it is reference: open one section when a specific card or answer needs it, and not before.

- **Every session:** `docs/primer.md`; this brief; `report.md` (the rulings and Next); `intent.md`; `web.md`.
- **To write a batch:** in `docs/gear-design/builds.md`, The director's rulings, The frame and The builds (the nine roads). In `docs/gear-design/loot.md`, The director's rulings only.
- **To read answers:** `batch-1-answers.md` and `batch-2-answers.md`, for how the director answers and pushes back; the rulings in `docs/core-set/vocabulary.md` and `docs/gear-design/loot.md`.
- **Only when a card or an answer needs it, and only that section:**
  - a status's entry in `docs/core-set/vocabulary.md`, when an answer names or leans on one;
  - a class's section of `docs/core-set/classes.md`, when a request names a class or to see what a kit already supplies;
  - the triage files, searched for a card's "near it" lines and for whether something kept already does a job;
  - one engine in `docs/gear-design/engines.md`, for what play showed (they were written for today's loot, which isn't the skeleton here);
  - `docs/core-set/rogue-mode.md`, for anything between fights; `docs/core-set/combat.md`, where a claim rests on how a fight runs.
- **Leave alone:** rebuilding the page. It exists and it's the one to use: cards are seeded, answers read, and reads and questions written through its store (`report.md`, The page), and where it needs a change, the existing source is edited, never started again; `batch-1.md`, `batch-2.md` and `batch-3.md` beyond the cards in hand; `docs/gear-design/philosophy.md` (its rulings are on the pages above); the code.

**When to hand over.** At a batch's end, with the folder brought up to date. What wears a session down is what piles up in it: documents read whole, superseded versions of a plan, old copies of files, and at the far end an automatic summary that drops the director's exact words. A fresh session reading the current files has none of that.

## What the game needs

- **The value is the building of the builds.** The fun is each pick: a player facing a choice and working out what to do with it, toward something powerful. Played hundreds of times, the game should keep surprising its player with what gets made. Distinct, strong builds at the end aren't the point; the nine builds exist as context for making content that works together, and they do that job.
- **It has failed two ways.** First, pattern matching: a player took everything that said one word, and it always worked, so no pick was a thought. Then, asked for exotic effects to break that, the loot came out random and esoteric: strange alone, with nothing to do with it.
- **The director's diagnosis.** The agent makes sets with many connections and can't author interesting things to explore inside them. The director is the reverse: unique things come easily, and coherence across a set doesn't. After generating everything about two and a half times by direction and approval, they judged that way of working at its ceiling.
- **This step is the layer between** directing in broad concepts and editing data by hand. The agent holds the structure; the director writes into it.

## The split

- **The agent's:** the web (what connects to what, where it's thin, and whether a mechanic is overused), finding the gaps, turning each answer into a piece, checking it against the rules, sizing it, running it, and the plain parts nobody needs to author.
- **The director's:** every creative decision. What a gap is filled with, and any call on a build's structure or goal.
- **Many requests are welcome:** "I don't mind answering hundreds of these... I enjoy it." What they aren't for is the other kind of volume: data entry and mass content.
- **The director is never asked for** data entry or ideas from nothing. They said plainly that they can't write good questions or pieces with no context. Every request gives them a frame: one job, and what already sits near it.
- **The agent doesn't model the director's taste.** Workflows that rest on the agent learning what they like from their reactions were set aside by them: they've tried versions of that, and it depends on the agent parsing taste. So don't generate candidates for approval. Ask, and let them write.

## Tried in conversation and dropped

So they aren't proposed again. Each was the agent's idea.

- **Reacting to content** (notes left in play, short staged moments to judge). The director liked two of these as ideas, and said they were a different category from what they wanted, which was authoring.
- **Authoring whole finished parties** and working backward. Dropped: the builds are already good, and a clearer destination makes the picking less interesting.
- **A census of the game's quantities, with the director writing "inversions" onto it.** Their answer: that's more pattern matching, and they can't write questions cold.
- **An abstract frame** (the player's state, the decision, the kind of pull). It lost them: "I don't understand what you're proposing anymore."
- **A size on every request.** Added only because they asked, and removed when they asked whether it really helped. A constraint goes in the ask itself, and only where the request needs one.

- **Gaps taken from the earlier loot** (what each cut piece's slot was for). The director: "the loot we had before is not relevant to this at all". The web is built from the roads and the classes.
- **A skeleton of what each road and class needs,** each need marked met, plain or a gap, drawn up before the next batch. The director approved it, then asked whether it was a mistake, and the agent agreed. It's the top-down structure that reached its ceiling before: it turns every unmet need into a request for coverage, it sorts pieces by road when the director's answers serve many roads at once, and the agent reached for it because it had been told it was wrong, not because the batches had stopped working. The best of the web has come from placing answers and seeing what they do together.
- **A share of the set to reach** (the director offered 70% authored). No share is set; the set's size is the target (`report.md`, ruling 15).

What stuck was the director's own formulation: a skeleton, gaps where the agent is unsure, and each gap brought to them as an objective.

## What a good request is

Six of the first fifteen came back marked as the wrong question, and the director was right about all six. The causes, and the rule they left:

- **Asking for coverage.** "This road has no Great on X" isn't a gap if something they kept already does the job. Check what's kept before asking. The loot's philosophy already says not to ask for coverage of every mechanic.
- **Asking for what they cut.** What's in today's loot (`npx tsx tools/loot-list.ts`) and in neither triage pile was cut. An ask whose plain answer is a cut effect is a wrong question too: two formations whose seats aimed the party were cut, so batch 2 didn't ask for one.
- **Abstractions.** An ask in figures of speech can't be answered. Name the job in the game's own terms, and say what kind of thing is wanted back: an applier, a payoff, a seat, a link between two named things.
- **Levers the player doesn't have.** Preparation is the whole game: who fights, what they wear, where they sit, the order of their abilities. The party's aim is steered only by a Mark and by an ability's own target phrase. A request that assumes another lever is wrong before it's asked.
- **Asking for what the game does by itself.** Three of batch 2's thirteen were this: a way to make the foes act (they act anyway, and faster foes hurt the party), a link between swings and casts (every unit does both, so it's good on every unit and a thought for none), a piece for a unit with one ability (one ability is still a full cast rate). Before asking, say what a party lacks without the piece. If the answer is "nothing, but two groups aren't joined", it's coverage.
- **Near lines that aren't about the job.** Twice the director couldn't see why a card's near lines were there. List only what does the job or touches it. Where nothing does, the card says nothing is near it and lists nothing.
- **What worked:** links between two named things, a formation with a stated job, a function with a plain constraint. The director's own example requests in `intent.md` are the model for the form.
- **"Near it"** on a card is the Greats, starred seats and their own placed answers that sit closest to the gap. It's context, never a constraint. No Fines: listed there, they read as things to fit around, and most won't be in the game. A card with little near it is showing a real hole.
- **No numbers and no sizes from the director.** They write whatever they find most interesting. The agent sizes afterwards, and says plainly when an answer is too small or too big for where it has to sit.
- **They won't colour-code.** An answer to a road's request may never name that road's status and may serve many roads. That's what the game needs. Place it by what it does, not by the card that asked.
- **Ask from an underused mechanic where the job allows it.** A card still needs a job the web lacks. Where the count shows a mechanic the web needs more of, the ask names it in one plain sentence (The count, below).
- **An answer they struggle to write is a wrong question too.** Asked for a formation about the kill, the director wrote one they didn't believe in and then couldn't find another: felling foes is every party's aim, so there was nothing to change. When they say they can't find it, withdraw the card; don't ask again.
- **"Wrong question" is the most useful button on the page.** Treat it as correct until shown otherwise, withdraw or re-ask in plain words, and say which.

## Reading the answers

- **Read each one against the rules:** the director's rulings on vocabulary, loot and builds, and the section of `docs/core-set/vocabulary.md` for any status it names (What to read, above). Say what it conflicts with, what was assumed where the words are open, and what it does once it's placed beside the rest.
- **Push back.** The director asks for it and uses it: one pushback in the first batch made them replace a piece with a better one that broke no rule. They also overrule, and then that's the ruling.
- **Check a claim before pushing back with it.** One pushback in the first batch was wrong: the agent trusted a test's name over the rule's own text, and the director knew the game better than the note did. Where a pushback rests on how the engine behaves, read the rule or the code first.
- **Count its partners.** A run shows about a fifth of the loot, so two named pieces meet in about one run in 25 (`report.md`, ruling 15). Say how many things in the web an answer works with. One that needs a single particular partner is told so, plainly; one with many is what the game is for.
- **Say what placing them found.** Interactions nobody wrote down are the point of the web, and the director wants to hear them.
- **Check each answer against the count** (below). A phrase many pieces share and a few pieces multiply is how the first failure came about, and the director can't see it forming from where they write.
- **Be honest about your own additions.** Asked whether the sizes really helped or were only a response to their question, the true answer was the second, and saying so got a better page.

## The count

The director doesn't manage the web, so they can use the same trigger or mechanic too often without noticing. Judging that is the agent's job, and they want to be told, not asked.

- **The test.** A mechanic is overused when a player could take every piece that names it and be right each time: about one effect in twelve of the web, or more, names the same thing (a status, an event a unit has to be built for such as a dodge or the fight's start, or a resource such as Shield), and those effects add up on one unit instead of pulling against each other. It's underused when the game leans on it (a road's own status, a lever the player holds, or something the kits and kept effects supply) and fewer than three effects name it.
- **What the test leaves alone.** Swings, casts, hits and plain stats are every unit's, and are common on purpose. A status no build leans on can stay rare. Judge by what a player would notice across a run, never by an even spread.
- **The count is in `web.md`:** what sets each effect off, what it reads, what it changes or moves, with a line for every effect. Add each placed answer to it, and recount the words a player would collect.
- **An answer on an overused mechanic:** say so in its read, plainly. The idea is good, the web has too much on that mechanic, give me something else for the same job. Write the read with the kind `overused`, so it shows under Needs you. Don't move their idea onto another mechanic: what replaces it is their decision. If they reply that they want it as written, it's placed.
- **A job that can be done from an underused mechanic:** the card's ask says which, in one plain sentence. An underused mechanic with no job isn't a card: asking for it would be asking for coverage.

## What the kept effects have in common

The agent's reading, for seeing where the web is thick. It isn't the director's words and isn't a recipe for writing pieces.

- **Gear they marked Great** nearly all either moves something to a place it doesn't normally go, or changes how a unit acts at a price. Very few name a status.
- **Formations they marked Great** make one unit's stats, statuses, hits or mana another's.
- **What they marked Fine is the bare minimum they'd accept,** not stock to fill with. A Fine comes in only where something needs it, and the agent says what needs it.
- **Today's loot isn't the skeleton.** "What's in the build now is not better than what is in the list."

## Working with the director here

- **Requests go on the page, never in the chat,** about fifteen at a time, and requests and conversation never share a message. The chat carries a short summary and the decisions.
- **Don't read their answers until they say they're done.**
- **The agent's read of each answer goes on its card,** with a reply box under it. They want to be able to comment on any read, asked or not.
- **Short and plain,** leading with what needs deciding. They don't read files; the step folder is for the next agent.
- **Commit and push at each stop.** The session checks for uncommitted changes.

## Where it goes

1. More batches, toward the set's size in `report.md`, ruling 15 (450 pieces of gear, 50 formations), then a look at the whole web with the director. Few thin spots among the kept effects doesn't mean the web is full: cards also come from what placing found, from pairs of classes and from whole directions (`report.md`, Next). The earlier loot is never where a card comes from.
2. The plain parts, written by the agent and shown by sample, at the end and only where something needs one.
3. Sizing and slotting what's placed: kinds, rarities, who wears it, numbers.
4. Formations beyond those kept or written, then mythics, on the director's word.
5. Build and measure. Until then the game stays on today's loot, and nothing in it changes.

Not decided: how many of the 450 are authored, and whether upgrades and mythics join.

## The files

- `intent.md`: the director's intent, recorded short.
- `report.md`: their rulings, how the page and its store work, and the next steps.
- `triage.md`, `triage-formations.md`: what they kept, in their two piles.
- `web.md`: where the kept effects sit, what each batch added, the count of what every effect is set off by, reads and changes, and the thin spots seen.
- `batch-1.md`, `batch-1-answers.md`: the first requests as sent, and their answers with the agent's reads. The second is the best record of how they answer and push back.
- `batch-2.md`, `batch-2-answers.md`: the second requests as sent, and their answers with the agent's reads. The batch is closed.
- `batch-3.md`: the third requests as sent. Its answers are on the page, unread until the director says they're done.
- `requests-page.html`: the page's source.
