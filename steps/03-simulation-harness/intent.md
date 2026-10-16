# Step 3 intent

Gathered with `/intent 3` in a fresh session, Oct 16, 2026: the director's answers to the brief, one round of follow-ups, and a read-back. Items marked "picked from options" were reactions to the brief's lists.

## What the harness is measuring

- [firm] The game is an autobattler about build-making. The skill is party composition and trial and error: play a fight, see it didn't work, try something else. It's about assembling the right elements from a set of tools, not performing with one tool.
- [firm] Running back the same party should give a very similar result. This isn't a dice game.
- [lean] Perk picks are the only light decisions inside a dungeon. They're offered at random and shouldn't sway the outcome much. They're mostly a signpost toward the kind of party that synergizes with them, pointing at the strategies that beat that dungeon.
- [lean] Each unit has a big role from its specialization, and sub-roles from the subset of abilities picked for it. How well it performs comes down to levers: the right specialization, the right abilities, gear strong enough for its job (a gear check), and the right formation. Then a party is built from those units. There's no levelling. Power comes from acquired gear, unique gear, specializations and formations.
- [firm] Challenges must need a pretty high level of optimization, or it isn't a build-making game: "If most dungeons can be beaten with most builds, the game has no appeal." But a challenge mustn't be beatable by only one combination in a million. Each fight has several answers, and the player can be creative in finding them (keys and keyholes, as decided at step 1).

## What reports are for, and who reads them

- [lean, partly picked from options] The numbers are mainly for the AI: how close losses were, how many tries a wall takes, the spread, how much perks matter, how classes compare and how well they do in different situations, and any broken synergies. The AI uses them to keep balancing, propose design changes, and ask the director plain-language questions about the subjective calls.
- [lean] The director's input is most useful on the macro questions. How do things pace over weeks: how many dungeons a player beats, and how often they have to wait before they can keep playing? How strict is build-making: are there walls, do you need a specific item, and how many specific rewards does a wall need? And how much each lever (specialization, abilities, gear, formation) has to be right for a unit to fill its role.
- [firm] "What share of all builds beat this" isn't a meaningful number. The build space is huge (10 specializations, 3 formations and 50 pieces of loot already make thousands of builds), and keys skew it. If an enemy is weak to poison and one poison unit carries the party, what matters is the share of parties *with poison* that win. Think in multiple keys and multiple keyholes. The AI works out a threshold of tolerance: how custom a party has to be for a given challenge.
- [lean] The director can't give numeric targets yet, with no combat and no mechanics. Targets will be set, and the director should be able to see whether they're met, but they'll be about feel more than numbers.
- [idea] We'll probably need our own language for talking about build strictness, made once there are mechanics. A build-making game like this allows creativity and free-form building, which a small-set game like a card game doesn't, so its numbers say less about the player's experience.
- [firm, picked from options] The director doesn't read data reports, unless a good data language for them is worked out once there are mechanics. Words first, stories second, charts third. Tables aren't important, but the director should still be able to get at them.
- [lean] Both balance findings and feel findings reach the director, especially class balance, class design and how spiky enemies are. Variety has to be felt, not just be there in the numbers.
- [lean] Stories are the director's main way of catching measurements that have gone wrong. Later, the director will find those errors by playing the game and report them.
- [lean] Reports stay in AI chats and in the repo for now. There's no phone page yet.
- [idea] If stats are ever viewable, they'd be a web page on the phone, like a stats page for the app.
- [lean] This step's test: the director judges the words-first version of each level's sample report, with a story at each level. (The interviewer proposed this, and the director agreed.)

## Simulated players

- [firm] The players aren't modelled on the director. Memory's data has no quest board in it. Once there's real board data, it may later feed a kind of recursive optimization.
- [firm, picked from options] Tune for the optimizer: a player who does most quests and homes in on the fun of the game, which is build-making. Build requirements can be quite strict.
- [lean] A grinder simulation that proves grinding doesn't pay has value. A casual player is worth a look. A bursty player is probably just a slower optimizer, since nothing in the game advances while the player is away. It's a one-person app, so don't burn compute on play styles we don't expect. Other players aren't the priority, but they'd help make the game better.

## Quest rates

- [lean, picked from options] Use assumptions, not the director's history. The game's goal is to make the player create and complete more tasks than they do now, and creating or completing can both answer a quest, so past history isn't a guide. Real quest board data replaces the assumptions soon after the first design and implementation pass.
- [lean] Start at 4 to 7 quests a week. It could be more or less. Quests have rarity tiers by difficulty, so the board could be padded with many small quests if the game needs it (a quest board question for later). The concept spec sizes content on 3 to 5 quest rewards a week. This is the harness's starting assumption, and step 15 settles it.

## Rewards and grinding

These belong to later steps (gear, runs, pacing), but they decide how simulated players behave.

- [firm] Grinding should never be a strategy. Some repetition is part of the game, but nobody should be able to cheese it by putting in lots of time. This changes the concept spec, which says "grinding is intended" and calls it "the slow road past a wall".
- [lean] A first clear of a dungeon, or of a new challenge in it, pays a reward: unique loot, or more likely better-quality loot. Each challenge pays its own random rewards: a chest the first time you complete it, and nothing more for repeats. Replaying without beating a new challenge pays nothing or very little.
- [lean] Each level has enough challenges for quite a lot of content.
- [lean] Suppose a player has done every challenge they can and still can't beat the boss. That's probably not an expected flow. Even then, small gear gains shouldn't be what makes the difference: the player should expect to need a new strategy built on quest rewards. Still open: whether that player is simply stuck, with quests the only way through, or gets some minimal random reward.

## Feel checks

- [firm] Feel checks mostly check that information is clear, both for build-making decisions and in tense fights.
- [lean, picked from options] Dramatic moments, such as comebacks, close calls and a win on the last hit: "love that."
- [lean, picked from options] Fights in the same dungeon feeling alike is probably good, because it helps you understand the dungeon. Across dungeons there must be a range: none identical, many that feel very different from each other, and some that feel similar.
- [firm, picked from options] Whether you could tell why a fight was lost is very important. A report that says "bring more poison" isn't the bar. The bar is that you can perceive the fight happening and guess at a strategy. There are several answers to each fight.
- [lean, picked from options] Every dungeon builds up to its boss, to different degrees: a huge spike in some, a gradual rise in others, maybe several bosses.
- [lean, picked from options] The reader's guess at the right party for next time is important. But the guess isn't "the enemy is a red door, so I'll make my red key party". It's "I'm in the right colour space, I should tweak" or "I'm in the wrong colour space".
- [lean] Units that seem to do nothing aren't much of a concern.

## Using the harness

- [lean, picked from options] The director will mostly read reports and ask questions in chat, and won't tweak numbers yet.
- [lean] The first version has no complex interface, so it stays focused on the problem at hand. But the tech shouldn't close the door on the director editing and trying things later. They're a professional video game director and enjoy getting into the weeds, though the point of this project is that they shouldn't need to.

## Left to the designer

- Which players to simulate besides the optimizer, judged against how much compute they cost. The grinder check is valued, the casual player is of interest, and the bursty player is probably redundant.
- How strictness and the "threshold of tolerance" are measured, and the language for talking about them, until mechanics exist to ground it.
- Everything in the brief's "What the designer will decide": how the harness is built, how simulated players choose, the placeholder progression, how feel checks are run, what the feel reader sees, and what's kept. The director didn't claim any of it.
