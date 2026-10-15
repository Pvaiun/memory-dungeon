# Memory Dungeon Game: Design Plan

The ordered design work needed to take the concept spec to a buildable game. Each step is design work for an AI to carry out and review with the director, then record before any step that depends on it.

**Inputs:**
- *Memory Dungeon Game: Concept Spec*: what the game is and why.
- `APP_OVERVIEW.md`: a summary of how Memory works today.
- `memory-design-spec.md`: Memory's official design spec, with full detail and rationale.

The overview is enough for phases 1 to 3. Wherever a step touches Memory's own systems (the event log, counters, catalog, profile, the Brain), work from the official spec.

## How every step works

The game plays itself through menus and numbers, so thousands of versions of it can be built and tested. Every design step uses that:

1. Propose several variants, not one answer.
2. Simulate them at scale.
3. Report the data, the AI's reading of it, and a recommendation.
4. The director reviews and chooses.

The AI does the design work; the director judges the results.

**Order:** Phase 1 builds the simulation foundation, so every later step can be tested while it's designed. Phases 2 and 3 design the game and run in order. Phase 4, the quest board, can run alongside them. Phase 5 needs both. Each step lists what it designs, what it simulates where relevant, what it produces, and when it's done.

---

## Phase 1: Simulation foundation

### 1. Content schema
- **Designs:** one data format for classes, specializations, abilities, gear, formations, enemies, perks, dungeons, dungeon challenges and traits. It starts rough and grows with each later step.
- **Produces:** schema definitions, plus a worked example of each.
- **Done when:** any rule a later step designs can be expressed as data, with no rules hiding in prose.

### 2. Headless engine
- **Designs:** the combat and run engine: game logic with no UI, seeded randomness, and exact replay of any run. It starts from a rough first-draft combat model, which phase 2 replaces piece by piece.
- **Produces:** an engine spec and a working prototype.
- **Done when:** content data plus a seed goes in, and a complete fight log comes out.

### 3. Simulation harness
- **Designs:** testing at two levels, both reporting data plus a written impression.
  - **Combat level:** many builds against many encounters, measuring win rates, fight length, swinginess, which units and abilities matter, and how outcomes vary between builds.
  - **Progression level:** simulated players playing through the content week by week. Quest rates are modelled on Memory's event log (see `memory-design-spec.md`), with several levels of decision quality. It measures rewards per week, time stuck at walls, when party choices become meaningful, and how often perks change outcomes.
- **Produces:** a harness spec and report format.
- **Done when:** a test run at each level produces a readable report.

## Phase 2: Core mechanics

Every step here is designed as competing variants and chosen by simulation.

### 4. Combat rules
- **Designs:** turn order and action economy, hit and miss, crits, the damage formula, physical and magic damage, how blocking and evasion work, status effects, and when a unit is defeated.
- **Simulates:** whether the system holds up: varied fights, no single dominant approach, and sensible fight length and swinginess.
- **Produces:** a combat rules document, implemented in the engine.
- **Done when:** simulations show no dominant strategy, and fight length and swinginess land in ranges this step defines.

### 5. Role verbs
- **Designs:** the hidden vocabulary of about 15 to 20 verbs (physical damage, damage over time, burst, evasion, blocking, healing and so on), each defined in terms of the combat rules.
- **Simulates:** whether each verb measurably changes outcomes, and whether any verb is redundant or dominant.
- **Produces:** a verb list with definitions, and how each verb is measured in a fight.
- **Done when:** every combat behaviour maps to at least one verb, and every verb matters in simulation.

### 6. Trait vocabulary
- **Designs:** the fixed, player-facing trait words (agile, strong in numbers, hard to pin down…) and the verb profile each one stands for.
- **Produces:** a trait glossary. Flavour text can vary around a trait word; the word's meaning never does.
- **Done when:** each trait maps to one verb profile, and no two traits overlap.

### 7. Units and specializations
- **Designs:** base and derived stats; what class, specialization, abilities and gear each contribute; the ability format (triggers and behaviours, not stat boosts); 4 abilities per specialization with 2 equipped; how base specializations work.
- **Simulates:** class power and class variance. No specialization should dominate or be useless, and each should play measurably differently.
- **Produces:** a unit model and a template for defining a specialization.
- **Done when:** a test set of specializations lands inside the power band this step defines, with distinct behaviour in simulation.

### 8. Formations
- **Designs:** the 5 positions, how positional multipliers work, which roles each multiplier affects, how a formation is defined, and how a dungeon's party-size cap interacts with it.
- **Simulates:** how much formation choice changes outcomes for the same units.
- **Produces:** a formation model and template.
- **Done when:** the same units in two formations produce measurably different results against the same enemy.

### 9. Gear
- **Designs:** class-specific and generic slots, efficacy scaling across progression, powerful pieces and cross-class capstones, and number ranges with headroom for later tiers.
- **Simulates:** power growth across progression, and whether capstones stay special without trivializing content.
- **Produces:** a gear model and item template.
- **Done when:** a gear curve runs from the first dungeon to the end of version 1, with room above it.

