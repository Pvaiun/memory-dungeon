# The plays

Stage 1's inventory: every distinct play the rules allow, merged from five agents' lists (`inventory/`), doubles taken out. 515 plays. The director marks them on the page linked from `report.md`; this file is the list as it went up.

Each play: its id, the play, then the mechanics it rests on. *Also* names the other ways it does. *Merged* names the doubles folded into it. A play marked *needs a block* is one the rules don't allow yet but a small new building block would; *needs a ruling* is one a standing ruling in the sources stands in the way of.

| Way | Plays |
| --- | --- |
| Burst | 115 |
| Build up | 99 |
| Debuff or disable | 130 |
| Sustain | 171 |

## Burst

### How big and how often (32)

- **B-001** Basic attacks with a slow, heavy swing land one big blow per interval. Defense takes a smaller share off a big hit than off a small one, so against armoured foes more of each tick's damage gets through than a fast, light kind's.  
  Rests on: Speed; Swing; Defense.
- **B-002** A wearer of an Attack-heavy kind who stacks Attack turns its basic attacks into big blows. The swing grows with the Attack it carries, so the Attack that feeds its abilities makes every plain swing a spike too.  
  Rests on: Scaling; Attack.
- **B-008** Crit chance and Crit damage on a unit that already hits big make its hits spike. Crits land before Defense, so a big crit gets through nearly whole and takes a large share of a foe's HP in one blow.  
  Rests on: Crit chance; Crit damage; Crits; Defense.
- **B-009** High Crit chance on a fast kind turns a steady stream into frequent small spikes. A crit lifts a hit before Defense, and Defense takes the biggest share off small hits, so crits help small blows most.  
  Rests on: Crit chance; Speed; Defense.
- **B-011** A multi-hit ability whose hits each lay Brittle makes every hit after its first a crit. Each hit's Brittle lands after it, ready for the next hit of the same action. *(also debuff or disable)*  
  Rests on: Brittle; mods (apply); damage (hits).
- **B-016** A crit that makes the ability ready again, or recasts it, chains big hits off lucky ones. Each crit buys another blow at once, so high Crit chance turns into runs of burst.  
  Rests on: hit_lands (crit); recast; cooldown (ready).
- **B-018** Double strike gives each basic attack a chance to hit twice. More hits land per tick, each a full hit that can crit and carry riders, so damage and everything that counts hits arrive sooner.  
  Rests on: Double strike; extra.
- **B-019** Attack speed brings a unit's basic attacks sooner, so damage that rides on its swings lands faster. A unit whose burst is its riders, extra strikes or Double strike gets more of it into each stretch of the fight.  
  Rests on: Attack speed; Double strike; riders.
- **B-021** Extra strikes heard as basic attacks set off everything the unit's basic attacks set off. Each Double strike or extra strike applies the swing's riders and reactions again, so on-swing effects come twice as often. *(also build up, debuff or disable; merged D-130, X-116)*  
  Rests on: echo; Double strike; riders; extra.
- **B-022** An ability with several hits lands them in one action, each a separate hit that can crit, applies its own effects and counts toward anything that counts hits. The burst arrives as a flurry, which passes under a block and breaks what counts hits.  
  Rests on: damage (hits); Hits.
- **B-023** An amount added to every hit before boosts, crit and Defense lifts many small hits. Defense takes a big share off small hits, so adding to each one makes a fast stream land far harder.  
  Rests on: adds; Defense.
- **B-024** An amount added to each hit from the target's own max HP makes every hit take a share of the foe's health. Against a boss or a large foe the same blows deal far more than against a small one.  
  Rests on: adds; max_hp.
- **B-027** Bleed laid on a foe is cashed fast by a flurry of hits. Each hit it takes deals untyped damage per stack, so a fast kind, Double strike or a multi-hit ability whose early hits lay it turns the stacks into damage in a few ticks.  
  Rests on: Bleed; Double strike; damage (hits); Speed; A hit's own statuses land after the hit.
- **B-031** Bleed carries many small hits past high Defense. Defense shrinks each small hit, but the Bleed damage each one sets off is untyped and lands whole, so weak hits still deal big damage. *(also build up, debuff or disable; merged D-059)*  
  Rests on: Bleed; untyped; Defense; Double strike.
- **B-033** Burn laid in big applications makes its pulses large from the start. Boosts on Burn's tag and changes that add stacks raise what each application adds, so the foe takes near-ceiling damage without the slow climb of upkeep. *(also build up)*  
  Rests on: Burn; boosts (status tag); mods (stacks).
- **B-041** Chill rushed to its cap shatters early: its holder takes damage for each stack and a Stun. The shatter is untyped, never dodged and never cut by Defense, so the lump lands whole on foes that blunt hits. *(also debuff or disable)*  
  Rests on: Chill; Haste; Cooldown; untyped.
- **B-054** Might spent on a multi-hit ability or an Area boosts every hit of the action for one stack. Each action spends only one stack, however many hits it lands or foes it reaches. *(also build up; merged X-022)*  
  Rests on: Might; damage (hits); Area; Double strike.
- **B-063** Cooldown on a unit with one strong ability brings that ability round sooner and more often. The burst repeats through the fight instead of landing once.  
  Rests on: Cooldown.
- **B-065** All the unit's chosen abilities wait until every one is ready, then fire as one. Their damage lands in a single moment instead of spread across their cooldowns, at the price of waiting for the slowest. *(also debuff or disable; merged D-132, X-093)*  
  Rests on: mods (together); mods; together.
- **B-075** An Area that comes round a share sooner for each foe it hit fires most often against the biggest packs. The more foes stand, the faster it returns, so a pack melts in quick repeats. *(merged X-122)*  
  Rests on: cooldown (lessPct); scale: count (hit); Area; count (hit).
- **B-082** Many small hits pass under a foe's Aegis, which blocks only damage above a share of max HP. Against a foe holding Aegis, a flurry delivers the burst one big blow would lose. *(merged X-073)*  
  Rests on: Aegis; damage (hits); Speed; Double strike; Speed (fast).
- **B-084** What a foe's Shield soaked or its Aegis blocked of a big hit comes back at once as a second landing. The defence takes the blow but the burst still reaches the foe.  
  Rests on: strike; event (stopped); hit_lands; bare.
- **B-085** Accuracy on the unit with the biggest hit keeps an evasive foe from dodging it. A burst that is one large blow loses everything on a dodge, so cancelling Evasion makes it land when it's due.  
  Rests on: Accuracy; Evasion.
- **B-087** Many small hits break a foe's Bulwark fast, since every hit takes one stack. A fast kind, Double strike or a multi-hit ability reaches zero soonest and opens its Stun and double damage. *(also debuff or disable; merged D-107)*  
  Rests on: Bulwark; Double strike; damage (hits); Speed; KIND_SPEED; hit_taken.
- **B-093** Thorns returns the same untyped damage for every hit that lands, so foes that hit many times pay most. Fast swingers, multi-hit abilities and Double strike on the foes' side feed it hardest, and it costs its holder nothing.  
  Rests on: Thorns; untyped; Double strike.
- **B-095** A strike back for a share of the damage just taken returns big blows in kind. The harder a foe hits, the bigger the answer, so a heavy hitter pays for its own burst at once. *(also debuff or disable; merged X-160)*  
  Rests on: damage_taken; strike; scale: amount; hit_taken; event (raw); Defense; Guard.
- **B-105** Each hit the unit lands brings its big ability a few ticks closer. A fast kind or Double strike charges it quickly, so the big hit comes round far more often than its cooldown says.  
  Rests on: hit_lands; cooldown (less); Double strike; Speed.
- **B-109** An ability that resolves a second time at once, free, lands the same big hit twice back to back. One wind-up and one cost buy two blows.  
  Rests on: recast; action_resolve; repeat.
- **B-139** Each pulse of an affliction the party laid sets off a small hit from a piece answering the damage. Status damage that can't crit or cash Bleed brings hits that can. *(also build up)*  
  Rests on: damage_dealt; status_triggered; strike.
- **B-140** A party unit's own status that pulses untyped damage on every foe, with crits turned on for its pulses, spikes when it crits. The steady pulse gains the spikes a hit would have. *(also build up)*  
  Rests on: pulse; crit (status field); untyped.
- **X-006** With Sunder or Brittle already on the foes, a Bewildered foe's swing into its own side lands harder or as a sure crit, so the party's debuffs pay on a blow the party never threw. *(also debuff or disable)*  
  Rests on: Bewildered; Sunder; Brittle.
- **X-099** A piece that answers a spent Aegis with damage sized by what it stopped turns the foe's biggest blow back on it. *(also sustain)*  
  Rests on: Aegis; status_ended (cause spent); amount.

### How wide (23)

- **B-007** Basic attacks that hit every foe make each swing an Area hit. Small blows land on the whole pack all fight long, so a swarm of weak foes falls together instead of one at a time.  
  Rests on: area; aim.
- **B-012** Brittle laid on every foe, then an Area, makes the Area crit on the whole pack. One crit each, on every foe, in one action. *(also debuff or disable; merged D-053, X-026)*  
  Rests on: Brittle; Area; Every foe.
- **B-020** An extra strike after every basic attack, aimed by its own rule at another foe, makes each swing land on two targets. The second hit can go to the lowest-HP foe, finishing it while the swing works on the first. *(also build up; merged X-117)*  
  Rests on: strike (status field); extra; lowest; aim.
- **B-026** When an ally lands a hit, this unit strikes the same foe out of turn. The party's blows gather on one target in the same moment instead of spreading.  
  Rests on: hit_lands (whose: ally); strike; other.
- **B-028** The whole party cashes one foe's Bleed by focusing it. With the foe Marked, every party basic attack lands on it, and each hit from any ally deals the Bleed damage, so the stacks pay out at the party's combined hit rate. *(also debuff or disable; merged X-003)*  
  Rests on: Bleed; Marked; focus.
- **B-039** A hit that scales from the number of debuffs its target holds rewards laying many kinds on one foe. Aimed at the foe with the most debuffs, it lands as one large blow on the foe the party has worked on most. *(also build up, debuff or disable; merged D-100, U-027, X-136, X-154)*  
  Rests on: scale: count (debuffs); mostDebuffs; mods (times); count; debuffs; target; count (scale): debuffs; boosts (status field); one (effect op); count (debuffs); one.
- **B-056** A support lays Might on the ally with the highest Attack just ahead of its big hit. The support's action turns into extra damage on the unit that hits hardest.  
  Rests on: Might; The ally with the highest Attack; slot order.
- **B-057** Might shared with every ally as one gains it makes the whole party's next actions hit harder together. One application becomes a party-wide boost landing in the same stretch. *(also build up, sustain; merged U-078, X-106)*  
  Rests on: Might; share; status_gained; share (effect op); copy (apply field); Haste; Guard.
- **B-058** A support holding Might, Haste and other buffs passes them all to the main hitter at once. What it built on itself lands as fresh applications on the one unit that turns them into the most damage.  
  Rests on: pass; Might; Haste.
- **B-068** A big hit aimed at the foe with the highest Attack takes out the most dangerous foe first. The blow lands where the foes' damage matters most.  
  Rests on: The foe with the highest Attack; top.
- **B-071** A big hit with Seek lands on the foe it means, past a Taunting one. The party's burst reaches the foe behind the taunter instead of wearing down the tank.  
  Rests on: Seek; Taunt.
- **B-074** An Area hits every foe at once, Hidden ones included, and skips the Taunt rule. Against a pack it lands the same blow on every foe in one action, so the pack's total HP falls fastest. *(also debuff or disable; merged X-056)*  
  Rests on: Area; Hidden; Taunt.
- **B-076** A single-target big hit changed to land on every foe deals an even share to each. It trades one large blow for a little on all, which can finish a whole wounded pack at once.  
  Rests on: mods (spread).
- **B-077** Bonus hits on a second random foe, or on up to three others, spread a big action across a few foes. Those extra targets ignore Taunt, so the splash reaches past a taunter without Seek. *(also debuff or disable; merged X-055)*  
  Rests on: A second, random foe (Arc); Up to three other random foes (Chain lightning); bonus; The Taunt rule.
- **B-078** A big hit that deals more while only one foe stands saves its weight for a lone boss or the last of a pack. The party's burst grows where every hit already goes to the same foe.  
  Rests on: scale: when; count; atMost.
- **B-079** When a foe falls, every other foe takes untyped damage from a reaction. Each kill weakens the rest of the pack, so kills come faster and faster through a group.  
  Rests on: ko; damage (in a reaction); exclude; untyped.
- **B-080** A killing blow's left-over damage carries to another foe as a strike. Overkill isn't wasted on a fallen foe, so a big hit on a weak foe keeps working on the next. *(merged X-118)*  
  Rests on: strike (carry); ko; amount; Swing (heavy).
- **B-092** Thorns given to every ally by the party effect makes a foe's Area cost it once for each unit it hits. A foe that strikes the whole party takes the retaliation several times in one action. *(also debuff or disable; merged X-153)*  
  Rests on: Thorns; party effect; Area.
- **B-097** A strike at whoever last hit an ally answers blows on any party member. One unit's reaction turns the foes' attacks on the whole party into hits on the attackers.  
  Rests on: hit_taken (whose: ally); assailant; strike.
- **B-107** A support's action pulls the main hitter's slowest ability closer or makes it ready. The support spends its turn bringing the party's biggest hit forward. *(merged X-125)*  
  Rests on: cooldown (slowest); cooldown (ready); The ally with the highest Attack.
- **B-127** Every foe under an HP line is knocked out at once. After an Area or afflictions bring a pack down together, one action ends all of them.  
  Rests on: fell; all; hpBelow.
- **B-134** A seat that adds Attack, Crit chance or speed to one unit makes it the party's main hitter. The formation pours its numbers into one unit's burst rather than the party's.  
  Rests on: seat.
- **B-136** A party effect giving every ally Attack or a speed stat lifts the whole party's damage together. Three units hitting harder at once bring the foes down sooner than their parts.  
  Rests on: party effect.

### When (41)

- **B-010** A quick hit lays Brittle, and a slow heavy hit that waits for it is a sure crit. A hit's own statuses land after it, so the poke sets up and the big blow that follows crits. *(also debuff or disable; merged D-051, X-025)*  
  Rests on: Brittle; A hit's own statuses land after the hit; mods (wait); Crit damage; critsTaken; Crits; slot order; Defense; Swing (heavy).
- **B-013** Hits that always crit against a foe under an HP line finish wounded foes fast. The crit lands before Defense, so the last stretch of each foe's HP goes in a blow or two.  
  Rests on: crits (when); hpBelow.
- **B-014** Hits that crit against a foe holding a given status, such as Stun or Chill, turn each window the party opens into crits. Whatever lays the status sets the moment the crits come. *(also build up, debuff or disable; merged D-101, X-067, X-068)*  
  Rests on: crits (when); has; when; hasAny; crits; Stun; Silence; times; Crit damage.
- **B-015** A short status from the unit's own piece sets its Crit chance high for a while, so every hit in that stretch crits. The unit's damage gathers into one window instead of spreading by chance.  
  Rests on: set; Crit chance.
- **B-017** A debuff that makes every hit on a foe crit for a short while gives the whole party a crit window on it. Every ally's hits in that stretch crit, where Brittle gives only one. *(also debuff or disable)*  
  Rests on: critsTaken; Brittle.
  Needs a block: A status: a debuff with critsTaken (always) and a duration, so every hit on its holder crits while it lasts.
- **B-030** A multi-hit ability that waits until its target holds enough Bleed cashes the stacks at their peak. The flurry is held back while the stacks are laid, then lands every hit on a full total.  
  Rests on: Bleed; stacks; mods (wait); damage (hits).
- **B-044** A strike, or a big ability made ready, the moment a foe shatters lands while it is Stunned and freshly hurt. The party's burst stacks onto the shatter's lump in the same moment.  
  Rests on: status_capped; Chill; strike; cooldown (ready).
- **B-045** Shock aimed at the foe with the fastest swing pays out soonest. Its damage comes each time its holder acts, so a quick foe turns the stacks into damage within a few ticks. *(merged X-014)*  
  Rests on: Shock; by: swing; swing (by); lowest.
