# Step 5i, step 5: the test parties

Oct 30, 2026. The "parties" share of the build (`plan.md`, wave 1). It sets up the test's hand-built parties as data, in `src/build-parties.ts`: every route of every build at its three rungs, so wave 4 can play all twelve builds on one set of the rogue's fights. Nothing has been played yet: the pieces aren't content yet. Nothing is balanced either. A route is what `builds.md` names, not what wins.

## What's in the file

- **Counts:** 12 builds, 3 routes each (36), 3 rungs a route. That's 108 parties, or 216 with the Neutral version of each.
- **Each party:**
  - its formation and act;
  - three members in seat order. Each member has its class, its seat, its three abilities in slot order, its trainings (ability or passive id, power step yes or no, version A or B) and its gear by slot.
- **Exports:**
  - `ROUTES` holds each route and its three rungs.
  - `BUILD_PARTIES` holds the 108 parties in their formations.
  - `ALL_PARTIES` adds the Neutral versions. `neutralOf(party)` gives the same members and gear in Neutral.
  - `FORMATION_SEATS` and `MYTHICS` record each formation's seat names and rarity, and each mythic's class and slot. They're my reading of the fill, so the test can check them against the content when it lands.
- **Ids:** taken from the fill's names, by the shares' rule. Abilities and passives keep today's ids.
- **No bench:** the build is the party. The test fields these three directly, not 5h's best trio of five.
- **Checks:** a scratch checker confirmed the following for all 216 parties:
  - every piece exists in the fill, and its rarity fits the rung;
  - every class can wear what it's given, and every slot is filled;
  - a two-hander empties the offhand;
  - no piece appears twice in a party;
  - mythics are on their own class and slot, at most one a unit and two a party;
  - seat names match the formation;
  - a later rung keeps every training of the earlier one.

## The rule for each rung

- **Rung 1, act I: what most runs find.**
  - Gear: commons and uncommons in the build's kinds, picked for their first-rung effects.
  - Formation: the build's common one.
  - Trainings: none.
- **Rung 2, act II: specific pieces.**
  - Gear: the build's rares wherever a member can wear one.
  - Formation: the build's rare one.
  - Trainings: one or two versions on the abilities and passives whose version names the build. No power steps.
- **Rung 3, act III: the far end.**
  - Gear: the build's legendaries and its mythics.
  - Formation: the build's legendary one.
  - Trainings: a power step on every version from rung 2, plus the other versions that name the build (at most four trainings a member). A member with no version toward the build takes a power step on the ability the build leans on.
- **At every rung:**
  - A later rung keeps whatever still serves the build.
  - A slot with nothing for the build holds the plain-stat common that suits the unit.
  - Every member knows all three abilities, so the rungs differ only in what the build asks. A real act I party knows about two; the test can drop the third slot to match act I.
- **Mythics:** each member whose class's mythic pulls first toward the build wears it, at most two a party (a run's act II and III boss boons). A mythic that pulls toward the build only second is left out wherever a piece worth more to the build holds its slot. So Ambush and Pact carry no mythic, as the spine says.
- **Legendaries the spine tags at rung 2** (Hexblade, Oathbound shield, Volley bow, Lamp of vigil) wait for rung 3, so each rung keeps to one rarity band.

## The routes

The formations are listed by rung (1 / 2 / 3).

