# The fill: armor and amulets

Oct 30, 2026. One share of the fill (`../fill-brief.md`): the four armor types and the amulets, 72 pieces. Commons and uncommons are new, written from the spine's table (section 1, "Commons and uncommons, kind by kind"); rares and legendaries are the spine's lines (sections 3 and 5), written in full and in its order. Lines I'd change carry a **CHALLENGE**; engine needs beyond the spine's list carry a **NEW**. Both are gathered at the end.

## Words used below

- **Steps:** +1 of a stat is 1,000; HP half a point (500); Aggro ±10; MP regen 3,000 of the stat (about 21 MP every 4 ticks, 7% of a 3,000 pool over a 40-tick fight); Crit chance +1 is 3 points, +2 is 5.
- **Special stats:** medium is Evasion 20, Accuracy 20, Crit damage +25, Double strike 25%, Thorns 150, Lifesteal 10%; high is 35, 35, +50, 40%, 300, 20%.
- **Statuses at their own numbers** (`rules-and-vocabulary.md`): Guard (Armor +3,000, 28 ticks), Haste (+40% speed, 20 ticks), Taunt (20), Ward (Magic resist +40, 30), Hidden (10), Clarity (6% of max MP every 4 ticks for 16, 24% in all), Might (6% a stack, one spent an action, cap 15), Shield (a pool capped at half max HP). Burn, Chill and Shock as their table says. No piece here changes a status's size, length or scaling.
- **Flat stacks:** one 1, a few 2, several 4, many 7. Where a piece reads stacks off a stat, it says which.
- **The counters this share needs** (each its own status, an icon with a number, ending with the fight):
  - **Spite** (Thornheart plate): +15 Thorns a stack, cap 20.
  - **Tempo** (Windrunner's garb): +5% speed a stack, as Haste (attacks, cooldowns, wind-ups), cap 10; each hit taken spends half.
  - **Heat** (Kindled robes): +3% damage dealt a stack (hits only, never a status's own damage), cap 15. Wick, The forge and Ember palms use Heat too, so it needs one definition across the shares.
  - **Surge** (Stormweave): +5% damage dealt a stack, cap 10.
- **Fits:** each type's card ends with its fits line, given once at the head of the type.
- **Builds:** commons and uncommons name the builds whose first rung they serve. Rares and legendaries carry the spine's rungs and worths (●●● a lot, ●● some, ● a little).

---

## Plate

Every card ends: *Fits Knight, Hoplite, Geomancer, Bramble knight, Paladin.*

**Ironclad** · Plate · common
- **Card:** Armor +2.
- **Numbers:** Armor +2,000.
- **Hooks:** a stat change.
- **Builds:** Landslide 1 (Armor is the Geomancer's damage stat and its Shields' size), Toll 1 (many small hits lose most to Armor).

**Crested plate** · Plate · common
- **Card:** HP +1, Aggro +1.
- **Numbers:** max HP +500, Aggro +10.
- **Hooks:** stat changes.
- **Builds:** Toll 1, Bonfire 1 (the keeper), Phoenix 1 (the martyr who draws).

**Bristled plate** · Plate · common
- **Card:** Thorns 150, Armor +1.
- **Numbers:** Thorns medium (150 untyped to the attacker for each hit taken), Armor +1,000.
- **Hooks:** stat changes; Thorns brings its own status.
- **Builds:** Toll 1, Landslide 1 (an armored wall that bites).

**Portcullis** · Plate · uncommon
- **Card:** Thorns 150. While the wearer is above half its HP, it draws far more (Aggro +20).
- **Numbers:** Thorns medium (the step); Aggro +20 at 50% of max HP or more.
- **Hooks:** a status PORTCULLIS (Aggro +20), applied on `fight_start` and `healed` to self `where: { hpAtLeast: 50 }`, removed on `hp_lost` `where: { hpBelow: 50 }`: Bloodlust's pattern, turned over.
- **Builds:** Toll 1, Landslide 1 (the bulwark), Bonfire 1 (the keeper). Once the wall is hurt it pulls less, so the danger spreads instead of finishing it.

**Keystone cuirass** · Plate · uncommon
- **Card:** Armor +1. Starts every fight behind a Shield of three tenths of its Armor.
- **Numbers:** Armor +1,000; a Shield of 0.3 × Armor at the fight's start (1,500 at Armor 5), within the Shield's cap.
- **Hooks:** `fight_start` → apply `shield` to self, stacks scaled from Armor (of holder), as Vanguard's are from max HP.
- **Builds:** Landslide 1 (stone from the first tick: Bedrock lit, a break to set off), Ambush 1 (the rear guard), Toll 1.

**Holdfast** · Plate · uncommon
- **Card:** HP +1. The first time each fight the wearer drops below half its HP, it's Guarded.
- **Numbers:** max HP +500; Guard, once a fight.
- **Hooks:** `hp_lost` → apply `guard`, then a marker HOLDFAST (Fizzle, all fight, no icon), both to self `where: { hpBelow: 50, lacks: "holdfast" }`.
- **Builds:** Toll 1 (the anchor's second wind), Pact 1 (low HP held), Bonfire 1 (the keeper).

**Bastion plate** · Plate · rare
- **Card:** Starts every fight Guarded.
- **Numbers:** Guard at the fight's start. No stats: the effect isn't thin.
- **Hooks:** `fight_start` → apply `guard` to self.
- **Builds:** Landslide 2 ●●● (Guard reaches the units whose kit scales from Armor: +3,000 is +60% to +100% of a Plate wearer's Armor for the first 28 ticks, into Rockfall, Tremor, Earthen shell and Briar), Toll 2 ●●, Bonfire ●● (the keeper).

**Hoarfrost plate** · Plate · rare
- **Card:** Foes that hit the wearer gain 2 Chill.
- **Numbers:** a few Chill, flat (2), for each hit taken. Flat on purpose: read off Armor, a Guard would nearly double it. A foe that hits it six times shatters, less the thaw.
- **Hooks:** `hit_taken` → apply `chill` (2) to `other`.
- **Builds:** Toll 2 ●●● and Snap ●● (the frozen gate), Lockdown ● (the attacker slowed).

**Challenger's plate** · Plate · rare
- **Card:** Taunts when the fight starts, and again whenever an ally falls.
- **Numbers:** Taunt at the fight's start and at each ally's knockout. No stats.
- **Hooks:** `fight_start` → apply `taunt` to self; `ko` (whose: ally) → apply `taunt` to self.
- **Builds:** Toll 2 ●●, Phoenix 2 ●● (it chooses who falls next), Bonfire ●●, Harvest ●.

**Rubble plate** · Plate · legendary
- **Card:** When the wearer's Shield breaks, every foe takes damage equal to the Shield's cap (half the wearer's max HP), and a Shield of a quarter of that is rebuilt.
- **Numbers:** untyped damage of 0.5 × max HP to every foe (2,750 on a Knight at HP 5 with a plate step); a rebuilt Shield of 0.125 × max HP.
- **Hooks:** `status_ended` (status: shield, cause: stacks) → `damage` (type none, not a hit) to `{ side: "foes", pick: "all" }`, 0.5 × max HP of holder; then apply `shield` to self, 0.125 × max HP. A Dispel (cause: removed) doesn't set it off.
- **Builds:** Landslide 3 ●●●, Toll ●●.
- **CHALLENGE:** the rebuilt quarter loops. It breaks to about one swing, and each break blasts the whole cap again: against a pack hitting a Taunting Knight, every foe takes 2,750 every tick or two. My change: every foe takes damage equal to the most the Shield held since it last broke, and a quarter of that is rebuilt. A rebuilt Shield that breaks unrefilled then blasts for a quarter, a sixteenth, and so on, so a Shield's blasts add up to about a third more than its size, and every fresh Shield (Vanguard, Earthen shell, Keystone cuirass) arms a full one. Needs NEW 6.

**Thornheart plate** · Plate · legendary
- **Card:** Each hit the wearer takes adds 1 Spite (+15 Thorns a stack, up to 20) for the rest of the fight.
- **Numbers:** Spite as above: +300 Thorns at the cap, Thorns high's worth, on top of any Thorns it has. No Thorns of its own. A swarm caps it in a dozen ticks, a boss in about half a fight: the cap is why short and long fights stay close.
- **Hooks:** `hit_taken` → apply `spite` (1) to self. SPITE: Intensity, cap 20, `stats` thorns +15 a stack, an icon.
- **Builds:** Toll 3 ●●●, Landslide ●.

**Last bastion** · Plate · legendary
- **Card:** Once a fight, a blow that would knock the wearer out leaves it at 1 HP and Guarded instead. Until it's healed back above half its HP, its hits deal double. After a won fight, it's at no less than a fifth of its HP.
- **Numbers:** 1 HP; Guard; +100% to its hits until it's at 50% of max HP or more; after a won fight, HP raised to 20% of max if it's below.
- **Hooks:** **NEW 1** (an HP floor that ends when it's used); the doubled hits are a status BASTION (`boosts` +100 physical and magical), removed on `healed` `where: { hpAtLeast: 50 }` (Bloodlust's pattern); after a won fight, engine 12 heals it to 20%. Nobody falls, so nothing that answers a fall fires.
- **Builds:** Phoenix 3 ●●, Pact 3 ●● (low HP as power), Toll ●●.

---

## Mail

Every card ends: *Fits Paladin, Valkyrie, Vampire, Hexer, Bramble knight.*

**Inscribed hauberk** · Mail · common
- **Card:** Attack +1, Magic +1.
- **Numbers:** Attack +1,000, Magic +1,000.
- **Hooks:** stat changes.
- **Builds:** Lockdown 1 and Bonfire 1 (the Paladin's and Hexer's kits, which read both), Cuts 1 (the Hexer's dagger, the Valkyrie's Gale spear from Attack).

**Lamprey mail** · Mail · common
- **Card:** HP +1, Lifesteal 10%.
- **Numbers:** max HP +500, Lifesteal medium.
- **Hooks:** stat changes; Lifesteal brings its own status.
- **Builds:** Pact 1, Cuts 1.

**Thick byrnie** · Mail · common
- **Card:** HP +2.
- **Numbers:** max HP +1,000.
- **Hooks:** a stat change.
- **Builds:** Pact 1 (max HP feeds Blood drain and Blood gift), Toll 1 (the Bramble knight's anchor), Phoenix 1.

**Tithing hauberk** · Mail · uncommon
- **Card:** Attack +1. Each hit the wearer lands heals it for 1.5% of its max HP.
- **Numbers:** 60 a hit at HP 4. Every hit counts (basic attacks, extra strikes, abilities' hits); Thorns and status ticks aren't hits.
- **Hooks:** `hit_lands` (every kind) → `heal` self, 0.015 × max HP of holder.
- **Builds:** Pact 1, Cuts 1. It pays by the count of hits, not their size: a drink for small, fast hits where Lifesteal favours big ones.

**Reprisal hauberk** · Mail · uncommon
- **Card:** HP +1. The first time each foe hits the wearer in a fight, that foe takes damage equal to 17% of the wearer's max HP.
- **Numbers:** a touch (0.17) of max HP, untyped, once per foe per fight (765 at HP 4.5).
- **Hooks:** `hit_taken` → apply REPRISAL to `other`: Fizzle, unremovable, all fight, knows its source, no icon. REPRISAL reacts to its own `status_gained` with `damage` (type none) to holder, 0.17 × max HP of source: Blood price's pattern. Fizzle keeps it to once a foe.
- **Builds:** Toll 1 (a swarm pays as it arrives), Harvest 1 (every foe of a full field pays once).

**Silvered hauberk** · Mail · uncommon
- **Card:** Magic +1. Starts every fight Warded.
- **Numbers:** Magic +1,000; Ward at the fight's start.
- **Hooks:** `fight_start` → apply `ward` to self.
- **Builds:** Lockdown 1 (it stands through a caster's opening), Harvest 1 (the whole field's spells held), Bonfire 1 (the early danger).

**Static mail** · Mail · rare
- **Card:** Foes that hit the wearer gain 2 Shock.
- **Numbers:** a few Shock, flat (2), for each hit taken; Shock deals 80 a stack each time its holder acts, then halves. No stats.
- **Hooks:** `hit_taken` → apply `shock` (2) to `other`.
- **Builds:** Toll 2 ●●●, Harvest ●.

**Mocking mail** · Mail · rare
- **Card:** Aggro +20. Taunts when the fight starts.
- **Numbers:** Aggro +20 (the line's "Aggro up", two steps, so it keeps drawing once the Taunt ends); Taunt at the fight's start.
- **Hooks:** a stat change; `fight_start` → apply `taunt` to self.
- **Builds:** Toll 1 to 2 ●●● (an anchor for the four Mail classes that can't Taunt), Phoenix ●● (the martyr), Bonfire ●.

**Bloodsworn mail** · Mail · rare
- **Card:** Below half its HP, the wearer has Lifesteal 10% and its hits deal a quarter more.
- **Numbers:** Lifesteal +10 and +25% damage, below 50% of max HP.
- **Hooks:** a status BLOODSWORN (lifesteal +10, `boosts` +25 physical and magical), applied on `hp_lost` `where: { hpBelow: 50 }`, removed on `healed` `where: { hpAtLeast: 50 }` (Bloodlust's pattern).
- **Builds:** Pact 2 ●●●, Phoenix 2 ●●.

**Sanguine mail** · Mail · legendary
- **Card:** Below half its HP, healing the wearer receives is doubled. Above half, it's halved.
- **Numbers:** healing received −50 (×0.5) at half HP or more, +100 (×2) below. Lifesteal and Regen are heals, so they follow it.
- **Hooks:** a stat change (healing received −50); a status SANGUINE (healing received +150) on `hp_lost` `where: { hpBelow: 50 }`, removed on `healed` `where: { hpAtLeast: 50 }`.
- **Builds:** Pact 3 ●●●, Phoenix ●. Gives up: healing above half.

**Mantle of the fallen** · Mail · legendary
- **Card:** When an ally falls, the wearer is Hasted and Guarded and gains 4 Might. When an ally is revived, the wearer heals it for a third of its max HP.
- **Numbers:** Haste, Guard, several Might (flat, 4); a heal of a third of the revived ally's max HP.
- **Hooks:** `ko` (whose: ally) → apply `haste`, `guard`, `might` (4) to self; `revived` (whose: ally) → `heal` to `owner`, 0.33 × max HP of target.
- **Builds:** Phoenix 3 ●●●, Toll ●.

**Hexweave mail** · Mail · legendary
- **Card:** The wearer's hits deal 10% more to a foe for each debuff it holds.
- **Numbers:** +10% a debuff: five debuffs, half again as much.
- **Hooks:** `boosts` (physical and magical) as a sum of `when` terms read on the target, one for each debuff (Bleed, Weaken, Stun, Slow, Burn, Chill, Shock, Sunder, Silence, Rot, Doom, Marked), each worth 10: Judgement's shape, no new primitive.
- **Builds:** Lockdown 3 ●●, Bonfire ●●, Snap ●●, Toll ●●: strong only where foes carry many debuffs.

---

## Leather

Every card ends: *Fits Ranger, Monk, Assassin, Bard, Valkyrie.*

**Tumbler's vest** · Leather · common
- **Card:** Evasion 20, Attack +1.
- **Numbers:** Evasion medium, Attack +1,000.
- **Hooks:** stat changes.
- **Builds:** Cuts 1, Toll 1 (the dancer).

**Footpad's jerkin** · Leather · common
- **Card:** Crit chance +3%, Attack +1.
- **Numbers:** Crit chance +1 (3 points), Attack +1,000.
- **Hooks:** stat changes.
- **Builds:** Ambush 1, Hunt 1.

**Spotter's coat** · Leather · common
- **Card:** Accuracy 20, Crit chance +3%.
- **Numbers:** Accuracy medium, Crit chance +1.
- **Hooks:** stat changes.
- **Builds:** Hunt 1 (the dodgers in the back row), Ambush 1.

**Courier's coat** · Leather · uncommon
- **Card:** Attack +1. Starts every fight Hasted.
- **Numbers:** Attack +1,000; Haste at the fight's start (its own 20 ticks: see CHALLENGE 4).
- **Hooks:** `fight_start` → apply `haste` to self.
- **Builds:** Cuts 1, Ambush 1, Bonfire 1 (a stoker).

**Mottled hide** · Leather · uncommon
- **Card:** Evasion 20. While the wearer is below half its HP, it draws far less (Aggro −20).
- **Numbers:** Evasion medium (the step); Aggro −20 below 50% of max HP.
- **Hooks:** a status MOTTLED (Aggro −20) on `hp_lost` `where: { hpBelow: 50 }`, removed on `healed` `where: { hpAtLeast: 50 }`.
- **Builds:** Cuts 1 (a light body that slips away when hurt), Hunt 1, Ambush 1 (the tail).

**Warpaint jerkin** · Leather · uncommon
- **Card:** Crit chance +3%. Starts every fight with a few Might, from its Attack.
- **Numbers:** Crit chance +1; Might, a few at a passive's rate (0.7 a point of Attack: about 3 at Attack 4, 3.5 at 5).
- **Hooks:** `fight_start` → apply `might` to self, stacks 0.7 × Attack (of holder) ÷ 1,000.
- **Builds:** Ambush 1 (the first blows), Hunt 1, Cuts 1.

**Duelist's leathers** · Leather · rare
- **Card:** Evasion 20. Each time the wearer dodges a hit, it strikes the attacker with its weapon.
- **Numbers:** Evasion medium (the line's); the riposte is one swing of its weapon, as an extra strike: a hit, not a basic attack.
- **Hooks:** `hit_evaded` → a strike at `other` (engine 9).
- **Builds:** Toll 2 ●●●, Cuts 2 ●●.

**Shadow cloak** · Leather · rare
- **Card:** Hidden when the fight starts. The wearer's hits deal half again as much while it's Hidden.
- **Numbers:** Hidden at the fight's start; +50% while Hidden. No stats.
- **Hooks:** `fight_start` → apply `hidden` to self; `boosts` (physical and magical) `when: { has: "hidden" }` of holder. Engine 17: a wearer that Taunts at the start (Red ribbon) isn't Hidden.
- **Builds:** Ambush 2 ●●●, Hunt ●●, Phoenix ●.

**Tracker's coat** · Leather · rare
- **Card:** Aggro −10. The wearer's abilities have Seek.
- **Numbers:** Aggro −10 (the line's "Aggro down").
- **Hooks:** a stat change; the status field `seek: "ability"`.
- **Builds:** Hunt 2 ●●●, Ambush ●●, Lockdown ● (reaching the caster).

**Windrunner's garb** · Leather · legendary
- **Card:** Evasion 20. Each dodge adds 1 Tempo (+5% speed in everything a stack, up to 10) for the rest of the fight. Each hit the wearer takes spends half its Tempo.
- **Numbers:** Tempo as above (+50% at the cap, a little past Haste). Evasion medium is mine, not the line's: three of the five Leather classes have no Evasion, and the piece does nothing without dodges.
- **Hooks:** `hit_evaded` → apply `tempo` (1) to self. TEMPO: Intensity, cap 10, `stats` attack speed, cooldown reduction and cast time reduction +5 a stack; `trigger` on `hit_taken` with `drop` fraction 0.5 (Bleed's shape).
- **Builds:** Cuts 3 ●●●, Toll 3 ●● (the dancer's rhythm).

**Pack leader's coat** · Leather · legendary
- **Card:** When the wearer lands a killing blow, every ally's next basic attack comes at once.
- **Numbers:** none beyond the rule.
- **Hooks:** `ko` (whose: foe) with the wearer as the killer (**NEW 4**) → every ally's basic attack timer made ready (engine 1).
- **Builds:** Hunt 3 ●●●, Ambush ●●, Harvest ●.

**Frostwalker's furs** · Leather · legendary
- **Card:** When a foe's Chill shatters, the wearer is Hasted, and its next hit adds a Chill to every foe.
- **Numbers:** Haste; one Chill on every foe, once for each shatter.
- **Hooks:** `status_capped` (status: chill, whose: foe) → apply `haste` and FROSTWALK (Refresh, no duration) to self. FROSTWALK: `hit_lands` → apply `chill` (1) to `{ side: "foes", pick: "all" }`, then remove FROSTWALK.
- **Builds:** Snap 3 ●●● (a shatter that seeds the next), Cuts ●●.

---

## Robes

Every card ends: *Fits Cleric, Pyromancer, Frostweaver, Stormcaller, Bard.*

**Magister's robe** · Robes · common
- **Card:** Magic +2.
- **Numbers:** Magic +2,000.
- **Hooks:** a stat change.
- **Builds:** Harvest 1, Bonfire 1, Snap 1.

**Wayfarer's habit** · Robes · common
- **Card:** MP +1, MP regen +1.
- **Numbers:** max MP +1,000; MP regen +3,000.
- **Hooks:** stat changes.
- **Builds:** Overflow 1, Bonfire 1 (the feeding casts), Phoenix 1 (the reviver's fuel).

**Hermit's cowl** · Robes · common
- **Card:** Magic +1, Aggro −1.
- **Numbers:** Magic +1,000, Aggro −10.
- **Hooks:** stat changes.
- **Builds:** Harvest 1, Bonfire 1, Overflow 1.

**Matins robe** · Robes · uncommon
- **Card:** Magic +1. Starts every fight with Clarity.
- **Numbers:** Magic +1,000; Clarity at the fight's start (24% of max MP over 16 ticks).
- **Hooks:** `fight_start` → apply `clarity` to self.
- **Builds:** Overflow 1, Bonfire 1, Lockdown 1.

**Wallflower's robe** · Robes · uncommon
- **Card:** HP +1. Draws far less (Aggro −20) until the first hit lands on it each fight.
- **Numbers:** max HP +500; Aggro −20 until it's first hit.
- **Hooks:** `fight_start` → apply UNNOTICED (Aggro −20, all fight) to self; `hit_taken` → remove it. A dodged hit doesn't land, so it doesn't count.
- **Builds:** Overflow 1, Harvest 1 (the sweeper lives to sweep), Phoenix 1 (the reviver).

**Glyphed robe** · Robes · uncommon
- **Card:** MP regen +1. Starts every fight behind a Shield of a quarter of its Magic.
- **Numbers:** MP regen +3,000; a Shield of 0.25 × Magic (1,000 at Magic 4, the cap of an HP 2 caster).
- **Hooks:** `fight_start` → apply `shield` to self, stacks from Magic (of holder).
- **Builds:** Overflow 1, Bonfire 1, Phoenix 1.

**Kindled robes** · Robes · rare
- **Card:** While any foe has Burn, the wearer gains 1 Heat every 4 ticks (+3% damage a stack, up to 15) for the rest of the fight.
- **Numbers:** Heat as above (+45% at the cap). About 8 stacks by the end of a 40-tick fight, the cap by tick 64 of a boss fight. No stats.
- **Hooks:** a status with a `pulse` every 4 ticks → apply `heat` (1) to self, only while a foe holds Burn (**NEW 2**: a side's condition on a pulse). HEAT: Intensity, cap 15, `boosts` +3 physical and magical a stack.
- **Builds:** Bonfire 2 ●●●, Harvest ●.

**Quiet robes** · Robes · rare
- **Card:** Aggro −10. Can't be Silenced.
- **Numbers:** Aggro −10 (the line's "Aggro down").
- **Hooks:** stat changes: aggro −10, `immune:status:silence` 1.
- **Builds:** Overflow 2 ●● (no cliff), Lockdown ●●, Phoenix ●● (the reviver).

**Weaver's robes** · Robes · rare
- **Card:** When an ally finishes casting an ability, the wearer's next ability costs a fifth less MP.
- **Numbers:** −20% on one ability. It doesn't build up: two allies' casts before the wearer's still take a fifth off.
- **Hooks:** `action_resolve` (kind ability, whose: ally) → apply WOVEN (Refresh, MP cost −20 through engine 3's stat) to self; `action_resolve` (kind ability, holder) → remove WOVEN, after the cost is paid. Engines 3 and 14.
- **Builds:** Overflow 2 ●●●.

**Archmage's mantle** · Robes · legendary
- **Card:** The wearer's abilities cost half again as much MP, deal half again as much damage, heal half again as much, and add half again as many stacks.
- **Numbers:** MP cost +50%; ability damage +50%; ability heals +50%; stacks its abilities add ×1.5 (Burn, Chill, Shock, Might, Bleed, Sunder).
- **Hooks:** engine 3 (cost stat +50); `boosts` tag ability +50; heals from its abilities +50 and its abilities' stacks ×1.5 (engine 14; today's `healing` tag would also raise Refrain, a passive).
- **Builds:** Overflow 3 ●●● (mana as damage), Bonfire ●●, Harvest ●●. Gives up: fuel.

**Stormweave** · Robes · legendary
- **Card:** Each of the wearer's actions that hits three or more foes adds 1 Surge (+5% damage a stack, up to 10) for the rest of the fight.
- **Numbers:** Surge as above. A Stormcaller earns 3 or 4 in a regular fight, 7 or 8 in a boss fight. Only actions that deal damage hit, so Thunder chord (Shock alone) adds none.
- **Hooks:** `action_resolve` reading the count of foes the action hit (engine 6), three or more → apply `surge` (1) to self. SURGE: Intensity, cap 10, `boosts` +5 physical and magical a stack.
- **Builds:** Harvest 3 ●●●, Snap ●.

**Vestments of return** · Robes · legendary
- **Card:** The wearer's revives cost a third of their MP and wind up in 1 tick. Allies it revives come back behind a Shield of half their max HP.
- **Numbers:** revive costs ×⅓ (Raise 650 → 217); wind-up quick (1 tick; Raise's is 8); a Shield of 0.5 × the revived ally's max HP, the Shield's cap.
- **Hooks:** engine 14 on its abilities that revive: MP cost −67 (engine 3's stat), wind-up 1 tick, and `apply shield` added to the revive.
- **Builds:** Phoenix 3 ●●●, Ambush ● (a Raise first in the order).
- **CHALLENGE:** of the five Robes classes, only the Cleric revives, so this is a Cleric piece on a five-class card, and it sits close to Reliquary of mercy (relic, Cleric and Valkyrie: revives at half cost, in a moment). My change: the Shield goes to every ally revived while the wearer stands, by anyone (Valhalla, a phoenix feather, Phoenix ember, Lamp of vigil), and its own revives stay cheap and fast. A Pyromancer or Bard in a Phoenix party then wears it too, and the Shield part becomes a plain `revived` (whose: ally) reaction.

---

## Amulets

Every card ends: *Fits everyone.* No amulet names a class's ability.

**Lodestone** · amulet · common
- **Card:** HP +1, Aggro +1.
- **Numbers:** max HP +500, Aggro +10.
- **Hooks:** stat changes.
- **Builds:** Toll 1, Phoenix 1 (the martyr), Bonfire 1 (the keeper).

**Whetstone** · amulet · common
- **Card:** Attack +1, Crit chance +3%.
- **Numbers:** Attack +1,000, Crit chance +1.
- **Hooks:** stat changes.
- **Builds:** Ambush 1, Hunt 1, Landslide 1 (crits land before Armor).

**Moonstone** · amulet · common
- **Card:** Magic +1, Aggro −1.
- **Numbers:** Magic +1,000, Aggro −10.
- **Hooks:** stat changes.
- **Builds:** Harvest 1, Bonfire 1, Snap 1.

**Ironstone** · amulet · common
- **Card:** Armor +1, Attack +1.
- **Numbers:** Armor +1,000, Attack +1,000.
- **Hooks:** stat changes.
- **Builds:** Landslide 1 (the Armor-scalers that also swing), Toll 1.

**Dewstone** · amulet · common
- **Card:** MP regen +1, MP +1.
- **Numbers:** MP regen +3,000, max MP +1,000.
- **Hooks:** stat changes.
- **Builds:** Overflow 1, Lockdown 1 (fuel for the locks), Phoenix 1.

**Quicksilver** · amulet · common
- **Card:** Evasion 20, HP +1.
- **Numbers:** Evasion medium, max HP +500.
- **Hooks:** stat changes.
- **Builds:** Cuts 1, Toll 1 (the dancer).

**Red ribbon** · amulet · uncommon
- **Card:** Armor +1. Taunts when the fight starts.
- **Numbers:** Armor +1,000; Taunt at the fight's start (its own 20 ticks).
- **Hooks:** `fight_start` → apply `taunt` to self. Engine 17: it ends a Hidden that also landed at the start.
- **Builds:** Toll 1, Phoenix 1 (who falls first), Bonfire 1 (the keeper), Harvest 1 (the rod).

**Carapace charm** · amulet · uncommon
- **Card:** HP +1. Starts every fight behind a Shield of 15% of its max HP.
- **Numbers:** max HP +500; a Shield of 0.15 × max HP (450 on an HP 2 caster, 825 on an HP 5 wall).
- **Hooks:** `fight_start` → apply `shield` to self, from max HP (of holder).
- **Builds:** Landslide 1 (Bedrock lit and a break armed from the first tick), Ambush 1 (the rear guard), Phoenix 1 (the survivors).

**Hare's foot** · amulet · uncommon
- **Card:** Magic +1. Starts every fight Hasted.
- **Numbers:** Magic +1,000; Haste at the fight's start (its own 20 ticks).
- **Hooks:** `fight_start` → apply `haste` to self.
- **Builds:** Ambush 1, Bonfire 1, Overflow 1, Cuts 1.

**Batwing charm** · amulet · uncommon
- **Card:** Attack +1. Hits from the wearer's abilities heal it for 10% of their damage.
- **Numbers:** Lifesteal medium's share, on abilities' hits only.
- **Hooks:** `hit_lands` (kind ability) → `heal` self, 0.1 × the event's amount.
- **Builds:** Pact 1, Harvest 1 (a sweep drinks from every foe it hits), Lockdown 1 (the bash and the lance).

**Urchin shell** · amulet · uncommon
- **Card:** Aggro +1. While the wearer holds a Shield, it has Thorns 150.
- **Numbers:** Aggro +10; Thorns medium while its Shield pool is above zero.
- **Hooks:** `status_gained` (shield) → apply URCHIN (thorns +150); `status_ended` (shield) → remove it: Bedrock's pattern.
- **Builds:** Toll 1, Landslide 1 (the stone that bites), Phoenix 1 (the shielded survivors).

**Wasp charm** · amulet · uncommon
- **Card:** Crit chance +3%. While the wearer is Hasted, it has Double strike 25%.
- **Numbers:** Crit chance +1; Double strike medium while Hasted.
- **Hooks:** `status_gained` (haste) → apply WASP (double strike +25); `status_ended` (haste) → remove it: Bedrock's pattern.
- **Builds:** Cuts 1, Bonfire 1 (a stoker's riders), Snap 1 (the frost seats).

**Millstone** · amulet · rare
- **Card:** Basic attacks come half as often and deal two and a quarter times as much.
- **Numbers:** attack speed −100 (half as often); basic attacks +125%. Extra strikes keep their size. On the Hoplite, with Phalanx: a third as often, for 3.25×.
- **Hooks:** a stat change (attack_speed −100); `boosts` tag basic +125.
- **Builds:** Landslide 2 ●●● (any unit becomes a hammer), Ambush ●, Lockdown ●.

**Hummingbird charm** · amulet · rare
- **Card:** Basic attacks come twice as often and deal 45% as much.
- **Numbers:** attack speed +100; basic attacks −55%.
- **Hooks:** a stat change (attack_speed +100); `boosts` tag basic −55.
- **Builds:** Cuts 2 ●●●, Snap ●● and Bonfire ●● (riders twice as often). Millstone's lever pulled the other way.

**Echo charm** · amulet · rare
- **Card:** The wearer's extra strikes carry everything its basic attacks carry.
- **Numbers:** none.
- **Hooks:** **NEW 3** (extra strikes heard as basic attacks by the wearer's riders and reactions, never by what grants a strike).
- **Builds:** Cuts 2 ●●●, Bonfire ● (Kindling on a wand with Double strike), Toll ● (Refrain), Snap ●.

**Opportunist's charm** · amulet · rare
- **Card:** Hits on a Stunned or Silenced foe deal a third more.
- **Numbers:** +33%, once, whether the foe holds one or both.
- **Hooks:** `boosts` (physical and magical) `when` the target has any of Stun or Silence (engine 15).
- **Builds:** Lockdown 2 ●●●, Snap ●● (after a shatter), Landslide ●.

**Bounty charm** · amulet · rare
- **Card:** When the wearer lands a killing blow, it gains 2 Might and its next basic attack comes at once.
- **Numbers:** a few Might, flat (2).
- **Hooks:** `ko` (whose: foe) with the wearer as the killer (**NEW 4**) → apply `might` (2) to self; its basic attack timer made ready (engine 1).
- **Builds:** Hunt 2 ●●● (each step speeds the next, on any class), Ambush ●, Bonfire ●.

**Martyr's locket** · amulet · rare
- **Card:** When the wearer falls, every other ally heals a fifth of its max HP and is Hasted.
- **Numbers:** a heal of 0.2 × each ally's own max HP; Haste.
- **Hooks:** a status that survives a knockout; `ko` (its holder's own) → `heal` to `{ side: "allies", pick: "all" }`, 0.2 × max HP of target, and apply `haste` to the same.
- **Builds:** Phoenix 2 ●●●, Toll ● (the anchor's fall).

**Heart of winter** · amulet · legendary
- **Card:** Every hit the wearer lands adds a Chill.
- **Numbers:** one stack a hit: basic attacks, extra strikes and abilities' hits.
- **Hooks:** `hit_lands` (every kind) → apply `chill` (1) to `other`.
- **Builds:** Snap 3 ●●● (frost on every hit, on anyone), Lockdown ●● (the slow), Cuts → Snap (the door).

**Ember heart** · amulet · legendary
- **Card:** When a burning foe falls, every other foe gains a third of its Burn.
- **Numbers:** a third of the fallen foe's Burn stacks, to each living foe.
- **Hooks:** `ko` (whose: foe) → apply `burn` to `{ side: "foes", pick: "all" }`, stacks ⅓ of the fallen foe's Burn (engine 5: today a knocked-out unit's statuses end before the `ko` event fires).
- **Builds:** Bonfire 3 ●●, Harvest 3 ●● (the door between them: fire that spreads, against the Wick's fire that focuses).

**Phoenix ember** · amulet · legendary
- **Card:** HP −1. Once a fight, when the wearer falls, it stands up 4 ticks later with a fifth of its HP.
- **Numbers:** max HP −500 (the line's "a little less max HP"); stands after 4 ticks with 20% of max HP. As every revive, it comes back with its actions on full cooldown.
- **Hooks:** a status that survives a knockout; `ko` (its own) → apply RISING (4 ticks, survives a knockout) and a once-a-fight marker; RISING's `status_ended` (expired) → `revive` self, 0.2 × max HP. If a knocked-out unit can't be given a status, a delayed self-revive is new (see NEW, to check).
- **Builds:** Phoenix 3 ●●●, Pact ●●, Ambush ● (a second volley: see CHALLENGE 5). Gives up: HP.

**Ready stance** · amulet · legendary
- **Card:** The wearer's abilities start every fight at least half charged. Its cooldowns are a fifth longer.
- **Numbers:** at the fight's start, an ability with more than half its cooldown left drops to half; cooldown reduction −20 (cooldowns ×1.2).
- **Hooks:** `fight_start` → each ability's remaining cooldown capped at half its full one (engine 1); a stat change (cooldown_reduction −20).
- **Builds:** Ambush 3 ●●●, Phoenix ●●. Gives up: the tail.

**Blood covenant** · amulet · legendary
- **Card:** The wearer's abilities cost HP in place of MP: the same share of its max HP as they'd cost of its max MP. It won't cast one that would leave it below a tenth of its HP.
- **Numbers:** HP cost = MP cost × max HP ÷ max MP (a Pyromancer's Fireball, 1,000 of 3,800 MP, costs 26% of its HP: 526 at HP 2). It waits rather than pay below 10% of max HP. Its MP pool sits unused, so Clarity, Siphon and MP regen give it nothing.
- **Hooks:** engine 4, with the cost read as a share and a floor that makes the ability wait.
- **Builds:** Pact 3 ●●● (life as the only currency, on any class), Overflow ● (mana left to pass on). Gives up: HP.

**Gambler's coin** ✦ · amulet · legendary
- **Card:** The wearer's crit chance is 50%. Its hits that don't crit deal half; its crits deal what a crit always does.
- **Numbers:** crit chance 50; every hit −50%; crit multiplier doubled, so a crit lands at its usual ×1.5 (×1.75 or ×2 with Crit damage). On average a hit is unchanged, and a quarter bigger with Crit damage high.
- **Hooks:** **NEW 5** (a stat set to a value); `boosts` −50 on physical and magical; a stat change of +100% on crit multiplier.
- **Builds:** exotic: a coin toss on every swing. Landslide ● and Ambush ● for the crit-built.

---

## CHALLENGES

1. **Rubble plate:** its rebuilt quarter breaks to about one swing and blasts the whole cap again, so a Taunting wall in a pack blasts every foe every tick or two. Change: the blast equals the most the Shield held since it last broke, and a quarter of that is rebuilt (needs NEW 6).
2. **Vestments of return:** only the Cleric revives among the Robes classes, so it's a one-class piece, and close to Reliquary of mercy. Change: its Shield goes to every ally revived while the wearer stands, by anyone.
3. **The uncommon table's stat entries** (Plate's "Thorns with Aggro up", Mail's "Lifesteal" and "Thorns", Leather's "Evasion with Aggro down", Robes' "HP with Aggro down", the amulets' "Lifesteal", "Thorns" and "Double strike"): as stats they're two steps, which is a common, and Mail's and the amulets' would repeat their own commons. I kept each thread and made it a small effect (a draw that turns on HP or the first hit, a heal per hit, a once-per-foe reprisal, Lifesteal on abilities, Thorns behind a Shield, Double strike while Hasted). If you'd rather keep them as stats, the rarity rule needs an exception.
4. **"A short Haste" and "a short Taunt" at the start:** the brief says a piece never changes how long a status lasts, so Courier's coat, Hare's foot and Red ribbon use the statuses' own 20 ticks. If "short" matters, start-of-fight statuses need an exception (5g's content had one: Caravan's 6-tick Regen).
5. **Phoenix ember's Ambush ●:** a revive comes back on full cooldowns, so there's no second volley to fire. Either drop the ●, or have it stand up with its cooldowns as they were when it fell (stronger for Phoenix too). Vial of the last breath has the same shape.

## NEW

1. **An HP floor:** a status that leaves its holder at 1 HP when a blow would knock it out, then ends (Last bastion; also the Vampire's Undying thirst). Today only a revive answers a knockout, and it counts as a fall.
2. **A side's condition on a pulse or reaction,** as an ability's `if` (Kindled robes: "while any foe has Burn"). Statuses can't check a side today.
3. **Extra strikes heard as basic attacks** by the wearer's riders and reactions (Kindling, Cold hex, Iron palm, Refrain, any piece's "basic attacks add"), never by what grants a strike (Double strike, Arc), so nothing chains (Echo charm). Engine 10 is a different bend.
4. **A killing blow:** the `ko` event naming the unit whose damage knocked it out. Today it names nobody (`ev("ko", u, null)` in `fight.ts`). Pack leader's coat and Bounty charm need it, as do the spine's Hunting spear, Hunter's buckler, Night's edge and Coup de grâce. It may belong under engine 5.
5. **A stat set to a value,** after every other change (Gambler's coin's 50%). A flat change read once can fake it, but later changes (Bedrock, a seat) would land on top.
6. **Only if CHALLENGE 1 is taken:** the most a Shield held since it last broke (Rubble plate).

To check, not yet new: whether a knocked-out unit can be given a timed status (Phoenix ember and Vial of the last breath stand up a few ticks later); if not, a delayed self-revive. Details inside listed additions: engine 4 reads Blood covenant's cost as a share of max MP and never knocks out its caster; engine 3's cost stat needs a floor at free (Vestments of return and Reliquary of mercy on one Cleric reach −117%); engine 14 needs ability heals apart from all heals (Archmage's mantle).

## Least sure

1. **Matins robe** (Clarity at every fight's start): 24% of max MP a fight, about three MP regen steps, on an uncommon, under 5h's scarce MP. The strongest uncommon here; the staff's and horn's uncommons share it.
2. **Gambler's coin:** the Geomancer's Bedrock doubles it to 100% (every hit a crit behind a Shield), and the Assassin's Backstab, which scales from crit chance, grows by two and a half times. Chaos, or one exotic too many.
3. **Blood covenant's rate:** a share of HP for the same share of MP is exact (a pool for a pool) but makes walls pay hard (Stand fast is a fifth of the Knight's small pool, so a fifth of its HP). The other reading, half the MP cost in HP, lets walls cast almost free.
4. **Thornheart plate and Rubble plate against swarms:** both get large on six to eight foes; Thornheart reaches +300 Thorns in about a dozen ticks there.
5. **Windrunner's garb carries Evasion 20 the line didn't give,** and Echo charm carries no Double strike: with it, Wasp charm would be its small version, so it does nothing on a unit without extra strikes.
6. **Heat's numbers** (+3% a stack, cap 15) are set here first; Wick, The forge and Ember palms need the same ones.
7. **Duplicates across kinds,** each from the spine's table, that the lead may want to split: Holdfast and the totem's Guard below half; Glyphed robe and the staff's Shield from Magic; Courier's coat, Hare's foot and the fist and bell uncommons' Haste at the start; Silvered hauberk and the rune sword's, mace's and lantern's Ward at the start; Red ribbon and Mocking mail (a rare that is the uncommon's Taunt plus Aggro +20).
