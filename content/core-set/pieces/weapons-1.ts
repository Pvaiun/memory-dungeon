/**
 * Six weapon kinds' pieces: dagger, fist weapons, wand, sword, spear and axe. Each kind's pieces carry its budget of stat
 * steps at every rarity (kit.ts budgetOf), and every weapon swings as its kind's plain weapon does unless its card says
 * otherwise. Statuses are at their own length, and nothing here is balanced.
 *
 * `gear` joins the pack's gear and the rogue's stock; `statuses` the pack's statuses; `served` is designer data, never in the pack.
 */
import type { GearT, NumT, StatusT } from "../../../src/schema.js";
import { FLAT_STACKS, HIT } from "../scale.js";
import { EV, NO_MARK, TO, against, atStart, count, countAt, critStep, give, hits, lift, marker, ofAmount, on, oneUse, own, piece, pieceStatus, react, reactIf, share, shelf, sp, st, stacksOf, state, swingNow, weaponHit, whileHolding, whileHp, type Change, type Rarity, type Trade } from "./kit.js";

const S = shelf();

/** One weapon of a kind: its card's effect, its stats, and the statuses behind it (the first is the piece's own, under its id). */
function weapon(kind: string, rarity: Rarity, name: string, o: { effect?: string; stats: Change[]; trade?: Trade; weapon?: GearT["weapon"]; statuses?: StatusT[]; serves: string }) {
  const statuses = o.statuses ?? [];
  S.add(piece({ name, kind, slot: "weapon", rarity, effect: o.effect, stats: o.stats, trade: o.trade, weapon: o.weapon, statuses: statuses.filter((s) => s.id === id(name) || s.id.startsWith(`${id(name)}__given`)).map((s) => s.id) }), statuses, o.serves);
}
const id = (name: string) => name.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
/** The piece's own status: on the sheet, under the piece's id, saying what the card says. */
const own_ = (name: string, text: string, body: Partial<StatusT>) => pieceStatus(id(name), name, text, body);
/** The five afflictions. */
const AFFLICTIONS = ["burn", "chill", "shock", "bleed", "sunder"];

// ─── Dagger (Ranger, Assassin): fast, one hand; light, Attack-heavy, standard ──

weapon("dagger", "common", "Stiletto", { stats: [sp("attack_speed", "medium")], serves: "Cuts, Snap" });
weapon("dagger", "common", "Keen dirk", { stats: [critStep(1)], serves: "Hunt, Cuts" });

