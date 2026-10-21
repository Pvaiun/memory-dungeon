# Combat Design

*Updated Oct 20, 2026, after sign-off, to match the step 4 decisions in `DECISIONS.md`.*

---

## Part 1: Rules

### 1. Fight flow
- Fights are automatic. There is no in-fight input.
- Time advances in ticks. Durations are measured in ticks unless an effect states otherwise.
- The engine counts time in sub-ticks, 1,000 per tick, and does all timing math in whole numbers, dropping any fraction of a sub-tick. Players see timings in ticks, rounded for display.
- The upcoming action order is not shown.
- A unit is KO'd as soon as its HP reaches 0, and can be revived. A KO'd unit loses any action in progress, and anything it would have resolved later on the same sub-tick.
- When a unit is KO'd, its own statuses end, except those flagged to survive a KO (section 7.9). Statuses it applied to other units remain, except Per source statuses set to end with their source (section 7.8).
- The fight is won when every enemy is KO'd and lost when every party unit is KO'd. There is no time limit. The fight ends the moment either side is fully KO'd; nothing after that resolves.
- A fight nobody can win isn't designed for until one happens. The engine's safety stop (a loss at 5,000 ticks) is engineering, not a rule.

### 2. Timing
- Every action, basic attack or ability, has a cast time, a cooldown and a recovery:
  - **Cast time:** ticks from starting the action to its resolution.
  - **Cooldown:** ticks before the action can start again. It begins when the action resolves.
  - **Recovery:** ticks from resolution until the unit is ready again.
- A unit is busy during cast time and recovery. Otherwise it is ready.
- A unit in cast time is shown channeling the named action.
- Damage does not interrupt a cast. Only a KO or a lockout set to interrupt cancels one (sections 1 and 7.3).
- An action is available when it is off cooldown, affordable, its condition (if any) holds, and no lockout covers it (section 7.3).
- When a unit is ready, it starts the first available action: equipped abilities in slot order, then its basic attack.
- If no action is available, the unit waits until one is.
- At the start of a fight, every action is on cooldown, as if it had just resolved.

**Defaults**
- **Basic attacks** have no cast time. Their recovery is a fixed fraction of the weapon's base cooldown, which sets the weapon's Attack Speed ceiling.
- **Abilities** have a short cast time and a default recovery, about a sword's (the ruleset's ability recovery). Any ability can state its own.
- Any action can override these defaults.

**Timing stats**
- **Attack Speed** shortens the basic attack's cooldown, down to its recovery.
- **Cooldown Reduction** shortens ability cooldowns.
- **Cast Time Reduction** (special stat) shortens cast times.
- All three use the same formula: timing ÷ (1 + stat/100). 100 of any of them halves its timing. For Attack Speed and Cooldown Reduction, each point gives the same percent more actions.
- Below 0, the formula mirrors: timing × (1 + |stat|/100). −100 of any of them doubles its timing, as +100 halves it.
- A timing stat's **speed** is (1 + stat/100) at 0 or above, and 1 ÷ (1 + |stat|/100) below 0. Timing = base timing ÷ speed.
- When a timing stat changes, every running timer it affects is rescaled: remaining time × old speed ÷ new speed, dropping any fraction of a sub-tick. Basic attacks use the speed after the Attack Speed ceiling.
- No stat changes recovery, up or down.
- The unit sheet shows when Attack Speed has reached the weapon's ceiling.

**Same sub-tick order**
- Nothing is simultaneous. Everything that resolves on the same sub-tick (actions, their hits, pulses and reactions) resolves one item at a time, and each item reads the state left by everything before it.
- The party batch resolves first, then the enemy batch.
- Within a batch: pulses first, then reactions, then actions. Each group goes in slot order: the holder's slot for pulses, the acting unit's slot for reactions and actions. Remaining ties go to whichever was created first.
- A multi-hit action resolves its hits in order. Each hit reads the state left by the earlier hits. A hit and its riders read the same state. If the target is KO'd partway, the remaining hits are wasted.
- A unit KO'd earlier in the order loses anything it would have resolved later on the same sub-tick, and later items can't target it.
- Pulses join these batches by the status's label (section 7.5).

### 3. Actions
- A unit has a basic attack, a class passive and equipped abilities. Starting value: two equipped out of four.
- The equipped weapon sets the basic attack: its type, its subtype if physical, its element if magical, its hit count, its base cooldown, and its damage: a base plus whatever scaling the weapon states. The simplest weapon deals its base damage and scales from nothing; most state a scaling, usually Attack for physical weapons. A weapon's damage never affects abilities; a weapon reaches them only through the stats it grants. Classes restrict which weapons they can equip.
- Each ability has an MP cost, a cast time, a cooldown and its effects. Some abilities also state a recovery or a condition.
- Conditions are checked when an action starts. Targets are chosen, and MP is paid, when it resolves.
- If the unit cannot pay the MP cost at resolution, the action fails. A failed action has no effect, and its cooldown does not start.
- An action whose stated targeting finds nobody when it resolves fails the same way: no MP spent, no cooldown.

