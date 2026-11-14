# The balance pass: the report

The director's method (`intent.md`): sample parties against chosen fights, a quick knob baseline, fight reads, player-side fixes, then the same scales on the rest. Done in that order, with no gates. Measured with `npx tsx tools/build-test.ts` (the 27 build routes at three rungs, from rolled starts) and read with `npx tsx tools/rogue-feel.ts --builds`. This is the starting point for the next agent's whole-run tuning.

## 1. For the director

1. **Goading totem** (on the director's word): every foe it calls is Weakened as it swings. Without Weaken or Shock on the field it lost in every tier; now, on a Bramble knight alone, it pays a little (rung 2's regular fights 9% to 6%, elites 51% to 45%), and more where the Storm's Shock is. The build parties wear it again.
2. **Trainings are worth little beside loot.** Taking one item away, in points of HP a fight (a loss 100): a power step 0.7, a version 0.6, a piece 3.1, a formation 6.2, a mythic 7.7. Every power step is the same ×1.4 (`POWER`), and 46 of 62 never move a result. Raising it changes 64 upgrades and their card text at once. **Rule:** raise `POWER`, or leave trainings small.
3. **Boss losses aren't close.** The boss keeps 39–47% of its HP when the party falls, on average. The cause is the spread between parties: weak routes get crushed while strong ones win 8 of 8, and a boss's great blow (Crush, Hailstorm, Reap) one-shots a full-HP caster. A neutral boss shape (0/0 in place of −40% HP, +30% damage), with the knobs set again, left losses just as lopsided and fights 25% longer, so the shape is unchanged. Closing the gap between routes is the lever; the casters' HP against bosses' big blows is the other. **Flag** for the whole-run tuning.
4. **The free fights don't yield to nerfs** (the director asked for the parties to be nerfed; this is what that found).
   - **Sustain in act I.** Blood Pact's rung 1 and the Cleric–Vampire Barrage pay 0–1% a regular fight. Their healing is two to three times what act I's foes deal: Shared cup's overflow halved, Mercy's edge, Mender's mace and Lamprey claws trimmed, and the total healed barely fell (125%, 48% and 57% of max HP a fight), because the other heals took up what those had covered (Cure 26% to 31%, Absolve 22% to 28%). With the Vampire's Lifesteal switched off as a probe, or Cure on a slower cooldown, they still paid 0–2%, and the slower Cure cost the Toll's Cleric route every rung 2 boss. Heals are sized by the healer's stats and don't grow with the act, while the foes do: the same parties pay 21–42% in act II. Even from full HP they pay 3–4% in act I.
   - **Walls in act III.** Rung 3 Landslide and the Toll pay 4–5%. Taken away whole, Banner of the last keep is worth 12–13 points of a regular fight and Thornheart plate 19; cut (the Banner ×1.5, the plate 25% + 2% a Spite, from 33% + 5%, which was 133% of a blow at full Spite) they barely move it, since what's left still outmatches the fights. The cuts bring those parties down at bosses (Landslide's rung 3 96% to 93%, the Toll's 57% to 50%).
   - **What does move it: harder, shorter fights.** Regular fights and elites at −20% HP and +30% damage on top of their knob (today +40% HP, −10% damage), set again to the same costs: act I's free parties pay 5% and 10% (were 1% and 2%), the spread of costs between parties narrows about a fifth in act I, act III's walls don't move, and fights run about 12% shorter (at −40%/+60%, a third shorter). Not taken: it changes every fight's length, not these parties. **Rule:** the middle shape, the full one, or leave the free fights.