{
  // Once the foe holds the mark, the reaction's test skips it, so later hits add nothing. A marker: no Cleanse lifts it.
  const name = "Weeping kris", mark = `${id(name)}_mark`;
  const effect = "The first hit its wearer lands on each foe adds several Bleed (from Attack).";
  weapon("dagger", "uncommon", name, {
    effect, stats: [critStep(1), sp("attack_speed", "medium")],
    statuses: [
      own_(name, effect, { reactions: [reactIf(EV.hit, { unit: "other", where: { lacks: mark } }, give("bleed", "other", own("several", "attack")), give(mark, "other", undefined, { rider: false }))] }),
      marker(mark, "Wept", "The Weeping kris has opened its wound.", { perSource: {} }),
    ],
    serves: "Cuts 1 ●●, Hunt ● ⚙ red rain (half) ◆ swing-status",
  });
}
{
  const name = "Sleet dirk", effect = "Its basic attacks add a few Chill (from Attack).";
  weapon("dagger", "uncommon", name, {
    effect, stats: [critStep(1), sp("accuracy", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, give("chill", "other", own("few", "attack")))] })],
    serves: "Snap 1 ●● ⚙ lead's colour (half) ◆ swing-status",
  });
}
{
  // The swing made ready by the kill, and a crit rule on basic hits until that swing is made.
  const name = "Second thrust", next = `${id(name)}_on`;
  const effect = "When its wearer lands a killing blow, its next basic attack comes at once and always crits.";
  weapon("dagger", "uncommon", name, {
    effect, stats: [critStep(1), sp("crit_damage", "medium")],
    statuses: [
      own_(name, effect, { reactions: [react(EV.kill, swingNow(), give(next))] }),
      oneUse(next, "SECOND THRUST", "Its next basic attack always crits.", EV.swing, { crits: [{ tag: "basic", chance: 100 }] }),
    ],
    serves: "Hunt 1 ●●, Cuts ● ◆ kill-pays",
  });
}
{
  const name = "Marking knife", effect = "While no foe is Marked, each crit its wearer lands Marks its target.";
  weapon("dagger", "rare", name, {
    effect, stats: [critStep(2), sp("attack_speed", "medium")],
    statuses: [own_(name, effect, { reactions: [reactIf(EV.crit, NO_MARK, give("marked", "other"))] })],
    serves: "Hunt 2 ●●●, Cuts ●●",
  });
}
{
  const name = "Bloodscent knife", effect = "Its wearer's hits on a bleeding foe crit far more often: +50% Crit chance, up to 80%.";
  weapon("dagger", "rare", name, {
    effect, stats: [critStep(1), sp("attack_speed", "medium"), sp("crit_damage", "medium")],
    statuses: [own_(name, effect, { crits: [{ when: { has: "bleed" }, chance: 50, cap: 80 }] })],
    serves: "Cuts 2 ●●●, Hunt ●● ⚙ emptied quiver (half)",
  });
}
{
  const name = "Ambush knife";
  const effect = "Its wearer's hits on a foe that hasn't acted yet this fight crit 80% of the time, whatever its wearer's Crit chance. Nothing raises that chance.";
  weapon("dagger", "rare", name, {
    effect, stats: [critStep(2), sp("crit_damage", "medium")],
    statuses: [own_(name, effect, { crits: [{ when: { acted: false }, set: 80 }] })],
    serves: "Hunt 2 ●●●, Cuts ● ⚙ emptied quiver (half)",
  });
}
{
  const name = "Thousandth cut";
  const effect = "Its wearer gathers Cuts (a Cut for each hit it lands, kept for the fight, up to 25). Its wearer's hits deal 2% more for each Cut.";
  weapon("dagger", "legendary", name, {
    effect, stats: [critStep(2), sp("attack_speed", "high")],
    statuses: [own_(name, effect, { reactions: [react(EV.hit, give("cuts", "self", 1))], boosts: hits(stacksOf("cuts", 2)) })],
    serves: "Cuts 3 ●●●, Snap ●, Storm ●",
  });
}
{
  // "Strikes with its weapon": a hit of its basic attack's size out of turn, carrying what the swing carries.
  const name = "Quietus", effect = "When each fight starts, its wearer strikes every foe with its weapon, once each.";
  weapon("dagger", "legendary", name, {
    effect, stats: [critStep(2), sp("crit_damage", "high")],
    statuses: [own_(name, effect, { reactions: [atStart({ op: "strike", carry: true, to: { side: "foes", pick: "all" } })] })],
    serves: "Hunt 3 ●●●, Cuts ●● ⚙ red rain (half), opening again (half)",
  });
}

/** "Its basic attacks and extra strikes add": riders on both, so a borrower and a carried hit read them as the swing's. */
const swingRider = (status: string, stacks: NumT) => [react(EV.basic, give(status, "other", stacks)), react(EV.extra, give(status, "other", stacks))];
/** A state a piece switches on and off: shown as an icon, never lifted by anything but the piece. */
const switched = (sid: string, name: string, text: string, body: Partial<StatusT>) => state(sid, name, text, { unremovable: true, ...body });

// ─── Fist weapons ──

weapon("fist", "common", "Mantis claws", { stats: [sp("double_strike", "medium")], serves: "Cuts, Storm" });
weapon("fist", "common", "Red talons", { stats: [sp("lifesteal", "medium")], serves: "Pact" });

