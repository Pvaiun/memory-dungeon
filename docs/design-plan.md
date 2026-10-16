# Memory Dungeon Game: Design Plan

The ordered design work needed to take the concept spec to a buildable game. Each step is design work an AI carries out with the director, following `method.md`, then records before any step that depends on it.

**Inputs:**
- *Memory Dungeon Game: Concept Spec*: what the game is and why.
- `memory-app-overview.md`: a summary of how Memory works today.
- `memory-stack.md`: how Memory is built, and what that means for the game.
- `memory-design-spec.md`: Memory's official design spec, with full detail and rationale.

The overview is enough for phases 1 to 3. Wherever a step touches Memory's own systems (the event log, counters, catalog, profile, the Brain), work from the official spec.

## How every step works

Every step follows `method.md`. The director gives intent; the AI designs from it and workshops the design with the director, then builds it and tunes it by simulation. The AI works as a designer: it challenges direction that doesn't fit the game, with evidence, rather than following it into a wall.

The game plays itself through menus and numbers, so thousands of versions of it can be built and tested. That's what lets simulation stand in for most playtest rounds. Simulation measures balance, not fun, so feel checks run alongside it.

Each step lists what it designs; what to **ask the director**, which seeds the intent brief and is not a script; how it's tested, under **Simulates** or **Tested by**; what it produces; and when it's done.

**Order:** Phase 1 builds the simulation foundation, so every later step can be tested while it's designed. Phases 2 and 3 design the game and run in order. Phase 4, the quest board, can run alongside them. Phase 5 needs both.

---

## Phase 1: Simulation foundation

### 1. Content schema
- **Designs:** one data format for classes, specializations, abilities, gear, formations, enemies, perks, dungeons, dungeon challenges and traits. It starts rough and grows with each later step.
- **Produces:** schema definitions, plus a worked example of each.
- **Done when:** any rule a later step designs can be expressed as data, with no rules hiding in prose.

### 2. Headless engine
- **Designs:** the machinery under combat and runs: game logic with no UI, seeded randomness, runs as savable data, decision points, exact replay and logging. It's tested with a throwaway stand-in fight; step 4 builds the real combat into it.
- **Ask the director:** nothing beyond confirming that the engineering is the designer's call, and any thoughts they have. Fight logs are for the AI to measure combat with, and for debugging; the director doesn't read them.
- **Tested by:** exact replay from a seed, and the worked example running end to end.
- **Produces:** an engine spec and a working prototype.
- **Done when:** content data plus a seed goes in, and a complete fight log comes out.

### 3. Simulation harness
- **Designs:** testing at three levels, all reporting data plus a written impression.
  - **Combat level:** many builds against many encounters, measuring win rates, fight length, swinginess, which units and abilities matter, and how outcomes vary between builds.
  - **Progression level:** simulated players playing through the content week by week. Quest rates are modelled on Memory's event log (see `memory-design-spec.md`), with several levels of decision quality. It measures rewards per week, time stuck at walls, when party choices become meaningful, and how often perks change outcomes.
  - **Feel checks:** an AI reads fight logs with enemy stats hidden, and reports what it can tell about the enemies and what read as flat. Every later step uses these, and they're the main test for steps 12 and 22.
- **Ask the director:** what they want reports to show them, and which kinds of player to simulate (casual, optimizer, someone who only does quests…).
- **Tested by:** the director reads a sample report at each level and says whether it tells them what they need.
- **Produces:** a harness spec and report format.
- **Done when:** a test run at each level produces a readable report.

## Phase 2: Core mechanics

Steps 4 to 6 choose what combat is made of and check that it works; there's too little content to measure balance until units exist. After that, steps weigh competing variants: simulation chooses between them on numbers, and the director on feel.