### 4. Stats
- **Core stats.** Every unit has HP, MP, MP regen, Attack, Magic, Armor, one Resistance per element, Attack Speed, Cooldown Reduction, Crit chance and Aggro.
- MP regen restores MP on a fixed tick interval, independent of actions, through a status the stat brings (section 7.1).
- **Special stats.** Engine stats with neutral defaults that only matter once something sets them. Examples: Evasion, Accuracy, Cast Time Reduction, Crit multiplier, Thorns, Lifesteal, Healing received. The full set is built during class design.
- **Immunity stats.** Binary special stats, one for each thing a unit can be immune to: a named status, an effect kind optionally narrowed by tag (such as all lockouts, or only lockouts that cover all actions), all debuffs, or all damage. Above 0 means immune. Innate immunity is part of a unit's base stats. Section 7.2 gives the rules.
- **Targeting override stats.** Forced and Forbidden are binary special stats: above 0 means the unit is forced or forbidden as a target (section 6).
- Any stat can be a scaling source. No stat is tied to a damage type.
- There are no stat families.
- HP and MP carry between the fights of a run. Recovery between fights belongs to step 11.

**Stat changes**
- Gear and statuses change stats the same way.
- Amount stats (HP, MP, MP regen, Attack, Magic, Armor, Thorns, Aggro) take flat or percent changes.
- Stats already counted in points or percent (Resistances, Attack Speed, Cooldown Reduction, Cast Time Reduction, Crit chance, Crit multiplier, Evasion, Accuracy, Lifesteal, Healing received, immunity stats, targeting override stats) take flat changes only.
- Final value = (base + all flat changes) × (1 + sum of percent changes/100), dropping fractions. Percent changes add together.
- Every stat can have a floor and a cap. Their values are balance. Aggro's floor must be above 0, since weighted picks fail when every candidate is at 0.
- When max HP rises, current HP rises by the same amount. When it falls, current HP is capped at the new max; this never KOs a unit. Max MP and MP work the same way.

### 5. Damage

**Instances**
- Every damage instance an action produces has one type, physical or magical, and states its own scaling.
- Every physical instance has exactly one subtype: slash, pierce or blunt. Physical instances have no element.
- Every magical instance has exactly one element.
- Subtypes have no Resistance lines.
- An action can produce several instances: multiple hits and riders. A **hit** is an instance an action produces directly.
- A rider is an extra instance attached to a hit. It occurs whenever its parent hit occurs. If the parent hit is evaded, so is the rider.
- A rider counts as part of its hit: hit events fire once per hit, riders included. Evasion and Armor still apply to a physical rider on its own.
- Pulses from statuses are damage instances but not hits. By convention they have no type (section 7.5).

**Scaling**
- Every amount states its own scaling: a hit, a rider, a heal, a shield, reaction damage and the stacks an application adds. Amount = base + Σ stat × ratio. Most scale from one stat; some from several (a Shield Bash from 0.7 × Armor + 0.3 × Attack); some from none (a flat amount).
- Nothing scales by default. A stat scales only what states it.
- No stat is tied to a damage type. Attack and Magic are ordinary stats. By convention, physical things scale from Attack and magical things from Magic, and a content editor can fill that in, but the ratio is always tuned per action. Breaking the convention is for things meant to feel special: a Shield Bash from Armor, a legendary axe from Speed, a passive that makes basic attacks scale from Magic.
- A status's Intensity total on the target can also be a scaling source, read when the action resolves (section 7.10).
- The stacks an action adds scale from whatever it states, and from nothing by default. Raising Magic makes a Fireball's hit stronger, not its Burn, unless the Fireball states that its Burn stacks scale from Magic.

**Boosts**
- Every instance from an action has tags: action kind (basic attack or ability), type (physical or magical), subtype (physical only) and element (magical only).
- A boost names one tag. One effect can carry several boosts. All boosts that match an instance add together and apply once.
- Boosts multiply what the scaling gives: a Fireball scaling from Magic, with +50% fire damage, deals 50% more.
- A unit's boosts never reach a status's pulses. A boost that names a status or one of its tags adds stacks to that unit's applications of it instead (section 7.5).

**Damage-taken modifiers**
- A target can carry damage-taken modifiers, usually from statuses. A modifier names one tag, as a boost does, or no tag to apply to all damage. Modifiers add together among themselves.
- A modifier reaches a pulse when it has no tag or names the pulse's element, its subtype, or a tag its status carries.
- They apply as a separate multiplier after boosts: amount × (1 + boosts/100) × (1 + damage-taken modifiers/100).
- Their total has a cap, like Evasion's.
- Invulnerability is immunity to damage (section 4), not a modifier.

**Resolution order**
1. Physical only: evasion check.
2. Amount: base + scaling.
3. Boosts.
4. Damage-taken modifiers.
5. Crit.
6. Mitigation: Armor for physical, the element's Resistance for magical.
7. Absorbs, such as shields.
8. HP.

**Mitigation**
- **Evasion** applies only to physical instances. Each hit rolls separately. Evasion is capped. An evaded hit shows MISS.
- **Accuracy** applies only to physical instances. It reduces the target's Evasion, down to zero. Every hit lands unless the target has Evasion left after Accuracy.
- Negative Accuracy adds to the target's Evasion, still under the Evasion cap.
- **Armor** applies only to physical instances. It is a flat reduction per hit, down to a minimum of 0. A fully absorbed hit shows BLOCKED.
- **Resistance** applies only to magical instances and to pulses that carry an element. It is a percentage per element, from below zero up to full:
  - Negative Resistance shows WEAK.
  - Positive Resistance shows RESIST.
  - Full Resistance negates the damage and shows IMMUNE.
- General Resistance sources add to every element; specific sources add to one. The sheet shows one total per element.
- Enemies use the same stats and rules. The one exception is that the party resolves first on a shared sub-tick (section 2).

**Healing and crits**
- Heals have no type and are never mitigated. They state their own scaling, like damage, and take healing boosts.
- The target's Healing received applies to heals as a separate multiplier, the way damage-taken modifiers apply to damage.
- Crit applies to damage and healing from actions. Pulses don't crit unless their status turns crits on (section 7.5).