{
  const name = "Live-wire knuckles", effect = "Its basic attacks and extra strikes add a few Shock (from Attack).";
  weapon("fist", "uncommon", name, {
    effect, stats: [sp("double_strike", "medium"), sp("attack_speed", "medium")],
    statuses: [own_(name, effect, { reactions: swingRider("shock", own("few", "attack")) })],
    serves: "Storm 1 ●●, Toll ● ⚙ lead's colour (half), held charge (half) ◆ swing-status",
  });
}
{
  const name = "Cinder wraps", effect = "Its basic attacks and extra strikes add a few Burn (from Attack).";
  weapon("fist", "uncommon", name, {
    effect, stats: [sp("double_strike", "medium"), sp("attack_speed", "medium")],
    statuses: [own_(name, effect, { reactions: swingRider("burn", own("few", "attack")) })],
    serves: "Bonfire 1 ●●, Cuts ● ⚙ lead's colour (half) ◆ swing-status",
  });
}
{
  const name = "Rime knuckles", effect = "Its basic attacks and extra strikes add a few Chill (from Attack).";
  weapon("fist", "uncommon", name, {
    effect, stats: [sp("double_strike", "medium"), sp("attack_speed", "medium")],
    statuses: [own_(name, effect, { reactions: swingRider("chill", own("few", "attack")) })],
    serves: "Snap 1 ●●, Cuts ● ⚙ lead's colour (half) ◆ swing-status",
  });
}
{
  const name = "Lamprey claws", effect = "Each extra strike its wearer lands heals it for a tenth of its max HP.";
  weapon("fist", "uncommon", name, {
    effect, stats: [sp("double_strike", "medium"), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.extra, { op: "heal", amount: share(0.1, "max_hp"), to: "holder" })] })],
    serves: "Pact 1 ●●, Cuts 1 ●",
  });
}
{
  const name = "Gorged claws", on_ = `${id(name)}_on`;
  const effect = "While its wearer is below half its max HP, its basic attacks come a third faster.";
  weapon("fist", "rare", name, {
    effect, stats: [sp("double_strike", "medium"), sp("lifesteal", "medium"), st("max_hp", 1)],
    statuses: [
      own_(name, effect, { reactions: whileHp(on_, 50, true) }),
      switched(on_, "GORGED", "Its basic attacks come a third faster.", { stats: [{ stat: "attack_speed", flat: 33 }] }),
    ],
    serves: "Pact 2 ●●●, Cuts ●● ⚙ brink (half)",
  });
}
{
  // A twentieth of the fire the foe holds as the hit lands, in fractions of a stack.
  const name = "Bellows wraps", effect = "Each hit its wearer lands on a burning foe adds Burn to it: a twentieth of what it holds.";
  weapon("fist", "rare", name, {
    effect, stats: [sp("double_strike", "medium"), sp("attack_speed", "medium"), sp("evasion", "medium")],
    statuses: [own_(name, effect, { reactions: [reactIf(EV.hit, { unit: "other", where: { has: "burn" } }, give("burn", "other", stacksOf("burn", 0.05, "target")))] })],
    serves: "Bonfire 2 ●●●, Cuts ●",
  });
}
{
  // The second landing is bare, so nothing (this included) answers it again.
  const name = "Still hand";
  const effect = "Each hit its wearer lands on a Stunned foe lands twice. The second landing is the same damage again, and is never repeated: not by this, and not by anything else.";
  weapon("fist", "rare", name, {
    effect, stats: [sp("double_strike", "medium"), sp("attack_speed", "medium"), sp("lifesteal", "medium")],
    statuses: [own_(name, effect, { reactions: [reactIf(on("hit_lands", { notTags: ["bare"] }), { unit: "other", where: { has: "stun" } }, { op: "strike", of: "dealt", to: "other" })] })],
    serves: "Snap 2 ●●, Cuts ●●, Landslide ● ◆ held",
  });
}
{
  // The leap is a bonus hit on another foe (tagged wide); every wide hit its basic attacks land gives the MP.
  const name = "Forked knuckles";
  const effect = "Its basic attacks also hit a second, random foe for half, carrying what the swing carries. Each time one of its basic attacks hits a foe other than its target, its wearer regains a twentieth of its max MP.";
  weapon("fist", "rare", name, {
    effect, stats: [sp("double_strike", "medium"), sp("attack_speed", "medium"), st("max_hp", 1)],
    statuses: [own_(name, effect, {
      strike: { to: { side: "foes", pick: "random", exclude: "targets" }, share: 50, kind: "bonus", carry: true },
      reactions: [react(on("hit_lands", { tags: ["wide"] }), { op: "mp", amount: share(0.05, "max_mp"), to: "holder" })],
    })],
    serves: "Storm 2 ●●●, Barrage ●●, Cuts ● ⚙ red rain (half), resonance (half) ◆ wide-hit, free-cast",
  });
}
{
  const name = "Flurry wraps";
  const effect = "Its extra strikes can strike again: each one rolls Double strike for one more, at most two more after the first, and each is a fifth weaker than the strike before it.";
  weapon("fist", "legendary", name, {
    effect, stats: [sp("double_strike", "high"), sp("attack_speed", "medium"), sp("lifesteal", "medium")],
    statuses: [own_(name, effect, { strike: { scale: "double_strike", to: "target", chain: { times: 2, share: 80 } } })],
    serves: "Cuts 3 ●●●, Storm ●●, Pact ●",
  });
}
{
  const name = "Answering thunder";
  const effect = "Each time a foe that holds Shock acts, its wearer strikes that foe with its weapon, unless the wearer is Stunned or winding up an ability.";
  weapon("fist", "legendary", name, {
    effect, stats: [sp("double_strike", "medium"), sp("attack_speed", "medium"), sp("lifesteal", "medium"), sp("evasion", "medium")],
    statuses: [own_(name, effect, {
      reactions: [reactIf(on("status_triggered", { status: "shock", whose: "foe" }), { side: "self", where: { lacks: "stun", casting: false } }, { op: "strike", carry: true, to: "owner" })],
    })],
    serves: "Storm 3 ●●●, Cuts ●●, Toll ●",
  });
}

