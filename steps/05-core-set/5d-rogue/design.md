# Step 5d design: a rogue mode

The core set as a roguelite, on Slay the Spire's structure, as the director asked for overnight (`intent.md`). Built in one session without a stage gate, as 5a was: this design is where the director first reacts to it, and it describes the mode as it stands after tuning (`tuning.md` has how it got there). Nothing in the core set's classes, gear, formations or enemies changed: the rogue mode is a new way to play the same content, with its own legendary pieces, affixes, events and numbers on top.

## The shape of a run

- **Three acts.** Act I is always the Old Road. At the end of each act the road forks: the next region is one of two offered (act II from the Crypt, the Fire Mine and the Ice Pass; act III from the Storm Tower, the Deep Crypt and the Tower Top), each shown with the boss it will have and that boss's moves. A run is won when act III's boss falls.
- **The map** (Slay the Spire's generator): nine floors on five columns, five paths walked up from the bottom, never crossing, and the boss above them. Floor 1 is always a fight, floor 5 a chest, floor 9 a campfire. The other floors roll fight 46%, event 22%, elite 12%, campfire 12%, shop 8%; no elites or campfires before floor 4, no elite, campfire or shop straight after another of its kind, siblings differ where they can. Every act has two shops and two elites, and every way up passes a campfire between floors 4 and 7 (the playtesters' recruits waited all act for one). The boss and its moves are shown from the act's start (BOSS on the map, and at every campfire), so the party can be built and swapped toward it.
- **About 12 fights a run** (5 an act, a boss included), and as many other rooms.
- **The party.** The player picks a **leader** from the classes they own (the Knight, Cleric and Ranger to begin with), then **two companions**, each a pick of one from three classes drawn from all sixteen; while the party has nobody who heals others, each draft's three include one who does (the Cleric, the Bramble knight or the Valkyrie). More classes join on the way (recruits from spoils, the boss's boon, the shop and two events); up to two wait **at camp**, and who's in the party changes only at a campfire, with two exceptions for those at camp: **a fallen party member can trade places with one standing at camp any time between rooms**, and **the reserves**: a lost regular fight or elite with someone standing at camp passes the road to them, with no spoils (a lost boss still ends the run). One standing at camp can also fill an empty seat any time between rooms. Four playtesters lost a run with healthy members watching from camp. Those standing at camp when a campfire is reached get half a REST and half a FOCUS there. A recruit offer is three times as likely to be a class that could wear a legendary piece nobody in the roster can.
- **Preparation.** Entering a fight room shows its foes (what each is, what it does and how big its moves are before Armor, what it hits with, what it resists); gear, seats, formation and ability order can still change (an ability can be left out of fights), and supplies be used, until the fight begins. Then it's set: leaving replays it from its start, the same way.
- **Numbers shown.** Every ability shows its size for the unit that has it ("shield ≈ 30", "≈ 22 blunt + Stun"), an upgrade shows its numbers before and after, and a piece's HP moves current HP with it, which the command line says.
- **Attrition.** HP, MP and knockouts carry from fight to fight; the run ends at a boss lost, or when nobody in the roster stands. Gear, seats and formations change max HP and MP, never current: a +HP piece raises the ceiling and doesn't heal, and taking one off caps HP at the new max. A heal by share of max (REST, FOCUS, a tonic, an ether) counts from no more than the max the last fight ended with, so a +HP piece worn just for the heal adds nothing. Only campfires, supplies, a few events and the start of each act restore anything. A party knocked out entirely ends the run.
- **Each act starts restored**: everyone stands up with full HP and MP, and **levels up**: each member learns an ability or makes a known one better (+), the player's pick, or takes 40 gold instead.

## What a party grows by

