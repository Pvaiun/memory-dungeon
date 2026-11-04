# Rules

The director's standing direction for the game. Direction is guidance, not law: challenge any of it with evidence. Until it's changed here, it stands. Keep this page to what holds now: when the director changes a rule, rewrite the line. Don't add history.

Where a rule and a design document disagree, this page wins and the document gets fixed.

## The game

- **No control during fights.** Preparation is the game: a team wins or loses as a team, not because a button was pressed at the right moment. More potion types, a rewind or test fight (the Hourglass) and more abilities per class are for later, at the director's word.
- **The rogue mode is the game** (`docs/core-set/rogue-mode.md`). Free play is the sandbox.
- **A few numerical systems:** mechanics map onto stats, statuses, damage types, flags and targeting. No bespoke words acting as locks. No battlefield geometry (no rows, no reach) and no positional targeting.
- **A class is a unit:** a party holds at most one of each, three to a party.
- **Bad choices are part of a roguelike.** Weak options (Raise, Valhalla) are rolled like any other.

## Combat

- **Two kinds of damage.** Physical meets Armor (the Path of Exile formula) and Evasion; magical meets Magic resist (a percentage) and is never dodged. A status's own damage (Burn, Shock, Bleed, Chill's shatter, Thorns) is untyped and never resisted. There are no elements and no physical subtypes as mechanics: an element is a theme only (names, art, a class's flavour).
- **Every amount states its own scaling,** and nothing scales by default. No stat is tied to a damage type.
- **A status scales by its stacks, never by its applier.** The applier sets only how many stacks it adds. A Burn stack is a Burn stack, whoever applied it, and a status's damage belongs to its holder (no lifesteal from it).
- **Statuses are universal:** nothing applies a status for less or more than its own length. The one exception is bosses' control resistance (Stun, Silence and Slow, Chill's stun included): hidden stacks shorten them and then make the boss immune, and the stacks fall over time.
- **MP costs are set by hand on each ability,** with no rule from a stat to a cost.
- **MP is fuel, drained by fighting.** No class regains MP in a fight by itself; regen comes only from gear and a formation seat. What differs between builds is whether they spend more HP or more MP, never how many fights they last.
- **Aggro by doubling:** a party member's draw doubles every 25 Aggro, so one unit built to draw fire takes most foes' picks (85–90% at full build).
- **A wind-up is always an ability's,** never a basic attack's.

## Builds, gear and formations

The philosophy behind these lines, and the director's intent in their words, are in `docs/gear-design/philosophy.md`.

- **A build is a way to play you can watch:** someone watching a fight can tell which build is playing and what it's waiting for. It has a rhythm, it's woven from several threads (never one keyword turned up), and builds spread across rhythms. The twelve builds in `docs/gear-design/builds.md` stand.
- **What a build asks is a range,** from what most runs find, giving back a little, to specific pieces giving back far more. It pays something before it's complete. It can be reached by more than one route, and pieces form a web, not bundles. There's room for exotics and chaos: a run finds its build in what it's given.
- **A good piece is worth a lot somewhere and little elsewhere.** A piece strong everywhere gives something up, designed for it. The best choices are between things good for different builds.
- **Gear has four slots** (weapon, armor, offhand, amulet), and slots have no job. Only weapons carry inherent behaviour (a speed, a damage type and hands). Every class has an offhand and a one-handed weapon. The amulet fits everyone. A mythic fits one class.
- **A card says what a piece does and who can wear it** (FITS), never what it's "for": signposting ruins discovery. Every effect is phrased so the player knows what will happen.
- **Rarity is mostly specificity:** how far a piece bends the game. Power grows by act but stays narrow. Rare and legendary pieces have no random affixes, and lower tiers carry effects too.
- **Plenty of loot:** better too much than not enough.
- **A formation is a shape with its own identity.** Seats can differ as much as the shape needs. It's chosen for what the party is, not the next foe (no lock-and-key fishing), and a new one should make you rethink your party. Formations come in common, rare and legendary; there are no mythic formations.
- **Upgrades:** each ability and passive has one plain power step and a choice of two versions, designed for that ability, with no formula across abilities. What matters is how the two differ, and either can change whom an ability aims at and when it fires, not only its numbers. A training opportunity offers three choices.

## Balance and testing

- **Balance from what happens in fights** (who does what share of what, the economy of a fight) before win rates. Win rates set difficulty, last. The rogue mode breaks ties.
- **Numbers, not behaviour.** Fix a problem by the amount applied, the cost, the cooldown or the duration, never by a new rule that changes what a thing does (a cap that binds on one hit, a target rule that leaves out the caster). A behaviour change that could read as esoteric goes to the director first.
- **Read fights, not only averages.** A tick-by-tick read of real fights (`src/rogue-feel.ts`, `docs/feel-reader.md`) finds what the balance sheet's averages hide.
- **Balance is its own pass.** While making content, make no balancing rules: synergies may be overpowered.
- **Test with hand-built parties** (`src/rogue-parties.ts`, `src/build-parties.ts`), not the simulated player.
- **The coming difficulty pass aims harder than today.**
- **Checks sized to the need:** run the tests, studies and reads needed to know something, and skip the rest.