### 4. Combat concepts
- **Designs:** which combat concepts the game has at all, such as how turns work, dodging, crits, damage types, weaknesses or damage over time. Each is weighed by the depth it adds against what it asks of the player, given how simple the game means to be. The chosen concepts get basic rules and go into the engine, replacing step 2's stand-in. The schema's rule language is only a starting point: keep it, change it, drop parts of it, or start over altogether.
- **Ask the director:** a high-level discussion built around reference games: games whose fights they like, and why; which concepts they want and which they don't (weaknesses, super-effective hits, dodging, crits, damage types, damage over time…); how much luck they want; how much depth suits the game; what a loss should look like; and how much of the schema's rule language, if any, to keep.
- **Tested by:** functionality tests showing each chosen concept works in the engine. There's too little content here for fight length or swinginess to mean anything; those wait for units (step 8) and balance (step 14).
- **Produces:** a combat concepts document, implemented in the engine.
- **Done when:** every chosen concept works in the engine, shown by tests.

### 5. Role verbs
- **Designs:** the hidden vocabulary of about 15 to 20 verbs (physical damage, damage over time, burst, evasion, blocking, healing and so on), each defined in terms of the combat concepts from step 4. This is a first pass: picking every verb up front is guesswork, so expect to revisit steps 5 and 6 once units (step 8) and encounters (step 12) show what's missing or unused.
- **Ask the director:** role fantasies they want the game to have (a summoner? a gambler?), and any they don't.
- **Tested by:** the director's review: every role fantasy they want maps to verbs, and no two verbs mean the same thing. Simulation waits for the mechanics (step 6) and units (step 8).
- **Produces:** a verb list with definitions.
- **Done when:** every wanted role fantasy maps to at least one verb, and the director approves the list.

### 6. Mechanics
- **Designs:** the mechanics that express the approved verbs, and nothing more: statuses, triggers, reactions, passives, and how they time against each other. They're built on step 4's concepts and go into the engine. Every mechanic traces to a verb, and every verb to a role the director asked for.
- **Ask the director:** mechanics from other games they like or dislike for the roles they chose, and anything that would ask too much of the player.
- **Tested by:** functionality tests showing each mechanic works, and that no chain of reactions runs away. Whether each verb matters, and whether any is redundant or dominant, is measured once units exist (step 8).
- **Produces:** a mechanics document, implemented in the engine.
- **Done when:** every verb from step 5 can be expressed as data and works in the engine.

### 7. Trait vocabulary
- **Designs:** the fixed, player-facing trait words (agile, strong in numbers, hard to pin down…) and the verb profile each one stands for.
- **Ask the director:** the tone of trait words, monster descriptions they've liked in other games, and words they'd want in the vocabulary.
- **Tested by:** feel checks, where an AI watching fights matches behaviour to trait words, plus a check that no two traits overlap.
- **Produces:** a trait glossary. Flavour text can vary around a trait word; the word's meaning never does.
- **Done when:** each trait maps to one verb profile, and no two traits overlap.

### 8. Units and specializations
- **Designs:** base and derived stats; what class, specialization, abilities and gear each contribute; the ability format (triggers and behaviours, not stat boosts); 4 abilities per specialization with 2 equipped; how base specializations work.
- **Ask the director:** classes and specializations they'd love to see, favourite JRPG jobs and what made them fun, and what a good ability feels like.
- **Simulates:** class power and class variance. No specialization should dominate or be useless, and each should play measurably differently. Also whether each verb from step 5 measurably changes outcomes, and whether any is redundant or dominant.
- **Produces:** a unit model and a template for defining a specialization.
- **Done when:** a test set of specializations lands inside the power band this step defines, with distinct behaviour in simulation.

### 9. Formations
- **Designs:** the 5 positions, how positional multipliers work, which roles each multiplier affects, how a formation is defined, and how a dungeon's party-size cap interacts with it.
- **Ask the director:** favourite formations from SaGa or elsewhere, and how big a difference a formation should make.
- **Simulates:** how much formation choice changes outcomes for the same units.
- **Produces:** a formation model and template.
- **Done when:** the same units in two formations produce measurably different results against the same enemy.

### 10. Gear
- **Designs:** class-specific and generic slots, efficacy scaling across progression, powerful pieces and cross-class capstones, and number ranges with headroom for later tiers.
- **Ask the director:** how loot should feel (fixed items as in Dragon Quest, or rolled drops), and what would make a capstone exciting.
- **Simulates:** power growth across progression, and whether capstones stay special without trivializing content.
- **Produces:** a gear model and item template.
- **Done when:** a gear curve runs from the first dungeon to the end of version 1, with room above it.

