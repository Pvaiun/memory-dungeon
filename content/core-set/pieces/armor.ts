/**
 * The four armor types' pieces: 13 plate, 13 mail, 14 leather and 15 robes, 55 in all. Plate is worn by six classes, mail
 * and leather by seven, robes by eight (classes.ts). Every piece carries the standard ladder of steps exactly (KIND_BUDGET:
 * a common 1, an uncommon 2, a rare and a legendary 3), and may give one stat up a step for one step more elsewhere (kit.ts
 * piece). A piece's stats are its own: an uncommon or better puts at most half its steps on its type's leaning (loot.md,
 * Commons and uncommons by kind). Statuses are at their own length, and nothing here is balanced.
 *
 * `gear` joins the pack's gear and the rogue's stock; `statuses` the pack's statuses; `served` is designer data, never in the pack.
 */
import type { ConditionT, StatusT } from "../../../src/schema.js";
import { OWED, SPECIAL } from "../scale.js";
import { COUNTER, OVERHEAL } from "./shared.js";
import { EV, SO_OFTEN, TAUNTS_ALL_FIGHT, TO, atFirstStart, beatHalfway, count, countAt, critStep, give, hits, lift, ofAmount, on, onceBelow, oneUse, own, piece, pieceStatus, react, reactIf, share, shelf, sp, st, state, swingNow, used, whileHp, whileIt, type Change, type Rarity } from "./kit.js";

const S = shelf();

/** One armor piece of a type: its card's effect, its stats, and the statuses behind it (the first is the piece's own, under its id). */
function armor(kind: string, rarity: Rarity, name: string, o: { effect?: string; stats: Change[]; statuses?: StatusT[]; also?: string[]; serves: string }) {
  const statuses = o.statuses ?? [];
  S.add(piece({ name, kind, slot: "armor", rarity, effect: o.effect, stats: o.stats, statuses: [...statuses.filter((s) => s.id === id(name)).map((s) => s.id), ...(o.also ?? [])] }), statuses, o.serves);
}
const id = (name: string) => name.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
/** The piece's own status: on the sheet, under the piece's id, saying what the card says. */
const own_ = (name: string, text: string, body: Partial<StatusT>) => pieceStatus(id(name), name, text, body);
/**
 * A state a piece switches on and off, shown as an icon. Removable, so the piece's own lift (`lift`, a remove that names it)
 * can take it off again: a remove skips an unremovable status, and no foe strips the party's buffs.
 */
const switched = (sid: string, name: string, text: string, body: Partial<StatusT>) => state(sid, name, text, body);
/** A stat given up a step: the step's own size, below nothing. */
const down = (c: Change): Change => ({ ...c, flat: -c.flat });
/** A test of the holder itself, as a reaction's or a pulse's `if`. */
const self = (where: ConditionT["where"], atMost?: number): ConditionT => ({ side: "self", where, ...(atMost !== undefined ? { atMost } : {}) });
/** "Draws far more" and "far less": two seat steps of Aggro. */
const FAR = 25;

// ─── Plate ──

armor("plate", "common", "Ironclad", { stats: [st("defense", 1)], serves: "Defense: Landslide's body and the Toll's anchor." });
armor("plate", "common", "Deacon's plate", { stats: [st("max_mp", 2), st("attack", -1)], serves: "MP with HP beside it for Attack: Landslide's stone-layers and Barrage's well in plate." });
armor("plate", "common", "Mauler's cuirass", { stats: [st("attack", 2), down(critStep(1))], serves: "Attack for Crit chance: Blood Pact's drinker and the Toll's free seat in plate." });