- **B-047** Calling a Shocked foe's action early sets its Shock off at once. A Taunt that makes the foes swing at once, or an effect that makes a foe's basic attack ready now, turns the held stacks into damage now rather than at its next action. *(merged X-012)*  
  Rests on: Shock; Taunt; cooldown (ready); A foe's action can be called early; cooldown (basic, ready).
- **B-060** Haste laid on the party's main hitter shortens its cooldowns, wind-ups and time between attacks for a while. Its big abilities come round sooner and land sooner after they start, so its damage gathers into that stretch.  
  Rests on: Haste.
- **B-061** Haste and Might given at the fight's start by seats or the party effect make the opening the party's strongest stretch. Every ally acts faster and harder in the first ticks, before the foes' plans unfold.  
  Rests on: fight_start; seat; party effect; Haste; Might.
- **B-062** Cast speed, or a change that makes the big ability wind up in a moment, makes its damage land almost as soon as it starts. Less time in the wind-up means less time for its target to fall first or a knockout to cancel it.  
  Rests on: Cast speed; mods (cast).
- **B-064** Basic attacks that never wait on the unit's abilities keep swinging through every wind-up and recovery. A unit with long casts loses none of its swing damage while it charges its big hit. *(also build up, sustain; merged S-141, U-049, X-094)*  
  Rests on: tireless; Siphon; Lifesteal; tireless (status field); riders (status field); Wind-ups.
- **B-069** Basic attacks aimed by their own rule at the foe with the lowest HP finish wounded foes between abilities. Each swing goes where it can end a foe, so no damage spreads onto healthy ones.  
  Rests on: aim; lowest.
- **B-070** A big hit aimed at a foe in its wind-up can knock it out before its action lands. Damage doesn't interrupt a cast but a knockout does, so burst on the caster stops its big move. *(also debuff or disable)*  
  Rests on: casting; What interrupts.
- **B-086** A big hit that misses, or is interrupted in its wind-up, comes ready again at once. The burst a dodge or an interrupt would have cost is back on the next action instead of a full cooldown later. *(also sustain; merged S-155)*  
  Rests on: hit_missed; action_interrupted; cooldown (event); cooldown (which: event); cooldown (set: ready); Silence.
- **B-088** The party's biggest hit held until a foe's Bulwark breaks lands in its double-damage window. An ability that waits for a Stunned foe, or comes ready when a foe is Stunned, fires into it. *(merged X-051)*  
  Rests on: Bulwark; Stun; mods (wait); status_gained; cooldown (ready); Double strike; wait.
- **B-091** Thorns on the unit that draws the foes' picks makes every hit they land cost them untyped damage. A Taunt that calls their swings at once brings the retaliation in a rush. *(also debuff or disable; merged X-028)*  
  Rests on: Thorns; Taunt; Aggro; A foe's action can be called early.
- **B-094** A strike out of turn each time the unit dodges answers every miss with a hit. Evasion makes it often and Blur makes the next one sure, so the foes' own swings bring the party's damage. *(also debuff or disable, sustain; merged X-047, X-048)*  
  Rests on: hit_evaded; strike; Evasion; Blur; Taunt.
- **B-098** When the unit's Shield is emptied, it strikes for what the Shield held. The pool the foes broke comes back at them as one blow, at the moment they break through. *(also sustain; merged X-098)*  
  Rests on: status_ended (stacks); Shield; strike; scale: amount; status_ended (cause stacks); amount.
- **B-099** A kill that makes the ability ready again lets it move straight on to the next foe. Against a weakened pack, one big hit clears them one after another. *(merged X-120)*  
  Rests on: ko; cooldown (event); cooldown (event, ready).
- **B-100** A reaction that makes all of the unit's abilities ready at once, on a kill or past an HP line, lets it fire its whole kit back to back. Every big hit it slotted comes in a run instead of one per cooldown.  
  Rests on: cooldown (abilities); ko; hp_low.
- **B-101** An ability that resolves again at once, free and with no wind-up, when it kills chains through a pack without a pause. Each repeat picks its target afresh by its own rule. *(merged X-119)*  
  Rests on: recast; ko; repeat.
- **B-102** Every ability still well off cooldown when a fight starts is brought to at least half charged. Cooldowns carry from fight to fight, so this makes sure the big hit comes early in every fight.  
  Rests on: fight_start; cooldown (atMost); Cooldowns carry between fights.
- **B-103** Winning a fight makes the big ability ready, and cooldowns carry, so the next fight opens with it. The party starts every fight after the first with its burst in hand.  
  Rests on: fight_won; cooldown (ready); Cooldowns carry between fights.
- **B-104** A big hit that waits for a foe over a share of its HP isn't spent finishing the last foe of a fight. It carries ready into the next fight and opens it. *(merged X-146)*  
  Rests on: hpAtLeast; Firing; Cooldowns carry between fights.
- **B-106** Each hit the unit takes brings its big ability closer. The harder the foes press it, the sooner its burst comes back.  
  Rests on: hit_taken; cooldown (less).
- **B-108** Each unit's action readies the first ability of the unit in the next seat. The party's big hits fire one after another down the seats in a quick run. *(also build up; merged X-139)*  
  Rests on: action_resolve; cooldown (first); seat (next); seat (next / previous).
- **B-117** A hit that scales from the unit's current HP lands biggest while it is healthy. Its burst comes at the fight's start and after each heal, and shrinks as the unit is worn down.  
  Rests on: scale: hp (current).
- **B-118** When the unit is knocked out, a status that survives its knockout deals a parting blow to the foes. The unit's fall becomes damage at once, so even a lost hitter lands its last burst.  
  Rests on: survivesKO; ko; damage (in a reaction).
- **B-119** Falling under an HP line makes the unit's big ability ready or sets off a strike. The burst lands the moment it's in danger, whatever brought its HP down.  
  Rests on: hp_low; cooldown (ready); strike.
- **B-125** Hits that deal more the more HP their target has lost grow as each foe weakens. The last stretch of a foe's HP goes faster than the first.  
  Rests on: boosts; scale: hp (missing); of: target.
- **B-126** A foe under an HP line is knocked out at once. It isn't damage, so no Shield, Aegis or floor stands in the way, and the last stretch of its HP is skipped. *(merged X-130)*  
  Rests on: fell; hpBelow; hp_low.
- **B-128** A foe going under an HP line makes the party's finishing ability ready at once. The finisher fires the moment it can end that foe.  
  Rests on: hp_low (whose: foe); cooldown (ready).
- **B-130** The unit's first action of the fight hits much harder or always crits. Its opening blow lands before anything has acted, so the fight starts with one foe badly hurt or down.  
  Rests on: acted; scale: when; crits (when).
- **B-131** Hits on foes that haven't yet acted deal more or crit. The party's quickest actions land before the foes' first moves, so the first few ticks carry the most damage.  
  Rests on: acted; crits (when); boosts.
- **B-132** The start-of-fight effects of the party's gear and seats happen again mid-fight. Every opening boost and cooldown pull comes a second time, giving the party a second opening. *(also debuff or disable; merged D-096)*  
  Rests on: restart; fight_start; repeat.
- **B-133** Holding the biggest hit until the enrage lands it when every hit is dialled up. The enrage scales a hit as its own step, so boosts after it multiply a larger number.  
  Rests on: Enrage; difficulty dials.
  Needs a block: A condition: the fight has passed an enrage step (RULES.enrage), so an ability can wait for it.
- **B-142** Lifting a Weaken or Shock from the party's main hitter just before its big hit lets the hit land whole. Weaken halves a hit, so a Cleanse ahead of the big hit restores it. *(also sustain)*  
  Rests on: Cleanse; Weaken; Shock; mods (wait).
- **X-148** A big ability that waits for its target to be Stunned lands while the foe can't answer, and a Stunned foe's wind-up waits until it is free. *(also debuff or disable)*  
  Rests on: wait; hasAny; Stun.
- **X-157** An Area payoff that waits until at least a given number of foes hold an affliction fires only once the pack is loaded, never on one stacked foe. *(also build up)*  
  Rests on: atLeast; has; Area; affliction.

### At what price (19)

- **B-003** A unit with little Attack still adds heavy blows through a base-heavy, heavy kind. Its swing doesn't need Attack behind it, so a unit built for anything else adds real damage to the party's burst without spending stats on it.  
  Rests on: Scaling; Swing.
- **B-004** A unit's swing or big hit scaled from max HP or Defense turns a defensive stat into damage. A unit stacked to survive lands large blows without trading any of that away. *(also sustain; merged X-065)*  
  Rests on: Swing; Scaling; scale: stat; rescale; max_hp; Defense.
- **B-005** A heavier piece of its kind swings harder for one stat step fewer. The wearer gives up stats it would carry for bigger basic-attack blows from the first swing.  
  Rests on: Swing; Budget; SWING_TRADE.
- **B-006** A two-handed heavy kind gives big blows and a rich budget at the cost of the offhand. The party trades a whole piece for basic attacks that land large from the first swing.  
  Rests on: Hands; Swing; Budget.
- **B-048** Hasting a Shocked foe makes it act more often, so its Shock pays out faster. The party takes that foe's blows sooner in exchange for Shock damage landing in a fraction of the time. *(merged X-011)*  
  Rests on: Shock; Haste; apply.
- **B-110** A second cast that is paid for costs the MP again but still skips the wind-up and the cooldown. The unit burns fuel twice as fast to land two blows for one wait.  
  Rests on: recast (paid); MP.
- **B-111** An ability with no cooldown is cast whenever it can be, limited only by its MP. The unit pours its fuel into its biggest hit as fast as its wind-ups allow. *(also build up; merged X-092)*  
  Rests on: mods (cooldown); MP; cooldown (ability change); MP regen; Clarity; Siphon.
- **B-112** A big hit that scales from what it paid grows when its cost is raised. A change that makes it cost more MP, or adds an HP price, turns the extra spend straight into damage. *(merged X-091)*  
  Rests on: scale: cost; mods (mp); mods (hp); cost; mp (ability change).
- **B-113** A big hit paid for in HP instead of MP lands more for the HP it costs. The price is lost at once, not as damage, so nothing soaks it, and it never takes the unit below 1 HP.  
  Rests on: pay; mods (hp); scale: cost.
- **B-114** Every basic attack paid for in HP hits harder by what it paid. The unit spends its own health on each swing for a stream of bigger blows.  
  Rests on: mods (pay); basic; scale: cost.
- **B-115** Paying HP sets off a reaction that adds Might or a strike. Each price the unit pays turns into damage at once. *(also build up; merged U-067, X-087)*  
  Rests on: hp_paid; Might; strike; pay (effect op); hp (ability change); pay.
- **B-121** Swapping the unit's Attack and Defense turns a high Defense into a high Attack. Its hits jump in size, paid for by the Defense it gives up. *(merged X-064)*  
  Rests on: swap; Attack; Defense; Scaling (Attack-heavy).
- **B-122** A hurt unit trades HP shares with a healthy foe: the foe is left at the unit's percent and the unit at the foe's. Paying HP first lowers its share on purpose, so one action takes a large share off a boss. *(also debuff or disable, sustain; merged D-102, S-051, X-082)*  
  Rests on: trade; pay.
- **B-123** Healing past full turns into a strike on a foe for the part past full. The party's spare healing becomes damage as it overflows. *(also sustain)*  
  Rests on: overhealed; strike; scale: amount.
- **B-124** MP gained past the full pool turns into damage on a foe. Regen that would be wasted at full lands as hits instead.  
  Rests on: mp_over; scale: amount; damage.
- **B-135** A seat or a status that raises one unit's damage while lowering its Defense or HP, or raising its Aggro, buys burst with fragility. The main hitter lands more, and the foes' blows on it land harder too.  
  Rests on: seat; boosts; taken; Aggro.
- **X-081** An HP price lowers its payer's HP on purpose and never below 1, so an ability scaling from missing HP grows with every price the unit pays.  
  Rests on: pay; hp (missing).
- **X-083** A unit pays HP for its strikes, then a rewind takes it back to what it held some ticks ago, so the price is paid and then undone. *(also sustain)*  
  Rests on: pay; rewind.
- **X-159** A piece that rewards an empty offhand pays a two-handed weapon's wearer for the slot its weapon took, so the two-hander's swing and the reward add.  
  Rests on: Hands (two); offhand (false).

## Build up

### How big and how often (24)

- **U-001** Burn laid a little on every swing of a fast weapon climbs to the ceiling its upkeep reaches and holds there. The damage rises through the fight's opening and stays high only while the swings keep coming.  
  Rests on: Burn; riders (status field); Speed: Fast (KIND_SPEED); Attack speed.
- **U-002** Burn laid in large piles by an ability on a long cooldown spikes after each cast and decays between casts. The foe burns hardest just after each one, and the build holds only if the next cast comes before the pile fades.  
  Rests on: Burn; apply; Cooldowns: long (COOLDOWN).
- **U-019** One unit lays Bleed and sets it off with the same hits. A hit's own statuses land after it, so each hit cashes the last one's stacks, and the pile climbs only while each hit lays more than it closes.  
  Rests on: Bleed; riders (status field); A hit's own statuses land after the hit.
- **U-031** Every hit gains a flat amount for each stack of an affliction its target holds, added before boosts, crit and Defense. Many small hits gain most, and they break through Defense more as the pile rises.  
  Rests on: adds (status field); stacks (scale); Defense.
- **U-032** A unit's hits grow by a share for each stack its target holds, read off the unit being hit, so a slow, heavy hitter's every blow climbs with the pile its allies build.  
  Rests on: boosts (status field); stacks (scale); Swing: Heavy.
- **U-038** Might laid by an ally on a slow, heavy hitter climbs to its cap, since each action spends only one stack and the hitter acts rarely. Each big blow lands harder; on a fast unit the same Might is spent as fast as it comes. *(also burst; merged B-053, X-023)*  
  Rests on: Might; apply; Speed: Slow (KIND_SPEED); Swing: Heavy; Speed (slow); Swing (heavy).
- **U-039** A unit that gains Might from each hit it lands, while each action spends one, comes out ahead on actions with several hits: multi-hit abilities and Double strike climb it toward the cap, single blows only hold it.  
  Rests on: Might; hit_lands; Double strike.
- **U-043** A counter that adds a flat amount to each hit per stack, gained as hits land, grows a fast weapon most. Each small hit gains the add before Defense, so the climb breaks through armour that blunts a percent boost.  
  Rests on: adds (status field); hit_lands; Speed: Fast (KIND_SPEED); Defense.
- **U-044** A counter that raises Attack per stack lifts an Attack-heavy weapon's swing and every ability scaled from Attack, while a base-heavy swing barely moves. The weapon kind decides how much of the climb reaches basic attacks. *(merged X-066)*  
  Rests on: Attack; stats (status field); Scaling: Attack-heavy; Scaling: Base-heavy; stats; Scaling (Attack-heavy); Scaling (base-heavy).
- **U-045** A unit that swings faster and faster: a counter raises Attack speed per stack, gained on each swing, up to its cap. Every rider it carries is laid faster with it, so its afflictions climb on an accelerating clock.  
  Rests on: Attack speed; stats (status field); hit_lands; riders (status field).
- **U-046** A unit whose abilities come round sooner with each cast: a counter raises Cooldown or Cast speed per stack as its abilities resolve, or a change cuts its cooldowns for each stack it holds, so its casting accelerates through the fight.  
  Rests on: Cooldown; Cast speed; action_resolve; cooldown (ability change), times; cooldown (effect op): lessPct.
- **U-047** A counter that adds Crit chance per stack, gained on each crit, makes crits come more often the more it crits. Its damage climbs in jumps and turns spikier; a Brittle foe hands it a sure crit to feed on.  
  Rests on: Crit chance; crit (tag); hit_lands; Crit damage; Brittle.
- **U-048** Hits that cost no action make every hit-counting build climb faster: Double strike's second strikes and reactions' strikes out of turn each lay on-hit stacks, feed hit-fed counters and cash Bleed, and echo lets riders that name basic attacks hear them.  
  Rests on: Double strike; strike (effect op); extra (tag); echo (status field); Bleed.