**Absorbs and shields**
- Step 7 of the resolution order reads **absorb** effects, which statuses carry. An absorb soaks up damage after mitigation and before HP, losing one stack per point it soaks. It soaks pulses too.
- If a unit has several absorbs, they soak in the order they were first applied.
- A shield is an ordinary Intensity status with an absorb (section 7.7). Stacks from every source add into one total, and its cap and decay are Intensity options.
- Shields are not healing. They take no healing boosts and no Healing received, and they don't crit by default. Boosts that name the shield status add stacks to its applications.
- Damage an absorb soaks counts as damage dealt and damage taken for events. It does not count as HP lost.

### 6. Targeting
- **Default targeting:** an offensive action without its own targeting rule picks a random valid foe, weighted by Aggro. Basic attacks and most abilities use it.
- An action aimed at allies without its own targeting rule picks a random valid ally. That can be the unit itself, so a healer can heal itself.
- An ability can state its own targeting rule instead. Ties in a stated rule are broken at random.
- Only explicit effects change Aggro. Damage dealt never changes it.
- Effects can raise or lower Aggro, or override it by forcing or forbidding a unit as a target. Forced and Forbidden are binary stats (section 4), so default targeting reads only stats.
  - Overrides apply to default-targeted offensive actions.
  - An action can state that it ignores overrides.
  - Actions with their own targeting rule follow that rule.
- When overrides force several targets, or forbid all of them, the pick is weighted by Aggro among the tied units.
- Targets are not shown before an action resolves.

### 7. Statuses

#### 7.1 What a status is
- A status is a named effect on one unit, its **holder**. The unit that applies it is its **source**. A status with one applier at a time knows its source; a shared Intensity total doesn't (section 7.6).
- Instant effects, such as damage, heals and interrupts, are not statuses.
- A status bundles one or more effects. They share one duration, one stacking mode and one removal.
- A status can contain only these kinds of effect:
  - stat changes, including Aggro, immunity stats and targeting override stats (section 4);
  - boosts, damage-taken modifiers and absorbs (section 5);
  - lockouts (7.3);
  - action changes (7.4);
  - repeating effects (7.5);
  - reactions (section 8).
- Every status is labeled buff or debuff in its data. The label drives removal (7.9), conditions (7.10) and the batch its pulses resolve in (7.5).
- A status can be permanent: it lasts until the fight ends.
- Aggro and the targeting override stats change like any stat. A taunt is a status on the taunting unit that sets Forced; stealth is one that sets Forbidden. Base Aggro from class and gear is a stat.
- Class passives are not statuses. A passive's stat grants are stats, like gear. Its reactions live in permanent, unremovable statuses it applies at fight start.

**Where statuses come from**
- The engine core is as small as possible: time and batches, action timing and selection, hit resolution, targeting, and the status system itself. Hit resolution and targeting read stats. Everything else that happens, on an event or a timer, is a status.
- All statuses are the same kind of thing. Units get them from their passive, their gear, their stats, actions and other statuses. How each one is shown is a separate question (section 10).
- Stats are numbers. A stat that needs behavior beyond hit resolution, targeting and timing names a status that provides it, and a unit holds that status while the stat is above 0. It therefore also arrives mid-fight when a buff raises the stat from 0.
- MP regen works this way: the status it brings restores MP on a fixed interval.

**Numbers**
- A status's numbers use the usual formula, and come from its definition: nothing about whoever applied it changes them.
- They read the holder's stats each time the number is used: each pulse, each hit. Example: "deals 5% of the holder's remaining HP per pulse".
- A status that knows its source can also read the source's stats, once, at application. Starting content won't.
- Exception: a stat change that scales from the holder's stats is computed once, at application, so stats can't feed into each other.

#### 7.2 Applying statuses
- An apply-status effect can appear anywhere an effect can: in an action, attached to a hit, in a reaction, or in a repeating effect. Passives apply theirs at fight start.
- A status attached to a hit follows the rider rules. It applies whenever the hit occurs, even if the hit deals no damage (BLOCKED). If the hit is evaded, nothing applies.
- Application is guaranteed by default. An apply effect can state a chance, rolled on the applier's random stream.
- A status takes effect as soon as the item that applies it resolves. Everything later in the order sees it, including later hits of the same multi-hit action (section 2).
- Statuses can't be applied to KO'd units.
- Default targeting doesn't skip units that already have, or are immune to, the status being applied. An ability that cares states its own targeting rule or condition (7.10).

**Immunity**
- If a status contains anything the unit is immune to, the whole status is blocked and the unit shows IMMUNE. Immunity to all damage therefore blocks damage-over-time statuses, whose pulses damage their holder.
- Immunity is a stat (section 4). Innate immunity is part of a unit's base stats. A status grants immunity with an ordinary stat change.

**Elements on statuses**
- A status can carry an element. Its damage pulses meet that element's Resistance (7.5).
- Full Resistance to a status's element makes the unit immune to the whole status (IMMUNE).
- Partial Resistance doesn't change a status's duration.

#### 7.3 Lockouts
- The engine has no named control effects. Stun, silence, disarm and interrupt are content built from one building block, the lockout.
- A lockout makes some of the holder's actions unavailable (section 2), chosen by tag: all actions, basic attacks, abilities, or something narrower, such as one element.
- Cooldowns, recovery and MP regen keep running during a lockout.
- A lockout can be set to interrupt. If it is, and the holder is casting an action the lockout covers, the cast is canceled as if the unit were KO'd mid-cast: the action is lost, no MP is spent and its cooldown doesn't start. Without interrupt, the cast finishes first.
- An instant lockout (duration 0) only interrupts and leaves no status. The holder is ready at once and may restart the same action.
- A lockout applied in the party batch interrupts an enemy cast due to resolve in the enemy batch of the same sub-tick.
- A lockout applies if any status on the unit carries it.
- Lockouts don't stop reactions (section 8).
- Lockouts work on bosses unless an immunity stat blocks them: for all lockouts, for lockouts with a given tag (such as those covering all actions), or for a named status.

