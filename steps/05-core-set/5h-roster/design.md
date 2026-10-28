# Step 5h design: the roster

The director's words are in `intent.md`. This is the design for their OK before anything is built. The choices that are theirs are marked **Say if**, each with the designer's pick as the default. Gear, formations and upgrades are step 5i (`../5i-synergy/kickoff.md`). This step builds the structure they'll be found in and the training screen they'll fill.

## The idea in one line

Every fight's preview becomes a team pick from a roster of eight. Fighting costs MP and resting on the bench restores it, so the player rotates the party to keep everyone usable, unless they build around supports that feed MP. HP stays the danger: only campfires, potions and the act's start restore it.

## The design

### The roster and swaps

- **Party of three, bench of five: a roster of eight.** **Say if** you want six on the bench. Eight is half the classes, so a run sees most of what it could field, and a bigger roster means more menus before every fight.
- **The start:** the leader plus **three** drafted picks (one of three each), so the roster is four and someone sits out from the first fight. **Say if** two picks, as today.
- **Swaps any time outside a fight:** in or out, seats, formation, gear. Usually done on a fight's preview. The campfire's SWAP tab goes, since swapping is everywhere. A full roster sends someone home to take a recruit, any time.
- **The reserves rule is gone.** A wipe ends the run. The rule was there because swaps were campfire-only, so healthy members watched runs end from camp. With free swaps, that can't happen.
- **Benched units keep their cooldowns as they left them.** Cooldowns run only in fights, and they already carry between fights (5g). A unit that comes back from the bench "fresh" is a 5i formation idea (*Fresh legs*), so it isn't built in here. **Say if** the bench should reset cooldowns instead.

### MP: drained by fighting, restored by resting

- **No MP regen during fights.** Inside a fight, MP comes only from Clarity, the Bard's Refrain, Siphon, the Soul jar and other pieces. That's the support path.
- **After every fight, each benched member regains MP by its MP regen stat.** The stat stops meaning "a trickle in fights" and starts meaning "how fast it rests". Gear with MP regen keeps a job: a member that wears it can come back sooner. Fighters regain nothing between fights except from a tonic or FOCUS.
- **The targets** (tuned, not set by hand):
  - from a full pool, no class runs dry in a fight;
  - a caster can fight about two fights running, then needs one or two on the bench;
  - a wall can fight four to six running;
  - supports that feed MP stretch both.

  How much each fight drains, against how much a bench fight restores, decides how often a unit sits out. It has to match a roster of eight.
- **Challenge: I'd not raise every cost and pool together.** Raising both by the same factor changes nothing on its own; the absolute size is just what's printed, and NUMBERS rescales it anyway. In 385 fights from the feel tool, each class's gross spend a fight is already 15% to 50% of its pool (the Assassin 15%, the Ranger 23%, the Cleric 29%, the Knight 38%, the Stormcaller 45%, the Bard 51%). Pools already hold two to six fights of casting. What makes MP matter inside a fight today is that it's partly refilled during the fight and that casters arrive half-empty. The change that does the job is moving recovery onto the bench. I'd then tune pools and costs class by class, where a class's drain is off its target: casters fast, walls slow, as 5f set it. **Say if** you want the scale raised anyway, for how the numbers read.
- **Unchanged:** the tonic (half a pool for one member), the campfire's FOCUS, and the act's start restoring everyone. Free play loses in-fight regen too, since it's one rule in the pack.

### Recruits and formations: more of them, as rewards you route toward

Recruits and formations stay out of the fight spoils, which become gear, tomes and supplies only. That keeps them from being a choice after every fight. They become things you route toward, the way Hades shows each door's reward and Slay the Spire's map shows its shops:

- **Two new rooms on the map**, each act having two of each, never adjacent to another of its kind, not on floor 1:
  - **the Muster** (a recruit room): pick one of three recruits, or none;
  - **the Drill ground**: pick one of three formations, or TRAIN two members instead.
- **Other sources:**
  - the boss's boon (a legendary piece, a formation or a recruit, as today, but the recruit and formation at a higher rarity);
  - the shop (one recruit, one formation, as today);
  - a **stranger at the fire** at some campfires (one recruit, take it or leave it), as you suggested;
  - a **chest variant**: a cage, with a recruit and a piece of gear suited to it.
- **Recruit rarity is what it knows** (your idea):
  - a recruit arrives knowing **one, two or all three** of its abilities, drawn at random from its three, not always the first;
  - the card shows which;
  - the odds lean higher by act (mostly one in act I, two or three in act III).

  One guard: a recruit never arrives knowing only an ability that waits for a knockout (Raise, Valhalla), which would do nothing alone.