- **U-056** A unit that grows from being hit: it gains a stack each time a hit lands on it, and draws fire by Aggro, Taunt or a Fixated foe. Many small foe hits feed it fastest, and the harder foes press it, the harder it hits back. *(merged X-101)*  
  Rests on: hit_taken; Aggro; Taunt; Fixated; Might.
- **U-057** Growth scaled from each blow's damage: stacks sized by the damage taken grow most from big hits, and applications under one stack wait and add up, so it feeds on a heavy foe's blows rather than a swarm's.  
  Rests on: damage_taken; hp_lost; amount (scale); Stacks (stacking).
- **U-082** An applier whose stacks per application grow over the fight lifts its upkeep's ceiling twice over: its applications scale from a stat or counter that climbs, or add more for each of a count that rises.  
  Rests on: stacks (apply field); stacks (ability change); times (ability change); boosts (status field): a status's tag.
- **U-083** The build on the foes grows the party's hitters too: each tick of an affliction on a foe, or each cap it reaches, adds to a party unit's counter, so two builds climb as one.  
  Rests on: damage_taken; whose: foe; status_triggered; status_capped.
- **U-088** A unit that gains Defense or max HP each time it's hit, with abilities that read that stat in place of Attack, grows tougher and harder-hitting together as the foes press it.  
  Rests on: rescale (status field); hit_taken; stats (status field); Defense.
- **X-020** Sunder raises a hit before Defense takes its share, and Defense takes most off small hits, so on a high-Defense foe Sunder lifts a partner's light, fast swings by more than its face. *(also burst)*  
  Rests on: Sunder; Defense; Speed (fast); Swing (light).
- **X-062** A piece that adds a share of its holder's Defense to its hits turns Guard into damage: each Guard raises both what the unit shrugs off and what it deals.  
  Rests on: Guard; adds; Defense.
- **X-124** A piece bringing the first-slotted ability closer on each basic attack makes the slot order a lever: whatever the player puts first fires far more often than the rest.  
  Rests on: cooldown (first); slot order.
- **X-126** A piece bringing its wearer's next ability closer on each dodge makes an evasive unit cast faster the more it is attacked. *(also sustain)*  
  Rests on: hit_evaded; Evasion; cooldown (soonest).
- **X-144** A piece giving its wearer a stack for each heal it gives makes a mender grow more dangerous as the fight goes on. *(also sustain)*  
  Rests on: healed; Heal; other.
- **X-156** A piece answering each pulse or trigger of an affliction on a foe with another status lays a second build-up at the first one's rate, so Burn's pulses or Bleed's triggers carry Sunder or Chill with them.  
  Rests on: status_triggered; damage_taken; Burn; Bleed; Sunder.

### How wide (24)

- **U-003** Burn laid on every foe at once makes the whole field's damage climb together. Area abilities, basic attacks aimed at every foe, or a single-target ability spread to every foe carry it; it pays most against many foes in a long fight. *(also burst; merged B-035)*  
  Rests on: Burn; Area; area (tag); spread (ability change).
- **U-004** Burn piled on the foe that already holds the most climbs far past what spread upkeep reaches. Without Seek, a Taunting foe takes the pile instead, whether it burns or not.  
  Rests on: Burn; The foe with the most Burn; highest (pick), by stacks; Seek; The Taunt rule.
- **U-005** An affliction aimed at whichever foe holds the fewest stacks keeps every foe at the same height. Abilities pick by lowest stacks and basic attacks aim the same way, so the field wears down evenly and no kill takes a tall pile with it.  
  Rests on: lowest (pick), by stacks; aim (status field); Burn; Sunder.
- **U-006** Applications aimed only at foes below an affliction's cap fill one foe and then move to the next. A capped build never wastes stacks on a full foe, and its excess becomes the next foe's build.  
  Rests on: belowCap (unit condition); where (targeting rule); Sunder; Shock.
- **U-007** Every unit in the party lays the same affliction, so the shared total climbs to a ceiling no one applier reaches. A stack counts the same whoever laid it, and each applier that falls lowers the ceiling at once. *(also debuff or disable; merged D-131)*  
  Rests on: Stacks (stacking); riders (status field); Burn; Bleed; party effect; borrow; riders.
- **U-008** A unit whose basic attacks also carry an ally's riders lays both units' stacks with every swing. Two units feed one affliction at one weapon's speed, the stacks read off the borrower. *(also burst; merged B-138, X-115)*  
  Rests on: borrow (status field); riders (status field); borrow; Speed (fast).
- **U-012** Each application of an affliction on one foe is copied onto another: a reaction to the foe gaining stacks shares them, or lays one swing's riders on the others, so the build spreads without extra actions. *(also burst, debuff or disable; merged B-036, D-084, X-107)*  
  Rests on: share (effect op); status_gained; riders (effect op); copy (apply field); share; affliction; copy.
- **U-014** Chill laid on every foe at once brings the whole field to its cap together, so the shatters, their damage and their Stuns land on every foe in the same moment instead of one at a time. *(also burst, debuff or disable; merged B-042, X-016)*  
  Rests on: Chill; Area; status_capped; Stun.
- **U-015** One shatter becomes a rolling chain: a piece passes a shattering foe's Chill to the other foes, cut by about half for each foe that shattered lately, so the chain dies down rather than looping. *(also burst, debuff or disable; merged B-043, D-027, X-017)*  
  Rests on: Chill; status_capped; passed (apply field); damp (status field); apply (passed); damp; passed.
- **U-018** Bleed laid by one unit and cashed by another: a few heavy hits lay big piles, and an ally's many small hits, from a fast weapon, Double strike or a multi-hit ability, each deal damage per stack before a share closes. *(also burst; merged X-001)*  
  Rests on: Bleed; Swing: Heavy; Speed: Fast (KIND_SPEED); Double strike; hits (damage field); Speed (fast); untyped.
- **U-021** Area abilities with several hits lay Bleed on every foe and, with each later hit, cash it on every foe at once, so both the build and its payoff are field-wide. *(also burst; merged B-029, X-002)*  
  Rests on: Bleed; Area; hits (damage field); damage (hits).
- **U-028** A hit that grows with how many foes hold an affliction rewards spreading even one stack onto every foe before it lands: one stack on each counts as much as a tall pile.  
  Rests on: count (scale): { side, where }; has (unit condition).
- **U-029** A hit that grows with an affliction's total stacks across every foe reads the whole field's pile at once, so wide upkeep pays into one big blow wherever it's aimed. *(also burst; merged X-135)*  
  Rests on: count (scale): { side, where } with stacks; count ({ side, where }); stacks; affliction.
- **U-042** The whole party grows on one clock: a formation's party effect adds a stack to every ally on a timer, so each member's danger climbs together and a fallen member's share is lost.  
  Rests on: party effect (formation); pulse (status field).
- **U-050** A counter that gains a stack for each foe its hits land on climbs several stacks a cast from hits on every foe, so it grows fastest in crowded fights and slowest against a lone foe. *(merged X-123)*  
  Rests on: count (scale): hit; countAtLeast; action_resolve; Area; count (hit); Might.
- **U-051** A unit that grows with every kill: each foe it fells adds a stack it keeps for the fight, or its hits scale from the foes fallen so far. It pays in fights of many foes and does nothing against a lone boss.  
  Rests on: ko; other (event filter): holder; count (scale): { side, where } with ko: true.
- **U-052** The whole party grows through a crowded fight: a formation's party effect gives every ally a lasting stack whenever any foe falls, whoever felled it.  
  Rests on: party effect (formation); ko; whose: foe.
- **U-061** A unit that takes the big blows meant for its allies gains its hit-fed stacks from the whole party's incoming damage, so one counter grows from every ally's danger.  
  Rests on: cover (status field); hit_taken.
- **U-075** One unit grows from the party's tempo: it gains a stack each time an ally acts or lands a hit, or only the ally in a named or the next seat, so every speed gain on the others speeds its climb.  
  Rests on: action_resolve; hit_lands; whose: ally; seat (event filter).
- **U-079** The party's gains pile on one unit: what an ally would gain is diverted to the party's strongest hitter, so one tall pile climbs instead of several short ones.  
  Rests on: divert (status field).
- **U-080** One unit builds and another cashes: a unit's hits scale from the stacks held by the ally in a set seat, so the formation decides whose growth pays whom. *(also burst; merged B-137, X-138)*  
  Rests on: seat (scale); stacks (scale); scale: stat; scale: stacks; stacks.
- **U-081** A unit whose hits grow with how many buffs it holds hits harder for each different buff the party keeps on it, so breadth of support pays rather than one tall buff. *(also burst; merged X-137)*  
  Rests on: count (scale): buffs; count (buffs).
- **U-094** A party that grows in numbers: a unit brings new allies into the fight on a timer or an event, each entering with its actions on cooldown, so the party's count is the build.  
  Rests on: summon.
- **X-071** spread lands a one-foe ability on every foe, its damage split but its statuses whole on each, so a single-target ability carrying a status becomes a full application on the whole pack. *(also debuff or disable)*  
  Rests on: spread; Statuses on hits.

### When (26)

- **U-009** Haste on the unit keeping an affliction up lifts the ceiling its upkeep reaches, since a faster unit applies more stacks. The pile rises while Haste lasts and sinks back toward the lower ceiling when it lapses. *(also burst; merged B-034, X-007)*  
  Rests on: Haste; Attack speed; Cooldown; Cast speed; Burn; affliction; Chill; Shock.
- **U-011** An affliction outlives the foe it was laid on: when an afflicted foe falls, a piece lays the stacks it held on the foes still standing. The build isn't lost to the kill and walks down the field. *(also burst; merged B-032, X-121)*  
  Rests on: status_ended; ko (status-ended cause); amount (scale); apply; split (reaction); exclude (targeting rule); ko; apply (passed); affliction; status_ended (cause ko); amount; split.
- **U-017** Shock laid on a foe that is Stunned or winding up can't drain, since it drains only when its holder acts. It piles toward the cap, and the foe's next action pays the whole pile at once. *(also burst, debuff or disable; merged D-008, X-010)*  
  Rests on: Shock; Stun; Wind-ups; action_resolve; casting; Attack speed.
- **U-020** Bleed laid by reactions rather than hits waits on a foe nobody is hitting, since it has no duration and closes only when hit. When a Mark or a target rule turns the party's hits there, a burst of hits cashes the whole pile.  
  Rests on: Bleed; apply; Marked; targeting rule.
- **U-026** A debuff that worsens on its own: its pulse lays Sunder on its holder, so one application keeps the foe's vulnerability climbing with time while the party's hits go elsewhere. *(also debuff or disable)*  
  Rests on: pulse (status field); apply; Sunder.
  Needs a block: A status: a debuff whose pulse applies Sunder to its own holder.
- **U-030** An ability whose damage scales from its target's stacks lands harder the longer the pile has been built. It reads the stacks and leaves them, so the pile keeps working after the payoff. *(also burst; merged B-038, X-134)*  
  Rests on: stacks (scale); affliction; scale: stacks; The foe with the most Burn (or Chill, or Sunder).
- **U-033** A big ability that waits until the build is done: its own condition holds it until its target holds an affliction at its cap or past a set number of stacks, or its own counter is high, so it lands at the peak. *(also burst, debuff or disable; merged B-050, D-050)*  
  Rests on: if (ability condition); stacks (unit condition); atCap; wait (ability change); Sunder; mods (wait); slot order; pulse.
- **U-034** Once a foe holds an affliction past a set number of stacks, every hit on it crits. The build crosses a line and the party's damage steps up all at once instead of climbing; Crit damage makes the step taller.  
  Rests on: crits (status field): when, chance; stacks (unit condition); Crit damage.
- **U-035** Topping a build fires a free action: when a foe's affliction reaches its cap, one of the unit's abilities resolves again at once, free, or the unit strikes out of turn. *(also burst; merged X-145)*  
  Rests on: status_capped; recast; strike (effect op); Shock; Sunder.
- **U-036** A foe whose affliction passes a set number of stacks is knocked out at once, past Shields, Aegis and floors. The build is a visible countdown to a kill rather than a race of damage. *(also burst)*  
  Rests on: fell; status_gained; stacks (unit condition).
- **U-037** A payoff that cashes a pile and starts it over: an ability spends a foe's affliction and deals damage scaled from the stacks it took, so the build charges and releases on the foe. *(also burst; merged B-040, X-133)*  
  Rests on: spend; stacks (scale); scale: stacks; affliction.
  Needs a ruling: A status runs its own course: no ability spends, shortens or sets off a status early (vocabulary.md).
- **U-041** A unit that grows with time alone: a status adds a stack to it on a timer, whatever it does or faces. Long fights favour it, and an early knockout wastes it.  
  Rests on: pulse (status field); Stacks (stacking); cap (status field).
- **U-053** Each kill sets off the start-of-fight effects of the unit's gear and seat again, so opening buffs and head starts come back with every foe it fells, while a price kept to the first time isn't paid twice. *(also burst)*  
  Rests on: restart; fight_start; ko; repeat (event filter).
- **U-054** A party that grows as it loses members: each ally that falls makes the survivors stronger, through a reaction to the knockout or a count of fallen allies, so its last unit standing fights at its peak.  
  Rests on: ko; whose: ally; count (scale): { side, where } with ko: true.
- **U-055** A builder whose status survives its knockout passes its buffs to an ally as it falls, at their own length and with the stacks it held, so the party's built-up stacks outlive the unit that built them. *(also sustain; merged X-110)*  
  Rests on: pass (effect op); survivesKO; ko; pass.
- **U-063** Each of its misses adds Accuracy for the rest of the fight, so a unit facing an evasive foe closes in on it, landing more hits and laying more riders as the fight runs.  
  Rests on: hit_missed; Accuracy; stats (status field).
- **U-064** A unit whose hits scale from its own missing HP grows as the foes wear it down: the damage it takes becomes damage it deals, and the party's heals blunt it. *(also burst; merged B-116)*  
  Rests on: hp (scale): max HP minus current; scale: hp (missing).
- **U-065** An HP floor holds a missing-HP hitter at 1 while it lasts, so its build reaches the top and stays there until the floor ends. *(also burst; merged X-080)*  
  Rests on: floor (status field); hp (scale): max HP minus current; floor; hp (missing).
- **U-068** A unit that turns dangerous once hurt: under a line of HP it gains a lasting buff or its hits step up. Above the line it fights plain, so its danger arrives in one step once the fight has worn it down.  
  Rests on: hp_low; hpBelow; when (scale).
- **U-084** A party that grows with every wind-up it breaks: each foe cast it interrupts with Silence adds a stack to its units. *(also debuff or disable)*  
  Rests on: action_interrupted; whose: foe; Silence.
- **U-085** A unit that charges and fires on a cycle: a counter on it sets off a payoff at its cap and empties by its own definition, so each fill is a countdown to the next big blow. *(also burst; merged B-025)*  
  Rests on: status_capped; cap (status field); strike (effect op); damage (effect op); strike; oncePerEvent; drop.
- **U-086** A build that starts high: gear or a seat lays stacks of an affliction on every foe as the fight starts, so the party's upkeep only has to hold a pile it never had to raise. *(also burst)*  
  Rests on: fight_start; apply; seat (formation); Burn; Sunder.
- **U-091** Doom laid on a foe early starts a countdown that kills only a hurt foe, so the party's damage through the countdown decides whether it lands as a finisher. *(also burst, debuff or disable; merged B-129, D-109, X-052)*  
  Rests on: Doom; Fizzle; hpBelow; hp (current).
  Needs a ruling: Doom is enemy-only: the party can't use it until the director says so (vocabulary.md, tiers ruling).
- **U-095** A party that wins late on the rules' own clock: past a set time every unit on both sides deals more, and more at each step, so a party that outlasts the foes' early pressure meets the steps with its sustain intact. *(also sustain)*  
  Rests on: Enrage (RULES.enrage).
- **U-096** A unit that changes how it fights mid-fight: once its counter reaches a line, a new rule switches on, its abilities resolving twice or its swings striking again, instead of only its numbers climbing.  
  Rests on: recast; strike (status field); stacks (unit condition); if (reaction).