| Effect | Covers | Interrupts | Duration |
| --- | --- | --- | --- |
| Stun | All actions | Yes | Yes |
| Silence | Abilities | Yes | Yes |
| Disarm | Basic attacks | Yes | Yes |
| Interrupt | All actions | Yes | 0: instant, leaves no status |

#### 7.4 Action changes
- A status can add a rider to some of the holder's actions, chosen by tag: basic attack, ability, physical, magical, a subtype or an element. Rider rules apply as written (section 5).
- That rider is part of the holder's action: it scales from the holder's stats and gets the holder's boosts. A status that knows its source can instead name the source's stat, which is then fixed at application.
- A status can change a magical instance's element or a physical instance's subtype. It never changes an instance's type.
- A status changes the cost or timing of actions only through stats.
- A status can't grant or replace actions, and can't change how its holder picks targets (Part 3).

#### 7.5 Repeating effects
- A status can repeat any instant effect. Each repeat is a **pulse**. Examples: damage, healing, MP changes, adding shield stacks, or applying another status.
- A pulse affects the holder unless the effect states a targeting rule, which it then follows the way an action would.
- Pulses happen every interval after the status is applied. Each status states its interval in ticks. The first pulse comes one interval after application.
- A pulse that lands on the status's last sub-tick still happens (7.8): duration 10 with interval 2 gives 5 pulses.
- Reapplying a status changes its end time, not its pulse rhythm.

**Damage pulses**
- A pulse is not a hit. By convention it is untyped and unresisted: neither physical nor magical, so it never meets Evasion or Armor, and with no element. Its strength comes from the status's own numbers and its stack count.
- The engine also allows a typed pulse, or one with an element, which then meets that element's Resistance. Starting content won't use either.
- A pulse can carry a subtype. A pulse's subtype is used only for damage-taken modifiers.
- Damage-taken modifiers apply to pulses by the matching rule in section 5. Absorbs soak pulses as usual.

**Boosts and statuses**
- No unit's boosts reach a pulse, so there is no generic over-time boost.
- A boost that names a status or one of its tags ("+20% Burn") adds stacks to every application its unit makes of that status. Boosts by element or type don't: Burn isn't a property of fire damage. Starting content won't use these boosts.

**Whose stats**
- Everything the applier contributes is fixed at application. For Intensity (7.7), the application's stated scaling and the applier's boosts that name the status set how many stacks it adds. Each stack's effect is fixed by the status, and a stack is a stack, whoever applied it.
- A status without stacks has the same strength from every applier. To let an applier scale one, make it Intensity.
- The holder's side is read at each pulse: its stats (including Healing received), its Resistance and its damage-taken modifiers.

**Crits**
- Pulses don't crit by default. A status can turn crits on, as a rare exception.
- When on, the crit chance and multiplier come from the status data and roll on the holder's random stream. A status that knows its source can use its source's crit stats and stream instead.

**Batch**
- A debuff's pulse resolves in the batch of the holder's foes. A buff's pulse resolves in the batch of the holder's own side.
- This holds even after the unit that applied the status is KO'd.

**What pulses don't do**
- Pulses don't trigger on-hit events, since those need hits. They do trigger other events, such as taking damage (7.11).
- A pulse's damage belongs to the holder, not the applier: it doesn't count as the applier's damage dealt, so lifesteal-style effects don't work from it. Only Per source statuses credit their pulses to their source.

#### 7.6 Stacking
- A unit holds at most one copy of each status, whoever applied it. The only exception is the Per source mode.
- Two different statuses never stack with each other, even if their effects match. Their effects add up: two different slows both apply.
- Opposite stat changes add up and may cancel: Haste and Slow can net to zero.
- Statuses never block, replace or consume each other by built-in rule. Content does it with conditions and reactions: "when this unit gains Burn, remove Freeze".
- Each status picks one stacking mode:

| Mode | On reapplication | When it ends |
| --- | --- | --- |
| Refresh | The new application replaces the old: its duration, its numbers and its source | Its duration runs out |
| Fizzle | Nothing: the new application fails while the status is present | Its duration runs out |
| Intensity | The new stacks add to the total (7.7); if the status has a duration, it resets to the new application's full duration | Its total falls below 1 stack |
| Per source | Each source keeps its own copy, using one of the modes above | Per copy; can end with its source (7.8) |

- A refresh never adds durations together.
- **Sources.** A status with one applier at a time knows its source: a Refresh status (its latest applier), a Fizzle status, and each Per source copy. A shared Intensity total has no single source. A status that knows its source can read its source's stats at application (7.1), use its source's crit stats (7.5), or have a reaction where the source acts (section 8). Only Per source statuses can end with their source (7.8). Examples: a single-target taunt, a curse that says "if I die, you die", an aura.
- One action applying a status several times counts each application, in hit order. Three hits applying an Intensity status add three sets of stacks; three hits applying a Refresh status refresh it three times.
- An Intensity total can have a cap. There's no limit on how many different statuses a unit holds.

