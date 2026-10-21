# Core set, step 1: the genre check

You're a game designer joining a project. The director is the person who sets the game's vision. You'll work with them in rounds: you bring a first version, they react, and you revise until they accept it. Then you produce the final output described below, which is handed on by itself. Keep what you write short and plain.

## Your objective

The project needs a **core set** of content: the classes, statuses, special stats and elements that the game's first playable version is built from, and that stranger content is added onto later. The core should be mostly staples: functional, familiar content that's solid to build on.

A first brainstorm produced the list at the end of this file. It was gathered quickly from several sources, and it's uneven: some entries are staples, some are oddities, some overlap, some sit in the wrong category, and staples of the genre may be missing.

Your job is to turn it into a **pool of core-worthy content**. A small first set will be picked from your pool later, in a separate step. Don't trim for size: your pool can be large.

1. **Compare the list with the genre.** Look at JRPGs and other games with turn-based or automatic party combat: their classes and jobs, the statuses they put on units, their special stats and their elements. Choose the games yourself.
2. **Find the blind spots:** things that commonly appear in those games and are missing here. Add the ones that belong in a core.
3. **Find where this list departs from how the genre usually does things.** A departure isn't wrong; show the director what they are.
4. **Remove what's too esoteric for a core:** ideas that only make sense as a later twist, that are one ability rather than a whole class, or that need machinery a core shouldn't depend on.
5. **Merge duplicates, and sort every entry** by the definitions of a status and a special stat below. Some entries are in the wrong category.

## What to bring back

- **First, an analysis for the director:** the games you compared against, the blind spots, the departures, and what you'd remove. Expect a few rounds.
- **Then, once the director accepts it, the final list:** classes, statuses, special stats and elements. Each entry is a name and one or two plain lines on what it is. Nothing else: no reasons, no sources, nothing about where an entry came from or what changed.

## The game

A party-based dungeon crawler in the style of classic JRPGs, with fully automatic combat. Preparation is the game: the player chooses which units to bring, what each one carries and where each one stands, then watches. When a party loses, the player works out why from what they saw and tries a different build. Enemy stats are hidden, so players learn everything by watching fights, which are shown mostly as text and numbers, in the style of Game Boy-era RPGs.

It's an optional game inside a personal productivity app made for someone with ADHD. Completing real-life tasks pays **unlocks**: a new class, a formation or a powerful piece of gear. Dungeons pay ordinary gear. So every class is a reward the player earns one at a time, and each should be worth getting on its own.

- **Units.** Every unit is a class. The player owns each class once, and a party holds at most one of each. Parties are up to 5 units; the first playable version will probably use parties of 3.
- **A class** has a passive that only it has, four abilities of which it brings two into a fight (the player picks which, between runs), and a set of weapon types it can use. A unit's weapon sets its basic attack. Units don't level up; gear makes them stronger. Passives and abilities change how a unit behaves, rather than just adding numbers.
- **Formations.** The party stands in a formation of five slots, each with its own bonuses. A slot changes a unit's numbers, not where it is: there's no battlefield geometry.
- **Dungeons.** A few automatic fights, then a boss, with HP and MP carrying between fights. Losing costs nothing, and retries are free.
- **Encounters** are designed as puzzles: a party brings strengths, a boss has gimmicks that call for them, and raw power can partly make up for a missing strength. The same units in a different formation can beat a different boss.
- **Enemies** use the same rules and stats as the party, and can use the same statuses.

**Design rules.**

- Everything maps onto a few numerical systems: stats, statuses, damage types and targeting. No special keywords that only one thing interacts with.
- Nothing that asks the player to track a lot in their head, and nothing positional.
- A player has to be able to tell what's happening by watching.
- Elements differ from one another by gameplay shape, rhythm and utility, not mainly as a wheel of counters.

## The combat system

It's built and working. Its numbers are placeholders.

**Time and actions.**