// ─── Wand ──

weapon("wand", "common", "Quickbeam wand", { stats: [sp("cooldown", "medium"), sp("attack_speed", "medium")], serves: "Bonfire, Snap, Storm, Cuts" });
weapon("wand", "common", "Hazel wand", { stats: [sp("cooldown", "medium"), st("mp_regen", 1)], serves: "Barrage" });

{
  const name = "Spark wand", effect = "Its basic attacks add a few Burn (from Attack).";
  weapon("wand", "uncommon", name, {
    effect, stats: [sp("cooldown", "medium"), sp("attack_speed", "medium"), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, give("burn", "other", own("few", "attack")))] })],
    serves: "Bonfire 1 ●●, Cuts ● ⚙ lead's colour (half), every colour (half) ◆ swing-status",
  });
}
{
  const name = "Jolt wand", effect = "Its basic attacks add a few Shock (from Attack).";
  weapon("wand", "uncommon", name, {
    effect, stats: [sp("cooldown", "medium"), sp("attack_speed", "medium"), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, give("shock", "other", own("few", "attack")))] })],
    serves: "Storm 1 ●●, Toll ● ⚙ lead's colour (half), every colour (half), held charge (half) ◆ swing-status",
  });
}
{
  const name = "Tithe wand", effect = "Each basic attack it lands gives the ally with the least MP some MP: 3% of its wearer's Attack.";
  weapon("wand", "uncommon", name, {
    effect, stats: [sp("cooldown", "medium"), sp("attack_speed", "medium"), st("mp_regen", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, { op: "mp", amount: share(0.03, "attack"), to: TO.leastMpAlly })] })],
    serves: "Barrage 1 ●● ⚙ mana as armour (half) ◆ free-cast",
  });
}
{
  const name = "Chain wand", effect = "Its basic attacks also hit up to two other random foes, each for half, carrying what the swing carries.";
  weapon("wand", "rare", name, {
    effect, stats: [sp("cooldown", "medium"), sp("attack_speed", "medium"), st("attack", 1), st("mp_regen", 1)],
    statuses: [own_(name, effect, { strike: { to: { side: "foes", pick: "random", count: 2, exclude: "targets" }, share: 50, kind: "bonus", carry: true } })],
    serves: "Snap 2 ●●, Bonfire 2 ●●, Storm ●●, Cuts ●● ⚙ red rain (half) ◆ wide-hit",
  });
}
{
  const name = "Mimic wand";
  const effect = "Its basic attacks carry whatever statuses the basic attacks of the other ally with the highest Attack add to their target. They're added as this wand's own would be: on the same condition, with stacks from its own wearer's stats, and never twice from one source. What it borrows isn't borrowed on by anyone else.";
  weapon("wand", "rare", name, {
    effect, stats: [sp("cooldown", "medium"), sp("attack_speed", "medium"), st("attack", 2)],
    statuses: [own_(name, effect, { borrow: { from: TO.otherTopAttack } })],
    serves: "Bonfire 2 ●●, Snap 2 ●●, Storm 2 ●●, Cuts ● ⚙ lead's colour (key), every colour (half)",
  });
}
{
  const name = "Wildmagic wand", effect = "Each of its basic attacks adds a few stacks (from Attack) of one of Burn, Chill, Shock, Bleed and Sunder, picked at random.";
  weapon("wand", "legendary", name, {
    effect, stats: [sp("cooldown", "high"), sp("attack_speed", "medium"), st("attack", 1), st("mp_regen", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, { op: "one", of: AFFLICTIONS.map((status) => ({ status, stacks: own("few", "attack") })), to: "other" })] })],
    serves: "exotic, Bonfire ●, Snap ●, Storm ●, Cuts ● ⚙ every colour (key)",
  });
}
{
  const name = "Baton", effect = "Each basic attack it lands brings its wearer's first-slotted ability round sooner: a fifth of the wait that's left.";
  weapon("wand", "legendary", name, {
    effect, stats: [sp("cooldown", "medium"), sp("attack_speed", "high"), sp("cast_speed", "medium"), st("mp_regen", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, { op: "cooldown", which: "first", set: { times: 80 }, to: "holder" })] })],
    serves: "Barrage 3 ●●●, Cuts ●● ⚙ spell on the swing (key)",
  });
}