#### 7.7 Intensity
- Stacks from every applier add into one total. The total is what's displayed and what sets the effect.
- An application adds stacks. How many comes from the application's stated scaling and the applier's boosts that name the status, at application (7.5). With no stated scaling, it adds a flat number (default 1).
- Each stack has a fixed effect set by the status. Ongoing effects, such as a damage-taken modifier, scale with the total at all times.
- A status can have a trigger: its pulse interval (7.5) or an event (7.11), such as the holder being hit or basic attacking. On each trigger, the status's triggered effects fire for the current total, then the total drops by a stated fraction (such as half, or all) or a stated count (such as one).
- For an event trigger, the drop happens immediately, before anything later in the order, including the next hit of a multi-hit action. The trigger's effects use the total from the moment it triggered, and resolve as a reaction on the next sub-tick (section 8).
- A status with no trigger keeps its stacks until it's removed or its duration ends. Stacks beyond its cap are lost.
- Stacks are counted in thousandths, like sub-ticks, dropping fractions. The display rounds. The status ends when its total falls below 1 stack, and never exists below 1 stack.
- Charges are Intensity stacks that drop by one per trigger.

#### 7.8 Duration
- A duration is a number of ticks or permanent (until the fight ends). Only an instant lockout has duration 0 (7.3).
- Durations are in ticks, counted in sub-ticks like all timing, dropping fractions. They run on fight time; nothing pauses them.
- A status starts as soon as the item that applies it resolves. It ends at the end of its last sub-tick, after everything on that sub-tick has resolved. A status lasting 10 ticks affects everything that resolves up to and including its 10th tick.
- By default a status outlives its source.
- A Per source status can be set to end when its source is KO'd. Auras use this: an aura is a Per source status that ends when its giver is KO'd. It can be permanent or have a duration.

#### 7.9 Removal
- A status ends when its duration runs out, its Intensity total falls below 1 stack, an effect removes it, its holder is KO'd, its source is KO'd (Per source statuses set to end with their source), or the fight ends.
- A removal effect states what it removes: debuffs or buffs, optionally narrowed to a named status or an effect kind (such as lockouts), and how many (default all). When it removes fewer than all, it removes the newest first.
- A status can be flagged unremovable. Boss mechanics, class drawbacks and passives' statuses use this.
- When a unit is KO'd, its statuses end, except those flagged to survive a KO. A revived unit keeps only those.
- Statuses a KO'd unit applied to others stay and keep pulsing with their fixed numbers, except Per source statuses set to end with it.
- Every status ends when the fight ends. Anything that lasts between fights belongs to step 11 and is applied at the next fight's start.
- A max HP increase that ends with the fight caps current HP (section 4), and that HP carries over.

#### 7.10 Conditions and targeting
- Conditions and targeting rules can read statuses: whether a unit has a named status, any buff, any debuff or an effect kind optionally narrowed by tag (such as a lockout covering all actions), and its Intensity total.
- Examples: "an ally has a lockout covering all actions", "a foe without Burn", "the ally with the most debuffs".
- A status's Intensity total can be a scaling source, read when the action resolves: "deal 10 per Burn stack, then remove Burn".

#### 7.11 Events
- Statuses react to events (section 8) and use them as triggers (7.7). The starting list, extended as content needs it:
  - Fight start.
  - An action starts, resolves or is interrupted, by kind (basic attack or ability).
  - A hit lands, is taken, is evaded or misses.
  - Damage is dealt or taken, HP is lost, healing is received.
  - A status is gained, triggers or ends.
  - A unit is KO'd.
- Each event says whose it is, so a status can listen to its holder, the holder's allies or its foes.
- A status ending is one event that carries its cause: expired, stacks ran out, removed, holder KO'd or fight ended. Content listens to every cause or picks some.

### 8. Reactions
- Reactions live in statuses. Passives and abilities react to events through the statuses they apply.
- A reaction responds to an event from the list in section 7.11 and can perform any instant effect.
- A status's reactions to its own ending still resolve after it ends.
- A reaction that deals damage defines that damage itself: typed like a hit, meeting Evasion and Armor, or untyped like a pulse (section 7.5).
- Like any amount, a reaction's damage or healing states its own scaling, from the acting unit's stats: Thorns damage from Thorns, a Riposte from Speed or Attack, or a flat heal.
- Reaction damage is never a hit: it fires no hit events and never crits. Two Thorns units can't bounce damage back and forth forever.
- A reaction resolves on the sub-tick after the event that triggered it, never on the same sub-tick.
- A reaction states who acts: the holder, or, for a status that knows its source, the source. The acting unit's side sets the batch.
- Reactions aren't actions. Lockouts don't stop them. A reaction can opt out if content needs it.
- A status can react to its holder's own actions. "Take 10 damage when basic attacking" is a status with a reaction to its holder's basic attacks.

### 9. Content
- All content is data built from stats, statuses, reactions and targeting. New building blocks are added as content needs them.
- Behavior is never added to the engine core when a status can do it. If something happens on an event or a timer, it's a status (section 7.1).

### 10. Information and chance
- Every unit, party and enemy, shows a small HP bar. The unit's shield total shows on it as one value.
- Players will see far fewer statuses than the engine runs: most statuses are machinery, such as statuses that stats bring and passives' reactions. The game therefore needs a display pipeline in which statuses don't all follow the same display rules.
- Every status declares its presentation in its data. Presentations include:
  - **On-screen:** an icon on the unit's HP bar, with its Intensity total. Poison is an example.
  - **Sheet effect:** listed only on the unit sheet. Most passives' reactions use this.
  - **Stat line:** shown as a stat on the unit sheet. Statuses that stats bring use this.
