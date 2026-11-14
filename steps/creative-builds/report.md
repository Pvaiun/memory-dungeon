# Creative builds: the report

Built from `design.md` and the kickoff, step by step, each its own commit (the ladder, pieces and mythics as one: see *What changed*). Nothing is balanced. `npm test` passes but for the two art tests, as the kickoff expects. Typecheck and the validator are clean, and the piece check finds no crash, loop or wrong-way item.

## 1. Decisions needed

1. **The game got much harder, not a little.** 1,200 whole runs at heat 0, Destiny Shards spent, with nothing retuned:

   | | Before the pass | After |
   | --- | --- | --- |
   | Runs won | 27% | 8% |
   | Act I's boss beaten | 77% | 67% |
   | Act II's boss beaten | 78% | 61% |
   | Act III's boss beaten | 71% | 50% |
   | Runs reaching act II | (not kept) | 41% |
   | Mythics worn when held | 69% | 69% |

   Most runs die in act I: fights 25%, elites 14% and the boss 20% of all runs. The likely causes are four. Every piece's stats are its own, so they suit the wearer less often. Wider kinds thin each class's offers. Some commons give a stat up. And the legendaries and mythics lost a step. This is the balance pass's to fix; the kickoff wanted a little harder. **Rule:** leave it to the balance pass, or have me look first at what act I lost.

2. **Keyword share came out uneven**, by the counting tool's measure: Landslide 15%, Thousand Cuts 11%, the Storm 14%, the Toll 15%, Bonfire 36%, Cold Snap 40%, the Hunt 43%, Blood Pact 41%, Barrage 58%. You ruled "about a third: test this version".
   - Four roads sit well under a third. Their pieces moved onto their other threads.
   - Barrage sits over half. Its mana pieces are spine `keep`s: MP is the road's fuel, and most of its cards say MP or free.
   - **Rule:** test as is, or have me move some of Barrage's keeps onto other threads.

3. **Three things I added where the design was silent.**
   - Brittle and Fixated had no piece that applied them. Fixated now comes from **Alarum**, a new rare horn ("When a foe hits another ally below half HP: Fixates that foe"), and from the **Ranger's Lure** version, which replaces Pinning arrow (the design's engines name "the Ranger's lure"). Brittle comes from **Woodpecker's crest**, a new rare trophy ("While an ally has more Crit damage: basic attacks make their target Brittle").
   - That's two pieces more in the stock (324) and one more changed version.
   - **Rule:** keep, or cut.

4. **The design's own push-backs, built as designed:** the step down, commons by rule, and the Hunt's kills as triggers, not counted as conditional. Each is one rule to undo if you don't want it.

5. **The history.** While six workers wrote the shares, I pushed work-in-progress checkpoints to the branch, then rebuilt the work as the step commits. Both lines are kept. A merge that changes no files joins the checkpoints to the step commits: read the step commits; the checkpoints carry the same final tree.

## 2. The counts, before and after

One tool counts both: `npx tsx tools/loot-count.ts`, run on the commit before the pass and on this one. It counts every card on gear, mythics, formations and upgrades (438 items before, 440 after).

| Shape | Before | After | Design's aim |
| --- | --- | --- | --- |
| Shield | 42 | 25 | 21 |
| Burn | 31 | 15 | 16 |
| Chill | 30 | 12 | 15 |
| Shock | 27 | 10 | 14 |
| Bleed | 18 | 10 | 9 |
| At fight start | 31 | 17 | 15 |
| On a kill or a foe falling | 36 | 18 | 10 |
| A status on basic attacks | 27 | 19 | 8 |
| When hit | 13 | 8 | 7 |
| Stun | 13 | 9 | 7 |
| Thorns | 12 | 7 | 5 |
| A hit on every other foe | 9 | 3 | 5 |

The tool's word patterns are broader than the kickoff's hand count on two rows: kills, and statuses on basic attacks (36 against 20 before, and 27 against 17). Read those rows as before against after, not against the aims.

**Rares and legendaries** (159 after, 157 before):
- **Exotic:** 17 before, 37 after (aim 37).
- **Conditional on a party set-up:** before, untagged (the design read about 25); after, 66 (aim 51). Of the 66, about 14 are conditional through their stats alone.
- **Both:** none.