- **Abilities, one at a time.** A class joins knowing one ability (one per act reached, for a recruit). Its first is set per class, the one that best stands on its own (the Knight's Protect, the Cleric's Cure, the Pyromancer's Firebolt; the Vampire's Wither, not Blood drain: see `tuning.md`, round 7). The others come from level-ups, a campfire's TRAIN, tomes in the spoils, the shop (60 gold) and the Old Master. **An upgrade (+)** makes an ability 40% bigger in everything it deals, heals, shields or stacks; one with no amount (Guard, Haste, Hush) comes off cooldown a quarter sooner. A campfire's TRAIN or the shop (80 gold) upgrades.
- **Gear, semi-procedural.** Every piece is one of the core set's, with a rarity:
  - **common**: the piece as it is;
  - **uncommon**: one affix, a gear step on top ("Keen Fang": Attack +1);
  - **rare**: two affixes, one as a prefix and one as a suffix ("Sturdy Plate of the Tortoise");
  - **legendary**: a piece that bends a rule, with two affixes on top (a powerful piece alone was a sidegrade, worth a third of a rare: `tuning.md`, round 10).
  
  Twenty affixes: HP, Armor, Attack, Magic, MP regen, MP, Crit, Aggro down, Aggro up with HP, the seven special stats at medium, and four resistances. Names and colours carry the rarity (green, blue, gold ★); the art is the base piece's. Each item is one piece: one member wears it, and gear changes hands any time between rooms. A quarter of the legendary pieces rolled are from anything (not only what the roster can use), so a run turns up pieces that want a class it doesn't have: the interface says "NOBODY CAN USE IT YET · PYRO, GEO". Ordinary pieces are always wearable by someone.
- **Legendary pieces: 43.** The core set's 14 powerful pieces and 29 new ones, built from statuses the engine already has:
  - class passives for anyone, by sigil: Ember (Kindling's Burn), Rime (Chill), Wound (crits bleed), Shatter (Sunder), Siren shell (Refrain's MP), Stone idol (Bedrock);
  - rule-benders: the Cleaving charm (basic attacks hit a second foe), Stormbrand (a sword that arcs and shocks), the Crown of judgement and the Brand of kings (hits on buffed foes +60%), the Headsman's axe (double damage below a third of HP), the Hunter's bow (+50% on bleeding foes), the Cinder rod (+40% on burning foes), the Frost shard (more per Chill stack), the Berserker's torc (+50% below half HP, double below a quarter);
  - starts and reactions: the War banner (the party starts with Might), the Herald's horn (Regen), the Hourglass (Haste), the Shadow cowl (Hidden), the Grave lantern (a foe falling heals), the Soul jar (a foe falling gives the party MP), Gravecaller (a foe falling gives Might), the Silver bell (can't be Silenced);
  - armor that answers back: the Frozen heart (Chill on attackers), the Briar coat (Bleed on attackers), the Static coil (Shock), the Spiked bulwark (Thorns from Armor).
  
  Each names the classes it's for (`aims` in the content, shown as FOR on its card: "an Ember sigil on the Monk feeds Burning fist", "a Spiked bulwark wants a Knight or Hoplite"). A run doesn't roll the same legendary twice while others are left. The rogue mode's own rules were each priced locked on for a whole run against an ordinary piece of their slot, and the weak ones lifted (`tuning.md`, round 27).
- **Formations** come from the boss's boon, the shop (one a visit) and the Fallen Standard; they change any time between rooms.
- **No experience levels.** The director doubted they were needed, and the act-start level-up plus training cover the same ground with choices instead of grinding.

## The rooms

