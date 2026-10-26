# Step 5c intent: Bleed for Poison, slotted openings, hungry casters, a three-way campfire

From the director's message in the session of Oct 26, 2026, after reading the 5b report (`../5b-pacing/report.md`). Not an interview: the items are their words, lightly cleaned, tagged with how firmly each was held. Two readings are mine and marked as such; correct anything here and the design follows.

## Armor

- [firm] **The Path of Exile formula.** "Damage = Hit² / (Hit + k × Armor) with k = 1 to start." "Basically just making it so that armor is mostly linear, but it just doesn't bottom out." The 25% floor "I get why you did it. I think it's smart", but "there's a number of armor relative to the roster where it basically becomes irrelevant to [increase] armor more. If your armor is higher than 25% of the average damage of the roster, then it becomes bad to stack more, and I don't like that."

## Poison becomes Bleed

- [firm] "I just don't think poison works in this game. I think it's designed as an attrition status effect, but attrition is already well handled by just healing, shields, the natural identity of an autobattler." "The problem that you're running into with the right damage number is not solvable. I spent quite a bit of time with another two agents trying to solve it."
- [firm] **Bleed:** "applied to a unit in the same way that Burn, Chill and Shock are, and the ability determines the scaling, and that scaling determines the amount of stacks." "Bleed on its own does nothing, and doesn't tick down." "Whenever the holder gets hit by a hit (it's not damage, but a hit), they take damage equal to X times bleed stacks. And then bleed stacks are diminished by a ratio of Y." "I'll leave you to determine through simulation the correct value of X and Y."
  - "It turns it into an inverse Shock, where it prioritizes teams that are able to apply constant pressure onto the enemies."
  - "Just like other status effects, bleed doesn't count as a hit, and it ignores armor and resistance. Bleed also has no duration."
- [firm] **Who bleeds:** the Ranger ("already a fast-hitting unit") and the Bramble knight ("able to apply bleed whenever they get hit, which means that taunting becomes a really strong whittle-the-enemy-down strategy"). "This also works with the snakes, thematically."
  - "The bleed stacks from the Ranger should scale off of Attack."
  - "The amount of [stacks] on the Bramble knight should scale through either HP or Armor, probably Armor." *(My reading: the message says "the amount of attacks"; I took it as the Bramble knight's Bleed stacks, in parallel with the Ranger's sentence that follows. If it meant Bramble lash's damage, say so.)*
  - [firm] The Ranger's Bleed arrow: "re-change the targeting to be totally random, rather than focus on bleeded or poisoned units like it was doing before."
- [firm] **The Assassin:** "rather than giving crit when Hidden, their passive gives them Bleed when critting. Scaled based off whatever the simulation thinks is best."
- [firm] **A bug:** "Bramble lash doesn't say, with developer mode on, that it scales off of Thorns, which it says in the doc."

## Opening cooldowns by slot

- [firm] "I really dislike that the cooldowns start randomly. That feels so arbitrary. The game's about preparation, and you can't prepare for something random like that."
- [firm] "What if where you slotted the ability affected how it started the fight? More turns of cooldown finished for the first, then the second, then third ability. Like 25 for the first, 15 for the second, 10 for the third. I'm just making numbers up. I don't think it should be a percentage, because that would create this weird thing where we have to balance high-cooldown abilities with the possibility of putting them first."
- [firm] "Ability order seems to matter very little" now that abilities cast back to back fell from about half to 22%.
- [firm] "We do have to test that casters are able to use their spells. That just means that those cooldowns are too long if they're not able to come off." And the pacing: "it feels like they do a lot of basic attacks, but I would tackle that using the other problem, which is that a lot of supports didn't get their abilities off before the fight ended."

## Mana

- [firm] "The mana is inverted here." "Spellcasters should be mana hungry. A tanky unit takes hits and cares about topping up its health. A DPS unit cares about not being disabled, being able to attack. And a magic unit, one of the biggest gates they have is their ability to cast their spells, because they're not that useful without them." "We need to make sure that the mages should be going for magic regen gear. Big tanky units probably should be rarely running out of mana." "The Bramble knight shouldn't be caring about mana as much as the Pyromancer." "I would expect, given their kit, where two of their abilities have basically free targeting, that the Cleric would run out of mana, or that mana is one of the things that gates their functionality."
- [lean] How: "Maybe mana regen is the problem. Maybe it should be zero across the board and only gear raises it, but I'm iffy about that. To be tested. Or just really low across the board." "Whether that's diminishing mana regen or dramatically increasing the cost of their spells."

## The campfire

- [guess, theirs] "The Valkyrie is probably strong because of the revive. And I'm noticing that it seems like revive is pretty mandatory." The Knight: "probably just that he's strong and part of the starters, so the playtesters don't switch him out."
- [firm] "The campfire gives three options instead: revive a single dead unit of your choice, heal, or restore mana." "We need to balance them so that they're all useful, and the increased mana punishment should make it so that the mana option matters. Keep tuning it until it does."

## Burn, Shock, and three classes

- [firm] "Burn and Shock are really weak right now. And Bleed probably is too, but let's test it first." "Buff the amount of Burn stacks and Shock stacks given from the Stormcaller and the Pyromancer."
- [firm] **The Bard:** "Replace the Bard's Lullaby, which is a pretty much useless skill on the worst character, with a Shock skill that shocks the entire enemy team, scaling off of Magic."
- [firm] **The Paladin:** "Give the Paladin Burn on their Smite, and lower its cooldown."

## After the report (Oct 26, 2026)

- [firm] **The Paladin:** "Fix the paladin. Mana cost."
- [firm] **The Knight:** "Find a way and propose to me how we're [nerfing] the knight, so he's not OP." *(The message says "no freeing"; I took it as nerfing. A proposal, not a change.)*
- [firm] **No stat-to-cost rule:** "Across the board for mana, I am in extreme disagreement with your rule. We don't want rules that are magical like that, where something that makes absolutely no logical sense but reflects well over a data set becomes a rule." "Just make the mana costs higher for characters that have high magic. Not as a rule, not as a scaling, like just today, right now. Change those costs for those characters at this moment. But the idea that there's this per class, per stat rule, it's very much against my philosophy."
