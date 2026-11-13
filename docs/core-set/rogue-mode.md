# Core set: the rogue mode

The rogue mode is the game: a roguelite run of three acts on Slay the Spire's structure, a party of three around a leader, fights that play themselves, and preparation between rooms as the player's whole job. HP, MP, knockouts and cooldowns carry from fight to fight, so a run is a party kept going and built up from the gear, formations, recruits and training found on the way. The classes, gear pieces, enemies and combat rules have their own documents; this one is how a run works.

## Where it lives

The rules are `src/rogue.ts`, pure and deterministic: a run is plain data (`RogueRun`) moved one decision at a time (`options`, `choose`), with free actions between. The content is `content/core-set/rogue.ts` (`ROGUE_CONFIG`, `ROGUE_REGIONS`, `ROGUE_EVENTS`) and each fight's knob in `content/core-set/rogue-knobs.json`, shaped by the schema's `Rogue`. The screens are `ui/src/rogue-screens.ts`. Names in backticks below are fields of `ROGUE_CONFIG` unless the text says otherwise.

## A run's shape

- **Three acts.** Act I is the Old Road. At each act's end the road forks: two of the next act's regions at random, each shown with its boss. Act II is the Crypt, the Fire Mine or the Ice Pass; act III the Storm Tower, the Deep Crypt or the Tower Top.
- **A region** has four pools of fights (easy, normal, elite, bosses), made from the foes of *Core set: enemies*. The act's boss is drawn as the act begins and shown from the start, so the party can be built toward it.
- **The map** is Slay the Spire's generator: 12 floors on 5 columns, 5 paths walked up from the bottom without crossing, and the boss above (`map.floors`, `map.width`, `map.paths`). The player picks each next room from those joined to the last.
  - Floor 1 is all fights, floor 7 all chests, floor 12 all campfires (`map.fixed`).
  - Other floors roll from `map.odds` (fight, event, elite, campfire, shop): no elite or campfire before floor `map.lateFrom`, none of elite, campfire or shop straight after its own kind, and rooms with a shared parent differ where they can. Each map has at least `map.ensure` of some kinds, and mid-act campfires are added until `map.campPaths` % of the ways up pass one.
- **Fights:** floors 1 to `map.easyTo` draw from the easy pool, later floors from the normal pool, elites from the elite pool; an act doesn't repeat a fight while its pool has others. From floor `growFrom`, a regular fight's group of two or more of one foe may gain one more (up to eight), except foes that explode and those in `neverGrow`.

## The party

