# Core set design: a brief

You're a game designer joining a project. The director is the person who sets the game's vision, and you'll be working with them. This file is everything you need to begin. Read it all before you start: the task comes first, then the game, then the raw material.

## 1. What I'm asking you to do

Design the **core set** for a party-based dungeon crawler with automatic combat: the first, small foundation of **classes, statuses, special stats and elements** that everything later is built on.

**Why a core set, and why small.** The game is a build-making game, and the director expects most of its long-term interest to come from creative permutations: unusual classes, odd interactions, gear that bends the rules. That can only be added onto a foundation that's already playable and observable. So the first set should be small and mostly made of staples. Generic is fine here; strangeness comes later, from recombining these pieces. There's a trap on both sides:

- **Too wide,** and the game is locked in early: "these are our twelve statuses, all generic", and they can't change later without redoing old content. A game can have many classes, but it has to be careful with its statuses and special stats, because everything else is built from them.
- **Too thin, or too lopsided,** and there's nothing to learn from playing it, because one answer beats everything.

**What you have to work with.** Section 4 holds a brainstorm: lists of classes, statuses, special stats and elements from the director and from five AI models, merged by meaning, with how many sources proposed each idea and the director's quick reactions (keep, maybe, cut, and some notes).

**This is not a trimming job.** Don't build the core by keeping the director's keeps, weighing the maybes and dropping the cuts: that gives a bad result. Those picks were fast reactions to a long list, and a quick brainstorm, not a design. Treat them as one signal among several, next to how many independent sources proposed each idea. The director's general notes (section 4) are more considered than any single pick, so weigh them more.

Instead:

1. **Analyse.** Look at how other games of this kind build their core or starting sets of roles, statuses, stats and elements, and at which of those pieces typically appear together. Say which games you drew on, and what you took from each.
2. **Find what locks together.** Look for classes, statuses, special stats and elements that naturally form groups: a status that several classes use, an element whose gameplay shape suits a status, a class that only works because another one exists, two problems an enemy can pose that need different answers.
3. **Puzzle out one set of combinations** that works as a whole. You may bring in things nobody listed, and leave out things the director kept. Say why whenever you do.

**What a good core set does.**