{
  const name = "Portcullis", on_ = `${id(name)}_on`, effect = `Above 50% HP: Aggro +${FAR}.`;
  armor("plate", "uncommon", name, {
    effect, stats: [sp("thorns", "medium"), st("mp_regen", 1)],
    statuses: [own_(name, effect, { reactions: whileHp(on_, 50, false) }), switched(on_, "PORTCULLIS", `Aggro +${FAR}.`, { stats: [{ stat: "aggro", flat: FAR }] })],
    serves: "Toll 1 ●●, Bonfire ●, Storm ● ◆ Toll (draw)",
  });
}
{
  const name = "Keystone cuirass", effect = "While it has a Shield: hits deal +33%.";
  armor("plate", "uncommon", name, {
    effect, stats: [st("max_hp", 1), sp("cooldown", "medium")],
    statuses: [own_(name, effect, { boosts: hits(whileIt(33, { has: "shield" })) })],
    serves: "Landslide 1 ●● ◆ Landslide (Shield)",
  });
}
{
  const name = "Holdfast", done = `${id(name)}_used`, effect = "First drop below 50% HP each fight: Guarded.";
  armor("plate", "uncommon", name, {
    effect, stats: [st("defense", 1), sp("lifesteal", "medium")],
    statuses: [own_(name, effect, { reactions: [onceBelow(50, done, give("guard"))] }), used(done, "HOLDFAST")],
    serves: "net, Toll ●, Landslide ● ◆ the net, Landslide (stone)",
  });
}
{
  // Its abilities read its Defense wherever they read its Attack, while the Defense is the larger; its basic attacks still read Attack.
  const name = "Even-keel plate", effect = "While its Defense is above its Attack: abilities scale from Defense in place of Attack.";
  armor("plate", "uncommon", name, {
    effect, stats: [st("defense", 1), sp("siphon", "medium")],
    statuses: [own_(name, effect, { rescale: { from: "attack", to: "defense", if: { above: { stat: "defense", over: "attack" } } } })],
    serves: "Landslide 1 ●● ⚙ open book (key) ◆ Landslide (Defense as damage)",
  });
}
{
  const name = "Challenger's plate", effect = "Taunts all fight.";
  armor("plate", "rare", name, {
    effect, stats: [st("max_hp", 1), st("attack", 1), sp("crit_damage", "medium")],
    statuses: [own_(name, effect, { reactions: TAUNTS_ALL_FIGHT })],
    serves: "Toll 2 ●●●, Bonfire ●●, Storm ●● ⚙ goad (half), two in the dark (half) ◆ Toll (draw)",
  });
}
{
  const name = "Hoarfrost plate", effect = "When hit: the attacker gains Chill.";
  armor("plate", "rare", name, {
    effect, stats: [st("defense", 1), sp("cast_speed", "medium"), st("max_mp", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.struck, give("chill", "other", own("few", "defense")))] })],
    serves: "Toll 2 ●●●, Snap 2 ●●●, conditional ⚙ frozen gate (key) ◆ Toll (what an attacker carries away), Snap (cold that attackers carry away)",
  });
}
{
  // A Shield emptied by damage ends (cause stacks) with its peak as the amount; a Dispel doesn't set it off.
  const name = "Rubble plate", effect = "When its Shield breaks: every foe takes the most it held.";
  armor("plate", "rare", name, {
    effect, stats: [st("aggro", 1), sp("accuracy", "medium"), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("status_ended", { status: "shield", cause: ["stacks"] }), { op: "damage", type: "none", amount: ofAmount(1), to: TO.everyFoe })] })],
    serves: "Landslide 2 ●●●, Toll ●●, conditional ⚙ detonation (key) ◆ Landslide (Shield)",
  });
}
{
  // The Spite comes first, so the blow that adds it counts it.
  const name = "Thornheart plate";
  const effect = `When hit: gains a Spite (up to ${COUNTER.spite.cap}) and sends back 33% of the blow, +5% per Spite.`;
  armor("plate", "legendary", name, {
    effect, stats: [sp("thorns", "medium"), sp("lifesteal", "medium"), sp("attack_speed", "medium")],
    statuses: [own_(name, effect, {
      reactions: [
        react(EV.struck, give("spite", "holder", 1)),
        react(EV.struck, { op: "damage", type: "none", amount: { scale: [{ ratio: 1 / 3, event: "raw" }, { ratio: 0.05, event: "raw", times: { stacks: "spite", of: "holder" } }] }, to: "other" }),
      ],
    })],
    serves: "Toll 3 ●●●, Landslide ●●, conditional ⚙ mirror (key) ◆ Toll (the mirror)",
  });
}
{
  // The floor comes with the fight's true start, so neither a revive nor a start made again brings a second.
  const name = "Last bastion", floor = `${id(name)}_floor`, on_ = `${id(name)}_on`;
  const effect = "Once a fight, a blow that would knock it out leaves it at 1 HP and Guarded. Until healed, hits deal ×2.";
  armor("plate", "legendary", name, {
    effect, stats: [st("max_hp", 1), st("attack", 1), critStep(1)],
    statuses: [
      own_(name, effect, {
        reactions: [
          atFirstStart(give(floor)),
          react(on("status_ended", { status: floor, cause: ["spent"] }), give("guard"), give(on_)),
          react(on("healed"), lift(on_)),
        ],
      }),
      state(floor, "LAST BASTION", "The next knockout blow leaves it at 1 HP.", { show: "sheet", unremovable: true, floor: { spend: true } }),
      switched(on_, "BASTION", "Hits deal ×2 until healed.", { boosts: hits(100) }),
    ],
    serves: "exotic ◆ the net",
  });
}
{
  // A rule the party holds once: foes weigh each party member by its max HP. A Taunt still takes the first pick.
  const name = "Beacon plate", effect = "Foes pick among the party by max HP instead of Aggro.";
  armor("plate", "legendary", name, {
    effect, stats: [st("max_hp", 1), sp("siphon", "medium"), sp("accuracy", "medium")],
    statuses: [own_(name, effect, { drawBy: "max_hp" })],
    serves: "exotic ◆ who is struck",
  });
}

