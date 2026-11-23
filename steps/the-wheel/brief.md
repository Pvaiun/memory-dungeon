# The wheel: the brief

A design step, with the director: the five colours that sort the web. Nothing is built in it and nothing in the game changes. The frame is `docs/colours.md`; its rulings bind this step. The director's intent is `intent.md`. This is version A of the way of working; version B is kept on the branch `the-wheel-version-b`, for if this one fails.

## What it's for

Five colours, each on one card (what it never does, the mechanics it prefers, its profile and style, what it can't answer), that pass the checks in `docs/colours.md`, What checks a wheel. The director picks or merges one wheel. The pie, the classes and the loot come after, in later steps.

## The idea

The colours are found in the gameplay, not authored from a theme. The game's rules allow a bounded set of ways to do each of the four ways to win, small enough for agents to list completely. The agents list it all, so coverage never rests on anyone's memory; the director marks it and rambles on it, which is where what's alive comes from; then the colours are drawn out of the marks as attitudes. The split is the one the project has learned (`intent.md`): the agent holds the structure and the coverage, the director brings the spark.

**A colour is held together by attitude, not synergy.** A set of plays held together because they work together is a build, and the builds don't carry over. A colour is plays from several ways to win that share one temperament, whether or not they combo.

## How to work

Four stages, each ending with the director. A session runs one stage and stops.

### 1. The inventory: every play

A **play** is one distinct way to do one of the four ways to win: what happens in a fight, why it wins, and the mechanics it rests on, in the rules' words. It's read from the mechanics and where they meet, not from what the fight's text happens to show.

- **Five agents, run together,** each working alone: one for each way to win, going as deep as the way allows, and one for the plays that only exist where two mechanics meet, across the ways. One agent asked for variety tends to give variations of its first idea; five starting points cover more.
- **Each agent reads only the sources below,** and none of the primer, the classes, the builds, the gear design or the loot. That's a deliberate exception to reading the primer: it carries the class table and the builds, which this stage must not draw from.
  - `docs/colours.md`: the four ways to win and the style questions (how big and how often, how wide, when, at what price), which are the generator: within a way, a change in any of them that would make a fight play or feel different is a different play.
  - `docs/core-set/vocabulary.md`, whole.
  - `docs/core-set/combat.md`, whole.
  - `PRIMITIVES.md`, whole: everything the engine can express.
  - `docs/core-set/gear.md`, Weapons and Formations, as rules (not who wears what).
- **Bounds every play keeps:** the player gives no orders in a fight; no positional targeting; a status does the same thing whoever applies it; elements are themes, never mechanics; MP is fuel, and no play is about lasting more fights. A play the rules don't allow yet, but a small new building block would, is kept and marked as needing one. A play that needs a new system isn't.
- **Distinct, not padded.** Two plays are different if they would play or feel different in a fight. Don't merge them, and don't list the same play twice in other words. Expect a few hundred across the five agents; the count is whatever the space holds.
- **Each play is one or two plain sentences,** with its way (or ways) to win and the mechanics it rests on. No flavour, no theme, no names, no attitude: those are the director's and stage 3's.
- **The session merges the five lists,** takes out the doubles, and checks for gaps against the threads in `steps/authored-gaps/web.md`, The threads: a thread no play touches is either a gap to fill or a word with nothing in it, said which.

**The agents' prompts give intent and ranges, never examples.** An agent copies what it's shown, and an example play in a prompt becomes a hundred plays like it.

### 2. The director marks and rambles

- **A page** with every play, grouped by way to win and, within a way, by the style question it turns on, so it can be taken a section at a time over several sittings. Marks and notes are saved where the agent can read them back (the artifact's database).
- **Each play is marked** alive, flat or never (would hate to see it in the game), with an optional note. A never is as useful as an alive: it's where exclusions start.
- **Room to ramble:** a free box at the top and one for each way to win. Anything the director adds there that no play covers becomes a play.
- **Stop** until the director says they're done.

### 3. The wheels: three agents, apart

- **Three agents, each working alone,** each given `docs/colours.md`, the marked plays with their notes, and the director's rambling; none sees another's work. Each proposes a wheel of five unnamed colours (by letter), and for each colour:
  - its attitude, in a sentence or two;
  - the alive plays it holds, from several ways to win, and why they share the attitude;
  - what it never does, traced to its opposites, with the nevers it takes in;
  - its profile and its style in each way it leans to;
  - what it can't answer, named as the challenges in `docs/core-set/enemies.md`, Challenges;
  - the checks run, and the plays left with no colour (the exotics) or in two colours, done two ways.
- **Why three:** independent wheels disagree in useful ways. A colour that comes out of all three is robust; one that only one agent found is a question for the director.
- **The session compares them** and brings the director the three wheels side by side, the colours they share and where they part. No colour is described with a theme, an element or a name yet.

### 4. The pick, then the question and the names

- **The director picks or merges a wheel,** and the session writes each colour's card.
- **The question the five answer** is named from the wheel, now that it can be seen.
- **Names last,** with the director. A name chosen early pulls a colour toward everything else that shares it.
- **The step closes:** the wheel goes into `docs/colours.md`, and the pie opens.

## What fails a colour

- It's held together by synergy, not attitude: a build in disguise.
- It holds plays from one way to win only.
- It could sit unchanged in another fantasy game, or matches one of Magic's colours one to one.
- It's an element, or a role.
- Its profile mirrors another colour's, or the wheel gives every colour the same shape.

## What to read

The list is closed. The agents' own reading is in each stage above.

- **Every session:** `docs/primer.md`; this brief; `intent.md`; `docs/colours.md`.
- **Stage 1, to merge and check:** the threads in `steps/authored-gaps/web.md`, The threads.
- **Stage 3, to compare wheels:** `docs/core-set/enemies.md`, Challenges.
- **Only when a claim rests on how a fight runs, and only that section:** `docs/core-set/combat.md`, `docs/core-set/vocabulary.md`.
- **Leave alone:** the classes (`docs/core-set/classes.md`, and the primer's class table as a source); the builds, engines and loot (`docs/gear-design/`); the rest of `steps/authored-gaps/`; `content/`; the code.

## Rules for the work

- **No examples** in anything written for an agent, and none of the director's illustrations written down as design.
- **Plain words.** A play or a card says what it means in its first sentence.
- **Don't predict how the director will answer.** Their marks and rulings are what's needed from them.
- **Symmetry is a pull to resist** (`docs/colours.md`, A colour).
