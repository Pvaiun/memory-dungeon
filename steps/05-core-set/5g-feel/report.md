# Step 5g report: the feel pass

**Closed Oct 28, 2026, at the director's word:** "I actually think right now we're done this balance pass ... It actually works really well right now. I've just played a couple games. I'm going to move on to some other concepts." A good pass on feel; the director is happy with the result for now and will come back to it later. The round-10 hand-off (`handoff-round-10.md`) is kept as the starting point for that return, with its questions unanswered.

## What the step was

5f's balancing continued with the method changed (`intent.md`): rogue first, a fresh agent reading fights tick by tick after every round (`reader-sheet.md`, `reads/round-0.md` to `round-9.md`), short simulations beside each read (`npx tsx src/rogue-feel.ts`, five seconds), numbers rather than behaviour, and questions to the director one at a time. Nine rounds; the trail is `tuning.md`, one entry a round. Rounds 1 to 8 were driven by the reads and the director's answers; round 9 was the director's own list after ten runs of play.

## Where it landed

- **Pacing:** cooldowns 80% back toward main's with more variance (a quick word, 14 ticks, for the repeat applicators and top-ups; short 22, medium 30, long 40, very long 56; self-buffs on words longer than their duration); attack intervals back toward main's with a wider spread (dagger 5.6 to axe 12.8); wind-ups 1 / 3 / 6 / 8. Basic attacks are 63% of the party's actions (46% in round 8); casts chained with no basic between 18%, casts on an ally's tick 16%.
- **Cooldowns carry between fights** (engine 0.15), never reset, kept through an upgrade; **head starts zero**, adjustable per slot in Settings (HEAD START).
- **Potions and tonics:** a slot a kind (two potions, two tonics), a choice of one after every won fight, and the player picks who drinks.
- **Bosses with behaviours:** the Ogre Chief's Crush (its identity), the Reaper's Reap and Doom, the Silent One's Tolling and Quiet, the Fire Giant's Kindle then Inferno, the Storm Queen's Tempest; signature moves two or three times a fight. The enemy pass of 5f's intent: multi-bite wolves, foes that take aim, brace, ward, slam; every foe with Armor and themed elemental resistance.
- **Statuses:** Burn uncapped (the 5f cap was a sledgehammer), Fire; Shock Lightning; Chill a slow that shatters at 12 (Ice damage, a Stun), thawing slowly; Sunder +1.5% damage taken a stack; Regen and Clarity big enough to see; Might a ramp with upkeep.
- **Classes:** the Bard reworked (HP and Armor 3, Refrain heals and gives MP from its swings, War ballad, Allegro, Thunder chord); Frost arrow for Fire arrow; the Frostweaver's Shatterpoint; Cure a quick top-up; crits rarer and smaller.
- **Bugs found and fixed:** the Geomancer's and Assassin's crits dealt ×1.0 since the first build; the Cleric's Last rites never switched off; Burn's removed cap still referenced; a heal of 0 logged.
- **Engine 0.15** (from 0.13): `slotShares`, an ability's `if` as several conditions, `mpBelow` / `mpAtLeast`, `status_capped`, the `owner` target, cooldown carry.

## What was not done (for the return)

- The questions in `handoff-round-10.md` (Unmake, Thunder chord, Rockfall, Shield bash, Blood gift) and its proposed round 10 (foes swinging bigger and slower so party Armor doesn't eat minion hits, Siphon halved, the Vampire's costs, Soulfire and Crush under a wall's max HP, act-2 elites, Chill tagged Ice).
- A correction on record: Armor takes 22% / 35% / 41% off the party's physical hits on minions / elites / bosses, not "a tenth" as the designer said mid-step; foes' small swings lose 47% to the party's Armor.
- The knobs: the rogue's were recalibrated in round 9; the campaign's were not re-tuned on the round-9 numbers, and `npm run balance` was not re-run.
- Still open from the reads: fights that run on after they are decided, casters dead before half-time, Burn's long tail, Shock's size set by the foe's speed, the Hoplite's rare swings, heals on allies who don't need them, the engine taking the first ready ability by slot order.
