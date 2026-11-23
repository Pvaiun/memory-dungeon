# Burst: notes

142 plays in `burst.json` (B-001 to B-142): 48 timing, 39 size, 38 width, 17 price. Four need a small block and two need a ruling.

## What was swept

I read `colours.md`, `vocabulary.md`, `combat.md`, `primitives.md` and `gear-rules.md`, and nothing else. I went through them one family at a time and asked the four style questions of each:

- **Statuses:** all 27.
- **Special stats:** all 10, plus the stats every unit has.
- **Effects:** all 6.
- **Effect ops:** all 19.
- **Cooldown changes:** every `which` and every `set`.
- **Status fields:** every one.
- **Events, conditions, scale sources and target rules:** all of them.
- **Weapons:** each kind's speed, hands, swing, scaling, budget and trade.
- **Formations:** seats, the party effect, and seat-relative targets and scales.
- **Rules in `combat.md`:**
  - the damage order;
  - the Defense formula;
  - how crits sit before Defense;
  - cooldowns carrying between fights;
  - lost casts;
  - what interrupts;
  - the enrage;
  - a foe's action being called early.

## Where it was thin or empty, and why

- **Statuses with no burst play:** Regen, Guard, Weaken, Slow, Silence, Hidden, Rot, Clarity and Owed.
  - Guard, Weaken and Shock appear only as things to strip or lift before a big hit.
  - Owed makes damage land later, as one lump at a set time. That's the opposite of burst.
- **Special stats:** Lifesteal and Siphon gave nothing, and neither did MP regen. They're sustain and fuel.
- **Ops with nothing:** `heal`, `mp`, `one`, `rewind`, `summon` and `replace`.
  - `one` lays a random status. That only makes a setup less reliable.
  - Heal shows up only through overheal converted to damage.
  - Revive shows up only through its `ready` field.
- **Status fields with nothing:**
  - `absorb`, `block`, `lockout`, `cover`, `floor`, `heals`, `soak`, `divert`, `party`, `sharesHeals`, `drawBy`, `revives`, `owe`/`debt`, `perSource` and `unremovable`.
  - `order` actively works against burst: random ability order breaks the slot order a burst depends on.
  - `divert` would only repeat what `pass` already does (moving a support's buffs to the hitter).
- **Conditions:** MP lines, `canHeal`, `lower`, `above`, `hasAny`, `belowCap`, and the gear ones (`weapon`, `offhand`, `armor`, `kin`).
  - The gear conditions gave nothing distinct. They only repeat the two-hander's price and the ally follow-up strike.
- **Events:** `action_start`, `hp_lost`, `hp_high`, `mp_gained`, `healed` and `revived` gave nothing distinct.
- **Price is the thinnest question.** The sources let burst cost only a few things:
  - MP;
  - waiting;
  - an HP price;
  - a stat trade (swap, a heavier swing, a seat's down side);
  - a gear slot (the two-hander);
  - its own HP held low;
  - making a foe faster.

  Nothing else exists to pay with.
- **Width on the party's side:** "the whole party at once" comes only from the party effect, `share`, the seat relay and ally follow-up strikes. No primitive makes every ally act together.

## Left out: they'd need a new system

- **A burst the player releases at a moment of their choosing:** input during a fight.
- **Cleave, rows or hitting foes next to the target:** battlefield geometry.
- **A party-wide charge meter spent on a finisher:** a new resource. A per-unit counter that caps is kept instead (B-025).
- **Elemental weakness spikes:** elements are themes only.
- **Banking MP or charge across fights for a later spike:** MP is fuel, and no play is about lasting more fights.
- **Summoned allies as extra burst:** summons enter with every action on cooldown, so they never make damage land sooner. Party-side summoning also has no rule (its cap reads `ruleset.maxEnemies`).
- **Status damage that crits from its applier's crit stats (`crit: fromSource`):** this breaks the bound "a status scales by its stacks, never by its applier", which can't be bent.

## Where the sources contradict themselves or leave a rule open

- **Can status damage crit?** `vocabulary.md` says status damage "can't crit". The `crit` status field in `primitives.md` turns crits on for pulses, as "a rare exception". B-140 relies on the field.
- **Spending stacks:** a vocabulary ruling says no ability spends a status early. Yet `spend` exists as an op. B-040 is kept, marked with that ruling.
- **Boosts on a status's tag:**
  - The vocabulary says damage boosts don't raise a status's damage; the applier sets only the stacks.
  - `primitives.md` lets boosts name a status (example: "+20% Burn damage"). Its tag field says boosts act "on its applications' stacks".
  - I read it as more stacks per application (B-033). The example's wording says damage.
- **Revive:** the vocabulary says a revived ally comes back with every action on full cooldown. The `revive` op has a `ready` field (B-141).
- **`remove`'s `move` field** is listed without a meaning (B-059, marked as needing it defined).
- **`replace`** makes a unit leave the fight. `combat.md` says "No unit leaves a fight alive". I listed no play on it: it deals no damage.
- **A foe's action called early:**
  - `combat.md` says a Taunt can make the foes swing at once.
  - The vocabulary's definition of Taunt doesn't say so.
  - Open: does every Taunt call the foes' swings early, or only an effect that says so? B-047 and B-091 lean on this.
- **Buffs laid on foes:** nothing forbids the party laying Haste on a foe (B-048 hastes a Shocked foe). Open whether that's intended.
- **Same-moment order:** the engine resolves the party's batch first, so a party kill on the same sub-tick beats a foe's action. `combat.md` lists this as open.
- **Defense floor:** "Every foe carries some Defense" sits against a debuff that sets a foe's Defense to nothing (B-089, which needs a block).
- **Bosses:** no rule protects them from `fell` (B-126, B-127) or `trade` (B-122). Balancing will likely want an immunity there.
- **Timing the enrage:** no condition reads the fight's elapsed time, so nothing can hold a hit for the enrage (B-133, which needs a block).