| Build | Route | Formations | Built around |
| --- | --- | --- | --- |
| Landslide | Geomancer, Knight, Hoplite | Heavy line / Hammer and anvil / The mountain | Earthen shell lights Bedrock behind the Knight; Phalanx's swings and the Geomancer's crits are the blows |
| Landslide | Geomancer, Paladin, Cleric | same | the Geomancer swings a great weapon; Smite lands rarely and hard |
| Landslide | Knight, Hoplite, Bard | same | slow steel, with the Bard's Might on the slowest swing |
| Cuts | Bard, Monk, Assassin | Spur / Spur / The hurricane | fists and daggers, Double strike, Flow, the Bard's Haste |
| Cuts | Valkyrie, Ranger, Vampire | same | three-hit spear, dagger and Bleed, the Vampire drinking from every claw |
| Cuts | Stormcaller, Hexer, Pyromancer | same | the magical torrent on fast wands, and the Hexer on a dagger |
| Bonfire | Knight, Pyromancer, Hexer | Shieldwall / Hearth / The forge | Kindling and Firebolt on the hottest foe; the Knight holds the early fight |
| Bonfire | Paladin, Bard, Monk | same | no mage: Burning fist and Smite, sped by the Bard |
| Bonfire | Hoplite, Pyromancer, Cleric | same | fast Kindling; Aspis and Paired guard hold the early fight |
| Cold Snap | Frostweaver, Hexer, Ranger | Heavy line / Hoarfrost line / Hoarfrost line | three Chill sources |
| Cold Snap | Monk, Bard, Frostweaver | same | the director's run: Chill on the fighters' weapons |
| Cold Snap | Geomancer, Monk, Hexer | same | no Frostweaver; the Geomancer's great weapon as the smash |
| The Hunt | Valkyrie, Ranger, Assassin | Arrowhead / Hunting party / The pack | Gale spear, Hunter's eye, Backstab: three ways past the front |
| The Hunt | Assassin, Monk, Hoplite | same | Backstab and Pressure point hunt; the Hoplite holds |
| The Hunt | Ranger, Stormcaller, Paladin | same | arrow and wind, with Smite on the hunt's own target |
| Harvest | Bramble knight, Stormcaller, Bard | Ring of steel / Reaping line / The storm front | Arc, chains and Thunder chord; the Bramble draws the swarm |
| Harvest | Paladin, Pyromancer, Frostweaver | same | two Area casters; Sanctuary holds the field |
| Harvest | Knight, Valkyrie, Hoplite | same | the physical harvest, all from pieces |
| Ambush | Assassin, Ranger, Geomancer | First light / Knives drawn / The ambuscade | a knife from hiding (Vanish first), arrows, a crit from behind stone |
| Ambush | Monk, Bard, Bramble knight | same | the Bard's Haste and Might at the first tick, spent by the Monk |
| Ambush | Assassin, Cleric, Valkyrie | same | Backstab and Gale spear at once; Raise first in the Cleric's slots |
| Overflow | Bard, Frostweaver, Hexer | Wellspring / Relay / The choir | Refrain and Stillness pass mana; the Hexer feeds itself |
| Overflow | Knight, Pyromancer, Cleric | same | a wall's Clarity feeding two hungry casters |
| Overflow | Vampire, Stormcaller, Bard | same | Blood gift's mana, Static charge, Chain lightning on a loop |
| Lockdown | Monk, Knight, Hexer | Watchtower / Gaol / The vise | Shield bash, Unmake, Pressure point: three locks on three clocks |
| Lockdown | Assassin, Geomancer, Frostweaver | same | Garrote, Tremor, and Chill's slow and Stun |
| Lockdown | Paladin, Cleric, Hexer | same | the patient version: locks that wait, Ward and sustain |
| The Toll | Bramble knight, Cleric, Stormcaller | Shieldwall / Thorn hedge / The mountain | Thicket, Briar, Cure, and Arc bursting the Bleed |
| The Toll | Knight, Hexer, Hoplite | same | a thorned Knight; Enfeeble and Malison make each blow cost |
| The Toll | Monk, Bard, Assassin | same | the dancer: Evasion, dodges that strike back |
| Blood Pact | Vampire, Monk, Cleric | Long march / Blood oath / Blood oath | the Vampire pays and drinks; the Monk drinks fast; Cure catches the drop |
| Blood Pact | Vampire, Bramble knight, Valkyrie | same | high HP and Regrowth; Rally passes life on |
| Blood Pact | Knight, Monk, Paladin | same | no Vampire: max HP, Absolve, a fist that drinks |
| Phoenix | Assassin, Cleric, Valkyrie | Vigil / Pyre of heroes / The undying | two revives; the Assassin falls first and comes back |
| Phoenix | Vampire, Valkyrie, Knight | same | Bloodlust near the brink; the Knight doesn't fall |
| Phoenix | Pyromancer, Cleric, Paladin | same | Raise first brings the caster back |

## Coverage

