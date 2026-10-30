# The pieces' design: gate 2

Oct 30, 2026. The spine you approved is now written in full: every piece, formation, upgrade and mythic has its card, its numbers, its engine hooks and the builds it serves. This is what `pieces-build-brief.md` hands to an implementing session.

## What needs you

1. **Shorter statuses are allowed.** My brief to the agents said a piece could never change how long a status lasts. That was wrong: your rule is about how a status scales, and Caravan gave a short Regen for months. The ruling: a piece can apply a status for less than its own length, never more. It settled about a third of the agents' challenges. Say if you'd rather statuses always run their full length.
2. **Ceilings, to keep the numbers in today's ranges:**
   - no single cast or hit adds "many" stacks;
   - "double" only on a condition a fight meets a few times, and half again where a party can keep the condition up all fight;
   - no triples, except the Worldbreaker's slow swing;
   - a counter (Heat, Spite, Fervor and the rest) gains at most one stack every 2 ticks, so it grows at a fight's pace, not a swarm's.
3. **One swing shape per unit.** Phalanx, the Millstone, the Hummingbird charm, the Worldbreaker and two formation seats each reshape a unit's basic attacks. A unit takes one; the others give it Attack or Magic +1 instead. Without this, a Hoplite in the Hammer seat with a great weapon swung once a fight, the statue you cut in 5g.
4. **The engine grows a lot.** The spine listed 17 additions; the fill adds about 35 more, most of them small (an event naming who landed a killing blow, a condition for "hasn't acted yet", extra strikes that hit several foes). They're grouped in `fill-rulings.md`. The build session should cost them first and give any that serves a single piece a simpler shape.
5. **Two things the agents caught:**
   - **The Assassin's mythic** had quietly brought back Shadow strike, which you retired on Oct 26. It's rewritten.
   - **Uncommons repeated each other across slots:** the same card on a sword and a horn, for the Knight. The fix: no uncommon effect appears twice for the same class.

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
- **Storm pike** (spear, legendary): each hit it lands adds a Charge, at most one every 2 ticks, up to 6. At 6, its next basic attack that lands also calls lightning on every foe (light magical damage, from Attack) and spends the Charges.
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
- **Withering idol** (idol, rare): one in three of its holder's basic attacks Weakens its target, and its hits on a Weakened foe deal a little more. A lone boss may still be Weakened most of the fight.
- **Hammer and anvil** (formation, rare): "One takes the blows, one strikes like a falling hill, one builds stone around the striker." With a slow weapon, the Hammer swings half as often for triple; otherwise, Attack up.
- **Thrall's chalice** (the Vampire's mythic): once a fight, when an ally falls, the Vampire heals to full, and the next time it lands a killing blow, that ally rises with a quarter of its max HP.

## What I'm least sure of

- **Swarms:** Oathkeeper, the Pike wall, Thornheart plate and the Bramble knight's mythic all scale with how many foes attack. Each is capped now; whether the caps are right is a test.
- **Phoenix:** several returns can sit on one unit (Phoenix ember, the Vial of the last breath, Shield of the chosen, a revive).
- **Thinner after the rulings:** Opening thrust (the Hoplite's first swing at once, no bigger) and Rupture (its burst is now Bleed's own size). They may read as worse than the base.
- **Free sustain on uncommons:** the Charnel icon heals the lowest ally a little on every kill, and the Matins robe halves the first ability each fight. Both sit where the gap map found "heals on any kill" strong everywhere.
- **Gambler's coin and Echo charm:** both cards are clearer now; both may still surprise.
- **Two-handers:** whether the Volley bow or the Cataclysm staff is worth giving up an offhand is a test, not a design.

## Next

`pieces-build-brief.md`, in a fresh implementing session: it builds the engine additions, the content, the loot and the interface, then measures all twelve builds side by side on hand-built parties. It reads `spine.md`, then `fill/` with `fill-rulings.md` (the rulings win where they differ). Balance and the harder difficulty pass come after it, as their own pass.

## Method notes

- **A brief's own rule can be the bug.** One sentence in my brief (no shorter statuses) generated a third of the challenges. A rule meant to protect the director's rule was stricter than it.
- **Shares need a shared index.** Each agent checked its own kind against the spine, but nobody saw another share's uncommons, so the same card appeared on a sword and a horn. Next time, the lead gives each agent the other shares' item names and one-line effects before the agents write.
- **Two rounds of rulings, applied by the agents that wrote the files,** kept every agent's context and took a few minutes a round.