### 11. Dungeon runs
- **Designs:** dungeon structure (fights leading to a boss), what wears down across a run, the perk system (themed pools of 10 to 15 perks, 3 options per pick, regular and premium rarity, perks that modify equipped abilities), and what happens on a loss.
- **Ask the director:** how a run should feel from first fight to boss; games whose between-fight picks they like (Slay the Spire, Hades…); what a premium perk moment should be.
- **Simulates:** attrition across a run, and how often perk picks change the result.
- **Produces:** a run model.
- **Done when:** runs land inside the length and attrition ranges this step defines, and perk picks matter without deciding every run.

### 12. Encounters
- **Designs:** the enemy template, how keys match keyholes and the threshold for a win, mixed keys per enemy, tuning to 75% of best-in-class, how efficacy offsets missing keys, and enemy trait descriptions.
- **Ask the director:** monster gimmicks, phrases and bosses they'd love to see, as a raw list (likely through an input page), and bosses from other games that made good puzzles.
- **Simulates:** whether the difficulty predicted from an encounter's verbs matches its simulated results. Feel checks test whether an AI watching the fights can tell each enemy's traits.
- **Produces:** an encounter model and enemy template.
- **Done when:** predicted and simulated difficulty agree across a test set of encounters.

## Phase 3: Content and balance

### 13. Starter slice
- **Designs:** the starter class, a few more classes, and the first dungeons and their challenges, just enough to exercise every system.
- **Ask the director:** the starter class's fantasy, themes for the first dungeons, and names or phrases to use.
- **Tested by:** progression simulation from a solo starter unit to the first wall, plus feel checks.
- **Produces:** the first content set, as data.
- **Done when:** a simulated player can go from a solo starter unit to the first real wall.

### 14. Balance
- **Designs:** tuning so that 75% of best-in-class clears content, keys and keyholes behave as intended, off-builds work without trivializing anything, and fights land in the length and swinginess ranges set here.
- **Ask the director:** how hard a wall should feel, how generous off-builds should be, and how long and how swingy a fight should feel.
- **Tested by:** simulation across archetypes, checked on builds held out of tuning.
- **Produces:** tuned numbers and a balance report.
- **Done when:** simulations land every archetype inside the win-rate bands this step defines, fights inside its length and swinginess ranges, with no dominant approach.

### 15. Progression pacing
- **Designs:** whether 3 to 5 quest rewards a week is enough, and which fix works if not (the candidate fixes listed under Open questions in the concept spec, or something else); the mix of specializations, formations and powerful gear that quests pay; where walls fall; how fast party choices become meaningful.
- **Ask the director:** how often a new toy should arrive, how long being stuck feels fine, and how many quests a week they expect to do themselves.
- **Tested by:** progression simulation, with quest rates modelled on Memory's event log.
- **Produces:** a pacing model and recommendation, with the simulation data behind it.
- **Done when:** simulated players at realistic quest rates progress without long dead stretches or trivial runs.

### 16. Version 1 content
- **Designs:** at least three months of content: classes and specializations, dungeons, challenge sequences, perk pools and enemies. Names and writing fit the setting: generic medieval fantasy with touches of Greek, Norse and Japanese mythology.
- **Ask the director:** names, phrases, gimmicks, jokes and mythology picks, through an input page, plus references for the humour and tone of the writing.
- **Tested by:** full simulation at the pacing from step 15. The director reviews the generation rules and samples, not the whole set.
- **Produces:** the full content set, as data.
- **Done when:** the full set passes simulation with the pacing from step 15.

### 17. AI playtests
- **Designs:** how an AI plays through the text interface, and what it reports.
- **Ask the director:** what a playtester should report on, and which kinds of player to role-play.
- **Tested by:** this is the test. Feel checks have run inside every step since step 3; this is the full playthrough.
- **Produces:** playtest reports on what felt rewarding, confusing or flat.
- **Done when:** every issue raised is fixed or explicitly accepted.