- **Pieces placed:**
  - 58 of 60 commons, 58 of 60 uncommons, all 60 rares and 56 of 60 legendaries;
  - all 16 mythics, 23 times at rung 3;
  - 30 of 32 formations.
- **Trainings:**
  - Rung 2: 150 versions. 16 of the 108 members have none toward their build.
  - Rung 3: 191 versions and 178 power steps.
- **Classes across routes:** the Monk is in 10 routes; the Knight, Cleric and Bard in 9; the Assassin and Hexer in 8; the Paladin and Valkyrie in 7; the Hoplite and Pyromancer in 6; the Geomancer, Ranger, Vampire, Stormcaller and Frostweaver in 5; the Bramble knight in 4.

## What I wasn't sure of

**Builds the documents leave thin:**
- **Formations:** three builds lack one rung's formation.
  - Cold Snap has no common or legendary formation. Rung 1 uses Heavy line, whose Bruiser stands in for the breaker (the spine rates it Snap ●●). Rung 3 keeps Hoarfrost line.
  - Blood Pact has no legendary formation. Rung 3 keeps Blood oath; The undying is only Pact ●●.
  - Thousand Cuts has no rare formation. Rung 2 keeps Spur.
- **Ambush:**
  - Its versions come from few classes. 5 of its 9 members have none toward it at rung 2 (the Ranger, Geomancer, Monk, Bramble knight and Cleric).
  - Its Monk, Bard and Bramble knight route has almost nothing past rung 1. It adds only War horn and Stone totem at rung 2, then Horn of the charge and Ready stance at rung 3.
  - It carries no mythic. Night's edge gives way to Shadow cloak, which is worth more to Ambush.
- **The Toll's dancer** (Monk, Bard, Assassin): only the Monk gains Toll pieces after rung 1. The Bard and Assassin keep their rung-1 gear, plus one version each.
- **Harvest's physical route:** the Knight has no version toward Harvest, so the route is all pieces, as `builds.md` says.
- **Phoenix's Pyromancer route:** `builds.md` wants "a piece that returns it ready". Nothing in the fill returns a non-Valkyrie ready: ruling G10 and Bones of the returned both say full cooldown. The route plays Raise first, with Bones' full-HP return at rung 3.

**Seats that do little:**
- **Landslide, Knight, Hoplite, Bard:** at rung 2 Hammer and anvil's Mason is the Bard. The Bard gives no Shields or Guards, so the seat does nothing.
- **Landslide, Geomancer, Knight, Hoplite:** the Hoplite sits in the Hammer seat with a great weapon. Phalanx times the seat makes it swing about once every 51 ticks, as the formation's own text says. The design leaves this extreme as it is, and the test should watch it.
- **Lockdown, Paladin, Cleric, Hexer:** the route has no wall, so the Gaol's Gaoler seat falls to the Cleric.
- **Lockdown, Assassin, Geomancer, Frostweaver:** at rung 2 the Watcher seat already makes Garrote wait for a wind-up. The Assassin takes Choke only at rung 3, where The vise has no Watcher.

**Choices where two pieces wanted one slot:**
- Hunt's Valkyrie, Ranger, Assassin route leaves out the Valkyrie's Stormspear (Hunt ●●), which would be a third mythic.
- Bonfire's Hoplite route leaves out The last wall (Bonfire ●●) for the Phalanx shield (●●●) in the same slot. The Toll's Knight, Hexer, Hoplite route uses The last wall.
- Bones of the returned says the revived come back on full cooldown, which would undo a Valkyrie's own Einherjar. So it's on Phoenix's Pyromancer, Cleric, Paladin route, on the Cleric.

**For the other shares:**
- **The spec share:** the Valkyrie's passive (Einherjar) has no status id today. Trainings name it `einherjar`, so the run layer's passive forms need an id for it.

**Items not placed:**
- The five exotics (Wildmagic wand, Cinderheart staff, Gambler's coin, Idol of the hungry dark, The wheel). They belong to no build, by design.
- Skirmish line (Cuts 1 ●●), because Spur (●●●) took Cuts' rung 1.
- Four commons and uncommons: the Arming sword, the Yew bow, the Fanged idol and the Snaring bow. The Snaring bow is Lockdown 1, but no Lockdown route has anyone who can wear a bow.
