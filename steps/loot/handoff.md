# The loot pass: handoff, partway through the fill

Nov 11, 2026. The fill (step 2 of `brief.md`) was stopped here because it kept running through the usage budget. Nothing is running, and nothing is scheduled. A fresh session starts from this page.

## What's done

- **All eight shares are written,** in `fill/`: `weapons-1.md`, `weapons-2.md`, `armor.md`, `offhands-1.md`, `offhands-2.md`, `amulets.md`, `formations.md`, `versions-mythics.md`. That's 417 entries: every item of the spine and the 72 commons, each with its card, stat steps, numbers, code support and tags, and each file ending with its designer's challenges, links, loops and doubts.
- **`npx tsx steps/loot/fill-check.ts` is clean:** every item once, at its kind and rarity, every piece on exactly its budget, no name twice. Its one listing is Frostbite bow and Sleet blade, a bow and a rune sword that read the same and that no unit can hold together, which the director's ruling allows.
- **Round 1 is ruled and applied.** The lead read every card together and ruled on every challenge: `fill/round-1.md`, share by share, and `fill/shared.md` for what reaches every share (the six counters, how steps count, about forty rulings on words). Every agent applied its rulings to its own file.
- **Round 2 is applied,** by hand: `fill/round-2.md`, the rulings on what the agents raised while applying round 1. Its *For every share* list is at the end of `fill/shared.md`, and each file's *Challenges* marks what it ruled. Two sizes were set in the applying, and both are flagged: Frost fist's few is its base ability's (the whole word is a shatter with every cast), and Bellows wraps at a twentieth is hardly seen on a plain fist.
- **The spine is up to date with both rounds:** about thirty-five lines, a few phrases under *New words*, code support 23, and fifteen names changed. Its tables and `index.md` are regenerated.

## What's left

1. **The fresh read.** Not done: both readers stopped on the limit before writing anything. Their two briefs are in `fill/fresh-read-brief.md`: one reads every item, one reads each engine's parts together and picks the director's sample. Rule on what they find, change the spine where a ruling changes a line (`npx tsx steps/loot/web-check.ts --write --index`), and apply it.
2. **Gate 2.** The report (`report.md`): the decisions needed first, then what was written and what changed from the spine, then the sample in full sentences. Update `CLAUDE.md`'s Status, commit, push and stop for the director.

## For the director at gate 2

Collected so far; each is ruled in `round-1.md` or `round-2.md` and stands unless the director says otherwise.

- **A new rule of Hidden's own: someone stays in the light.** Gear and seats can now hide a whole party, and the game had no answer for foes with nobody to pick. As written, Hidden doesn't land on the last ally the foes could pick, which also means Swan's grace doesn't hide the last one standing.
- **Crit chance and Quick draw.** At a certain crit the Ranger's Quick draw never stops. Two cards that raise crit by a lot now say "to four in five at most" (Bloodscent knife, The king's head). Whether plain Crit chance needs a ceiling of its own is open.
- **A chain of shatters is damped in fractions of a stack.** A floor of one whole stack didn't end the chain in a pack of seven beside Glacier's heart.
- **Lines that changed what they do:** Reaver's axe (it read as half of Night's edge; now many Might on a kill); Writ of judgement (answers Condemn alone; a free marker ran it through a pack at no cost); Hoplon (no longer counts Guard, whose share the game never prints); Tireless bell (widened to recoveries; no wearer winds up long enough otherwise); Hoarfrost line's Breaker (gains an aim at a Stunned foe); Rubato (never readies itself); Accompanist's score (answers a paid cast, or two of them cast free without end); Bellows wraps (a twentieth, not a tenth, or the fire feeds itself); Rimed blade (reads max HP); Squall lance, Volley bow, Bellringer and Bell of the hour (counts that come round in a fight).
- **A kept mythic that grew:** Huntmaster's quiver, from cooldowns halved to abilities ready again.
- **Sums to see:** Flagellant's vestments and The covenant charge "the same share" of HP, a quarter to two fifths of a caster's bar for a wide spell. Aegis mail is set off by a price, so a payer that drinks back over a third gets an Aegis every cast or two.
- **Where the documents and the game differ:** *Core set: rules and vocabulary* says a stat matching a weapon's scaling stat counts twice toward its budget, and the content's check counts it once (the fill follows the check). `classes.md` gives the Pyromancer's ritualist a staff and a lantern, which can't be held together.
- **Pieces that do little for one wearer, left as they are:** Gravemark with no marker in the party; Marginalia and Curse-book on a Bard; Saint's mace and Anchorite's mace on a Bramble knight; Shuttered lantern on a Cleric.
- **Alike, left as they are:** Quickstep leathers and Windrunner's garb; Banked robe and Archmage's mantle; Urchin plate and Spiked targe; Ringing bell and Squall lance on a Monk; Reveille and Reprise; the three plain riders on the fist weapons.
- **Fifteen names changed,** listed at the end of `fill/shared.md`.

## Why it cost so much, and how to finish for less

- **Each fill agent used about half a million tokens,** and there were eight, each resumed once for its rulings: about four and a half million in all. Most of it is reading: every agent read the same rules, builds and spine before writing.
- **The lead's own session grew very large** (it read every document, then every challenge and every card), and each of its turns sent all of that again.
- **To finish:**
  - Start a fresh session. Read this page, `fill/round-2.md` and `fill/shared.md`; search the spine and the fill files for a name rather than reading them whole.
  - Run the two fresh readers one at a time, not together, and check the budget between them. If that's still too much, split the item read by share, or ask the director whether a smaller model may do it.
  - Don't bring the eight fill agents back for small rulings. They can't be resumed from a new session anyway.
  - Write the report from this page, the rulings files and the engine reader's sample.