### 10. Dungeon runs
- **Designs:** dungeon structure (fights leading to a boss), what wears down across a run, the perk system (themed pools of 10 to 15 perks, 3 options per pick, regular and premium rarity, perks that modify equipped abilities), and what happens on a loss.
- **Simulates:** attrition across a run, and how often perk picks change the result.
- **Produces:** a run model.
- **Done when:** runs land inside the length and attrition ranges this step defines, and perk picks matter without deciding every run.

### 11. Encounters
- **Designs:** the enemy template, how keys match keyholes and the threshold for a win, mixed keys per enemy, tuning to 75% of best-in-class, how efficacy offsets missing keys, and enemy trait descriptions.
- **Simulates:** whether the difficulty predicted from an encounter's verbs matches its simulated results.
- **Produces:** an encounter model and enemy template.
- **Done when:** predicted and simulated difficulty agree across a test set of encounters.

## Phase 3: Content and balance

### 12. Starter slice
- **Designs:** the starter class, a few more classes, and the first dungeons and their challenges, just enough to exercise every system.
- **Produces:** the first content set, as data.
- **Done when:** a simulated player can go from a solo starter unit to the first real wall.

### 13. Balance
- **Designs:** tuning so that 75% of best-in-class clears content, keys and keyholes behave as intended, and off-builds work without trivializing anything.
- **Produces:** tuned numbers and a balance report.
- **Done when:** simulations land every archetype inside the win-rate bands this step defines.

### 14. Progression pacing
- **Designs:** whether 3 to 5 quest rewards a week is enough, and which fix works if not (the candidate fixes listed under Open questions in the concept spec, or something else); the mix of specializations, formations and powerful gear that quests pay; where walls fall; how fast party choices become meaningful.
- **Produces:** a pacing model and recommendation, with the simulation data behind it.
- **Done when:** simulated players at realistic quest rates progress without long dead stretches or trivial runs.

### 15. Version 1 content
- **Designs:** at least three months of content: classes and specializations, dungeons, challenge sequences, perk pools and enemies. Names and writing fit the setting: generic medieval fantasy with touches of Greek, Norse and Japanese mythology.
- **Produces:** the full content set, as data.
- **Done when:** the full set passes simulation with the pacing from step 14.

### 16. AI playtests
- **Designs:** how an AI plays through the text interface, and what it reports.
- **Produces:** playtest reports on what felt rewarding, confusing or flat.
- **Done when:** every issue raised is fixed or explicitly accepted.

## Phase 4: Quest board (can run in parallel)

These steps connect the game to Memory itself, so they work from `memory-design-spec.md` rather than the overview.

### 17. Quest completion rules
- **Designs:** which Memory events complete each quest kind, using the event types defined in `memory-design-spec.md`.
  - **Notice:** a new item from a capture, not a recapture.
  - **Notice and do:** that new item, completed the same week.
  - **Want:** a goal created.
  - **Review:** a keep, dismiss, snooze, skip or "got it" decision on the offered item.
  - **Tackle:** the offered item completed.
  - **Keep:** every occurrence of the habit that week completed.
- **Produces:** an event-to-quest mapping.
- **Done when:** every quest kind has an unambiguous completion test against the event log.

### 18. Board generation
- **Designs:** the weekly schedule; what the AI reads (catalog, counters, profile, and the player's game state, including teased specializations); the prompt; board size and mix; the standing focus; value tiers by AI judgement; optional suggestions for Notice quests; how rewards are attached to quests; and a rule-based fallback if the AI fails, like the Brain's. `memory-design-spec.md` describes the Brain's schedule and fallback to model these on.
- **Produces:** a board generation spec and prompt.
- **Done when:** sample boards generated from real catalog data look right to the director.

### 19. Reward delivery and state
- **Designs:** paying rewards the moment a quest completes; banking rewards while the user is away; unfinished quests vanishing; missed rewards returning on later boards; where game state lives; game events in Memory's permanent log, following the conventions in `memory-design-spec.md`; and what happens to a reward when the completion behind it is undone.
- **Produces:** a state and reward-flow spec.
- **Done when:** every path from a completed task to a reward in the game, including undo, is defined.

## Phase 5: Interface

### 20. Screens and flows
- **Designs:** the game tab as a whole game: quest board, party and formation, gear, dungeon list, run screen, perk picks, challenge teasers and reward reveals.
- **Produces:** a screen list with the flows between screens, and rough wireframes.
- **Done when:** every action in phases 1 to 4 has a place on a screen.

### 21. Combat presentation
- **Designs:** how fights read on a phone: pacing and speed, damage numbers, big words like MISS and BLOCKED, and what each turn shows. With stats hidden and no recap, this is the player's main source of information.
- **Produces:** combat presentation rules.
- **Done when:** a player can infer an enemy's traits just by watching a fight.

### 22. Onboarding
- **Designs:** the first session and first week: the solo starter unit, the first quests, and how mechanics are introduced.
- **Produces:** an onboarding flow.
- **Done when:** a new player understands the loop from quest to reward to dungeon within their first week.

## Final check

### 23. Principles review
- **Checks:** everything above against the concept spec's principles: nothing on the Now map, no notifications, no punishment for losing or absence, the user always chooses, and rewards are paid per quest, not per task.
- **Done when:** every violation is fixed or explicitly accepted by the director.
