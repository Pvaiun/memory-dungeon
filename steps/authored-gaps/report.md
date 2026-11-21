# Authored gaps: what this folder holds

Three things: the web of effects, the page the director answers requests on, and one other way to sort the web. Nothing in the game has changed for either.

## The web

- **`web.md`** is the web: the list of threads, the clocks, and a catalog row for each of the 108 effects, written as what it wants and what it gives. `npx tsx tools/web-threads.ts` checks every word against the list and counts it.
- **The map** is at `https://claude.ai/artifact/9GtG7CvLQBAgZszRWyfz35`. It's drawn from the catalog, never by hand: `npx tsx tools/web-map.ts` fills `map-page.html` and writes `out/web-map.html`, which is published to that address (read the artifact first). A switch draws the same threads and effects three ways: between the nine builds, between the seven clocks, and by their own links with no frame.

## The request page

`https://claude.ai/artifact/EBRC2rs3Tw6JW2AWMgxZDf`. **The page is built: use it as it stands, and never make it again.** A session's whole flow goes through the page's store, with the ArtifactData tool on that address:

- **Seed a batch:** write its cards to `requests/<id>` (`b5-01` and on, `b5-open`) with the next batch number, in one batch write. Fields: batch, order (the open card is 99), kind, title, ask, why, near (a list of `{t, tag}`). The page shows them by itself, and redraws a card whose request changes.
- **Read the answers:** query `answers` for the batch, once the director says they're done. Fields: text, status, reply, more.
- **Write a read:** set `replies/<id>` to `{kind, text}`. Kind is placed, question, overused, withdrawn or again; question and overused show under Needs you.
- **Answer a reply:** append to `replies/<id>.turns` (a list of strings) and set `kind` to where the card now stands. Send the whole list back: an update replaces the field. Never rewrite `text`. The director's first reply is `answers/<id>.reply`; their reply to turn *n* is `answers/<id>.more[n-1]`. A reply is unanswered when `reply` is set and there are no turns, or `more` is as long as `turns`.
- **A request's kind** is road, link, capstone, supply, function, pair, formation or open. **A near line's tag** is great, seat (a seat the director starred), gform (a Great formation) or yours (an effect they wrote in an earlier batch). No Fines.

None of this needs the page's source read or anything republished. Where the director asks for a change to the page, edit `requests-page.html` in place and republish it to the same address; don't write a new page.

What each card came to is in `web.md`: Settled by the director, Cards asked, Not to ask again, and Seen, not yet asked.

## Another way to sort it: four lines

The agent's, and not a ruling. A fight has only so much of four things. Each has two ends, and a way to live or a way to kill sits at one end of one.

| A fight has only so much | One end | The other end |
| --- | --- | --- |
| Time (the party's) | End it: the opening, kill order, executes | Stretch it: what builds on the foes, mending, slowing them |
| The foes' attacks (each unit's) | Take them: Shield, Defense, Thorns, what answers a blow | Slip them: Evasion, Blur, Hidden, what answers a dodge |
| HP (each unit's) | Keep it: Shield, healing past full, damage from max HP | Spend it: prices in HP, power when low, Lifesteal |
| A unit's actions | Many small: what a swing carries, extra strikes | Few big: Might, wind-ups, crits |

- **Ends on different lines combine freely.** That's where a party no build describes comes from.
- **The two ends of one line suit different parties,** so the same piece is a good pick in one party and a poor one in another.
- **Time is the whole party's; the other three are each unit's.** Two units can sit at the two ends of a line, and then share the foes' attacks between them.

**How far it holds,** measured on engine 0.30 with three plain bodies (the average class line, a plain sword, no abilities, no passive, no gear) in the rogue's own fights:
- **Time holds.** Hits made half again as big cut the killing Chill did to a fifth and Bleed's to under half. A Shield of 25% of max HP saved 16 points of the party's HP in an 18-tick fight and 20 in a 48-tick one; Regen kept up saved 14 and 49.
- **The foes' attacks hold in one place.** Evasion 60 halved the killing Thorns did. A Shield and Evasion don't work against each other: they multiply.
- **The HP and actions lines are read from the rules' wording and weren't measured.** Their ends are flavours more than opposites.
- **Most ways to live leave most ways to kill alone:** of 40 pairs tried, 29 changed nothing.
