# Step 5f design: the combat economy, from the fights up

The director's list (`intent.md`) reads the game one fight at a time: how often units act, what they can afford, what statuses do, who's hit, and what each class is for. This design checks every claim against the engine and the logs first, then sets the numbers and the kit changes, in the order the director gave: pacing, mana, statuses, enemies' resistances, then classes; win rates and difficulty last. Where a choice is theirs, it's listed under **Questions**, with the assumption the build runs on until they answer.

Numbers below are first values. The balance sheet (`npm run balance`) says after each round whether they landed; `tuning.md` is the trail.

## 1. What the numbers say about the list

Checked against `content/core-set/`, `src/engine/combat/` and the 5e sheet at the new knobs (`../5e-balance/sheet-after.md`). "Confirmed" means the engine and the logs agree with the director.

| Claim | What the engine and the logs say | Verdict |
| --- | --- | --- |
| Cooldowns too long; abilities are one-offs | Words 24 / 32 / 36 (±15%), regular fights 31 ticks: a short ability fires twice a fight, the others once or less. Nothing is "fast". | Confirmed |
| Bosses rarely cast their move | 0.74 to 1.07 casts a fight in free play after 5e (0.5 to 0.9 before); the enemies document wants two or three. | Confirmed |
| Basics 66% of actions, too far | 66% after 5b; the director wants fewer but not 32%. | Direction |
| No room to breathe | The party acts about every 2 ticks; weapon swings every 5 to 11 ticks, three abilities each; a status pulses every 2 to 4 ticks under that. | Confirmed |
| Flat tempo across classes | Every class's kit is one short, one medium, one long (the Hoplite's Phalanx aside). Weapon intervals span 5.3 to 10.7 ticks. | Confirmed |
| Cast times irrelevant | Quick 0.5, normal 1.5, long 4, very long 6; most abilities quick or normal. | Confirmed |
| Casters' basics out-hit fighters' | Staff swings 1,700 to 2,300 against swords at 900: a swing's size follows its interval and the unit's Magic (4 to 5 against Attack 3 to 4), and no foe has blanket resistance while every foe has Armor. Casters' basics are 25% to 43% of their damage, the Cleric's and Hexer's 100%. | Confirmed |
| Random single-target debuffs too random and slow | Wither, Garrote, Unravel, Hush: 0.2 to 0.7 casts a fight, one target of four to eight. | Confirmed |
| Mana doesn't exist for non-mages | Costs run from 100 (Spear thrust, Barbed arrow, Flow) to 2,000 (Pyre, Raise): 20 to 1. A wall's three skills cost 300 to 500 a fight against 600 regained; it ends a run at 96% MP. The screen shows MP ÷ 10, hence "10 and 128". | Confirmed |
| Enemies rarely buff, taunt or multi-hit; no blanket resistance | 7 of 36 buff (Shieldman, Mummy, Drone, Soldier, Fire Imp, Ice Golem, Ice Titan, Storm King), 4 taunt, none multi-hits, 17 have no ability at all. Resistance only as an element's weakness or strength; the Ghost alone resists everything. | Confirmed |
| Chill weak, worse than Slow | Cap 8 × −6 = −48 against Slow's −40, but it loses a third of its stacks every 3 ticks: from 8 to 0 in 15 ticks. One Frost lance (10 stacks at Magic 4) fills the cap. Average 3.4 stacks an application. | Confirmed |
| Clarity gives back less than it costs | It doubled MP regen for 24 ticks: 480 to 720 MP on a regen-2 or regen-3 unit, for Stillness's 1,600 before 5e (400 after). | Confirmed as of their build |
| Haste maybe too weak | +40% speed for 14 ticks. Not measurable directly; through its holders. | Open |
| Burn: slow decay, little damage | 30 a stack every 2 ticks, 10% of the stacks lost a pulse: 18 stacks deal 3,450 over their life, 540 the first pulse. Fire arrow's hit alone is 5,000. | Confirmed |
| Shock too little | 70 a stack per action; 8 stacks on average, 560 a trigger; at the cap of 40, 2,800. | Confirmed |
| Bleed the strongest | 10 stacks from a plain Barbed arrow: 1,200 on the next hit, 2,760 over six. | Confirmed |
| Statuses a small share of appliers' damage | Burn 9% of its appliers' damage, Shock 20%, Bleed 12%, in the campaign. The Pyromancer's statuses 23% of its damage. | Confirmed |
| Applier abilities are nukes | Fire arrow heavy (1.25 × Attack), Firebolt normal, Smite heavy, Chain lightning 0.6 + 3 × 0.3, Burning fist 3 × 0.25, Gale spear 3 × 0.2; each adds "a few" or "several" stacks. | Confirmed |
| Sunder past zero Armor | Armor's floor is 0 in the stat registry; Sunder can't push past it. Uncapped stacks (235 on the Silent One) hold Armor at 0 for the fight. | Not past zero; uncapped |
| Might ticks down with time | Loses one stack every 4 ticks; cap 25; 8% a stack. War ballad's 14 stacks last 56 ticks: the whole fight, when it lands at tick 26 of 31. | Confirmed; the timing is the fault |
| Guard, Ward imperceptible | Guard +2,000 Armor: a minion's swing into Armor 5,000 falls 20% (251 → 200); Crush falls 6%. Ward +30 resistance: 30% off every spell for 24 ticks. | Guard weak against what matters; Ward fine |
| Taunt on one unit | Thicket (14 ticks on a 32 cooldown), Sworn (on a knockout), Shield up (foes). | Confirmed |
| Silence tiny | 8 ticks; 17 enemies have no ability; Hush interrupts a cast 0.06 times an application. | Confirmed |
| Stun situational | 5 ticks; holds a wind-up 0.11 times an application. | Confirmed |
| Rot does nothing | The Bone Priest's Mend is the one enemy heal; absorption (Ice Spirit, Fire Giant) is the other. Wither: 0.6 casts a fight, no measurable effect. | Confirmed |
| Regen weak | 16% of max HP over 16 ticks after 5e (36% before); Renew's cast is 1,300 MP for it. | Confirmed |
| Healing on 3 classes, required | The Cleric, Valkyrie and Bramble knight (and the Vampire for itself); the rogue drafts a healer. | Confirmed |
| Aggro barely moves | Words 70 + 10n; 13 of 16 classes at 90 or 100. Draw by word: 64, 75, 100, 133, 157. A Knight (5) beside two word-2 units takes 51% of the hits; beside two word-1 units, 55%. | Confirmed: the words don't separate |
| Vanish's cooldown egregious | Long (36, up to 41): first cast at tick 26. | Confirmed |
| Monk too strong | +10 / +5 / +20 points (campaign / rogue / free play), 3.2 actions every 10 ticks, Evasion high, Double strike, Sunder on every hit. | Confirmed |