- Fights run in real time, counted in ticks. Nobody gives orders.
- Every action, basic attack or ability, has a cast time (a wind-up), a cooldown and a short recovery. When a unit is free, it uses the first of its abilities that's ready, in the order the player slotted them, and otherwise its basic attack.
- Abilities cost MP. An ability can have a condition, such as "only when an ally is below half health".
- Every action starts the fight on cooldown. Damage doesn't interrupt a cast; only a knockout or an interrupting lockout does.

**Targeting.** Units mostly attack a random foe, weighted by Aggro, a stat every unit has. A unit can be made the forced target of foes (a taunt) or made untargetable (stealth). An ability can pick its own targets instead: the lowest health, the highest of some stat, all foes, a random ally, and so on. An action can also be set to ignore taunts and stealth.

**Damage.**

- **Physical** damage is slashing, piercing or blunt. Evasion is a chance to dodge it, and Armor takes a flat amount off each hit, so many small hits do poorly against heavy armor.
- **Magical** damage carries an element. It can't be dodged, and the target's resistance to that element reduces it by a percentage. Negative resistance is a weakness; full resistance is immunity.
- Hits can crit.
- Every amount states what it scales from, and any stat can be a scaling source. Physical things scaling from Attack, and magical things from Magic, is only a convention.
- Damage resolves in this order: dodge check, base amount and scaling, the attacker's boosts, the target's damage-taken modifiers, crit, mitigation (Armor or resistance), shields, then HP.

**Stats every unit has.** HP, MP, MP regeneration, Attack, Magic, Armor, a resistance to each element, Attack Speed, Cooldown Reduction, Crit chance and Aggro.

**Statuses and special stats** are different things:

- A **status** is a special state on a unit that the player understands as having been put there by someone or something. It shows on the unit as feedback.
- A **special stat** is a stat outside the set every unit has. It's zero by default, isn't shown on the stat sheet until something changes it, and is always active while the unit has it.
- **Thorns** is a stat: it returns a share of the damage taken, it's a number you can gain more of, and it's always on. **Riposte** is a status: a state a unit puts itself in, where after dodging an attack it strikes back. There's no Riposte number; it's on or off, or it stacks.

**What a status can do.**

- change stats, up or down;
- raise the damage or healing a unit deals, by kind: basic attacks, abilities, physical, magical, one physical type or one element;
- change how much damage a unit takes, of every kind or one kind;
- soak a pool of damage before HP (a shield);
- lock out some of a unit's actions (all, basic attacks only, or abilities only), optionally cancelling a wind-up;
- add an extra piece of damage to a unit's attacks, or change their element;
- do something on a timer: deal damage, heal, restore or drain MP, or apply another status;
- react to events: being hit, landing a hit, dodging, missing, dealing or taking damage, losing HP, being healed, starting, finishing or being interrupted in an action, gaining or losing a status, a unit being knocked out, or the fight starting.

**How statuses stack and end.**

- **Refresh:** reapplying replaces the old copy.
- **Fizzle:** reapplying fails while it's there.
- **Stacks:** each application adds stacks to one shared total, and the effect scales with the total. The total can drop on each timer or event (halve each time, or lose one), and the status ends when it falls below one stack.
- **Per source:** each applier keeps its own copy; it can end when its applier is knocked out (an aura).
- A status has a duration or lasts the whole fight. It can be unremovable, or survive its holder being knocked out. Effects can remove buffs or debuffs, and units can be immune to particular statuses or kinds of effect.
- A status's own damage has no type or element: it isn't dodged, and Armor and resistance don't reduce it. Only damage-taken modifiers and shields do.
- A status is fixed when it's applied. The applier's stats can set how many stacks an application adds, and nothing else.

**Not built yet** (each would need new engine work): targeting rules on the attacker (a taunt that names one unit, charm), granting or repeating actions, revives, resistance to statuses, summons or pets as their own units, and Lifesteal (it needs a second scaling factor).