- **Fight:** gold (12 to 20, +5 an act) and **spoils**: pick one of three or skip. An offer is gear (55% common, 33% uncommon, 12% rare, never two of the same piece, always something the roster can wear), a tome (12%), a recruit (6%) or a supply (8%). An act never repeats a fight while its pool has others.
- **Elite:** a hard fight from the region's elite pool. Gold 50 to 65 and a **trophy**, a legendary piece won outright and aimed at someone in the party, plus a pick of three rares (or tomes 15%, recruits 10%). This is Slay the Spire's elite relic: without the trophy, avoiding elites won more runs than taking them (`tuning.md`, rounds 9 to 12 and 19).
- **Boss:** gold 90 to 110 and a **boon**: one of a legendary piece, a formation and a recruit. Then the fork, the restore and the level-up.
- **Campfire:** one pick of REST (+40% HP), FOCUS (+60% MP), RAISE (a fallen member at 40% HP) or TRAIN (learn or upgrade an ability); swapping the party is free before the pick and after it, until LEAVE. Those standing at camp when it was reached get half a REST and half a FOCUS (one raised just now doesn't). The campaign's three-way campfire, plus Slay the Spire's smith.
- **Shop:** two common, two uncommon, a rare and a legendary piece (45, 70, 110 and 190 gold), a recruit (120), a formation (100), two supplies (35 to 60), training (learning 60, upgrading 80, each one bought in a visit making the next 30 dearer: gold piled up when it was once each a visit), and selling (35% of a piece's price).
- **Chest:** a rare (70%) or legendary (30%) piece and 15 to 35 gold.
- **Event (?):** twelve, each a choice in a few verbs (gold, HP, MP, gear, a recruit, learning, an upgrade, tempering a piece up a rarity, a formation, a supply, a fight, a camp, a gamble): a Wounded Traveller, a Blood Shrine, the Gambler, an Abandoned Forge, the Old Master, an Ambush, a Clear Spring, a Strange Chest, an Empty Camp, Pilgrims, a Drill Yard, a Fallen Standard. A run doesn't meet the same one twice until it has met them all. Costs come before choices, an option that can't happen now is greyed, and WALK ON appears when none can.
- **Supplies** (the bag holds three): a tonic (the party +30% HP), an ether (+50% MP), a phoenix feather (a fallen member up at half HP). Used between rooms.
  - *Step 5g (the director's), as built now:* renamed and reshaped. A **potion** gives one member, the player's pick, +30% HP; a **tonic** one member +50% MP; the phoenix as before. The bag has a slot a kind, two each. After every won fight the party picks one of a potion or a tonic, free. Cooldowns carry from fight to fight, across acts too.

## The fights: remixed, themed, and each its own knob

- **Seven regions**, one per dungeon of the enemies document, each with its own pools: easy fights for floors 1 and 2, regular fights, elites, and two or three bosses. 100 fights in all: the document's 27 encounters, the campaign's remixes, and new mixes from the same enemies (Snake Grass, the Miners, Frost Trolls, the Queen's Guard as an elite at the Tower Top). From floor 6 a regular fight's packs may grow by one.
- **Regular fights have a shape:** their foes take 80% more HP and deal 30% less a hit before the knob, so they last about 37 ticks instead of 21 to 25 at the same cost, and each ability slot fires about twice as often (the playtesters: "fights are over before the build shows"). Elites and bosses keep theirs.
- **Every fight has its own knob** (the campaign's: HP +k%, damage +k/2 %), in `content/core-set/rogue-knobs.json`, set two ways:
  - `npm run rogue:calibrate` measures each fight against snapshots of real parties from simulated runs (made whole, MP as it was) and bisects its knob until it costs its tier's share of party HP: easy 10/11/12, regular 15/16/17, elite 22/23/24 points, by act. Bosses are measured against parties exactly as they arrive.
  - `npm run rogue:tune` then corrects in whole runs: each boss toward beating 22%, 35% and 45% of the parties that reach it (acts I, II, III; 12%, 20% and 25% until the director asked for a harder heat 0), each region's regular fights and elites toward ending 6%, 9% and 12% of the runs that enter it.
- **Bomb Bugs** come at most two to a fight: their document says three together wipe, and a roguelite party can't be built for one fight. **Snakes' packs never grow**, and act I's regular fights hold two: their Bleed doesn't shrink with a fight's knob, and the regular fights' extra HP gave them more hits (the Viper Den ended 9% of the act I runs meeting it with its knob at the floor).
- **Heat:** a won run opens the next heat level; each adds 4 to every knob (5 at first; 4 at the director's word, erring hard for their playtest), about a fifth of the simulated player's wins left at each level (17%, 12%, 10%, 6%, 3% and 2% at heats 1, 2, 3, 5, 7 and 10, from 21% at heat 0). Heat 0 is the game as tuned.

## Meta: what a run leaves

A won run adds every class in its final party to the classes a run can start with (the director's rule). Nothing else carries over except the record and the heat.

## The interface

A third MODE in Settings (journey, free play, rogue). In rogue mode the home menu shows ROGUE (with the run's act) and the run's PARTY. Screens: the leader pick (owned classes; heat once won), the draft (three cards and the class's sheet with what it starts with and learns later), the map (Slay the Spire's: icons per room, the walked path in gold, the reachable rooms pulsing, the boss crowned at the top), the battle screen as it is (the party's HP carried in), spoils and boon cards (rarity colours, the trophy, who a piece fits), the chest, the shop (BUY, TRAIN, SELL), the campfire (REST, TRAIN, SWAP), events, level-ups, the fork, and the end (the road told as notes). The party screen, unit sheet and gear picker work on the run's items. A fight once entered is set: leaving and coming back replays it from its start, the same way.

## Intent map

| The director's item | | |
| --- | --- | --- |
| A third option beside journey and free play | used | Settings' MODE. |
| Start by selecting a class you own; Knight, Cleric, Ranger to begin | used, extended | The leader. Two drafted companions join, from all sixteen: a party of three from the first fight, and every class can appear in a run from the start. |
| Increasingly challenging dungeons, remixed, themed to the location | used | Seven regions, a fork after each act, 100 fights, knobs rising by act. |
| Rewards: loot, classes, formations; designer decides when | used | Spoils after fights, trophies from elites, boons from bosses, chests, the shop, events. |
| Swap classes at campfires; gear any time | used | As asked. |
| Semi-procedural gear from what exists | used | Rarities and affixes on the core set's pieces, and 29 new legendary pieces. |
| A legendary you need a class for | used | Legendary pieces aimed at classes and weapon kinds; a quarter of gear rolled from anything; "nobody can use it yet"; recruits in the shop and the boon. |
| Beat a run, unlock its classes as starters | used | |
| Slay the Spire's structure | used | Map, rooms, elites' relic, the boss boon, the shop, the smith. |
| A Slay the Spire store and currency | used | |
| Levels, if important | set aside | The act-start level-up and training do the job with choices. |
| Abilities unlocked over time | used | One at the start, the rest learned and upgraded. |
| Balanced around attrition | used, measured | See the report: HP bites, MP mostly doesn't. |

## Challenges

- **Class balance shows harder here than in the campaign.** As leader with random companions, the Vampire wins 34% of runs and the Monk 27%; the Hexer 6% and the Bard 5% (at 21% for the whole game). Starting the Vampire on Wither instead of Blood drain cut its lead (it won 37% as leader when the next class won 20%); nothing rogue-specific lifts the weakest (not a second ability on joining, not another first ability). It's the 5c report's class pass, with numbers.
- **MP binds only for casters.** The martial classes end nearly every fight at full MP, so FOCUS is right only for a caster-heavy party. A class pass for the casters, or MP costs for the martial classes, is the lever, not the rogue rules.
- **The core set's powerful pieces are sidegrades.** In the rogue mode, locked on for a whole run, most cost points against an ordinary piece of their slot. They're shared with the journey and free play, so the rogue mode leaves them as they are and the report asks.

## Predictions, checked in the report

- The simulated player wins about a third of its runs at heat 0 (the first target; the director then asked for about 20%, and it now wins 21%); bosses end more runs than anything else.
- Every decision kind is worth points of win rate when made well rather than at random.
- Taking elites when healthy beats avoiding them; seeking every elite is riskier.
- Gold, legendaries and rares each have a measurable value.
- An AI playtester finds the route, the spoils and the campfire to be real choices, and finds at least one "I need this class for that piece" moment.
