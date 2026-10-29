# Step 5i design: gear, formations and upgrades that make builds synergize

**Superseded (Oct 29, 2026).** The director's notes on this version (`intent.md`, last section) reject its approach: rules first and pieces fitted to them, builds that each double down on one keyword, and a sample of single-line effects. The step restarts from a philosophy, then the slot structure, then a dozen builds designed as whole things, then the pieces built backwards from them. Kept as the record. What they liked here: the gap map, Curse ring, Pyre's Wildfire, Frost fist, Vanguard's Cover, Shield bash scaling from a second stat, and branches that play on triggers and targeting.

First version, Oct 28, 2026, for the director's reaction to the sample (the gate). Design only: nothing is built until 5h is merged into main. The director's words are in `intent.md`, the brief in `kickoff.md`, and what the content has today in `gap-map.md`. 5h's design, which this builds on, is on branch `ccr-9cf44321-t2g2o5` (`steps/05-core-set/5h-roster/design.md`).

## What needs you

1. **React to the sample** (section 4): 8 pieces of gear, 4 formations, 6 ability branch pairs and 2 passive pairs, each with the synergy or gap it's for. Keep, cut, push, resize. I'll apply what you say to the whole set.
2. **Seven answers**, each with my recommendation:
   - **Formation rarities:** three. Common is seats only, rare adds one party effect, legendary is a rule that changes how every ally fights.
   - **Effects on common and uncommon gear:** no. They double down on numbers, including new *potency* affixes ("Burn +50%"). Rules start at rare.
   - **What rarity means:** how specific a piece is, not how big. No random affixes on rare or legendary pieces (a challenge to 5d, section 7).
   - **The core set's 14 powerful pieces:** they become rares. They're trades, and 5d priced them below ordinary pieces.
   - **Slot rules:** no change. The problem is where the rules were put: 17 of the 29 rogue rules are amulets, and light armor has none. New rules go mostly to weapons and armor.
   - **Branch picks:** locked for the run. That matches your 5h note about re-recruiting a unit "that you want to pick a different upgrade for".
   - **Engine:** the sample needs five small engine additions, and the full set about four more (section 3.10). Past passes changed numbers, not the engine; this one can't fill its empty cells without new hooks. Are they OK?

## 1. The idea

A build is an **engine**: enablers spread across the party feed a payoff on the unit or piece that cashes them in. Your Chill run worked because the shatter pays off anyone's Chill, so two classes that never apply Chill could feed the Frostweaver. The map shows that's the exception. Most statuses have enablers on three or four classes and a payoff on one, or none. Whole families of triggers have nothing listening: a dodge, a heal given, a Shield breaking, a revive, the party's own casts. And the answers to threats sit on one class each.

So the step does three things:
- puts **payoffs** where only enablers are;
- spreads **enablers** to classes that don't have them;
- moves **answers** onto gear, where a player can swap them in after seeing the preview.

Each fill goes in one of three grains, chosen on purpose: a **branch** (one class can join a build), a **piece of gear** (anyone who wears it), a **formation** (the whole party plays this way).

## 2. The builds worth having

Picked from the mechanics the game has and the roguelites that make builds worth replaying. These are what the content is for; the gap map says what stops each today.