## Phase 4: Quest board (can run in parallel)

These steps connect the game to Memory itself, so they work from `memory-design-spec.md` rather than the overview, and from `memory-stack.md` for how the game plugs in. Before any code goes into Memory, work through the integration checklist in `memory-stack.md`.

### 18. Quest completion rules
- **Designs:** what completes each quest kind. Quest kinds are the board's own, not Memory's item types, and the board reads each item's current state, not Memory's event log (see "What the quest board reads" in `memory-stack.md`).
  - **Notice:** a new item from a capture, not a recapture.
  - **Notice and do:** that new item, completed the same week.
  - **Want:** a new item created, of any type.
  - **Review:** a keep, dismiss, snooze, skip or "got it" decision on the offered item.
  - **Tackle:** the offered item completed.
  - **Keep:** every occurrence of the habit that week completed.
- **Ask the director:** edge cases they have a feeling about, such as a capture the app later decides was already captured.
- **Tested by:** replaying sample event logs and checking that each quest completes when, and only when, it should.
- **Produces:** an event-to-quest mapping.
- **Done when:** every quest kind has an unambiguous completion test against the event log.

### 19. Board generation
- **Designs:** the weekly schedule; what the AI reads (catalog, counters, profile, and the player's game state, including teased specializations); the prompt; board size and mix; the standing focus; value tiers by AI judgement; optional suggestions for Notice quests; how rewards are attached to quests; and a rule-based fallback if the AI fails, like the Brain's. `memory-design-spec.md` describes the Brain's schedule and fallback to model these on.
- **Ask the director:** what a good board looks like to them, quests they'd love or hate to get, and the tone of quest text.
- **Tested by:** sample boards generated from real catalog data, reviewed by the director.
- **Produces:** a board generation spec and prompt.
- **Done when:** sample boards generated from real catalog data look right to the director.

### 20. Reward delivery and state
- **Designs:** paying rewards the moment a quest completes; banking rewards while the user is away; unfinished quests vanishing; missed rewards returning on later boards; where game state lives; game events in Memory's permanent log, following the conventions in `memory-design-spec.md`; and what happens to a reward when the completion behind it is undone.
- **Ask the director:** how undo and time away should feel.
- **Tested by:** walking every path from a completed task to a reward, including undo, as scenarios.
- **Produces:** a state and reward-flow spec.
- **Done when:** every path from a completed task to a reward in the game, including undo, is defined.

## Phase 5: Interface

### 21. Screens and flows
- **Designs:** the game tab as a whole game: quest board, party and formation, gear, dungeon list, run screen, perk picks, challenge teasers and reward reveals.
- **Ask the director:** reference screens (Game Boy-era JRPGs and others), and when and how they'd pick the game up on their phone.
- **Tested by:** mockups the director looks at, and an AI walking through every flow.
- **Produces:** a screen list with the flows between screens, and rough wireframes.
- **Done when:** every action in phases 1 to 4 has a place on a screen.

### 22. Combat presentation
- **Designs:** how fights read on a phone: pacing and speed, damage numbers, big words like MISS and BLOCKED, and what each turn shows. With stats hidden and no recap, this is the player's main source of information.
- **Ask the director:** how long they'd watch a fight, and references for pace and feel.
- **Tested by:** feel checks on rendered fights: can an AI, and the director, tell an enemy's traits by watching?
- **Produces:** combat presentation rules.
- **Done when:** a player can infer an enemy's traits just by watching a fight.

### 23. Onboarding
- **Designs:** the first session and first week: the solo starter unit, the first quests, and how mechanics are introduced.
- **Ask the director:** how they like being taught a game, and tutorials they've hated.
- **Tested by:** an AI playtest of the first week, and the director's read of the flow.
- **Produces:** an onboarding flow.
- **Done when:** a new player understands the loop from quest to reward to dungeon within their first week.

## Final check

### 24. Principles review
- **Checks:** everything above against the concept spec's principles: nothing on the Now map, no notifications, no punishment for losing or absence, the user always chooses, and rewards are paid per quest, not per task.
- **Done when:** every violation is fixed or explicitly accepted by the director.