- **U-099** A builder that rises at its peak: its counter survives its knockout, so when an ally revives it in the same fight it comes back with every stack it had built instead of starting over.  
  Rests on: survivesKO; Revive; revived.

### At what price (25)

- **U-022** The foes cash the party's Bleed on each other: Bewildered turns a foe's next basic attack onto one of its own allies, a hit that sets off that ally's Bleed at no action of the party's. *(also burst, debuff or disable; merged X-004)*  
  Rests on: Bleed; Bewildered; confuse (status field); confuse.
- **U-025** A vulnerability on a foe that never drains: each party hit on it adds a stack that makes it take more of everything for the rest of the fight. Unlike Sunder it needs no upkeep, so the fight leans ever harder the party's way. *(also debuff or disable)*  
  Rests on: taken (status field); trigger (status field); hit_taken; Sunder.
  Needs a block: A status: a debuff whose stacks raise all damage its holder takes, gained per hit taken and never drained.
- **U-040** Might its basic attacks don't spend climbs to the cap and stays there through every swing, spent only by abilities. A unit that mostly swings keeps its peak, and each ability it casts costs a stack. *(also burst; merged B-055, X-024)*  
  Rests on: Might; spare (status field); spare.
  Needs a block: a status: a Might-like stack whose trigger spares basic attacks (spare: basic), since Might itself can't vary
- **U-058** A unit that grows from blows that never reach its HP: what its Shield soaks and its Aegis blocks becomes stacks, so the party's protection on it is what feeds it.  
  Rests on: stopped (scale event); hit_taken; Shield; Aegis.
- **U-059** Thorns that grow with each hit taken make every foe hit cost its attacker more as the fight goes on. The holder spends no action, and the foes' own pace sets how fast it hurts them.  
  Rests on: Thorns; hit_taken; stats (status field).
- **U-060** A unit that lays an affliction on whoever hits it builds the pile on the foes pressing it without spending an action, so the harder the foes attack, the higher their stacks climb.  
  Rests on: hit_taken; other (effect target); apply; Burn; Bleed.
- **U-062** An evasive unit grows as foes swing at it and miss: each dodge adds a stack at no cost in HP. Blur makes one dodge sure, and foes' Accuracy starves it.  
  Rests on: hit_evaded; Evasion; Blur; Accuracy.
- **U-066** A cap on its own healing keeps a missing-HP hitter hurt whatever the party's healers do. Its own side can't undo the build, so Shields and Defense must keep it standing. *(also burst; merged B-120)*  
  Rests on: healCap (status field); hp (scale): max HP minus current; Shield; healCap; hpBelow; scale: hp (missing).
- **U-069** A counter that grows only while its holder stays above a line of HP makes the party's Shields and heals the build's upkeep; a dip under the line stalls it until the unit is mended.  
  Rests on: hp_high; hpAtLeast; pulse (status field); if (condition).
- **U-070** A unit that grows from the damage it owes: its piece holds its hits as Owed, and its own hits scale from the debt it carries, strongest just before the debt comes due and lands as one blow.  
  Rests on: Owed; owe (status field); debt (status field); stacks (scale).
- **U-071** A counter that grows with each of its holder's actions and halves each time it's hit rewards keeping it out of the foes' picks. Low Aggro, a Taunting ally or Hidden protect the climb; a unit foes reach keeps losing it.  
  Rests on: trigger (status field); drop (status field); hit_taken; Aggro; Taunt; Hidden.
- **U-072** An aura its source keeps on each ally grows while the source stands and ends the moment it falls, so the party's growth rests on keeping one unit alive.  
  Rests on: Per source; ko (status-ended cause).
- **U-073** A stacking ability with no cooldown is cast whenever its wind-up and MP allow, laying stacks as fast as fuel lasts, so the ceiling is bought with MP rather than with slots or time.  
  Rests on: cooldown (ability change); MP; apply.
- **U-074** MP gained past a full pool becomes stacks, so a unit given more MP regen, Clarity or Siphon than it spends turns the surplus into growth instead of waste.  
  Rests on: mp_over; MP regeneration; Clarity; Siphon.
- **U-076** A unit that grows from being mended: each heal it receives adds a stack, so the party's healer is also its damage support. Hurt and healed often, it climbs fastest; Rot on it stalls the build. *(also sustain)*  
  Rests on: healed; Heal; Regen; Rot.
- **U-077** Healing past full becomes stacks, so a unit that rarely needs mending turns the party's spare heals and Regen into growth. *(also sustain)*  
  Rests on: overhealed; Heal; Regen.
- **U-089** A unit whose hits scale from its own Shield pool hits harder as allies pile Shield on it and softer as foes break it: the party's shielding is its damage, and each foe blow takes from both.  
  Rests on: Shield; absorb (status field); stacks (scale).
- **U-097** A build that goes around armour: against a high-Defense foe a fast, light weapon's swings barely hurt, but each lays its riders in full, so the untyped damage the party builds does the killing its hits can't. *(merged X-070)*  
  Rests on: Statuses on hits; riders (status field); Defense; Swing: Light; Burn; Speed (fast); Swing (light); affliction.
- **U-098** A unit that grows from the foes' afflictions: each debuff they lay on it adds a stack it keeps, so a Cleanse that lifts the debuffs later leaves the growth behind.  
  Rests on: status_gained; other (event filter): foe; Cleanse.
- **U-100** Growth that costs its own guard: each stack of a counter raises the unit's damage and lowers its Defense or raises the damage it takes, so the more it builds, the more fragile it gets.  
  Rests on: stats (status field); taken (status field); boosts (status field).
- **U-101** A unit that grows on an ally's life: each of its casts takes an HP price from an ally, never below 1, and adds a stack to itself, so one member's HP fuels another's climb.  
  Rests on: pay (effect op); hp_paid.
- **X-089** hp_low fires again each time HP comes back to its line and drops under, so a unit that pays HP and is healed back over sets off its low-HP answers again and again.  
  Rests on: hp_low; hp_high; pay; Heal.
- **X-100** damage_taken counts what a Shield soaks, so a piece that answers damage taken keeps firing while the holder's HP never moves; one answering hp_lost would sit silent. *(also sustain)*  
  Rests on: Shield; damage_taken; hp_lost.
- **X-141** A piece rewarding allies that wield its wearer's weapon kind makes a party of one kind stronger together, paid for in the speeds and swings it gives up.  
  Rests on: kin; count ({ side, where }).
- **X-155** A piece answering its wearer's missed hits with a stack or a cooldown refund turns a foe's Evasion into the party's build-up, so the dodges it can't prevent still feed it.  
  Rests on: hit_missed; Evasion; cooldown.

## Debuff or disable

### How big and how often (48)

- **D-001** Weaken kept on the foe that hits hardest, laid again on a cooldown shorter than its length, so that foe's every hit lands much smaller all fight. It wins where one foe carries most of the foe side's damage. *(also sustain; merged S-143)*  
  Rests on: Weaken; Refresh; The foe with the highest Attack; Cooldown; Shock.
- **D-005** Weaken and Shock held together on one foe, whose cuts to its hits add, so its blows fall further than either cut alone. It wins against a single foe whose hits must be brought near to harmless. *(also sustain; merged X-009)*  
  Rests on: Weaken; Shock; STATUS.shock.hits.
- **D-006** Shock kept at its cap on a slow foe, or one made slow by Slow, Chill or Stun: it drains only when its holder acts, so the stacks stay and each rare blow is cut by all of them. It wins against one slow, heavy hitter. *(also burst, build up, sustain; merged B-046, S-149, U-016, X-008, X-013)*  
  Rests on: Shock; STATUS.shock.hits; swing; Slow; Chill; Stun; swing (by); highest.
- **D-009** Stun laid again on one foe as soon as the last ends: an ability that only applies Stun waits while every candidate holds it, so quick abilities across the party lock the foe in a chain. It wins against threats that aren't bosses, which resist a chain.  
  Rests on: Stun; Fizzle; Fizzle statuses; RULES.control.
- **D-013** Stun spent on the fastest foe, whose actions fall due many times over its length, rather than on a slow one it may barely delay. A Stun is worth the actions it covers.  
  Rests on: Stun; swing; lowest; KIND_SPEED.
- **D-017** Silence kept on a foe whose threat is its abilities, one that heals, summons, revives or casts, so it can only swing. It wins where that foe's basic attacks are weak.  
  Rests on: Silence; Fizzle.
- **D-019** A reaction to interrupting a foe's cast brings the interrupting ability back sooner, so a foe that keeps trying to cast keeps losing the cast. It wins against a foe that leans on one ability. *(also burst; merged X-143)*  
  Rests on: action_interrupted; cooldown; ready; { less }; Silence.
- **D-024** Chill near its cap and Slow on the same foe: near the cap Chill slows as much as Slow, and the two add, the deepest slow the rules allow. It wins against one foe whose tempo is the threat. *(merged X-015)*  
  Rests on: Chill; Slow.
- **D-025** Chill built on one foe to its cap, slowing it more with each stack until it shatters for damage per stack and a Stun, then built again. It wins by a few big beats of control a fight, aimed at the foe with the most Chill. *(also build up; merged U-013)*  
  Rests on: Chill; status_capped; The foe with the most Chill; Stun.
- **D-028** Chill held below its cap on a boss: its slow isn't a control status, so it feeds no control resistance, and only a shatter's Stun would. It wins by keeping a boss slowed all fight.  
  Rests on: Chill; RULES.control; belowCap.
- **D-030** Each party hit sends the struck foe's basic attack back to a full cooldown, so a slow foe hit more often than it swings never swings, though it still casts. It isn't a status: control resistance, Cleanse and immunity don't meet it.  
  Rests on: hit_lands; cooldown; basic; full; other; KIND_SPEED.
- **D-032** A foe's slowest ability, the one with the longest whole cooldown and so its biggest move, set back to full whatever its others do, so the big move comes late while lesser ones run. It wins against a foe built around one move.  
  Rests on: cooldown; slowest; full.
- **D-035** A wide disable whose cooldown comes a share closer for each foe it lands on, so against a crowd it comes round often and against one foe seldom. It wins against packs.  
  Rests on: cooldown; { lessPct }; count; hit; Area.
- **D-036** A foe's MP taken hit by hit, by Siphon or a draining effect, until it can't pay for its abilities and falls back on basic attacks. It wins against foes that cast, if foes hold MP pools. *(also sustain; merged S-142)*  
  Rests on: Siphon; mp; When an ability is ready; mpBelow; mp (drain); MP is paid when the action resolves; Enemies use the same rules and stats as the party.
- **D-041** Bewildered on the hardest-hitting foe among several: its next basic attack strikes one of its own side, riders and all, so its biggest blow and whatever it carries land on an ally. It does nothing against a lone foe. *(also burst, sustain; merged B-090, S-150, X-005)*  
  Rests on: Bewildered; confuse; riders; cooldown (ready); The foe with the highest Attack.
- **D-042** Bewildered laid again after each swing of a slow foe, so every basic attack it makes goes to its own side. It wins against a slow foe whose swings are its damage, with allies beside it to hit.  
  Rests on: Bewildered; lacks; Cooldown; swing.
- **D-046** A debuff that turns a foe's abilities' target rule to the side opposite the one they aim at, so its damage lands on its allies and its heals on the party. It wins against a foe whose abilities are the danger.  
  Rests on: mods; target; Targeting rules.
  Needs a block: a status: a debuff whose mods replace the holder's target rules with ones on the other side; whether a damage effect may be aimed at the actor's own side needs settling with it.
- **D-047** Sunder stacked on the boss to its cap and kept there by reapplying faster than its pulse takes stacks, so every unit's damage on it, of every kind, is raised all fight. It wins long single-target fights. *(also burst, build up; merged B-052, U-023)*  
  Rests on: Sunder; cap; pulse; Cooldown; taken; untyped; taken (status field); Thorns.
- **D-065** A cap on a foe's healing that strips the HP above it as it lands, not as damage, so no Shield, Aegis or Defense stops it, and keeps every heal from lifting it back. It wins against foes that heal, or hide behind protection. *(also burst)*  
  Rests on: healCap; canHeal.
  Needs a block: a status: a debuff carrying the existing healCap field, laid on a foe.
- **D-067** A debuff whose reaction to its holder being healed deals it damage scaled from the amount healed, so heals hurt it. It wins against a foe side built on healing.  
  Rests on: healed; reactions; amount.
  Needs a block: a status: a debuff with a reaction to healed that deals its holder damage from the event's amount.
- **D-068** A debuff that sends what a foe would gain, a heal or a buff, to a party unit instead, once each time. It wins against a foe fed by its allies. *(also build up, sustain; merged U-093, X-151)*  
  Rests on: divert; divert (status field); source (effect target).
  Needs a block: a status: a debuff carrying the existing divert field, laid on a foe.
- **D-069** Dispel on a shielded foe removes the whole Shield pool at once, so the party's damage, status damage included, reaches HP. It's worth most once the foe has built its pool. *(also build up; merged X-053)*  
  Rests on: Dispel; Shield; remove; absorb; Burn; Bleed; Shock.
- **D-070** Dispel taking a foe's Guard and its other stat buffs, so the party's many small hits stop being blunted. It wins against a foe that hardens itself.  
  Rests on: Dispel; Guard; remove; stat.
- **D-071** Dispel taking a foe's Might or Haste, cutting its damage or tempo back to what it was before it built them. It wins against a foe that grows over a fight. *(also sustain; merged S-153)*  
  Rests on: Dispel; Might; Haste; remove; A random foe with a buff.
- **D-075** Dispel taking a foe's Regen and Clarity, its effects on a pulse, so its healing and mana over time stop. It wins against a foe that outlasts damage.  
  Rests on: Dispel; pulse; Regen; Clarity.
- **D-077** Dispel of one buff at a time on a quick cooldown, so a foe that keeps buffing itself is stripped as fast as it buffs. It wins against a steady self-buffer.  
  Rests on: Dispel; remove; count; order.
- **D-078** Dispel of every buff at once, on a long cooldown, aimed at the foe holding the most, so a foe that has stacked its buffs loses them all in one beat. It wins against a foe that builds up and then strikes.  
  Rests on: Dispel; remove; highest; buffs.
- **D-097** Damage that scales from the target's own Attack, so the hardest-hitting foes take the most. It turns a foe's strength against it. *(also burst)*  
  Rests on: Scaling; target; stat; attack.
- **D-098** Damage, or extra damage on hits, that scales from the target's Defense, so armoured foes take more, not less. It turns a foe's armour against it. *(also burst)*  
  Rests on: Scaling; target; adds; defense.
- **D-099** Damage that grows with the buffs the target holds, so a foe that buffs itself pays for each one. It wins against self-buffers, beside Dispel or in its place. *(also burst)*  
  Rests on: count; buffs; target.
- **D-103** A foe that damage can't finish, behind an HP floor or immunity to damage, knocked out at once by an effect that isn't damage, so nothing stands in the way. It wins against a foe that won't fall. *(also burst)*  
  Rests on: fell; floor; immune:damage.
- **D-110** Bulwark laid on a foe, so after a set number of the party's hits it's Stunned and takes double damage, then refills. It wins for a party of many small hits. *(also build up; merged U-092)*  
  Rests on: Bulwark; Double strike; hit_taken; Stun.
  Needs a ruling: vocabulary.md, tiers: Bulwark is enemy-only; the party can't use it until the director says so.
- **D-111** A foe's Might stacks spent off it, cutting its built-up damage at once. It wins against a foe that stacks Might before it strikes.  
  Rests on: spend; Might.
  Needs a ruling: vocabulary.md: a status runs its own course; no ability spends, shortens or sets off a status early.
- **D-112** A debuff lowering a foe's Defense, or setting it, so the party's many small hits, which Defense blunts most, land fuller. Where Sunder raises every kind of damage alike, this favours small hits. *(also burst; merged B-089)*  
  Rests on: stats; set; Defense.
  Needs a block: a status: a debuff with a stat change down on Defense, or a stat set to a value.