5. **Five changes of what something does** (the pass's rule: only where numbers couldn't do it):
   - **The cathedral:** the Soloist's first ability 75% shorter, not no cooldown. With none, a Crescendo hit its cap in a few ticks and Siphon on the swollen hits paid the mana back: rung 3 Barrage ended every fight in 9 ticks.
   - **The still hour:** abilities also cost 40% less, so its casters don't stand idle once their mana runs out.
   - **Encore** is ready only while another ally stands (its versions too, but Cadenza): alone, the Bard fizzled it at every turn.
   - **Wick** passes 50% of a fallen foe's Burn, not all of it: one cast walked a whole pack, and Bonfire's worst fight became its easiest.
   - **Goading totem** Weakens the foes it calls (decision 1).
6. **An engine bug, fixed:** a live stat change that reads the unit in a seat was never applied, so Bannerman's Bearers never gained the Banner's Attack and Defense. Bannerman went from 20 points under Neutral to 5 over. Engine 0.26.

## 2. What was done

**The baseline.** Each fight's knob set against its act's build parties (`tools/build-calibrate.ts`): regular fights about a sixth of a party's HP (less in act I), elites nearly a third (a loss counting whole), bosses won 60% (was 70%). Set twice: once at the start, and again after the fixes, so the whole-run tuning starts from the fixed parties. The build test gained a by-tier table and reads the boss's own HP left in a loss.

**The reads.** Six readers, 54 fights (two routes of each build, a regular fight, an elite and a boss each, picked from the outliers), against the build cards (`out/reads/notes-*.md`). Two more read the six most-changed parties after the fixes (`out/reads2/`). What they found, and what came of it:

| Found | Done |
| --- | --- |
| The build parties' own misplacements: Bannerman's never-acting Banner seat held the healer or a caster; Halved heart on healers and frail casters; Blood vial beside Flagellant's vestments (a Bard pinned under the 10% floor, never casting); Bell of the hour with a self-Haste first | The filler seats the wall under the colours, skips those pieces there (`MISFIT`), and slots damage first under Bell of the hour |
| Rung 3 Barrage: fights over in 9 ticks | The cathedral (above) |
| Cold Snap's rung 3: casters idle 60 ticks under The still hour | The still hour (above); still weak (below) |
| Bannerman worse than Neutral | The engine bug (above) |
| Bonfire walking packs; Slow burn +36 Burn for 450 MP | Wick (above); Slow burn 1.5× Firebolt's Burn, not 2×; Conflagration several, not many |
| The Stormcaller dry by tick 16 on two buffs that did nothing | Thunderstorm 450 MP and Static charge 325, not 650 |
| Shock pinned at its cap by tick 10 | Arc's Shock halved changed nothing, so not kept: the cap fills from every source |
| Encore fizzling alone | Encore (above) |
| Gale storm about 90 a cast | Gale spear's hits 0.12 of Attack, not 0.09 |

**The value pass.** From the balance sheet (`npm run balance`) and the ablation:
- Gale spear and Othismos sized up into the sheet's band (each dealt about one swing a cast; Othismos 30% more): both flags gone.
- Encore's fizzles: the flag gone.
- Tidal's tide evened (Surge hits +10%, Ebb 40% slower): 23 points over Neutral to 18, still over its band (Bonfire hardly notices the Ebb, since Burn ticks on while the party slows).
- Pyre 800 MP, not 1,000: it still comes 0.7 times a boss fight, so its cooldown and wind-up hold it, not mana; the change only frees the Pyromancer's other casts.
- Frost armor (Blizzard A) at 650 MP, not Blizzard's 1,000: a Guard that deals nothing starved the Frostweaver's damage late in long fights.
- Shieldmaiden's versions paid more for giving up the Valkyrie's own Shield (Chooser of the slain +40%, Shield-sister 35%); both still worse to have than the base (−7.6, −2.7), since her own Shield is what keeps her standing.
- At the director's word, the free-fight parties' biggest pieces, by numbers: Shared cup passes on 50% of the healing past full; Mercy's edge heals 20% of the damage (was 33%), Mender's mace 12% of max HP (20%), Lamprey claws 5% (10%); Banner of the last keep Max HP ×1.5 (×2); Thornheart plate sends back 25% + 2% a Spite (33% + 5%). What they did and didn't do is decision 4.
- Classes, rogue mode (measured before the last round: the goad, the sustain and wall trims): −8.8 (Bard) to +8.0 (Bramble knight), the Bard, the Stormcaller and the Cleric just past the band's −8; free play wider, as before.

