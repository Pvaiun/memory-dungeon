# Step 5h round 6, batch 3: the map, the campfire and where training lives

**Approved by the director (Oct 29, 2026: "I 100% agree with your plan for batch 3. Go ahead.") and built as written**, all five open items included, with one change from their reply: elites give a pick of legendaries and then a pick of formations (section 2's elite row). What the build measured is in `report.md` (round 6) and `tuning.md`.

The director's words are in `intent.md` (the fourth round and their reactions). The map's direction was approved first: longer acts, the Muster folded into captives, rooms by Slay the Spire's logic, enemies as strong as now. Numbers are first values, tuned on the hand-built rosters.

## What needs you

1. **The campfire** (section 3). Every campfire heals the whole roster a share, MP too, and raises the fallen, by itself. Then one choice of two: **REST** (the same again) or **TRAIN** (three members learn or improve). Campfires are guaranteed only before the boss; elsewhere about two a map, on a third of paths.
2. **Fold the Drill ground** (section 4). Training comes from:
   - the campfire's TRAIN;
   - the act's level-up;
   - the shop;
   - events;
   - and a new **lesson**: any recruit you turn down (a captive, the stranger, a recruit event) can teach one member something instead.

   My pick. The alternative is keeping the Drill ground as a training room, but it would be the kind of fixed-reward room your point 26 calls a dead spot.
3. **Run length.** A run goes from about 11.5 fights to about 19, bosses included. If that's too long on a phone, 11 floors gives about 17.
4. **Two new pick shapes** (section 7), in the 15% of spoils that mix kinds: a *sealed piece* (an unknown reward) and a *bundle*. In or out?
5. **The event sample** (section 6): keep, cut or change.

## 1. The map

| | Now | Proposed |
| --- | --- | --- |
| Floors | 9 | 12 |
| Fixed floors | 1 a fight, 5 the chest, 9 a campfire | 1 a fight, 7 the chest, 12 a campfire (before the boss) |
| Room odds | fight 40, event 20, elite 12, campfire 11, shop 7, Muster 5, Drill 5 | fight 50, event 27, elite 11, campfire 6, shop 4 |
| At least, a map | 2 shops, 2 elites, 2 Musters, 2 Drill grounds | 2 shops, 2 elites, 2 campfires |
| Every path passes a mid-act campfire | yes | no |
| Elites and campfires from | floor 4 | floor 5 |
| Packs can grow from | floor 6 | floor 8 |

Measured on the generator (1,500 maps), each path has:

| Per path | Now (9 rooms) | Proposed (12 rooms) |
| --- | --- | --- |
| Regular fights | 2.1 | 4.9 |
| Elites | 0.7 | 0.9 |
| Events | 1.2 | 3.1 |
| Campfires (with the last) | 1.9 | 1.4 (a mid-act one on a third of paths) |
| Shops | 0.7 | 0.8 |
| Musters and Drill grounds | 1.4 | 0 |
| Paths with 3 or fewer fights and elites | 75% | 6% |

**Enemies as strong as now.** Each fight keeps its own knob. The act's climb is stretched over 12 floors, so the top floor is as hard as floor 9 is today. The regular fights' reference floor moves from 5 to 7, and the climb per floor from 6 points to 4.5.

## 2. What's found where

Slay the Spire's logic, as you laid it out: gear (its cards) and supplies (its potions) everywhere; legendaries and formations (its relics) from elites, chests and bosses; events as the grab bag; the shop as the cornucopia.

| Room | Gives |
| --- | --- |
| **Fight** | Gold; a potion or a tonic; a pick of three pieces (sometimes mixed). Against people, sometimes a **captive** (section 5). |
| **Elite** | Gold; a potion or a tonic; a pick of three legendaries (one aimed at the party), then a pick of two formations (the director's, after batch 2). |
| **Chest** | A legendary, a rare, or a caged recruit with a piece. |
| **Event** | The grab bag: recruits, formations, lessons, raising a piece's rarity, risk against reward, a fight for a prize. A bigger bucket (section 6). |
| **Shop** | Everything: gear (two legendaries from act II), a recruit, a formation, all three supplies, training. |
| **Campfire** | A share of HP and MP for everyone and the fallen up; then REST or TRAIN (section 3). The stranger, sometimes. |
| **Boss** | The boon: a legendary, a formation or a recruit. A seat at camp comes with the next act. |

**To hold a run's totals with twice the fights:**
- Gold for a regular fight goes from 12–20 to 7–12. Gold an act comes out about a quarter more than now.
- A regular fight's pieces go from 13% legendary to 6%. Legendaries offered a run stay about where batch 2 left them.

## 3. The campfire

Your diagnosis: four options, three of them sustain, RAISE often forced, so TRAIN was never possible. Slay the Spire's campfire works because it's one choice between getting stronger and staying alive.

- **When you arrive, by itself:**
  - everyone in the roster, party and camp, recovers **25% of max HP and 25% of max MP**;
  - every fallen member rises at **25% HP**.
- **Then one choice of two:**
  - **REST:** everyone recovers the same again (50% HP and MP in all).
  - **TRAIN:** **three members** each learn an ability or improve one.
- **The stranger at the fire** stays at 30% of campfires: take them in, turn them away for a lesson (section 4), or neither. Either way it doesn't use the choice.
- **Where they are:** guaranteed before the boss; elsewhere about two a map from floor 5. About a third of paths pass one mid-act, so routing to one is a choice.
- **The Empty Camp event** still makes camp.

Why these numbers: today REST gives the party 40% HP (the camp half that) and FOCUS 60% MP, one or the other. The free share is a little over half of one of today's picks, given to everyone, MP as well as HP, plus the raise, so a party that arrives tired can still afford TRAIN. A low party will still rest. They'll be tuned on the act road (the stated rotation and supply rules; `src/rogue-acts.ts`) so regular fights lost in an act stay where they are, with fewer campfires and more fights.

## 4. Where training lives

You didn't want the campfire as the training ground unless it became a simpler choice. It is now (two options), but it shouldn't be the only place either. With the Drill ground folded:

| Source | How |
| --- | --- |
| Campfire | TRAIN, three members (against REST) |
| A new act | Everyone learns or improves one (as now) |
| Shop | Repeatable, dearer each time (as now) |
| **A lesson** (new) | Any recruit you turn down can teach one member instead: the captives, the stranger at the fire, the Wounded Traveller, the Deserter. The recruit is always useful, even with a full roster or the wrong class. |
| Events | The Old Master and the Training Hall, plus two in the sample below |
| Tomes | In the 15% of spoils that mix kinds |

A lesson is the current verb: one member learns an ability or improves one, chosen on the nested screen.

## 5. Recruits as captives

- **People hold captives:** bandits, archers, shieldmen, the miners, witches, and the act III guards and snipers. Beasts, the undead and elementals don't.
- **The odds:** after a won fight with people in it, a captive 20% of the time, never two fights in a row. Shown after the spoils, on top of them:
  - **TAKE THEM IN** (knowing what they roll, at half HP);
  - **A LESSON** (one member learns or improves; they leave);
  - **LET THEM GO**.
- **How often:** act I's road is mostly people, so a path there meets about one captive an act. That's your point 14: recruits come easiest early, free, on top of a reward. Acts II and III have fewer people, so recruits there come more from events, the shop, the boon, the cage and the stranger.
- **Also:** the Muster's one-of-two pick lives on in the Mercenaries event and the shop.

## 6. Events: a bigger bucket

A path meets about three events an act (was 1.2), about nine a run. With 16 events a run would see half of them, so about ten new ones, each to get two or three versions as the current six have. They lean on what you liked: a recruit carrying something, raising a piece's rarity, risk against reward. And on the shapes you named: an unknown reward, a bundle.

The sample (lines as they'd read; the versions come after your cut):

| Event | Options |
| --- | --- |
| **The Master Smith** | **TEMPER:** a piece gains a rarity, up to legendary. A rare is reforged into a legendary of its slot; that costs 120 gold, the lower steps 40. **SELL SCRAP:** +40 gold. Version: a drunk smith, free, half the time the piece cracks and is lost. |
| **A Prisoner Convoy** | **FREE ONE:** pick one of three prisoners, each carrying a piece; the guards attack (a fight). **BRIBE THE GUARDS:** 60 gold, pick one, no fight. **RIDE ON.** |
| **An Old Soldier** | **TAKE HIM IN:** a recruit knowing two. **A LESSON:** two members learn or improve; he stays by the road. |
| **Three Sealed Crates** | **OPEN ONE:** a piece of unknown rarity (one crate legendary, one rare, one common). Version: 30 gold to open a second. |
| **The Quartermaster's Wagon** | **BUY THE BUNDLE:** 50 gold, a formation and a tonic. **TAKE THE SPARE KIT:** a common piece and a potion. |
| **A Field Hospital** | **PAY 50:** everyone recovers 40% HP and the fallen rise at half. **HIRE THE MEDIC:** 80 gold, a recruit who heals or raises. |
| **The War Table** | **STUDY THE MAPS:** a rare formation; everyone loses 10% of MP (a long night). **SELL THE MAPS:** +50 gold. |
| **A Duelling Ground** | **CHALLENGE THE CHAMPION:** an elite's fight; if won, a legendary and a formation. **WATCH:** one member learns or improves. |
| **The Abandoned Armoury** | **SEARCH:** two uncommon pieces. **SEARCH DEEPER:** three rare pieces, and something wakes (an elite's fight). |
| **A Mana Spring** | **BATHE:** everyone back to full MP; everyone loses 15% of max HP. **FILL A FLASK:** a tonic and 20 gold. |

Two new verbs:
- **temper up to legendary:** a rare reforged into a legendary of the same slot that fits its wearer;
- **a recruit pick where each carries a piece.**

Everything else uses verbs the events already have.

## 7. Two new pick shapes (your point 12), if you want them

In the 15% of fights and elites whose pick mixes kinds, two shapes join the tome and the formation:
- **A sealed piece:** the card shows its slot and "RARE OR BETTER", nothing else, until it's taken. An unknown reward.
- **A bundle:** a common piece and a potion or a tonic, together.

Risk against reward stays in events. In a pick after a fight it would mostly be a trap.

## 8. The first floors (from batch 2's check)

Batch 2 found the cliff: the regular fights that start on floor 3 lose 41% of random starts (the simulated player). They're tuned on act I's middle, while a real party there is still its first three with one ability each. The starting potion and tonic don't fix it (41% to 38%).

- **The easy pool runs floors 1 to 3** (was 1 and 2).
- **It's calibrated on random starts:** the rosters' classes, each knowing one random ability, many throws. Not on hand-picked first abilities, which pay two thirds of what a random start pays.
- **Act I's climb is measured, not guessed:** set so the regular fights on floor 4 cost what a regular fight should for a party a few rooms in (three or four members, mostly one ability, a common piece or two). The act's middle stays where it is.

This isn't a nerf to the first fight, which nobody loses. It's the step after it.

## Predictions (checked after the build)

- A path has 4 to 6 regular fights and about one elite. 3 or fewer on about 6% of paths. About three events.
- A run has about 19 fights, bosses included.
- Floor 3 to 4's regular fights lose about what any regular fight does against a start (a few percent for the simulated player), not 41%.
- On the act road, regular fights lost an act stay where they are now, with the new campfire and fewer of them. The bench still fights in about half the fights.
- Legendaries offered a run stay about where batch 2 left them. Gold an act rises about a quarter.
- TRAIN is picked at a real share of campfires on the road's stated rule (TRAIN when the party is over half HP and MP after the free share).

## The build, after your OK

1. Rules and content:
   - the map's numbers;
   - the campfire;
   - captives and lessons;
   - the Drill ground and the Muster removed as rooms;
   - the ten events, after your cut, with their versions;
   - the two shapes, if in;
   - gold and the fights' legendary share.
2. The interface: the campfire screen, the captive's card, lessons, the new events.
3. Tools and tuning:
   - the act road gets the new campfire;
   - the calibrator gets random starts for act I's easy pool and the measured climb;
   - every fight recalibrated on the new floors (about four minutes);
   - the act road and the first-floor check run again.
4. A short report against these predictions.