// ─── Mail ──

armor("mail", "common", "Leechlink hauberk", { stats: [sp("lifesteal", "medium")], serves: "Lifesteal: Blood Pact's drink and Thousand Cuts staying alive by hitting." });
armor("mail", "common", "Rune-linked mail", { stats: [st("mp_regen", 2), st("defense", -1)], serves: "MP regen for Defense: Barrage's casters in mail." });
armor("mail", "common", "Clanking byrnie", { stats: [st("aggro", 2), down(sp("cooldown", "medium"))], serves: "Aggro for Cooldown: the Toll's anchor in mail." });

{
  const name = "Scabbed mail", effect = "Each hit it lands gives it a Shield of 3% of max HP.";
  armor("mail", "uncommon", name, {
    effect, stats: [st("max_hp", 1), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.hit, give("shield", "holder", share(0.03, "max_hp")))] })],
    serves: "Cuts 1 ●●, Landslide ● ⚙ detonation (half), riposte (half), brink (half) ◆ Cuts (staying alive by hitting), Landslide (Shield)",
  });
}
{
  // Taunts as a fight starts, again each time its Taunt ends and on a revive, and as an ally falls, whenever no living ally
  // has more max HP (a tie counts as none more).
  const name = "Herald's hauberk", effect = "While no ally has more max HP: Taunts.";
  const most = self({ top: { stats: ["max_hp"] } });
  armor("mail", "uncommon", name, {
    effect, stats: [st("defense", 1), st("mp_regen", 1)],
    statuses: [own_(name, effect, {
      reactions: [
        reactIf(on("fight_start"), most, give("taunt")),
        reactIf(on("status_ended", { status: "taunt", cause: ["expired", "removed"] }), most, give("taunt")),
        reactIf(on("revived"), most, give("taunt")),
        reactIf(on("ko", { whose: "ally" }), [most, self({ lacks: "taunt" })], give("taunt")),
      ],
    })],
    serves: "Toll 1 ●● ◆ Toll (draw)",
  });
}
{
  const name = "Bloodsworn mail", on_ = `${id(name)}_on`, effect = `Below 50% HP: +${SPECIAL.lifesteal.high}% Lifesteal.`;
  armor("mail", "uncommon", name, {
    effect, stats: [st("attack", 1), sp("double_strike", "medium")],
    statuses: [own_(name, effect, { reactions: whileHp(on_, 50, true) }), switched(on_, "BLOODSWORN", `+${SPECIAL.lifesteal.high}% Lifesteal.`, { stats: [{ stat: "lifesteal", flat: SPECIAL.lifesteal.high }] })],
    serves: "Pact 1 ●●, Cuts ● ⚙ brink (half), blood mage (half) ◆ Pact (Lifesteal)",
  });
}
{
  const name = "Warded mail", effect = `Every ${SO_OFTEN} ticks (the first at ${SO_OFTEN / 2}): lifts one of its debuffs.`;
  const b = beatHalfway(id(name), name, [{ op: "remove", label: "debuff", count: 1, to: "holder" }]);
  armor("mail", "uncommon", name, {
    effect, stats: [st("max_mp", 1), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: b.reactions }), ...b.statuses],
    serves: "general ◆ a debuff lifted",
  });
}
{
  // Damage from hits on it, after Defense and before its Aegis and Shield, waits as Owed (the vocabulary's), and lands at once
  // OWED ticks after the first such hit, met then by a Shield.
  const name = "Owing mail", effect = `Damage from hits on it waits, and lands all at once ${OWED} ticks after the first.`;
  armor("mail", "rare", name, {
    effect, stats: [st("attack", 1), sp("cooldown", "medium"), critStep(1)],
    statuses: [own_(name, effect, { owe: "owed" })],
    serves: "exotic ⚙ owed and the healer (key)",
  });
}
{
  // First in the order of healing past full: its wearer's own piece.
  const name = "Red stone mail", effect = "Healing past full becomes a Shield on it, Regen included.";
  armor("mail", "rare", name, {
    effect, stats: [sp("lifesteal", "medium"), st("defense", 1), st("mp_regen", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("overhealed"), give("shield", "holder", ofAmount(1)))] })],
    also: [OVERHEAL.own],
    serves: "Pact 2 ●●●, Cuts 2 ●●, Landslide ●●, conditional ⚙ red stone (key), detonation (half) ◆ Landslide (Shield), Pact (the last drink)",
  });
}
{
  const name = "Sanguine mail", low = `${id(name)}_low`, high = `${id(name)}_high`;
  const effect = "Healing on it: ×2 below 50% HP, −50% otherwise.";
  armor("mail", "rare", name, {
    effect, stats: [st("max_hp", 1), sp("attack_speed", "medium"), sp("crit_damage", "medium")],
    statuses: [
      own_(name, effect, { reactions: [...whileHp(low, 50, true), ...whileHp(high, 50, false)] }),
      switched(low, "SANGUINE", "Healing on it ×2.", { stats: [{ stat: "healing_received", flat: 100 }] }),
      switched(high, "SANGUINE", "Healing on it −50%.", { stats: [{ stat: "healing_received", flat: -50 }] }),
    ],
    serves: "Pact 2 ●●●, Toll ●, conditional ⚙ brink (half) ◆ Pact (below half as power)",
  });
}
{
  const name = "Hexweave mail", effect = "Hits deal +10% per different debuff on the target.";
  armor("mail", "rare", name, {
    effect, stats: [st("attack", 1), sp("siphon", "medium"), sp("cast_speed", "medium")],
    statuses: [own_(name, effect, { boosts: hits({ scale: [{ ratio: 10, count: "debuffs", of: "target" }] }) })],
    serves: "Bonfire ●●, Snap ●●, Storm ●●, Cuts ●●, Toll ●●, conditional ◆ every colour",
  });
}
{
  const name = "Aegis mail", effect = "An ally that drops below 33% HP gains Aegis.";
  armor("mail", "legendary", name, {
    effect, stats: [st("max_hp", 1), st("defense", 1), st("mp_regen", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("hp_low", { whose: "team", line: 33 }), give("aegis", "owner"))] })],
    serves: "Pact 3 ●●●, Toll ●●, net ⚙ brink (half) ◆ Pact (nets)",
  });
}
{
  // A rule the party holds once: every heal on a party member is split evenly across the living party, the healed one included.
  const name = "Sympathy mail", effect = "Healing any ally receives is shared evenly by the party.";
  armor("mail", "legendary", name, {
    effect, stats: [st("max_hp", 1), sp("cooldown", "medium"), sp("evasion", "medium")],
    statuses: [own_(name, effect, { sharesHeals: true })],
    serves: "exotic ◆ heals shared",
  });
}