Enemies are unchanged: no boss is beyond most builds once the parties were fixed (at most 2 of the 9 builds under 25% against any one).

## 3. Where it stands

The formation parties on their own act's fights (`out/build-test/report.md`, By tier): win rate and mean cost; bosses, win rate.

| | Regular | Elite | Boss |
| --- | --- | --- | --- |
| Act I, before | 100%, 18% | 96%, 28% | 44% |
| Act I, now | 100%, 14% | 98%, 25% | 61% |
| Act II, before | 99%, 24% | 89%, 43% | 31% |
| Act II, now | 100%, 17% | 97%, 31% | 60% |
| Act III, before | 84%, 39% | 70%, 53% | 19% |
| Act III, now | 99%, 19% | 88%, 34% | 60% |

Bosses by build, now (rung 1 / 2 / 3); before the fixes, at the same targets, in brackets where it moved:

| Build | Bosses | Note |
| --- | --- | --- |
| Landslide | 53 (44) / 69 / 93 (98) | best fight bosses, by its card; rung 3 too strong, its regular fights 4% |
| Thousand Cuts | 83 / 52 / 44 (56) | |
| Bonfire | 78 / 96 / 91 | best fight a lone boss; no worst fight shows (packs cost it 13–16%) |
| Cold Snap | 81 / 59 / 24 (7) | rung 3 weak: its Rangers can't swing in The still hour (Neutral wins 80% of its fights); late mana |
| The Storm | 94 / 44 (41) / 26 (31) | worst fight a lone boss, by its card; rung 1 too strong |
| The Hunt | 28 / 54 (50) / 70 | worst fight a lone boss; rung 1's two wall-less routes |
| The Toll | 31 (19) / 35 (28) / 50 (17) | worst fight a boss that barely swings; rung 3's regular fights 5% |
| Barrage | 42 / 54 / 54 (74) | rung 3 no longer a 9-tick nuke |
| Blood Pact | 58 / 81 / 89 | act I's regular fights free (decision 4) |

**How sure.** Six seeds a fight, 18–36 fights a party a tier: a build's boss rate moves ±10 points from seed to seed. The reads are 72 fights in all, picked from the outliers.

**What the reads still see** (`out/reads2/notes-*.md`): Bonfire's Burn sits high rather than rising and sagging; the Storm's Hoplite dies by tick 24 and acts once; Cold Snap's rung 3 boss fights stall to the enrage once its mana runs out; Barrage's Bard casts under once a fight before its Soloist has won; the Pact's Bard rides under 20% HP in long fights (Lifeline's drip and Defense 0); Thousand Cuts' rung 3 reads as a Burn party (the Monk carries).

## 4. For the next agent

- **Start from here:** the knobs are this pass's baseline (`content/core-set/rogue-knobs.json`, `TARGETS` in `tools/build-calibrate.ts`). The whole-run tuning sets the bosses and evens the regions (`npm run rogue`, `rogue:tune`); `docs/rules.md` has the director's rulings (fights by cost; difficulty aims hard).
- **The spread is the problem, not the mean.** Every tier is on target on average, but bosses run from 20% to 96% by build. The cards make some of that by design (Bonfire, Landslide and Cuts best against bosses; the Storm, the Hunt and the Toll worst), but not this much.
- **Least sure:** the Tidal and Shieldmaiden changes (small, by the sheet and the ablation, not read); the goad (decision 1); Cold Snap's rung 3, which is partly the test party's formation.
- **Cost counts a fight-start cap.** Halved heart and The saint's last breath read as worse to have (−10.5, −9.4) because the build test counts the HP they cut at a fight's start as its cost; in a run that's paid once and carried.