- **Formation rarity:** common, rare and legendary, in the rarity colours gear uses. Offers roll their rarity by act. The nine existing formations get provisional rarities here; 5i sets the final ones and adds new formations. With nine formations and four to six offered a run, a run would see most of them, so 5i's new formations matter.
- **More events, with variants.** Each event rolls one of two or three versions (another class, another rarity, another price), so a known event can still surprise. About six new ones around the roster:
  - a Deserter (a hurt recruit who brings their gear);
  - Mercenaries (pay gold for a pick of three);
  - a Prisoner Cart (fight the guards, free a recruit);
  - a Rival Company (trade a member of yours for one of theirs, sight unseen);
  - an Old Banner (a formation of a set rarity);
  - a Training Hall (two members train).

  The Drill Yard and the Fallen Standard fold into the Drill ground and the Old Banner.

### Training: more of it, in one nested screen

- **More chances to train, for a roster of eight:**
  - the Drill ground's TRAIN (two members);
  - the campfire's TRAIN, which now trains **two** members;
  - the act's level-up (every member learns or upgrades, or takes gold, as today);
  - the shop (repeatable, as today);
  - tomes in the spoils;
  - the Old Master and the Training Hall;
  - recruits arriving with more already known.
- **One nested screen**, used everywhere training happens: roster → member → its abilities, plus a passive row → that ability's upgrades. It's built with today's single upgrade. 5i fills in the second branch and the passive upgrades.

### The party screen

The three seats and formation on top, then the bench as a grid of faces with HP and MP bars, plus knocked-out marks. MP is the rotation's main information, so it's the bar that reads first. Tap to swap. It's reached from the fight preview's PARTY button and from the map.

## What's not in this step

Any control during a fight; new potion types; the Hourglass; six abilities per class; what the gear, formations and upgrades are (5i). The campaign is gone at your word, so the rogue mode is the only mode tuned.

## Intent map

| Your item | | |
| --- | --- | --- |
| Bench of 5 or 6 | used | 5; say if 6. |
| Recruits more common; at campfires or chest slots; a recruit with a piece of gear | used | The Muster, the stranger at the fire, the caged recruit with gear, the boon, the shop, events. |
| Swap any time outside a fight | used | |
| MP back for the bench, not HP | used | After every fight, by the MP regen stat. |
| Raise MP costs and pools by quite a bit | bent | The ratio does the job; scale only if you want it for how the numbers read (the challenge above). |
| Parties that answer the preview; rotate unless built on support | used | The point of the step; MP sources inside fights are the support path. |
| No reserves rule | used | |
| More training, a cleaner screen | used | Two-member TRAIN at camp and the Drill ground, the Training Hall; the nested screen. |
| Pick three; not a choice after every fight; formations and recruits as a lever of run design | used | Two new rooms, routed toward; spoils stay gear. |
| Rarities for formations (2 or 3) | used | Three, as a drop mechanism here; content in 5i. |
| A recruit's rarity is what it knows, not always the first, not always one | used | |
| More events, with variants | used | Six new around the roster; every event rolls a variant. |
| Enemies harder for the new flexibility | used | The knobs re-tuned at the end; see the predictions. |
| Potions, the Hourglass, six abilities | set aside | Your word. |

## Predictions (checked in the report)

- The simulated player changes the fighting party before most fights. Picking the party at random costs it more than any other decision in 5d's table did (spoils cost 13 points then).
- No class starting a fight at full MP runs dry in it. Casters rest about one fight in two or three, walls rarely.
- A run offers six to eight recruit picks and four to six formation picks (formations were one or two).
- Fights the rogue softened for a fixed party of three come back without ending more runs, now that a party can be picked for them: Bomb Bugs three to a fight again, snake packs that grow.
- With the knobs re-tuned to the same win rate, they sit higher than today: the same win rate against harder fights.

## The build, and what it costs

- **Rules and content:**
  - `src/rogue.ts` and `content/core-set/rogue.ts`: the roster, swaps, the reserves rule out, bench MP, the two rooms, rarities, events and variants, two-member training.
  - MP regen during fights off in the pack. An engine version bump if regen is engine-side.
- **Interface:** the party screen with the bench, the two rooms, recruit and formation cards with rarity, the nested training screen, the events.
- **The simulated player needs a party picker:** three of up to eight, the seats and the formation, from the preview and each member's HP and MP. This is the step's biggest cost and its biggest risk. A weak picker makes the tuning wrong.
  - My plan: a quick heuristic (fit to the fight's foes, MP and HP state), checked against a slow picker that plays a handful of candidate parties on other seeds.
  - The AI playtester gets the same screens.
- **Then:**
  1. the feel tool and a read of a few fights (does rotation read?);
  2. the knobs recalibrated and re-tuned harder;
  3. the playtests;
  4. the report.

  A budget of eight tuning rounds.
