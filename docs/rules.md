# Rules

The director's standing direction for the game. Direction is guidance, not law: challenge any of it with evidence. Until it's changed here, it stands. Keep this page to what holds now: when the director changes a rule, rewrite the line. Don't add history.

Where a rule and a design document disagree, this page wins and the document gets fixed.

## The game

- **No control during fights.** Preparation is the game: a team wins or loses as a team, not because a button was pressed at the right moment. More potion types, a rewind or test fight (the Hourglass) and more abilities per class are for later, at the director's word.
- **The rogue mode is the game** (`docs/core-set/rogue-mode.md`). Free play is the sandbox.
- **A few numerical systems:** mechanics map onto stats, statuses, damage types, flags and targeting. No bespoke words acting as locks. No battlefield geometry (no rows, no reach) and no positional targeting.
- **A class is a unit:** a party holds at most one of each, three to a party.
- **A knockout keeps carrying:** the fallen don't stand up after a won fight.
- **A class has a trunk and three identities, and each identity is viable:** its versions split toward them, every identity has at least two, and no identity is the class. No two classes share a base ability, and a passive works in every fight.
- **Bad choices are part of a roguelike.** Weak options (Raise, a revive learned first) are rolled like any other.

## Combat

- **One kind of hit.** Every hit meets Evasion and Defense (the Path of Exile formula). A status's own damage (Burn, Shock, Bleed, Chill's shatter, Thorns) is untyped: Evasion and Defense never meet it, and it's the one way past them. There are no elements and no subtypes of hit as mechanics: an element is a theme only (names, art, a class's flavour).
- **Every amount states its own scaling,** and nothing scales by default. Attack is the one offensive stat, and anything can scale from any stat.
- **The three speed stats are stats like any other,** in class lines and on gear: Attack speed, Cooldown, Cast speed.
- **The Chill class doesn't Slow:** Slow is a player status like any other, but no Frostweaver ability applies it, and no ability triggers a shatter: Chill is its slow and detonates itself.
- **Nothing in the vocabulary is locked to one class.** A status, stat or effect that one class uses today can appear on other classes, on gear and on formations (Aegis and Hidden included). Where it's rare, it's enough that it's exotic. The tiers are Fundamental and Specialist, and enemy-only is a tier of its own (Doom, Bulwark): the party can't use it until the director says so.
- **A status runs its own course.** No ability spends, shortens or sets off a status early; a payoff reads the stacks and leaves them.
- **A foe's action can be called early,** as when a Taunt makes the foes swing at once. A status the action sets off is set off by its own trigger, not early.
- **A status's own behaviour carries no build's identity.** What a build wants from a status beyond its definition (fire that passes on when its foe falls, a shatter that leaves cold behind) comes from a class, a version, a piece or a formation, never from the status itself: every use of the status would take that identity on.
- **A status scales by its stacks, never by its applier.** The applier sets only how many stacks it adds. A Burn stack is a Burn stack, whoever applied it, and a status's damage belongs to its holder (no lifesteal from it).
- **Statuses are universal:** nothing applies a status for less or more than its own length. The one exception is bosses' control resistance (Stun, Silence and Slow, Chill's stun included): hidden stacks shorten them and then make the boss immune, and the stacks fall over time.
- **MP costs are set by hand on each ability,** with no rule from a stat to a cost.
- **MP is fuel, drained by fighting.** No class regains MP in a fight by itself; regen comes only from gear and a formation seat. What differs between builds is whether they spend more HP or more MP, never how many fights they last.
- **Aggro by doubling:** a party member's draw doubles every 25 Aggro, so one unit built to draw fire takes most foes' picks (85–90% at full build).
- **A wind-up is always an ability's,** never a basic attack's.

## Builds, gear and formations

The philosophy behind these lines, and the director's intent in their words, are in `docs/gear-design/philosophy.md`.