- **D-113** A debuff giving a foe negative Accuracy, which adds to the party's Evasion, so its hits miss more. It wins against foes whose hits fall on evasive units. *(also sustain)*  
  Rests on: accuracy; evasion; stats.
  Needs a block: a status: a debuff with a stat change down on Accuracy.
- **D-114** A debuff that sets a foe's crit chance so it can't crit, taking the spikes out of its damage. It wins against foes whose danger is the crit. *(also sustain)*  
  Rests on: crits; set; Crits.
  Needs a block: a status: a debuff carrying crits by condition with set, laid on a foe.
- **D-115** A lockout of basic attacks only, the reverse of Silence, so a foe whose threat is its swings can only cast. It wins against heavy swingers.  
  Rests on: lockout; basic.
  Needs a block: a status: a debuff whose lockout covers basic attacks only.
- **D-117** A debuff that spreads a foe's single-target abilities over every party unit in even shares, so a blow meant to drop one unit becomes small hits that Defense takes more of. It wins against one-shots. *(also sustain)*  
  Rests on: mods; spread; Defense.
  Needs a block: a status: a debuff whose mods apply spread to the holder's abilities.
- **D-120** A debuff that makes a foe's abilities scale from a stat it holds little of, in place of the one they read, so its big ability shrinks. It wins against a foe with one big scaled move.  
  Rests on: rescale.
  Needs a block: a status: a debuff carrying the existing rescale field.
- **D-121** A debuff that swaps two of a foe's stats as they stand, so its high Attack trades places with a low one. It wins against foes built lopsided.  
  Rests on: swap.
  Needs a block: a status: a debuff carrying the existing swap field.
- **D-123** A debuff that makes a foe's status applications add fewer stacks, so a foe stacking afflictions on the party builds them slowly. It wins against foes that win by build-up. *(also sustain)*  
  Rests on: mods; stacks; affliction.
  Needs a block: a status: a debuff whose mods lower stacks on the holder's applications.
- **D-127** A lockout built unremovable, or labelled a marker, so a foe's Cleanse can't lift it and, as a marker, immunity to debuffs can't stop it. It wins against foes that clear or refuse debuffs.  
  Rests on: unremovable; marker; lockout; immune:debuffs; Cleanse.
  Needs a block: a status: an unremovable or marker-labelled lockout; the marker form bends the vocabulary's line that every status but Owed is a buff or a debuff.
- **D-129** A refresh disable carried on a fast weapon's basic attacks, laid again by every swing well before it lapses, so the foe holds it without gaps; it lands in full whatever Defense takes off the hit. It wins by uptime.  
  Rests on: riders; Refresh; KIND_SPEED; Statuses on hits; Attack speed.
- **D-135** Accuracy on the units whose hits carry disables, cancelling an evasive foe's Evasion, since a dodged hit applies nothing. It wins against evasive foes. *(also build up; merged X-069)*  
  Rests on: Accuracy; Evasion; Statuses on hits.
- **D-138** A debuff that switches off a foe's passive and its other unremovable statuses while held, so a boss's built-in rule stops for a while. It wins against foes whose passive is the threat.  
  Rests on: unremovable; kind.
  Needs a block: a status field: the holder's statuses of a named kind or label do nothing while it holds this.
- **D-140** A dodge answered by a strike out of turn sized from the dodged hit, so a foe's blow comes back at it as a hit. It wins against heavy hitters aimed at an evasive unit. *(also burst)*  
  Rests on: hit_evaded; strike; of; Blur; Evasion.
- **X-021** Weaken halves a foe's hit before the tank's Defense meets it, and Defense takes a bigger share off smaller hits, so Weaken on the tank's attackers cuts what reaches HP by more than half. *(also sustain)*  
  Rests on: Weaken; Guard; Defense.
- **X-103** A Taunting unit whose piece sets its attacker's basic attack back to a full cooldown each time it is hit slows every foe forced to swing at it.  
  Rests on: Taunt; hit_taken; cooldown (basic, full); other.

### How wide (33)

- **D-002** Weaken laid on every foe at once, so the whole foe side hits much softer for its length. It wins against many foes, or a side whose damage comes from numbers and Area rather than one hitter. *(also sustain; merged S-144)*  
  Rests on: Weaken; Area; Every foe.
- **D-007** Shock spread a few stacks deep over every foe, so each foe's hits are trimmed a little and the fast ones pay each time they act. It wins against a crowd where no one foe is the threat. *(also burst, build up; merged B-049)*  
  Rests on: Shock; Area; Every foe.
- **D-010** Stun rolled across the foe side: an ability that applies Stun skips foes already Stunned and takes the next its phrase allows, so each cast locks a fresh foe. It wins against several foes of middling threat. *(merged X-057)*  
  Rests on: Stun; Fizzle statuses; A random foe; Silence; Fizzle.
- **D-011** Stun on every foe at once, a pause in which the whole foe side does nothing, used rarely. It wins by a moment the party fills with its biggest actions. *(also burst)*  
  Rests on: Stun; Area; Every foe; spread.
- **D-018** Silence on every foe at once, a stretch in which the whole foe side can only swing. It wins against a side whose danger is many abilities at once.  
  Rests on: Silence; Area; Every foe.
- **D-021** Slow on every foe, lengthening the whole side's cooldowns, wind-ups and time between attacks, so everything the foes do comes less often. It wins against many foes.  
  Rests on: Slow; Area; Every foe.
- **D-022** Slow kept on the fastest foe, the one whose actions come most often, so the side's busiest attacker loses the most. It wins where one fast foe does the damage. *(also sustain; merged S-146)*  
  Rests on: Slow; Refresh; swing; lowest; Chill; swing (by).
- **D-026** Chill spread thin across every foe and never brought to the cap, a slow on the whole side that thaws only slowly. It wins by giving up shatters for a lasting slow on many foes.  
  Rests on: Chill; belowCap; lowest; { stacks }; Area.
- **D-038** Fixated on the hardest-hitting foe, so its basic attacks and random-aimed abilities go to the unit that fixated it while the other foes pick as usual. It moves one foe's damage onto the unit meant to take it without drawing every foe. *(also sustain; merged S-089)*  
  Rests on: Fixated; fixate; The foe with the highest Attack.
- **D-039** Fixated from each party unit onto a different foe, so each foe's attacks go to the unit best fitted to meet them: the big hitter onto an Aegis, the many small hits onto Defense and Guard. It wins against mixed foe sides. *(also sustain; merged X-041)*  
  Rests on: Fixated; fixate; Aegis; Guard; Defense; Taunt.
- **D-043** Bewildered on every foe at once, so each foe's next swing strikes one of its own side. It wins against a pack of heavy hitters, as a round of damage the foes deal themselves. *(also burst)*  
  Rests on: Bewildered; Area; Every foe.
- **D-045** A debuff with an aim rule, so its holder's basic attacks pick the party unit the rule names, the highest Defense or the one holding a Shield, rather than at random. It steers a foe's swings where they do least, without Taunt. *(also sustain)*  
  Rests on: aim; Basic attacks pick in this order.
  Needs a block: a status: a debuff carrying the existing aim field, laid on a foe.
- **D-048** Sunder raising the party's status damage: a damage-taken modifier reaches Burn, Bleed, Shock, a shatter and Thorns, which the appliers' own boosts can't raise once a status is applied. It wins for a party whose damage is untyped. *(also build up; merged U-010, X-019)*  
  Rests on: Sunder; damage-taken modifiers reach it; A status is fixed when it's applied; Thorns; Burn; taken (status field); Bleed; taken.
- **D-049** Sunder laid on every foe, so a party whose damage is Area as well gets the raise on every target. It wins against packs. *(also burst, build up; merged B-051, U-024)*  
  Rests on: Sunder; Area; Every foe; Thorns.
- **D-054** Marked on the most dangerous foe pulls the party's basic attacks and random-aimed abilities onto it, so it falls first instead of the party's damage scattering. It wins against a side with one priority. *(also burst, build up; merged B-066, D-056, U-087)*  
  Rests on: Marked; focus; Chill; Sunder; status_capped; focus (status field).
- **D-055** Marked on a foe standing behind a Taunting foe, with Seek on the party's actions, so the party's hits follow the Mark past the Taunt. It wins against a foe side that guards its threat. *(also burst; merged B-072, X-040)*  
  Rests on: Marked; Seek; The Taunt rule; seek (status field); Taunt.
- **D-058** Several units each keeping a Mark on a different foe, so the party's picks split by draw among the chosen few and leave the rest alone. It wins against a side where a few foes matter and the rest don't.  
  Rests on: Marked; single; With several Marks, the pick is by draw.
- **D-060** Rot on the one foe being healed, the boss or the foe with the lowest share of its HP, so a foe healer's work, its Regen and its Lifesteal fall short. Shields still work on it. It wins against a healed boss. *(also build up; merged X-058)*  
  Rests on: Rot; healing_received; lowest; hp_share; Lifesteal; Burn; Bleed; Heal.
- **D-061** Rot on every foe, against a side that heals widely or where each foe heals itself. It wins against packs that outlast the party's damage.  
  Rests on: Rot; Area; Every foe.
- **D-064** A debuff on the boss that lets only its own heals land, so a foe healer's heals and Regen on it restore nothing while its self-heals still work. It wins against a boss kept up by another foe.  
  Rests on: heals; Regen.
  Needs a block: a status: a debuff carrying the existing heals field, laid on a foe.
- **D-066** A side rule laid on the foe side, so the healing any foe receives is shared evenly among its living units and heals aimed at the boss mostly go to the foes beside it. It wins against a healed boss with company.  
  Rests on: sharesHeals.
  Needs a block: a status: a debuff carrying the existing sharesHeals side rule, laid on a foe.
- **D-072** Dispel taking a foe's Taunt, so the party's picks go where it wants again. It wins against a foe side that guards its threat behind a taunter. *(also burst; merged B-073, X-054)*  
  Rests on: Dispel; Taunt; The Taunt rule; Seek.
- **D-073** Dispel taking a foe's buff that gives its actions Seek or an aim, so the party's Taunt holds it again and its attacks stop skipping the unit meant to take them. It wins against foes that hunt the party's weak units. *(also sustain)*  
  Rests on: Dispel; action_change; seek; aim; Taunt.
- **D-081** Dispel of one kind of buff from every foe at once, every Shield or every Guard, so a side that buffs itself together loses it together. It wins against packs with a buffer.  
  Rests on: Dispel; Area; remove; kind.
- **D-085** A reaction gives every foe what a unit's basic attacks carry, one swing's worth each, without hits that could be dodged. It spreads a unit's riders across the side at a moment the preparation chose. *(also burst, build up; merged B-037, X-114)*  
  Rests on: riders; Reactions; riders (effect op); Brittle; Bleed; Sunder.
- **D-086** A Stun or Silence ability that resolves again at once, choosing its targets afresh: the Fizzle skip sends the repeat to a foe not yet locked, so one cast locks two. It wins against a pair of threats.  
  Rests on: recast; Fizzle statuses; Stun; Silence.
- **D-091** A reaction to hits on the ally in a named seat lays a debuff on the attacker, so whoever goes after the party's weak point is weakened for it. It guards one unit without drawing the foes' fire. *(also sustain)*  
  Rests on: hit_taken; ally; seat; other.
- **D-106** Hidden laid on a foe the party doesn't want to hit, one that punishes hits or sets something off when it falls, so the party's picks go elsewhere and only Area reaches it. It keeps a dangerous foe out of the party's way.  
  Rests on: Hidden; The Hidden rule; Area.
- **D-125** A debuff with cover on one foe, so the party's big hits on its allies move onto it, statuses and riders included and with no second dodge, even when a foe's Taunt chose the first target. It sends the party's heaviest blows to the foe it wants dead.  
  Rests on: cover; The Taunt rule.
  Needs a block: a status: a debuff carrying the existing cover field, laid on a foe.
- **D-128** Cheap debuffs laid after the one that matters, so a foe's Cleanse that lifts a few at a time takes the cheap ones first. It wins against foes that cleanse; the order removal follows is open.  
  Rests on: remove; count; order; Cleanse.
- **D-134** A single-target disable with Seek, so a foe's Taunt can't pull the party's Weaken or Silence onto the taunter instead of the foe that matters. It wins against guarded threats.  
  Rests on: Seek; The Taunt rule; Weaken; Silence.
- **D-137** Taunt laid on a Hidden foe ends its Hidden, and its Taunt then draws the party's single-target picks to it, so the foe that couldn't be picked becomes the one that must be. It wins against foes that hide.  
  Rests on: Taunt; Hidden; Taunt ends Hidden; The Taunt rule.
- **X-044** Silence leaves foes only their basic attacks, which always obey the Taunt rule, so foes whose abilities carry Seek or Area are left with nothing that gets past the taunter. *(also sustain)*  
  Rests on: Silence; Taunt; Seek; Area.

### When (35)

- **D-003** Weaken laid on a foe during its wind-up, so the ability it is casting comes out much smaller. The attacker's boosts are read as the hit resolves, so a cut that lands mid-cast still counts. *(also sustain)*  
  Rests on: Weaken; casting; action_start; Damage resolves in this order.
- **D-012** Stun laid on a foe as it starts a wind-up: the cast waits the Stun out and then carries on, so it lands later, not never. It wins by moving a foe's big ability past the moment the party's defences or burst come ready.  
  Rests on: Stun; action_start; casting.
- **D-014** Disables laid on every foe at fight_start by gear or a seat, or aimed at foes that haven't acted yet, land before any foe's partly charged first action. It wins the opening, before the foes have done anything. *(also burst; merged X-147)*  
  Rests on: fight_start; acted; RULES.opening; Stun; Silence; Weaken.
- **D-015** Silence aimed at a foe in its wind-up loses the cast and sends that ability on cooldown, so its big move doesn't land this time round. It wins against a foe whose danger comes in one long cast. *(also sustain; merged S-147)*  
  Rests on: Silence; casting; Lost casts; action_interrupted; Stun.
- **D-016** A reaction to a foe starting an action lays Silence on it, by a strike out of turn or an apply, so every cast is answered as it begins rather than when the party's own ability happens to be ready. Bosses soon resist it.  
  Rests on: action_start; strike; apply; owner; Silence; RULES.control.
- **D-020** The party's interrupt made to beat a foe's wind-up by shortening its own, through Cast speed or an ability change that sets its wind-up, so the Silence resolves before the foe's cast does. It wins against foes with short wind-ups.  
  Rests on: Cast speed; cast; Silence; casting.
- **D-023** Slow laid on a foe during its wind-up stretches what is left of it, giving the party's interrupt or burst time to land first. It wins by buying time inside a cast. *(merged X-045)*  
  Rests on: Slow; casting; Time under the hood; Silence.
- **D-029** Control spaced on a boss so its hidden stacks drain between each Stun, Silence or Slow, which then lands for its full length instead of RESISTED and then IMMUNE, each kept for the boss's big moments. It wins boss fights. *(merged X-018)*  
  Rests on: RULES.control; resist; cap; drain; casting; control resistance; Stun; Silence; Slow; Chill.
- **D-031** A foe's next ability pushed back to its full cooldown as it nears ready, so the threat the party can see coming keeps not arriving. It wins against a foe with one dangerous ability on a timer. *(also sustain; merged S-148)*  
  Rests on: cooldown; soonest; full; cooldown (which: abilities, soonest); cooldown (set: full).
- **D-033** Every foe's abilities set to their full cooldown at fight_start, undoing the partial charge they start with, so the foe side's first casts come late while its swings run as usual. It wins the opening against foes that cast.  
  Rests on: fight_start; cooldown; abilities; full; RULES.opening.
- **D-034** A foe's dangerous ability, or its swing, called ready at a moment the party has prepared for, with an Aegis up, a Shield laid or a Taunt on the right unit, so it lands into that and then sits on its full cooldown. It wins by choosing when the foe acts. *(also sustain; merged S-085)*  
  Rests on: cooldown; ready; A foe's action can be called early; Taunt; Aegis; Shield; slot order; Blur; floor; immune:damage.