**What players see.** Only a few statuses show as icons on a unit; everything else is behind the scenes. The statuses a player meets should be few and easy to recognise.

## The brainstorm list

Alphabetical within each category. "Also called" gives other names the same idea came under.

### Classes

- **Alchemist.** Flasks: poisons and debuffs for foes, potions for allies.
- **Artillerist.** Huge, slow blunt blasts; heavier gear hits harder.
- **Assassin.** A burst killer that finishes the wounded and ignores taunts.
- **Bard.** Songs or dances that buff the whole party; a pure buffer.
- **Beastmaster.** Fights beside a pet that adds its own strikes. Also called: Summoner.
- **Berserker.** Stronger the nearer it gets to death.
- **Blood mage.** Pays its own HP for power; losing HP restores MP.
- **Bramble knight.** A thorns tank: whoever hits it gets hurt. Also called: Gladiator.
- **Brigand.** High damage but inaccurate; heavy hits that break or pierce armor. Also called: Lancer, Sentinel, Fighter.
- **Cleric.** Heals the most hurt ally, lifts debuffs and revives; fragile, with a little burst damage. Also called: Healer, White Mage.
- **Dancer.** An evasive dancer who debuffs foes and charms one.
- **Dark knight.** An armor tank that deals magic damage.
- **Dragoon.** Leaps out of reach and lands one huge hit.
- **Duelist.** Attack speed and crits, squishy and slightly evasive.
- **Earth martial artist.** A martial artist with uneven damage, plus support and debuffs.
- **Einherjar.** Fights hard and dies loudly; its war cry outlives it.
- **Engineer.** Deploys turrets and gadgets that attack or shield.
- **Fencer.** Duels one foe; parries and counters.
- **Frostweaver.** Frost that piles up until foes freeze. Also called: Yuki-onna.
- **Geomancer.** Lingering elemental fields that power up later spells.
- **Gorgon.** Turns the strongest foe to stone, which hurts when it cracks.
- **Gunslinger.** Rapid-fire shots that shred armor, with reloads or overheating.
- **Hoplite.** A shield-bearer who makes the whole party sturdier. Also called: Knight-Captain.
- **Illusionist.** Mirror images and decoys that make hits miss.
- **Knight.** An armored wall that draws attacks: taunts, guards, shields. Also called: Vanguard.
- **Mage.** An elemental caster in a fragile shell: big hits, or damage that ramps up.
- **Martyr.** Spends its own HP to heal; its fall heals and shields the party.
- **Mimic.** Copies statuses from foes and allies.
- **Monk.** A martial artist: many quick hits, combos, dodges and counters; or a dodging tank that heals itself.
- **Necromancer.** Shadow magic: drains, curses, doom; feeds on knockouts.
- **Ninja.** Starts hidden, throws poison, hard to pin down.
- **Onmyoji.** Talismans that silence and seal; wards for allies.
- **Oracle.** Foresight: marks or dooms foes, shields or blinks allies before the blow.
- **Paladin.** A holy knight who fights, shields and heals a little; a sturdy healer whose power is physical. Also called: Guardian.
- **Pegasus warrior.** A resistance tank that also deals damage.
- **Plague doctor.** Spreads poison and sickness; it jumps when its holder falls.
- **Priest.** Healing over time, support and protection; fragile. Also called: Druid.
- **Pyromancer.** A fire specialist: stacking, spreading burns.
- **Ranger.** Consistent, sustained ranged damage; marks prey for the party; fragile. Also called: Archer.
- **Reaper.** Harvests knockouts into power and big hits.
- **Rogue.** A quick, evasive blade, bursty rather than steady; its dodges turn into crits. Also called: Thief.
- **Samurai.** Long wind-ups that land huge, crit-heavy cuts. Also called: Ronin.
- **Soldier.** An all-round front-liner: a little tanky, a little offensive.
- **Spellblade.** Puts an element on weapons: its own, or an ally's. Also called: Runekeeper, Runesmith.
- **Spellbreaker.** Strips foes' buffs and shields, and silences casters. Also called: Inquisitor.
- **Templar.** Anti-debuff: cleanses, resists, and keeps debuffs off the party. Also called: Shrine Maiden, Miko.
- **Time mage.** Speeds allies, slows and stops foes. Also called: Chronosorcerer, Chronomancer.
- **Trapper.** Sets timed statuses on foes, then detonates them.
- **Valkyrie.** Revives allies, and grows stronger as units fall.
- **Vampire.** An off-tank that lives on lifesteal. Also called: Blood Knight.
- **Voodoo.** Little damage, many stacking curses; a pure debuffer. Also called: Witch, Witchdoctor, Sorcerer, Hexer.