// ─── Sword ──

weapon("sword", "common", "Arming sword", { stats: [st("attack", 1)], serves: "Hunt, Storm, Snap" });
weapon("sword", "common", "Gilded sword", { stats: [st("max_hp", 1)], serves: "Toll, Pact, Barrage" });

{
  const name = "Rimed blade", effect = "Its basic attacks add a few Chill (from max HP).";
  weapon("sword", "uncommon", name, {
    effect, stats: [st("attack", 1), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, give("chill", "other", own("few", "max_hp")))] })],
    serves: "Snap 1 ●● ⚙ lead's colour (half), every colour (half) ◆ swing-status",
  });
}
{
  // The marker on each foe it has hit; the boost reads its absence, and the marker lands after the hit.
  const name = "Drawn steel", mark = `${id(name)}_mark`, effect = "The first hit its wearer lands on each foe in a fight deals double.";
  weapon("sword", "uncommon", name, {
    effect, stats: [st("attack", 1), critStep(1)],
    statuses: [
      own_(name, effect, { boosts: hits(against(100, { lacks: mark })), reactions: [reactIf(EV.hit, { unit: "other", where: { lacks: mark } }, give(mark, "other", undefined, { rider: false }))] }),
      marker(mark, "Drawn on", "The Drawn steel's first hit has landed.", { perSource: {} }),
    ],
    serves: "Hunt 1 ●●, Landslide ●",
  });
}
{
  const name = "Mercy's edge", effect = "Each basic attack it lands heals the ally with the lowest share of max HP for a third of the damage dealt.";
  weapon("sword", "uncommon", name, {
    effect, stats: [st("attack", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, { op: "heal", amount: ofAmount(1 / 3), to: TO.lowestAlly })] })],
    serves: "Pact 1 ●●, Toll ●, Cuts ● ⚙ brink (half) ◆ lowest-ally",
  });
}
{
  const name = "Gravemark";
  const effect = "Its wearer's hits on a Marked foe deal half again as much. When a Marked foe falls and no foe is left Marked, the foe with the lowest current HP is Marked.";
  weapon("sword", "rare", name, {
    effect, stats: [st("attack", 2), critStep(1)],
    statuses: [own_(name, effect, {
      boosts: hits(against(50, { has: "marked" })),
      reactions: [reactIf(on("status_ended", { status: "marked", cause: ["ko"], whose: "foe" }), NO_MARK, give("marked", TO.lowestHpFoe))],
    })],
    serves: "Hunt 2 ●●●",
  });
}
{
  const name = "Provoking blade", effect = "When one of its basic attacks lands, the foe it hit makes its own next basic attack at once, at whoever that foe would have picked.";
  weapon("sword", "rare", name, {
    effect, stats: [st("attack", 1), st("aggro", 1), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, swingNow("other"))] })],
    serves: "Storm 2 ●●●, Toll 2 ●●●, Snap ● ⚙ goad (key)",
  });
}
{
  const name = "Oathkeeper", on_ = `${id(name)}_on`, effect = "While its wearer is Taunting, its basic attacks also hit every other foe, carrying what the swing carries.";
  weapon("sword", "rare", name, {
    effect, stats: [st("attack", 1), st("max_hp", 1), st("defense", 1)],
    statuses: [
      own_(name, effect, { reactions: whileHolding(on_, "taunt") }),
      switched(on_, "OATH", "Its basic attacks also hit every other foe.", { strike: { to: { side: "foes", pick: "all", exclude: "targets" }, kind: "bonus", carry: true } }),
    ],
    serves: "Toll 2 ●●●, Storm ●●, Cuts ●●, Hunt ● ⚙ red rain (half), reaping (half) ◆ wide-hit",
  });
}
{
  // The price is the swing's own (an HP price of the basic attack); the swing reads what it paid.
  const name = "Bloodletter";
  const effect = "Each of its basic attacks pays HP: a twentieth of its wearer's max HP. The basic attack deals extra damage equal to four times what it paid. The price never takes its wearer below 1 HP.";
  const hit = weaponHit("sword") as Exclude<NumT, number>;
  weapon("sword", "rare", name, {
    effect, stats: [st("attack", 1), st("max_hp", 2)],
    weapon: { kind: "sword", amount: { ...hit, scale: [...hit.scale, { ratio: FLAT_STACKS.several, cost: "hp" }] } },
    statuses: [own_(name, effect, { mods: [{ of: { basic: true }, pay: { scale: [{ ratio: 0.05, stat: "max_hp", of: "self" }] } }] })],
    serves: "Pact 2 ●●●, Landslide ● ⚙ brink (key)",
  });
}
{
  const name = "Stormbrand", effect = "Each hit its wearer lands deals extra damage for each Shock the foes hold: half a percent of its wearer's Attack a stack. The Shock stays.";
  weapon("sword", "legendary", name, {
    effect, stats: [st("attack", 2), critStep(2)],
    statuses: [own_(name, effect, { adds: [{ on: "physical", amount: { scale: [{ ratio: 0.005, count: { side: "foes", stacks: "shock" }, times: { stat: "attack", of: "holder" } }] } }] })],
    serves: "Storm 3 ●●●, Toll ● ⚙ held charge (key)",
  });
}

