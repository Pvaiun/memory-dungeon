# Tried and rejected

What was built and measured, or played, then dropped. Read it before proposing a change to the rules or the numbers, so a failed idea isn't re-run blind. Each entry says the conditions it failed under: a later change can make one worth another try, so **Now** says whether it likely still holds. The full records are in git history under `steps/`.

## Statuses

1. **A cap to tame a status.** When triple stacks made Firebolt a nuke (88 Burn, 5,265 damage on the first pulse), Burn got a cap of 40, and one cast then reached it. Replaced by fewer stacks and Burn's decay each pulse. *Then:* Burn at 50–60 a stack. *Now:* holds; it's the rule "numbers, not behaviour". Step 5i's pieces have no caps or rate limits, so runaway stacks may come back through gear.
2. **Might and Shock with no cap or upkeep.** A hidden Bard stacked 123 Might; Anthem refreshing Might on one ally tripled its swings all fight; Shock piled 50–100 stacks on slow bosses (8,000 from one action). Now Might is spent one stack per action, to 15, and Shock stops at 40 as a safety; neither binds on one cast. *Now:* probably holds. Shock still grows with how fast its holder acts.
3. **Chill as a plain stacking slow, with Brittle.** It was never perceptible (stacks thawed before the next swing), and the Frostweaver dealt the least damage of any class. Replaced by Chill shattering at its cap. *Now:* the rejection holds, but the replacement overshoots (Cold Snap: chain shatters are 34% of its damage). Fix the amounts; don't go back to a slow.
4. **Sunder as an Armor cut.** −600 Armor a stack, uncapped: it reached 235 stacks, took Armor below zero (a floor bug), and did nothing against minions with little Armor. Now damage taken a stack, capped. *Now:* holds, and it works against magic too since there are two kinds of damage.

## Sustain and MP

5. **Free sustain.** The Cleric's Mercy (three quarters of each staff hit healed, for no MP; without it, wins fell from 78% to 45%, and the Cleric was in 77 of 90 top builds), Cure on a 6-tick cooldown, Lifesteal at 30% (Vampire parties +37 points; half of all party healing), Caravan's Regen of 36% of max HP every fight (+20.5 points against Neutral). Fixed with MP costs, long cooldowns, Lifesteal 20/10 and a shorter Caravan Regen. *Then:* HP carrying between fights. *Now:* likely holds. But the Caravan fix shortened a status, which "statuses are universal" now forbids, and the formation Long march gives every ally a full Regen (48% of max HP) at each fight's start: the problem may be back.
6. **MP scarcity inside a fight, by regen and prices.** These attempts failed:
   - One cost ladder for every class starved the 2,000-MP fighters and never touched the 5,000-MP casters, who died before running dry.
   - Three rounds of regen cuts only moved casters from never short to short over a run.
   - Dearer mana punished where it bound and was absent elsewhere, and a Clarity or Siphon unit made mana infinite.

   Ended by the rule that no class regains MP in a fight and each pool is sized by the fights it lasts. *Now:* probably holds; step 5i's MP pieces and regen seats could switch mana off again.
7. **No class MP regen: rejected, then adopted.** Priced first with costs and pools as they were, it took the same builds from 79% to 21% of wins. It was adopted later, once pools were sized per class, the bench regained MP and tonics dropped after fights. The clearest case of a failure that flipped when the economy around it changed.

## Pacing

8. **Head starts at a fight's opening.** These were tried:
   - Abilities charged 25/15/10 ticks by slot fired every short first-slot ability on tick 1. 19% of minions died before acting, and wins were 78% against 46–60% with smaller starts.
   - 20/12/6 and 16/12/8 still killed a third of some packs before they acted.
   - 8/4/0 felt "gutted".
   - Shares of each cooldown lined every first cast up on one tick.

   Settled at zero once cooldowns carry between fights. *Now:* holds for any head start on top of the carry.
9. **Short cooldowns across the board.** 12/20/30/44, then 12/18/22/30 ticks: "way, way, way too far". These were the effects:
   - A self-buff on a cooldown shorter than its own duration made Stand fast's Taunt permanent, and the Knight died taking every hit.
   - Two 12-tick abilities cycled with no basic attacks between them.
   - Allies cast on the same tick.

   Since then, a self-buff's cooldown is longer than its duration. *Now:* likely holds; pieces that refund or shorten cooldowns could recreate it locally.
10. **Long, soft regular fights.** Foes at +80% HP and −30% damage doubled a fight's length (to about 37 ticks). With the Armor formula they made minions trash: "200 damage to a unit with 5,000 health". Cut to +40/−10. The proposed fix, foes swinging bigger and less often for the same damage a tick, was never built. *Now:* likely holds.
11. **Stun interrupting a wind-up.** A Knight with MP to spare locked bosses out of their big moves (Inferno landed 2% of the time). Now Stun pauses a wind-up and only Silence interrupts. *Now:* likely holds; bosses also resist control.

## Defense and Aggro