- **The leader** is a class the player owns: the Knight, Cleric and Ranger to begin with (`freshMeta` in `src/rogue.ts`). The start screen shows the ability each would set out knowing.
- **The draft:** two picks of one from three of the other classes (`start.picks`, `start.offers`). While nobody heals or raises others, each draft offers one who does (`start.healer`).
- **What a class knows is rolled.** A starting unit knows one of its three abilities at random, Raise and Choosing included. A recruit knows one, two or three, weighted by act (`recruits.known`); a boss's recruit knows at least two, and some events set the number. A fresh ability (a starting unit's, a recruit's, one just learned) starts with `fresh` % of its cooldown run.
- **The roster:** a party of three (`party`) and seats at camp, the bench: two in act I, three in act II, four in act III (`benchByAct`), each new act bringing its seat.
- **Recruits mostly come one at a time:** a recruit is there to take or turn down (a captive or a stranger can teach a lesson instead), and a boon can offer one recruit beside a piece and a formation. Two events offer a pick among recruits: Mercenaries (one of three; in its veterans' version, one of two who know all three abilities) and the Prisoner Convoy (one of three prisoners, each with a piece from the sack). Otherwise the start's draft is the only pick.
- **A recruit** joins with its class's plain weapon at full HP and MP (unless its offer says less), into the party if a seat is free, else to camp. Offers come with a full roster too: the player sends someone at camp home first (never the leader; their gear stays in the bag). An offer never repeats a class in the roster, and a class that could wear a bagged legendary nobody can wear is three times as likely.
- **Between rooms**, a fight's preview included, everything is free: swap a party member with one at camp, step one back or fill an empty seat, reorder seats, change formation, move gear, set each member's ability order (leaving some out), use supplies, drop a piece, send someone home. Nothing can be done during a fight.

## What carries between fights

- **HP, MP and knockouts.** The fallen stay down until a campfire, a phoenix feather, an event or the next act raises them.
- **Cooldowns**, across acts too, never reset. A member at camp keeps its cooldowns as it left them.
- **Max, not current.** Gear, seats and formations change max HP and MP, never current: a +HP piece doesn't heal. A heal by share of max counts from no more than the max the last fight ended with.
- **The bench's MP:** after each won fight, those who sat it out regain `benchMp` % of max MP. Their HP returns only at campfires and new acts.
- **A new act** restores the whole roster: full HP and MP, the fallen up, cooldowns as they are.
- Statuses and every other in-fight effect end with the fight.
- **A begun fight is set:** leaving and coming back replays it from the start, the same way.

## The rooms

Every win pays gold by tier (`gold.fight`, `gold.elite`, `gold.boss`, plus `gold.perAct` an act after the first).

**Fight.** Gold and what every won fight pays (below).

**Elite.** A hard fight from the elite pool. A pick of three legendary pieces, the first for someone in the party (`spoils.elite`), then a pick of two formations.

**Boss.** Act III's ends the run, won. Acts I and II's leave a Destiny Shard to take (below; none while the run holds `shards.max`), then a supply, then the **boon** (`boon`): a pick of three from a legendary piece (a mythic in its place in the boons that open the acts in `boon.mythic`), a formation of rare or better, and a recruit. Then the fork, the restore, and the **level-up**: each member takes one training, or `levelGold` gold.

**After any other won fight**, in order:
1. **A supply:** a potion or a tonic, a choice of one (`drops`); a kind with a full slot isn't offered.
2. **The spoils:** a pick of one of three, or none. A regular fight's are pieces (rarity from `spoils.fight.rarity`). In `spoils.fight.mixed` % of fights the pick mixes kinds (`spoils.fight.mix`): a piece, then a tome (a named member learns a named ability), a formation, a sealed piece (rare or better, hidden until taken) or a bundle (a common piece with a potion or tonic).
3. **A second pick** of three other pieces, after `spoils.fight.extra` % of regular fights.
4. **An elite's formation pick.**
5. **A captive**, after a fight with people in it (`captive.people`), `captive.chance` % of the time, never two fights running: take them in (at `captive.hp` % HP), take a lesson instead, or let them go.

**Campfire.** On arrival the whole roster recovers a share and the fallen rise (`campfire.auto`). Then one pick of two: **REST**, everyone healing again (`campfire.hp`, `campfire.mp`), or **TRAIN**, three members training once each (`campfire.train`). At `campfire.stranger` % of campfires a stranger asks to join: take them in or take a lesson, without using the pick.

**Shop.** Pieces by rarity (`shop.gear`, legendaries by act in `shop.legendaryByAct`), recruits, formations and all three supplies, at `prices`. Training as often as gold allows (`prices.learn`, `prices.upgrade`), each one a visit dearer by `prices.trainStep`. Any bagged piece sells for `prices.sell` % of its price. The shop's pieces are only for classes in the roster.

**Chest.** Every room on floor 7: gold (`treasure.gold`) and a piece (`treasure.rarity`), or, `treasure.cage` % of the time, a recruit with a piece suited to it.

**Event (?).** One of `ROGUE_EVENTS`, none met twice until all have been; most roll one of their versions. An option is a list of verbs: gold, HP, MP, gear, recruit, muster (a pick of recruits), learn, upgrade, train, temper, revive, formation, trade, supply, fight, camp, chance. What happens at once comes first; a choice, training, camp or fight waits at the end. An option needs the gold it costs and can't be picked if it can't happen now. An event's fight comes from the normal or elite pool and pays that tier's spoils.

## Loot

### Gear

- **Every piece is fixed**, with its own rarity: common, uncommon, rare, legendary or mythic. The pieces are in `content/core-set/pieces/`; the gear rules (slots, hands, armor types, offhands, mythics) are in *Core set: rules and vocabulary*.
- **An offered piece** rolls its slot (`slots`), then a class: one in the roster, one in the party for an aimed offer, or, for spoils, chests and events, one not in the roster `spoils.offRoster` % of the time, so a piece can make a run want a class. Then a kind that class wears there, and a piece of that kind at the offer's rarity, or the nearest rarity that has one. No piece twice in a pick; no legendary the run holds while others are left.
- **Mythics** come only from the boons that open acts II and III, one for a class in the party (else at camp) whose mythic the run doesn't hold. A unit wears one at most.
- **Tempering** (events) turns a piece into one of the next rarity of its slot and kind that its wearer can wear; a risky smith can crack it instead.
- **The bag** is the run's, unlimited. Taking a piece another member wears gives them yours if it fits.

### Formations

A run starts with Neutral. Formations are common, rare or legendary (`content/core-set/formations.ts`); an offer rolls its rarity by act (`formationOdds`) and never shows one the run owns. They come from elites, the boon, the shop, mixed spoils and a few events.

### Training

- **A training** is learning an ability, or taking a known ability's or the passive's **power step** or one of its two **versions** (A or B). Each takes a power step and one version, once each, in either order. A class starting with one ability has ten trainings in it. The upgrades are in `content/core-set/upgrades/`; a trained form plays in place of the base.
- **Three members, once each:** a campfire's TRAIN, a lesson (from a captive or a stranger) and the events' "train". **Every member once:** the act's level-up. **One:** a tome, a few events, and the shop, as often as gold allows.

### Supplies and gold

- **A potion** heals one standing party member (`supplies.potion`), **a tonic** restores one's MP (`supplies.tonic`), **a phoenix feather** raises a fallen member (`supplies.phoenix`); between rooms only. The bag has a slot a kind (`bag`). A run starts with `start.supplies`.
- **Gold** starts at `start.gold`; it comes from wins, chests, events, selling and a level-up taken as gold, and goes on the shop and paid event options.

## Difficulty

- **A fight's knob** adds its own (`rogue-knobs.json`), its act's for its tier (`knobs`), its region's for its tier (each region's `knob`), a climb a floor from its pool's reference floor (`map.ref`, `knobs[].step`, `early` below it and the elites' own `eliteEarly`; not for bosses) and the heat. A knob k gives foes k % more HP and k ÷ 2.5 % more damage (`knobFoes` in `src/rogue.ts`); each tier's `shape` adds HP and damage on top: regular fights and elites longer and softer than the knob alone, bosses shorter and harder.
- **Heat:** a won run opens the next level; the start screen picks any open level. Each adds `heat.per` to every knob. Heat 0 is the game as tuned.
- **Knobs are measured, not set.** Each fight's own knob is set by what it costs a careful party: about a sixth of its HP for a regular fight and nearly a third for an elite, both less in act I (`TARGETS` in each calibrator: `tools/build-calibrate.ts` against the build parties; act I's against the hand-built rosters at act I's power, `npm run rogue:calibrate`, with its climb from `--climb`). Then `npm run rogue:tune` plays whole runs of the simulated player: it sets each boss to its act's share of the parties that reach it (`RUN_TARGETS` in `tools/rogue-tune.ts`), and evens out the regions an act forks into. It doesn't aim the losses between bosses: the simulated player's come mostly from weak parties, so a target for them would make the fights free for every other party.