One claim the numbers don't support: **the HP 3s bought nothing** (5e's own report said so); they're reverted here as the director asks, with no loss.

## 2. Pacing: fewer, bigger, slower, and a tempo per class

The aim: a regular fight of about **45 ticks** (from 31) and a boss fight of about **80** (from 45), with the party acting about once every 3 ticks instead of every 2, basics at about half the party's actions, a short ability firing three times a fight, a medium twice, a long once, and wind-ups the eye can follow.

- **Weapons swing half again as slowly,** and each swing is half again as big (the engine already sizes a swing by its interval, so damage a tick doesn't change). Intervals: dagger 8, fist 8.6, ice staff 8 (the director's: a fast, lighter ice staff feeds Cold hex and Brittle), dark staff 9.5, wind staff 9.2, lightning staff 10, sword 11, bow 11.7, spear 12.3, light staff 12.8, earth staff 14, fire staff 14.7, axe 16. Foes' touches the same: fast 8.9, medium 11.9, slow 15.5, and the swing words half again as big (weak 750, normal 1,050, heavy 1,650, massive 2,400).
- **Cooldown words wider:** short **16**, medium **28**, long **44**, and a new **very long 60** for the revives and the Pyre. Foes: short 22, medium 34, long 48 (a boss's medium move comes twice in 80 ticks). The ±15% jitter by id stays.
- **Wind-ups longer:** quick 1, normal 3, long 6, very long 10 (from 0.5 / 1.5 / 4 / 6). Recovery after an ability 2 (from 1.5).
- **Head starts by slot 10 / 8 / 6** (from 16 / 12 / 8): a first-slot short ability fires at tick 6, a medium at 18, a long at 34.
- **A tempo per class,** by which word each ability takes (section 6 lists every kit). Spammy: the Bard, Monk, Stormcaller, Vampire. Slow and clunky: the Hoplite, Paladin, Geomancer, the Pyromancer's Pyre. The rest in between, each with one quick thing and one slow thing.

Measures: ticks a regular and a boss fight; basics' share of party actions; casts a fight by word; a boss's signature casts a fight (2 to 3 in free play); minions killed before acting (under 20%).

## 3. Mana: one scale, and everyone feels it

- **Every ability's cost is on one ladder, by its cooldown word:** short **200**, medium **350**, long **600**, very long **900** (the screen shows 20 / 35 / 60 / 90). Set by hand on each ability, as the director's rule asks; the big spells take the next rung up (Fireball, Blizzard and Thunderstorm 600; Pyre, Raise and Valhalla 1,200).
- **MP regen 4% → 3%** of the stat every 4 ticks. A wall (MP 2, regen 2) spends about 1,500 a fight and regains 700: its pool lasts the road to the boss, where FOCUS or a Clarity matters. A caster (MP 5, regen 2 to 3) spends 1,900 to 2,300 and regains 700 to 1,000: dry in the third fight without MP gear or a Clarity. The Bard's Refrain and the two new Clarity sources (the Knight's Stand fast, the Vampire's Blood gift) are the party's mana sustain.
- Measures: each class's share of its time with an ability ready and no MP (target: walls 3% to 10%, fighters 5% to 15%, casters 10% to 25%); MP at a run's end (20% to 60%); MP regen gear's probe value above zero for every class.

## 4. Statuses

All in `scale.ts` and `vocabulary.ts`; nothing here needs the engine.

| Status | Now | Design | Why |
| --- | --- | --- | --- |
| Chill | cap 8, −6 a stack, a third lost every 3 ticks | **cap 12, −5 a stack, one stack lost every 4 ticks** | Deep freeze with upkeep: full Chill (−60) is colder than Slow, it lasts 48 ticks from the cap, and the Hexer's and Frostweaver's reapplications keep it there. Brittle (+8% a stack) reaches +96%. |
| Clarity | MP regen doubled for 24 ticks | **a pulse: 4% of max MP every 2 ticks for 16 ticks (32% of max MP)** | Regen for mana, a visible top-up. |
| Burn | 30 a stack every 2 ticks, 10% lost a pulse | **60 a stack every 2 ticks, 25% lost a pulse** | Burns hard and dies fast: 18 stacks deal 3,400 over 12 ticks, not 30. Upkeep is the Pyromancer's job. |
| Shock | 70 a stack, half lost an action, cap 40 | **120 a stack, half lost an action, cap 30** | A trigger at 10 stacks is 1,200, past a swing. |
| Bleed | 120 a stack a hit, a third close | unchanged | The reference the others are raised to. |
| Sunder | −600 a stack, one lost every 4 ticks, no cap | **cap 20** | Armor can't go below 0 already; the cap keeps a boss from carrying 235. |
| Might | 8% a stack, one lost every 4 ticks, cap 25 | **10% a stack, one lost each time the holder acts, cap 20** | The director's: it spends with action, not time. Content only (a trigger on the holder's action, as Shock's). |
| Guard | +2,000 Armor, 20 ticks | **+3,000, 28 ticks** | Worth 25% to 30% against small hits, 9% against a boss blow. |
| Ward | +30 resistance, 24 ticks | **+40, 30 ticks** | |
| Taunt | 14 ticks | **20** | Thicket on a short cooldown holds it most of a fight. |
| Silence | 8 ticks | **16** | And foes' casts come more often (section 2). |
| Stun | 5 ticks | **8** | Longer, as the director leans; the wind-up targeting rule would be an engine change (Questions). |
| Haste, Slow | ±40%, 14 / 20 ticks | ±40%, **20 / 24** | Durations follow the longer fights. Haste's worth is read through the Bard and the Monk. |
| Regen | 2% every 2 ticks for 16 (16%) | **2% every 2 ticks for 24 (24%)**; Caravan's short one 12 | |
| Hidden | 20 | 24 | Vanish moves to medium (28). |
| Rot | −60% healing, 20 ticks | unchanged, and off the Vampire | Stays in the vocabulary for bosses later. |
| Thorns | high 250 | **high 300** (5e's cut reverted) | The Bramble knight is measured, not pre-cut. |

**Applier abilities give up their hit for their stacks.** A new hit word, **touch, 0.25** of the stat, for abilities whose point is the status; `ABILITY_STACKS` 2 → **3** (an ability adds three times its word's stacks). Barbed arrow, Firebolt, Frost lance, Chain lightning's chains, Smite: light hits. Fire arrow (heavy → normal), Fireball, Blizzard, Thunderstorm, Burning fist's and Gale spear's three hits: touches. The nukes keep their hits: Backstab, Pyre, Rockfall, Spear thrust, Blood drain, Rending arrow (the Ranger's nuke, as the director suggests), Bramble lash, Shield bash, Tremor.

Measures: each status's share of its appliers' damage (40% to 60% for a class built on it, the Pyromancer above); the status table's stacks an application and uptime; Chill's mean stacks on a held foe; Clarity's MP an application against its cost.

## 5. Enemies: resistance that scales with rank

The director's exception: resistance matters now, the rest waits. Every elite gets **15** and every boss **25** resistance to all elements (the stat the Ghost already carries), so spells meet something where swings meet Armor, and the untyped statuses are the way through, as the documents say. Minions stay at 0. Buffs, taunts and multi-hits on more enemies: not in this step (the director: classes before enemies).

## 6. Classes

The HP 3s revert (the Bard, Hexer and Assassin at 2). Aggro words move the casters and the Bard, Hexer and Cleric to **1**, the Assassin stays at 1, the Ranger at 2, the Monk **2**, the Vampire, Valkyrie and Geomancer 3, the Paladin and Bramble knight **4** and **5**, the Hoplite **5**, the Knight 5. Draws: 64 for a word-1 unit, 157 for a word-5 (Questions, on the step).

| Class | Tempo | Kit (cooldown word, wind-up) | Change |
| --- | --- | --- | --- |
| Knight | steady | Fortify (short, quick) · **Stand fast** (medium, quick): Taunt on itself, Clarity on the ally with the least MP · Shield bash (medium, quick): scales from **max HP** | Passive **Vanguard**: starts every fight with a Shield from its max HP (0.4). HP **5**, Armor **4**. Protect is gone (Questions). |
| Cleric | steady | Cure (short, quick) · Renew (medium, normal) · Raise (very long, very long) | Passive **Last rites**: cooldowns halved below 30% HP (Bloodlust's pattern). |
| Ranger | steady | Barbed arrow (short, quick, light) · Fire arrow (medium, long, normal) · Rending arrow (medium, normal, heavy: the nuke) | Statuses as its identity; Rending keeps the hit. |
| Bramble knight | steady | Bramble lash (short, quick) · Thicket (short, quick) · Regrowth (medium, normal) | Thorns 300. Left otherwise. |
| Hoplite | slow | Spear thrust (medium, long, heavy) · Paired guard (medium, normal) · Aspis (long, quick) | Attack **4**, Aggro **5** (120). |
| Paladin | slow | Smite (medium, very long, normal hit, several Burn) · **Absolve** (medium, normal): cleanses and heals itself and the lowest other ally, always · Sanctuary (long, long) | Judgement: double → **+50%** on buffed foes. |
| Valkyrie | steady | Gale spear (short, quick, three touches) · Rally (medium, normal) · Valhalla (very long, quick) | |
| Bard | spammy | **Anthem** (short, quick): Haste and many Might on a random ally · **Chorus** (short, normal): a small heal on every ally (0.15 of Magic each) · Thunder chord (medium, normal) | Refrain: 60 MP + 0.03 × Attack a landed basic. Weapons: dagger, bow, **light staff**. Aggro 1. Allegro and War ballad merge. |
| Hexer | spammy | **Malison** (short, normal): a few Burn and a few Shock on every foe · Enfeeble (short, normal): Weaken and several **Sunder** on the highest Attack or Magic · **Unmake** (medium, quick): Silence and Dispel on a foe that's casting, else one with a buff; waits for one | Cold hex stays. The debuff bot. Needs a "casting" condition (section 8). |
| Monk | spammy | Flow (short, quick) · Burning fist (short, quick, three touches) · Pressure point (medium, normal) | Attack **3,700**, Crit **2**, Burning fist 0.25 → **0.15** of Attack a hit. |
| Assassin | steady | Backstab (medium, normal, heavy) · Vanish (**medium**, quick) · Garrote (medium, quick, normal hit, Silence) | Hidden 24 ticks; Silence 16. |
| Vampire | spammy | Blood drain (short, quick, 0.5 of max HP) · **Blood gift** (medium, normal): costs it 20% of its max HP, heals the lowest other ally for that much and gives it Clarity · Frenzy (medium, quick) | Lifesteal back to **30 / 15** (5e's cut reverted). Wither and Rot gone. |
| Pyromancer | slow | Firebolt (short, normal, light) · Fireball (medium, long, touch) · Pyre (long, very long) | Burn's numbers do the work. |
| Frostweaver | steady | Frost lance (short, normal, light) · Blizzard (medium, long, touch) · Stillness (medium, quick): Clarity on the ally with the least MP | |
| Stormcaller | spammy | Chain lightning (short, quick, light + three touches) · Thunderstorm (medium, normal, touch) · Static charge (long, long) | Measured after Shock and the basics change. |
| Geomancer | slow | Rockfall (short, long) · Earthen shell (medium, normal) · Tremor (long, very long) | |

Measures: each class's win ±points in the rogue and the campaign (±8); its damage split basic / ability / status against its identity (the Cleric and Hexer under 50% basic; the Pyromancer and Stormcaller over 50% status; the fighters over 50% ability); knockouts per 100 fights for the word-1 classes (down from 45 to 55).

## 7. Order, and what says each part is done

1. **Pacing, mana, statuses, resistances** in one pass (sections 2 to 5), the sheet after it, then rounds until the pacing and status measures land. Knobs frozen.
2. **Classes** (section 6), the sheet, rounds until the identities and the ±8 land, or three rounds without progress (then it's written down).
3. **AI readers:** `campaign-play` on the first six nodes and one `rogue-play` run, read for feel (does a fight breathe, do statuses show, does a Bard matter), as the director asked.
4. **Difficulty:** campaign knobs, rogue calibration and tune, as in 5e.
5. **Fresh eyes,** then the report, `DECISIONS.md`, the documents, the primer, `CLAUDE.md`.

## 8. The engine

One rule is needed: a unit condition **`casting`** (true while the unit is in an action's wind-up), so Unmake can wait for a casting foe. A few lines in the targeting conditions; `ENGINE_VERSION` moves to 0.13 and the change is flagged. Everything else is content: Might by action is Shock's trigger with a count drop; Clarity's pulse is Regen's with `mp`; the Knight's start Shield is Frozen core's reaction; Last rites is Bloodlust's pattern with a cooldown stat; Blood gift's cost is untyped damage to itself.

## 9. Questions for the director

Each with the assumption the build runs on.

1. **The Knight's second ability.** You wrote Sanctuary (the Paladin's); I read Protect, the Knight's Shield that overlaps the Hoplite. Built: Protect → Stand fast (Taunt on itself, Clarity on an ally).
2. **Aggro's step.** Words alone take a wall from 51% to 55% of the hits beside two casters; your rule fixes the step at 10 a word. At 15 a word, draws run 57 to 175 and the wall takes 60%; at 20, 53 to 189 and 64%. Built on words alone, which keeps your rule; say if the step may move.
3. **Lifesteal.** 5e cut it 30 → 15 and 15 → 8; you'd rather keep it and price the Vampire with Blood gift. Built at your 30 / 15; the sheet decides.
4. **The Bard's staff.** Light staff (Light is restore, for Chorus), or wind?
5. **Unmake's wait.** A "casting" condition is new to the engine (section 8). Built with it; say if you'd rather it waited for a buffed foe only.
6. **Fight length.** 45 and 80 ticks are my targets. Longer or shorter?
7. **Stun.** 8 ticks, no targeting rule. The "catch a wind-up" rule would be an engine change; not built.
8. **Resistance by rank.** 15 and 25 (elites, bosses). A minion with resistance? None built.

## 10. Out of this step

Enemy buffs, taunts and multi-hits (the director: classes first); Chill's redesign beyond its numbers (execute the current design first); the party of five; the balance sheet's bands, which are re-read, not rewritten, except the new measures named above.
