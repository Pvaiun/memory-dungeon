# Report

## Stage 0, the pilot: the answers are in

- **All ten triads answered,** every one with an odd one out, none with the other buttons. Each answer is in `triads.md` in the director's words.
- **Fourteen cards of the director's own,** D01–D14 in `cards.md`, quoted from *Add a fourth*. By what each does, ten sit in another way to win than their triad's, three in the same (D07, D09, D13), one unclear (D10).
- **The pilot's read-through is done.** The director made no specific requests about the cards; stage 1's writers get the brief as it stands.

## Stage 0, the pilot: as it was put up

**The page: https://claude.ai/artifact/W4iuZ1adkUKCVjydUNf3gN** (private to you)

- **Ten triads, one at a time,** under one question: **which two feel connected?** For each: tap the odd one out, or pick *No two belong*, *Splits two ways* or *None of these grabs me*. Then a few words: how the two feel connected, and, if it comes, what the third one is about. *Add a fourth* is there if a card of your own comes to mind.
- **Speak** on each text box takes dictation where the platform offers it: Chrome on a computer and the Claude desktop app's main window, not the Claude phone app.
- **After your first save, reload the page** and check the answer is still there before going on. The page says how many saved answers it loaded.
- **Nothing to decide before you answer.** The next session reads your answers with you.

What's behind the page:
- **40 cards** (`cards.md`), 10 for each way to win, from one agent that read only the five sources the brief names and was told nothing of what the cards are for. One card, P20, needs a new building block and is marked.
- **10 triads** (`triads.md`): three Burst, two Build up, three Debuff or disable, two Sustain. Each triad stays inside one way to win, its three cards on different mechanics and of different kinds (ability, version, piece, seat). Each card is used once, so 30 of the 40 are seen.

## Handoff to the next session

- **Read the answers** with `ArtifactData`, `action: "list"`, collection `answers`, on the page's URL. There's one document per triad, named by its id (`pilot-01` … `pilot-10`), with: `kind` (`pair`, `split`, `none-belong`, `none-grabs`), `answers` (one or two items: `odd` as a card id, `wants`, `instead`, `add`, `addWays`), `note` and `savedAt`. Copy each one into `triads.md` under its triad, in the director's words, and copy any added card into `cards.md`, marked as theirs.
- **The question was reworded before any answer,** from the brief's "which two want the same thing?" to the director's reading of it. The director: "want, it doesn't make sense for something that has no needs"; what they'll write is "how it feels like they're connected", "without talking about nitty-gritty gameplay mechanics that an AI could determine itself", then what the third one is about, then possibly a fourth like the two. The page now asks: *Which two feel connected?*, *How do the two feel connected?* (how it feels, not the mechanics they share), *What's the third one about?* and *Add a fourth*. The stored fields keep their names: `wants` holds the first answer, `instead` the second, `add` the fourth card.
- **The page names no way to win.** The director's ruling: "Nothing should frame the cards but the question." Later batches keep to it. The way still goes into each saved answer, out of sight, for the session's use.
- **The director sometimes adds more than one card in *Add a fourth*,** for different ways to win, and says in the text which is which. `addWays` is a list for that reason; an answer saved before the change may hold a single `addWay` instead.
- **So the director doesn't know a triad's way to win when adding a fourth card.** "Ideally from another way to win" is a guess on their part, made without seeing the original, and some added cards may land in the same way as their triad. That's expected, not a miss. Compare the added card's ways (`addWays`, or the session's own reading of the card) with the triad's (`way`, stored with every answer) before counting it as spanning two ways.
- **The page's source** is `triads-page.html`. The triads are in its `triads-data` block. Republishing the same file keeps the URL and the saved answers. A later batch can add triads under new ids without touching the pilot's.
- **Keeping card-writers blind.** A general-purpose helper agent is shown this repository's `CLAUDE.md`, which names the goal. A `Plan` agent isn't, so the pilot's writer was a `Plan` agent. It read copies of the five sources in the session's scratchpad and returned its cards as text. Stage 1's writers need the same treatment. Its brief is below, as sent but for a shortened file list.
- **Cards not yet in a triad:** P04, P11, P14, P15, P19, P23, P31, P32, P33, P38.

<details>
<summary>The card-writer's brief</summary>

> You're writing cards for a game: things a player could choose during a run. This is a writing task, not a coding or planning one. Make no changes to any file; give the cards in your final reply.
>
> **The game.** A party-based dungeon crawler with fully automatic combat, played on a phone-sized screen. Preparation is the game: between fights the player chooses which units fight, what each one wears, which seat of a formation each one sits in, and the order of each unit's abilities. Then they watch. Nobody gives orders in a fight. A run is three acts of floors (fights, elites, events, shops, chests, campfires) with a boss at the top of each act. The party is three units. HP, MP, knockouts and cooldowns carry from fight to fight; statuses don't. A unit wears four pieces of gear. A formation has three seats, each changing the numbers of the unit in it. Abilities and their versions are learned in training.
>
> **Read these, and only these** (in the scratchpad folder): ways-to-win.md (the four things a card can help a party do; read it first), vocabulary.md, combat.md, primitives.md (the limit of what a card can do today), gear-rules.md. Read nothing else: no other folder, no other file in the repository, nothing on the web. The sources mention other documents; they're left out on purpose, and the five hold everything you need.
>
> **What to write.** Thirty to forty cards. Each card is one thing a player could choose in a run: an ability, a version of an ability, the effect a piece of gear carries, or a formation seat. Use every kind; no kind should be more than about half the cards.
> - A quarter for each way to win, give or take two. A card can serve more than one way; give the one it serves most.
> - As many different mechanics as you can, spread across the statuses, special stats, effects, events, conditions and targeting rules the sources describe. Reach into the corners of the sources, not only the obvious pieces.
> - Each card is one specific idea a player could pick, said plainly.
> - Plain words, as a card in the game would read. One or two sentences, the first saying what it does. Words for size, length and timing (a little, a lot, briefly, a long cooldown, half), never numbers. No flavour, no theme, no name, no attitude or tone. Don't say what slot a piece goes in, or what kind of unit it's for.
>
> **Bounds every card keeps.** The player gives no orders in a fight; nothing asks for smart timing or targeting from anyone. No positional targeting, and no battlefield geometry; seats change numbers, not where anyone stands. A status does the same thing whoever applies it: a card can read a status, add it, or react to it, but can't change what the status itself does, and can't spend, shorten or set off a status early. Elements are themes, never mechanics. MP is fuel; no card is about lasting more fights, or about getting more out of the rest between them. Within those, a card the engine can't do yet is fine if one small new building block would let it: keep it, and say what block it needs.
>
> **What to give back.** The cards, grouped by way to win, numbered P01 onward, each with its text, kind, way to win, mechanics (two or three pieces of the sources, in their words) and needs ("none", or the new block). Then one line of counts by way and kind. No commentary.

</details>