// ─── Leather ──

armor("leather", "common", "Spotter's vest", { stats: [sp("accuracy", "medium")], serves: "Accuracy: the Hunt's marksman against foes that dodge." });
armor("leather", "common", "Studded jerkin", { stats: [st("defense", 2), st("max_hp", -1)], serves: "Defense for HP: the Toll's dancer and Landslide's body in leather." });
armor("leather", "common", "Quilted gambeson", { stats: [st("max_hp", 2), down(sp("attack_speed", "medium"))], serves: "HP for Attack speed: a heavier body for the Toll's anchor and for Blood Pact in leather." });

{
  const name = "Gleaner's leathers", effect = "Each hit it lands heals it for 2% of max HP.";
  armor("leather", "uncommon", name, {
    effect, stats: [st("max_hp", 1), st("mp_regen", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.hit, { op: "heal", amount: share(0.02, "max_hp"), to: "holder" })] })],
    serves: "Cuts 1 ●●, Pact 1 ● ⚙ riposte (half), blood mage (half) ◆ Cuts (staying alive by hitting)",
  });
}
{
  const name = "Tracker's coat", effect = "Abilities ignore Taunt.";
  armor("leather", "uncommon", name, {
    effect, stats: [sp("accuracy", "medium"), sp("cast_speed", "medium")],
    statuses: [own_(name, effect, { seek: "ability" })],
    serves: "Hunt 1 ●● ◆ Hunt (reach)",
  });
}
{
  const name = "Mottled hide", on_ = `${id(name)}_on`, effect = `Below 50% HP: Aggro −${FAR}.`;
  armor("leather", "uncommon", name, {
    effect, stats: [sp("evasion", "medium"), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: whileHp(on_, 50, true) }), switched(on_, "MOTTLED", `Aggro −${FAR}.`, { stats: [{ stat: "aggro", flat: -FAR }] })],
    serves: "net, Pact ● ◆ the net",
  });
}
{
  const name = "Quickstep leathers", effect = "On a dodge: Hasted.";
  armor("leather", "uncommon", name, {
    effect, stats: [sp("attack_speed", "medium"), sp("accuracy", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.dodge, give("haste"))] })],
    serves: "Cuts 1 ●●, Toll ● ⚙ riposte (half) ◆ Cuts (the dodge), Toll (the dancer)",
  });
}
{
  const name = "Duelist's leathers", effect = "On a dodge: strikes the attacker with its weapon.";
  armor("leather", "rare", name, {
    effect, stats: [sp("evasion", "medium"), sp("crit_damage", "medium"), st("aggro", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.dodge, { op: "strike", carry: true, to: "other" })] })],
    serves: "Toll 2 ●●●, Cuts 2 ●● ⚙ riposte (key) ◆ Toll (the dancer), Cuts (the dodge)",
  });
}
{
  const name = "Shadow mantle", effect = "While Hidden: hits deal ×2.";
  armor("leather", "rare", name, {
    effect, stats: [critStep(1), st("aggro", -1), sp("attack_speed", "medium")],
    statuses: [own_(name, effect, { boosts: hits(whileIt(100, { has: "hidden" })) })],
    serves: "Hunt 2 ●●●, conditional ⚙ two in the dark (half) ◆ Hunt (the first strike)",
  });
}
{
  // Conditional through its stats too: Crit damage pays only on a unit that crits.
  const name = "Pack leader's coat", effect = "On a kill: every ally's next basic attack comes at once.";
  armor("leather", "rare", name, {
    effect, stats: [st("attack", 1), st("max_hp", 1), sp("crit_damage", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.kill, swingNow(TO.everyAlly))] })],
    serves: "Hunt 2 ●●●, Landslide ●●, Bonfire ●●, conditional ⚙ judge's drum (key) ◆ Hunt (the kill as a trigger)",
  });
}
{
  // The state is laid while no living ally swings faster and lifted when one does, checked as the fight starts and every tick
  // after (a Haste, a Slow or Chill on anyone can change it).
  const name = "Outrider's coat", on_ = `${id(name)}_on`;
  const effect = "While no ally has a faster basic attack: basic attacks ignore Taunt and deal +20%.";
  armor("leather", "rare", name, {
    effect, stats: [sp("accuracy", "medium"), st("max_hp", 1), sp("cooldown", "medium")],
    statuses: [
      own_(name, effect, {
        reactions: [reactIf(on("fight_start"), self({ swing: "fastest" }), give(on_))],
        pulse: { every: 1, if: self({ swing: "fastest", lacks: on_ }), do: [give(on_)] },
      }),
      switched(on_, "OUTRIDER", "Basic attacks ignore Taunt and deal +20%.", {
        seek: "basic", boosts: [{ tag: "basic", pct: 20 }],
        pulse: { every: 1, if: self({ swing: "fastest" }, 0), do: [lift(on_)] },
      }),
    ],
    serves: "Hunt 2 ●●, Cuts 2 ●●, conditional ◆ Hunt (reach), Cuts (speed)",
  });
}
{
  const name = "Overture coat", effect = "On a kill: its gear's and seat's start-of-fight effects happen again.";
  armor("leather", "rare", name, {
    effect, stats: [st("attack", 1), sp("cast_speed", "medium"), sp("crit_damage", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.kill, { op: "restart", to: "holder" })] })],
    serves: "Hunt 2 ●●● ⚙ opening again (key) ◆ Hunt (the kill as a trigger)",
  });
}
{
  const name = "Windrunner's garb";
  const effect = `On a dodge: 3 Heat (${COUNTER.heat.speed}% faster each, up to ${COUNTER.heat.cap}). When hit: loses 50% of its Heat.`;
  armor("leather", "legendary", name, {
    effect, stats: [sp("evasion", "medium"), sp("attack_speed", "high")],
    statuses: [own_(name, effect, { reactions: [react(EV.dodge, give("heat", "holder", 3)), react(EV.struck, { op: "spend", status: "heat", share: 50, to: "holder" })] })],
    serves: "Cuts 3 ●●, Toll 3 ●● ⚙ riposte (half) ◆ Cuts (the dodge), Toll (the dancer)",
  });
}
{
  // A stack of each affliction the wearer holds, read off the wearer as each hit lands; its own stay.
  const name = "Carrier's coat";
  const effect = "Hits copy a stack of each affliction it holds onto the target.";
  armor("leather", "legendary", name, {
    effect, stats: [st("max_hp", 2), sp("attack_speed", "medium")],
    statuses: [own_(name, effect, {
      reactions: ["burn", "chill", "shock", "bleed", "sunder"].map((s) => reactIf(EV.hit, { side: "self", where: { has: s } }, give(s, "other", 1))),
    })],
    serves: "exotic ⚙ carrier (key)",
  });
}