**Keyword share per build** (pieces serving the build at a rung that name its keyword):

| Build | Before | After |
| --- | --- | --- |
| Landslide | 35% | 15% |
| Thousand Cuts | 27% | 11% |
| Bonfire | 75% | 36% |
| Cold Snap | 74% | 40% |
| The Storm | 68% | 14% |
| The Hunt | 66% | 43% |
| The Toll | 42% | 15% |
| Barrage | 74% | 58% |
| Blood Pact | 43% | 41% |

**Formations themed to a keyword:** 21 of 36 before, 9 after. The tool counts formations whose card or seats name a status road's keyword, the Shield, Thorns or a Mark. Its nine aren't quite the design's nine: Vigil gives a Shield, and The covenant's price in HP isn't on its list.

**Abilities with a reorienting version:** 27 of 48 before, by the design's reading, and 36 after. The nine new ones are one or two in each of the eight classes that had fewer than two. The Lure replaced Pinning arrow, which already counted. The tool can't read this one off the data.

**Passives held to one lane:** 7 before, 0 after.

**Alike cards:** no two pieces one class can wear together share a sentence.

## 3. Waiting for art

**Weapons without a drawing (40):**
- **Commons:** Brawler's dirk, Sidestep claws, Brazen talons, Leechwood wand, Lifewood wand, Ceremonial sword, Bident, Stout hatchet, Bodkin bow, Iron-backed bow, Honed runeblade, Spiked hammer, Votive hammer, Flanged mace, Beacon staff, Ringed staff, Clarion glaive, Guardsman's halberd.
- **Others:** Follow-up dirk, Letter opener, Twin dirk, Knuckle-dusters, Weaver's wraps, Heckler's wand, Echoing wand, Duellist's sword, Kingmaker, Avenger's spear, Phalanx pike, Woodsman's axe, Miner's pick, Whistling bow, Patient bow, Hindering blade, Wardblade, Midnight blade, Sparring staff.
- **Mythics:** Valhalla's spear, Thousand-palm wraps, Eye of the gale.

**Drawings left over (41),** whose weapons were renamed or retired:
- keen_dirk, sleet_dirk, marking_knife, bloodscent_knife
- gilded_sword, rimed_blade, stormbrand
- boar_spear, victors_spear, squall_lance
- hand_axe, reavers_axe, thirsting_axe
- war_bow, short_bow, broadhead_bow, opening_shot
- barrow_blade, sleet_blade, frostward_blade, glacier_blade
- war_hammer, horsemans_hammer, friars_mace
- rowan_staff, willow_staff, canopy_staff
- quickbeam_wand, hazel_wand, jolt_wand, chain_wand
- bardiche, halberd
- stormspear, the_witch_blade, eye_of_the_tempest, ember_palms
- mantis_claws, red_talons, cinder_wraps, rime_knuckles

**Statuses without an icon (25):**
- **The four new ones:** Bewildered, Brittle, Fixated, Owed.
- **Counters and states:** Edge, Relay, Surge, Ebb, Unseen (Vanguard and rear), Second thrust, Crowned, Mined, Ore, Outrider, Phylactery, Thornshield (and its power step's), Bare rock (and its power step's).
- **The mythics' states:** Watched, The long watch, Unseen (the unseen blade), Crimson crown, Deep winter, Bedrock heart.

Armor and offhand icons fall back to their kind's for every renamed piece (`ui/tools/gear_icons.py` still keys the old ids).

## 4. What changed from the design, and why

**The order.** The ladder, the pieces and the mythics landed as one commit. The new ladder takes a step off every legendary and mythic, so no commit between them could build. Kinds, the engine support, the versions, the formations and the documents are each their own commit.