## The end of a run

- **Any lost fight ends it,** unless a Destiny Shard is spent. A wipe ends the run even with members at camp.
- **Destiny Shards** let a run try a fight again with a different preparation. Act I's and act II's bosses each leave one, taken by hand like the spoils, and a run holds up to `shards.max`. When a fight is lost with a shard held, the player can spend one: the run goes back to exactly where it stood as the fight's preview opened. Everything returns as it was then: HP, MP, knockouts, cooldowns, gold, gear, seats, the supplies used at the preview, the same foes. Only the shard is gone. The same fight with the same party and choices plays the same way, so a second try has to change something. The player can also decline and end the run. The simulated player always spends a shard and prepares the fight again differently, for now at random (`shake` in `src/sim/rogue-ai.ts`); a tool that plays single fights (`autoFight` without `shards`) counts a loss as a loss.
- **Beating act III's boss wins it.** A won run adds one class to the classes a run can start with: the player picks it from the final party (the three seated), among those they don't own yet (`unlockable`), and, played at the highest heat open, opens the next (`finish`). Every run adds to the record: runs, wins, furthest act and floor.

## Dice and saves

Every roll comes from the run's seed, sliced by what it's for, so the same seed and choices make the same run and a fight can't be rerolled by leaving it. The interface saves after every step; a run saved under another `ROGUE_VERSION` (`src/rogue.ts`) is set aside on load.