// ─── Robes ──

armor("robes", "common", "Meditant's habit", { stats: [st("mp_regen", 1)], serves: "MP regen: Barrage's mana inside a fight." });
armor("robes", "common", "Augur's robe", { stats: [critStep(2), st("max_hp", -1)], serves: "Crit chance for HP: a caster's chosen hits for the Hunt and Landslide's crits." });
armor("robes", "common", "Padded cassock", { stats: [st("defense", 2), down(sp("attack_speed", "medium"))], serves: "Defense for Attack speed: Landslide's casters behind stone and a robed anchor for the Toll." });

{
  // A count of its wearer's own casts (a free repeat isn't one): at two, the next is free, and that cast empties the count.
  const name = "Matins robe", n = `${id(name)}_count`, effect = "Every other ability it casts is free.";
  armor("robes", "uncommon", name, {
    effect, stats: [st("max_mp", 1), sp("cooldown", "medium")],
    statuses: [
      own_(name, effect, { mods: [{ mp: -100, if: countAt(n, 1) }], reactions: [react(on("action_resolve", { kind: "ability", counted: true }), give(n, "holder", 1))] }),
      count(n, "MATINS", "Every other cast is free.", 2),
    ],
    serves: "Barrage 1 ●● ⚙ crescendo (half) ◆ Barrage (a free cast)",
  });
}
{
  // Every Intensity status its abilities apply: the afflictions, Might, Shields and the rest.
  const name = "Banked robe", effect = "Abilities add +50% stacks of any status, Shields included.";
  armor("robes", "uncommon", name, {
    effect, stats: [st("attack", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { mods: [{ stacks: { pct: 50 } }] })],
    serves: "Bonfire 1 ●●, Snap 1 ●●, Storm 1 ●●, Landslide ●, Cuts ● ◆ every stacking status",
  });
}
{
  const name = "Glyphed robe", effect = "Each ability it casts Guards it.";
  armor("robes", "uncommon", name, {
    effect, stats: [sp("cast_speed", "medium"), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.cast, give("guard"))] })],
    serves: "Landslide 1 ●, Barrage 1 ● ◆ Landslide (stone), Barrage (the soloist's safety)",
  });
}
{
  const name = "Acolyte's robe", effect = "When another ally casts: regains 5% of max MP.";
  armor("robes", "uncommon", name, {
    effect, stats: [st("aggro", -1), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("action_resolve", { kind: "ability", whose: "ally" }), { op: "mp", amount: share(0.05, "max_mp"), to: "holder" })] })],
    serves: "Barrage 1 ●● ◆ Barrage (MP that flows to the soloist)",
  });
}
{
  // Read once, as each fight starts: the other party members wearing robes then.
  const name = "Conclave robes", effect = "Abilities come round 20% faster for each other ally in robes.";
  armor("robes", "rare", name, {
    effect, stats: [st("max_mp", 1), sp("siphon", "medium"), sp("double_strike", "medium")],
    statuses: [own_(name, effect, { stats: [{ stat: "cooldown_reduction", flat: { scale: [{ ratio: 20, count: { side: "others", where: { armor: ["robes"] } } }] } }] })],
    serves: "Barrage 2 ●●, Bonfire ●●, conditional ◆ Barrage (cooldowns), Bonfire (tempo for the feeders)",
  });
}
{
  // Conditional through its stats: Thorns and Aggro pay only on a robed unit the party makes its anchor.
  const name = "Quiet robes", effect = "Can't be Silenced.";
  armor("robes", "rare", name, {
    effect, stats: [st("max_mp", 1), sp("thorns", "medium"), st("aggro", 1)],
    statuses: [own_(name, effect, { stats: [{ stat: "immune:status:silence", flat: 1 }] })],
    serves: "Barrage 2 ●●, Bonfire ●●, Toll ●, conditional ◆ Barrage (an answer to Silence), Toll (a robed anchor)",
  });
}
{
  // Conditional through its stats too: Crit damage pays only on a unit that crits.
  const name = "Resonant robes", effect = "Each ability it casts comes round 10% sooner per foe it hit.";
  armor("robes", "rare", name, {
    effect, stats: [st("mp_regen", 1), st("max_hp", 1), sp("crit_damage", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.cast, { op: "cooldown", which: "event", set: { lessPct: { scale: [{ ratio: 10, count: "hit" }] } }, to: "holder" })] })],
    serves: "Barrage 2 ●●●, Storm 2 ●●●, Bonfire ●●, Snap ●●, conditional ⚙ resonance (key) ◆ Barrage (cooldowns), Storm (spread)",
  });
}
{
  const name = "Flagellant's vestments";
  const effect = "Abilities cost HP instead of MP. Won't cast one that leaves it below 10% HP.";
  armor("robes", "rare", name, {
    effect, stats: [st("max_hp", 2), sp("lifesteal", "medium"), st("attack", 1), st("defense", -1)],
    statuses: [own_(name, effect, { mods: [{ hp: { pct: 50, share: true, floor: 10, instead: true } }] })],
    serves: "Pact 2 ●●●, Barrage 2 ●● ⚙ blood mage (key), brink (key) ◆ Pact (HP as a price)",
  });
}
{
  const name = "Glimmer robe", on_ = `${id(name)}_on`;
  const effect = "When an ally gives it MP: its next damaging ability deals +50%.";
  const next = on("action_resolve", { kind: "ability", does: ["damage"] });
  armor("robes", "rare", name, {
    effect, stats: [st("attack", 1), critStep(1), sp("cast_speed", "medium")],
    statuses: [
      own_(name, effect, { reactions: [react(on("mp_gained", { other: "ally" }), give(on_))] }),
      oneUse(on_, "GLIMMER", "Next damaging ability deals +50%.", next, { mods: [{ of: { does: ["damage"] }, damage: 50 }] }),
    ],
    serves: "Barrage 2 ●●, conditional ◆ Barrage (MP that flows to the soloist)",
  });
}
{
  const name = "Archmage's mantle";
  const effect = "Abilities cost 50% more MP, and deal, heal and add 50% more.";
  armor("robes", "legendary", name, {
    effect, stats: [st("max_mp", 1), sp("cast_speed", "high")],
    statuses: [own_(name, effect, { mods: [{ mp: 50, damage: 50, heal: 50, stacks: { pct: 50 } }] })],
    serves: "Barrage 3 ●●●, Bonfire ●●, Snap ●● ◆ Barrage (costs that change)",
  });
}
{
  // Swapped as they stand from class, gear and seat (its own MP step and the HP beside it included); statuses change them after.
  const name = "Inverted vestments", effect = "Max HP and max MP trade places.";
  armor("robes", "legendary", name, {
    effect, stats: [st("max_mp", 1), st("defense", 1), sp("cooldown", "medium")],
    statuses: [own_(name, effect, { swap: ["max_hp", "max_mp"] })],
    serves: "exotic",
  });
}
{
  const name = "Motley robe", effect = "Abilities cast in random order, at 50% MP cost.";
  armor("robes", "legendary", name, {
    effect, stats: [st("attack", 1), critStep(2), sp("evasion", "medium"), st("defense", -1)],
    statuses: [own_(name, effect, { order: "random", mods: [{ mp: -50 }] })],
    serves: "exotic",
  });
}

export const gear = S.gear;
export const statuses = S.statuses;
export const served = S.served;
