# Step 5c intent: armor, Bleed, ability order, mana, the campfire, Burn and Shock

From the director's message of Oct 26, 2026, after reading the 5b report (`../5b-pacing/report.md`). Not an interview: the items are their words, lightly cleaned, tagged with how firmly each was held. Correct anything here and the design follows.

## Armor

- [firm] **The Path of Exile formula, k = 1 to start.** "Damage = Hit² / (Hit + k × Armor)." "Basically just making it so that armor is mostly linear, but it just doesn't bottom out."
  - Why not the floor: "there's a number of armor relative to the roster where it basically becomes irrelevant to [increase] armor more. If your armor is higher than 25% of the average damage of the roster, then it becomes bad to stack more, and I don't like that."

## Poison becomes Bleed

- [firm] **Poison goes.** "I just don't think poison works in this game. I think it's designed as an attrition status effect, but attrition is already well handled by just healing, shields, like the natural identity of an autobattler already very heavily favors attrition." "The problem that you're running into with the right damage number is not solvable. I spent quite a bit of time with another two agents trying to solve it."
- [firm] **Bleed takes its place.** "Applied to a unit in the same way that burn, chill, and shock do, and the ability determines the scaling, and that scaling determines the amount of stacks." "Bleed on its own does nothing, and doesn't tick down. Whenever the holder gets hit by a hit (not damage, but a hit), they take damage equal to X times bleed stacks. And then bleed stacks are diminished by a ratio of Y." "Bleed doesn't count as a hit, and it ignores armor and resistance. Bleed also has no duration."
  - [firm] "I'll leave you to determine through simulation what the correct value of X and Y is."
  - The idea: "kind of an inverse shock, where it prioritizes teams that are able to apply constant pressure onto the enemies."
- [firm] **The Ranger.** Its Bleed arrow's stacks "should scale off of attack". "We need to re-change the targeting of the ranger bleed attack to be totally random rather than focus on either bleeded or poisoned units like it was doing before. I don't think ranger's bleed is going to need that targeting mode to be successful." Thematically: "the Ranger, who is already a fast-hitting unit".
- [firm] **The Bramble knight** "is able to apply bleed whenever they get hit, which means that taunting becomes a really strong whittle-the-enemy-down strategy." Its Bleed "should scale through either HP or armor, probably armor."
- [firm] **The Assassin:** "rather than giving crit when hidden, their passive gives them bleed when critting. Scaled based off whatever the simulation thinks is best."
- [lean] **Snakes:** "this also works with the snakes, thematically."
- [firm] **A bug to check:** "Bramble Lash from the Bramble Knight doesn't say, with the developer mode on, that it scales off of thorns, which it says in the doc."

## Ability order sets the opening

- [firm] **No random opening.** "I really dislike that the cooldowns start randomly. That feels just so arbitrary. The game's about preparation, and you can't prepare for something random like that."
- [firm] **Slot order instead.** "What if where you slotted the ability affected how it started the fight? You got more turns of cooldown finished for the first, and then the second, then third ability. Like 25 turns for the first ability, 15 for the second, 10 for the third. I'm just making numbers up." "I don't think it should be a percentage, because that would create this weird thing where we have to balance high cooldown abilities with the possibility of putting them first." "The idea of the order affecting ability cooldown seems really potent."
  - Why: "ability order seems to matter very little because you've reduced the time when abilities cast right after another from 50% to 22%." And "the pacing of party basic attacks to regular moves is a little bit weird, in that it feels like they do a lot of basic attacks", which they'd tackle through "the other problem: a lot of supports didn't get their abilities off before the fight ended."
- [firm] **Casters must cast.** "Even when you implement this, we do have to test that casters are able to use their spells. That just means that those cooldowns are too long if they're not able to come off. That would be my guess."

## Mana

- [firm] **The mana economy is inverted.** "Spellcasters should be mana hungry. A tanky unit takes hits and they care about topping up their health. A DPS unit just cares about not being disabled, being able to attack. And a magic unit, one of the biggest gates that they have is their ability to cast their spells, because they're not that useful without their spells." "We need to make sure that the mages should be going for magic regen gear. And on the other side, big tanky units like the knight should be rarely running out of mana." "The Bramble Knight shouldn't be caring about mana as much as the Pyromancer is." "Given their kit, where two of their abilities have basically free targeting, the cleric would run out of mana, or mana is one of the things that gates their functionality."
- [guess] How: "Maybe mana regen is the problem. Maybe it should be zero across the board and only gear raises it, but I'm iffy about that. To be tested. Or just really low across the board." "Whether that's diminishing mana regen or dramatically increasing the cost of their spells."

## The campfire

- [firm] **Three options.** "The option to revive a single dead unit of your choice, the option to heal, and the option to restore mana. We need to balance them so that they're all useful, and the increased mana punishment above should make it so that the mana heal of the campfire matters. Keep tuning it until it does."
  - Why: "I think the Valkyrie is probably strong because of the revive. And I'm noticing that it seems like revive is pretty mandatory." (The Knight: "I think it's probably just that he's strong and he's part of the starter class, so the play testers don't switch him out as often.")

## Burn and Shock

- [firm] "I think burn and shock are really weak right now. And bleed probably is too, when we implement it, but let's test it first."
- [firm] "Buff the amount of burn stacks, and the amount of shock stacks, that are given from the Stormcaller and the Pyromancer."
- [firm] **The Bard:** "Replace the Bard's Lullaby, which is a pretty much useless skill on the worst character, with a shock skill that shocks the entire enemy team, scaling off of magic."
- [firm] **The Paladin:** "Give the Paladin Burn on their Smite, and I would lower its cooldown."