12. **HP at a whole point per gear step.** Armor plus Heartstone was every class's best kit: it doubled a caster's HP, and Regen and Shields grew with it. The step was halved. *Then:* three gear slots. *Now:* probably holds; more effects scale from max HP now, and step 5i's commons carry two stat steps.
13. **Armor as a flat cut, then the Path of Exile formula at k = 1.** The flat cut blanked every weak swing into plate. At k = 1 Armor took 92% off a minion's swing into a plated Knight, while fights against magic-hitting foes swung the other way. k = 0.25 shipped. *Then:* elements in the game. *Now:* partly. The director has asked for Armor to matter more, and all magic now meets Magic resist instead, so re-measure before raising k.
14. **Aggro straight, then capped.** Foes picking in proportion to Aggro let a back line stack to a 1% chance of being picked. The capped curve (a third to three times an ordinary unit) was too flat: a fully built defender drew 64% of picks and Aggro gear showed no effect. Replaced by doubling every 25 Aggro. *Now:* the first failure partly reopens. Under doubling, a caster at Aggro 25 beside a defender at 200 draws under 1% of picks, the near-immunity the straight rule was dropped for. Nothing is re-tuned for it yet.
15. **More HP for fragile classes, and the Knight at HP 4.** HP 3 for the Bard, Hexer and Assassin bought a tick or two (knocked out 49, 55 and 39 times in 100 fights, against 51, 60 and 41). The Knight at HP 4 fell from +17.5 to +7.8 points on a build's wins and became a weak wall. Both reverted. *Then:* the capped Aggro curve. *Now:* HP alone probably still fails; under doubling, fragility may matter less.
16. **The Assassin Hidden most of a fight.** At Hidden 85% of a fight it left its two allies every hit (its parties −20 points). A longer Hidden on a long Vanish did nothing, because Vanish came after the Assassin had died. Settled at Hidden 10. *Now:* unknown under doubling.

## Kits

17. **Fixing one-target buffs and curses with numbers.** Three rounds of cheaper songs and curses, HP 3 and smarter targeting didn't move the Bard (−11 / −24 / −15 points) or the Hexer. Reworking them to reach every ally or every foe did (the Bard −2 / +2 / −2). *Then:* parties of three, where a body is worth more than a buff on one unit. *Now:* holds while parties are three; watch step 5i's single-target versions and pieces.
18. **Levers that moved nothing.** These made no difference:
    - weak classes joining with two abilities: no class gained more than 4 points;
    - every alternative starting ability: only the Vampire moved;
    - 30% of HP or MP back after each won fight: the Cleric stayed in two thirds of the top builds.

    The lesson: a weak class's trouble is its kit, and a mandatory class's is its free tool.

## The rogue mode

19. **Legendaries as specificity with few stats.** Legendaries carrying an effect and few stats were worth less than rares: three legendaries at the start were +4 points against +12 for three rares, and only one of 29 beat an ordinary piece of its slot ("stat sticks with a small rider"). The fix then was a rare's two random stats on each legendary. Step 5i dropped random stats and the shape came back: Lockdown wins 94%, 76% and 74% at rungs 1, 2 and 3. *Now:* likely holds. Step 5i's proposed lever, one stat step on every rare and legendary, is the old fix again.
20. **The reserves rule.** After a lost fight, those at camp took the road. At bosses it was "a loss screen with extra steps" or "a wipe that cost nothing". Dropped: a wipe ends the run. *Now:* likely holds; swaps any time outside a fight answer the root complaint (members "watching from camp").
21. **Fights hidden until the party is set.** "Gear is a blind guess." Showing the foes with the party still open to change produced the playtesters' favourite moments. *Now:* holds; with no control in fights, the preview is where the player plays.

## Process

22. **Knobs absorbing class problems.** Tuning difficulty knobs while class and formation problems were still in the game priced the problems in. Once the Vampire, Caravan and the healers were fixed, the rogue's regular-fight knobs fell by a third and late bosses by 100 points or more. A knob that buys difficulty with HP buys time: fights of 85–114 ticks. *Now:* holds. Fix numbers at frozen knobs, run `npm run balance`, then recalibrate.
23. **Calibrating against parties no player has.** These reference parties all misled:
    - Rosters fielding their best of ten trios: any other trio paid two to three times the target.
    - Rosters starting fights uncharged, when a run carries about 60%.
    - Rosters at full MP, which overrated the casters.
    - Rosters carrying a smaller map's loot: the director then won act I four times of four, "trivially".

    *Now:* live. Step 5i replaced all loot, so the rosters' gear no longer matches what a run holds.
24. **How the knob scales foes.** These were tried:
    - HP and damage raised evenly: doubled swings killed casters at tick 10.
    - Easing both: bosses lost their teeth.
    - Damage at k ÷ 2: its damage half one-shot a full-HP Knight, and its HP half made 137–167-tick slogs.

    Now HP k% and damage k ÷ 2.5; an HP-only knob is still open. Status damage sits outside the knob, so fights decided by it (the snakes' Bleed, the Bomb Bugs) need content changes.
25. **Balancing from averages.** A target of "a fifth of builds viable" let an AI playtester clear 17 of 20 campaign nodes on the first try, and the balance sheet's average Burn hid Firebolt's 88-stack nuke. The director, after the sheet pass: "the field read was by far the most effective tool". *Now:* holds.