- **D-037** MP drained from a foe during its wind-up, so when the cast resolves it can't pay: the ability fizzles, does nothing and still goes on cooldown. It wins against one big cast, if foes hold MP pools. *(merged X-061)*  
  Rests on: MP is paid when the action resolves; mp; Siphon; casting.
- **D-044** A party unit made Hidden as a foe winds up an ability aimed at it, so the cast finds its target gone and the foe loses its recovery. It wins against single-target casts, if the target is fixed when the wind-up starts. *(also sustain)*  
  Rests on: Hidden; action_start; Lost casts; The Hidden rule.
- **D-052** Brittle making a crit certain, so a reaction that answers a crit, a Stun or a Silence or a cooldown brought back, goes off on the hit the party chose. It turns a chance into a cue. *(also burst, build up; merged X-027)*  
  Rests on: Brittle; hit_lands; crit; tags; crit (tag).
- **D-057** Marked laid by a rule that follows the fight, on the foe in a wind-up, the foe with a buff or the lowest HP, and moved each time it's laid again, since each applier keeps one Mark. It gives a focus that shifts as the threat does. *(also burst; merged B-067)*  
  Rests on: Marked; single; casting; Targeting rules; The foe with the lowest current HP.
- **D-062** Rot laid in answer to a foe being healed, so it's fresh the moment healing comes and not before. It wins against foes healed in bursts.  
  Rests on: Rot; healed; foe.
- **D-063** A reaction to a foe being healed that Silences the foe that healed it, so each heal a foe gives costs it its abilities for a while. It wins against a foe that heals its side.  
  Rests on: healed; other; Silence.
- **D-074** Dispel by kind block on a foe, taking its Aegis, its HP floor or its cover just before the party's big hit, so the blow lands, the foe can fall, or its allies stand unguarded. It wins against foes that guard once. *(also burst; merged B-081)*  
  Rests on: Dispel; block; Aegis; floor; cover; Shield; Guard; Blur.
- **D-079** A reaction to a foe gaining a buff removes it at once, so foe buffs never get to act. It wins against foes that lean on their buffs, though a foe immune to dispel keeps them.  
  Rests on: status_gained; remove; label; immune:dispel.
- **D-082** A cheap, quick hit sent ahead of the big one to spend a foe's Blur, or a mid-sized hit above its Aegis's line to spend that, so the hit that matters lands. It wins against foes that guard once, by ability order. *(also burst; merged B-083, X-072)*  
  Rests on: Blur; Aegis; dodge; block; slot order; Speed (fast); Swing (heavy).
- **D-083** A unit that gains a foe's debuff passes every debuff it holds onto that foe: it's rid of them, and they land on the foe fresh, at their own length. It turns the foes' own disables back on them. *(also sustain; merged S-114, X-108, X-112)*  
  Rests on: pass; status_gained; other; debuff; remove (move); Cleanse.
- **D-092** A reaction to a foe's knockout lays a disable on another foe, so control carries across a wave of foes as they fall. It wins against packs and summons.  
  Rests on: ko; foe.
- **D-093** A reaction to a foe's Stun or Silence running out lays the next disable on it, a Slow or a Weaken, so the control tails off instead of snapping off. It leaves the foe no clean gap.  
  Rests on: status_ended; expired; Slow; Weaken.
- **D-094** A disable held for a line on a foe's HP, by a reaction to its going under it or a condition, so a foe that turns dangerous past that line is locked out or Weakened as it does. It wins against foes with phases.  
  Rests on: hp_low; line; hpBelow; Stun; Silence.
- **D-095** A party unit's reaction to its own HP falling under a line lays Weaken on every foe, or Stuns the foe that hit it, so the disable comes when the party is losing. It wins close fights. *(also sustain; merged S-145)*  
  Rests on: hp_low; line; Weaken; Stun; assailant.
- **D-104** A foe taken out of the fight by being replaced rather than knocked out, so nothing reacts to its fall: no blast, no split, no revive. It wins against foes whose death is the danger. *(merged X-132)*  
  Rests on: replace; ko.
  Needs a ruling: combat.md, Encounters and enemies: no unit leaves a fight alive; nothing flees, fades or escapes.
- **D-105** Owed laid on a foe banks the party's hits, after Defense, and lands them as one lump later, so its HP lines and its reactions to losing HP wait and then pass at once. Its price: the lump meets its Aegis and Shield. *(also build up; merged U-090)*  
  Rests on: Owed; owe; debt; hp_low; owe (status field); debt (status field); stacks (scale).
- **D-108** A unit's Owed, which banks the foes' hits on it, passed with its other markers onto a foe, which then takes the debt when it comes due. It turns the foes' damage back on them; whether Owed can move is open. *(also sustain)*  
  Rests on: Owed; pass; marker; debt.
- **D-116** A debuff that lengthens a boss's wind-ups or cooldowns through changes to its abilities rather than Slow, so it never feeds control resistance. It keeps a boss's tempo down all fight.  
  Rests on: mods; wind; cooldown; RULES.control.
  Needs a block: a status: a debuff whose mods raise wind and cooldown on the holder's abilities.
- **D-118** A debuff that ties a foe's abilities together, each waiting until all are ready and then cast as one, so it casts far less often but all at once, and the party knows when. Its price is the spike when they land.  
  Rests on: mods; together.
  Needs a block: a status: a debuff whose mods apply together to the holder's abilities.
- **D-119** A debuff that makes a foe pick its abilities at random each time it's free, breaking a rotation that opens with its strongest move. It wins against foes whose pattern is the danger.  
  Rests on: order.
  Needs a block: a status: a debuff carrying the existing order field.
- **D-124** A debuff that makes a foe's abilities wait until it holds no Chill, or another state the party keeps up, so it can't cast while that state stays on it, and no control resistance counts it. It wins against bosses.  
  Rests on: mods; wait; lacks; RULES.control.
  Needs a block: a status: a debuff whose mods add wait to the holder's abilities.
- **X-095** Cast speed shortens the party's wind-ups, so foes that Silence a casting unit find little casting to catch and the party's spells resolve.  
  Rests on: Cast speed; Silence; casting.
- **X-150** A Stun or Silence aimed at the foe whose ability is nearest ready catches the big cast before it starts, instead of landing on whichever foe the draw picks.  
  Rests on: Stun; Silence; highest.
  Needs a block: a target rule: a `by` reading the cooldown left on a unit's soonest ability
- **X-158** A piece that sets a foe's abilities back to a full cooldown when it gains Stun turns each Stun into a long stretch of basic attacks after it ends.  
  Rests on: status_gained; Stun; cooldown (abilities, full).

### At what price (14)

- **D-040** Fixated pinning a foe on a unit that punishes or wastes its hits, with Thorns, Evasion or Blur, so that foe's attacks hurt it or miss. It wins against a fast, many-hitting foe, which pays Thorns on every blow. *(also burst; merged B-096)*  
  Rests on: Fixated; Thorns; Evasion; Blur; strike.
- **D-076** Dispel taking a foe's reactive buffs, the ones that answer the party's hits, so attacking it stops costing the party. Whether a status a stat brings, such as Thorns, can be removed is open.  
  Rests on: Dispel; reaction; Thorns.
- **D-080** A Dispel that moves what it removes onto the caster or an ally, so a foe's Shield, Might or Haste ends up working for the party. The foe pays twice for each buff it lays. *(also burst, build up, sustain; merged B-059, X-111)*  
  Rests on: Dispel; remove; move; remove (move); Might; Haste.
  Needs a block: remove's `move` field is listed without a meaning; it needs defining as moving the removed statuses onto the actor.
- **D-087** A piece that lays one of several disables at random on each trigger, so the foe side carries a shifting mix that no single immunity answers. Its price is the dice: the one that's needed may not come.  
  Rests on: one; immune:status:<status>.
- **D-088** A disable carried by hits with a chance to land, or set off by crits, on a fast weapon, so control comes often but never on cue. Its price is reliability.  
  Rests on: apply; chance; hit_lands; crit; KIND_SPEED.
- **D-089** A unit whose reaction lays a debuff on whoever hits it, Weaken, Slow or Shock, so the foes that attack it soften themselves. Its price is being hit first. *(also sustain; merged X-102)*  
  Rests on: hit_taken; other; Weaken; Slow; Shock; Taunt.
- **D-090** A unit that lays a debuff on each attacker it dodges, so Evasion and Blur turn misses into disables. It wins against foes that swing often at an evasive unit; its price is the hits that land. *(also sustain)*  
  Rests on: hit_evaded; other; Evasion; Blur.
- **D-122** A debuff that puts an HP price on a foe's abilities, so each cast costs it HP, though never below 1. It makes a foe that casts often pay for it. *(also burst)*  
  Rests on: mods; hp; pay; hp_paid.
  Needs a block: a status: a debuff whose mods add an HP price to the holder's abilities.
- **D-126** A debuff with soak on a foe that casts, so the party's damage drains its MP before its HP and its spells starve. Its price is the HP spared meanwhile; it needs foes to hold MP pools.  
  Rests on: soak; When an ability is ready.
  Needs a block: a status: a debuff carrying the existing soak field, laid on a foe.
- **D-133** A disable whose price is the caster's HP rather than MP, so the unit holding a foe down spends its own life to do it, which the foes' hits make dangerous. It wins where the lock matters more than that unit's HP.  
  Rests on: pay; hp; hp_paid.
- **D-136** A debuff each applier keeps its own copy of, lasting the fight on every foe and ending when its applier is knocked out, so the disable holds while one unit stands. Its price is that unit: when it falls, the foes go free.  
  Rests on: Per source; perSource; duration; ko.
  Needs a block: a status: a per-source debuff with no duration that ends when its source is knocked out.
- **D-139** A lockout that ends at the first hit on its holder, laid on one foe while the party's picks go elsewhere, by a Mark on another foe or Hidden on it. Its price is leaving that foe alone; status damage doesn't wake it.  
  Rests on: lockout; hit_taken; remove; Marked; Hidden.
  Needs a block: a status: a lockout with a reaction to hit_taken that removes itself.
- **X-109** A piece whose price is a debuff on its own wearer, paired with a pass to a foe, turns the price into an attack: the wearer takes it, then hands it over.  
  Rests on: pass; debuff.
- **X-149** An answer to a boss resisting or ignoring control would let a piece turn the wasted control into damage or stacks, so chaining control past the cap still pays. *(also burst)*  
  Rests on: control resistance.
  Needs a block: an event: control_resisted, fired when control resistance shortens or blocks a control status

## Sustain

### How big and how often (46)

- **S-001** A quick, cheap Heal aimed at the ally with the lowest share of max HP tops up whoever is worst off between blows. Small mends, often, keep anyone from drifting toward a knockout while incoming damage stays under their rate.  
  Rests on: Heal; The ally with the lowest share of max HP; quick cooldown (COOLDOWN); MP costs: skills are cheap.
- **S-002** One large Heal on a long cooldown, at a spell's MP cost, restores a big share at once and can turn a fight that was being lost. Between casts the party holds on with whatever else it has.  
  Rests on: Heal; long cooldown (COOLDOWN); MP costs: spells cost several times more.
- **S-006** A Heal scaling from the target's missing HP is small on a scratched ally and large on one near a knockout, so the same cast is a top-up or a rescue.  
  Rests on: Heal; hp (max HP minus current); Every amount states its own scaling.
- **S-011** Crit chance on a mender lets its heals crit, and a healing status can be given crits on its pulses, so mending comes in uneven lumps that Crit damage makes larger.  
  Rests on: Crit chance; Crit damage; crit (status field: crits on its pulses).
- **S-014** Each hit the unit takes brings its protective ability some ticks closer, so the harder it's pressed, the more often it shields or mends.  
  Rests on: hit_taken; cooldown (set: less); cooldown (which: an ability by id).
- **S-016** Haste, Cooldown or Cast speed on the mender shortens its cooldowns and wind-ups, so heals come more often and land closer to the damage they answer.  
  Rests on: Haste; Cooldown; Cast speed.
- **S-017** A reaction to the mender's heal resolving recasts it free, choosing its target afresh by its own rule, so a second ally, or the same one if it's still lowest, is mended for one cast's MP.  
  Rests on: recast; action_resolve; Heal.
- **S-027** Regen kept on the unit drawing fire, laid again by another unit before it lapses, returns a share of max HP on every pulse: a steady trickle that matches steady incoming damage without big casts.  
  Rests on: Regen; Refresh; A buff a unit puts on itself has a cooldown longer than the buff lasts.
- **S-029** Regen and the Shield cap both read the holder's max HP, so raising max HP on the unit being hit grows its trickle and its pool together.  
  Rests on: Regen; Shield; max HP.
- **S-034** Healing past full, Regen pulses included, fires overhealed, and a reaction adds that much Shield, so a party mended ahead of the damage banks the surplus as a buffer. *(merged X-104)*  
  Rests on: overhealed; amount; Shield; Regen; Heal.
- **S-038** Raising healing received on the unit drawing fire makes every heal, Regen pulse and Lifesteal on it larger, and blunts Rot, which works by lowering that stat.  
  Rests on: healing_received; Rot.
- **S-039** Lifesteal on a slow, heavy-swinging unit heals in lumps on each blow, and holds up against Defense, which takes little from big hits.  
  Rests on: Lifesteal; Swing: heavy; Speed: slow; Defense.
- **S-040** Lifesteal on a fast or double-striking unit heals a little on many hits, a steady trickle rather than lumps, but weak against high Defense, which takes most from small hits.  
  Rests on: Lifesteal; Speed: fast; Double strike; Defense.
- **S-042** A piece that heals the unit a set amount on each hit it lands favours many hits over big ones: fast weapons, Double strike and multi-hit abilities, whatever Defense takes off each.  
  Rests on: hit_lands; heal; Double strike; Speed: fast.
- **S-049** A rewind on a cooldown, aimed at the ally with the lowest share of max HP, undoes whatever that ally took in the last stretch: much after a burst, nothing in a lull.  
  Rests on: rewind; The ally with the lowest share of max HP.
- **S-053** A quick, cheap Shield refills the pool between blows, so the holder rarely loses HP while the incoming damage stays under the refill rate.  
  Rests on: Shield; quick cooldown (COOLDOWN).
- **S-054** A large Shield fills the pool to its cap in one cast on a long cooldown, a second health bar the foes must empty before they reach HP.  
  Rests on: Shield; long cooldown (COOLDOWN); Shield's cap (a share of the holder's max HP).
- **S-058** A Shield scaling from the number of foes standing is large while many are hitting and shrinks as they fall.  
  Rests on: Shield; count ({ side, where }).
- **S-063** Aegis kept on the unit drawing fire stops the next hit above its share of max HP, so a foe's slow heavy blow or big spell lands for nothing while small hits pass. *(merged X-030)*  
  Rests on: Aegis; Fizzle; Taunt.
- **S-065** Aegis and Shield soak Doom's untyped burst, so an armed ally survives the countdown even when hurt. *(merged X-050)*  
  Rests on: Doom; Aegis; Shield.
- **S-066** Owed gathers every hit on its holder into one lump of untyped damage that lands later, and Aegis, which lets small hits pass, blocks that whole lump if it clears its share of max HP. *(merged X-038)*  
  Rests on: Owed; debt; Aegis; block.
- **S-069** Cover moves only hits above a share of an ally's max HP onto the holder, exactly the blows Aegis exists to stop, so Aegis or a floor on the holder turns the moved spikes to nothing. *(merged X-077)*  
  Rests on: cover; Aegis; floor.
- **S-070** Guard on the unit drawing fire takes a large share off each small blow, since Defense cuts small hits most, so swarms and fast foes barely scratch it while big hits still land. *(merged X-029)*  
  Rests on: Guard; Defense; RULES.armorK; Taunt.
- **S-076** critsTaken set to never means no hit on the unit crits, so its damage taken stays even, a foe's crit spikes are gone, and Brittle laid on it does nothing.  
  Rests on: critsTaken; Brittle; Crits.
- **S-077** Blur laid again on a quick cooldown cancels the next hit whatever its size, best against slow foes whose few big blows each land into a fresh Blur.  
  Rests on: Blur; quick cooldown (COOLDOWN).