// ─── Spear ──

weapon("spear", "common", "Pennon spear", { stats: [st("aggro", 1)], serves: "Toll" });
weapon("spear", "common", "Boar spear", { stats: [st("attack", 1)], serves: "Hunt, Storm" });

{
  const name = "Jolt spear", effect = "Every hit its wearer lands adds a few Shock (from Attack): swings, extra strikes and abilities alike.";
  weapon("spear", "uncommon", name, {
    effect, stats: [sp("attack_speed", "medium"), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.hit, give("shock", "other", own("few", "attack")))] })],
    serves: "Storm 1 ●●, Toll ● ⚙ lead's colour (half), held charge (half) ◆ swing-status",
  });
}
{
  const name = "Victor's spear", effect = "When its wearer lands a killing blow, it gains a Shield equal to a quarter of its Attack.";
  weapon("spear", "uncommon", name, {
    effect, stats: [st("aggro", 1), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.kill, give("shield", "holder", share(0.25, "attack")))] })],
    serves: "Hunt 1 ●●, Cuts ● ⚙ detonation (half) ◆ kill-pays, shield-by-doing",
  });
}
{
  const name = "Long spear", effect = "Its basic attacks ignore Taunt: they pick among every foe, Taunting or not.";
  weapon("spear", "uncommon", name, {
    effect, stats: [critStep(1), st("attack", 1)],
    statuses: [own_(name, effect, { seek: "basic" })],
    serves: "Hunt 1 ●●, Storm ●",
  });
}
{
  const name = "Hunting spear";
  const effect = "Each hit its wearer lands on a foe below half its max HP lands twice. The second landing is the same damage again, and is never repeated: not by this, and not by anything else.";
  weapon("spear", "rare", name, {
    effect, stats: [critStep(1), st("attack", 2)],
    statuses: [own_(name, effect, { reactions: [react(on("hit_lands", { notTags: ["bare"], wasBelow: 50 }), { op: "strike", of: "dealt", to: "other" })] })],
    serves: "Hunt 2 ●●●, Cuts ●●",
  });
}
{
  const name = "Parrying spear", effect = "Each time its wearer dodges a hit, the other ally with the highest Attack strikes the attacker with its weapon.";
  weapon("spear", "rare", name, {
    effect, stats: [st("aggro", 2), sp("evasion", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.dodge, { op: "strike", carry: true, by: TO.otherTopAttack, to: "other" })] })],
    serves: "Toll 2 ●●●, Cuts ●● ⚙ riposte (key)",
  });
}
{
  // The fifth hit pays before the count takes it (the count empties itself at five); the flash's hits are tagged and uncounted.
  const name = "Squall lance", n = `${id(name)}_count`;
  const effect = "Every fifth hit its wearer lands, swing or ability, also hits every other foe: a light hit (from Attack), carrying what the swing carries. Those hits aren't counted.";
  const counted = on("hit_lands", { notTags: ["squall"] });
  weapon("spear", "rare", name, {
    effect, stats: [sp("attack_speed", "medium"), st("attack", 2)],
    statuses: [
      own_(name, effect, {
        reactions: [
          reactIf(counted, { side: "self", where: countAt(n, 4) }, { op: "strike", amount: share(HIT.light, "attack"), carry: true, tag: "squall", to: TO.otherFoes("other") }),
          react(counted, give(n, "holder", 1)),
        ],
      }),
      count(n, "SQUALL", "Every fifth hit it lands also hits every other foe.", 5),
    ],
    serves: "Storm 2 ●●●, Cuts ●●, Bonfire ●, Hunt ● ⚙ red rain (half), reaping (half) ◆ wide-hit",
  });
}
{
  // A per-source marker on each foe that hits the wearer; the swing's strike finds them, and the swing's end lifts them.
  const name = "Sarissa", mark = `${id(name)}_mark`;
  const effect = "Each of its basic attacks also hits every foe that has hit its wearer since its last basic attack, each for the swing's full damage.";
  weapon("spear", "legendary", name, {
    effect, stats: [st("aggro", 2), st("defense", 1), st("max_hp", 1)],
    statuses: [
      own_(name, effect, {
        strike: { to: { side: "foes", pick: "all", where: { has: mark }, exclude: "targets" }, kind: "bonus" },
        reactions: [react(EV.struck, give(mark, "other")), react(EV.swing, lift(mark, TO.everyFoe, "marker"))],
      }),
      marker(mark, "Answered", "It has hit the Sarissa's wearer since its last basic attack.", { perSource: {} }),
    ],
    serves: "Toll 3 ●●●, Storm ●●, Landslide ●●",
  });
}