- Shields need their own visual treatment as part of the HP bar, not a stack count.
- The full set of presentations, and which kinds of status get which, belong to the display work. The engine only needs every status to carry its presentation from the start.
- The unit sheet lists the unit's effects with their durations and numbers, as their presentations allow. Innate immunities show there too.
- A unit under a lockout shows it through the icon of the status carrying it. An interrupt leaves no status, so it needs its own brief marker.
- IMMUNE shows when a status is blocked. Nothing shows when a chance roll fails or a Fizzle status fails to reapply. Pulses show their numbers like hits do.
- Default targeting, evasion, crits and status application chances are random. Pulse crits are random only where a status turns them on. Each unit has its own random stream: party units by class, enemies by slot. The same seed brings the same luck to the same unit, whatever else is in the fight.

---

## Part 2: Examples and edge cases

Numbers are illustrative only.

**Ability cards**
- Shield Bash · Physical · Blunt · scales with Armor. Valid.
- Fire Bolt · Magical · Fire · scales with Magic. Valid.
- Storm Ward · Magical · Lightning · scales with Armor. Valid: no stat is tied to a damage type.
- Fire Slash · Physical · Fire. Invalid: physical instances have no element.
- Strike · Physical · no subtype. Invalid: every physical instance has a subtype.
- Ember Strike · Magical · Fire · scales with Attack. Valid, though it breaks the convention, so save it for something meant to feel special.
- Shield Bash · Physical · Blunt · scales with 0.7 × Armor + 0.3 × Attack. Valid.
- Bolt · Magical · no element. Invalid: every magical instance has an element.

**Weapons**
- A unit swaps a sword for a fire staff. Its basic attack changes from physical slash, one hit, short cooldown, to magical fire with a longer cooldown.
- The same staff, scaling from Magic, hits weakly on a unit with low Magic. Scaling decides how well a weapon works on a unit.
- A bare-bones sword deals its base damage on every basic attack and scales from nothing.
- Two swords with the same damage, scaling and cooldown: one grants +Attack and +Armor, the other +Crit and +Speed. Only the first makes the unit's Attack-scaling abilities hit harder. Neither sword's own damage touches the abilities.
- A sword scaling from Magic is valid, and its designer picks whether it deals physical or magical damage.

**Riders**
- A flame sword: a physical slash hit scaling from Attack, plus a fire rider scaling from Magic.
  - The target evades: MISS, and no fire.
  - Armor absorbs the whole hit: BLOCKED. The fire rider still lands and meets fire Resistance.
- A storm staff: a magical lightning hit with a physical pierce rider. The lightning hit cannot be evaded, so the rider always occurs. As a physical instance, the rider then meets the target's Evasion and Armor.

**Hit count against Armor and Evasion**
- Against Armor 8: one hit of 30 deals 22. Three hits of 10 deal 2 each, 6 in total.
- Against 50% Evasion: the single hit deals all or nothing. The three hits roll separately and usually land one or two.

**Accuracy**
- A target has 30% Evasion. An attacker with 20 Accuracy misses 10% of the time. An attacker with 30 or more never misses it.
- Blind: an attacker with Accuracy −30 misses 30% of the time against a target with no Evasion.

**Resistance lines**
- A unit has general Resistance +10 and fire gear +20: Fire 30 (RESIST), Ice 10, Lightning 10.
- An enemy at Ice −25 takes extra ice damage and shows WEAK.
- An enemy at full Fire Resistance takes no fire damage and shows IMMUNE.

**Timing**
- Basic-attack recovery is 25% of base cooldown. A dagger with cooldown 8 has recovery 2; an axe with cooldown 20 has recovery 5. Attack Speed can bring either to at most 4× its base rate.
- Attack Speed 100 halves a cooldown: the dagger's 8 becomes 4. Attack Speed 300 would make it 2, its ceiling. Further points do nothing.
- Attack Speed 50 makes the dagger's cooldown 5,333 sub-ticks. The sheet shows it rounded, for example 5.3.
- A unit with a dagger (cooldown 8) and Fire (cooldown 40) first swings at tick 8. Fire becomes available at tick 40.
- Fire has cast time 5 and cooldown 40, so it comes up every 45 ticks. Cast Time Reduction that cuts the cast to 3 makes it every 43, and frees 2 ticks per cast for basic attacks.
- A mage holding an axe casts Fire as soon as it is off cooldown, unless it is in the axe's recovery. It waits at most one recovery.
- Cast Time Reduction 100 cuts Meteor's cast time from 30 to 15 and Fire's from 5 to 2.5. It matters most for long casts.
- Meteor has cast time 30. If the basic attack comes off cooldown mid-cast, it waits until Meteor resolves.
- A unit KO'd mid-cast loses the action. Its cooldown has not started and no MP is spent.
- A unit with many short-cooldown abilities spends more of its time casting. Stacking Attack Speed and Cooldown Reduction eventually leaves it busy all the time, and further points do nothing.
- Conditions are checked when an action starts and targets are chosen when it resolves. Since most abilities have a cast time, cases like Cure changing target mid-cast are routine.
- Slow: Attack Speed −100 doubles the dagger's cooldown from 8 to 16. Its recovery stays 2.
- Haste mid-cooldown: an axe is 10 ticks into its 20-tick cooldown when Haste gives Attack Speed +100. The remaining 10 ticks become 5.