- **S-079** A piece's reaction to hit_evaded heals the unit or gives it MP, so Evasion and Blur turn each miss into mending or fuel as well as a blow avoided.  
  Rests on: hit_evaded; Evasion; Blur; heal; mp.
- **S-081** Taunt or high Aggro on a unit with high Evasion sends foes' picks where many miss: a swingy defence, strong until a run of hits lands, and no help against status damage.  
  Rests on: Taunt; Aggro; Evasion.
- **S-099** A floor that ends as soon as it saves its holder, removed by a reaction when HP goes under a low line, turns one killing blow into a stand at 1 HP: a single reprieve rather than a window.  
  Rests on: floor; hp_low; remove.
- **S-102** A status raising immune:damage means its holder takes no damage at all while it lasts, the strongest cut, on a long cooldown or at a line.  
  Rests on: immune:damage.
- **S-116** A Cleanse that also heals for each debuff its target held makes the heaviest debuffing feed the largest mends. *(merged X-113)*  
  Rests on: Cleanse; count (debuffs); Heal; status_ended (cause removed).
- **S-117** Revive on a very long cooldown raises a knocked-out ally with some HP and every action on full cooldown, a body back in the fight that draws picks and soon acts.  
  Rests on: Revive; very long cooldown (COOLDOWN).
- **S-126** MP regen from gear and a seat keeps a caster's spells coming near their cooldowns on a steady drip, where a dry pool would leave it swinging.  
  Rests on: MP regeneration; seat; MP_REGEN.
- **S-127** Clarity restores a share of max MP on each pulse, so on the caster with the deepest pool and the costliest spells it gives the most.  
  Rests on: Clarity; max MP.
- **S-130** Siphon on a fast-swinging unit takes MP from each foe it hits, so its abilities run on what its weapon draws, and Attack speed or Double strike makes the draw quicker.  
  Rests on: Siphon; Attack speed; Double strike.
- **S-152** Stun on the foe with the highest Attack keeps its blows off for the Stun's length; against bosses, control resistance shortens each one and then turns them away. *(also debuff or disable)*  
  Rests on: Stun; The foe with the highest Attack; control resistance (RULES.control).
- **S-161** An effect that applies one of several protective statuses at random, Shield, Guard, Blur or Regen, gives the unit some protection every cast but not the one it needs for sure.  
  Rests on: one; Shield; Guard; Blur; Regen.
- **S-162** A reaction to being hit with a chance to lay Blur or Aegis arms the unit at random moments, more often the more it's hit.  
  Rests on: apply (chance); hit_taken; Blur; Aegis.
- **S-168** A share of every hit on each ally moves to the holder, so the fragile take less of everything while the holder takes a steady stream.  
  Rests on: cover.
  Needs a block: A status field that moves a set share of each hit on another ally to the holder; cover moves only whole hits.
- **S-170** Every hit on the holder is cut down to a ceiling, a share of its max HP, a lasting answer to big hitters where Aegis stops one blow and ends.  
  Rests on: Aegis; block.
  Needs a block: A status field that cuts each hit on the holder to a set share of its max HP; block stops one hit whole, then ends.
- **S-173** Each hit's damage on the holder is held back and paid out over the following ticks instead of at once, so spikes become a trickle that Regen and heals can match.  
  Rests on: Owed; debt; Regen.
  Needs a block: An Owed-like debt that pays out its stacks on a pulse over its length; debt lands only when it runs out.
- **S-174** Lockouts on party units land shorter and then not at all, as control resistance does for bosses, a gradual answer where immunity is all or nothing.  
  Rests on: control resistance (RULES.control); Stun; Silence; Slow.
  Needs a ruling: vocabulary.md, 'Statuses are universal': control resistance is bosses' alone.
- **S-175** The party mends for a share of the damage its foes take from Burn, Bleed and Shock, a steady heal that needs no hits. *(also build up)*  
  Rests on: damage_dealt (status); Burn; Bleed; Shock; Lifesteal.
  Needs a ruling: vocabulary.md, 'A status scales by its stacks, never by its applier': a status's damage belongs to its holder, with no lifesteal from it.
- **S-176** An effect sets off all of a Regen's remaining pulses at once, turning a slow mend into a sudden one when an ally drops low.  
  Rests on: Regen; hp_low.
  Needs a ruling: vocabulary.md, 'A status runs its own course': no ability spends, shortens or sets off a status early.
- **X-031** Aegis blocks the one big hit above its line and Shield soaks the small ones under it, so a unit holding both covers both ends of the foes' damage.  
  Rests on: Aegis; Shield.
- **X-033** Aegis's line is a share of its holder's max HP, so on a frail unit it blocks almost any blow big enough to fell it, where on a big tank it blocks only the largest.  
  Rests on: Aegis; max_hp.
- **X-063** A Shield that scales from Defense lands larger on a Guarded unit, so Guard laid first makes every Shield after it bigger.  
  Rests on: Guard; Shield; Defense.

### How wide (42)

- **S-003** A Heal aimed at every ally mends all three at once, for less each. It answers foes whose damage is spread or random, and Area hits that land on everyone.  
  Rests on: Heal; Every ally; Area.
- **S-004** A Heal on the caster and on the other ally with the lowest share of max HP keeps a pair standing, the mender included, without spending on the third.  
  Rests on: Heal; The other ally with the lowest share of max HP.
- **S-005** A Heal aimed at the ally with the highest Attack keeps the party's main damage dealer standing rather than whoever is most hurt, so the fight ends before the others fall.  
  Rests on: Heal; The ally with the highest Attack.
- **S-026** Each basic attack the unit lands heals or shields the ally with the lowest share of max HP, so a damage dealer mends the others with no MP and no ability slot.  
  Rests on: hit_lands; basic (tag); heal; Shield; The ally with the lowest share of max HP.
- **S-028** Regen on every ally spreads a slow mend over the whole party, an answer to foes whose damage is spread or random.  
  Rests on: Regen; Every ally.
- **S-035** The part of a heal past full goes to the other ally with the lowest share of max HP, so mending that lands on a full unit is passed to one that needs it.  
  Rests on: overhealed; amount; heal; The other ally with the lowest share of max HP.
- **S-037** A side rule shares every heal any ally receives evenly across the living party, so single-target heals and Lifesteal become party-wide mending, thinner on each. *(merged X-076)*  
  Rests on: sharesHeals; Heal; Lifesteal.
- **S-041** Lifesteal on a hit aimed at every foe heals for each foe struck, so the more foes stand, the more each cast restores. *(merged X-059)*  
  Rests on: Lifesteal; Area; area (tag).
- **S-043** A unit that draws fire with Taunt or high Aggro and mends itself through Lifesteal or a heal on itself is its own mender, leaving the rest of the party free of keeping it up.  
  Rests on: Taunt; Aggro; Lifesteal; Heal.
- **S-046** Divert on a damage dealer sends what its Lifesteal would heal it to another unit, so the party's hardest hitter mends the one drawing fire.  
  Rests on: divert; Lifesteal.
- **S-055** An ability that adds Shield skips a capped ally for the next one its phrase allows, so one caster brings the whole party up to cap in turn and waits when all are full.  
  Rests on: Shield; A Shield at its cap counts as already there.
- **S-056** Shield soaks status damage too, so it holds back Burn, Bleed and Shock, the untyped damage that Defense and Evasion never meet.  
  Rests on: Shield; untyped; Burn; Bleed; Shock.
- **S-064** An ability that applies Aegis skips allies already holding it, so one caster arms the whole party in turn against Area spells and big blows on anyone.  
  Rests on: Aegis; Fizzle statuses: skips targets that already have it.
- **S-071** Guard on every ally, or a party effect raising Defense, blunts foes whose many small hits are spread across the party, with prevention in place of mending.  
  Rests on: Guard; Every ally; party effect; Defense.
- **S-072** A damage-taken cut that names hits lowers every blow but leaves status damage untouched, an answer to hitters that does nothing against Burn or Bleed.  
  Rests on: taken; physical (tag); damage-taken modifiers reach it, except one that names hits alone.
- **S-073** A damage-taken cut that names area hits lowers the foes' every-foe attacks, which Taunt and Hidden can't steer, and leaves single-target hits to whoever draws them.  
  Rests on: taken; area (tag); Area; Taunt; Hidden.
- **S-074** A damage-taken cut that names one status's tag lowers that status's pulses alone, a narrow answer to foes that lean on one damage over time.  
  Rests on: taken; <status> (tag).
- **S-075** A damage-taken cut that names ability hits, or basic attacks, answers foes whose harm comes from spells alone or from swings alone.  
  Rests on: taken; ability (tag); basic (tag).
- **S-078** Blur on every ally lets each dodge one hit outright, an answer to Area spells and spread blows that Accuracy can't touch.  
  Rests on: Blur; Every ally; Accuracy.
- **S-080** A dodged hit applies nothing and isn't taken, so Evasion and Blur keep off the Stun, Bleed or Rot that foes' hits carry, and the Bleed a taken hit would set off, as well as the blow itself.  
  Rests on: Evasion; Blur; A dodged hit applies nothing.
- **S-082** Taunt forces foes' single-target picks onto the unit built to take them, so the rest of the party is reached only by Area and by Seek.  
  Rests on: Taunt; The Taunt rule; Seek; Area.
- **S-083** High Aggro from gear and a seat makes one unit draw most foes' picks without Taunt; some leak to the others, but unlike Taunt it still pulls Seek's picks, which weigh by draw.  
  Rests on: Aggro; draw; seat; A random foe that isn't Taunting.
- **S-084** One unit Taunts and another carries high Aggro, so the Taunter takes the ordinary picks and the second takes the Seek picks that pass the Taunt, leaving the third rarely picked by either. *(merged X-043)*  
  Rests on: Taunt; Aggro; Seek; A random foe that isn't Taunting.
- **S-087** With even Aggro and no Taunt, foes' picks spread over the party, and party-wide mending answers damage that no single unit has to survive alone.  
  Rests on: Aggro; draw; Every ally; Regen; Heal.
- **S-088** A side rule weighs foes' picks by max HP in place of Aggro, so most blows go to the unit with the most health and few to the smallest. *(merged X-075)*  
  Rests on: drawBy; max HP; max_hp; Regen; Shield.
- **S-091** Against foes that pick the highest current HP that isn't Taunting, a second unit with a big, topped-up pool takes those picks beside the Taunter, so they go to it and not to the fragile.  
  Rests on: The foe with the highest current HP that isn't Taunting (Skips the tank); Taunt; max HP.
- **S-092** Units summoned on the party's side give foes more to pick from, so every pick that lands on one is a blow kept off the party. *(merged X-131)*  
  Rests on: summon; draw; Taunt; Aggro.
- **S-093** Hidden on the mender keeps its heals coming while foes' picks, Seek included, go elsewhere; only Area reaches it. *(merged X-035)*  
  Rests on: Hidden; The Hidden rule; Seek; Area; Shield.
- **S-094** Hidden on two allies leaves foes only the third to pick, which Taunt can't do against Seek or picks that ignore Aggro; given to all three, the last in seat order stays in the light. *(merged X-034, X-036)*  
  Rests on: Hidden; Someone stays in the light; Seek; A random foe, ignoring Aggro (Fickle); party effect; Taunt; Area; seat order.
- **S-097** Cover moves any hit that would take more than a share of another ally's max HP onto the holder, so the fragile are safe from spikes while small hits still reach them. *(merged X-078)*  
  Rests on: cover; Guard; Defense.
- **S-104** Immunity to lockouts by kind keeps a unit from Stun and Silence, so the mender's casts and the Taunter's Taunt come round whatever foes lay.  
  Rests on: immune:kind:<kind>; lockout (effect kind); Stun; Silence.
- **S-106** Immunity to Dispel keeps the party's Shields, Taunt and Regen on against foes that strip buffs, where one Dispel would empty a whole Shield pool.  
  Rests on: immune:dispel; Dispel; Shield.
- **S-107** Immunity to Rot keeps every heal on the unit at full strength against foes that lean on cutting healing.  
  Rests on: immune:status:<status>; Rot.
- **S-109** A Cleanse aimed at the ally holding the most debuffs lifts harm where it has gathered, on whichever unit the foes' debuffs have found.  
  Rests on: Cleanse; debuffs (by); mostDebuffs.
- **S-111** A Cleanse on every ally lifts debuffs across the party at once, against foes that lay them widely, on a longer cooldown than a single lift.  
  Rests on: Cleanse; Every ally.
- **S-112** A removal narrowed to lockouts lifts only Stun and Silence, aimed at an ally holding either, so a stopped mender or Taunter acts again at once.  
  Rests on: remove (kind); lockout (effect kind); hasAny; Stun; Silence.
- **S-120** A status that survives the knockout reacts to its holder's own knockout by raising it, once a fight through a marker, so the unit needs no reviver.  
  Rests on: survivesKO; ko; revive; marker.
- **S-129** Clarity on every ally keeps several casters fuelled at once.  
  Rests on: Clarity; Every ally.
- **S-131** Siphon on a hit aimed at every foe draws MP from each one struck, richest against many foes. *(merged X-060)*  
  Rests on: Siphon; Area.
- **S-132** An ability that restores MP to the ally with the lowest MP share lets a unit with fuel to spare, or one that mostly swings, keep the party's main caster going.  
  Rests on: mp; mp_share (by).
- **S-163** When the unit drawing fire gains Regen, Guard or Aegis, share gives an ally a copy, so each protection laid on the front reaches a second unit.  
  Rests on: share; status_gained; Regen; Guard; Aegis.
- **S-169** A side rule shares the damage any ally takes evenly across the living party, as sharesHeals does for healing, so focused damage can't drop one unit before all three.  
  Rests on: sharesHeals.
  Needs a block: A side-rule status field, like sharesHeals for healing, that splits damage any unit on the side takes evenly across its living units.

### When (53)

- **S-008** A party-wide Heal whose condition asks for several allies under a line holds until the damage has spread, then mends them all in one cast.  
  Rests on: Heal; Every ally; atLeast (condition); hpBelow.
- **S-009** A heal slotted first, with a condition that an ally is under a line, takes the unit's turn only when someone is low; otherwise the unit spends its turns on damage, since a free unit uses the first ready ability in slot order.  
  Rests on: slot order; trigger condition; hpBelow; Heal.
- **S-012** When an ally drops under a line, a reaction makes the mender's heal ready now, or gives the mender a status that makes it wind up in a moment, so the drop is answered at once instead of after a cooldown or a wind-up.  
  Rests on: hp_low; cooldown (set: ready); mods: cast; Heal.
- **S-015** At the fight's start a piece makes the unit's protective ability at least half charged, so it comes early in every fight whatever cooldown it carried in.  
  Rests on: fight_start; cooldown (set: atMost); Cooldowns carry between fights.
- **S-021** Each foe knocked out heals the party, so mending arrives in bursts as foes fall and is richest in crowded fights.  
  Rests on: ko; whose: foe; heal.
- **S-023** A marker whose expiry heals its holder sets a lump of mending to land a set time after it's laid, so it arrives after the stretch of damage that follows the cast.  
  Rests on: marker; duration; status_ended (cause: expired); heal.
- **S-024** A heal aimed at the ally holding Doom brings it to full before the countdown ends, since Doom's burst kills only a hurt unit. *(merged X-049)*  
  Rests on: Doom; Heal; has (unit condition); Regen.
- **S-025** A mender's heals grow for each knocked-out ally, so a party down a unit is mended harder by those still standing, a late answer to a fight going wrong.  
  Rests on: mods: heal; mods: times; count ({ side, where }); ko (unit condition).
- **S-030** A formation's party effect or a seat gives Regen at the fight's start, so the party mends through the opening with no slot or MP spent, until it lapses.  
  Rests on: party effect; seat; fight_start; Regen.
- **S-031** Each hit taken refreshes Regen or Guard on the unit, so the protection lasts exactly as long as the foes keep hitting it and lapses when they stop.  
  Rests on: hit_taken; Regen; Guard; Refresh.
- **S-032** A stacking mend, added by quick applications and losing stacks on its pulse, heals per stack, so it starts small and climbs only while someone keeps feeding it. *(also build up)*  
  Rests on: Stacks; pulse; drop; stacks (scale); heal.