// ─── Axe ──

weapon("axe", "common", "Hand axe", { stats: [sp("lifesteal", "medium")], serves: "Pact" });
weapon("axe", "common", "Cleaver", { stats: [st("attack", 1)], serves: "Hunt" });

{
  const name = "Reaver's axe", effect = "When its wearer lands a killing blow, it gains many Might (from Attack).";
  weapon("axe", "uncommon", name, {
    effect, stats: [sp("crit_damage", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.kill, give("might", "holder", own("many", "attack")))] })],
    serves: "Hunt 1 ●●, Landslide ● ◆ kill-pays",
  });
}
{
  // Its own Lifesteal again: a heal of the damage at the wearer's Lifesteal, on a foe that was below half as the hit landed.
  const name = "Hungry axe", effect = "Its wearer's Lifesteal is doubled on hits against a foe below half its max HP.";
  weapon("axe", "uncommon", name, {
    effect, stats: [sp("lifesteal", "medium")],
    statuses: [own_(name, effect, { reactions: [react(on("hit_lands", { wasBelow: 50 }), { op: "heal", amount: { scale: [{ ratio: 0.01, amount: true, times: { stat: "lifesteal", of: "holder" } }] }, to: "holder" })] })],
    serves: "Pact 1 ●●, Hunt ●",
  });
}
{
  const name = "Ragged axe", effect = "Every hit its wearer lands adds a few Bleed (from Attack).";
  weapon("axe", "uncommon", name, {
    effect, stats: [st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.hit, give("bleed", "other", own("few", "attack")))] })],
    serves: "Cuts 1 ●● ⚙ lead's colour (half) ◆ swing-status",
  });
}
{
  const name = "Executioner's axe", effect = "Its wearer's hits on a foe below a quarter of its max HP deal double.";
  weapon("axe", "rare", name, {
    effect, stats: [sp("lifesteal", "medium"), st("attack", 1)],
    statuses: [own_(name, effect, { boosts: hits(against(100, { hpBelow: 25 })) })],
    serves: "Hunt 2 ●●●",
  });
}
{
  const name = "Thirsting axe", effect = "Each killing blow its wearer lands heals it for a fifth of its max HP.";
  weapon("axe", "rare", name, {
    effect, stats: [sp("lifesteal", "medium"), sp("crit_damage", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.kill, { op: "heal", amount: share(0.2, "max_hp"), to: "holder" })] })],
    serves: "Pact 2 ●●, Hunt 2 ●● ◆ kill-pays",
  });
}
{
  // The left-over is bare: a kill by it carries nothing on. Two pieces that carry one blow's left-over share it.
  const name = "Overkill axe";
  const effect = "When its wearer lands a killing blow, what the blow has left over lands on the foe with the lowest current HP, as a hit. It carries once: if that fells the second foe too, nothing carries on.";
  weapon("axe", "rare", name, {
    effect, stats: [st("attack", 1), sp("crit_damage", "medium")],
    statuses: [own_(name, effect, { reactions: [{ on: on("ko", { whose: "foe", other: "holder", tags: ["physical"], notTags: ["bare"] }), split: "over", do: [{ op: "strike", of: "over", to: TO.lowestHpFoe }] }] })],
    serves: "Hunt 2 ●●●, Landslide ●● ⚙ avalanche (key)",
  });
}
{
  const name = "The Red Feast", on_ = `${id(name)}_on`;
  const effect = "While its wearer is below half its max HP, its hits deal double and its Lifesteal is doubled. When a fight is won, its wearer, if it's standing, is healed back to half its max HP, if it's below that.";
  weapon("axe", "legendary", name, {
    effect, stats: [sp("lifesteal", "high"), st("max_hp", 1)],
    statuses: [
      own_(name, effect, {
        reactions: [
          ...whileHp(on_, 50, true),
          reactIf(on("fight_won"), { side: "self", where: { hpBelow: 50 } }, { op: "heal", amount: { scale: [{ ratio: 0.5, stat: "max_hp", of: "holder" }, { ratio: -1, hp: "current", of: "holder" }] }, to: "holder" }),
        ],
      }),
      switched(on_, "FEAST", "Its hits deal double and its Lifesteal is doubled.", {
        boosts: hits(100), stats: [{ stat: "lifesteal", flat: share(1, "lifesteal"), live: true }],
      }),
    ],
    serves: "Pact 3 ●●●, Cuts ● ⚙ brink (half)",
  });
}
{
  // Half as often is its shape (Attack speed −100 counts no step); the boost doubles its basic attacks.
  const name = "Headsman's axe", effect = "Its basic attacks come half as often and deal double. When its wearer lands a killing blow, its next basic attack comes at once.";
  weapon("axe", "legendary", name, {
    effect, stats: [{ stat: "attack_speed", flat: -100 }, sp("lifesteal", "medium"), sp("crit_damage", "high")],
    statuses: [own_(name, effect, { boosts: [{ tag: "basic", pct: 100 }], reactions: [react(EV.kill, swingNow())] })],
    serves: "Hunt 3 ●●●, Landslide ●● ◆ heavy-blow, kill-pays",
  });
}


export const gear = S.gear;
export const statuses = S.statuses;
export const served = S.served;