### Statuses

- **Berserk.** Hits harder, at a cost: weaker defences, more damage taken, or no abilities. Also called: Enraged, Enrage.
- **Bleed.** Damage over time with a physical feel: big but hard to keep stacked, or stacking with each hit, or worse when the holder is hit.
- **Blind.** Its physical hits often miss.
- **Blink.** Each stack makes one hit miss outright. Also called: Mirror Image.
- **Burn.** Damage over time that ramps up, or burns hot.
- **Chill.** Acts slower. It can stack, can lower evasion, and at enough stacks can freeze the unit solid. Also called: Slow.
- **Doom.** A countdown that ends in one big hit, or a knockout, unless removed first. Also called: Fated.
- **Enchant.** Its attacks carry something extra: elemental damage, a new element, or a status. Also called: Poison Coating.
- **Focus.** Its next hits are stronger, or crit chance builds until it's struck or misses. Also called: Empower, Resolve.
- **Guard.** Takes less damage, or has more Armor, for a while. Also called: Protect, Fortify.
- **Haste.** Acts faster: attacks, cooldowns or wind-ups.
- **Hidden.** Can't be targeted, or is targeted less, for a while or until it acts. Also called: Veiled.
- **Marked.** Draws fire: the other side targets it more, takes more damage, or both. Also called: Hunted.
- **Momentum.** Builds with each hit landed; a miss drops it.
- **Poison.** Steady damage on a timer; doses stack.
- **Purified.** Can't gain debuffs for a while, or ignores the next few. Also called: Cleanse-ready, Immunity.
- **Regen.** Heals a little on a timer.
- **Reraise.** Comes back from a knockout once, or survives one. Also called: Unyielding Resolve, Reanimate.
- **Riposte.** A stance: after dodging an attack, it strikes back.
- **Root.** Can't dodge: Evasion set to zero.
- **Rot.** Heals do less, or partly hurt. Also called: Festering.
- **Shield.** Soaks a pool of damage before HP. Also called: Barrier.
- **Shock.** Takes damage each time it acts, so it hurts fast units most. Also called: Bleeding.
- **Silence.** Can't use abilities, only basic attacks.
- **Soul Link.** Part of the damage it takes is passed to a linked foe.
- **Stat buffs and debuffs.** Plain ups and downs to stats: more Attack, less damage dealt, more Armor, more crit; auras that last while their giver stands. Also called: Might, Weakened.
- **Stone.** Can't act, but takes almost no damage. Also called: Petrified.
- **Stun.** Can't act, and loses what it was winding up.
- **Sunder.** Armor lowered, stacking or for good. Also called: Fragile, Armor Shred.
- **Taunt.** Foes are forced to attack this unit.
- **Vulnerable.** Takes more damage: of every kind, or of one element. Also called: Mark for death, Vulnerability, Hex.

### Special stats

