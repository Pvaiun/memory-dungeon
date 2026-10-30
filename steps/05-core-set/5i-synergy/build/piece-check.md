# Piece check

608 items, 695 parties (each item's and its control), 12 fights (bandit_camp -2, wolf_pack 150, war_camp -7, ogre_chief 50, dark_hall 137, imp_kennel 31, frost_trolls 12, fire_giant -3, coven 116, storm_front 138, lich_court 115, storm_king 65) × 3 seeds = 36 fights a party, 25020 fights in 40 s on 4 workers. Engine 0.17, content core_set#ecc1f0117186a376.

| share | items | can't field | crash | loop | never fires | no effect | wrong way | weaker than its base | untested | static |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Physical weapons | 48 |  |  |  |  |  |  |  |  | 16 |
| Magical weapons | 40 |  |  |  |  |  |  |  |  | 9 |
| Armor and amulets | 72 |  |  |  | 1 | 1 |  |  |  | 25 |
| Offhands | 80 |  |  |  |  |  |  |  |  | 20 |
| Formations | 32 |  |  |  |  |  |  |  |  | 6 |
| Upgrades, part 1 (and mythics) | 168 |  |  |  | 3 |  |  |  | 8 | 11 |
| Upgrades, part 2 (and mythics) | 168 |  |  |  |  |  |  |  |  | 0 |

Static: nothing in it should leave a trace of its own (stats, boosts and the like); it's judged by its effect on the fights only. Fires: its statuses' traces a fight past the control's (a hook run, a status gained in the fight, its damage, heal or MP, a strike, a shield soaking or breaking, a block, a cover). In the per-item tables, each status shows its traces a fight with the control's in brackets. Casts: a form's casts a fight, and per cast the damage dealt (d), healing (h) and statuses applied (a: applications, not stacks), against its base's. Δ: the party with the item against the control, over the ticks both fights lasted (taken: the share of its max HP lost); ± is one standard error. Won: fights won, item/control.

## Physical weapons (48)

No problems.

| item | rarity | carrier | fires | its statuses, a fight | casts | Δdealt | Δtaken | Δheal | Δticks | won |
|---|---|---|---:|---|---|---:|---:|---:|---:|---|
| keen_dirk | common | hexer | static | - |  | +0% ±0 | +0% ±0 | +0% | +0 | 8/8 |
| parrying_dagger | common | assassin | static | - |  | +1% ±1 | -3% ±1 | -5% | +2 | 10/11 |
| weeping_kris | uncommon | assassin | 15.03 | bleed 21.56 (7.44), weeping_kris 3.61, weeping_kris_mark 2.53 |  | +9% ±1 | -3% ±1 | -1% | -0 | 8/7 |
| misericorde | uncommon | assassin | static | - |  | +5% ±1 | -2% ±1 | +0% | +1 | 8/5 |
| notched_knife | rare | assassin | 14.03 | bleed 29.33 (7.44) |  | +19% ±3 | -2% ±1 | -2% | -3 | 10/7 |
| marking_knife | rare | assassin | 6.19 | marked 6.19 |  | +8% ±2 | -2% ±2 | +0% | -1 | 10/8 |
| thousandth_cut | legendary | assassin | 15.44 | thousandth_cut 7.72, cuts 7.72 |  | +2% ±0 | 0% ±0 | +0% | -0 | 8/7 |
| quietus | legendary | assassin | static | - |  | +8% ±3 | -2% ±2 | +0% | -1 | 11/9 |
| mantis_claws | common | monk | 1.81 | double_strike 3.22 (1.42) |  | +5% ±2 | -5% ±2 | +6% | +1 | 10/7 |
| red_talons | common | vampire | 2.33 | lifesteal 15.19 (14.58) |  | +4% ±1 | +3% ±1 | +33% | +3 | 19/17 |
| wildcat_claws | uncommon | monk | 2.31 | haste 5.17 (3.86), wildcat_claws 1 |  | +15% ±2 | -5% ±1 | -8% | -5 | 16/13 |
| brass_knuckles | uncommon | vampire | 5.06 | sunder 3.86 (2.03), double_strike 1.64, brass_knuckles 1.58 |  | +4% ±1 | 0% ±1 | +0% | -3 | 13/13 |
| rime_knuckles | rare | monk | 12.72 | chill 19.44 (6.47), stun 2.17 (1.19) |  | +31% ±5 | -10% ±2 | +16% | +3 | 12/4 |
| gorged_claws | rare | vampire | 23.36 | lifesteal 20.78 (18.78), gorged_claws 20.61, gorged_claws_on 1.69 |  | +3% ±1 | +3% ±1 | +24% | +0 | 15/13 |
| flurry_wraps | legendary | monk | 5.33 | flurry_wraps 5.33, double_strike 0 (1.42) |  | +8% ±2 | -2% ±1 | -1% | -1 | 8/7 |
| still_hand | legendary | monk | 9.61 | sunder 18.58 (14.14), still_hand 5.17 |  | +7% ±2 | -3% ±2 | +0% | +1 | 13/11 |
| arming_sword | common | knight | static | - |  | +3% ±1 | -2% ±1 | +0% | -1 | 12/12 |
| gilded_sword | common | knight | static | - |  | +2% ±1 | -2% ±1 | +0% | +2 | 10/8 |
| clarion_blade | uncommon | knight | 1.94 | taunt 2.47 (1.53), clarion_blade 1 |  | +8% ±3 | -15% ±2 | +0% | +3 | 23/17 |
| nettle_blade | uncommon | bramble_knight | 2.18 | thorns 14.56 (15.39) |  | +4% ±1 | -2% ±1 | -1% | -1 | 18/17 |
| sweeping_blade | rare | bramble_knight | 1.39 | sweeping_blade 1.39 |  | +1% ±0 | -2% ±1 | +5% | +1 | 19/17 |
| drawn_steel | rare | assassin | 3 | drawn_steel_first 2, drawn_steel 1 |  | +14% ±4 | -3% ±2 | +0% | +1 | 12/9 |
| oathkeeper | legendary | bramble_knight | 2.81 | oathkeeper_sweep 1.58, oathkeeper 1.22 |  | +1% ±1 | 0% ±0 | +2% | -0 | 18/17 |
| gravemark | legendary | assassin | 5.58 | gravemark 2.83, marked 2.75 |  | +4% ±1 | 0% ±1 | +0% | +0 | 8/7 |
| ironwood_spear | common | hoplite | static | - |  | +9% ±1 | -3% ±1 | -5% | -2 | 11/10 |
| partisan | common | valkyrie | static | - |  | +5% ±1 | -1% ±1 | +0% | +1 | 6/5 |
| ox_tongue_spear | uncommon | hoplite | 0.39 | sunder 12.58 (12.25), ox_tongue_spear 0.39 |  | +1% ±0 | +0% ±0 | +0% | +0 | 8/8 |
| trophy_spear | uncommon | valkyrie | 1.03 | guard 3.42 (2.89), trophy_spear 0.5 |  | +8% ±1 | -2% ±1 | +0% | -0 | 8/7 |
| hunting_spear | rare | valkyrie | 0.19 | hunting_spear 0.19 |  | +0% ±0 | +0% ±0 | +5% | +0 | 8/8 |
| glaive | rare | valkyrie | 5.11 | glaive 5.11 |  | +4% ±1 | -2% ±1 | -1% | -2 | 8/7 |
| pike_wall | legendary | hoplite | 24.5 | pike_wall 24.5 |  | +37% ±4 | -9% ±2 | -19% | -9 | 15/10 |
| storm_pike | legendary | valkyrie | 40.42 | storm_pike 18.75, charge 15.89, storm_pike_ready 5.78 |  | +8% ±1 | -2% ±1 | +0% | -1 | 9/7 |
| recurve_bow | common | ranger | static | - |  | +19% ±2 | -2% ±1 | +0% | -2 | 13/5 |
| yew_bow | common | ranger | static | - |  | +1% ±1 | -2% ±1 | -3% | -1 | 14/13 |
| snaring_bow | uncommon | ranger | 6.53 | snaring_bow 5.31, slow 1.64 (0.42) |  | +19% ±3 | -9% ±1 | +3% | +2 | 17/13 |
| broadhead_bow | uncommon | ranger | 2.75 | bleed 23.69 (20.72), broadhead_bow 0.78 |  | +15% ±2 | -4% ±2 | +0% | -0 | 10/5 |
| huntsmans_bow | rare | ranger | 2.81 | marked 2.81 |  | +4% ±2 | 0% ±1 | +0% | -1 | 8/8 |
| frostbite_bow | rare | ranger | 4.64 | chill 15.25 (11.83), sunder 4.58 (3.5), stun 1.47 (1.11) |  | +8% ±3 | -1% ±2 | +0% | +1 | 7/5 |
| volley_bow | legendary | ranger | 12.25 | volley_bow_volley 4.94, volley_bow 4.03, volley_bow_count 3.28 |  | +4% ±1 | -3% ±2 | +0% | -2 | 9/9 |
| executioners_longbow | legendary | ranger | static | - |  | +1% ±0 | -1% ±0 | +0% | -0 | 9/8 |
| bearded_axe | common | geomancer | static | - |  | +4% ±1 | -1% ±0 | +0% | -2 | 9/9 |
| poleaxe | common | knight | static | - |  | +8% ±1 | -7% ±1 | +3% | +2 | 11/11 |
| roaring_axe | uncommon | hoplite | 2.86 | might 3.22 (1.36), roaring_axe 1 |  | +13% ±1 | -5% ±1 | +0% | -3 | 10/9 |
| ironbound_hammer | uncommon | geomancer | 6.28 | shield 15.36 (10.08), ironbound_hammer 1 |  | +3% ±1 | -10% ±1 | -8% | +3 | 9/8 |
| icebreaker | rare | geomancer | static | - |  | +7% ±2 | -1% ±1 | +0% | +0 | 10/9 |
| heartsplitter | rare | hoplite | static | - |  | +8% ±1 | -7% ±1 | +0% | -0 | 10/9 |
| cornerstone_maul | legendary | hoplite | static | - |  | +1% ±1 | 0% ±0 | +0% | -0 | 9/9 |
| worldbreaker | legendary | knight | 0.97 | stun 2.28 (1.31) |  | +9% ±2 | -9% ±2 | +2% | +3 | 11/11 |

## Magical weapons (40)

No problems.

| item | rarity | carrier | fires | its statuses, a fight | casts | Δdealt | Δtaken | Δheal | Δticks | won |
|---|---|---|---:|---|---|---:|---:|---:|---:|---|
| runed_saber | common | valkyrie | static | - |  | +6% ±1 | -1% ±1 | +2% | -1 | 16/14 |
| cairn_blade | common | geomancer | static | - |  | +7% ±1 | -2% ±1 | +0% | -1 | 10/9 |
| wayfinder | uncommon | paladin | static | - |  | +2% ±1 | +1% ±1 | +7% | +0 | 16/16 |
| sigil_blade | uncommon | hexer | 2 | ward 1.31 (0.31), sigil_blade 1 |  | +1% ±1 | -2% ±1 | +0% | +1 | 13/13 |
| spellbinder | rare | hexer | 5.47 | spellbound 2.81, spellbinder 2.67 |  | +6% ±2 | -2% ±1 | +3% | +2 | 5/4 |
| bane_of_the_bound | rare | hexer | static | - |  | +1% ±1 | -1% ±0 | +0% | +0 | 13/13 |
| hexblade | legendary | hexer | 13.86 | burn 90 (86.97), shock 20.78 (18.19), chill 10.92 (6.11), sunder 4.47 (2.31) |  | +7% ±2 | -6% ±2 | +0% | -1 | 20/18 |
| dawnblade | legendary | valkyrie | 1.75 | dawnblade 0.89, fervor 0.86 |  | +1% ±0 | 0% ±0 | 0% | +0 | 5/5 |
| morningstar | common | cleric | static | - |  | +5% ±2 | 0% ±1 | +4% | +0 | 11/10 |
| friars_mace | common | cleric | 17.69 | mp_regen 79.56 (44.17) |  | +1% ±2 | 0% ±1 | +23% | +2 | 11/8 |
| menders_mace | uncommon | cleric | 5.83 | regen 17.78 (9.42), menders_mace 1 |  | +1% ±1 | -3% ±1 | +14% | +3 | 22/21 |
| priors_mace | uncommon | paladin | 2.33 | ward 3.47 (2.14), priors_mace 1 |  | +9% ±1 | -2% ±1 | +23% | +1 | 14/13 |
| humbling_mace | rare | paladin | 7.72 | weaken 5.31 (1.64), humbling_mace 4.06 |  | +3% ±2 | -4% ±1 | -2% | +3 | 12/10 |
| censer_mace | rare | cleric | 7.94 | censer_mace 7.94 |  | +3% ±1 | +2% ±1 | +18% | +3 | 10/9 |
| sunhammer | legendary | paladin | 13.44 | burn 64.69 (54.92), sunhammer 3.61, sunburst 3.47 |  | +16% ±3 | -6% ±1 | -5% | -3 | 14/13 |
| martyrs_maul | legendary | cleric | 4.14 | martyrs_maul 4.14 |  | +4% ±1 | -1% ±1 | +6% | -0 | 10/9 |
| whipcrack_wand | common | bard | 1.14 | double_strike 2.36 (1.22) |  | +14% ±3 | -1% ±1 | +21% | +1 | 11/8 |
| birch_wand | common | bard | static | - |  | +20% ±2 | -3% ±1 | +6% | -6 | 14/12 |
| jolt_wand | uncommon | bard | 10.58 | shock 43.47 (38.25), jolt_wand 5.22 |  | +5% ±1 | -1% ±1 | +1% | -3 | 21/19 |
| glint_wand | uncommon | pyromancer | 0.67 | glint_wand 0.67 |  | +1% ±0 | +0% ±0 | +0% | +0 | 7/7 |
| spark_wand | rare | pyromancer | 9.62 | burn 93.39 (95.67), spark_wand 3.28 |  | +7% ±1 | -2% ±1 | +0% | -3 | 21/18 |
| chain_wand | rare | pyromancer | 3.06 | chain_wand 3.06 |  | +2% ±1 | 0% ±1 | +0% | +1 | 7/7 |
| flicker_wand | legendary | bard | 7.44 | shock 23.39 (19.08), double_strike 3.42 (1.22), flicker_wand 2.11 |  | +8% ±2 | -1% ±1 | -3% | -1 | 9/8 |
| wildmagic_wand | legendary | bard | 42.75 | shock 46.44 (40.67), burn 34.75 (11.47), wildmagic_wand 10.69, bleed 7.86 |  | +11% ±2 | -4% ±2 | -2% | +2 | 12/12 |
| dowsing_rod | common | frostweaver | 5.58 | mp_regen 37.33 (26.17) |  | +0% ±0 | 0% ±0 | -1% | +0 | 4/4 |
| ironbark_rod | common | frostweaver | static | - |  | +14% ±3 | -10% ±2 | -2% | +2 | 13/8 |
| sleet_rod | uncommon | frostweaver | 5.25 | chill 15.86 (12.97), sleet_rod 2.25, stun 1.61 (1.28) |  | +8% ±2 | -1% ±2 | +0% | +1 | 8/5 |
| cistern_rod | uncommon | stormcaller | 11.94 | clarity 6.81, cistern_rod 4.17, cistern_spent 0.97 |  | +6% ±2 | -4% ±1 | -12% | -0 | 19/18 |
| glacial_rod | rare | frostweaver | 6 | slow 3.19 (0.08), glacial_rod 2.89 |  | +6% ±3 | -6% ±2 | +0% | +4 | 4/2 |
| lightning_rod | rare | stormcaller | 9.69 | lightning_rod 9.69 |  | +4% ±1 | -3% ±1 | -5% | -1 | 19/18 |
| winters_chain | legendary | frostweaver | 4.28 | chill 14.78 (11.83), winters_chain 1.44, stun 1.19 (1.11) |  | +5% ±2 | -2% ±1 | +0% | +2 | 7/5 |
| brimming_rod | legendary | frostweaver | 4.89 | brimming_rod 4.89 |  | +3% ±2 | 0% ±0 | -2% | +1 | 4/4 |
| ashwood_staff | common | frostweaver | static | - |  | +27% ±3 | -10% ±3 | +15% | +3 | 11/4 |
| moonwater_staff | common | pyromancer | static | - |  | +12% ±3 | -1% ±1 | -4% | -3 | 17/15 |
| shepherds_staff | uncommon | cleric | 7.22 | clarity 20.17 (9.03), shepherds_staff 1 |  | +6% ±2 | -4% ±2 | +23% | +2 | 17/15 |
| canopy_staff | uncommon | cleric | 9.22 | shield 18.28 (10.06), canopy_staff 1 |  | +7% ±3 | -12% ±2 | +9% | +5 | 12/8 |
| banked_staff | rare | frostweaver | 0.81 | burn 40.08 (39.78), shock 20.33 (21.89), chill 6.92 (5.94), stun 1.5 (1.19) |  | +18% ±3 | -7% ±2 | +13% | +3 | 8/4 |
| rootstaff | rare | bramble_knight | 25.97 | thorns 26.03 (23.03), rootstaff 24.44 |  | +22% ±4 | +1% ±3 | +75% | +3 | 24/18 |
| cataclysm_staff | legendary | pyromancer | 5.31 | cataclysm_staff 2.89, cataclysm_count 2.42 |  | +5% ±1 | -1% ±1 | -2% | -1 | 9/8 |
| cinderheart_staff | legendary | cleric | 8 | cinderheart_staff 8 |  | +0% ±0 | +0% ±0 | +0% | +0 | 11/11 |

## Armor and amulets (72)

| item | carrier | problem | detail |
|---|---|---|---|
| batwing_charm (uncommon) | bard | never fires | no trace of its hooks |
| echo_charm (rare) | bard | no effect | every fight identical to the control |

| item | rarity | carrier | fires | its statuses, a fight | casts | Δdealt | Δtaken | Δheal | Δticks | won |
|---|---|---|---:|---|---|---:|---:|---:|---:|---|
| ironclad | common | geomancer | static | - |  | +9% ±1 | -3% ±1 | +0% | -2 | 9/8 |
| crested_plate | common | knight | static | - |  | +3% ±1 | -4% ±1 | +0% | +1 | 19/17 |
| bristled_plate | common | knight | 27 | thorns 27 |  | +9% ±1 | -5% ±1 | -7% | -3 | 11/10 |
| portcullis | uncommon | knight | 48.56 | thorns 34.17, portcullis 13.39, portcullis_on 1 |  | +7% ±2 | -2% ±2 | +0% | -8 | 10/8 |
| keystone_cuirass | uncommon | hoplite | static | - |  | +3% ±1 | -1% ±1 | +0% | -0 | 9/8 |
| holdfast | uncommon | hoplite | 12.67 | holdfast 10.81, guard 2.19 (1.19), holdfast_used 0.86 |  | +1% ±2 | -3% ±1 | +3% | +0 | 11/10 |
| bastion_plate | rare | geomancer | 1.97 | guard 3.86 (2.89), bastion_plate 1 |  | +5% ±1 | -3% ±1 | +0% | -1 | 7/6 |
| hoarfrost_plate | rare | geomancer | 15.78 | chill 14.83 (6.47), hoarfrost_plate 7.61, stun 2.42 (2.19) |  | +5% ±1 | -5% ±2 | +0% | -2 | 10/9 |
| challengers_plate | rare | paladin | 2.39 | taunt 2.17 (0.94), challengers_plate 1.17 |  | -11% ±3 | -2% ±1 | -45% | -2 | 8/15 |
| rubble_plate | legendary | knight | 32.83 | shield 27.17 (19.25), rubble_plate 24.92 |  | +44% ±5 | -15% ±2 | +0% | -10 | 16/6 |
| thornheart_plate | legendary | knight | 48.03 | thorns 23.31, thornheart_plate 12.36, spite 12.36 |  | +5% ±2 | -2% ±1 | +0% | -3 | 14/13 |
| last_bastion | legendary | bramble_knight | 8.44 | last_bastion 5.69, guard 2.19 (1.56), last_bastion_floor 1.56, last_bastion_on 0.56 |  | +4% ±1 | -3% ±1 | +1% | +1 | 18/18 |
| inscribed_hauberk | common | hexer | static | - |  | +5% ±1 | -5% ±2 | +0% | +1 | 10/8 |
| lamprey_mail | common | vampire | 1.58 | lifesteal 23.31 (20.44) |  | +7% ±1 | -2% ±1 | +30% | +6 | 10/9 |
| thick_byrnie | common | valkyrie | static | - |  | +6% ±1 | -5% ±1 | +10% | +4 | 8/5 |
| tithing_hauberk | uncommon | vampire | 18.11 | tithing_hauberk 18.11 |  | +4% ±1 | +1% ±1 | +13% | -3 | 15/13 |
| reprisal_hauberk | uncommon | bramble_knight | 18.11 | reprisal_hauberk_mark 10.42, reprisal_hauberk 7.69 |  | +8% ±2 | -7% ±1 | +38% | +1 | 22/17 |
| silvered_hauberk | uncommon | hexer | 2.5 | silvered_hauberk_on 1.5, silvered_hauberk 1 |  | +16% ±3 | -6% ±2 | +0% | -1 | 15/11 |
| static_mail | rare | bramble_knight | 14.83 | shock 44.92 (37.81), static_mail 7.64 |  | +1% ±0 | -1% ±1 | -1% | -0 | 18/17 |
| mocking_mail | rare | vampire | 2.22 | taunt 3.64 (2.47), mocking_mail 1.06 |  | -3% ±3 | +5% ±2 | +7% | +0 | 9/9 |
| bloodsworn_mail | rare | vampire | 36.89 | bloodsworn_mail 31.11, lifesteal 22.17 (20.44), bloodsworn_mail_on 2.47 |  | +6% ±2 | +2% ±1 | +17% | +4 | 8/9 |
| sanguine_mail | legendary | vampire | 35.86 | sanguine_mail 32.67, sanguine_mail_on 3.19 |  | +2% ±1 | +1% ±1 | +15% | +4 | 10/9 |
| mantle_of_the_fallen | legendary | valkyrie | 3.94 | might 1.72 (0.5), guard 1 (0.11), mantle_of_the_fallen 0.94, haste 0.94 (0.06) |  | +4% ±1 | -1% ±0 | 0% | +2 | 5/5 |
| hexweave_mail | legendary | hexer | static | - |  | +1% ±1 | 0% ±0 | +0% | +0 | 16/16 |
| tumblers_vest | common | monk | static | - |  | +15% ±3 | -8% ±2 | +7% | +2 | 12/7 |
| footpads_jerkin | common | ranger | static | - |  | +11% ±1 | -2% ±1 | +0% | -0 | 8/5 |
| spotters_coat | common | ranger | static | - |  | +0% ±1 | +0% ±0 | +0% | -0 | 5/5 |
| couriers_coat | uncommon | bard | 8.36 | couriers_coat 6.36, haste 4.5 (3.47), couriers_coat_used 0.97 |  | +6% ±2 | 0% ±1 | +31% | +0 | 8/7 |
| mottled_hide | uncommon | assassin | 5.42 | mottled_hide 4.75, mottled_hide_on 0.67 |  | 0% ±1 | -2% ±1 | +3% | +2 | 7/7 |
| warpaint_jerkin | uncommon | monk | 2.97 | might 2.39 (0.42), warpaint_jerkin 1 |  | +1% ±0 | -1% ±0 | +0% | +0 | 8/8 |
| duelists_leathers | rare | monk | 6.78 | duelists_leathers 6.78 |  | +9% ±3 | -8% ±2 | +1% | +2 | 12/7 |
| shadow_cloak | rare | assassin | 2.22 | hidden 2.58 (1.36), shadow_cloak 1 |  | +11% ±3 | -2% ±2 | -5% | +2 | 10/8 |
| trackers_coat | rare | ranger | static | - |  | -2% ±2 | -1% ±1 | -1% | +2 | 8/8 |
| windrunners_garb | legendary | monk | 8.03 | tempo 4.5, windrunners_garb 3.53 |  | +1% ±2 | -4% ±1 | +5% | +1 | 9/7 |
| pack_leaders_coat | legendary | valkyrie | 0.19 | pack_leaders_coat 0.19 |  | +0% ±0 | +0% ±0 | +0% | +0 | 8/8 |
| frostwalkers_furs | legendary | ranger | 10.03 | chill 16.25 (11.83), frostwalkers_furs_on 2.83, frostwalkers_furs 1.44, haste 1.44 |  | +10% ±2 | -2% ±1 | +0% | +1 | 12/5 |
| magisters_robe | common | stormcaller | static | - |  | +12% ±1 | -3% ±1 | +0% | +1 | 14/8 |
| wayfarers_habit | common | bard | 13.53 | mp_regen 67.67 (40.61) |  | +5% ±2 | 0% ±0 | +2% | -2 | 12/10 |
| hermits_cowl | common | pyromancer | static | - |  | +4% ±1 | -2% ±1 | +0% | +1 | 9/8 |
| matins_robe | uncommon | bard | 3 | matins_robe_on 2, matins_robe 1 |  | +10% ±2 | -1% ±1 | +5% | -2 | 16/15 |
| wallflowers_robe | uncommon | bard | 2.86 | wallflowers_robe_on 1.86, wallflowers_robe 1 |  | +1% ±1 | -2% ±1 | +5% | +1 | 17/17 |
| glyphed_robe | uncommon | cleric | 31.5 | mp_regen 80.61 (44.17), shield 19.39 (10.08), glyphed_robe 3.97 |  | +2% ±2 | -3% ±2 | +11% | +3 | 10/8 |
| kindled_robes | rare | pyromancer | 17.17 | kindled_robes 8.58, heat 8.58 |  | +2% ±1 | -1% ±0 | +0% | -1 | 18/16 |
| quiet_robes | rare | frostweaver | static | - |  | +4% ±2 | -1% ±1 | -1% | +1 | 4/4 |
| weavers_robes | rare | bard | 12.17 | weavers_robes_on 7.44, weavers_robes 4.72 |  | +2% ±1 | 0% ±0 | -2% | -0 | 4/4 |
| archmages_mantle | legendary | frostweaver | static | - |  | +12% ±2 | -3% ±2 | +13% | -1 | 12/8 |
| stormweave | legendary | stormcaller | 2.89 | stormweave 1.44, surge 1.44 |  | +0% ±0 | 0% ±0 | -1% | -0 | 17/17 |
| vestments_of_return | legendary | cleric | 0.19 | shield 0.14, vestments_of_return 0.06 |  | +0% ±0 | 0% ±0 | +0% | +0 | 5/5 |
| lodestone | common | knight | static | - |  | +3% ±1 | -4% ±1 | +0% | +1 | 19/17 |
| whetstone | common | hoplite | static | - |  | +8% ±1 | -3% ±1 | +0% | -3 | 10/8 |
| moonstone | common | pyromancer | static | - |  | +8% ±1 | -2% ±1 | +0% | -2 | 21/17 |
| ironstone | common | geomancer | static | - |  | +8% ±1 | -3% ±1 | +0% | -2 | 9/8 |
| dewstone | common | cleric | 15.42 | mp_regen 75 (44.17) |  | +1% ±0 | +4% ±1 | +26% | +3 | 9/8 |
| quicksilver | common | assassin | static | - |  | +6% ±2 | -6% ±1 | -1% | +5 | 7/7 |
| red_ribbon | uncommon | paladin | 2.22 | taunt 1.67 (0.94), red_ribbon 0.75, red_ribbon_used 0.75 |  | 0% ±1 | -2% ±1 | -13% | -5 | 14/13 |
| carapace_charm | uncommon | knight | 4.89 | shield 22.53 (18.64), carapace_charm 1 |  | +4% ±1 | -6% ±1 | +0% | +3 | 9/8 |
| hares_foot | uncommon | bard | 2.22 | haste 4.69 (3.47), hares_foot 1 |  | +18% ±3 | -3% ±2 | +22% | -2 | 9/7 |
| batwing_charm | uncommon | bard | 0 | - |  | +1% ±0 | 0% ±0 | +8% | -0 | 18/17 |
| urchin_shell | uncommon | knight | 10.83 | thorns 7.83, urchin_shell 2, urchin_shell_on 1 |  | +1% ±2 | -3% ±2 | +0% | +1 | 13/13 |
| wasp_charm | uncommon | monk | 3.53 | double_strike 2.08 (1.42), wasp_charm 2.03, wasp_charm_on 0.83 |  | +3% ±2 | 0% ±0 | +4% | -1 | 8/7 |
| millstone | rare | paladin | static | millstone 0.06 |  | +7% ±2 | -5% ±2 | -17% | -9 | 10/9 |
| hummingbird_charm | rare | monk | static | - |  | +4% ±2 | +1% ±1 | +10% | +0 | 8/7 |
| echo_charm | rare | bard | static | - |  | +0% ±0 | +0% ±0 | +0% | +0 | 7/7 |
| opportunists_charm | rare | frostweaver | static | - |  | +1% ±0 | 0% ±0 | +0% | -0 | 5/5 |
| bounty_charm | rare | ranger | 0.69 | might 0.81 (0.36), bounty_charm 0.25 |  | +0% ±0 | 0% ±0 | +0% | -0 | 8/8 |
| martyrs_locket | rare | assassin | 1.47 | martyrs_locket 0.92, haste 0.61 (0.06) |  | +1% ±1 | +2% ±1 | +7% | +1 | 5/5 |
| heart_of_winter | legendary | ranger | 15.64 | chill 20.56 (11.83), heart_of_winter 7.22, stun 1.36 (1.11) |  | +6% ±1 | -1% ±1 | +0% | +1 | 7/5 |
| ember_heart | legendary | paladin | 8.11 | burn 64.75 (53.39), ember_heart 1 |  | +2% ±1 | -1% ±0 | -3% | -3 | 15/15 |
| phoenix_ember | legendary | vampire | 1.14 | phoenix_ember 0.89, phoenix_ember_used 0.25 |  | -6% ±1 | +4% ±1 | -7% | +1 | 8/9 |
| ready_stance | legendary | assassin | 1 | ready_stance 1 |  | -1% ±1 | +0% ±0 | +0% | +0 | 9/9 |
| blood_covenant | legendary | vampire | static | blood_covenant 0.28 |  | -13% ±3 | +1% ±2 | -10% | -14 | 4/9 |
| gamblers_coin | legendary | knight | static | gamblers_coin 0.14 |  | -1% ±1 | -1% ±1 | -1% | +0 | 11/12 |

## Offhands (80)

No problems.

| item | rarity | carrier | fires | its statuses, a fight | casts | Δdealt | Δtaken | Δheal | Δticks | won |
|---|---|---|---:|---|---|---:|---:|---:|---:|---|
| pavise | common | paladin | static | - |  | +0% ±0 | -2% ±1 | -3% | +2 | 8/8 |
| banner_kite | common | knight | static | - |  | +2% ±1 | -2% ±1 | +0% | +2 | 10/8 |
| gatekeepers_kite | uncommon | knight | static | - |  | +1% ±1 | -4% ±1 | +0% | +1 | 18/17 |
| sheltering_kite | uncommon | paladin | 2.06 | guard 2.11 (1.06), sheltering_kite 1 |  | +2% ±1 | -5% ±1 | -1% | +2 | 13/12 |
| rubble_shield | rare | paladin | 1.03 | stun 1.64 (1.14), rubble_shield 0.53 |  | +1% ±0 | -3% ±1 | -3% | +1 | 9/9 |
| humbling_shield | rare | knight | 11.17 | weaken 6.14 (2.42), humbling_shield 3.72, humbling_shield_humbled 3.72 |  | +1% ±0 | -4% ±1 | +0% | +3 | 13/13 |
| spiked_bulwark | legendary | knight | 29.58 | thorns 29.58 |  | +15% ±3 | -4% ±1 | +0% | -9 | 11/6 |
| oathbound_shield | legendary | knight | 2.03 | oathbound_shield 2.03 |  | +12% ±4 | -10% ±2 | +0% | +1 | 23/16 |
| bronze_buckler | common | hoplite | static | - |  | +9% ±1 | -3% ±1 | -5% | -2 | 11/10 |
| linden_shield | common | hoplite | static | - |  | +2% ±1 | -4% ±1 | -2% | +3 | 9/7 |
| comrades_targe | uncommon | hoplite | 2.19 | guard 2.31 (1.19), comrades_targe 1.08 |  | +4% ±3 | -2% ±1 | +9% | -0 | 13/10 |
| linebreaker | uncommon | valkyrie | static | - |  | +5% ±1 | -2% ±1 | +0% | +1 | 6/5 |
| paired_shields | rare | hoplite | 1.17 | guard 1.58 (1.19), paired_shields 0.78 |  | +2% ±1 | -1% ±0 | 0% | -1 | 11/10 |
| hunters_buckler | rare | valkyrie | 0.64 | shield 0.36, hunters_buckler 0.14, haste 0.14 |  | +5% ±1 | -1% ±0 | +0% | +0 | 9/8 |
| phalanx_shield | legendary | hoplite | 3.61 | phalanx_shield_aura 2.28, phalanx_shield 1.33 |  | +7% ±3 | -3% ±1 | +10% | +3 | 13/10 |
| shield_of_the_chosen | legendary | valkyrie | 1.25 | shield_of_the_chosen 0.64, shield_of_the_chosen_spent 0.61 |  | +6% ±1 | +1% ±1 | +15% | +5 | 6/5 |
| rams_horn | common | bard | static | - |  | +1% ±0 | +1% ±0 | 0% | -0 | 12/12 |
| ivory_horn | common | bard | 8.89 | mp_regen 46.11 (28.33) |  | +13% ±2 | -1% ±1 | +22% | -1 | 11/11 |
| reveille | uncommon | bard | 9.94 | clarity 8.94, reveille 1 |  | +14% ±3 | -4% ±1 | -14% | -5 | 15/12 |
| bulls_horn | uncommon | bard | 3.08 | haste 4.97 (3.17), bulls_horn 0.64, bulls_horn_rung 0.64 |  | +2% ±1 | +0% ±0 | +2% | +0 | 8/8 |
| war_horn | rare | knight | 2.36 | might 2.81 (1.44), war_horn 1 |  | +10% ±1 | -6% ±1 | +0% | -1 | 10/6 |
| echo_horn | rare | bard | 19.39 | echo_horn 19.39 |  | +1% ±1 | -3% ±2 | -5% | +1 | 5/4 |
| horn_of_the_charge | legendary | bard | 2.5 | haste 5.61 (4.11), horn_of_the_charge 1 |  | +6% ±3 | -1% ±1 | +14% | -1 | 16/14 |
| rallying_horn | legendary | knight | 12.58 | shield 13.11 (4.86), might 3.39 (3.08), haste 2.58 (0.08), rallying_horn 1.83 |  | +10% ±1 | -9% ±1 | -2% | +5 | 11/9 |
| scholars_codex | common | frostweaver | static | - |  | +21% ±3 | -10% ±2 | +13% | +2 | 14/8 |
| hymnal | common | frostweaver | 5.53 | mp_regen 37.22 (26.17) |  | +1% ±1 | +0% ±0 | -1% | -0 | 4/4 |
| snowbound_folio | uncommon | frostweaver | 7.36 | chill 19.19 (12.97), stun 1.89 (1.28), snowbound_folio 1 |  | +16% ±3 | -10% ±3 | +0% | +1 | 16/5 |
| abridged_lexicon | uncommon | bard | static | - |  | +1% ±0 | 0% ±0 | -2% | -0 | 19/19 |
| primer_of_frost | rare | frostweaver | static | - |  | +1% ±1 | 0% ±0 | +0% | +1 | 5/5 |
| treatise_on_the_field | rare | bard | static | - |  | +4% ±1 | -1% ±1 | +2% | -2 | 21/19 |
| last_page | legendary | frostweaver | 0.75 | last_page 0.75 |  | +0% ±0 | 0% ±0 | -1% | -0 | 4/4 |
| annotated_grimoire | legendary | bard | 18.28 | annotated_grimoire_free 14, annotated_grimoire 4.28 |  | +1% ±1 | -3% ±1 | +9% | +4 | 4/4 |
| brass_lantern | common | pyromancer | static | - |  | +17% ±4 | -5% ±1 | +0% | +2 | 15/7 |
| hooded_lantern | common | pyromancer | static | - |  | +5% ±2 | -1% ±0 | -2% | -1 | 16/16 |
| pitch_lantern | uncommon | pyromancer | 15.14 | burn 119.83 (94.33), pitch_lantern 1 |  | +17% ±2 | -9% ±2 | +0% | -6 | 25/19 |
| dazzling_lantern | uncommon | paladin | 2.14 | weaken 2.92 (1.78), dazzling_lantern 1 |  | +6% ±3 | -5% ±1 | +2% | -1 | 14/13 |
| bellows_lantern | rare | pyromancer | 14.09 | burn 98.61 (95.67), bellows_lantern 8.33 |  | +5% ±1 | -1% ±1 | +0% | -3 | 20/18 |
| signal_lantern | rare | paladin | 1.47 | signal_lantern 0.78, marked 0.69 |  | +0% ±0 | +0% ±0 | +0% | +0 | 15/15 |
| wick | legendary | pyromancer | 11 | burn 90.67 (95.67), wick 1.94, heat 1.94 |  | +9% ±2 | -2% ±1 | +0% | -4 | 21/18 |
| lamp_of_vigil | legendary | paladin | 0.44 | lamp_of_vigil 0.44 |  | +0% ±0 | +0% ±0 | +0% | +0 | 15/15 |
| shrine_token | common | cleric | 8.19 | mp_regen 46.78 (30.39) |  | +0% ±0 | +0% ±0 | +4% | -0 | 15/15 |
| blessed_knot | common | cleric | static | - |  | +5% ±2 | -2% ±1 | +12% | +6 | 9/9 |
| holy_water | uncommon | cleric | 1.72 | holy_water 1.72 |  | +1% ±0 | 0% ±1 | +2% | +0 | 10/10 |
| charnel_icon | uncommon | valkyrie | 15.44 | mp_regen 64.56 (41.89), charnel_icon 4.11 |  | +2% ±1 | +0% ±1 | +11% | -0 | 19/18 |
| saints_knucklebone | rare | cleric | 5.64 | might 5.81 (2.31), saints_knucklebone 2.14 |  | +3% ±1 | -1% ±1 | +1% | -2 | 10/9 |
| reliquary_of_mercy | rare | cleric | static | - |  | +0% ±0 | +1% ±0 | +0% | +1 | 5/5 |
| phylactery | legendary | cleric | 14.53 | shield 20.56 (10.08), phylactery 4.06 |  | +1% ±1 | -5% ±1 | -4% | +2 | 9/8 |
| bones_of_the_returned | legendary | cleric | 0 | - |  | +0% ±0 | +1% ±0 | +0% | +0 | 15/15 |
| temple_bell | common | monk | static | - |  | +12% ±2 | -7% ±2 | -7% | -3 | 15/13 |
| prayer_bell | common | stormcaller | 5.56 | mp_regen 37.06 (25.94) |  | +6% ±1 | -3% ±1 | -5% | -0 | 19/16 |
| quickening_chime | uncommon | monk | 3.39 | quickening_chime 3.39 |  | +2% ±2 | -5% ±1 | +6% | +1 | 10/7 |
| waking_bell | uncommon | monk | 12.78 | mp_regen 63.44 (38.22), waking_bell 0.08, waking_bell_rung 0.08 |  | +4% ±2 | -4% ±2 | +0% | +2 | 11/11 |
| tempo_bell | rare | monk | 1.67 | haste 3.58 (3.47), tempo_bell 1.67 |  | 0% ±0 | +1% ±1 | +1% | -1 | 7/7 |
| warding_bell | rare | cleric | 4.56 | warding_bell 1.97, warding_bell_beat 1.58, warding_bell_wait 1 |  | +0% ±0 | 0% ±0 | 0% | +1 | 21/21 |
| bell_of_the_hour | legendary | cleric | 5.22 | bell_of_the_hour_beat 2.25, bell_of_the_hour 1.97, bell_of_the_hour_wait 1 |  | -1% ±1 | +0% ±1 | +3% | +1 | 15/15 |
| funeral_bell | legendary | monk | 10.25 | fervor 7.11, funeral_bell 3.14 |  | +4% ±1 | -1% ±1 | +0% | -1 | 10/8 |
| standing_stone | common | geomancer | static | - |  | +8% ±1 | -3% ±1 | +0% | -2 | 11/9 |
| hawthorn_fetish | common | ranger | 11.06 | thorns 11.06 |  | +15% ±2 | -5% ±1 | -1% | -1 | 17/13 |
| spinebark_pole | uncommon | bramble_knight | 4.34 | thorns 14.89 (15.39), spinebark_pole 1, spinebark_pole_thorns 1 |  | +7% ±2 | -5% ±1 | +15% | -0 | 22/17 |
| bear_fetish | uncommon | bramble_knight | 2.5 | guard 2.14 (1.31), bear_fetish 0.83, bear_fetish_spent 0.83 |  | +2% ±1 | 0% ±0 | +2% | -0 | 16/15 |
| briar_totem | rare | bramble_knight | 15.83 | bleed 40 (32.56), briar_totem 8.56 |  | +8% ±1 | -3% ±1 | -11% | -1 | 22/21 |
| stone_totem | rare | geomancer | 4.44 | shield 22.39 (18.94), stone_totem 1 |  | -2% ±2 | -4% ±1 | +0% | +3 | 8/8 |
| earthmother_totem | legendary | geomancer | 11.11 | might 5.92 (1.44), earthmother_totem 3.64, earthmother_totem_aura 3 |  | +1% ±0 | +0% ±0 | +0% | +0 | 8/8 |
| wild_hunt_totem | legendary | ranger | 16.47 | might 7.36 (0.22), wild_hunt_totem 5.75, marked 3.58 |  | +2% ±1 | 0% ±1 | 0% | -1 | 16/15 |
| red_tincture | common | vampire | 3.6 | lifesteal 19.58 (18.78) |  | +6% ±1 | +2% ±1 | +34% | +2 | 15/13 |
| hemlock_phial | common | assassin | static | - |  | +7% ±2 | -2% ±1 | +2% | +0 | 8/7 |
| clotting_salve | uncommon | assassin | 3.64 | clotting_salve 3.64 |  | +4% ±1 | +1% ±1 | +0% | +0 | 9/8 |
| crimson_dregs | uncommon | assassin | 3.42 | crimson_dregs 3.42 |  | +4% ±1 | +1% ±1 | +27% | -1 | 11/11 |
| blood_vial | rare | vampire | static | blood_vial 0.19 |  | -3% ±2 | +2% ±2 | +7% | -5 | 6/9 |
| venom_vial | rare | assassin | 3.06 | bleed 9.39 (7.44), venom_vial 1.53 |  | +7% ±2 | -1% ±1 | -3% | -1 | 7/7 |
| vial_of_the_last_breath | legendary | assassin | 2.56 | vial_of_the_last_breath 1.94, vial_of_the_last_breath_spent 0.61 |  | +1% ±1 | +2% ±1 | +2% | +4 | 6/5 |
| bloodlust_draught | legendary | vampire | 13.86 | lifesteal 23.47 (20.44), bloodlust_draught_thirst 10.67, bloodlust_draught 1.03 |  | 0% ±2 | +2% ±2 | +35% | +3 | 8/9 |
| night_mask | common | hexer | 2.18 | siphon 8.08 (7.67) |  | +5% ±1 | -5% ±2 | +0% | +1 | 10/8 |
| carved_effigy | common | hexer | static | - |  | +1% ±1 | -5% ±1 | +0% | +4 | 13/13 |
| carrion_idol | uncommon | hexer | 0.11 | carrion_idol 0.11 |  | +13% ±3 | -4% ±1 | +4% | +2 | 7/4 |
| fanged_idol | uncommon | hexer | 1.44 | fanged_idol 0.78, rot 0.67 |  | +0% ±0 | 0% ±0 | +0% | -0 | 11/11 |
| withering_idol | rare | hexer | 12.94 | weaken 8.08 (1.58), withering_idol 6.44 |  | +5% ±2 | -7% ±2 | +0% | +5 | 11/11 |
| leech_idol | rare | hexer | 5.2 | siphon 11.06 (10.47), leech_idol 1.94 |  | +1% ±1 | +0% ±1 | -5% | +0 | 4/4 |
| idol_of_binding | legendary | hexer | 3.61 | slow 2.25 (0.36), idol_of_binding 1.72 |  | +5% ±2 | -4% ±2 | +0% | +3 | 12/11 |
| idol_of_the_hungry_dark | legendary | hexer | 6.11 | idol_of_the_hungry_dark_beat 2.75, idol_of_the_hungry_dark 2.25, idol_of_the_hungry_dark_wait 1.11 |  | -3% ±3 | +2% ±2 | -2% | +1 | 10/11 |

## Formations (32)

No problems.

| item | rarity | carrier | fires | its statuses, a fight | casts | Δdealt | Δtaken | Δheal | Δticks | won |
|---|---|---|---:|---|---|---:|---:|---:|---:|---|
| shieldwall | common | knight+pyromancer+hexer | static | - |  | +6% ±2 | -6% ±2 | +0% | +1 | 19/17 |
| heavy_line | common | hoplite+knight+geomancer | static | - |  | +17% ±2 | -12% ±2 | +0% | +1 | 12/8 |
| skirmish_line | common | knight+cleric+ranger | static | - |  | -1% ±2 | -2% ±2 | -7% | -0 | 9/12 |
| spur | common | bard+monk+assassin | 2.78 | haste 5.25 (3.47), spur_pacer 1 |  | -1% ±2 | +10% ±2 | -5% | -6 | 6/7 |
| wellspring | common | bard+frostweaver+hexer | 9.33 | mp_regen 44.78 (26.17) |  | -5% ±2 | -2% ±1 | -5% | +2 | 3/4 |
| long_march | common | vampire+monk+cleric | 15.86 | regen 35.47 (11.03), long_march 3.06 |  | -6% ±2 | +5% ±2 | +29% | +7 | 7/9 |
| first_light | common | assassin+ranger+geomancer | 3 | first_light 3 |  | -1% ±4 | -1% ±5 | +0% | +2 | 5/9 |
| arrowhead | common | valkyrie+ranger+assassin | static | - |  | +3% ±2 | -2% ±1 | -5% | -1 | 9/5 |
| ring_of_steel | common | bramble_knight+stormcaller+bard | 1.7 | thorns 13.67 (15.39) |  | +17% ±2 | -6% ±2 | -19% | -4 | 22/17 |
| vigil | common | assassin+cleric+valkyrie | 3.17 | vigil_mourner 1.67, vigil_mourning 1.5 |  | +0% ±1 | +6% ±1 | -8% | -4 | 5/5 |
| watchtower | common | hexer+knight+monk | static | - |  | +4% ±2 | -7% ±2 | +0% | +4 | 13/11 |
| hammer_and_anvil | rare | knight+hoplite+geomancer | 2.53 | shield 20.58 (19.25), guard 3.92 (2.89), hammer_and_anvil_anvil 1, hammer_and_anvil_hammer 0.5 |  | +13% ±1 | -12% ±2 | +0% | +2 | 10/6 |
| hunting_party | rare | ranger+assassin+valkyrie | 7.72 | hunting_party_marker 2.83, marked 2.81, taunt 1.61 (0.53), hunting_party_warden 1 |  | -9% ±4 | -4% ±2 | -58% | +0 | 6/8 |
| hearth | rare | knight+hexer+pyromancer | 27.36 | burn 101.5 (90.08), hearth_torch 7.53, taunt 2.44 (1.47), guard 1.92 (1) |  | +23% ±4 | -16% ±6 | +0% | -8 | 23/16 |
| hoarfrost_line | rare | hexer+ranger+frostweaver | 15.72 | chill 18.53 (11.83), hoarfrost_line_frost 5.42, hoarfrost_line_primed 2.56, hoarfrost_line_breaker 1.56 |  | +8% ±2 | +1% ±1 | +0% | -0 | 10/5 |
| reaping_line | rare | bramble_knight+stormcaller+bard | 5.18 | thorns 16.64 (15.39), taunt 2.56 (1.64), reaping_line_beacon 1.03 |  | -3% ±2 | -8% ±1 | -81% | +3 | 17/17 |
| relay | rare | bard+frostweaver+hexer | 11.19 | relay_well 6.78, relay_second 2.72, relay_third 1.69 |  | +0% ±2 | +0% ±1 | -10% | +1 | 3/4 |
| gaol | rare | monk+knight+hexer | 2.22 | gaol_turnkey 2.22 |  | +3% ±1 | -3% ±2 | +0% | +3 | 11/11 |
| thorn_hedge | rare | bramble_knight+cleric+stormcaller | 40.9 | thorns 18.86 (18.22), thorn_hedge_thorns 18.19, weaken 18.19 (0.39) |  | +18% ±4 | -17% ±2 | +2% | +2 | 27/21 |
| blood_oath | rare | vampire+monk+cleric | 72.53 | blood_oath_bleeder 56.22, lifesteal 50.92 (20.44) |  | +16% ±2 | -1% ±2 | +22% | +0 | 10/9 |
| pyre_of_heroes | rare | assassin+cleric+valkyrie | 4.97 | might 1.89 (0.5), haste 1.08 (0.06), guard 0.92 (0.11), pyre_of_heroes_survivor 0.89 |  | +3% ±2 | +0% ±1 | +5% | +3 | 6/5 |
| knives_drawn | rare | assassin+ranger+geomancer | 12.19 | shield 9.14 (5.92), knives_drawn_rear_guard 2, knives_drawn_opening 2, knives_drawn_opener 1 |  | +12% ±2 | -11% ±2 | +0% | +1 | 12/9 |
| the_wheel | rare | knight+cleric+ranger | 31.53 | mp_regen 68.89 (40.22), the_wheel_blade 4.28, the_wheel_well 4.17, the_wheel_wall 4.06 |  | +6% ±2 | -4% ±1 | +3% | +1 | 13/12 |
| the_pack | legendary | ranger+assassin+valkyrie | 16.81 | the_pack_lead 8.83, marked 7.97 |  | +2% ±1 | -1% ±1 | +0% | -0 | 11/8 |
| the_forge | legendary | knight+hexer+pyromancer | 59.33 | the_forge 29.58, heat 26.58, slow 3.39 (0.22) |  | -23% ±4 | +17% ±4 | +0% | -3 | 11/16 |
| the_ambuscade | legendary | assassin+ranger+geomancer | 18 | the_ambuscade 6, the_ambuscade_opening 6, the_ambuscade_wait 3, the_ambuscade_tail 3 |  | -1% ±2 | -2% ±1 | +0% | -0 | 10/9 |
| the_choir | legendary | bard+frostweaver+hexer | 25.39 | the_choir_cue 14.56, the_choir 10.83 |  | +7% ±4 | -4% ±2 | -1% | +2 | 5/4 |
| the_undying | legendary | assassin+cleric+valkyrie | 2.08 | the_undying_martyr 2.08 |  | -5% ±2 | +0% ±2 | -7% | -0 | 2/5 |
| the_hurricane | legendary | bard+monk+assassin | 133.11 | the_hurricane_count 66.92, the_hurricane 65.47, haste 4.19 (3.47) |  | +1% ±1 | 0% ±0 | +3% | +1 | 8/7 |
| the_mountain | legendary | knight+hoplite+geomancer | 9.92 | taunt 4.89 (2.64), the_mountain_peak 4.22, the_mountain_strength 2, the_mountain_exposed 1.44 |  | +20% ±3 | -13% ±4 | +0% | -10 | 12/6 |
| the_storm_front | legendary | bramble_knight+stormcaller+bard | 20.94 | the_storm_front 20.94 |  | +5% ±1 | -2% ±1 | -11% | -2 | 19/17 |
| the_vise | legendary | knight+hexer+monk | static | - |  | +8% ±2 | -2% ±2 | +0% | -0 | 13/11 |

## Upgrades, part 1 (and mythics) (168)

| item | carrier | problem | detail |
|---|---|---|---|
| smite__b (b) | paladin | never fires | never cast |
| smite__bp (bp) | paladin | never fires | never cast |
| war_ballad__b (b) | bard | never fires | cast, but deals, heals and applies nothing |
| einherjar__p (p) | valkyrie | untested | no trace of its hooks, nor of the base passive's: their moment never came in these fights; every fight identical to the control |
| einherjar__a (a) | valkyrie | untested | no trace of its hooks, nor of the base passive's: their moment never came in these fights; every fight identical to the control |
| einherjar__ap (ap) | valkyrie | untested | no trace of its hooks, nor of the base passive's: their moment never came in these fights; every fight identical to the control |
| valhalla__p (p) | valkyrie | untested | never cast, nor the base: its moment never came in these fights; every fight identical to the control |
| valhalla__a (a) | valkyrie | untested | never cast, nor the base: its moment never came in these fights; every fight identical to the control |
| valhalla__b (b) | valkyrie | untested | never cast, nor the base: its moment never came in these fights; every fight identical to the control |
| valhalla__ap (ap) | valkyrie | untested | never cast, nor the base: its moment never came in these fights; every fight identical to the control |
| valhalla__bp (bp) | valkyrie | untested | never cast, nor the base: its moment never came in these fights; every fight identical to the control |

| item | rarity | carrier | fires | its statuses, a fight | casts | Δdealt | Δtaken | Δheal | Δticks | won |
|---|---|---|---:|---|---|---:|---:|---:|---:|---|
| vanguard__p | p | knight | 1 | shield 20.33 (19.25), vanguard__p 1 |  | +2% ±1 | -4% ±1 | +0% | +2 | 9/6 |
| vanguard__a | a | knight | 4.56 | shield 22.81 (19.25), vanguard__a 1 |  | -1% ±1 | -3% ±1 | +0% | +3 | 8/6 |
| vanguard__b | b | knight | 5.33 | shield 19.56 (19.25), guard 4.36 (2.89), taunt 4.03 (2.64), vanguard__b 2.47 |  | -1% ±1 | -4% ±1 | +0% | +0 | 9/6 |
| vanguard__ap | ap | knight | 5.83 | shield 24.08 (19.25), vanguard__ap 1 |  | +2% ±1 | -9% ±2 | +0% | +4 | 10/6 |
| vanguard__bp | bp | knight | 5.17 | shield 20.72 (19.25), guard 4.28 (2.89), taunt 4.03 (2.64), vanguard__bp 2.39 |  | +1% ±1 | -6% ±1 | +0% | +1 | 9/6 |
| fortify__p | p | knight | 0.58 | guard 3.47 (2.89) | 1.58/f: 0d 0h 1a (base 0.94/f: 0d 0h 1a) | -3% ±1 | -1% ±1 | +0% | +2 | 7/6 |
| fortify__a | a | knight | 3.61 | shield 22.86 (19.25), guard 2.92 (2.89) | 0.94/f: 0d 0h 2a (base 0.94/f: 0d 0h 1a) | -2% ±2 | -3% ±1 | +0% | +3 | 8/6 |
| fortify__b | b | knight | 0 | guard 2.89 (2.89) | 0.94/f: 0d 0h 1a (base 0.94/f: 0d 0h 1a) | +0% ±0 | +0% ±0 | +0% | -1 | 6/6 |
| fortify__ap | ap | knight | 7.58 | shield 26.19 (19.25), guard 3.53 (2.89) | 1.56/f: 0d 0h 2a (base 0.94/f: 0d 0h 1a) | -5% ±2 | -8% ±2 | +0% | +7 | 8/6 |
| fortify__bp | bp | knight | 0.58 | guard 3.47 (2.89) | 1.61/f: 0d 0h 1a (base 0.94/f: 0d 0h 1a) | +2% ±1 | -3% ±1 | +0% | -1 | 8/6 |
| stand_fast__p | p | knight | 1.67 | clarity 11.31 (9.08), taunt 2.17 (1.78) | 1.47/f: 0d 0h 2a (base 1.14/f: 0d 0h 2a) | +0% ±0 | +0% ±0 | +2% | +0 | 15/15 |
| stand_fast__a | a | knight | 0 | clarity 8.75 (9.08) | 0.97/f: 0d 0h 1a (base 1.14/f: 0d 0h 2a) | -10% ±3 | -2% ±3 | -26% | -2 | 12/15 |
| stand_fast__b | b | knight | 17.78 | thorns 16.72, taunt 1.64 (1.78), hold_the_line 1.06 | 1.06/f: 0d 0h 3a (base 1.14/f: 0d 0h 2a) | +1% ±2 | -3% ±1 | -12% | -3 | 14/15 |
| stand_fast__ap | ap | knight | 1.56 | clarity 11.69 (9.08) | 1.25/f: 0d 0h 1a (base 1.14/f: 0d 0h 2a) | -9% ±3 | -2% ±3 | -25% | -3 | 12/15 |
| stand_fast__bp | bp | knight | 19.97 | thorns 18.22, taunt 2.08 (1.78), hold_the_line 1.44 | 1.44/f: 0d 0h 3a (base 1.14/f: 0d 0h 2a) | +1% ±1 | -3% ±1 | -12% | -3 | 14/15 |
| shield_bash__p | p | knight | 0 | stun 1.92 (1.97) | 0.83/f: 1542d 0h 1a (base 0.83/f: 1037d 0h 1a) | +2% ±0 | -2% ±1 | +0% | -0 | 8/6 |
| shield_bash__a | a | knight | 0 | stun 1.64 (1.97) | 0.61/f: 967d 0h 1a (base 0.83/f: 1037d 0h 1a) | -1% ±2 | -1% ±1 | +0% | -0 | 5/6 |
| shield_bash__b | b | knight | 0 | - | 0.83/f: 2399d 0h 0a (base 0.83/f: 1037d 0h 1a) | +4% ±1 | -1% ±2 | +0% | -1 | 9/6 |
| shield_bash__ap | ap | knight | 0 | stun 1.64 (1.97) | 0.61/f: 1487d 0h 1a (base 0.83/f: 1037d 0h 1a) | 0% ±2 | -1% ±1 | +0% | -0 | 5/6 |
| shield_bash__bp | bp | knight | 0 | - | 0.83/f: 3373d 0h 0a (base 0.83/f: 1037d 0h 1a) | +8% ±1 | -1% ±2 | +0% | -4 | 10/6 |
| last_rites__p | p | cleric | 2.94 | last_rites__p 2.83, last_rites_on 0.39 (0.28) |  | 0% ±0 | +0% ±0 | +1% | +0 | 21/21 |
| last_rites__a | a | cleric | 7.42 | last_rites__a 6.81, last_rites_on 0.89 (0.28) |  | +1% ±1 | 0% ±1 | +4% | -1 | 21/21 |
| last_rites__b | b | cleric | 4.33 | last_rites__b 3.61, rite_of_passage 0.72, last_rites_on 0.31 (0.28) |  | +0% ±0 | 0% ±0 | 0% | -0 | 21/21 |
| last_rites__ap | ap | cleric | 9.19 | last_rites__ap 8.06, last_rites_on 1.42 (0.28) |  | +3% ±1 | 0% ±1 | +15% | +1 | 22/21 |
| last_rites__bp | bp | cleric | 4.44 | last_rites__bp 3.58, rite_of_passage 0.72, last_rites_on 0.42 (0.28) |  | +0% ±0 | +0% ±0 | +1% | -0 | 21/21 |
| renew__p | p | cleric | 0 | regen 7.47 (7.47) | 0.92/f: 0d 0h 1a (base 0.92/f: 0d 0h 1a) | +0% ±0 | +0% ±0 | +0% | +0 | 10/10 |
| renew__a | a | cleric | 6.25 | regen 7.53 (7.47), clarity 6.25 | 0.92/f: 0d 0h 2a (base 0.92/f: 0d 0h 1a) | +3% ±1 | +0% ±0 | +3% | -0 | 11/10 |
| renew__b | b | cleric | 0.78 | regen 8.89 (7.47) | 0.92/f: 0d 0h 1a (base 0.92/f: 0d 0h 1a) | +3% ±1 | +1% ±1 | +14% | +2 | 10/10 |
| renew__ap | ap | cleric | 6.25 | regen 7.53 (7.47), clarity 6.25 | 0.92/f: 0d 0h 2a (base 0.92/f: 0d 0h 1a) | +3% ±1 | +0% ±0 | +3% | -0 | 11/10 |
| renew__bp | bp | cleric | 0.78 | regen 8.89 (7.47) | 0.92/f: 0d 0h 1a (base 0.92/f: 0d 0h 1a) | +3% ±1 | +1% ±1 | +14% | +2 | 10/10 |
| cure__p | p | cleric | 0 | - | 2.11/f: 0d 1281h 0a (base 2.11/f: 0d 1156h 0a) | +1% ±1 | +0% ±0 | +1% | -1 | 9/9 |
| cure__a | a | cleric | 0 | - | 1.56/f: 0d 1845h 0a (base 2.11/f: 0d 1156h 0a) | -4% ±3 | +5% ±2 | +19% | +2 | 10/9 |
| cure__b | b | cleric | 5.83 | battle_prayer 4.06, (rider hits) 1.78 | 2.11/f: 0d 1146h 1a (base 2.11/f: 0d 1156h 0a) | +8% ±2 | -3% ±1 | -3% | -1 | 10/9 |
| cure__ap | ap | cleric | 0 | - | 1.56/f: 0d 1908h 0a (base 2.11/f: 0d 1156h 0a) | -4% ±3 | +5% ±2 | +20% | +2 | 10/9 |
| cure__bp | bp | cleric | 5.81 | battle_prayer_plus 4.06, (rider hits) 1.75 | 2.11/f: 0d 1260h 1a (base 2.11/f: 0d 1156h 0a) | +12% ±2 | -4% ±1 | 0% | -2 | 10/9 |
| raise__p | p | cleric | 0 | - | 0.06/f: 0d 0h 2a (base 0.06/f: 0d 0h 2a) | +0% ±0 | +0% ±0 | +0% | +0 | 5/5 |
| raise__a | a | cleric | 0 | - | 0.11/f: 0d 0h 2a (base 0.06/f: 0d 0h 2a) | 0% ±0 | +0% ±0 | +0% | +0 | 5/5 |
| raise__b | b | cleric | 1.17 | shield 1.17 | 0.33/f: 0d 0h 1a (base 0.06/f: 0d 0h 2a) | +0% ±1 | -1% ±1 | -6% | +1 | 5/5 |
| raise__ap | ap | cleric | 0 | - | 0.11/f: 0d 0h 2a (base 0.06/f: 0d 0h 2a) | 0% ±0 | +0% ±0 | +0% | +0 | 5/5 |
| raise__bp | bp | cleric | 1.42 | shield 1.42 | 0.33/f: 0d 0h 1a (base 0.06/f: 0d 0h 2a) | +1% ±1 | -1% ±1 | -6% | +1 | 5/5 |
| hunters_eye__p | p | ranger | static | - |  | +1% ±0 | -1% ±0 | +0% | -0 | 8/8 |
| hunters_eye__a | a | ranger | static | - |  | -2% ±2 | -2% ±1 | +0% | +1 | 8/8 |
| hunters_eye__b | b | ranger | static | - |  | +0% ±0 | 0% ±1 | +0% | +0 | 9/8 |
| hunters_eye__ap | ap | ranger | static | - |  | 0% ±2 | -2% ±1 | +0% | +1 | 8/8 |
| hunters_eye__bp | bp | ranger | static | - |  | +1% ±0 | -1% ±1 | +0% | -0 | 9/8 |
| barbed_arrow__p | p | ranger | 2.96 | bleed 17.11 (17.19) | 2.53/f: 783d 0h 1a (base 2.61/f: 787d 0h 1a) | +7% ±1 | -2% ±1 | -2% | -1 | 16/13 |
| barbed_arrow__a | a | ranger | 4.03 | bleed 16.14 (17.19) | 2.53/f: 784d 0h 1a (base 2.61/f: 787d 0h 1a) | +11% ±2 | -3% ±1 | -6% | -6 | 16/13 |
| barbed_arrow__b | b | ranger | 12.25 | bleed 37.03 (17.19) | 2.5/f: 1080d 0h 2a (base 2.61/f: 787d 0h 1a) | +5% ±3 | -5% ±1 | -6% | -3 | 16/13 |
| barbed_arrow__ap | ap | ranger | 5.36 | bleed 15.75 (17.19) | 2.58/f: 793d 0h 1a (base 2.61/f: 787d 0h 1a) | +22% ±3 | -5% ±1 | -3% | -3 | 17/13 |
| barbed_arrow__bp | bp | ranger | 11.28 | bleed 35.81 (17.19) | 2.42/f: 1054d 0h 2a (base 2.61/f: 787d 0h 1a) | +12% ±3 | -7% ±2 | -9% | -6 | 17/13 |
| frost_arrow__p | p | ranger | 0 | chill 12.03 (11.83), stun 1.14 (1.11) | 1.72/f: 881d 0h 1a (base 1.69/f: 885d 0h 1a) | +1% ±1 | +0% ±0 | +0% | +1 | 4/5 |
| frost_arrow__a | a | ranger | 1.89 | slow 1.97 (0.08) | 1.72/f: 865d 0h 1a (base 1.69/f: 885d 0h 1a) | -1% ±3 | +1% ±3 | +0% | +2 | 4/5 |
| frost_arrow__b | b | ranger | 4.03 | chill 15.64 (11.83), stun 0.86 (1.11) | 1.75/f: 891d 0h 3a (base 1.69/f: 885d 0h 1a) | 0% ±2 | +1% ±3 | +0% | +1 | 6/5 |
| frost_arrow__ap | ap | ranger | 1.86 | slow 1.94 (0.08) | 1.72/f: 1307d 0h 1a (base 1.69/f: 885d 0h 1a) | +2% ±3 | +1% ±3 | +0% | +2 | 4/5 |
| frost_arrow__bp | bp | ranger | 4.11 | chill 15.75 (11.83), stun 0.89 (1.11) | 1.75/f: 891d 0h 3a (base 1.69/f: 885d 0h 1a) | +0% ±2 | -1% ±3 | +0% | +2 | 6/5 |
| rending_arrow__p | p | ranger | 0 | sunder 1.47 (2.03) | 1.58/f: 1520d 0h 1a (base 1.58/f: 1508d 0h 1a) | +1% ±1 | +0% ±0 | -1% | -1 | 13/13 |
| rending_arrow__a | a | ranger | 0 | sunder 1.53 (2.03) | 1.61/f: 1437d 0h 1a (base 1.58/f: 1508d 0h 1a) | +3% ±1 | 0% ±0 | -1% | -3 | 14/13 |
| rending_arrow__b | b | ranger | 0 | - | 1.56/f: 1603d 0h 0a (base 1.58/f: 1508d 0h 1a) | +1% ±1 | -1% ±1 | -3% | -2 | 13/13 |
| rending_arrow__ap | ap | ranger | 0 | sunder 1.44 (2.03) | 1.58/f: 1473d 0h 1a (base 1.58/f: 1508d 0h 1a) | +5% ±1 | 0% ±0 | 0% | -3 | 14/13 |
| rending_arrow__bp | bp | ranger | 0 | - | 1.53/f: 2238d 0h 0a (base 1.58/f: 1508d 0h 1a) | +3% ±1 | -3% ±1 | -2% | -2 | 14/13 |
| briar__p | p | bramble_knight | 12.27 | bleed 26.44 (25.69), briar__p 7.08 |  | +2% ±0 | -1% ±0 | -1% | -1 | 19/17 |
| briar__a | a | bramble_knight | 22.58 | bleed 26.75 (25.69), bloodroot 14.97, briar__a 7.61 |  | +2% ±1 | -1% ±1 | +50% | +0 | 21/17 |
| briar__b | b | bramble_knight | 29.67 | bleed 33.97 (25.69), briar__b 23.33 |  | +7% ±1 | -6% ±2 | -17% | -3 | 21/17 |
| briar__ap | ap | bramble_knight | 23.08 | bleed 27.69 (25.69), bloodroot 14.67, briar__ap 7.33 |  | +4% ±1 | -2% ±1 | +51% | -0 | 21/17 |
| briar__bp | bp | bramble_knight | 27.97 | bleed 33.33 (25.69), briar__bp 22.31 |  | +10% ±2 | -8% ±2 | -17% | -3 | 21/17 |
| thicket__p | p | bramble_knight | 0.53 | taunt 2.17 (1.89), guard 1.56 (1.31) | 1.47/f: 0d 0h 2a (base 1.22/f: 0d 0h 2a) | +3% ±1 | -2% ±1 | +15% | -1 | 16/15 |
| thicket__a | a | bramble_knight | 3.62 | thorns 17.64 (18.72), taunt 1.78 (1.89), overgrowth_again 1.03, overgrowth 0.89 | 0.89/f: 0d 0h 3a (base 1.22/f: 0d 0h 2a) | 0% ±2 | +6% ±1 | +31% | -2 | 14/15 |
| thicket__b | b | bramble_knight | 1.81 | guard 3.11 (1.31) | 1/f: 0d 0h 3a (base 1.22/f: 0d 0h 2a) | -2% ±2 | +4% ±1 | +62% | +5 | 15/15 |
| thicket__ap | ap | bramble_knight | 4.38 | thorns 17.56 (18.72), taunt 1.97 (1.89), overgrowth_again 1.17, overgrowth 0.97 | 0.97/f: 0d 0h 3a (base 1.22/f: 0d 0h 2a) | -1% ±2 | +6% ±1 | +26% | +2 | 13/15 |
| thicket__bp | bp | bramble_knight | 3.03 | guard 4.33 (1.31) | 1.44/f: 0d 0h 3a (base 1.22/f: 0d 0h 2a) | -1% ±2 | +0% ±1 | +35% | +4 | 15/15 |
| regrowth__p | p | bramble_knight | 0 | regen 3.86 (3.86) | 0.92/f: 0d 0h 1a (base 0.92/f: 0d 0h 1a) | +0% ±0 | +0% ±0 | +0% | +0 | 17/17 |
| regrowth__a | a | bramble_knight | 1.87 | thorns 15.61 (15.39), regen 3.58 (3.86), deep_roots 0.92 | 0.92/f: 0d 0h 2a (base 0.92/f: 0d 0h 1a) | +3% ±1 | -1% ±1 | +5% | -0 | 18/17 |
| regrowth__b | b | bramble_knight | 3.25 | regen 9.56 (3.86) | 0.78/f: 0d 0h 3a (base 0.92/f: 0d 0h 1a) | +0% ±1 | +3% ±1 | +49% | +1 | 17/17 |
| regrowth__ap | ap | bramble_knight | 1.64 | thorns 15.61 (15.39), regen 3.53 (3.86), deep_roots 0.92 | 0.92/f: 0d 0h 2a (base 0.92/f: 0d 0h 1a) | +3% ±1 | -1% ±1 | +5% | +0 | 18/17 |
| regrowth__bp | bp | bramble_knight | 3.25 | regen 9.56 (3.86) | 0.78/f: 0d 0h 3a (base 0.92/f: 0d 0h 1a) | +0% ±1 | +3% ±1 | +49% | +1 | 17/17 |
| bramble_lash__p | p | bramble_knight | 0 | - | 1.72/f: 1536d 0h 0a (base 1.78/f: 1023d 0h 0a) | +1% ±0 | -1% ±0 | +0% | +0 | 18/17 |
| bramble_lash__a | a | bramble_knight | 0 | - | 1.42/f: 1813d 0h 0a (base 1.78/f: 1023d 0h 0a) | +1% ±1 | -2% ±1 | +11% | +2 | 18/17 |
| bramble_lash__b | b | bramble_knight | 15.39 | rebuke 7.69, rebuke_count 7.69 | 0.64/f: 2342d 0h 0a (base 1.78/f: 1023d 0h 0a) | -1% ±1 | -1% ±1 | -1% | -1 | 18/17 |
| bramble_lash__ap | ap | bramble_knight | 0 | - | 1.42/f: 2735d 0h 0a (base 1.78/f: 1023d 0h 0a) | +3% ±1 | -5% ±2 | +7% | +0 | 21/17 |
| bramble_lash__bp | bp | bramble_knight | 15.22 | rebuke 7.61, rebuke_count 7.61 | 0.64/f: 3038d 0h 0a (base 1.78/f: 1023d 0h 0a) | 0% ±1 | -1% ±1 | -9% | -1 | 18/17 |
| phalanx__p | p | hoplite | static | - |  | +4% ±0 | -1% ±1 | +0% | -1 | 8/6 |
| phalanx__a | a | hoplite | 3 | opening_thrust 2, phalanx__a 1 |  | +3% ±0 | -1% ±1 | +0% | -1 | 7/6 |
| phalanx__b | b | hoplite | 3.14 | (rider hits) 3.14 |  | +6% ±1 | -1% ±0 | +0% | -3 | 8/6 |
| phalanx__ap | ap | hoplite | 3 | opening_thrust 2, phalanx__ap 1 |  | +9% ±1 | -3% ±1 | +0% | -3 | 10/6 |
| phalanx__bp | bp | hoplite | 2.97 | (rider hits) 2.97 |  | +13% ±1 | -3% ±1 | +0% | -6 | 9/6 |
| aspis__p | p | hoplite | 0.44 | aegis 1.72 (1.28) | 1.03/f: 0d 0h 1a (base 0.78/f: 0d 0h 1a) | +1% ±2 | +1% ±1 | +8% | +0 | 11/10 |
| aspis__a | a | hoplite | 0 | aegis 1.22 (1.28) | 0.78/f: 0d 0h 1a (base 0.78/f: 0d 0h 1a) | 0% ±0 | +0% ±0 | 0% | -0 | 10/10 |
| aspis__b | b | hoplite | 0 | aegis 0.39 (1.28) | 0.19/f: 0d 0h 1a (base 0.78/f: 0d 0h 1a) | +1% ±1 | +2% ±1 | +1% | -3 | 11/10 |
| aspis__ap | ap | hoplite | 0.36 | aegis 1.64 (1.28) | 1/f: 0d 0h 1a (base 0.78/f: 0d 0h 1a) | -1% ±1 | -2% ±2 | +3% | -1 | 10/10 |
| aspis__bp | bp | hoplite | 1.53 | aegis 2.81 (1.28) | 0.78/f: 0d 0h 2a (base 0.78/f: 0d 0h 1a) | +4% ±2 | -4% ±1 | +4% | +3 | 11/10 |
| paired_guard__p | p | hoplite | 0 | guard 1.33 (1.19) | 0.75/f: 0d 0h 2a (base 0.64/f: 0d 0h 2a) | +0% ±0 | +0% ±0 | +0% | +0 | 10/10 |
| paired_guard__a | a | hoplite | 0 | guard 0.89 (1.19) | 0.56/f: 0d 0h 2a (base 0.64/f: 0d 0h 2a) | -1% ±1 | +0% ±0 | +0% | -1 | 10/10 |
| paired_guard__b | b | hoplite | 0 | guard 1.19 (1.19) | 0.64/f: 0d 0h 2a (base 0.64/f: 0d 0h 2a) | +0% ±0 | +0% ±0 | +0% | +0 | 10/10 |
| paired_guard__ap | ap | hoplite | 0 | guard 0.92 (1.19) | 0.58/f: 0d 0h 2a (base 0.64/f: 0d 0h 2a) | -1% ±1 | +0% ±0 | +0% | -1 | 10/10 |
| paired_guard__bp | bp | hoplite | 0 | guard 1.33 (1.19) | 0.75/f: 0d 0h 2a (base 0.64/f: 0d 0h 2a) | +0% ±0 | +0% ±0 | +0% | +0 | 10/10 |
| spear_thrust__p | p | hoplite | 0 | sunder 12.83 (13.19) | 0.78/f: 4648d 0h 0a (base 0.78/f: 3580d 0h 1a) | +3% ±1 | -1% ±0 | +0% | -1 | 8/8 |
| spear_thrust__a | a | hoplite | 0 | sunder 13.08 (13.19) | 0.78/f: 4886d 0h 1a (base 0.78/f: 3580d 0h 1a) | +4% ±1 | -1% ±1 | +0% | -3 | 10/8 |
| spear_thrust__b | b | hoplite | 0 | sunder 13.33 (13.19) | 0.78/f: 2524d 0h 0a (base 0.78/f: 3580d 0h 1a) | -3% ±1 | -1% ±1 | +0% | +1 | 8/8 |
| spear_thrust__ap | ap | hoplite | 0 | sunder 12.36 (13.19) | 0.78/f: 6713d 0h 1a (base 0.78/f: 3580d 0h 1a) | +10% ±2 | -2% ±1 | +0% | -4 | 10/8 |
| spear_thrust__bp | bp | hoplite | 0 | sunder 13.22 (13.19) | 0.78/f: 3094d 0h 0a (base 0.78/f: 3580d 0h 1a) | -1% ±2 | -1% ±1 | +0% | +1 | 8/8 |
| judgement__p | p | paladin | static | - |  | +2% ±0 | 0% ±0 | -2% | -1 | 15/15 |
| judgement__a | a | paladin | static | - |  | -1% ±1 | 0% ±0 | +0% | +1 | 15/15 |
| judgement__b | b | paladin | static | - |  | -1% ±1 | +0% ±1 | +2% | -1 | 14/15 |
| judgement__ap | ap | paladin | static | - |  | +1% ±1 | -1% ±1 | -2% | -1 | 15/15 |
| judgement__bp | bp | paladin | static | - |  | +0% ±1 | 0% ±1 | +0% | -2 | 14/15 |
| sanctuary__p | p | paladin | 2.17 | ward 4.67 (2.5) | 1.56/f: 0d 0h 3a (base 0.75/f: 0d 0h 3a) | -6% ±2 | -5% ±2 | -28% | +1 | 11/15 |
| sanctuary__a | a | paladin | 8.69 | shield 8.69, ward 2.5 (2.5) | 0.75/f: 0d 0h 6a (base 0.75/f: 0d 0h 3a) | -1% ±1 | -14% ±2 | -19% | +4 | 15/15 |
| sanctuary__b | b | paladin | 11.83 | burn 74.5 (53.39), ward 2.5 (2.5) | 0.75/f: 0d 0h 6a (base 0.75/f: 0d 0h 3a) | +10% ±1 | -4% ±1 | -7% | -6 | 15/15 |
| sanctuary__ap | ap | paladin | 13 | shield 12.19, ward 3.31 (2.5) | 1/f: 0d 0h 6a (base 0.75/f: 0d 0h 3a) | -3% ±2 | -18% ±2 | +7% | +14 | 16/15 |
| sanctuary__bp | bp | paladin | 28.56 | burn 101.06 (53.39), ward 4.47 (2.5) | 1.5/f: 0d 0h 6a (base 0.75/f: 0d 0h 3a) | +14% ±2 | -12% ±2 | -24% | -3 | 17/15 |
| absolve__p | p | paladin | 0 | - | 1.33/f: 0d 2643h 0a (base 1.33/f: 0d 2272h 0a) | +1% ±0 | +1% ±1 | +16% | +0 | 12/12 |
| absolve__a | a | paladin | 0 | - | 0.94/f: 0d 2110h 0a (base 1.33/f: 0d 2272h 0a) | -7% ±2 | +5% ±2 | -34% | -7 | 6/12 |
| absolve__b | b | paladin | 0 | - | 0.56/f: 0d 0h 2a (base 1.33/f: 0d 2272h 0a) | +2% ±2 | -7% ±2 | -100% | -11 | 9/12 |
| absolve__ap | ap | paladin | 0 | - | 0.86/f: 0d 2120h 0a (base 1.33/f: 0d 2272h 0a) | -9% ±2 | +6% ±2 | -40% | -10 | 6/12 |
| absolve__bp | bp | paladin | 0 | - | 0.56/f: 0d 0h 2a (base 1.33/f: 0d 2272h 0a) | +3% ±3 | -7% ±2 | -100% | -10 | 9/12 |
| smite__p | p | paladin | 0 | burn 39.06 (41.5) | 1.31/f: 2977d 0h 1a (base 1.31/f: 2220d 0h 1a) | +3% ±1 | -1% ±0 | 0% | -0 | 9/9 |
| smite__a | a | paladin | 1.17 | stun 2.31 (1.14) | 1.33/f: 2218d 0h 1a (base 1.31/f: 2220d 0h 1a) | -13% ±2 | -2% ±2 | 0% | +2 | 7/9 |
| smite__b | b | paladin | 0 | burn 23.97 (41.5) | 0/f: 0d 0h 0a (base 1.31/f: 2220d 0h 1a) | -24% ±3 | +7% ±1 | +15% | +2 | 5/9 |
| smite__ap | ap | paladin | 1.03 | stun 2.17 (1.14) | 1.33/f: 2926d 0h 1a (base 1.31/f: 2220d 0h 1a) | -9% ±2 | -3% ±2 | 0% | +2 | 7/9 |
| smite__bp | bp | paladin | 0 | burn 23.97 (41.5) | 0/f: 0d 0h 0a (base 1.31/f: 2220d 0h 1a) | -24% ±3 | +7% ±1 | +15% | +2 | 5/9 |
| einherjar__p | p | valkyrie | 0 | - |  | +0% ±0 | +0% ±0 | +0% | +0 | 8/8 |
| einherjar__a | a | valkyrie | 0 | guard 0.08 (0.08) |  | +0% ±0 | +0% ±0 | +0% | +0 | 8/8 |
| einherjar__b | b | valkyrie | 4 | chooser_of_the_slain 3, einherjar__b 1 |  | +1% ±0 | -1% ±1 | +0% | -0 | 8/8 |
| einherjar__ap | ap | valkyrie | 0 | guard 0.08 (0.08) |  | +0% ±0 | +0% ±0 | +0% | +0 | 8/8 |
| einherjar__bp | bp | valkyrie | 4 | chooser_of_the_slain 3, einherjar__bp 1 |  | +1% ±0 | -1% ±1 | +0% | -0 | 8/8 |
| gale_spear__p | p | valkyrie | 0 | shock 19.17 (19.69) | 2.28/f: 1236d 0h 3a (base 2.28/f: 885d 0h 3a) | +2% ±0 | -2% ±1 | -4% | -2 | 14/13 |
| gale_spear__a | a | valkyrie | 6.5 | shock 30.17 (19.69) | 2.28/f: 785d 0h 3a (base 2.28/f: 885d 0h 3a) | -3% ±1 | +0% ±1 | -3% | -3 | 11/13 |
| gale_spear__b | b | valkyrie | 0 | shock 15.28 (19.69) | 2.42/f: 914d 0h 3a (base 2.28/f: 885d 0h 3a) | +1% ±1 | -5% ±1 | -5% | -2 | 15/13 |
| gale_spear__ap | ap | valkyrie | 5.94 | shock 29.39 (19.69) | 2.28/f: 1095d 0h 3a (base 2.28/f: 885d 0h 3a) | 0% ±1 | -2% ±1 | -5% | -3 | 13/13 |
| gale_spear__bp | bp | valkyrie | 0 | shock 14.28 (19.69) | 2.42/f: 1216d 0h 3a (base 2.28/f: 885d 0h 3a) | +4% ±1 | -6% ±1 | -2% | -1 | 15/13 |
| rally__p | p | valkyrie | 0 | - | 0.97/f: 0d 1646h 0a (base 0.97/f: 0d 1354h 0a) | +0% ±1 | +1% ±0 | +6% | -0 | 13/13 |
| rally__a | a | valkyrie | 1 | haste 1.06 (0.06) | 1/f: 0d 1354h 1a (base 0.97/f: 0d 1354h 0a) | +5% ±1 | 0% ±1 | +0% | -2 | 13/13 |
| rally__b | b | valkyrie | 0.81 | taunt 1.47 (0.67) | 0.75/f: 49d 2519h 1a (base 0.97/f: 0d 1354h 0a) | +3% ±2 | +1% ±1 | +14% | -0 | 11/13 |
| rally__ap | ap | valkyrie | 0.97 | haste 1.03 (0.06) | 0.97/f: 0d 1646h 1a (base 0.97/f: 0d 1354h 0a) | +5% ±2 | 0% ±1 | +5% | -2 | 14/13 |
| rally__bp | bp | valkyrie | 0.86 | taunt 1.53 (0.67) | 0.75/f: 49d 2660h 1a (base 0.97/f: 0d 1354h 0a) | +3% ±2 | +1% ±1 | +17% | +1 | 11/13 |
| valhalla__p | p | valkyrie | 0 | - | 0/f: 0d 0h 0a (base 0/f: 0d 0h 0a) | +0% ±0 | +0% ±0 | +0% | +0 | 5/5 |
| valhalla__a | a | valkyrie | 0 | - | 0/f: 0d 0h 0a (base 0/f: 0d 0h 0a) | +0% ±0 | +0% ±0 | +0% | +0 | 5/5 |
| valhalla__b | b | valkyrie | 0 | - | 0/f: 0d 0h 0a (base 0/f: 0d 0h 0a) | +0% ±0 | +0% ±0 | +0% | +0 | 5/5 |
| valhalla__ap | ap | valkyrie | 0 | - | 0/f: 0d 0h 0a (base 0/f: 0d 0h 0a) | +0% ±0 | +0% ±0 | +0% | +0 | 5/5 |
| valhalla__bp | bp | valkyrie | 0 | - | 0/f: 0d 0h 0a (base 0/f: 0d 0h 0a) | +0% ±0 | +0% ±0 | +0% | +0 | 5/5 |
| refrain__p | p | bard | 19.64 | refrain__p 19.64 |  | +4% ±1 | +1% ±0 | +40% | +1 | 11/11 |
| refrain__a | a | bard | 20.61 | refrain__a 20.61 |  | 0% ±2 | +0% ±1 | +20% | +1 | 9/11 |
| refrain__b | b | bard | 17.14 | might 15.47 (11.11), refrain__b 12.78 |  | +5% ±2 | -5% ±1 | -100% | -5 | 12/11 |
| refrain__ap | ap | bard | 20.69 | refrain__ap 20.69 |  | +4% ±2 | +1% ±1 | +74% | +0 | 11/11 |
| refrain__bp | bp | bard | 17.14 | might 15.81 (11.11), refrain__bp 12.44 |  | +11% ±2 | -6% ±1 | -100% | -6 | 13/11 |
| war_ballad__p | p | bard | 0 | might 8.94 (10.94) | 2.69/f: 0d 0h 3a (base 2.72/f: 0d 0h 3a) | +8% ±1 | -2% ±1 | +17% | -1 | 12/10 |
| war_ballad__a | a | bard | 0 | might 3.31 (10.94) | 1.92/f: 0d 0h 1a (base 2.72/f: 0d 0h 3a) | -3% ±2 | +2% ±1 | -1% | -1 | 10/10 |
| war_ballad__b | b | bard | 0 | - | 2.89/f: 0d 0h 0a (base 2.72/f: 0d 0h 3a) | -8% ±3 | +3% ±1 | +5% | +0 | 5/10 |
| war_ballad__ap | ap | bard | 0 | might 3.25 (10.94) | 1.94/f: 0d 0h 1a (base 2.72/f: 0d 0h 3a) | -1% ±2 | +2% ±1 | +3% | -2 | 11/10 |
| war_ballad__bp | bp | bard | 0 | - | 3.19/f: 0d 0h 0a (base 2.72/f: 0d 0h 3a) | -9% ±2 | +1% ±2 | +3% | +3 | 5/10 |
| allegro__p | p | bard | 0 | haste 3.58 (3.47) | 0.97/f: 0d 0h 3a (base 0.92/f: 0d 0h 3a) | 0% ±0 | 0% ±1 | -6% | -0 | 7/7 |
| allegro__a | a | bard | 0 | haste 3.47 (3.47) | 0.92/f: 0d 0h 3a (base 0.92/f: 0d 0h 3a) | 0% ±1 | +0% ±0 | 0% | -0 | 7/7 |
| allegro__b | b | bard | 0 | haste 2.22 (3.47) | 1.33/f: 0d 0h 1a (base 0.92/f: 0d 0h 3a) | -3% ±1 | 0% ±1 | -15% | -1 | 7/7 |
| allegro__ap | ap | bard | 0 | haste 3.58 (3.47) | 0.97/f: 0d 0h 3a (base 0.92/f: 0d 0h 3a) | 0% ±1 | -1% ±1 | -5% | -0 | 7/7 |
| allegro__bp | bp | bard | 0 | haste 2.53 (3.47) | 1.67/f: 0d 0h 1a (base 0.92/f: 0d 0h 3a) | -2% ±1 | -1% ±1 | -10% | +1 | 7/7 |
| thunder_chord__p | p | bard | 0 | shock 37.39 (37.81) | 0.97/f: 0d 0h 3a (base 0.97/f: 0d 0h 3a) | +1% ±0 | 0% ±0 | -1% | +0 | 19/17 |
| thunder_chord__a | a | bard | 0 | - | 0.97/f: 1343d 0h 0a (base 0.97/f: 0d 0h 3a) | -3% ±1 | -1% ±1 | -5% | +1 | 18/17 |
| thunder_chord__b | b | bard | 1.5 | slow 1.92 (0.42) | 0.78/f: 0d 0h 2a (base 0.97/f: 0d 0h 3a) | -4% ±1 | -7% ±2 | +27% | +5 | 19/17 |
| thunder_chord__ap | ap | bard | 0 | - | 0.97/f: 1866d 0h 0a (base 0.97/f: 0d 0h 3a) | -2% ±1 | -1% ±1 | -6% | +1 | 18/17 |
| thunder_chord__bp | bp | bard | 2.36 | slow 2.78 (0.42) | 0.97/f: 0d 0h 2a (base 0.97/f: 0d 0h 3a) | -3% ±1 | -12% ±3 | +47% | +5 | 19/17 |
| horn_of_the_keep | mythic | knight | 30.67 | horn_of_the_keep 30, taunt 2.44 (1.78) |  | +6% ±2 | -1% ±1 | -5% | -3 | 16/15 |
| halo_of_the_saint | mythic | cleric | 0.36 | halo_of_the_saint 0.19, halo_of_the_saint_kept 0.17 |  | +0% ±0 | +0% ±0 | +0% | +0 | 5/5 |
| huntmasters_quiver | mythic | ranger | 6.92 | huntmasters_quiver_mark 6.92 |  | +0% ±3 | -6% ±2 | -1% | +5 | 9/8 |
| heartwood_mail | mythic | bramble_knight | 17.92 | bleed 42.39 (32.56), heartwood_mail 11.11 |  | +4% ±1 | -2% ±1 | +1% | -0 | 21/21 |
| the_last_wall | mythic | hoplite | 0.44 | the_last_wall 0.44 |  | +2% ±1 | +0% ±0 | +0% | -0 | 13/13 |
| chains_of_light | mythic | paladin | 4.39 | chains_of_light 3.44, silence 1.58 (0.64) |  | +4% ±1 | 0% ±2 | +22% | +8 | 16/13 |
| stormspear | mythic | valkyrie | 8.67 | shock 31.47 (19.69) |  | +7% ±1 | -1% ±1 | -5% | -3 | 14/13 |
| metronome | mythic | bard | 45.19 | metronome 22.89, metronome_count 22.31 |  | +1% ±0 | +0% ±0 | +4% | +1 | 8/8 |

## Upgrades, part 2 (and mythics) (168)

No problems.

| item | rarity | carrier | fires | its statuses, a fight | casts | Δdealt | Δtaken | Δheal | Δticks | won |
|---|---|---|---:|---|---|---:|---:|---:|---:|---|
| cold_hex__p | p | hexer | 6.42 | chill 9.08 (8.72), cold_hex__p 6.08, stun 2.22 (2.11) |  | +3% ±1 | -1% ±3 | +0% | -1 | 17/16 |
| cold_hex__a | a | hexer | 11.47 | burn 98.03 (90.08), cold_hex__a 5.33 |  | +2% ±2 | +9% ±3 | +0% | -6 | 16/16 |
| cold_hex__b | b | hexer | 8.97 | chill 11.5 (8.72), cold_hex__b 6.11, stun 3.58 (2.11) |  | +12% ±2 | -9% ±3 | +0% | -2 | 24/16 |
| cold_hex__ap | ap | hexer | 10.97 | burn 97.11 (90.08), cold_hex__ap 5.33 |  | +5% ±2 | +7% ±3 | +0% | -6 | 19/16 |
| cold_hex__bp | bp | hexer | 8.58 | chill 11.19 (8.72), cold_hex__bp 6, stun 3.42 (2.11) |  | +13% ±3 | -11% ±2 | +0% | -2 | 25/16 |
| malison__p | p | hexer | 2.28 | burn 40.5 (41), shock 28.39 (28.47) | 0.69/f: 0d 0h 7a (base 0.69/f: 0d 0h 7a) | +3% ±1 | 0% ±0 | +0% | +0 | 8/8 |
| malison__a | a | hexer | 12.06 | burn 38.64 (41), shock 28.11 (28.47), bleed 12.06 | 0.69/f: 0d 0h 10a (base 0.69/f: 0d 0h 7a) | +5% ±1 | -2% ±1 | +0% | -0 | 11/8 |
| malison__b | b | hexer | 0 | burn 33 (41), shock 27.06 (28.47) | 0.69/f: 0d 0h 2a (base 0.69/f: 0d 0h 7a) | +1% ±2 | +2% ±1 | +0% | -1 | 5/8 |
| malison__ap | ap | hexer | 11.83 | burn 37.08 (41), shock 27.61 (28.47), bleed 11.83 | 0.69/f: 0d 0h 10a (base 0.69/f: 0d 0h 7a) | +9% ±1 | -3% ±1 | +0% | -1 | 13/8 |
| malison__bp | bp | hexer | 2.38 | burn 32.81 (41), shock 27 (28.47) | 0.69/f: 0d 0h 2a (base 0.69/f: 0d 0h 7a) | +5% ±3 | +2% ±1 | +0% | -1 | 5/8 |
| unmake__p | p | hexer | 0 | silence 0.42 (0.42) | 0.33/f: 0d 0h 1a (base 0.33/f: 0d 0h 1a) | -1% ±1 | +0% ±0 | -3% | -0 | 4/4 |
| unmake__a | a | hexer | 0.14 | silence 0.56 (0.42) | 0.33/f: 0d 0h 1a (base 0.33/f: 0d 0h 1a) | +1% ±1 | -2% ±1 | +6% | +2 | 4/4 |
| unmake__b | b | hexer | 0.92 | broken_spell 0.92, silence 0.42 (0.42) | 0.33/f: 1510d 0h 2a (base 0.33/f: 0d 0h 1a) | +5% ±2 | +0% ±0 | +2% | +0 | 4/4 |
| unmake__ap | ap | hexer | 0.17 | silence 0.58 (0.42) | 0.33/f: 0d 0h 2a (base 0.33/f: 0d 0h 1a) | +0% ±1 | -3% ±1 | +6% | +2 | 4/4 |
| unmake__bp | bp | hexer | 0.92 | broken_spell 0.92, silence 0.42 (0.42) | 0.33/f: 1520d 0h 2a (base 0.33/f: 0d 0h 1a) | +3% ±2 | +0% ±0 | -1% | -0 | 4/4 |
| enfeeble__p | p | hexer | 0 | sunder 1.14 (1.31), weaken 1.11 (1.11) | 1.06/f: 0d 0h 2a (base 1.06/f: 0d 0h 2a) | +1% ±0 | -1% ±0 | +0% | +1 | 8/8 |
| enfeeble__a | a | hexer | 0 | weaken 1.08 (1.11) | 0.42/f: 0d 0h 3a (base 1.06/f: 0d 0h 2a) | -3% ±2 | +0% ±2 | +0% | -1 | 7/8 |
| enfeeble__b | b | hexer | 0 | sunder 1.06 (1.31) | 1.06/f: 0d 0h 1a (base 1.06/f: 0d 0h 2a) | -1% ±2 | +2% ±1 | +0% | -1 | 8/8 |
| enfeeble__ap | ap | hexer | 0 | weaken 1.25 (1.11) | 0.5/f: 0d 0h 3a (base 1.06/f: 0d 0h 2a) | -3% ±2 | -3% ±2 | +0% | +0 | 8/8 |
| enfeeble__bp | bp | hexer | 0 | sunder 1.06 (1.31) | 1.06/f: 0d 0h 1a (base 1.06/f: 0d 0h 2a) | 0% ±2 | +2% ±1 | +0% | -1 | 8/8 |
| iron_palm__p | p | monk | 7.86 | sunder 8.72 (8.97), iron_palm__p 7.86 |  | +3% ±1 | +0% ±0 | +2% | -0 | 7/7 |
| iron_palm__a | a | monk | 18.28 | sunder 14.14 (8.97), iron_palm__a 13.11 |  | +7% ±2 | +0% ±1 | +7% | -0 | 8/7 |
| iron_palm__b | b | monk | 19.97 | iron_palm__b 19.97, sunder 9.25 (8.97) |  | +1% ±0 | +1% ±0 | +53% | +1 | 8/7 |
| iron_palm__ap | ap | monk | 17.69 | sunder 13.69 (8.97), iron_palm__ap 12.97 |  | +10% ±2 | -1% ±1 | +11% | -1 | 9/7 |
| iron_palm__bp | bp | monk | 20.33 | iron_palm__bp 20.33, sunder 8.97 (8.97) |  | +4% ±1 | +2% ±0 | +60% | +0 | 8/7 |
| flow__p | p | monk | 0 | haste 3.56 (3.47) | 0.92/f: 0d 0h 1a (base 0.83/f: 0d 0h 1a) | -2% ±1 | +0% ±0 | -1% | -0 | 7/7 |
| flow__a | a | monk | 12.72 | flow_state 6.53, flow_state_count 5.47, haste 4.19 (3.47) | 0.83/f: 0d 0h 2a (base 0.83/f: 0d 0h 1a) | +1% ±1 | 0% ±0 | +0% | -0 | 8/7 |
| flow__b | b | monk | 1.78 | taunt 1.56 (0.67), stillness_of_mind 0.89 | 0.89/f: 0d 0h 2a (base 0.83/f: 0d 0h 1a) | +5% ±2 | -5% ±2 | +24% | +0 | 9/7 |
| flow__ap | ap | monk | 14.69 | flow_state 7.47, flow_state_count 6.31, haste 4.39 (3.47) | 0.92/f: 0d 0h 2a (base 0.83/f: 0d 0h 1a) | -1% ±1 | +0% ±0 | +1% | -0 | 7/7 |
| flow__bp | bp | monk | 1.97 | taunt 1.67 (0.67), stillness_of_mind 0.97 | 0.97/f: 0d 0h 2a (base 0.83/f: 0d 0h 1a) | +2% ±2 | -6% ±2 | +25% | +1 | 9/7 |
| burning_fist__p | p | monk | 4.61 | burn 32.42 (33.33) | 1.44/f: 671d 0h 3a (base 1.36/f: 689d 0h 3a) | +5% ±1 | 0% ±1 | +4% | +0 | 8/7 |
| burning_fist__a | a | monk | 4.22 | chill 4.78 (0.56), stun 1.08 (1.08) | 1.42/f: 675d 0h 3a (base 1.36/f: 689d 0h 3a) | -11% ±1 | +1% ±1 | +14% | +2 | 5/7 |
| burning_fist__b | b | monk | 4.19 | burn 38.25 (33.33) | 1.5/f: 554d 0h 5a (base 1.36/f: 689d 0h 3a) | +4% ±2 | 0% ±1 | +0% | -1 | 8/7 |
| burning_fist__ap | ap | monk | 4.28 | chill 4.89 (0.56), stun 1.19 (1.08) | 1.39/f: 679d 0h 3a (base 1.36/f: 689d 0h 3a) | -10% ±1 | +0% ±1 | +14% | +3 | 5/7 |
| burning_fist__bp | bp | monk | 2.69 | burn 35.89 (33.33) | 1.47/f: 528d 0h 5a (base 1.36/f: 689d 0h 3a) | +10% ±2 | -2% ±1 | -1% | +0 | 8/7 |
| pressure_point__p | p | monk | 0 | stun 1.11 (1.22) | 0.97/f: 2109d 0h 1a (base 0.97/f: 1443d 0h 1a) | +3% ±1 | -1% ±1 | +0% | +0 | 8/8 |
| pressure_point__a | a | monk | 2.58 | lingering_point 1.64, stun 1.22 (1.22), slow 1.19 (0.25) | 0.97/f: 1443d 0h 2a (base 0.97/f: 1443d 0h 1a) | +1% ±0 | 0% ±1 | +0% | +1 | 8/8 |
| pressure_point__b | b | monk | 0 | - | 0.97/f: 2921d 0h 0a (base 0.97/f: 1443d 0h 1a) | +7% ±2 | +0% ±3 | +0% | +1 | 9/8 |
| pressure_point__ap | ap | monk | 2.42 | lingering_point 1.5, slow 1.17 (0.25), stun 1.11 (1.22) | 0.97/f: 2109d 0h 2a (base 0.97/f: 1443d 0h 1a) | +4% ±1 | -1% ±1 | +0% | +1 | 8/8 |
| pressure_point__bp | bp | monk | 0 | - | 0.97/f: 3416d 0h 0a (base 0.97/f: 1443d 0h 1a) | +10% ±3 | 0% ±3 | +0% | -1 | 10/8 |
| lacerate__p | p | assassin | 2.8 | bleed 7.92 (7.44), lacerate__p 1.5 |  | +2% ±1 | 0% ±0 | -1% | -0 | 7/7 |
| lacerate__a | a | assassin | 20.17 | bleed 20.08 (7.44), lacerate__a 10.08, opening_wound 2.31 |  | +18% ±3 | -5% ±2 | +6% | +1 | 9/7 |
| lacerate__b | b | assassin | 2.56 | bleed 7.33 (7.44), lacerate__b 2.56 |  | 0% ±0 | +0% ±0 | +0% | +0 | 7/7 |
| lacerate__ap | ap | assassin | 20.33 | bleed 20.81 (7.44), lacerate__ap 10.03, opening_wound 2.31 |  | +25% ±4 | -6% ±2 | +3% | -0 | 11/7 |
| lacerate__bp | bp | assassin | 3.7 | bleed 7.86 (7.44), lacerate__bp 2.56 |  | +2% ±1 | 0% ±0 | -1% | -0 | 7/7 |
| vanish__p | p | assassin | 0 | hidden 1.64 (1.47) | 1.64/f: 0d 0h 1a (base 1.47/f: 0d 0h 1a) | +1% ±2 | +1% ±2 | +0% | -2 | 7/9 |
| vanish__a | a | assassin | 0 | hidden 1.33 (1.47) | 1.33/f: 0d 0h 1a (base 1.47/f: 0d 0h 1a) | -2% ±3 | +2% ±2 | +0% | +0 | 9/9 |
| vanish__b | b | assassin | 5.44 | shadow_step 2.86, shadow_step_strike 2.58, hidden 1.5 (1.47) | 1.5/f: 0d 0h 2a (base 1.47/f: 0d 0h 1a) | +5% ±1 | -1% ±0 | +0% | +0 | 10/9 |
| vanish__ap | ap | assassin | 0 | hidden 1.5 (1.47) | 1.5/f: 0d 0h 1a (base 1.47/f: 0d 0h 1a) | -1% ±3 | +1% ±2 | +0% | -1 | 7/9 |
| vanish__bp | bp | assassin | 5.64 | shadow_step 3.03, shadow_step_strike 2.61, hidden 1.61 (1.47) | 1.61/f: 0d 0h 2a (base 1.47/f: 0d 0h 1a) | +9% ±2 | 0% ±1 | +0% | -3 | 10/9 |
| backstab__p | p | assassin | 0 | - | 1.25/f: 2137d 0h 0a (base 1.25/f: 1678d 0h 0a) | +3% ±1 | +0% ±1 | +0% | +0 | 8/8 |
| backstab__a | a | assassin | 0.64 | coup_de_grace 0.64 | 1.56/f: 1811d 0h 0a (base 1.25/f: 1678d 0h 0a) | -1% ±2 | +0% ±1 | +0% | +1 | 6/8 |
| backstab__b | b | assassin | 0 | - | 1.25/f: 2670d 0h 0a (base 1.25/f: 1678d 0h 0a) | +6% ±1 | 0% ±1 | +0% | -0 | 10/8 |
| backstab__ap | ap | assassin | 1.06 | coup_de_grace 1.06 | 1.81/f: 2249d 0h 0a (base 1.25/f: 1678d 0h 0a) | +2% ±2 | -1% ±1 | +0% | +1 | 7/8 |
| backstab__bp | bp | assassin | 0 | - | 1.25/f: 3210d 0h 0a (base 1.25/f: 1678d 0h 0a) | +9% ±2 | -2% ±2 | +0% | -0 | 11/8 |
| garrote__p | p | assassin | 0 | silence 0.86 (0.81) | 1/f: 2460d 0h 1a (base 0.86/f: 2497d 0h 1a) | +1% ±1 | 0% ±0 | +0% | -1 | 9/8 |
| garrote__a | a | assassin | 0 | silence 0.61 (0.81) | 0.61/f: 2383d 0h 1a (base 0.86/f: 2497d 0h 1a) | -2% ±1 | -2% ±1 | +0% | +5 | 6/8 |
| garrote__b | b | assassin | 2.94 | bleed 18.28 (20.5), rot 0.69 | 0.86/f: 2497d 0h 2a (base 0.86/f: 2497d 0h 1a) | +5% ±2 | +6% ±3 | +0% | -4 | 10/8 |
| garrote__ap | ap | assassin | 0 | silence 0.69 (0.81) | 0.72/f: 2293d 0h 1a (base 0.86/f: 2497d 0h 1a) | +0% ±2 | -2% ±1 | +0% | +5 | 7/8 |
| garrote__bp | bp | assassin | 3.02 | bleed 18.25 (20.5), rot 0.72 | 0.97/f: 2441d 0h 1a (base 0.86/f: 2497d 0h 1a) | +6% ±2 | +6% ±3 | +0% | -4 | 10/8 |
| bloodlust__p | p | vampire | 30.65 | bloodlust__p 26.94, lifesteal 20.53 (20.44), bloodlust_on_plus 2.42 |  | +1% ±1 | +2% ±1 | +5% | +0 | 9/9 |
| bloodlust__a | a | vampire | 35.39 | bloodlust__a 26.47, lifesteal 20.72 (20.44), shared_feast_on 8.92 |  | +1% ±1 | +2% ±1 | +15% | +3 | 9/9 |
| bloodlust__b | b | vampire | 30.63 | bloodlust__b 28.53, lifesteal 21.39 (20.44), bloodlust_on 2.25 (2.19), undying_thirst 0.53 |  | +2% ±1 | +0% ±0 | +5% | +2 | 9/9 |
| bloodlust__ap | ap | vampire | 37.82 | bloodlust__ap 27.39, lifesteal 21.56 (20.44), shared_feast_on_plus 9.11 |  | +2% ±1 | +4% ±1 | +25% | +7 | 8/9 |
| bloodlust__bp | bp | vampire | 33.87 | bloodlust__bp 28.53, lifesteal 21.28 (20.44), bloodlust_on_plus 2.53, undying_thirst_plus 0.44 |  | +1% ±1 | +2% ±1 | +9% | +2 | 9/9 |
| blood_drain__p | p | vampire | 0 | weaken 3.14 (3.39) | 3.17/f: 2105d 0h 1a (base 3.17/f: 1450d 0h 1a) | +6% ±1 | 0% ±1 | +8% | -1 | 15/13 |
| blood_drain__a | a | vampire | 4.33 | bleed 23.61 (17.19) | 2.58/f: 1505d 0h 1a (base 3.17/f: 1450d 0h 1a) | +25% ±5 | -1% ±2 | -9% | -12 | 17/13 |
| blood_drain__b | b | vampire | 11.17 | drain_the_well 11.17 | 2.92/f: 1552d 0h 1a (base 3.17/f: 1450d 0h 1a) | -3% ±2 | +6% ±1 | +8% | -5 | 12/13 |
| blood_drain__ap | ap | vampire | 4.72 | bleed 24.14 (17.19) | 2.67/f: 2072d 0h 1a (base 3.17/f: 1450d 0h 1a) | +33% ±5 | -3% ±2 | -1% | -11 | 19/13 |
| blood_drain__bp | bp | vampire | 10.92 | drain_the_well 10.92 | 2.97/f: 2190d 0h 1a (base 3.17/f: 1450d 0h 1a) | +5% ±2 | +5% ±1 | +22% | -5 | 15/13 |
| blood_gift__p | p | vampire | 0 | clarity 7.39 (7.17) | 1.11/f: 0d 956h 1a (base 1.11/f: 0d 730h 1a) | +0% ±0 | +1% ±0 | +6% | +0 | 17/17 |
| blood_gift__a | a | vampire | 0 | clarity 4.81 (7.17) | 0.92/f: 0d 0h 1a (base 1.11/f: 0d 730h 1a) | +0% ±1 | -4% ±1 | -39% | -4 | 19/17 |
| blood_gift__b | b | vampire | 0 | - | 0.36/f: 0d 0h 2a (base 1.11/f: 0d 730h 1a) | +1% ±1 | -5% ±1 | -26% | +1 | 18/17 |
| blood_gift__ap | ap | vampire | 0 | clarity 4.81 (7.17) | 0.92/f: 0d 0h 1a (base 1.11/f: 0d 730h 1a) | +1% ±1 | -4% ±1 | -39% | -4 | 19/17 |
| blood_gift__bp | bp | vampire | 0 | - | 0.36/f: 0d 0h 2a (base 1.11/f: 0d 730h 1a) | +1% ±2 | -5% ±1 | -27% | +1 | 18/17 |
| frenzy__p | p | vampire | 0 | might 1.83 (2.19) | 1/f: 0d 0h 1a (base 1/f: 0d 0h 1a) | +4% ±1 | +0% ±1 | +9% | -0 | 14/13 |
| frenzy__a | a | vampire | 3.59 | lifesteal 19.25 (18.78), might 2.22 (2.19), feeding_frenzy 1.42 | 1/f: 0d 0h 2a (base 1/f: 0d 0h 1a) | +1% ±1 | +2% ±1 | +16% | +1 | 13/13 |
| frenzy__b | b | vampire | 0 | might 1.78 (2.19) | 0.97/f: 0d 0h 1a (base 1/f: 0d 0h 1a) | -2% ±1 | -1% ±1 | -15% | -3 | 11/13 |
| frenzy__ap | ap | vampire | 2.5 | lifesteal 21 (18.78), might 2.03 (2.19), feeding_frenzy 1.25 | 1/f: 0d 0h 2a (base 1/f: 0d 0h 1a) | +6% ±1 | +3% ±1 | +37% | +5 | 16/13 |
| frenzy__bp | bp | vampire | 0 | might 1.72 (2.19) | 0.97/f: 0d 0h 1a (base 1/f: 0d 0h 1a) | +1% ±1 | -1% ±1 | -16% | -4 | 12/13 |
| kindling__p | p | pyromancer | 1.92 | burn 88.92 (90.08), kindling__p 1.92 |  | +2% ±0 | -1% ±0 | +0% | -1 | 18/16 |
| kindling__a | a | pyromancer | 2 | burn 95.25 (90.08), kindling__a 2 |  | +2% ±1 | -1% ±1 | +0% | -0 | 18/16 |
| kindling__b | b | pyromancer | 2.08 | burn 88.75 (90.08), kindling__b 2.08 |  | +3% ±1 | -1% ±1 | +0% | +0 | 20/16 |
| kindling__ap | ap | pyromancer | 7.25 | burn 93.58 (90.08), kindling__ap 1.94 |  | +5% ±1 | -2% ±1 | +0% | -1 | 20/16 |
| kindling__bp | bp | pyromancer | 8.56 | burn 86.28 (90.08), kindling__bp 1.97 |  | +6% ±2 | -1% ±1 | +0% | -1 | 21/16 |
| firebolt__p | p | pyromancer | 2.49 | burn 40.92 (41) | 1.14/f: 1207d 0h 1a (base 1.14/f: 1207d 0h 1a) | +2% ±1 | 0% ±0 | +0% | +1 | 8/8 |
| firebolt__a | a | pyromancer | 6.54 | burn 41.06 (41) | 1.17/f: 596d 0h 1a (base 1.14/f: 1207d 0h 1a) | +6% ±2 | 0% ±0 | +0% | +1 | 10/8 |
| firebolt__b | b | pyromancer | 0 | burn 42.58 (41) | 1.36/f: 1173d 0h 1a (base 1.14/f: 1207d 0h 1a) | -1% ±1 | +1% ±0 | +0% | -1 | 7/8 |
| firebolt__ap | ap | pyromancer | 8.27 | burn 39.53 (41) | 1.17/f: 596d 0h 1a (base 1.14/f: 1207d 0h 1a) | +11% ±2 | -1% ±0 | +0% | +0 | 12/8 |
| firebolt__bp | bp | pyromancer | 0 | burn 42.47 (41) | 1.36/f: 1196d 0h 1a (base 1.14/f: 1207d 0h 1a) | +1% ±1 | 0% ±1 | +0% | -1 | 7/8 |
| fireball__p | p | pyromancer | 0 | burn 40.61 (41) | 0.56/f: 2399d 0h 2a (base 0.56/f: 1754d 0h 2a) | +1% ±0 | 0% ±0 | +0% | +0 | 8/8 |
| fireball__a | a | pyromancer | 0 | burn 39.47 (41) | 0.33/f: 1074d 0h 2a (base 0.56/f: 1754d 0h 2a) | -1% ±2 | +2% ±1 | +0% | -1 | 6/8 |
| fireball__b | b | pyromancer | 0 | burn 42.75 (41) | 0.83/f: 1346d 0h 3a (base 0.56/f: 1754d 0h 2a) | +2% ±1 | 0% ±1 | +0% | +0 | 9/8 |
| fireball__ap | ap | pyromancer | 0 | burn 39.56 (41) | 0.33/f: 1448d 0h 1a (base 0.56/f: 1754d 0h 2a) | +0% ±2 | +2% ±1 | +0% | -1 | 7/8 |
| fireball__bp | bp | pyromancer | 0 | burn 41.75 (41) | 0.83/f: 1874d 0h 3a (base 0.56/f: 1754d 0h 2a) | +2% ±1 | -1% ±1 | +0% | -0 | 9/8 |
| pyre__p | p | pyromancer | 0 | - | 0.72/f: 3837d 0h 0a (base 0.72/f: 2957d 0h 0a) | +2% ±1 | -1% ±0 | +0% | -1 | 18/16 |
| pyre__a | a | pyromancer | 0 | - | 0.72/f: 3407d 0h 0a (base 0.72/f: 2957d 0h 0a) | +1% ±1 | -1% ±1 | +0% | -1 | 17/16 |
| pyre__b | b | pyromancer | 1.83 | pyre_of_the_fallen 1.83 | 0.72/f: 2957d 0h 0a (base 0.72/f: 2957d 0h 0a) | +0% ±0 | +0% ±0 | +0% | +0 | 16/16 |
| pyre__ap | ap | pyromancer | 0 | - | 0.72/f: 4281d 0h 0a (base 0.72/f: 2957d 0h 0a) | +3% ±1 | -2% ±1 | +0% | -2 | 17/16 |
| pyre__bp | bp | pyromancer | 1.92 | pyre_of_the_fallen 1.92 | 0.72/f: 3837d 0h 0a (base 0.72/f: 2957d 0h 0a) | +2% ±1 | -1% ±0 | +0% | -1 | 18/16 |
| shatterpoint__p | p | frostweaver | 1.19 | sunder 3.47 (3.5), shatterpoint__p 1.19 |  | +0% ±0 | 0% ±0 | +0% | -0 | 5/5 |
| shatterpoint__a | a | frostweaver | 2.28 | sunder 3.64 (3.5), silence 1.61 (0.58), shatterpoint__a 1.25 |  | +1% ±1 | -3% ±1 | +0% | +2 | 5/5 |
| shatterpoint__b | b | frostweaver | 3.11 | sunder 3.47 (3.5), shatterpoint__b 3.11 |  | +7% ±1 | -2% ±1 | +0% | +0 | 9/5 |
| shatterpoint__ap | ap | frostweaver | 2.28 | sunder 3.61 (3.5), silence 1.61 (0.58), shatterpoint__ap 1.25 |  | +1% ±1 | -3% ±1 | +0% | +2 | 5/5 |
| shatterpoint__bp | bp | frostweaver | 3.11 | sunder 3.44 (3.5), shatterpoint__bp 3.11 |  | +7% ±1 | -2% ±1 | +0% | +0 | 9/5 |
| frost_lance__p | p | frostweaver | 1.42 | chill 12.36 (11.83), stun 1.17 (1.11) | 1.17/f: 1025d 0h 1a (base 1.11/f: 1023d 0h 1a) | +4% ±1 | +0% ±2 | +0% | +1 | 7/5 |
| frost_lance__a | a | frostweaver | 1.28 | chill 12.11 (11.83), slow 1.36 (0.08), stun 1.17 (1.11) | 1.22/f: 991d 0h 2a (base 1.11/f: 1023d 0h 1a) | +2% ±3 | +1% ±3 | +0% | +0 | 4/5 |
| frost_lance__b | b | frostweaver | 1.36 | chill 12.92 (11.83), stun 0.78 (1.11) | 1.19/f: 1196d 0h 2a (base 1.11/f: 1023d 0h 1a) | -1% ±3 | -1% ±4 | +0% | +3 | 5/5 |
| frost_lance__ap | ap | frostweaver | 1.97 | chill 12.47 (11.83), slow 1.36 (0.08), stun 1.36 (1.11) | 1.22/f: 997d 0h 2a (base 1.11/f: 1023d 0h 1a) | +5% ±3 | +1% ±3 | +0% | +1 | 6/5 |
| frost_lance__bp | bp | frostweaver | 2.08 | chill 13.89 (11.83), stun 1.08 (1.11) | 1.17/f: 1210d 0h 2a (base 1.11/f: 1023d 0h 1a) | +5% ±3 | -2% ±4 | +0% | +3 | 8/5 |
| blizzard__p | p | frostweaver | 0 | chill 11.81 (11.83), stun 1.11 (1.11) | 0.64/f: 2546d 0h 3a (base 0.64/f: 1841d 0h 3a) | +2% ±1 | -1% ±0 | +0% | +0 | 5/5 |
| blizzard__a | a | frostweaver | 1.08 | chill 12.42 (11.83), stun 1.17 (1.11) | 0.64/f: 0d 0h 3a (base 0.64/f: 1841d 0h 3a) | -3% ±1 | +2% ±1 | +0% | +1 | 6/5 |
| blizzard__b | b | frostweaver | 0 | - | 0.64/f: 2282d 0h 0a (base 0.64/f: 1841d 0h 3a) | -1% ±1 | +0% ±1 | +0% | +0 | 5/5 |
| blizzard__ap | ap | frostweaver | 1.83 | chill 13.58 (11.83), stun 1.42 (1.11) | 0.64/f: 0d 0h 3a (base 0.64/f: 1841d 0h 3a) | +5% ±2 | -2% ±2 | +0% | +2 | 8/5 |
| blizzard__bp | bp | frostweaver | 0 | - | 0.64/f: 3146d 0h 0a (base 0.64/f: 1841d 0h 3a) | +1% ±1 | -1% ±1 | +0% | +1 | 5/5 |
| stillness__p | p | frostweaver | 0 | chill 10.22 (10.17), clarity 3.22 (3.17), stun 0.72 (0.72) | 0.5/f: 0d 0h 4a (base 0.5/f: 0d 0h 4a) | +0% ±0 | +0% ±0 | -1% | +0 | 4/4 |
| stillness__a | a | frostweaver | 1.83 | clarity 3.28 (3.17), deep_calm 1, deep_calm_free 0.83 | 0.5/f: 0d 0h 2a (base 0.5/f: 0d 0h 4a) | -3% ±2 | +2% ±1 | -7% | -1 | 4/4 |
| stillness__b | b | frostweaver | 0 | chill 8.78 (10.17), clarity 0.97 (3.17), stun 0.78 (0.72) | 0.19/f: 0d 0h 2a (base 0.5/f: 0d 0h 4a) | +1% ±2 | +0% ±1 | -6% | -0 | 6/4 |
| stillness__ap | ap | frostweaver | 1.83 | clarity 3.28 (3.17), deep_calm 1, deep_calm_free 0.83 | 0.5/f: 0d 0h 2a (base 0.5/f: 0d 0h 4a) | -2% ±2 | +2% ±1 | -7% | -1 | 4/4 |
| stillness__bp | bp | frostweaver | 0 | chill 8.86 (10.17), clarity 1.22 (3.17), stun 0.81 (0.72) | 0.22/f: 0d 0h 2a (base 0.5/f: 0d 0h 4a) | +1% ±2 | 0% ±1 | -5% | -0 | 5/4 |
| arc__p | p | stormcaller | 10.18 | shock 28.22 (28.47), arc__p 8 |  | +2% ±0 | -1% ±0 | +0% | +1 | 8/8 |
| arc__a | a | stormcaller | 11.75 | shock 30.5 (28.47), arc__a 11.75 |  | +5% ±1 | -3% ±1 | +0% | +1 | 11/8 |
| arc__b | b | stormcaller | 10.19 | shock 27.92 (28.47), arc__b 10.19 |  | +5% ±1 | +0% ±1 | +0% | -1 | 9/8 |
| arc__ap | ap | stormcaller | 16.38 | shock 30.56 (28.47), arc__ap 11.83 |  | +8% ±1 | -4% ±1 | +0% | +1 | 13/8 |
| arc__bp | bp | stormcaller | 13.94 | shock 27.89 (28.47), arc__bp 10.25 |  | +7% ±2 | +0% ±1 | +0% | -1 | 9/8 |
| chain_lightning__p | p | stormcaller | 0 | shock 33.08 (33.86) | 0.92/f: 3616d 0h 4a (base 0.92/f: 2589d 0h 4a) | +2% ±1 | -1% ±1 | -6% | -0 | 15/15 |
| chain_lightning__a | a | stormcaller | 0 | shock 30.78 (33.86) | 0.92/f: 2798d 0h 1a (base 0.92/f: 2589d 0h 4a) | -4% ±1 | +0% ±1 | +6% | +2 | 16/15 |
| chain_lightning__b | b | stormcaller | 0 | shock 33.83 (33.86) | 0.92/f: 2589d 0h 4a (base 0.92/f: 2589d 0h 4a) | +0% ±0 | 0% ±0 | +0% | +0 | 15/15 |
| chain_lightning__ap | ap | stormcaller | 0 | shock 29.47 (33.86) | 0.92/f: 3823d 0h 1a (base 0.92/f: 2589d 0h 4a) | -3% ±1 | -1% ±1 | +6% | +1 | 16/15 |
| chain_lightning__bp | bp | stormcaller | 0 | shock 33.11 (33.86) | 0.92/f: 3616d 0h 4a (base 0.92/f: 2589d 0h 4a) | +2% ±0 | -1% ±1 | -6% | -0 | 15/15 |
| thunderstorm__p | p | stormcaller | 0 | shock 37.22 (37.81) | 0.94/f: 2936d 0h 3a (base 0.94/f: 2138d 0h 3a) | +1% ±0 | 0% ±0 | -1% | -0 | 17/17 |
| thunderstorm__a | a | stormcaller | 0 | shock 36.92 (37.81) | 0.94/f: 3052d 0h 3a (base 0.94/f: 2138d 0h 3a) | +1% ±0 | -1% ±0 | 0% | +0 | 17/17 |
| thunderstorm__b | b | stormcaller | 10.47 | static_field 10.47 | 0.94/f: 0d 0h 3a (base 0.94/f: 2138d 0h 3a) | -6% ±1 | +3% ±1 | +9% | +2 | 15/17 |
| thunderstorm__ap | ap | stormcaller | 0 | shock 36.42 (37.81) | 0.94/f: 4116d 0h 3a (base 0.94/f: 2138d 0h 3a) | +2% ±0 | -3% ±1 | +1% | +1 | 19/17 |
| thunderstorm__bp | bp | stormcaller | 10.42 | static_field_plus 10.42 | 0.94/f: 0d 0h 3a (base 0.94/f: 2138d 0h 3a) | -5% ±1 | +3% ±1 | +5% | +1 | 15/17 |
| static_charge__p | p | stormcaller | 0 | haste 0.72 (0.69) | 0.69/f: 0d 0h 1a (base 0.67/f: 0d 0h 1a) | -1% ±0 | +1% ±0 | +0% | -0 | 7/8 |
| static_charge__a | a | stormcaller | 2.06 | overcharge 1.33, overcharge_charges 0.72, haste 0.69 (0.69) | 0.67/f: 0d 0h 2a (base 0.67/f: 0d 0h 1a) | +3% ±1 | 0% ±0 | +0% | +0 | 8/8 |
| static_charge__b | b | stormcaller | 1.67 | thorns 1, storm_shield 0.67 | 0.67/f: 0d 0h 2a (base 0.67/f: 0d 0h 1a) | -1% ±1 | +1% ±0 | +0% | -1 | 7/8 |
| static_charge__ap | ap | stormcaller | 2.14 | overcharge 1.39, overcharge_charges 0.75, haste 0.72 (0.69) | 0.69/f: 0d 0h 2a (base 0.67/f: 0d 0h 1a) | +2% ±1 | +0% ±0 | +0% | -0 | 8/8 |
| static_charge__bp | bp | stormcaller | 2 | thorns 1.31, storm_shield 0.69 | 0.69/f: 0d 0h 2a (base 0.67/f: 0d 0h 1a) | -2% ±1 | +1% ±1 | +0% | -1 | 7/8 |
| bedrock__p | p | geomancer | 2.61 | bedrock__p 1.67, bedrock_on_plus 0.94 |  | +1% ±0 | 0% ±0 | +0% | -0 | 6/6 |
| bedrock__a | a | geomancer | 3.86 | bedrock__a 3.06, stun 2.78 (1.97), bedrock_on 0.94 (0.94) |  | +0% ±0 | -1% ±1 | +0% | +1 | 6/6 |
| bedrock__b | b | geomancer | 3.69 | bedrock__b 2.39, faultline 1.31, bedrock_on 0.94 (0.94) |  | +4% ±1 | -1% ±0 | +0% | -1 | 8/6 |
| bedrock__ap | ap | geomancer | 4.75 | bedrock__ap 3.03, stun 2.75 (1.97), bedrock_on_plus 0.94 |  | +2% ±1 | -1% ±1 | +0% | +0 | 6/6 |
| bedrock__bp | bp | geomancer | 4.61 | bedrock__bp 2.39, faultline 1.28, bedrock_on_plus 0.94 |  | +5% ±1 | -1% ±1 | +0% | -1 | 8/6 |
| earthen_shell__p | p | geomancer | 5.81 | shield 25.06 (19.25) | 1.69/f: 0d 0h 2a (base 0.94/f: 0d 0h 2a) | -3% ±2 | -8% ±3 | +0% | +3 | 6/6 |
| earthen_shell__a | a | geomancer | 2.58 | shield 21.83 (19.25) | 0.94/f: 0d 0h 3a (base 0.94/f: 0d 0h 2a) | -2% ±2 | -3% ±2 | +0% | +2 | 7/6 |
| earthen_shell__b | b | geomancer | 2.19 | shield 12.44 (19.25), guard 3.81 (2.89), rampart 1.28 | 0.94/f: 0d 0h 3a (base 0.94/f: 0d 0h 2a) | -6% ±2 | +6% ±1 | +0% | -5 | 6/6 |
| earthen_shell__ap | ap | geomancer | 10.53 | shield 29.78 (19.25) | 1.69/f: 0d 0h 3a (base 0.94/f: 0d 0h 2a) | +2% ±3 | -15% ±2 | +0% | +10 | 10/6 |
| earthen_shell__bp | bp | geomancer | 3.97 | shield 15.75 (19.25), guard 4.53 (2.89), rampart 2.33 | 1.69/f: 0d 0h 3a (base 0.94/f: 0d 0h 2a) | 0% ±3 | +1% ±2 | +0% | +1 | 7/6 |
| rockfall__p | p | geomancer | 0 | - | 1.53/f: 2803d 0h 0a (base 1.5/f: 2162d 0h 0a) | +4% ±1 | -2% ±1 | +0% | -2 | 7/6 |
| rockfall__a | a | geomancer | 0 | - | 0.97/f: 4794d 0h 0a (base 1.5/f: 2162d 0h 0a) | +5% ±3 | -1% ±2 | +0% | -2 | 9/6 |
| rockfall__b | b | geomancer | 0 | - | 0.97/f: 4662d 0h 0a (base 1.5/f: 2162d 0h 0a) | +2% ±3 | -3% ±2 | +0% | +1 | 8/6 |
| rockfall__ap | ap | geomancer | 0 | - | 0.97/f: 6164d 0h 0a (base 1.5/f: 2162d 0h 0a) | +11% ±3 | -3% ±2 | +0% | -3 | 10/6 |
| rockfall__bp | bp | geomancer | 0 | - | 0.97/f: 6352d 0h 0a (base 1.5/f: 2162d 0h 0a) | +10% ±3 | -5% ±2 | +0% | -2 | 11/6 |
| tremor__p | p | geomancer | 0 | stun 1.92 (1.97) | 0.89/f: 3407d 0h 1a (base 0.89/f: 2559d 0h 1a) | +3% ±1 | -1% ±1 | +0% | -2 | 7/6 |
| tremor__a | a | geomancer | 1.89 | stun 3.86 (1.97) | 0.89/f: 2559d 0h 3a (base 0.89/f: 2559d 0h 1a) | +1% ±0 | -3% ±1 | +0% | +0 | 9/6 |
| tremor__b | b | geomancer | 0 | - | 0.89/f: 4736d 0h 0a (base 0.89/f: 2559d 0h 1a) | +13% ±3 | -4% ±2 | +0% | -1 | 10/6 |
| tremor__ap | ap | geomancer | 1.83 | stun 3.81 (1.97) | 0.89/f: 3407d 0h 3a (base 0.89/f: 2559d 0h 1a) | +5% ±1 | -4% ±1 | +0% | -2 | 10/6 |
| tremor__bp | bp | geomancer | 0 | - | 0.89/f: 5962d 0h 0a (base 0.89/f: 2559d 0h 1a) | +18% ±4 | -5% ±2 | +0% | -1 | 10/6 |
| the_witch_blade | mythic | hexer | 5.39 | the_witch_blade_swings 2.75, the_witch_blade 2.64 |  | +12% ±3 | -5% ±2 | +0% | +2 | 12/5 |
| ember_palms | mythic | monk | 58.75 | burn 85.92 (53.39), ember_palms 21.44, heat 9.31, ember_palms_two 2.19 |  | +12% ±2 | -4% ±1 | -3% | -2 | 15/15 |
| nights_edge | mythic | assassin | 1.83 | hidden 1.39 (1.36), nights_edge_strike 1.06, nights_edge 0.78 |  | +2% ±1 | -1% ±0 | +0% | -0 | 8/8 |
| thralls_chalice | mythic | vampire | 7.14 | thralls_chalice 3.89, thralls_chalice_debt 3.25 |  | +4% ±1 | +3% ±1 | +50% | +10 | 10/9 |
| crown_of_embers | mythic | pyromancer | 34.92 | burn 105.72 (90.08), crown_of_embers_aura 18.11, crown_of_embers 1 |  | +10% ±2 | -3% ±1 | +0% | -4 | 20/16 |
| glaciers_heart | mythic | frostweaver | 2.81 | chill 13.72 (11.83), stun 1.31 (1.11), glaciers_heart 1.11 |  | +7% ±2 | -2% ±1 | +0% | +0 | 8/5 |
| eye_of_the_tempest | mythic | stormcaller | 31.58 | shock 47.17 (37.81), eye_of_the_tempest 21 |  | +14% ±3 | -8% ±2 | +7% | +0 | 23/17 |
| mountains_crown | mythic | geomancer | 5.17 | shield 22.33 (19.25), mountains_crown 2.08 |  | +1% ±1 | -3% ±1 | +0% | +1 | 6/6 |

