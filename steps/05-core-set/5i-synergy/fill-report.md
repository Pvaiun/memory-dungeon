# The pieces' design: gate 2

Oct 30, 2026. The spine you approved is now written in full: every piece, formation, upgrade and mythic has its card, its numbers, its engine hooks and the builds it serves. This is what `pieces-build-brief.md` hands to an implementing session.

## Your word at gate 2 (Oct 30)

> I would keep statuses universal. You can't apply a shorter status. [...] For two, don't make rules about balancing. We're gonna do that in the balancing pass. Same thing for three, just let it happen. We're trying synergies now, it's okay if they're OP. Engine growing is totally fine.

Applied to all seven files (`fill-rulings.md`, third round):
- **Statuses are universal.** Every status a piece applies runs its own length. That isn't a problem for the design. A few pieces are stronger or harsher for it:
  - the uncommons' free Taunt and Haste at the start run 20 ticks;
  - Thorn hedge's Weaken holds the Anchor's attackers almost all fight;
  - Aftershock Stuns every foe for 8 ticks;
  - The forge slows its own party for 24 ticks, most of a regular fight.
- **No balancing rules.** The ceilings, the counters' rate limit and "one swing shape per unit" are gone. So is every cut I'd made for strength: each piece is back to the spine's line or its agent's first number. The number ranges are first values, not limits. What stayed was never about balance:
  - loops;
  - duplicate or same-card pieces;
  - wrong wearers and targets;
  - rule breaks (Aegis, a status's own cap);
  - clearer cards and names;
  - Night's edge, which had brought back the Shadow strike you retired.
- **The engine grows:** about 35 additions beyond the spine's 17, grouped in `fill-rulings.md`.

## What's done

| | Common | Uncommon | Rare | Legendary | In all |
| --- | --- | --- | --- | --- | --- |
| Weapons (11 kinds) | 22 | 22 | 22 | 22 | 88 |
| Armor (4 types) | 12 | 12 | 12 | 12 | 48 |
| Offhands (10 kinds) | 20 | 20 | 20 | 20 | 80 |
| Amulets | 6 | 6 | 6 | 6 | 24 |
| **Gear** | **60** | **60** | **60** | **60** | **240** |

Plus 32 formations (11 common, 12 rare, 9 legendary) and Neutral; every ability's and passive's upgrade (64, each a power step and two versions); 16 mythics. No two names clash.

Seven agents wrote it in parallel from `fill-brief.md` (intent and ranges, no examples). I ruled on their challenges (`fill-rulings.md`, two rounds), they applied the rulings, and a fresh reader checked all of it together between the rounds. The files are in `fill/`.

## A sample

Fifteen, picked by the fresh reader across the range, with the three it was least sure of last. The card text is as the player would read it.

**Gear**
- **Birch wand** (wand, common): +1 Magic, +1 MP.
- **Courier's coat** (Leather, uncommon): Attack +1. The first time each fight the wearer drops below half its HP, it's Hasted.
- **Dazzling lantern** (lantern, uncommon): HP +1. At the start of every fight, the foe with the highest Attack or Magic is briefly Weakened.
- **Echo horn** (horn, rare): each time an ally finishes casting an ability, the ally with the least MP gains a little MP.
- **Storm pike** (spear, legendary): each hit it lands adds a Charge, up to 10. At 10, its next basic attack that lands also calls lightning on every foe (light magical damage, from Attack) and spends the Charges.
- **Rubble plate** (Plate, legendary): when the wearer's Shield breaks, every foe takes damage equal to the most that Shield held since it last broke, and a Shield of a quarter of that is rebuilt.

**Formations**
- **Spur** (common): "One sets the pace; two strike fast and light." The Pacer Hastes the other two at each fight's start; the two Blades swing faster and are frailer.
- **The choir** (legendary): "Each ability a voice casts makes the next voice's next ability free. In a fight, nobody gains MP any other way."

**Upgrades**
- **Shield bash** (Knight). The power step: more damage. **A, Measured blow:** waits for a foe to start a wind-up, then bashes the casting foe with the highest Attack or Magic and Stuns it (your idea of Oct 28). **B, Crushing bash:** bashes a random foe for double, scaling from max HP and its current Shield together; no Stun; a longer cooldown.
- **Burning fist** (Monk). The power step: more Burn. **A, Frost fist:** three quick hits on the foe with the most Chill, each adding a little Chill (your Monk run, as a version). **B, Fanned flames:** five quick, light hits on the foe with the most Burn, each adding a little Burn.

**Mythics**
- **Metronome** (the Bard): counts every hit the party lands. At 20, War ballad, Allegro and Thunder chord are ready at once, and the count starts again.
- **Glacier's heart** (the Frostweaver): whenever a foe's Chill shatters, the Frostweaver puts half of it back: 6 Chill on that foe.

**Least sure**
- **Withering idol** (idol, rare): its holder's basic attacks Weaken their target, and its hits on a Weakened foe deal a little more. A lone boss is Weakened all fight.
- **Hammer and anvil** (formation, rare): "One takes the blows, one strikes like a falling hill, one builds stone around the striker." With a slow weapon, the Hammer swings half as often for triple; otherwise, Attack up.
- **Thrall's chalice** (the Vampire's mythic): when an ally falls, the Vampire heals to full, and the next time it lands a killing blow, that ally rises with a quarter of its max HP.

## What I'm least sure of

Strength is the balance pass's now. What's left here is design:
- **Phoenix:** several returns can sit on one unit (Phoenix ember, the Vial of the last breath, Shield of the chosen, a revive), so a party may never lose its first member. That's a question of shape as well as size.
- **The forge** may read as a trap: its 24-tick self-Slow costs most of a regular fight.
- **Locks that hold all fight:** Withering idol, the Humbling mace, the Glacial rod, Deep cold and Thorn hedge's Weaken can keep a lone boss disabled. `builds.md` framed Lockdown as windows; your fix there was bosses that resist repeated control, later.
- **Two-handers:** whether the Volley bow or the Cataclysm staff is worth giving up an offhand is a test, not a design.
- **Gambler's coin and Echo charm:** both cards are clearer now; both may still surprise.

## Next

`pieces-build-brief.md`, in a fresh implementing session: it builds the engine additions, the content, the loot and the interface, then measures all twelve builds side by side on hand-built parties. It reads `spine.md`, then `fill/` with `fill-rulings.md` (the rulings win where they differ). Balance and the harder difficulty pass come after it, as their own pass.

## Method notes

- **A brief's own rule can be the bug,** twice over. One sentence in my brief generated a third of the challenges, and my fix (shorter statuses allowed) went past the director's rule the other way. Their rule was the plain one: statuses are universal.
- **Don't balance in the design.** Two rounds of rulings capped and cut for strength. The director's word: synergies first, balance in its own pass. Next time, the design rounds rule only on loops, overlaps, rules, wearers and clarity.
- **Shares need a shared index.** Each agent checked its own kind against the spine, but nobody saw another share's uncommons, so the same card appeared on a sword and a horn. Next time, the lead gives each agent the other shares' item names and one-line effects before the agents write.
- **Two rounds of rulings, applied by the agents that wrote the files,** kept every agent's context and took a few minutes a round.