- **Accuracy.** Cancels out the target's Evasion.
- **Armor penetration.** Ignores some of the target's Armor on each hit.
- **Attack speed.** Faster basic attacks.
- **Block.** Chance to shrink a physical hit by a large share.
- **Cast speed.** Shorter wind-ups on abilities.
- **Charge.** Fills over time; empties into one big action a fight.
- **Combo.** Builds with consecutive hits; empowers the next hits or ability. Also called: Momentum Velocity, Chi.
- **Companion.** A pet or bond that adds extra attacks. Also called: Bond.
- **Copy.** Copies a status from a foe or ally.
- **Counter.** Chance to strike back when hit.
- **Cover.** Takes hits, or part of the damage, aimed at a hurt ally.
- **Crit damage.** How much harder its crits hit.
- **Decay.** Statuses on its target run out faster.
- **Detonate.** Pops statuses on a foe for burst damage.
- **Double strike.** Chance a basic attack hits again. Also called: Multistrike.
- **Echo.** Chance an ability goes off a second time.
- **Elemental damage.** More damage of one element, a line per element. Also called: Shadow Depth.
- **Evasion.** Chance to dodge a physical hit. Also called: Dodge.
- **Execute.** More damage against low-HP targets. Also called: Finisher, Execution Threshold.
- **Foresight.** Warns of the next heavy hit and gives a short defensive window.
- **Head start.** Its cooldowns start the fight partway done.
- **Healing power.** Its heals are stronger.
- **Heat.** Builds as it attacks; vents a burst, or overheats into a self-debuff.
- **Lifesteal.** Heals for a share of the damage it deals. Also called: Bloodthirst.
- **Mana burn.** Its hits drain the target's MP.
- **Mana leech.** Restores MP from damage dealt or from acting.
- **Overflow.** Healing past full HP becomes a shield. Also called: Vitality Shield, Overheal.
- **Overkill.** Damage past a knockout spills onto another foe.
- **Poise.** Chance to keep a wind-up when something would cancel it.
- **Potency.** Its statuses land better: more stacks, more often, or for longer. Also called: Status Chance, Debuff Duration, Curse Resonance.
- **Purity.** Takes less magic damage, until elements wear it down.
- **Rage.** A meter that fills from taking (or dealing) damage and fuels power. Also called: Blood Debt, Blood.
- **Resonance.** Its next spell of the same element hits harder.
- **Soul.** Charges gained when units are knocked out, spent on big effects. Also called: Essence.
- **Spite.** When knocked out, damages every foe.
- **Splash.** Part of each hit also lands on another foe.
- **Stagger.** Chance a hit cancels the target's wind-up. Also called: Interrupt.
- **Stealth.** Starts the fight untargetable.
- **Tenacity.** Debuffs on it wear off faster, or fail to land. Also called: Status Resistance.
- **Thorns.** Whoever hits it takes damage back. Also called: Spikes.
- **Threat.** How likely foes are to target it. Also called: Aggro.
- **Weight.** Heavier gear adds blunt damage.

### Elements

- **Arcane.** Raw magic: almost nothing resists it, and nothing is weak to it. Also called: Aether.
- **Dark.** Steady, middle-of-the-road damage, powerful but often resisted; draining and stranger effects. Also called: Shadow.
- **Earth.** Heavy and grinding: low damage with occasional big, spiky hits; shields and poison.
- **Fire.** Big, all-out damage that ramps up; burns that scale with health.
- **Ice.** Consistent, reliable damage; the tempo element, which slows and weakens foes. Also called: Frost.
- **Light.** Holy power that mostly supports: healing, regeneration, revival and shields; rarely resisted, rarely used to attack. Also called: Holy.
- **Lightning.** Sudden strikes that jump between foes or hit them all; shocks that hurt fast units each time they act. Also called: Thunder, Storm.
- **Nature.** Regenerative or toxic.
- **Spirit.** Souls; the one thing that truly hurts ghosts.
- **Water.** Tides and drowning, a crushing weight.
- **Wind.** Light, quick, many-hit cuts; crits, evasion and speed. Also called: Air.