- **A build is a way to play you can watch:** someone watching a fight can tell which build is playing and what it's waiting for. It has a rhythm, it's woven from several threads (never one keyword turned up), and builds spread across rhythms. The nine builds in `docs/gear-design/builds.md` stand: roads, the doors between them, and the engines on them.
- **An engine is a found synergy,** designed in advance for a player to find: a few parts on one road or more that work together into something specific, so a build pays before it's whole and builds cross. Nothing in the game names one. Anything but a mythic takes two parts or more, and no engine rests on a number the player can't see.
- **A wall is not every build's start,** and neither is a front seat. Today a party without a wall loses far more of act I's regular fights than one with, at any knob; the director will fix that by other means than the knobs.
- **What survived in play isn't a rule for what a build must be.** If the game only lets some kinds of build live, the game changes, not the builds.
- **What a build asks is a range,** from what most runs find, giving back a little, to specific pieces giving back far more. It pays something before it's complete. It can be reached by more than one route, and pieces form a web, not bundles. There's room for exotics and chaos: a run finds its build in what it's given.
- **A good piece is worth a lot somewhere and little elsewhere.** A piece strong everywhere gives something up, designed for it. The best choices are between things good for different builds.
- **Gear has four slots** (weapon, armor, offhand, amulet), and slots have no job. Only weapons carry inherent behaviour (a speed, a swing and hands). Every class has an offhand and a one-handed weapon. The amulet fits everyone. A mythic fits one class.
- **Weapon and offhand kinds follow one set of rules:** at most three classes a kind, two kinds a class, two classes share at most one kind of a slot, and every wearer reads the kind's signature stat, so every piece of a kind is relevant to every class that can wear it. Armor types stay the four weight classes, and lean by weight: the heavier the armor, the less Attack and the more Defense and Thorns it carries, and Robes lean to MP regen. Accuracy is never a signature stat; Attack is never the signature of an Attack-heavy kind.
- **A weapon kind is its words:** how hard it swings per tick, how much of that is the wearer's Attack, and how many stats its pieces carry; a kind pays for its swing in stats or the other way round, a two-hander takes both sides, and a piece may step along the trade. The interface shows a weapon's damage per tick.
- **Every piece carries stats at every rarity,** each rarity carries more than the last on average, and higher rarity is generally better.
- **A card says what a piece does and who can wear it** (FITS), never what it's "for": signposting ruins discovery. Every effect is phrased so the player knows what will happen.
- **Rarity is mostly specificity:** how far a piece bends the game. Power grows by act but stays narrow. Rare and legendary pieces have no random affixes, and lower tiers carry effects too.
- **Plenty of loot:** better too much than not enough.
- **A formation is a shape with its own identity.** Seats can differ as much as the shape needs. It's chosen for what the party is, not the next foe (no lock-and-key fishing), and a new one should make you rethink your party. Formations come in common, rare and legendary; there are no mythic formations.
- **Upgrades:** each ability and passive has one plain power step and a choice of two versions, designed for that ability, with no formula across abilities. What matters is how the two differ, and either can change whom an ability aims at and when it fires, not only its numbers. A training opportunity offers three choices.
- **Alike cards:** an upgrade never copies a piece, and two pieces one unit could wear together never read the same (the same sentence). A piece and a formation seat may share a rule.
- **One Mark from gear:** a piece or a seat Marks only while no foe is Marked. Marked takes the party's basic attacks and its abilities aimed at a random foe.
- **A spell paid in life** costs half the share of max HP that it would cost of max MP.
- **Offers aren't aimed** by the designer's tags for the first playtest.
- **Nothing the player has to understand rests on a number they can't see,** such as a foe's MP: no engine and no version. A version that drains a foe's MP is a mana gain for its user, and the drain counts for nothing in a build.

## Balance and testing

- **Balance from what happens in fights** (who does what share of what, the economy of a fight) before win rates. Win rates set difficulty, last. The rogue mode breaks ties.
- **A class's stat line is a signpost** for what it does: a class keeps its extremes and its signature stats, and a stat never makes it read wrong (a Ranger with more HP than a Monk). Balance goes into the source of a strength or a weakness (its kit's amounts, its special stats) before its stat line.
- **Fights by cost.** A regular fight's and an elite's knob is set by what it costs a careful party (about a fifth of its HP, an elite a third), not by how often the simulated player dies in it: its losses between bosses come mostly from weak parties, and aiming them would make the fights free for everyone else. Whole runs set the bosses and even out the regions within an act.
- **Numbers, not behaviour.** Fix a problem by the amount applied, the cost, the cooldown or the duration, never by a new rule that changes what a thing does (a cap that binds on one hit, a target rule that leaves out the caster). A behaviour change that could read as esoteric goes to the director first.
- **Read fights, not only averages.** A tick-by-tick read of real fights (`tools/rogue-feel.ts`, `docs/feel-reader.md`) finds what the balance sheet's averages hide.
- **Balance is its own pass.** While making content, make no balancing rules: synergies may be overpowered.
- **Test with hand-built parties** (`tools/rogue-parties.ts`, `tools/build-parties.ts`), not the simulated player.
- **The coming difficulty pass aims harder than today.**
- **Checks sized to the need:** run the tests, studies and reads needed to know something, and skip the rest.
