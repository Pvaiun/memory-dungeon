# Step 5i, step 5: the build log

The trail for later sessions: what was decided while building, and every change from the design. `report.md` (at the gate) is what the director reads.

## Decisions

- **Oct 30, the lead:** the old loot is retired everywhere, free play and the retired campaign included (the director: "I would not keep any loot that we have now just for the sake of keeping it"). The campaign keeps running, without the rewards and needs that named retired items.
- **Oct 30, the lead:** "three trainings an opportunity" is three members trained once each, as the campfire's TRAIN already was (the brief: "the campfire's TRAIN already does").
- **Oct 30, the lead:** every engine addition is built in its full shape, the 14 that serve a single item included (the director: "Engine growing is totally fine"); their simpler shapes are flagged in the report (`engine-spec.md` section 4). Two items take the simpler shape because the full one can't reach them: Hammer and anvil's Mason (pieces' Shields aren't abilities) and Halo of the saint (a knocked-out unit can't hold a status).
- **Oct 30, the lead:** the spec's section 6 fixes stand for the items it names (Dawnblade, Phoenix ember, the Vial of the last breath, Halo of the saint, heals given read as `owner`, Ember heart and Eye of the tempest from `status_ended`, the Lightning rod on `area` hits, Horn of the keep on any Taunt, Gambler's coin about 50%).
- **Oct 30, the director:** control resistance counts Stun, Silence and Slow only, as designed. Weaken stays out: a boss Weakened all fight still acts, and its strength is the balance pass's.
- **Oct 30, the lead:** Marked's icon is a stand-in from the packs until the director's art arrives.

## Changes from the design, by share (for the report)

**Magical weapons:** Dawnblade's own return gives +8 Fervor (spec 6.1); the Lightning rod echoes `area` hits (spec 6.4); the Cinderheart staff's flare is Burn's own numbers at 20 stacks (about 350 a stack); the Brimming rod gives back about 7.5% of the listed cost while its own discount holds (it reads the MP paid); Dawnblade gains nothing while its wearer is down. Interface: icons for Spellbound and Sunburst.

**Physical weapons:** Weeping kris's and Still hand's conditional stacks as reaction tests (X3); Storm pike's ready waits for Charge at its cap; the Volley bow's count drops on its own cap; Charge removable so Storm pike can spend it. Engine needs passed on: Flurry wraps' chain replaces the plain Double strike roll (H); an application adding 0 stacks does nothing (W); `atMost` alone means at most (W).

**Upgrades, first eight:** the Valkyrie's `einherjar` passive (revives ready), Valhalla's `ready` and its text moved to it. Cover aims at a casting ally (no pick by wind-up left exists), else the lowest share; Watch the anchor is the ally with the most Aggro holding no Aegis; Ward of life raises one and shields another when both hold; Overgrowth removes itself before reapplying; Heartwood mail applies Briar's Bleed itself; Chains of light doesn't skip a Silenced foe; Resonance hits only foes holding Shock. Power steps ×1.4 exactly; every version tagged ●● (the fill gives builds, not worth); mythic kinds picked for art.

**Offhands:** Primer of frost in X20's shape, the card "a quarter more for every four stacks"; Earthmother totem by an aura that makes each ally's own Shields a third larger (the spine's addition 16, Shields received, isn't in the spec); Shield of the chosen raises a random fallen ally (the validator refuses a revive `to: owner`: wave 3); the timers and auras restart on a revive; Gatekeeper's kite reads Taunt on each hit; Hunter's buckler and Carrion idol count kills by hits only; Leech idol in the spec's simpler shape; the Vial of the last breath marked only on its own return; Annotated grimoire's free cast a marker. Least sure: Treatise on an area basic, the hungry dark's wasted beat on an unremovable buff, two Humbling shields sharing a marker, Crimson dregs on the hit that ends the last Bleed.
