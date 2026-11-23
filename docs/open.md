# What's open

What's built and waiting on the director, and the questions nobody has settled. One line each: the detail is in the step's report or the document named. Keep it to what's open now: when something closes, delete its line (git has the history).

## The current step

- **The wheel** (`steps/the-wheel/`, `brief.md` first). The five colours that sort the web, on the frame in `docs/colours.md`, drawn from a complete list of plays the director marks. Next: the list.
- **Authored gaps** (`steps/authored-gaps/`, `brief.md` first). A new way to make loot: the agent holds the web and the director authors each gap. Four batches of effects are placed. It waits on the colours' pie, and resumes making loot into its holes. Nothing in the game has changed.

## Built, awaiting the director's read

Each step's `report.md` leads with the decisions it needs.

- **Survivability** (`steps/survivability/`): Weaken, Shock and Blur, and the kit changes that give the weak builds ways to live.
- **The balance pass** (`steps/balance-pass/`): built to its baseline, the build parties against chosen fights. Decision 4 is the regular fights' and elites' shape. Section 5, in discussion: why some parties' fights are free.
- **The whole-run tuning** (`steps/whole-run-tuning/`): the simulated player's win rate, the fights' cost targets and the bosses.
- **The card text pass and numbers as figures** (`docs/gear-design/loot.md`, Writing cards). Open: whether to cut cards further (the stat brackets and the formations' flavour lines are most of what's left). The last shove says basic attacks come 50% as often again, but speeds add, so beside Phalanx they come at 33% of the base rate, not 25%.

## Built, awaiting the director's playtest

- **The difficulty dials scale a hit before its boosts** (`docs/core-set/combat.md`, Damage): the knob and the enrage are their own step, so Weaken and Shock cut the same share at every knob. The knobs aren't retuned for it: the debuff builds are stronger in acts II and III than the bosses were tuned for.
- **Creative builds** (`steps/creative-builds/`): unique pieces and builds found, not picked. Nothing in it is balanced.
- **The foes in a fight's preview** (`docs/core-set/enemies.md`, The enemies).
- **Junk, and putting on from the bag** (`docs/core-set/rogue-mode.md`, The bag).
- **What the roster wears, on an offered piece's card** (`wearsLine` in `ui/src/rogue/parts.ts`).
- **Destiny Shards** (`docs/core-set/rogue-mode.md`, The end of a run).

## Open questions

- **A run that offers a way to a party that lives,** in place of every trio having to. Agreed in principle by the director; the rogue mode's to design (`steps/authored-gaps/report.md`, ruling 28).
- **More classes, later,** each authored the way the gear is, with a small kit (`steps/authored-gaps/report.md`, ruling 26).
- **Whether foes should have MP at all.** The director isn't sure.
- **Fractions of a stack stay hidden:** the icon shows whole stacks, so a rider under one stack shows nothing until the count turns over. Set aside: five times the stacks of Burn, Chill, Shock and Bleed, rounding by dice, and a fill on the icon (if the playtest asks for it).
- **A hidden result:** a panel for every event instead of only the results the player couldn't see, if the playtest misses one.
- **A seat's words:** the party screen ("no change") and a formation offer (its name only) don't show the line of a seat that has neither statuses nor stat changes.
- **Upgrades on the party screen's sheet:** only a class opened from the main menu's CLASSES list shows every upgrade.
- **What a card's words name:** a piece's card lists each status it names. Not yet: the same under ability, upgrade, formation and seat cards, and the words that aren't statuses (affliction, Double strike, Lifesteal, crit).
- **Balance's watch list** is in `docs/balance.md`, To watch.