**The engine.**
- Added: the four statuses, seven unit tests on what a unit wears and its own stats, ability rescaling, the HP trade and rewind, spread abilities, covers by tag and for the lowest ally, shared healing, picks by max HP, spared triggers, a share at a ratio, the size of a dodged hit, and abilities cast as one (for the Bard's mythic).
- Fixed: a remove skips an unremovable status even when it names it. So an on/off state that was also unremovable never turned off: Gorged claws, Spellbinder, four armor pieces, and states in my own mythics and formations. Lifted states are removable now.

**The pieces:**
- **Sparring staff's spar is a tap, not a hit.** As a hit, an ally's Thorns struck its own partner on every swing.
- **Drowsy draught** uses the real Stun and Hidden, at their own lengths. Statuses are universal, so the design's "15 ticks" isn't possible; the wake comes 10 ticks in.
- **Salted kite** halves every damaging status by name. A debt coming due (Owed) lands past damage-taken changes, so it isn't on the list.
- **Renamed:** Beacon plate (was the design's Lodestone plate) and Heckler's wand (was its Hushing wand). Each shared a name with a piece the same class can wear.
- **Reworded:** Penitent's mace, which read like Charnel icon.
- **Commons:** 58 of 72 renamed so their names say what their stat lines are. Each line is unique in the stock.
- **Kept:** Barrage's mana cards stay as the spine kept them (decision 2).

**The mythics are the design's sixteen.**
- The saint's last breath sets the Cleric to 30% HP at each fight's start, through its healing cap. That's the brink the design names, and it's harsh.
- Scales of the judge adds +150% where Judgement reads a buff or a debuff, and −50% where it reads neither, on top of whichever form of Judgement the Paladin trained.

**The versions:**
- Groundswell reads "never fires" in the piece check, because the check counts damage, heals and statuses, not cooldown changes. It works.
- Thornshield gives the other ally with the lowest HP% (not itself) Thorns equal to the knight's own.

**The formations:**
- The Shepherd covers every hit on the ally with the lowest HP%, whatever its size.
- Lifeline's share is damage of no type to the Lifeline.
- Bannerman's Banner is locked out of every action, and its allies read its Attack and Defense live: they lose them while it's down.
- The build parties take the new formations by rung (`tools/build-parties.ts`).

**The engines** (`builds.md`, rewritten):
- Dropped: the firecracker string (now Cold Snap's pack game, a thread), the vanishing blade and the stonecutter.
- Changed: the quake loses Fissure.
- Added: the bedrock (Bedrock heart), and the design's five new engines (the shield party, the borrowed hand, the open book, owed and the healer, the fixation line).
- The keystones table is rebuilt from the content's own tags.

**Documents.**
- Rewritten: `docs/rules.md`, `philosophy.md`, `builds.md`, `loot.md`, `classes.md` (kinds and every changed version), the vocabulary page (the four statuses, affliction, the Gear section) and the primer.
- Signposting is retired: each build's first rung is now *the first step*.

## 5. Samples

As the design chose them, with what I'm least sure of marked.

- **Kinds:** the Vampire in Plate; the Geomancer in Robes; the Pyromancer's mace; the Monk's staff.
- **Exotics:** Echoing wand, Owing mail, Effigy of exchange (the piece check shows it +101% damage against a boss: least sure), Diffusion orb, Idol of stillness, Mirror charm, Midnight blade.
- **Conditional:**
  - Twin dirk, Duellist's sword, Kinship charm, Conclave robes, Even-keel plate.
  - Pavise of the line with Phalanx pike, the shield party.
  - Woodpecker's crest, the new Brittle trophy (least sure: a crit set-up reads subtly).
- **Deeper threads:** Answering thunder (the Storm without Shock), Seeker's lantern (Bonfire without Burn), Miner's pick (Landslide without a Shield).
- **Mythics:**
  - The grand chord, the witch's cauldron, the unseen blade.
  - The saint's last breath (least sure: the 30% cap is a run-long brink).
  - Banner of the last keep (least sure: the plainest of the sixteen).
- **Versions:** Thornshield, Groundswell, Scything briar, Bare rock, Lure.
- **Formations:** Glass and stone, Bannerman, The still hour, Vanguard and rear, Lifeline.
- **Least sure, beyond these:**
  - Owed needs its waiting total read on the battle screen. It shows as a grey "OWED" number, and the bar stays until the debt comes due.
  - Ogre's tusk (+67% damage in the piece check) and Diffusion orb (+62%) are the loudest numbers.
  - "+N% while…" is the conditional pieces' most repeated form.
