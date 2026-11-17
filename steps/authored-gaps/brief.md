# Authored gaps: the brief

Read this first. It says what this step is trying to do and why, how the work is split between the director and the agent, what was tried and dropped on the way here, and what one batch has taught. `intent.md` is the director's intent in their words; `report.md` is their rulings and the handoff; this page is the reasoning behind both, written by the agent that ran the first session. Where the director's word differs, theirs wins.

## What the game needs

- **The value is the building of the builds.** The fun is each pick: a player facing a choice and working out what to do with it, toward something powerful. Played hundreds of times, the game should keep surprising its player with what gets made. Distinct, strong builds at the end aren't the point; the nine builds exist as context for making content that works together, and they do that job.
- **It has failed two ways.** First, pattern matching: a player took everything that said one word, and it always worked, so no pick was a thought. Then, asked for exotic effects to break that, the loot came out random and esoteric: strange alone, with nothing to do with it.
- **The director's diagnosis.** The agent makes sets with many connections and can't author interesting things to explore inside them. The director is the reverse: unique things come easily, and coherence across a set doesn't. After generating everything about two and a half times by direction and approval, they judged that way of working at its ceiling.
- **This step is the layer between** directing in broad concepts and editing data by hand. The agent holds the structure; the director writes into it.

## The split

- **The agent's:** the web (what connects to what, where it's thin), finding the gaps, turning each answer into a piece, checking it against the rules, sizing it, running it, and the plain parts nobody needs to author.
- **The director's:** every creative decision. What a gap is filled with, and any call on a build's structure or goal.
- **The director is never asked for** data entry, volume, or ideas from nothing. They said plainly that they can't write good questions or pieces with no context. Every request gives them a frame: one job, and what already sits near it.
- **The agent doesn't model the director's taste.** Workflows that rest on the agent learning what they like from their reactions were set aside by them: they've tried versions of that, and it depends on the agent parsing taste. So don't generate candidates for approval. Ask, and let them write.

## Tried in conversation and dropped

So they aren't proposed again. Each was the agent's idea.

- **Reacting to content** (notes left in play, short staged moments to judge). The director liked two of these as ideas, and said they were a different category from what they wanted, which was authoring.
- **Authoring whole finished parties** and working backward. Dropped: the builds are already good, and a clearer destination makes the picking less interesting.
- **A census of the game's quantities, with the director writing "inversions" onto it.** Their answer: that's more pattern matching, and they can't write questions cold.
- **An abstract frame** (the player's state, the decision, the kind of pull). It lost them: "I don't understand what you're proposing anymore."
- **A size on every request.** Added only because they asked, and removed when they asked whether it really helped. A constraint goes in the ask itself, and only where the request needs one.

What stuck was the director's own formulation: a skeleton, gaps where the agent is unsure, and each gap brought to them as an objective.

## What a good request is

Six of the first fifteen came back marked as the wrong question, and the director was right about all six. The causes, and the rule they left:

- **Asking for coverage.** "This road has no Great on X" isn't a gap if something they kept already does the job. Check what's kept before asking. The loot's philosophy already says not to ask for coverage of every mechanic.
- **Asking for what they cut.** What's in today's loot (`npx tsx tools/loot-list.ts`) and in neither triage pile was cut. An ask whose plain answer is a cut effect is a wrong question too: two formations whose seats aimed the party were cut, so batch 2 didn't ask for one.
- **Abstractions.** An ask in figures of speech can't be answered. Name the job in the game's own terms, and say what kind of thing is wanted back: an applier, a payoff, a seat, a link between two named things.
- **Levers the player doesn't have.** Preparation is the whole game: who fights, what they wear, where they sit, the order of their abilities. The party's aim is steered only by a Mark and by an ability's own target phrase. A request that assumes another lever is wrong before it's asked.
- **What worked:** links between two named things, a formation with a stated job, a function with a plain constraint. The director's own example requests in `intent.md` are the model for the form.
- **"Near it"** on a card is the Greats, starred seats and their own placed answers that sit closest to the gap. It's context, never a constraint. No Fines: listed there, they read as things to fit around, and most won't be in the game. A card with little near it is showing a real hole.
- **No numbers and no sizes from the director.** They write whatever they find most interesting. The agent sizes afterwards, and says plainly when an answer is too small or too big for where it has to sit.
- **They won't colour-code.** An answer to a road's request may never name that road's status and may serve many roads. That's what the game needs. Place it by what it does, not by the card that asked.
- **"Wrong question" is the most useful button on the page.** Treat it as correct until shown otherwise, withdraw or re-ask in plain words, and say which.

## Reading the answers

- **Read each one against the rules** (`docs/rules.md`, `docs/core-set/rules-and-vocabulary.md`, `docs/gear-design/loot.md`). Say what it conflicts with, what was assumed where the words are open, and what it does once it's placed beside the rest.
- **Push back.** The director asks for it and uses it: one pushback in the first batch made them replace a piece with a better one that broke no rule. They also overrule, and then that's the ruling.
- **Check a claim before pushing back with it.** One pushback in the first batch was wrong: the agent trusted a test's name over the rule's own text, and the director knew the game better than the note did. Where a pushback rests on how the engine behaves, read the rule or the code first.
- **Say what placing them found.** Interactions nobody wrote down are the point of the web, and the director wants to hear them.
- **Watch for a new keyword forming.** A phrase many pieces share and a few pieces multiply is how the first failure came about. Say so when one starts, as the agent did for start-of-fight effects, and the director cut a multiplier.
- **Be honest about your own additions.** Asked whether the sizes really helped or were only a response to their question, the true answer was the second, and saying so got a better page.

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

1. More batches, until the web is thick enough to play: the gaps in `web.md`, then what placing the answers shows.
2. The plain parts, written by the agent and shown by sample.
3. Sizing and slotting what's placed: kinds, rarities, who wears it, numbers.
4. Formations beyond those kept or written, then mythics, on the director's word.
5. Build and measure. Until then the game stays on today's loot, and nothing in it changes.

Not decided: how many pieces the set should hold (the agent's view is fewer and better than today's count), and whether upgrades and mythics join.

## The files

- `intent.md`: the director's intent, recorded short.
- `report.md`: their rulings, how the page and its store work, and the next steps.
- `triage.md`, `triage-formations.md`: what they kept, in their two piles.
- `web.md`: where the kept effects sit, what the first batch added, and the gaps seen.
- `batch-1.md`, `batch-1-answers.md`: the first requests as sent, and their answers with the agent's reads. The second is the best record of how they answer and push back.
- `batch-2.md`: the second requests as sent. Their answers aren't in yet.
- `requests-page.html`: the page's source.