- **Few statuses and special stats, each pulling its weight.** Each is used by several classes (or will be used by enemies), and each is clearly distinct from the others. Classes can be more numerous than statuses.
- **Room to grow.** Later, stranger classes can be built by recombining the core's pieces, without replacing any of them.
- **No single answer to everything.** Classes need each other, and enemies can later ask for different combinations. See the director's note on armor, evasion and magic.
- **Readable.** A player watching an automatic fight can tell what each status is doing.
- **Fits the combat system** (section 3). Anything that needs a new engine building block is allowed, but it costs something; say so when you use one.
- **A clear line between a status and a special stat.** The brainstorm blurred them (see the director's notes). Section 3 gives the system's definitions; use them.

**What to bring back.**

- **Your analysis,** briefly: the games and typical core sets you looked at, and what they suggest.
- **One proposed core set,** organised as the groups that hold it together. Not three variants: one set you'd defend. It contains:
  - **Classes:** for each, its role, an idea for its passive, four ability ideas in broad strokes (it brings two into a fight), and its weapon types (weapons aren't designed yet, so name the kinds you assume). How many classes is your call, with reasons; parties will probably be small (about 3 units) in the first playable set.
  - **Statuses:** what the player sees, and how it works in system terms (duration or stacks, what it does, how it ends).
  - **Special stats:** what each does, and why it's a stat rather than a status.
  - **Elements:** each one's gameplay shape. The director wants elements to differ in rhythm, shape and utility, not to act as a wheel of counters.
  - **A coverage table:** which classes use which statuses, special stats and elements.
  - **How the set answers each of the director's general notes.**
- **What you considered and left out, and why,** especially any keep you dropped or cut you brought back.
- **Your open questions.**

**How to work with the director.** They'll react and you'll revise, over several turns. They'd rather hear a challenge early, with reasons, than see you follow a direction into a wall. Ask a question when the answer would change the design; otherwise make the call and say so. Keep write-ups short and plain, and lead with decisions and questions.

**One warning.** Everything in the brainstorm is an illustration of what could exist, including the director's own entries. No single item is a requirement, and no example is a rule. Don't build the set around one vivid idea.

## 2. The game

A party-based dungeon crawler in the style of classic JRPGs, with fully automatic combat. Preparation is the game: the player chooses which units to bring, what each one carries and where each one stands, then watches. When a party loses, the player works out why from what they saw and tries a different build. Enemy stats are hidden, so players learn everything by watching fights, which are shown mostly as text and numbers, in the style of Game Boy-era RPGs.

It's an optional game inside a personal productivity app made for someone with ADHD. Completing real-life tasks pays **unlocks**: a new class, a formation or a powerful piece of gear. Dungeons pay ordinary gear. So every class is a reward the player earns one at a time; each class should be worth getting on its own.

- **Units.** Every unit is a class. The player owns each class once, and a party holds at most one of each. Parties are up to 5 units; the first playable set will probably use parties of 3.
- **A class** has a passive that only it has, four abilities of which it brings two into a fight (the player picks which, between runs), and a set of weapon types it can use. A unit's weapon sets its basic attack. Units don't level up; gear makes them stronger. Passives and abilities change how a unit behaves, rather than just adding numbers.
- **Formations.** The party stands in a formation of five slots, each with its own bonuses. A slot changes a unit's numbers, not where it is: there's no battlefield geometry.
- **Dungeons.** A few automatic fights, then a boss. Losing costs nothing, and retries are free.
- **Encounters** are designed as puzzles: a party brings strengths, a boss has gimmicks that call for them, and raw power can partly make up for a missing strength. The same units in a different formation can beat a different boss.
- **Enemies** use the same rules and stats as the party, and can use the same statuses.

**Firm rules for content.**

- Everything maps onto a few numerical systems: stats, statuses, damage types and targeting. No special keywords that only one thing interacts with.
- Nothing that asks the player to track a lot in their head, and nothing positional.
- A player has to be able to tell what's happening by watching.

**What comes after this.** The director's plan for the first playable set: design the core classes with their passives, stat lines and abilities (this brief); then weapons, with their types and class restrictions, and formations; then a first set of regular and boss encounters built to make the choice between these classes interesting; then play it, watch it and learn from it, before designing stranger classes, fuller gear and better encounters.

## 3. The combat system

The director designed this system, and it's built and working. Its numbers are placeholders.

**Time and actions.**

- Fights run in real time, counted in ticks. Nobody gives orders.
- Every action, basic attack or ability, has a cast time (a wind-up), a cooldown and a short recovery. When a unit is free, it uses the first of its abilities that's ready, in the order the player slotted them, and otherwise its basic attack.
- Abilities cost MP. An ability can have a condition, such as "only when an ally is below half health".
- Every action starts the fight on cooldown. Damage doesn't interrupt a cast; only a knockout or an interrupting lockout does.

**Targeting.** Units mostly attack a random foe, weighted by Aggro, a stat every unit has. A stat can force foes to target a unit (a taunt) or forbid them (stealth). An ability can pick its own targets instead: the lowest health, the highest of some stat, all foes, a random ally, and so on. An action can also be set to ignore taunts and stealth.

**Damage.**

- **Physical** damage is slashing, piercing or blunt. Evasion is a chance to dodge it, and Armor takes a flat amount off each hit, so many small hits do poorly against heavy armor.
- **Magical** damage carries an element. It can't be dodged, and the target's resistance to that element reduces it by a percentage. Negative resistance is a weakness; full resistance is immunity.
- Hits can crit.
- Every amount states what it scales from, and any stat can be a scaling source. No stat is tied to a damage type: physical things scaling from Attack, and magical things from Magic, is only a convention.
- Damage resolves in this order: dodge check, base amount and scaling, the attacker's boosts, the target's damage-taken modifiers, crit, mitigation (Armor or resistance), shields, then HP.

**Stats every unit has.** HP, MP, MP regeneration, Attack, Magic, Armor, a resistance to each element, Attack Speed, Cooldown Reduction, Crit chance and Aggro.

**Special stats** sit at zero for most units and only matter for units built around them: Evasion, Accuracy (cancels Evasion), Cast Time Reduction, Crit multiplier and Healing received are already in the engine, and the full set is designed with the classes. A special stat is a number on a unit, from its class or gear. It can do anything that hitting, timing or targeting reads, or it can bring a status with it while it's above zero, which is how a stat gets behaviour of its own.

**Statuses.** Anything that lasts on a unit for a while is a status. Every status is labelled buff or debuff. A status can:

- change stats, up or down;
- raise the damage or healing a unit deals, by kind: basic attacks, abilities, physical, magical, one physical type or one element;
- change how much damage a unit takes, of every kind or one kind;
- soak a pool of damage before HP (a shield);
- lock out some of a unit's actions (all, basic attacks only, or abilities only), optionally cancelling a wind-up;
- add an extra piece of damage to a unit's attacks, or change their element;
- do something on a timer: deal damage, heal, restore or drain MP, or apply another status;
- react to events: being hit, landing a hit, dodging, missing, dealing or taking damage, losing HP, being healed, starting, finishing or being interrupted in an action, gaining or losing a status, a unit being knocked out, or the fight starting.

How statuses stack and end:

- **Refresh:** reapplying replaces the old copy.
- **Fizzle:** reapplying fails while it's there.
- **Stacks:** each application adds stacks to one shared total, and the effect scales with the total. The total can drop on each timer or event (halve each time, or lose one), and the status ends when it falls below one stack.
- **Per source:** each applier keeps its own copy; it can end when its applier is knocked out (an aura).
- A status has a duration or lasts the whole fight. It can be unremovable, or survive its holder being knocked out. Effects can remove buffs or debuffs, and units can be immune to particular statuses or kinds of effect.

Two decided rules shape status design:

- **A status's own damage has no type or element by convention.** It isn't dodged, and Armor and resistance don't reduce it; only damage-taken modifiers and shields do.
- **A status is fixed when it's applied.** The applier's stats can set how many stacks an application adds, and nothing else; a stack is a stack, whoever applied it.

**Not built yet** (each would need new engine work): targeting rules on the attacker (a taunt that names one unit, charm), granting or repeating actions, revives, status resistance, summons or pets as their own units, and Lifesteal as a stat (it needs a second scaling factor).

**What players see.** Most statuses are machinery, invisible to the player. Only a few show as icons on a unit's HP bar, so the player-facing set should be small and easy to recognise.

## 4. The brainstorm

**How it was gathered.** The director wrote their own lists. Then fresh AI chats, blind to the director's ideas and to each other, were given a description of the game like sections 2 and 3 (without the decided-rule details) and asked for about 25 classes, 15 statuses (about 5 staples, then less common ones), 15 special stats and a list of elements, staples first. Opus ran three times, from three angles (A: the genre, B: the system, C: the trouble enemies cause); ChatGPT, Gemini, Grok and DeepSeek ran once each. The lists were then merged by meaning into one entry per idea; the entry names and one-line descriptions are the merge's summaries. The first Opus runs were steered towards mythology by a setting line in the prompt that was later removed, so the mythology classes are mostly that model's.

**How to read an entry.**

- **Sources:** how many of the five models proposed it, plus whether the director's own list had it. Agreement among independent models usually marks a genre staple.
- **Staple for:** the sources that put it above their own staples line.
- **Director's list:** the director's own wording, where their list had it.
- **Most versions use** (classes only): effects that at least half the versions of that class used.
- **Pick** and **Note:** the director's quick reaction. Read section 1 on how much weight these carry.

### The director's general notes

> I much prefer the elements as gameplay shape/rythm/utility more so than as elemental counters because then it makes more than just color matching gameplay.
>
> We need to be careful about too many things beating armor, and magic being the answer to both armor and evasion. Need to make sure our first subset isn't too lopsided
>
> There's a big confusion between special stats and statuses, the distinction is unclear. I didn't make that not everywhere, so I focused on effect not stat vs status effect distinction
>
> Quite a few classes overlap (various versions of voodoo/curses/disease and tanky healer/support, guardian/team cover). Mentioned it once then stopped mentioning it

### Classes

51 entries, most-proposed first.

- **Cleric.** Heals the most hurt ally and lifts debuffs. *Sources:* 5 of 5 models and the director. *Called:* Cleric (director, GPT, Gemini, DeepSeek); White Mage (A), Cleric (B, C) (Opus); Cleric / Healer (Grok). *Staple for:* Opus, GPT, Gemini, Grok, DeepSeek. *Director's list:* "Cleric (squishy, heals/revives, pocket burst damage)" *Most versions use:* Regen, Shield. *Pick:* keep.
- **Paladin.** A holy knight who fights, shields and heals a little. *Sources:* 5 of 5 models and the director. *Called:* Guardian (director); Paladin (Opus, GPT, Gemini, Grok, DeepSeek). *Staple for:* Opus, GPT, Gemini, Grok, DeepSeek. *Director's list:* "Guardian (tanky healer with physical scaling)" *Most versions use:* Shield. *Merge note:* Gemini's shares Armor with "adjacent slots", which is positional. *Pick:* keep. *Note:* "Paladin and knight might too much overlap for a core set unless one gets differentiated a bit more"
- **Monk.** A martial artist: many quick hits, combos, dodges and counters. *Sources:* 5 of 5 models and the director. *Staple for:* Opus, GPT, Grok, DeepSeek. *Director's list:* "Monk (Dodge tank with heals)" *Most versions use:* Evasion, Combo. *Pick:* maybe. *Note:* "Combo does not feel like a core subset element, but dodge tank does"
- **Ranger.** Steady ranged damage that marks prey for the party. *Sources:* 5 of 5 models and the director. *Called:* Archer (director, GPT); Ranger (Opus, Gemini, DeepSeek); Archer / Ranger (Grok). *Staple for:* Opus, GPT, Grok, DeepSeek. *Director's list:* "Archer (consistent high sustained damage but squishy)" *Most versions use:* Marked. *Pick:* keep.
- **Berserker.** Stronger the nearer it gets to death. *Sources:* 5 of 5 models. *Staple for:* Opus, GPT, Grok. *Most versions use:* Berserk, Lifesteal. *Pick:* maybe.
- **Necromancer.** Shadow magic: drains, curses, doom; feeds on knockouts. *Sources:* 5 of 5 models. *Called:* Necromancer (A, B), Warlock (C) (Opus); Necromancer (GPT, Gemini, Grok); Warlock and Necromancer (DeepSeek). *Staple for:* DeepSeek. *Most versions use:* Lifesteal, Doom. *Merge note:* Grok's raises minions, which needs summons. *Pick:* maybe. *Note:* "Gameplay seems interesting, Necromancer is a misnomer without summons, which we won't have at first."
- **Alchemist.** Flasks: poisons and debuffs for foes, potions for allies. *Sources:* 5 of 5 models. *Most versions use:* Poison, Potency. *Pick:* maybe.
- **Time mage.** Speeds allies, slows and stops foes. *Sources:* 5 of 5 models. *Called:* Time Mage (A), Chronomancer (C) (Opus); Time Mage (GPT, Grok); Chronosorcerer (Gemini); Chronomancer (DeepSeek). *Most versions use:* Haste, Chill, Stun. *Pick:* maybe. *Note:* "Don't hate it, but we need really spiky time abilities otherwelse it's a chill bot. Very much cool or not cool depending on specific design"
- **Mage.** Elemental caster: big hits, fragile. *Sources:* 4 of 5 models and the director. *Called:* Mage (director, GPT, Gemini, Grok); Black Mage (A), Mage (B, C) (Opus). *Staple for:* Opus, GPT, Gemini, Grok. *Director's list:* "Mage (fire and lightning, ramping damage in a squishy shell)" *Most versions use:* Burn. *Merge note:* Burn and Shock come from the director's Fire and Lightning. *Pick:* keep. *Note:* "Potentially more than one type of mage"
- **Rogue.** A quick, evasive blade whose dodges turn into crits. *Sources:* 4 of 5 models and the director. *Called:* Rogue (director, Gemini, Grok); Thief (A, B), Rogue (C) (Opus); Thief (GPT). *Staple for:* Opus, GPT, Gemini, Grok. *Director's list:* "Rogue (evasive, high burst damage but weak sustained attack)" *Most versions use:* Evasion, Focus. *Pick:* keep.
- **Bard.** Songs or dances that buff the whole party. *Sources:* 4 of 5 models and the director. *Called:* Dancer (director); Bard (Opus, GPT, Grok); Shaman and Bard (DeepSeek). *Staple for:* Opus, GPT, DeepSeek. *Director's list:* "Dancer (pure buffer)" *Most versions use:* Stat buffs and debuffs, Haste. *Pick:* keep.
- **Voodoo.** Little damage, many stacking curses. *Sources:* 4 of 5 models and the director. *Called:* Voodoo (director); Hexer (A) (Opus); Witch (GPT); Witchdoctor (Gemini); Sorcerer (Grok). *Staple for:* Grok. *Director's list:* "Voodoo (pure debuff)" *Most versions use:* Potency. *Pick:* maybe. *Note:* "Plague doctor and voodoo seem like the same thing to me"
- **Knight.** An armored wall that draws attacks: taunts, guards, shields. *Sources:* 4 of 5 models. *Called:* Knight (Opus, GPT); Warrior (Gemini); Vanguard (DeepSeek). *Staple for:* Opus, GPT, Gemini, DeepSeek. *Most versions use:* Taunt, Shield, Guard. *Pick:* keep. *Note:* "Paladin and knight might too much overlap for a core set unless one gets differentiated a bit more"
- **Plague doctor.** Spreads poison and sickness; it jumps when its holder falls. *Sources:* 4 of 5 models. *Called:* Plague Doctor (A, B) (Opus); Plague Doctor (GPT, Gemini); Plaguebringer (DeepSeek). *Most versions use:* Poison, Potency, Shock. *Pick:* maybe. *Note:* "Plague doctor and voodoo seem like the same thing to me"
- **Spellblade.** Puts an element on weapons: its own, or an ally's. *Sources:* 4 of 5 models. *Called:* Spellblade (A, B), Runesmith (C) (Opus); Spellblade (GPT); Shaman (Gemini); Runekeeper (DeepSeek). *Most versions use:* Enchant, Vulnerable. *Pick:* keep.
- **Templar.** Anti-debuff: cleanses, resists, and keeps debuffs off the party. *Sources:* 4 of 5 models. *Called:* Shrine Maiden (B), Miko (C) (Opus); Templar (GPT, Gemini, DeepSeek). *Most versions use:* Tenacity, Shield, Regen. *Pick:* maybe.
- **Brigand.** Heavy hits that break or pierce armor. *Sources:* 3 of 5 models and the director. *Called:* Brigand (director); Fighter (A), Warrior (C) (Opus); Lancer (GPT); Sentinel (DeepSeek). *Staple for:* Opus. *Director's list:* "Brigand (high damage, low accuracy, medium survivability, shreds armor)" *Most versions use:* Sunder, Armor penetration. *Pick:* keep. *Note:* "Non-magical counter to armor"
- **Priest.** Healing over time and protection; most lists make it a druid. *Sources:* 3 of 5 models and the director. *Called:* Priest (director); Druid (A, B) (Opus); Druid (GPT, Grok). *Staple for:* Opus. *Director's list:* "Priest (squishy, regen, support, pocket heals)" *Most versions use:* Regen, Thorns. *Pick:* keep.
- **Assassin.** A burst killer that finishes the wounded. *Sources:* 3 of 5 models and the director. *Called:* Assassin (director, Gemini, Grok); Assassin and Executioner (GPT). *Director's list:* "Assassin (taunt ignoring burst killer)" *Most versions use:* Execute, Focus. *Merge note:* Ignoring taunts builds today: an action can ignore targeting overrides. *Pick:* maybe.
- **Vampire.** An off-tank that lives on lifesteal. *Sources:* 3 of 5 models and the director. *Called:* Vampire (director, Gemini, Grok); Blood Knight (DeepSeek). *Director's list:* "Vampire (lifesteal off-tank)" *Most versions use:* Lifesteal. *Pick:* keep.
- **Hoplite.** A shield-bearer who makes the whole party sturdier. *Sources:* 3 of 5 models. *Called:* Hoplite (B, C) (Opus); Knight-Captain (Gemini); Knight (Grok). *Staple for:* Grok. *Most versions use:* Shield, Counter. *Pick:* maybe.
- **Beastmaster.** Fights beside a pet that adds its own strikes. *Sources:* 3 of 5 models. *Called:* Beastmaster (GPT, DeepSeek); Summoner (Grok). *Most versions use:* Companion, Marked. *Merge note:* Grok's is a full summoner, which needs summons. *Pick:* cut.
- **Blood mage.** Pays its own HP for power; losing HP restores MP. *Sources:* 3 of 5 models. *Called:* Blood Mage (A) (Opus); Blood Mage (Gemini); Warlock (Grok). *Merge note:* Opus's fights-run Warlock has the same passive. *Pick:* cut. *Note:* "Could be convinced, but doesn't seem core to me"
- **Fencer.** Duels one foe; parries and counters. *Sources:* 3 of 5 models. *Called:* Duelist (B) (Opus); Duelist (GPT, Gemini). *Most versions use:* Taunt, Counter, Evasion. *Merge note:* Every list calls it Duelist. A one-foe challenge needs targeting rules on the attacker, which isn't built yet. The director's Duelist is a different idea (its own card). *Pick:* keep.
- **Oracle.** Foresight: marks or dooms foes, shields or blinks allies before the blow. *Sources:* 3 of 5 models. *Most versions use:* Shield, Marked, Haste. *Pick:* cut.
- **Spellbreaker.** Strips foes' buffs and shields, and silences casters. *Sources:* 3 of 5 models. *Called:* Spellbreaker (C) (Opus); Inquisitor (Gemini); Spellbreaker (DeepSeek). *Most versions use:* Silence, Stagger. *Pick:* none. *Note:* "Unsure of practical utility as main class role"
- **Soldier.** An all-round front-liner: a little tanky, a little offensive. *Sources:* 2 of 5 models and the director. *Called:* Soldier (director); Warrior (GPT, Grok). *Staple for:* GPT, Grok. *Director's list:* "Soldier (middle of the road physical class, a little tanky and a little offensive)" *Most versions use:* Stat buffs and debuffs. *Pick:* keep.
- **Pyromancer.** A fire specialist: stacking, spreading burns. *Sources:* 2 of 5 models. *Staple for:* DeepSeek. *Most versions use:* Burn, Vulnerable. *Pick:* keep.
- **Frostweaver.** Frost that piles up until foes freeze. *Sources:* 2 of 5 models. *Called:* Yuki-onna (B) (Opus); Frostweaver (Gemini). *Most versions use:* Chill. *Pick:* keep.
- **Gunslinger.** Rapid-fire shots that shred armor, with reloads or overheating. *Sources:* 2 of 5 models. *Pick:* cut. *Note:* "No reload mechanic, stick to cooldown for now"
- **Illusionist.** Mirror images and decoys that make hits miss. *Sources:* 2 of 5 models. *Called:* Illusionist (C) (Opus); Illusionist (Grok). *Most versions use:* Blink. *Pick:* cut.
- **Reaper.** Harvests knockouts into power and big hits. *Sources:* 2 of 5 models. *Most versions use:* Doom. *Pick:* maybe.
- **Samurai.** Long wind-ups that land huge, crit-heavy cuts. *Sources:* 2 of 5 models. *Called:* Samurai (A, B), Ronin (C) (Opus); Samurai (Grok). *Most versions use:* Focus. *Pick:* keep.
- **Duelist.** Attack speed and crits, squishy and slightly evasive. *Sources:* 1 of 5 models and the director. *Staple for:* DeepSeek. *Director's list:* "Duelist (attack speed and crit king, squishy and slightly evasive)" *Most versions use:* Evasion. *Pick:* maybe. *Note:* "Potentially too vanilla if other roles operate similarly"
- **Bramble knight.** A tank that punishes whoever hits it. *Sources:* 1 of 5 models and the director. *Called:* Bramble knight (director); Gladiator (C) (Opus). *Director's list:* "Bramble knight (thorns tank)" *Most versions use:* Thorns. *Pick:* keep.
- **Trapper.** Sets timed statuses on foes, then detonates them. *Sources:* 1 of 5 models. *Called:* Engineer and Trapper (DeepSeek). *Staple for:* DeepSeek. *Most versions use:* Detonate, Burn, Vulnerable, Marked, Stun. *Pick:* cut. *Note:* "Wouldn't start with this, too many complex ally status effect interactions"
- **Artillerist.** Huge, slow blunt blasts; heavier gear hits harder. *Sources:* 1 of 5 models. *Most versions use:* Weight, Sunder. *Pick:* cut. *Note:* "Unclear fantasy and gameplay"
- **Dancer.** An evasive dancer who debuffs foes and charms one. *Sources:* 1 of 5 models. *Called:* Dancer (A) (Opus). *Most versions use:* Stat buffs and debuffs, Evasion. *Merge note:* Charm needs targeting rules on the attacker, which isn't built yet. The director's Dancer is a different idea, merged into Bard. *Pick:* maybe. *Note:* "Doesn't necessarily need to be charm, evasive debuffer is a classic hard to make work class but satisfying"
- **Dragoon.** Leaps out of reach and lands one huge hit. *Sources:* 1 of 5 models. *Called:* Dragoon (A, C) (Opus). *Most versions use:* Hidden, Stagger, Armor penetration. *Pick:* maybe. *Note:* "Just a final fantasy rip-off, can find a better fantasy for this gameplay, it's basically an evasive samurai"
- **Einherjar.** Fights hard and dies loudly; its war cry outlives it. *Sources:* 1 of 5 models. *Called:* Einherjar (B) (Opus). *Most versions use:* Stat buffs and debuffs, Spite. *Pick:* maybe.
- **Engineer.** Deploys turrets and gadgets that attack or shield. *Sources:* 1 of 5 models. *Most versions use:* Companion. *Merge note:* Turrets that are their own units need summons. *Pick:* cut.
- **Geomancer.** Lingering elemental fields that power up later spells. *Sources:* 1 of 5 models. *Most versions use:* Resonance. *Pick:* cut. *Note:* "Earth magic caster sure why not, but not when described this way"
- **Gorgon.** Turns the strongest foe to stone, which hurts when it cracks. *Sources:* 1 of 5 models. *Called:* Gorgon (B) (Opus). *Most versions use:* Stone, Potency. *Pick:* cut. *Note:* "Target strongest foe is an ability not a whole class"
- **Martyr.** Spends its own HP to heal; its fall heals and shields the party. *Sources:* 1 of 5 models. *Called:* Martyr (C) (Opus). *Most versions use:* Shield. *Pick:* maybe.
- **Mimic.** Copies statuses from foes and allies. *Sources:* 1 of 5 models. *Most versions use:* Copy, Vulnerable. *Pick:* cut.
- **Ninja.** Starts hidden, throws poison, hard to pin down. *Sources:* 1 of 5 models. *Called:* Ninja (A, B) (Opus). *Most versions use:* Hidden, Poison, Blink, Stealth, Evasion. *Pick:* maybe.
- **Onmyoji.** Talismans that silence and seal; wards for allies. *Sources:* 1 of 5 models. *Most versions use:* Silence, Chill, Shield, Stat buffs and debuffs. *Pick:* maybe.
- **Valkyrie.** Revives allies, and grows stronger as units fall. *Sources:* 1 of 5 models. *Most versions use:* Reraise, Haste, Stat buffs and debuffs, Execute, Overkill. *Pick:* keep.
- **Dark knight.** An armor tank that deals magic damage. *Sources:* the director only. *Director's list:* "Dark knight (armor tank with magic damage)" *Pick:* maybe. *Note:* "Paladin in a different color"
- **Earth martial artist.** Uneven damage, with support and debuffs. *Sources:* the director only. *Director's list:* "Earth martial artist (inconsistent dps with support and debuff potential)" *Most versions use:* Shield, Poison. *Merge note:* Shield and Poison come from the director's Earth. *Pick:* cut.
- **Pegasus warrior.** A resistance tank that also deals damage. *Sources:* the director only. *Director's list:* "Pegasus warrior (resist tank with damage)" *Pick:* maybe. *Note:* "I think this is"

### Statuses

30 entries, most-proposed first.

- **Poison.** Steady damage on a timer; doses stack. *Sources:* 5 of 5 models and the director. *Staple for:* Opus, GPT, Gemini, Grok. *In the director's core list.* *Director's list:* "Poison (consistent dot)" *Engine:* builds today. *Pick:* keep.
- **Regen.** Heals a little on a timer. *Sources:* 5 of 5 models and the director. *Called:* HP Regen (director); Regen (Opus, Gemini, Grok); Regeneration (GPT, DeepSeek). *Staple for:* Opus, GPT, Gemini, Grok, DeepSeek. *Director's list:* "HP Regen" *Engine:* builds today. *Pick:* keep.
- **Shield.** Soaks a pool of damage before HP. *Sources:* 5 of 5 models and the director. *Called:* Shields (director); Barrier (A, C), Shield (B) (Opus); Barrier (GPT, DeepSeek); Shield (Gemini); Shield / Barrier and Shield Charges (Grok). *Staple for:* Opus, GPT, Grok, DeepSeek. *In the director's core list.* *Director's list:* "Shields" *Engine:* builds today. *Pick:* keep.
- **Haste.** Acts faster: attacks, cooldowns or wind-ups. *Sources:* 5 of 5 models and the director. *Staple for:* Opus, GPT, Gemini, DeepSeek. *Director's list:* "Haste" *Engine:* builds today. *Pick:* keep.
- **Stun.** Can't act, and loses what it was winding up. *Sources:* 5 of 5 models and the director. *Called:* Freeze (director); Stun (Opus, GPT, Gemini, Grok, DeepSeek). *Staple for:* Opus, GPT, Gemini, Grok. *Director's list:* "Freeze (stun)" *Engine:* builds today. *Pick:* maybe.
- **Taunt.** Foes are forced to attack this unit. *Sources:* 5 of 5 models and the director. *Called:* Taunt (director, Grok, DeepSeek); Taunt (A, B), Taunted (C) (Opus); Taunted (GPT); taunts (Gemini). *Staple for:* Opus, DeepSeek. *In the director's core list.* *Director's list:* "Taunt" *Engine:* builds today. As a buff on the taunter. Opus's fights run and GPT made it a debuff on each foe naming who it must hit; that needs targeting rules on the attacker, which isn't built yet. *Pick:* keep. *Note:* "This would be a buff on the taunter"
- **Silence.** Can't use abilities, only basic attacks. *Sources:* 5 of 5 models and the director. *Called:* Silence (director, Opus, Gemini, Grok, DeepSeek); Silenced (GPT). *Staple for:* Opus. *Director's list:* "Silence" *Engine:* builds today. *Pick:* maybe.
- **Vulnerable.** Takes more damage: of every kind, or of one element. *Sources:* 5 of 5 models and the director. *Called:* Mark for death (director); Hex (A), weaker to this element (C) (Opus); Vulnerable (GPT, DeepSeek); Vulnerability (Gemini); Curse (Grok). *Director's list:* "Mark for death" *Engine:* builds today. *Pick:* maybe. *Note:* "Could be more conditional, like next hit too, this is what I meant by Mark for Death"
- **Doom.** A countdown that ends in one big hit, or a knockout, unless removed first. *Sources:* 5 of 5 models. *Called:* Doom (A, B), Fated (C) (Opus); Doomed (GPT); Doom (Gemini, DeepSeek); Doom / Mark (Grok). *Engine:* builds today. *Pick:* maybe. *Note:* "I worry about starting with "unless someone removes it" as a condition in an auto-battled, but the gameplay is nice"
- **Chill.** Acts slower; some versions stack, and one freezes at 5 stacks. *Sources:* 4 of 5 models and the director. *Called:* Chilled (director); Slow (A), Chill (B, C) (Opus); Chill (Gemini); Slow and Freeze (Grok); Slow (DeepSeek). *Staple for:* Opus, DeepSeek. *In the director's core list.* *Director's list:* "Chilled (slow and decrease evasion)" *Engine:* builds today. *Pick:* keep.
- **Burn.** Damage over time that ramps up, or burns hot. *Sources:* 4 of 5 models and the director. *Called:* Burn (director, GPT, Grok, DeepSeek); burn (Gemini). *Staple for:* Grok. *In the director's core list.* *Director's list:* "Burn (ramping damage over time)" *Engine:* builds today. Every model but Opus has Burn. GPT's also cuts healing; Grok's may lower Armor. *Pick:* keep.
- **Berserk.** Hits harder, at a cost: weaker defences, more damage taken, or no abilities. *Sources:* 4 of 5 models and the director. *Called:* Rage (director); Berserk (A, B) (Opus); Enraged (GPT); Berserk (Grok); Enrage (DeepSeek). *Director's list:* "Rage (strength up tankyness down)" *Engine:* builds today. *Pick:* maybe.
- **Enchant.** Its attacks carry something extra: elemental damage, a new element, or a status. *Sources:* 4 of 5 models. *Called:* weapon-element buff (A), extra damage on attacks (B), rune buffs (C) (Opus); extra elemental hit and Poison Coating (GPT); cycling elements (Gemini); shift to weakness (DeepSeek). *Engine:* builds today. *Pick:* maybe. *Note:* "Very cool, need to make sure it's useful"
- **Focus.** Its next hits are stronger, or crit chance builds until it's struck or misses. *Sources:* 4 of 5 models. *Called:* stacking crit buff (A), crit chance up (B), next hit crits (C) (Opus); Precision Focus (Gemini); Empower and Focus / Resolve (Grok); Focus (DeepSeek). *Engine:* builds today. *Pick:* maybe.
- **Marked.** Draws fire: the other side targets it more, takes more damage, or both. *Sources:* 4 of 5 models. *Called:* Marked (A), Hunted (B, C) (Opus); Marked (GPT); Mark Count (Grok); Mark (DeepSeek). *Engine:* builds today. *Pick:* cut. *Note:* "This feels too mechanically complex from the targeting side for a first pass"
- **Stat buffs and debuffs.** Plain ups and downs: Attack (Might), damage dealt (Weakened), Armor, crit, auras. *Sources:* 3 of 5 models and the director. *Called:* Various stat buffs (director); Attack up/down (A), Attack up, Armor up (B), Attack, Armor, Evasion buffs (C) (Opus); Might and Weakened (GPT); Presence (Grok). *Staple for:* GPT. *Director's list:* "Various stat buffs" *Engine:* builds today. *Pick:* cut. *Note:* "Ideally we find thematic bundles and we're not just directly stat downing people"
- **Reraise.** Comes back from a knockout once, or survives one. *Sources:* 3 of 5 models and the director. *Called:* revive (director); Reraise (A), rises once after falling (C) (Opus); Unyielding Resolve (Gemini); Reanimate (DeepSeek). *Director's list:* not as its own entry, but in "Cleric (squishy, heals/revives, pocket burst damage)" and "holy ( strong spells on non-offensive classes, healing, regen and revive, ...)". *Engine:* needs engine work. Revives aren't built yet. *Pick:* keep.
- **Guard.** Takes less damage, or has more Armor, for a while. *Sources:* 3 of 5 models. *Called:* Guard (A), damage taken down (B) (Opus); Protect (Gemini); Fortify (Grok). *Staple for:* Gemini. *Engine:* builds today. *Pick:* maybe. *Note:* "For a minimum subset I'd probably try this giving resistance as well if we included it"
- **Sunder.** Armor lowered, stacking or for good. *Sources:* 3 of 5 models. *Called:* Sunder (A), Sundered (C) (Opus); Fragile and Armor Shred (Gemini); Sunder (DeepSeek). *Engine:* builds today. The director's Brigand "shreds armor", so it needs something like this too. *Pick:* maybe. *Note:* "We might not need this and armor pen in the same subset, it's all about number checks vs counters"
- **Bleed.** Physical-feeling damage over time. Versions differ: bursty, stacking per hit, or worse when hit. *Sources:* 2 of 5 models and the director. *In the director's core list.* *Director's list:* "Bleed (big damage but hard to maintain stacks)" *Engine:* builds today. Grok's stacks with each hit; DeepSeek's worsens when the holder is hit. *Pick:* keep. *Note:* "I prefer my version here, but all damage status effects need to be defined one from the others"
- **Shock.** Takes damage each time it acts, so it hurts fast units most. *Sources:* 2 of 5 models and the director. *Called:* Shock (director); Bleed (Opus); Bleeding (GPT). *In the director's core list.* *Director's list:* "Shock (damage on attack)" *Engine:* builds today. Opus and GPT call this Bleed. The director's Bleed is a different status (its own card). *Pick:* keep.
- **Blind.** Its physical hits often miss. *Sources:* 2 of 5 models and the director. *Called:* Blind (director, Grok); Blind (A) (Opus). *Director's list:* "Blind" *Engine:* builds today. *Pick:* cut.
- **Hidden.** Can't be targeted, or is targeted less, for a while or until it acts. *Sources:* 2 of 5 models and the director. *Called:* Hidden (director); untargetable (A), Veiled (B, C) (Opus); Stealth (Grok). *Director's list:* "Hidden" *Engine:* builds today. *Pick:* maybe. *Note:* "Unclear if needed when taunt exists"
- **Blink.** Each stack makes one hit miss outright. *Sources:* 2 of 5 models. *Called:* Blink (A), mirror images (C) (Opus); Mirror Image (Grok). *Engine:* builds today. *Pick:* cut.
- **Momentum.** Builds with each hit landed; a miss drops it. *Sources:* 2 of 5 models. *Called:* Momentum (B) (Opus); Momentum (Gemini). *Engine:* builds today. The Combo special stat is the same idea as a stat. *Pick:* cut. *Note:* "Is this fun or just a pass/fail win depending on foe's evasion"
- **Purified.** Can't gain debuffs for a while, or ignores the next few. *Sources:* 2 of 5 models. *Called:* debuff immunity (B), immune to debuffs (C) (Opus); Cleanse-ready / Immunity (Grok). *Engine:* builds today. *Pick:* cut.
- **Rot.** Heals do less, or partly hurt. *Sources:* 2 of 5 models. *Called:* Curse (A), Rot (B), Festering (C) (Opus); reverses healing (Gemini). *Engine:* builds today. GPT's Burn also cuts healing. *Pick:* cut.
- **Root.** Can't dodge: Evasion set to zero. *Sources:* 1 of 5 models. *Engine:* builds today. *Pick:* maybe. *Note:* "Really depends on the enemies and which other answers exist, because right now magic hard counters dodge"
- **Soul Link.** Part of the damage it takes is passed to a linked foe. *Sources:* 1 of 5 models. *Engine:* builds today. *Pick:* cut.
- **Stone.** Can't act, but takes almost no damage. *Sources:* 1 of 5 models. *Called:* Stone (B), Petrified (C) (Opus). *Engine:* builds today. *Pick:* cut.

### Special stats

42 entries, most-proposed first.

- **Lifesteal.** Heals for a share of the damage it deals. *Sources:* 5 of 5 models and the director. *Called:* Lifesteal (director, Opus, GPT, Grok, DeepSeek); Bloodthirst (Gemini). *Staple for:* Opus, GPT, Grok, DeepSeek. *Director's list:* "Lifesteal" *Engine:* needs engine work. Not built yet: it needs a second scaling factor. Gemini has it as a status. *Pick:* keep.
- **Execute.** More damage against low-HP targets. *Sources:* 5 of 5 models. *Called:* Execute (A), Executioner (C) (Opus); Finisher (GPT); executes (Gemini); Execution Threshold (Grok); Execute (DeepSeek). *Staple for:* DeepSeek. *Engine:* needs engine work. An ability can already scale from the target's missing HP; as a stat on every hit it needs a new building block. *Pick:* cut. *Note:* "Classic ability effect, less compelling when represented as a stat"
- **Evasion.** Chance to dodge a physical hit. *Sources:* 4 of 5 models and the director. *Called:* Evasion (director, Opus, GPT, DeepSeek); Dodge / Evasion (Grok). *Staple for:* Opus, GPT, Grok, DeepSeek. *Director's list:* "Evasion" *Engine:* already in the engine. *Pick:* keep.
- **Armor penetration.** Ignores some of the target's Armor on each hit. *Sources:* 4 of 5 models and the director. *Called:* Armor penetration (director); Penetration (A, B), Armor Pierce (C) (Opus); Armor Penetration (GPT); ignores Armor (Gemini); Penetration (DeepSeek). *Staple for:* Opus, DeepSeek. *Director's list:* "Armor penetrartion" *Engine:* needs engine work. A small addition to hit resolution. Some versions also cut resistance. *Pick:* keep.
- **Thorns.** Whoever hits it takes damage back. *Sources:* 4 of 5 models and the director. *Called:* Thorns (director, GPT, Grok, DeepSeek); Thorns (A, B), Spikes (C) (Opus). *Staple for:* Opus, DeepSeek. *Director's list:* "Thorns" *Engine:* builds today. Some lists have it as a status, which the stat can bring. *Pick:* keep.
- **Overflow.** Healing past full HP becomes a shield. *Sources:* 4 of 5 models. *Called:* overheal to Barrier (A), Overflow (B) (Opus); Vitality Shield (Gemini); excess healing to temporary HP (Grok); Overheal (DeepSeek). *Engine:* needs engine work. A small addition: heal events don't report the overheal yet. *Pick:* cut. *Note:* "Might not pick this and explicit shields application for a first subset"
- **Accuracy.** Cancels out the target's Evasion. *Sources:* 3 of 5 models and the director. *Staple for:* Opus, GPT, Grok. *Director's list:* "Accuracy" *Engine:* already in the engine. *Pick:* cut. *Note:* "Magic counters evasion for now, unsure of necessity"
- **Counter.** Chance to strike back when hit. *Sources:* 3 of 5 models and the director. *Called:* Riposte (director); Counter (Opus, Grok); Counter Chance (GPT). *Staple for:* Opus. *Director's list:* "Riposte (dodge and attack)" *Engine:* builds today. Builds as reaction damage, which can't crit or trigger on-hit effects. *Pick:* maybe. *Note:* "Overlap with thorns, maybe variety is good, maybe it's too much"
- **Combo.** Builds with consecutive hits; empowers the next hits or ability. *Sources:* 3 of 5 models. *Called:* Combo Count and Momentum Velocity (Gemini); Combo / Chi (Grok); Combo (DeepSeek). *Staple for:* Gemini. *Engine:* builds today. The same idea as the Momentum status. *Pick:* cut. *Note:* "Definitely a class gimmick and not core set"
- **Potency.** Its statuses land better: more stacks, more often, or for longer. *Sources:* 3 of 5 models. *Called:* Potency (B), extra stacks (C) (Opus); Status Chance and Debuff Duration (GPT); Curse Resonance (Gemini). *Staple for:* GPT. *Engine:* builds today. More stacks builds today. More often, or for longer, would be small additions. *Pick:* cut.
- **Cover.** Takes hits, or part of the damage, aimed at a hurt ally. *Sources:* 3 of 5 models. *Called:* Cover (C) (Opus); Cover (Grok); redirects damage (DeepSeek). *Engine:* needs engine work. Redirecting a hit needs a new building block. *Pick:* cut. *Note:* "Without player chosen targeting this seems like worse taunt?"
- **Echo.** Chance an ability goes off a second time. *Sources:* 3 of 5 models. *Called:* Echo (A, B) (Opus); Echo (Grok, DeepSeek). *Engine:* needs engine work. Granting actions isn't built yet. *Pick:* maybe. *Note:* "A cool gimmick, very likely not core set"
- **Crit damage.** How much harder its crits hit. *Sources:* 2 of 5 models and the director. *Called:* Crit damage (director); Crit Damage (A, B), Crit Power (C) (Opus); Critical Damage (GPT). *Staple for:* Opus, GPT. *Director's list:* "Crit damage" *Engine:* already in the engine. Already in the engine as Crit multiplier. *Pick:* maybe. *Note:* "Crit build simulation tells us if we need this"
- **Double strike.** Chance a basic attack hits again. *Sources:* 2 of 5 models and the director. *Called:* Double hit (director); Double Strike (A, C) (Opus); Multistrike (DeepSeek). *Staple for:* DeepSeek. *Director's list:* "Double hit" *Engine:* needs engine work. The engine has no chance of an extra hit; a reaction can fake it, but not as a real hit. *Pick:* keep.
- **Block.** Chance to shrink a physical hit by a large share. *Sources:* 2 of 5 models. *Called:* Block (C) (Opus); Block Chance (Grok). *Staple for:* Opus, Grok. *Engine:* needs engine work. Damage reduction by chance needs a new building block. *Pick:* cut. *Note:* "This just doubles up armor"
- **Mana leech.** Restores MP from damage dealt or from acting. *Sources:* 2 of 5 models. *Called:* Mana Leech (GPT); Mana Flow (Gemini). *Staple for:* Gemini. *Engine:* builds today. *Pick:* maybe.
- **Rage.** A meter that fills from taking (or dealing) damage and fuels power. *Sources:* 2 of 5 models. *Called:* Rage and Blood Debt (Gemini); Blood and Stacks of Rage (Grok). *Staple for:* Gemini. *Engine:* builds today. *Pick:* cut. *Note:* "Too complex for what it does for now"
- **Tenacity.** Debuffs on it wear off faster, or fail to land. *Sources:* 2 of 5 models. *Called:* Tenacity (Opus); Status Resistance (GPT). *Staple for:* Opus. *Engine:* needs engine work. Status resistance isn't built yet; an earlier note of the director's says cutting stacks may beat cutting duration. *Pick:* cut. *Note:* "I wouldn't start with debuff resist as a stat, if we try it it's as an ability effect"
- **Cast speed.** Shorter wind-ups on abilities. *Sources:* 2 of 5 models. *Called:* Cast Speed (A), Quickcast (B, C) (Opus); Cast Speed (GPT). *Engine:* already in the engine. Already in the engine as Cast Time Reduction. *Pick:* keep.
- **Companion.** A pet or bond that adds extra attacks. *Sources:* 2 of 5 models. *Called:* Bond (Grok); Companion (DeepSeek). *Engine:* needs engine work. Extra strikes on the holder's attacks build today; a real pet or turret that's its own unit needs a new building block. *Pick:* cut. *Note:* "Summons aren't base set unless tech needs to start now for eventual support"
- **Detonate.** Pops statuses on a foe for burst damage. *Sources:* 2 of 5 models. *Called:* detonates stacks (Gemini); Detonate (DeepSeek). *Engine:* builds today. *Pick:* maybe. *Note:* "Potentially cool ability effect, esoteric to start though"
- **Heat.** Builds as it attacks; vents a burst, or overheats into a self-debuff. *Sources:* 2 of 5 models. *Called:* Heat Buildup (Gemini); Overheat (Grok). *Engine:* builds today. *Pick:* cut.
- **Soul.** Charges gained when units are knocked out, spent on big effects. *Sources:* 2 of 5 models. *Called:* Soul Spark (Gemini); Soul / Essence (Grok). *Engine:* builds today. *Pick:* cut.
- **Stagger.** Chance a hit cancels the target's wind-up. *Sources:* 2 of 5 models. *Called:* Stagger (B), Interrupt (C) (Opus); interrupts casts (Gemini). *Engine:* builds today. *Pick:* cut.
- **Elemental damage.** More damage of one element, a line per element. *Sources:* 1 of 5 models and the director. *Called:* Elemental damage (director); Shadow Depth (Gemini). *Director's list:* "Elemental damage (per type)" *Engine:* needs engine work. Today a status carries this as a boost; as a stat it adds a line per element, like resistances. *Pick:* keep.
- **Purity.** Takes less magic damage, until elements wear it down. *Sources:* 1 of 5 models. *Staple for:* Gemini. *Engine:* builds today. *Pick:* maybe. *Note:* "No clue what until éléments wear it down means"
- **Threat.** How likely foes are to target it. *Sources:* 1 of 5 models. *Called:* Threat / Aggro (Grok). *Staple for:* Grok. *Engine:* already in the engine. Already a stat every unit has (Aggro). *Pick:* keep. *Note:* "This and taunt need to be rationalized together and only both included if it makes sense"
- **Weight.** Heavier gear adds blunt damage. *Sources:* 1 of 5 models. *Staple for:* Gemini. *Engine:* needs engine work. Gear has no weight today. *Pick:* cut.
- **Charge.** Fills over time; empties into one big action a fight. *Sources:* 1 of 5 models. *Engine:* builds today. *Pick:* cut.
- **Copy.** Copies a status from a foe or ally. *Sources:* 1 of 5 models. *Engine:* needs engine work. *Pick:* cut.
- **Decay.** Statuses on its target run out faster. *Sources:* 1 of 5 models. *Engine:* needs engine work. Nothing changes a running status's duration today. *Pick:* cut.
- **Foresight.** Warns of the next heavy hit and gives a short defensive window. *Sources:* 1 of 5 models. *Engine:* builds today. *Pick:* cut.
- **Head start.** Its cooldowns start the fight partway done. *Sources:* 1 of 5 models. *Called:* Head Start (C) (Opus). *Engine:* needs engine work. A small addition: every action starts on full cooldown today. *Pick:* maybe. *Note:* "Cool itemization thing to prevent resource attrition through trash mobs"
- **Healing power.** Its heals are stronger. *Sources:* 1 of 5 models. *Called:* Healing Power (GPT). *Engine:* needs engine work. Today a status carries this as a healing boost; as a stat it's a small addition. *Pick:* maybe.
- **Mana burn.** Its hits drain the target's MP. *Sources:* 1 of 5 models. *Called:* Mana Burn (A) (Opus). *Engine:* builds today. *Pick:* cut.
- **Overkill.** Damage past a knockout spills onto another foe. *Sources:* 1 of 5 models. *Called:* Overkill (B) (Opus). *Engine:* needs engine work. A small addition: no event reports overkill yet. *Pick:* maybe.
- **Poise.** Chance to keep a wind-up when something would cancel it. *Sources:* 1 of 5 models. *Called:* Poise (A) (Opus). *Engine:* needs engine work. Immunity is all-or-nothing today; a chance needs a new building block. *Pick:* cut.
- **Resonance.** Its next spell of the same element hits harder. *Sources:* 1 of 5 models. *Engine:* builds today. *Pick:* cut. *Note:* "No player choice"
- **Spite.** When knocked out, damages every foe. *Sources:* 1 of 5 models. *Called:* Spite (B) (Opus). *Engine:* builds today. *Pick:* maybe. *Note:* "Very cool buildmaking"
- **Splash.** Part of each hit also lands on another foe. *Sources:* 1 of 5 models. *Called:* Splash (A, C) (Opus). *Engine:* builds today. Builds as reaction damage. *Pick:* maybe. *Note:* ""Other" is too generic right now for me"
- **Stealth.** Starts the fight untargetable. *Sources:* 1 of 5 models. *Called:* Stealth (A, B) (Opus). *Engine:* builds today. *Pick:* maybe.
- **Attack speed.** Faster basic attacks. *Sources:* the director only. *Director's list:* "Attack speed" *Engine:* already in the engine. Already a stat every unit has. *Pick:* keep.

### Elements

11 entries, most-proposed first.

- **Dark.** Curses, draining and the grave. *Sources:* 5 of 5 models and the director. *Called:* Dark (director, GPT, DeepSeek); Dark (A), Shadow (B, C) (Opus); Shadow (Gemini); Dark / Shadow (Grok). *Director's list:* "Dark (middle of the road regular damage aka dark magic is my basic attack, powerful but often resisted, esoteric effects)" *Pick:* keep. *Note:* "Curses and the grave are undefined meanings here"
- **Fire.** Big, hungry, all-out damage. *Sources:* 5 of 5 models and the director. *Director's list:* "Fire (ramping damage, burn DoT proportional to health)" *Pick:* keep. *Note:* "All-out damage is a bit vague no? Do they mean high mana cost?"
- **Ice.** Slow and steady; it stalls and grinds foes down. *Sources:* 5 of 5 models and the director. *Called:* Ice (director, GPT, Gemini, DeepSeek); Ice (A), Frost (B, C) (Opus); Ice / Frost (Grok). *Director's list:* "ice (consistent but reliable damage, the tempo debuff element, slows, weakens etc.)" *Pick:* keep.
- **Light.** Holy fire; heals, shields and sears the dead. *Sources:* 5 of 5 models and the director. *Called:* Holy (director, Gemini); Light (Opus, GPT, DeepSeek); Holy / Light (Grok). *Director's list:* "holy ( strong spells on non-offensive classes, healing, regen and revive, rarely resisted but not often used by offensive classes)" *Pick:* keep. *Note:* "I don't like this "the dead" thing we shouldn't worry about enemy themes here"
- **Lightning.** Sudden strikes that jump between foes. *Sources:* 5 of 5 models and the director. *Called:* Lightning (director, GPT, Gemini, DeepSeek); Lightning (A, B), Storm (C) (Opus); Lightning / Thunder (Grok). *Director's list:* "Lightning (AoE, shock which hurts fast units by damaging on action)" *Pick:* keep.
- **Earth.** Heavy and grinding: stone and mountains. *Sources:* 4 of 5 models and the director. *Called:* Earth (director, GPT, DeepSeek); Earth (A, B), Stone (C) (Opus); Earth / Stone (Grok). *Director's list:* "Earth (low damage in general with spiky high damage lower accuracy hits, associated with shields and poison)" *Engine:* needs engine work. Magical damage can't miss under the combat rules, so lower-accuracy Earth spells would need a change or another way to be spiky. *Pick:* keep. *Note:* "You're right, we shouldn't add spell missing here, maybe it needs a new gimmick"
- **Wind.** Light, quick cuts. *Sources:* 4 of 5 models and the director. *Called:* Wind (director, GPT, DeepSeek); Wind (A, B) (Opus); Wind / Air (Grok). *Director's list:* "wind (multi hit focus, associated with crit, evasion, and speed)" *Pick:* keep.
- **Water.** Tides and drowning, a crushing weight. *Sources:* 2 of 5 models. *Called:* Water (A) (Opus); Water (GPT). *Pick:* cut. *Note:* "This description is meaningless unfortunately"
- **Arcane.** Raw magic: almost nothing resists it, and nothing is weak to it. *Sources:* 1 of 5 models. *Called:* Aether (A), Arcane (C) (Opus). *Pick:* cut.
- **Nature.** Regenerative or toxic. *Sources:* 1 of 5 models. *Called:* Nature / Poison (Grok). *Pick:* cut.
- **Spirit.** Souls; the one thing that truly hurts ghosts. *Sources:* 1 of 5 models. *Called:* Spirit (C) (Opus). *Pick:* cut.