**Same sub-tick order**
- The Knight and an Ogre land lethal hits on each other on the same sub-tick. The party batch resolves first: the Ogre is KO'd and loses its action, and the Knight survives. If the Ogre was the last enemy, the fight is won.
- A party unit at 10 HP takes 15 from an enemy and a 10 heal from an ally on the same sub-tick. The heal applies in the party batch, the damage in the enemy batch, and the unit ends at 5.
- An enemy at 10 HP takes 15 from the party while an enemy healer heals it on the same sub-tick. The party batch KOs it, so the heal goes to another valid ally.
- Two party units hit the same enemy on the same sub-tick. The one in the earlier slot resolves first. If its hit is lethal, the second picks a new target when it resolves.
- A Cleric's buff and the Rogue's attack resolve on the same sub-tick. If the Cleric's slot comes first, the attack gets the buff; otherwise it doesn't.
- A hit triggers a reaction that deals damage back. That damage resolves on the next sub-tick.
- A dagger's three hits each add 1 stack of an Intensity Armor break (−2 Armor per stack) to a target with Armor 8. The hits resolve in order: hit 1 meets Armor 8, hit 2 meets Armor 6, hit 3 meets Armor 4.
- Two enemies hit a unit with 1 Aegis charge on the same sub-tick. The first hit is blocked and spends the charge; the second lands.

**Cast time, targets and MP**
- An enemy channels Smash, which uses default targeting. During the cast, the Knight applies an effect that forces targeting onto itself. Smash resolves on the Knight.
- If Smash stated that it ignores overrides, it would pick by Aggro among all valid targets.
- If the channeling enemy is KO'd during the cast, Smash never resolves and no MP is spent.
- If the enemy's MP drops below Smash's cost during the cast, Smash fails at resolution. Its cooldown does not start.

**Condition versus target**
- Cure: condition "an ally is below half HP"; targets the lowest-HP ally.
- It starts while the Knight is at 40%. During the cast, another unit heals the Knight. At resolution the mage is the lowest-HP ally, so Cure heals the mage.

**Aggro**
- Party Aggro: Knight 4, Mage 1, Rogue 2, Cleric 2. The Knight takes 4/9 of default-targeted offensive actions.
- The Mage is forbidden as a target: the total becomes 8, and the Knight takes 4/8.
- The Knight and a Paladin (Aggro 2) are both forced: the Knight takes 4/6 and the Paladin 2/6.
- Every party unit is forbidden: all four are tied, and the pick uses everyone's Aggro.

**Boosts**
- Fire Bolt with +20% fire damage and +10% ability damage gets +30%, applied once.
- An amulet reading "+10% fire damage, +10% ability damage" carries two boosts.
- A +physical damage boost does not apply to Fire Bolt.
- A +blunt damage boost applies to Shield Bash, but not to a sword's slash basic attack.

**Damage-taken modifiers**
- Fire Bolt with +30% boosts hits a target with Vulnerable (+20% damage taken): amount × 1.3 × 1.2.
- A target with −30% damage taken always takes 30% less, whatever the attacker's boosts.

**Special stats**
- A passive reading "Crits deal triple damage" sets that unit's Crit multiplier.
- A thorns tank's ability can scale from its Thorns.
- Most units have no Evasion. Against them, every physical hit lands.

**Stat changes**
- A unit with base Attack 50, gear +10 Attack and a status giving +20% Attack has (50 + 10) × 1.2 = 72 Attack.
- "+20 Crit chance" is a valid flat change. "+20% Crit chance" is not allowed.
- A status raising max HP by 100 also raises current HP by 100. When it ends, current HP is capped at the new max.

**Out of MP**
- An ability the unit can't afford is skipped, as if it were on cooldown. With every ability skipped, the unit only uses its basic attack.

**Lockouts**
- Stun is a lockout on all actions that interrupts. A mage stunned 3 ticks into Meteor's 30-tick cast loses Meteor: no MP is spent and its cooldown doesn't start. Its other cooldowns keep running during the stun.
- Silence is a lockout on abilities that interrupts. A silenced unit basic-attacks. A unit both silenced and disarmed waits.
- Interrupt is an instant lockout. The interrupted unit is ready at once and may restart the same cast.
- A lockout without interrupt lets the current cast finish, then blocks what it covers.
- A party stun lands in the party batch on the sub-tick an enemy's Smash would resolve in the enemy batch. Smash is interrupted.
- A stunned unit's reactions still fire.

**Pulses**
- Burn: an Intensity status triggering every 2 ticks for 1 untyped damage per stack, then halving. 10 stacks deal 10 damage on the first pulse; the total then drops to 5. Burn given the fire element would also meet fire Resistance; starting content won't do that.
- At half per trigger, each Burn stack is worth about 2 pulses of damage, whether the total is 3 or 300.
- Two Mages each apply 6 Burn stacks to the same enemy. The enemy has one Burn with a total of 12.
- Bleed: repeating damage with no element. Its 5-damage pulses get through Armor 8 and can't be evaded. Only damage-taken modifiers and absorbs reduce them.
- No boost touches a Poison's pulses. "+20% Burn" makes each of its unit's Burn applications add 20% more stacks; "+20% fire damage" doesn't.
- A Mage gains Magic. Its Fireball hits harder, but its Burn is unchanged. A Fireball that states "Burn stacks scale from Magic" adds more Burn stacks; a Shield Slam could add Burn stacks scaling from Armor. Its damage could scale from Speed while its Burn stacks scale from Magic.
- Regen as an Intensity status: every 5 ticks, the holder heals 4 per stack, with no drop. A heal that scales from Magic and also applies Regen stacks that scale from Armor is valid.
- A Burn at 1 stack halves to 0.5 and ends; it doesn't keep pulsing for 0.
- A party Mage's Burn on an enemy pulses in the party batch, even after the Mage is KO'd.
- A reaction to being hit doesn't answer Burn pulses.
- A unit immune to all damage is immune to Burn.
- A Regen with interval 3 is applied at tick 0 and reapplied at tick 7. Its next pulse still comes at tick 9.
- A Slowing field: a status whose pulse applies Slow to a random foe every 3 ticks.