| Build | The engine | Today | What this step adds | Like |
| --- | --- | --- | --- | --- |
| **Deep freeze** | Chill from anyone, cashed in by the shatter | The best-covered row | Ways in for more classes (branches), shatters that spread, Frost line | Your Chill run; Hades' status curses |
| **Wildfire** | Burn from anyone, spread across a field, cashed in by Pyre | Payoffs on the Pyromancer only | A Burn payoff for anyone (Tinderbox), Pyre on every foe | Slay the Spire's poison; Diablo's on-death explosions |
| **Storm** | Shock that pays something beyond its own tick | No payoff at all | Shock turned into MP (Lodestone robes), a Shock payoff for fighters | The Bazaar's items that charge each other |
| **Open wounds** | Bleed on a foe, then many hits | One payoff (Hunter's bow) | A Bleed payoff and Bleed on more foes; more hits (branches) | Slay the Spire's shivs |
| **Blur** | Basic-attack riders × speed | Rich (seven passives, eleven rogue pieces) | Riders across every foe (Volley bow), Choir | Your Chill run; TFT's attack-speed items |
| **Punish** | Draw the hits, punish the hitter | Thorns on one class; dodges pay nothing | Taunt for anyone (Challenger's horn), a dodge that strikes back (Fencer's coat) | Slay the Spire's Thorns; Hades' deflect |
| **Stoneguard** | Shield, Guard and Armor turned into damage | One payoff (Bedrock); Guard never reaches the Armor scalers | Knight and Hoplite branches, a Shield affix | Slay the Spire's Body Slam and Juggernaut |
| **The hunt** | Focus the weakest, get paid for the kill | Backstab and three kill pieces | Hunting party; kills that spread Burn | Vampire Survivors, Hades |
| **Malice** | Many *kinds* of curse on one foe | Nothing reads it | Curse ring; Hexer and Bard branches | Balatro's jokers that reward a mix; TFT's traits |
| **Spellcraft** | Casting, with MP as the run's resource (5h) | No piece reacts to a cast | Casts that buff the party (the War banner reworked), Shock into MP, cost and wind-up branches | Slay the Spire's Panache; Diablo's skill-changing legendaries |
| **Rotation** | The bench (5h) | Nothing reads it | Fresh legs; pieces that know the bench | Darkest Dungeon's roster |
| **Last stand** | A unit that falls and comes back | Two formations react to a knockout; nothing to a revive | Revive branches; Last stand and Escort pushed | Hades' Death Defiance; Monster Train's sacrifice |

**Answers, not builds:** Seek, Dispel, Cleanse, anti-heal (Rot), Ward, and physical reach across a swarm. These go on rare gear, because the preview shows the threat and swaps are free outside fights.

**Set aside, and why:**
- **Clarity's ticks:** your example of a strange synergy.
- **Accuracy:** one foe dodges.
- **Slow:** Chill does its job.
- **Physical subtypes:** a tag with one reader.
- **Aegis:** the Hoplite's signature.
- **Weaken and resistances:** defensive.
- **Elements apart from their statuses:** the preview's answer, chosen by staff.
- **Low-HP builds** (Berserker's torc, Bloodlust, Last rites): with HP carried between fights, a build that stays low dies, so they stay in the class kits.

## 3. The rules the content is generated by

### 3.1 Grains

- **Branch:** "this class should be able to join that build". Example: Frost fist lets the Monk lay Chill.
- **Gear:** "anyone can carry this", and every answer.
- **Formation:** "the whole party plays this way".
- **One cell, one grain.** Two grains are allowed only when they do different jobs, for example the enabler as a branch and the payoff as gear. Never three.

### 3.2 Gear rarity: how specific, not how big

| Rarity | What it is | Today |
| --- | --- | --- |
| **Common** | A stat bundle: today's 46 named pieces and 13 plain weapons, as written | The same |
| **Uncommon** | A bundle plus one affix: a stat (today's 20), or a *potency* (new) | One stat affix |
| **Rare** | A small rule: an enabler or an answer, on a lighter bundle. Or a trade: the core set's 14 powerful pieces | Two stat affixes |
| **Legendary** | A payoff or a rule-bender, aimed at two to four classes, with at most one stat step | A rule plus two stat affixes |

- **Potency affixes** (new, uncommon): "Burn +50%: its Burn applications add half again as many stacks." There's one for each stacking status a player builds on: Burn, Chill, Shock, Bleed, Sunder, Might (the Might it gives), Shield (the Shields it gives). They're the "stats to double down on": dead on a unit that doesn't apply that status, big on one that does. They read as a number, so they add little load. The engine already does this: an applier's boost that names a status raises the stacks it adds, and nothing else.
- **No random affixes on rare or legendary pieces.** A rule is the point. Random stats on top are what make the highest rarity always the pick, which works against switching.
- **One mechanic per rarity.** A rare and a legendary never do the same thing at two sizes.
- **A legendary card says who it's FOR** (classes, as `aims` today) **and what it FEEDS ON** (new: its partners, as statuses, pieces or stats). The pricing in stage 3 uses both.

### 3.3 Formation rarity

| Rarity | What it is | Today's nine |
| --- | --- | --- |
| **Common** | Seats only: stats, Aggro, and now a seat's own status ("starts each fight Guarded"). No party effect | Vanguard, Tortoise, Scatter, Ambush, Champion |
| **Rare** | Seats plus one party effect on a trigger | Blitz, Caravan, Last stand, Escort |
| **Legendary** | A rule that changes how every ally fights: what it aims at, how it swings, what its hits carry | none yet: Frost line, Hunting party, Choir, Siege, Curse ring |

The old limits are lifted, as you said: any effect, any status (Taunt included), seats with their own statuses. The one rule kept is phrasing (3.6).

### 3.4 Strong in the right party, not everywhere

- Every build piece names its partners. In stage 3 it's priced twice, with the hand-built parties: once with its partners, once with them swapped for ordinary pieces.
- **The target is a big gap, not a big average.** With its partners it should beat the best rare of its slot. Without them, it should lose to a common bundle.
- Pieces strong everywhere get a condition or move. The fight's-start party buffs are the main case: the Herald's horn (sample) and the War banner (3.9).

### 3.5 Branches

- **Every ability and every passive gets two branches.** At a training, the player picks one of the two; the other closes for the run. The screen is 5h's nested one: member → ability or passive → its two branches. A branch replaces today's single "+" upgrade.
- **Each branch is one short difference from the base,** with a one-word tag on its card (Shield bash: HEAVY or TIMED).
- **A is more of the same; B is something new.** A is a size, tempo or cost step: about 40% more of what it deals, heals or stacks; or one word shorter on cooldown or wind-up; or one MP rung cheaper; or one more hit. B is a behaviour, access or targeting change: a status the class lacks, a new target phrase, a trigger, Seek, every foe.
- **B points at a build.** On an enabler, B feeds another class's payoff. On a payoff, B accepts another class's enabler.
- **Where step 5g asked "which shape?", both shapes become the branches.** The open questions in `5g-feel/handoff-round-10.md` (Unmake, Thunder chord, Rockfall, Shield bash, Blood gift) each have two good answers, so the player picks.
- **Numbers:** B is worth about what A is, in the class's own intended party.

### 3.6 Phrasing and load

- Every effect is written in the rules document's words and target phrases, word for word.
- Sizes are words (a few, several, many; light, normal, heavy; a third, half), never raw numbers.
- One sentence. If a piece needs two, it's two pieces.
- A card leads with what changes for this unit, then FOR and FEEDS ON.
- No new status words. Every effect is built from the 22 statuses, 7 special stats and 6 effects.

### 3.7 Numbers

- Sizes come from `scale.ts`'s words, so balance mostly holds, as you said.
- Potency: +50% (a stack word is +86%). Branch A: +40% (today's upgrade). Seat steps: 5g's.
- Enemies get harder at the end, by the knobs on the hand-built parties (5h's tools).

### 3.8 Slots

- **No slot rule changes.** Three slots, amulets for anyone, armor by heaviest weight.
- **New rules go mostly on weapons and armor,** light armor first. A unit can then hold up to three rules, and the casters' armor slot carries one.
- **Amulets get the rules that don't depend on the wearer's own hits** (Tinderbox, the War banner reworked). That way a support's amulet seat is worth filling.

### 3.9 What happens to today's pieces

- **The 29 rogue rules stay,** each given its partners. Measured with and without partners in stage 3, the ones strong everywhere get a condition:
  - **Herald's horn:** its heals give Regen (sample).
  - **War banner:** "Each ability its wearer casts gives every ally a Might." That moves a fight-start buff into the empty casting row.
  - **Grave lantern and Soul jar:** a candidate condition is "foes the wearer finishes", if they stay strong everywhere.
- **The 14 powerful pieces become rares,** their numbers unchanged (free play shares them).
  - **Thirsting jewel:** its MP regen −1 means nothing under 5h, so its drawback becomes "on the bench, recovers half as much MP".
- **MP pieces need nothing new.** Under 5h, MP regen gear is a fighter's way to last another fight, and Siphon, Clarity, Refrain and the Soul jar are the support path. Their step sizes are 5h's tuning.

### 3.10 Engine additions

Each is small and bumps the schema and `ENGINE_VERSION`.

| For | Addition |
| --- | --- |
| Tinderbox | A reaction reads the fallen unit's stacks |
| Volley bow | A weapon whose basic attack hits every foe |
| Herald's horn | An event for giving a heal (the healer's side of being healed) |
| Curse ring | A condition counting a unit's kinds of debuff |
| Fresh legs | A condition for "sat out the last fight" (the rogue sets it; the engine reads it) |
| Hunting party (set) | A status that changes its holder's default pick |
| Choir (set) | A reaction that ignores statuses other reactions gave, so it can't loop |
| Nullstone's fallback (set) | A cooldown on a reaction |
| Branches (set) | Two branch ids per ability and per passive, in the schema and the pack |

Everything else in the sample is expressible today. That includes the potency affixes, Challenger's horn, Fencer's coat (a reaction to a dodge) and Lodestone robes (a reaction to a foe's Shock damage).

## 4. The sample

What I'd build: the synergies I think are strongest, and the ones I'm least sure of. Each item names its build or gap (section 2, `gap-map.md`).

### 4.1 Gear

**1. Potency affixes** · uncommon · on any common base
> *Smouldering Fang:* Attack +2. Burn +50%: its Burn applications add half again as many stacks.
- **For:** the stat to double down on, for every build that stacks a status.
- **Feeds on:** the classes and pieces that apply that status. **Without them:** nothing. So it competes with a stat affix, and the player chooses.
- **Sure.** It works today. The family: Smouldering (Burn), Biting (Chill), Charged (Shock), Barbed (Bleed), Rending (Sunder), Rousing (Might given), Bastioned (Shields given).

**2. Challenger's horn** · rare · amulet
> Taunts for the first 20 ticks of each fight.
- **For:** Punish. It gives Taunt to someone other than the two walls, and it covers the opening (5d: squishies killed in a boss's first seconds, before any Taunt).
- **Feeds on:** Evasion, Thorns, Guard, the when-hit pieces, a healer. **Without them:** it pulls the opening's hits onto whoever wears it, which on a caster is a liability.
- **Sure.**

**3. Nullstone** · rare · amulet
> Each hit of its abilities strips one buff from the foe.
- **For:** an answer. Dispel sits on the Hexer alone, and the bosses' behaviours are buffs: Kindle and Tolling, plus the helpers' Cheer, Take aim, Brace and Dark ward.
- **Feeds on:** nothing; it's swapped in after the preview. It works against the Paladin's Judgement.
- **Least sure.** A multi-hit (Gale spear) strips three buffs a cast. The Fire Giant's Inferno waits until it has Might, so with enough strips it may never come. Fallback: one strip every 15 ticks.

**4. Fencer's coat** · legendary · medium armor (eleven classes)
> When it dodges a hit, it strikes the attacker back: physical damage that scales from its Attack.
- **For:** Punish. It's the first payoff for a dodge, and it turns Evasion's old trap (Evasion cancels Thorns) into a Thorns of its own.
- **Size:** a normal hit (half its Attack). It isn't a hit, so it carries no riders, no Bleed and no Lifesteal.
- **Feeds on:** Evasion (the Monk high, the Assassin medium; Tiger claws, Mist claws, Scout leathers, Feather charm, the Nimble affix, Scatter's Decoy), and something that sends hits its way (Challenger's horn, Warhorn, the Decoy). **Without Evasion:** nothing.
- **Sure.** It shares a slot with the Wraith leathers, so the two are a choice.

**5. Tinderbox** · legendary · amulet
> When a burning foe falls, half its Burn spreads to every other foe.
- **For:** Wildfire. It's the first Burn payoff off the Pyromancer, and the fire party's answer to swarms.
- **Feeds on:** any Burn (the Pyromancer, Burning fist, Smite, Malison, the Ember sigil, the Cinder rod, the Burn affix) and kills (Hunting party, Backstab, the Headsman's axe). It doesn't need its wearer's own hits, so it's a support's amulet. **Without Burn:** nothing.
- **Unsure of the size.** In an eight-wisp fight, each death spreads to seven. Burn loses 15% a pulse, so a cascade fades, but half may be too much.

**6. Lodestone robes** · legendary · light armor (anyone)
> Whenever a foe takes Shock damage, its wearer regains MP: a tenth of the damage.
- **For:** Storm. It's Shock's first payoff and the first rule on light armor, and it ties in to 5h: a caster that refuels from a Shock party instead of from the bench.
- **Feeds on:** Shock (the Stormcaller, Valkyrie, Thunder chord, Malison, Static coil, Storm edge) and many or fast foes. **Without Shock:** nothing.
- **Unsure.** In a swarm it may refill a pool every fight and take the Stormcaller out of the bench rotation. Against a lone boss it gives little.

**7. Volley bow** · legendary · bow (Ranger, Bard)
> Its basic attacks hit every foe, each for a third of the damage.
- **For:** physical Area, which is empty, and Blur. It's the most transforming piece: every rider on the wearer's swing lands on every foe.
- **Feeds on:** basic-attack riders (the Ember, Rime and Shatter sigils; the Bard's Refrain; the potency affixes) and swarms. **Without riders, against a lone boss:** a third of a bow.
- **Least sure.** With the Rime sigil, every swing adds several Chill to every foe, so shatters run across the field every few swings: your "exploding everywhere". Fallback: riders land on the first foe only, or a fifth of the damage.

**8. Herald's horn, reworked** · legendary · amulet
> Was: "When the fight starts, every ally gains Regen." Now: its heals also give Regen.
- **For:** moving the strongest strong-everywhere piece to a condition (5d: +19 points against an ordinary piece, the most of any rule: the jackpot). It's also the first payoff for giving a heal.
- **Feeds on:** a healer: the Cleric (Cure, Renew), the Valkyrie (Rally), the Paladin (Absolve), the Bard (Refrain: every landed swing heals someone), the Vampire (Blood gift). Lifesteal doesn't count. **Without a heal:** nothing.
- **Sure of the direction, unsure of the Bard.** Refrain's constant small heals would keep Regen on the whole party.

### 4.2 Formations

**1. Vanguard, pushed** · common

| Seat | Changes |
| --- | --- |
| Wall | Aggro +2, Armor +1, starts each fight Guarded (new) |
| Behind (two) | Aggro −1 |

- **Shows:** the common tier (seats only) and a seat's own status.
- **For:** the starters' first formation and the opening, with the wall Guarded while the first hits land. With an Armor scaler at the Wall, it's Stoneguard: a Geomancer's Rockfall and Earthen shell, a Bramble knight's Briar.
- **Sure.**

**2. Fresh legs** · rare

| Seat | Changes |
| --- | --- |
| Point | Aggro +1, HP +1 |
| Flank (two) | Attack +1, Magic +1 |

**Effect:** an ally who sat out the last fight starts this one with its abilities ready.

- **Shows:** the rare tier (small seats, one party effect).
- **For:** Rotation. Nothing reads the bench today, and this makes rotating a build, not a chore.
- **Feeds on:** a bench of two or more, and long cooldowns worth having at the first tick (Raise, Valhalla, Pyre, Tremor, Allegro, Sanctuary). **Without rotation:** its seats only.
- **Unsure.** It may make rotating every fight the obvious play. 5h's MP economy is what keeps a unit from staying out.

**3. Curse ring** · legendary

**Seats:** none change. **Effect:** every ally's hits deal 25% more to a foe with three or more kinds of debuff.

- **Shows:** the legendary tier, a rule that changes what the party is trying to do: many kinds of curse, not many stacks of one.
- **For:** Malice. The Hexer and the Bard stop being passengers (5e: a buff or a curse on one unit in a party of three is worth less than a body). Weaken, Silence and Stun, which pay nothing today, count toward it.
- **Feeds on:** two or three different appliers. The Hexer alone puts Burn and Shock on every foe, plus Chill, Weaken and Sunder on its targets; the Ranger alone brings Bleed, Chill and Sunder. **Without them:** a party built on one status rarely reaches three kinds.
- **Unsure.** Is three the right bar, and is it too easy with a Hexer?

**4. Siege** · legendary

**Seats:** none change. **Effect:** every ally's basic attacks come half as often and deal double damage.

- **For:** a formation that changes how every ally fights: the Hoplite's Phalanx for the whole party.
  - Big, slow swings lose less to Armor (the formula takes 22% to 41% off the party's hits today).
  - Might is spent per action, so each stack is worth twice as much damage.
- **Feeds on:** Might (War ballad, Frenzy, Last stand), crit damage, and armored foes (the Crypt's Skeletons, Shieldmen, Ice Golems). **Against it:** basic-attack riders and Bleed, which get half as many hits. Refrain is unchanged, since it's a share of the damage.
- **Unsure.**
  - It may be a plain gain for any physical party, since every foe has Armor. If so, it needs a seat cost.
  - A Hoplite in Siege swings a third as often for triple damage: 5g's "statue".

**In the set, not sampled** (you called them very strong): Frost line (every ally's basic attacks add a Chill; Magic −1 in every seat), Hunting party (every ally's random single-target picks go to the foe with the lowest HP), Choir (when an ally gains Haste or Might, every other ally gains a little).

### 4.3 Ability branches

The Knight in full (three abilities and its passive), then three abilities from other classes. Each line is the difference from the base.

**Knight: Fortify** (Guards the ally with the lowest share of HP; long cooldown, 325 MP)
- **A · STEADY:** a medium cooldown (30 ticks, was 40).
- **B · RAMPART:** Guards every ally, for half as long.
- *For:* Stoneguard. B puts Guard on the Armor scalers (the Geomancer, the Bramble knight, the Cornerstone axe, the Templar staff, the Spiked bulwark), and on everyone against a swarm's many small hits.

**Knight: Stand fast** (Taunts, and gives Clarity to the ally with the least MP among those under half; medium cooldown, 200 MP)
- **A · HOLD:** Taunts for 30 ticks (was 20).
- **B · SUPPLY:** Clarity to every ally under half MP (was one).
- *For:* the choice 5h creates: a wall's uptime, or the support path for MP.
- *Unsure:* B may undercut the bench.

**Knight: Shield bash** (bashes a foe, scaling from max HP, and Stuns it; medium cooldown, 325 MP)
- **A · HEAVY:** also scales from its Shield.
- **B · TIMED:** waits for a foe's wind-up, and bashes the casting foe.
- *For:* 5g's question (control or damage), as the player's choice.
  - A is Stoneguard: the first thing that turns a Shield into damage, fed by Vanguard, Earthen shell, Escort and the Shield affix.
  - B is your own example. A Stun holds a wind-up, so it stops an Inferno or a Lich's spell in the casting.

**Hexer: Unmake** (Silences the casting foe with the highest Attack or Magic and strips its buffs; waits for a foe to cast; medium cooldown, 650 MP)
- **A · QUICK:** a short cooldown (22 ticks, was 30); it still waits.
- **B · UNBIND:** doesn't wait for a cast: goes to a random foe with a buff.
- *For:* 5g's question (a rare, decisive counter, or a regular strip; it fires 0.18 times a fight), as a choice.
- *Unsure:* B has the same lock check as the Nullstone.

**Pyromancer: Pyre** (heavy Fire on the foe with the most Burn, rising with each stack; long cooldown, very long wind-up, 1,500 MP)
- **A · QUICK:** a long wind-up (6 ticks, was 8).
- **B · WILDFIRE:** hits every foe, half as hard each, still rising with each foe's own Burn.
- *For:*
  - A answers the third slots that never fire (5e and 5f: Pyre 0.11 to 0.6 casts a fight).
  - B is Wildfire's payoff for Burn spread across a field, fed by the Tinderbox, Fireball and Malison.

**Monk: Burning fist** (three quick Fire hits on the foe with the most Burn, each adding a few Burn; quick cooldown, 200 MP)
- **A · FLURRY:** four hits (was three).
- **B · FROST FIST:** Ice, at the foe with the most Chill, adding a few Chill instead.
- *For:*
  - B is your wish for "chill on a bunch of different units" by ability choice: the Monk joins a Frost party without the Rime sigil, which frees its amulet.
  - A is Open wounds: each hit opens Bleed.

### 4.4 Passive branches

**Knight: Vanguard** (starts every fight behind a Shield, a fifth of its max HP)
- **A · THICK:** a third of its max HP.
- **B · COVER:** the other ally with the lowest share of HP starts behind a Shield too, half as big.
- *For:* B covers the opening and puts Shields on allies, which are thin today. It also turns Bedrock and the Stone idol on for someone else.

**Frostweaver: Shatterpoint** (when a foe's Chill shatters, it takes several Sunder)
- **A · DEEP:** many Sunder (was several).
- **B · CHAIN:** a shatter also adds a few Chill to every other foe.
- *For:* B is Deep freeze's swarm answer: shatters that cascade.
- *Least sure:* chains. Each shatter spends that foe's Chill, so a chain ends.

### 4.5 A few more, for range (not sampled)

| Ability | A | B |
| --- | --- | --- |
| Bard: Thunder chord | QUICK: a quick cooldown, a few Shock (5g's question) | HYMN: also lifts one debuff from every ally (Cleanse off the healers) |
| Geomancer: Rockfall | PEBBLE: a quick wind-up (5g's question) | SLIDE: hits every foe for a third |
| Vampire: Blood gift | TITHE: costs a tenth of max HP, heals as much, a quick cooldown | PACT: costs a third, heals twice as much (5g's question) |
| Valkyrie: Gale spear | four hits | adds a few Bleed in place of Shock |
| Hoplite: Spear thrust | a normal wind-up | scales from Armor (the Hoplite's Armor 5 feeds nothing today) |
| Cleric: Raise | a long cooldown | the raised ally rises Hasted (a payoff for a revive) |

## 5. The full set, in outline

| Content | Today | After |
| --- | --- | --- |
| Common gear | 46 named, 13 plain | The same |
| Uncommon affixes | 20 stat affixes | + 7 potency affixes |
| Rare gear | Two stat affixes on a common | The 14 powerful pieces as trades + about 20 new small rules (enablers and answers) |
| Legendary gear | 43 (14 powerful + 29 rogue) | 29 rogue rules kept, about 6 reworked + about 25 new payoffs and rule-benders = about 54 |
| Formations | 10 | About 20: 7 common, 7 rare, 6 legendary |
| Branches | One "+" per ability | 64 pairs: 48 abilities, 16 passives |

A run in 5h's plan sees about 25 legendaries, about half of this pool, so runs differ.

## 6. Intent map

| Your item | | |
| --- | --- | --- |
| No control in fights | used | Everything here works through the build |
| No limits on the type of effect; phrase them clearly | used | Seat statuses, Taunt in formations, rules on gear; one rule kept, phrasing (3.6) |
| Map the gaps and fill them | used | `gap-map.md` |
| Not only legendaries: stats to double down on, functional effects, varied ordinary pieces, careful of load | used, bent | Potency affixes are the stats to double down on; rares carry the functional effects. Bent: commons and uncommons carry no rules, for load |
| "I'm okay if it's all legendaries" | set aside | Answers and enablers belong on rares, which a run sees more of |
| Formations more themed, bespoke effects, control | used | The legendary tier changes how allies fight |
| Two or three formation rarities | used | Three |
| Customizable formations one day | set aside | Your word |
| Two branches to pick from, everywhere; passives too; small changes | used | 64 pairs, one short difference each |
| A branch can give a class a status or role it lacks | used | Frost fist, Hymn, Rampart, Cover |
| The gate is a sample | used | Section 4 |
| Numbers in today's ranges; enemies harder at the end | used | 3.7; the knobs in stage 3 |
| The rogue mode only | used | |
| Hand-built parties, not whole runs | used | Stage 3 |
| Gear "that kind of transforms what you're doing" | used | Volley bow, Fencer's coat, the reworked Herald's horn |
| A lot of the gear is "really, really overpowered" | used | Priced with and without partners; fight-start buffs given conditions |
| "A bunch of synergies like that" | used | Twelve builds, section 2 |
| Frost line, Hunting party, Choir, Fresh legs | used | Fresh legs sampled; the three others in the set |
| Not synergies off Clarity's ticks; no quotas | used | What I chose and why, section 2 |
| The full mechanics list (note 10) | used | Every row is in the map |
| Potions, the Hourglass, six abilities | set aside | Your word |

## 7. Challenges

1. **No random affixes on rare and legendary pieces** (a 5d decision). 5d gave legendaries two affixes because, on average, their rules were worth less than an ordinary piece. The design changes what "worth" means: a big gap with partners, not a big average. Random stats on top make the highest rarity the pick whatever the build. The risk: an off-build legendary looks weak on the card. That's the choice working.
2. **Fight-start party buffs get conditions** (the Herald's horn, the War banner). They're the wrong kind of strong. A buff for the whole party at the start belongs to a formation, where two already exist (Blitz, Caravan).
3. **Engine additions** (3.10). Past passes kept the engine fixed. Empty cells (a dodge, a heal given, the bench, the fallen foe's stacks) can't be filled from content alone.
4. **Commons and uncommons stay numbers,** though you allowed effects anywhere. The volume 5h plans (about 80 pieces seen a run) makes load the risk. A rule on every common would be dozens more rules a run to read.
5. **Siege may be a plain gain for any physical party.** The Armor formula rewards big hits everywhere. If pricing says so, it gets a seat cost.

## 8. Predictions (checked in stage 3)

1. Each sampled build piece, in a hand-built party with its partners, beats the best rare of its slot. In the same party without them, it loses to a common bundle.
2. No piece is in the top quarter both with and without its partners.
3. Each build in section 2 has a hand-built party per act that wins at the act's target using that build's pieces. The same party with ordinary pieces in their place does clearly worse.
4. For each branch pair, in its class's best parties, neither branch is worth more than about twice the other. B is the better pick in at least a third of the parties.
5. No cascade (the Volley bow with a sigil, the Tinderbox, Shatterpoint's chain) ends a regular fight before its foes act twice. Fights stay in 5g's length range.
6. The Fire Giant still casts Inferno with the Nullstone or Unbind in the party.
7. A party in Fresh legs uses its bench more than the same party in Neutral (5h's act-sequence tool).
8. A feel reader can name, from a fight's log, which piece or branch made each big number.

## 9. Open questions

1. The seven answers at the top.
2. **Volley bow:** riders on every foe (explosive), or on the first only (safe)? This is a feel fork, so it's yours.
3. **Fresh legs and 5h's half-charged fresh abilities:** keep both, or does Fresh legs replace the half charge on the bench?
4. **Where branches come from:** 5h's training sources as they are, or should a Drill ground offer a branch on a member that already has its other one, at a price (a respec)? I'd say no for now.

## 10. Next

Your reactions to the sample. Then I apply them to the whole set, still as design, with a second sample if the rules changed. The build waits for 5h to merge into main (kickoff, order of work).