- **S-033** A healing pulse whose condition asks for its holder under a line mends only while the holder is hurt: idle while it's healthy, awake when it isn't.  
  Rests on: pulse; if; hpBelow.
- **S-044** Mending read from damage dealt, such as Lifesteal, grows as the enrage raises every unit's damage, while share-of-max-HP mending stays flat, so it keeps pace late in a long fight.  
  Rests on: Enrage; Lifesteal; Regen.
- **S-045** Late in a long fight, share cuts such as Weaken and damage-taken modifiers keep their share as the enrage grows every hit, while Defense takes a smaller share of bigger hits and a Shield soaks a fixed amount. *(also debuff or disable; merged D-004)*  
  Rests on: Enrage; Weaken halves a hit at any knob; taken; Defense; Shield; Weaken; The difficulty dials.
- **S-047** A reaction to hit_lands adds Shield worth a share of the hit's amount, so the unit builds a buffer ahead of the damage, banking past full HP and working under Rot, which cuts Lifesteal.  
  Rests on: hit_lands; amount; Shield; Rot.
- **S-048** When an ally drops under a line, rewind sets its HP back to what it was some ticks ago, erasing the burst that put it there; it isn't healing, so Rot doesn't cut it.  
  Rests on: rewind; hp_low; Rot.
- **S-052** A seat or piece gives Shield or Aegis at the fight's start, so the opening blows, which the foes' partly charged first actions bring early, meet a buffer before HP.  
  Rests on: Shield; Aegis; fight_start; seat; RULES.opening.
- **S-057** Under Rot only Shield still works, so a party facing healing cuts turns to building pools ahead of the damage instead of mending after it. *(merged X-037)*  
  Rests on: Rot; Shield; Heal.
- **S-059** When a Shield is emptied by damage, a reaction gives Aegis or Guard, so breaking one layer exposes another instead of HP.  
  Rests on: status_ended (cause: stacks); Shield; Aegis; Guard.
- **S-062** A stacking absorb, one stack per point and losing stacks on a pulse, is strong right after it's laid and soon gone, unlike the Shield pool, which waits for damage however long it takes.  
  Rests on: absorb; Stacks; drop; pulse; Shield.
- **S-067** Owed holds each hit's damage on its icon and lands it all at once a set time after the first, so a foe's burst can't knock its holder out on the spot, and it keeps acting meanwhile.  
  Rests on: Owed; debt; OWED.
- **S-068** While Owed's lump waits, the party lays Shield or a floor on its holder, which meets the lump as it lands, so a burst is paid for by protection laid after it. *(merged X-039)*  
  Rests on: Owed; debt; Shield; floor.
- **S-090** When a foe's hit lands on the mender, a reaction fixates that foe on the unit built to take it, so whatever turns on the mender is pulled away. *(also debuff or disable)*  
  Rests on: Fixated; hit_taken; other (reaction target).
- **S-095** When an ally drops under a line, Hidden takes it out of foes' picks for a set time while mending brings it back.  
  Rests on: hp_low; Hidden.
- **S-096** Hidden from a seat or piece at the fight's start keeps the fragile out of the foes' first picks, while the opening's partly charged actions land on whoever stays seen.  
  Rests on: Hidden; fight_start; seat; RULES.opening.
- **S-098** When a unit drops under a line it gains a floor for a set time, so no blow can knock it out while heals and shields catch up.  
  Rests on: floor; hp_low.
- **S-100** An HP price can take its payer under its own line, firing hp_low, so a unit sets off its emergency protections, a floor, Hidden or a restart, on its own schedule. *(also burst, build up; merged X-088)*  
  Rests on: pay; hp_low (whatever took it there: a price); floor; Hidden; restart; hp_low.
- **S-101** Emergency protection laid at a line, a floor, soak or a damage-taken cut, is lifted by a reaction when the unit is mended back over that line, so it lasts exactly as long as the danger, not a set time.  
  Rests on: hp_low; hp_high; remove; floor; soak; taken.
- **S-105** A Cleanse that also lays immunity to debuffs for a set time, or that immunity at the fight's start, keeps the next debuffs off instead of lifting them after.  
  Rests on: immune:debuffs; Cleanse; fight_start.
- **S-110** A reaction to an ally gaining a debuff cleanses it at once, so Stun, Doom or Rot are lifted before they've done their work.  
  Rests on: status_gained; Cleanse; remove; Doom.
- **S-113** A Cleanse aimed at the ally with the most Chill, waiting until it nears the cap, lifts it before the shatter's damage and Stun.  
  Rests on: Chill; Cleanse; stacks (unit condition); { stacks } (by).
- **S-115** A pulse that lifts one debuff at a time cleanses on a timer, keeping light debuffs from piling up without a slot or a cast.  
  Rests on: pulse; remove (count).
- **S-119** An ally's knockout makes the reviver's Revive ready now, so a fall is answered at once instead of after a very long cooldown.  
  Rests on: ko; cooldown (set: ready); Revive.
- **S-121** A revive that lands a set time after it's cast brings the unit back later in the fight, after the burst that dropped it may have passed.  
  Rests on: revive (after).
- **S-122** A revive that sets the raised ally's actions ready brings it back to act at once, instead of on full cooldowns. *(also burst; merged B-141, X-127)*  
  Rests on: revive (ready); Revive; cooldown.
- **S-123** A reaction to an ally being revived gives it Shield, Aegis or Hidden, or its rise under a line fires its own hp_low protections, so it isn't knocked straight back down. *(also burst; merged X-128)*  
  Rests on: revived; hp_low (stands up under it); Shield; Aegis; Hidden; Revive; hp_low.
- **S-125** When a unit drops under a line or is revived, restart makes its gear's and seat's start-of-fight effects happen again, so its opening Shield, Aegis or Hidden return mid-fight. *(merged X-129)*  
  Rests on: restart; fight_start; hp_low; revived.
- **S-128** A Clarity that waits on its target falling under an MP share lands on the caster that's nearly dry, never on a full pool.  
  Rests on: Clarity; mpBelow.
- **S-138** A piece gives MP for damage taken, by its amount, so the unit drawing fire funds its own Taunts and shields from the harm that comes to it.  
  Rests on: damage_taken; amount; mp.
- **S-139** Each foe knocked out restores MP, so a party that drops foes quickly casts more in the fight's later stretch.  
  Rests on: ko; whose: foe; mp.
- **S-151** When the mender is hit, a reaction Marks the attacker, so the party's basic attacks and random-target abilities turn on whatever is hitting it. *(also burst)*  
  Rests on: Marked; hit_taken; other (reaction target).
- **S-154** Haste on an ally offsets foes' Slow and Chill, which act through the same speed stats, so its heals and Taunts stay on time.  
  Rests on: Haste; Slow; Chill; Attack speed; Cooldown; Cast speed.
- **S-156** When a foe starts an ability's wind-up, a reaction gives the unit drawing fire, or every ally, Aegis or Blur, so the blow that resolves at its end meets a block. *(merged X-142)*  
  Rests on: action_start (whose: foe); Aegis; Blur; Wind-ups; action_start; Shield; casting.
- **S-157** Each hit taken adds a stack of a capped status that cuts damage taken, so the unit grows harder to hurt the longer it's focused. *(also build up)*  
  Rests on: Stacks; cap; hit_taken; taken.
- **S-158** A stacking status that cuts damage taken, laid full at the fight's start and losing a stack each time its holder is hit, is strongest in the opening and thins with every blow.  
  Rests on: Stacks; trigger; drop; taken; fight_start.
- **S-167** A hit that would knock an ally out moves to the holder instead, so the save comes only at the moment it's needed.  
  Rests on: cover; ko.
  Needs a block: A cover setting that moves a hit only when it would knock the ally out; cover today moves any hit above a set share of max HP.
- **S-172** When a foe starts a wind-up, a reaction shields or arms whichever ally that action is aimed at, so protection lands where the blow will fall.  
  Rests on: action_start (whose: foe); casting; Shield; Aegis.
  Needs a block: A target rule that picks the ally a foe's action under way is aimed at; no rule reads a foe's chosen target, and that target may be fixed only as it resolves.
- **X-032** Guard trims mid-sized hits under Aegis's line, since Aegis is checked after mitigation, so the Aegis isn't spent on blows Defense could carry and waits for the one that needs it.  
  Rests on: Aegis; Guard; Defense.
- **X-046** Blur on a unit its seat makes rarely drawn waits untouched until the one hit that reaches it, usually a Seek strike or an Area, so the backline's single exposed moment is a sure miss.  
  Rests on: Blur; Aggro; Seek; Area.
- **X-079** floor keeps its holder at 1 HP at least, so a Taunting holder takes every pick and cannot fall while it lasts: a window in which only Area and Seek reach the rest of the party.  
  Rests on: floor; Taunt.
- **X-084** Owed holds the damage of many hits and lands it at one known moment, so a rewind answering the lump returns HP to what it was just before it.  
  Rests on: Owed; rewind; status_ended.
- **X-085** floor holds a unit at 1 HP through the deadliest stretch, and a rewind as it ends takes the unit back to before the blows.  
  Rests on: floor; rewind.
- **X-096** Taunt carried by gear as the forced stat isn't a status, so a foe's Dispel can't lift it and the tank holds the picks all fight.  
  Rests on: forced; Taunt; Dispel.

### At what price (30)

- **S-007** A Heal that waits on its target falling under an HP line never spends MP on scratches, so its fuel goes only to damage that matters and lasts the fight, at the price of letting small harm stand.  
  Rests on: Heal; trigger condition; hpBelow; MP costs.
- **S-010** A heal slotted after the unit's other abilities fires only when none of them is ready, mending in the gaps at no cost to the unit's damage, but never first when it's needed most.  
  Rests on: slot order; Heal.
- **S-013** When an ally drops under a line, the mender gains a status that removes its heal's cooldown for a while, turning MP straight into mending until the danger passes or the pool runs dry.  
  Rests on: hp_low; mods: cooldown; MP costs.
- **S-018** The mender's heal and its shield are cast as one: each waits until both are ready, and when one is cast the other comes with it free, a single lump of mending and buffer on one MP cost.  
  Rests on: mods: together; Heal; Shield.
- **S-019** While the mender holds over half its MP, a status raises its heals' cost and the heals scale from what they paid, so a full pool buys big mends and a low one small, cheap ones.  
  Rests on: mods: mp; mods: if; mpAtLeast; cost (what this action paid).
- **S-020** A heal with an HP price, scaling from what it paid, moves health from a sturdy unit to a hurt one and spares MP; the price never takes the payer below 1 HP.  
  Rests on: pay; mods: hp; cost (as an HP price); Heal.
- **S-022** A heal that scales from the total stacks of an affliction across every foe reads them and leaves them, so the party's upkeep on the foes doubles as its mending. *(also build up, debuff or disable)*  
  Rests on: count ({ side, where }, with stacks); affliction; a payoff reads the stacks and leaves them; Heal.
- **S-036** A piece's reaction to overhealed gives the mender MP for the healing past full, so over-mending refunds the casts that caused it.  
  Rests on: overhealed; other (the healer); mp.
- **S-050** Trade with a near-dead ally leaves it at the actor's share of max HP and the actor at the ally's, so a sturdy, shielded or Regen-holding unit takes the danger in its place.  
  Rests on: trade; Shield; Regen.
- **S-060** An ability with an HP price adds a Shield scaling from what it paid, turning health into a pool that soaks status damage and that Rot can't cut.  
  Rests on: pay; cost (as an HP price); Shield; Rot.
- **S-061** A piece turns harm stopped into fuel: a reaction to hit_taken gives MP by what the unit's Shield soaked and its Aegis blocked, or a giver regains MP when a Shield or Aegis it gave is spent.  
  Rests on: hit_taken; event (stopped); status_ended; source (event filter); mp.
- **S-086** Two units that Taunt on staggered cooldowns split foes' picks by draw while both taunt and take turns holding them otherwise, so the cost of drawing fire is shared and neither breaks. *(merged X-042)*  
  Rests on: Taunt; When several units Taunt, foes pick among them weighted by draw; Refresh; Aggro; draw.
- **S-103** Soak takes damage that would reach HP out of MP point for point while there's any, so a deep MP pool, kept topped by MP regen, Clarity or Siphon, becomes a second health bar paid for in casts. *(merged X-074)*  
  Rests on: soak; max MP; MP regeneration; Clarity; Siphon; MP regen.
- **S-108** Immunity to every status that pulses keeps Burn off a unit, but also the party's own Regen and Clarity, so its sustain must come from heals, Shield and Lifesteal instead.  
  Rests on: immune:kind:<kind>; pulse (effect kind); Burn; Regen; Clarity.
- **S-118** An ability whose rule picks a fallen ally, else the lowest, revives when someone is down and heals otherwise, so its slot is never idle waiting for a knockout.  
  Rests on: ifNone; ko (unit condition); revive; heal.
- **S-124** A revive with an HP price, paid by a sturdy reviver, raises the fallen without MP, never taking the payer below 1 HP.  
  Rests on: pay; mods: hp; revive.
- **S-133** MP gained past the full pool fires mp_over, and a reaction gives that part to the ally lowest on MP, so one unit's surplus from Siphon or Clarity feeds the others for free. *(merged X-105)*  
  Rests on: mp_over; mp; mp_share (by); Clarity; Siphon.
- **S-134** A piece's reaction to hp_paid gives MP, so a sturdy unit turns health, which mending can replace, into fuel.  
  Rests on: hp_paid; pay; mp.
- **S-135** A status changes the unit's abilities to an HP price in place of MP, always or only while its MP is low, so it keeps casting on health that the party's mending replaces. *(also burst; merged X-086)*  
  Rests on: mods: hp; mods: if; mpBelow; hp (ability change); Lifesteal; Regen.
- **S-136** A status cuts an ability's MP cost, or makes it free, while its holder is under a line, so the casts that matter in a crisis stay affordable.  
  Rests on: mods: mp; mods: if; hpBelow.
- **S-137** A piece's reaction to a paid action resolving restores a share of the MP it paid, so every spell stretches the pool a little further.  
  Rests on: action_resolve (amount); paid (event filter); mp.
- **S-140** A heal given restores MP to the mender by the amount it healed, so mending pays for more mending while there's real damage to mend.  
  Rests on: healed (other: holder); amount; mp.
- **S-159** A per-source Guard or Regen that one unit lays on every ally ends when its giver is knocked out, so the party's protection rests on keeping that one unit up.  
  Rests on: Per source; Guard; Regen.
- **S-160** Two units hold the same protective rule, but only the first standing answers, so it never fires twice and, when the first falls, the second takes the job over. *(merged X-140)*  
  Rests on: party (status field); party; seat order; ko.
- **S-164** A seat that lowers the unit's Attack and raises its Defense, max HP or Evasion, or a swap of two of its stats, turns offense the unit drawing fire doesn't need into protection.  
  Rests on: seat; swap.
- **S-165** A piece grants strong self-mending under the heals rule, by which only the holder's own heals land, so the unit stands on its own and the party's mender has one less to keep.  
  Rests on: heals (status field); Lifesteal; Regen.
- **S-166** A healing cap keeps a unit under a share of max HP, and since at the cap it reads as just under that line, its below-a-line protections stay on all fight. *(also burst, build up; merged X-090)*  
  Rests on: healCap; hpBelow; hp_low.
- **S-171** Damage to the holder comes out of an ally's MP instead of its HP, so a caster with a deep pool spends fuel keeping the unit drawing fire whole.  
  Rests on: soak.
  Needs a block: A soak setting that draws on another unit's MP, such as the source's; soak draws only on the holder's own.
- **X-097** A piece's price laid on its own wearer as a debuff is lifted by an ally's Cleanse or kept off by an immunity, so the party keeps the power and drops its cost. *(also debuff or disable)*  
  Rests on: Cleanse; immune:debuffs; immune:status:<status>.
- **X-152** Against foes that Dispel, Fixated holds a foe's attacks on its applier where a Taunt would be stripped, since Fixated is a debuff on the foe and Dispel lifts only buffs.  
  Rests on: Fixated; Taunt; Dispel.