**Stacking**
- Chilled is a Refresh status: −20 Attack Speed for 50 ticks. Reapplied by anyone, it replaces the old one: −20, for 50 ticks from now.
- Fatigue is an Intensity status: −1 Attack Speed per stack, for 50 ticks. An application whose stacks scale from a stat adds more of them.
- A Fizzle status reapplied while present fails, with no pop-up.
- Two different statuses that both lower Attack Speed both apply. Haste +50 and Slow −50 net to 0.

**Intensity triggers**

| Status | Trigger | On each trigger | Then the total |
| --- | --- | --- | --- |
| Burn | Every 2 ticks | 1 fire damage per stack | Halves |
| Shock | Holder basic attacks | Damage to the holder per stack | Halves |
| Mark for execute | Holder is hit | Nothing; the mark is a damage-taken modifier scaled by stacks | Goes to 0 |
| Aegis | Holder is hit | Nothing; any stacks give immunity to damage | Drops by one |

- Aegis with 2 stacks blocks the next 2 hits, whether they come from one multi-hit action or from different attackers. Charges are stacks that drop by one.
- Empower next attack: a boost scaled by stacks, cleared when the holder next attacks.
- Sleep: a stun whose stacks go to 0 when the holder takes damage.
- A Mark for execute on a target struck by a three-hit attack applies only to the first hit; the mark is gone before the second.
- Detonate: "deal 10 per Burn stack, then remove Burn" against a target with 12 stacks deals 120.

**Immunity and elements**
- A boss with innate immunity to lockouts covering all actions is hit by Freeze (an all-action lockout + Fire Resistance −20). The whole Freeze is blocked and shows IMMUNE. To land the Fire Resistance shred anyway, content makes it a separate status. The same boss can still be silenced.
- A unit with full Ice Resistance is immune to Freeze, since Freeze carries the ice element.
- Invulnerable: a status that sets the immunity stat for all damage.

**Shields**
- A Barrier adds 40 shield stacks to a unit that has 20. Its shield total is 60, shown as one value.
- Damage hits the shield after mitigation and before HP, losing one stack per point soaked.
- Anti-heal (Healing received −50) halves heals but doesn't touch shields.
- If the shield's cap is set to max HP, a unit with 100 max HP holds at most 100 shield.
- A dispel that removes buffs can strip a shield, unless the shield status is flagged unremovable.

**Sources and auras**
- Two Paladins each give a permanent aura: a Per source status that ends with its giver. If one Paladin is KO'd, its copy ends and the other's stays. Nothing ticks down on screen.
- A mark that heals its applier when the holder is hit is a Per source status. Each applier's reaction heals that applier.

**KO and fight end**
- A Mage is KO'd. Its Burn on an enemy keeps pulsing with its fixed numbers.
- A status flagged to survive a KO stays on a KO'd unit; everything else on that unit ends.
- A unit at 180/200 HP has a +100 max HP buff when the fight ends. The buff ends, max HP returns to 100, and the unit carries 100/100 into the next fight.

**Removal and conditions**
- A cleanse that removes one debuff takes the newest.
- An ability with condition "an ally has a lockout covering all actions" starts only while an ally is stunned.

**Reactions**
- Shock's damage to the holder resolves on the sub-tick after its basic attack.
- A passive's reaction, such as "dodging an attack deals damage", is a permanent, unremovable status applied at fight start, shown as a sheet effect.
- A buff raises a unit's MP regen from 0. The unit gains the status MP regen brings and starts restoring MP.

**Other archetypes**
- Mana burn: a pulse that drains the holder's MP.
- Shield over time: a pulse that adds shield stacks to the holder.
- Weapon enchant: a status that adds a fire rider to the holder's basic attacks.
- Imbue: a status that changes the element of the holder's magical instances to ice.
- Berserk: +Attack and −Armor in one status, labeled buff.
- Doom: a status that reacts to its own ending, when the cause is expiry, by dealing damage to its holder.

---

## Part 3: Out of scope and open items

**Still open (steps 6 and 8).**
- Lifesteal as a stat needs a scale with a second factor ("X% per point of Y"). A number is base + ratio × one source today.

**Deferred building blocks.** Add only when content needs them.
- Targeting rules on the attacker: single-target taunt, charm, confusion. If added, a rule on the attacker beats overrides on targets, since it's more specific. A single-target taunt points at one specific unit, which no stat can hold, so it would be a Refresh status that knows its source (its latest taunter), whose holder must target its source.
- Granting or replacing actions, such as polymorph.
- Spell reflect: sending an action back at its source.
- Delay: pushing back a unit's timers.
- Status resistance. If added, reducing Intensity is likely more interesting than reducing duration.
- Protection against chain-stuns, if simulation shows units getting locked down.
- A neutral status label, neither buff nor debuff.

**Decided elsewhere**
- Step 11: anything that lasts between fights.
- Class design: which elements exist, how many, and their signature statuses.
- Display work: the display pipeline (section 10), including which kinds of status get which presentation, how charges and interrupts look, and the shield's own visual treatment.
- Balance and simulation: stat floors and caps, the damage-taken cap, Intensity decay rates and caps, and shield decay and cap. Suggested starting point for shields: no decay, capped at the unit's max HP.
- Revive design: how revives work, including statuses that survive a KO to revive a unit (such as Reraise), and how a revived unit gets its passive statuses back.
