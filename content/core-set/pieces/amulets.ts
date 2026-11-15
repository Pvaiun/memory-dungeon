/**
 * The amulets: 37 pieces, 10 common, 7 uncommon, 10 rare and 10 legendary. Every class wears the amulet, so it has no kind
 * leaning; each piece's stats are its own. Every piece carries the standard budget of steps exactly (kit.ts piece: one, two,
 * then three from rare up), at most one stat a step down for one more step elsewhere. Statuses are at their own length, and
 * nothing here is balanced.
 *
 * `gear` joins the pack's gear and the rogue's stock; `statuses` the pack's statuses; `served` is designer data, never in the pack.
 */
import type { StatusT } from "../../../src/schema.js";
import { FLAT_STACKS } from "../scale.js";
import { AFFLICTIONS, CRESCENDO } from "./shared.js";
import { EV, NO_MARK, SO_OFTEN, TO, atStart, critStep, give, hits, marker, ofAmount, on, own, piece, pieceStatus, react, reactIf, share, shelf, sp, st, stacksOf, used, whileIt, type Change, type Rarity } from "./kit.js";

const S = shelf();

/** One amulet: its card's effect, its stats, and the statuses behind it (the first is the piece's own, under its id). */
function amulet(rarity: Rarity, name: string, o: { effect?: string; stats: Change[]; statuses?: StatusT[]; serves: string }) {
  const statuses = o.statuses ?? [];
  S.add(piece({ name, slot: "amulet", rarity, effect: o.effect, stats: o.stats, statuses: statuses.filter((s) => s.id === id(name)).map((s) => s.id) }), statuses, o.serves);
}
const id = (name: string) => name.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
/** The piece's own status: on the sheet, under the piece's id, saying what the card says. */
const own_ = (name: string, text: string, body: Partial<StatusT>) => pieceStatus(id(name), name, text, body);
/** A step given up: the same step, down (kit.ts stepsOf counts it against the rest; downOf allows one). */
const less = (c: Change): Change => ({ ...c, flat: -c.flat });

// ─── Common: each its own stat line, unique in the stock ──

amulet("common", "Thistle burr", { stats: [critStep(1), sp("thorns", "medium"), less(sp("cooldown", "medium"))], serves: "the Toll and the Hunt: thorns for the struck, a crit for the striker, on a unit whose abilities can wait." });
amulet("common", "Water clock", { stats: [st("mp_regen", 2), less(sp("cooldown", "medium"))], serves: "Barrage: mana in fights, for a unit that casts big and seldom." });
amulet("common", "Peacock feather", { stats: [st("aggro", 2), less(critStep(1))], serves: "the Toll: draw, for an anchor that doesn't count on crits." });
amulet("common", "Ox bone", { stats: [st("max_hp", 2), less(sp("cooldown", "medium"))], serves: "the Toll, Blood Pact: a body to be struck or to pay with, on a unit whose abilities can wait." });
amulet("common", "Dewstone", { stats: [st("mp_regen", 2), st("attack", -1)], serves: "Barrage: mana in fights, for a giver whose Attack matters least." });
amulet("common", "Lotus seed", { stats: [st("mp_regen", 2), less(sp("attack_speed", "medium"))], serves: "Barrage: mana in fights, for a caster that seldom swings." });
amulet("common", "Obsidian chip", { stats: [critStep(2), st("defense", -1)], serves: "the Hunt: crits, for a unit that isn't struck." });
amulet("common", "Smooth stone", { stats: [st("max_hp", 2), less(critStep(1))], serves: "the Toll, Blood Pact: a body, for a unit that doesn't count on crits." });
amulet("common", "Deepwell stone", { stats: [st("max_mp", 2), less(sp("cooldown", "medium"))], serves: "Barrage: a deep pool, for a caster whose abilities can wait." });
amulet("common", "Tin whistle", { stats: [st("aggro", 2), st("attack", -1)], serves: "the Toll: draw, for an anchor whose damage is its thorns." });

// ─── Uncommon ──

{
  // The affliction the target holds most (level ones at random), at the stacks a swing's rider adds; nothing on a target with none.
  const name = "Tinder charm", effect = "Basic attacks add the affliction the target holds most.";
  amulet("uncommon", name, {
    effect, stats: [sp("attack_speed", "medium"), critStep(1)],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, { op: "one", of: AFFLICTIONS.map((status) => ({ status, stacks: own("few", "attack") })), pick: "most", to: "other" })] })],
    serves: "Bonfire 1 ●●, Snap 1 ●●, Storm 1 ●●, Cuts 1 ● ⚙ lead's colour (half) ◆ the status roads' first step",
  });
}
{
  const name = "Challenger's token", effect = "At fight start: Taunts.";
  amulet("uncommon", name, {
    effect, stats: [st("attack", 1), st("aggro", 1)],
    statuses: [own_(name, effect, { reactions: [atStart(give("taunt"))] })],
    serves: "Toll 1 ●● ⚙ opening again (half), goad (half), frozen gate (half), mirror (half), riposte (half), two in the dark (half) ◆ Toll (draw)",
  });
}
{
  // A heavy shell: a step of Attack speed given up for a second step of Defense.
  const name = "Carapace charm", effect = "Takes 25% less damage from Area hits.";
  amulet("uncommon", name, {
    effect, stats: [st("defense", 2), st("max_hp", 1), less(sp("attack_speed", "medium"))],
    statuses: [own_(name, effect, { taken: [{ tag: "area", pct: -25 }] })],
    serves: "general",
  });
}
{
  const name = "Hare's foot", effect = "At fight start: Hasted.";
  amulet("uncommon", name, {
    effect, stats: [critStep(1), sp("evasion", "medium")],
    statuses: [own_(name, effect, { reactions: [atStart(give("haste"))] })],
    serves: "Cuts 1 ●●, Bonfire ●, Storm ●, Barrage ● ⚙ opening again (half), spell on the swing (half) ◆ Cuts (speed)",
  });
}
{
  // Half as often is its shape (Attack speed −100 counts no step).
  const name = "Millstone", effect = "Basic attacks come 50% as often and deal ×2.25 damage.";
  amulet("uncommon", name, {
    effect, stats: [st("attack", 1), st("max_hp", 1), { stat: "attack_speed", flat: -100 }],
    statuses: [own_(name, effect, { boosts: [{ tag: "basic", pct: 125 }] })],
    serves: "Landslide 1 ●●●, Hunt ● ⚙ judge's drum (half), avalanche (half), reckoning (half) ◆ Landslide (swing shape)",
  });
}
{
  // Half as often again is its shape (Attack speed +50 counts no step): even for the swing, but every rider and every Bleed a
  // hit pays comes half again as often.
  const name = "Hummingbird charm", effect = "Basic attacks come 50% more often and deal 33% less.";
  amulet("uncommon", name, {
    effect, stats: [sp("evasion", "medium"), sp("accuracy", "medium"), { stat: "attack_speed", flat: 50 }],
    statuses: [own_(name, effect, { boosts: [{ tag: "basic", pct: -33 }] })],
    serves: "Cuts 1 ●●●, Bonfire ●, Snap ●, Storm ● ⚙ spell on the swing (half) ◆ Cuts (swing shape)",
  });
}
{
  // A look every tick: under half its MP, and no Clarity from the charm for a short while, it gains one and the wait begins.
  const name = "Clear-headed charm", wait = `${id(name)}_wait`;
  const effect = `Below 50% MP: Clarity every ${SO_OFTEN} ticks, starting at once.`;
  const ready = { side: "self" as const, where: { mpBelow: 50, lacks: wait } };
  amulet("uncommon", name, {
    effect, stats: [sp("cast_speed", "medium"), st("aggro", -1)],
    statuses: [
      own_(name, effect, { reactions: [reactIf(on("fight_start"), ready, give("clarity"), give(wait))], pulse: { every: 1, if: ready, do: [give("clarity"), give(wait)] } }),
      marker(wait, "Clear-headed", "Next Clarity when this ends.", { stacking: "fizzle", duration: SO_OFTEN }),
    ],
    serves: "Barrage 1 ●● ⚙ mana as armour (half) ◆ Barrage (mana)",
  });
}

// ─── Rare ──

{
  // A Shield emptied by a foe's damage ends (cause stacks) with its peak as the amount and that foe as its other unit.
  const name = "Shatterstone charm";
  const effect = "When a foe breaks its Shield: sends back 200% of the most it held.";
  amulet("rare", name, {
    effect, stats: [st("defense", 2), sp("crit_damage", "medium")],
    statuses: [own_(name, effect, { reactions: [react(on("status_ended", { status: "shield", cause: ["stacks"], other: "foe" }), { op: "damage", type: "none", amount: ofAmount(2), to: "other" })] })],
    serves: "Landslide 2 ●●●, Cuts ●, Toll ●●, conditional ⚙ detonation (key) ◆ the shield detonation",
  });
}
{
  const name = "Bounty charm", effect = "On a kill: its ability with the most cooldown left is ready, the killing one included.";
  amulet("rare", name, {
    effect, stats: [sp("accuracy", "medium"), sp("attack_speed", "medium"), st("max_mp", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.kill, { op: "cooldown", which: "longest", set: "ready", to: "holder" })] })],
    serves: "Hunt 2 ●●●, Barrage ●● ⚙ reaping (key) ◆ the reaping",
  });
}
{
  const name = "Echo charm", effect = "Extra strikes carry the swing's effects.";
  amulet("rare", name, {
    effect, stats: [sp("double_strike", "medium"), st("defense", 1), st("mp_regen", 1)],
    statuses: [own_(name, effect, { echo: true })],
    serves: "Cuts 2 ●●, Bonfire ●, Snap ●, Storm ●, conditional ◆ Cuts (extra strikes)",
  });
}
{
  // Kinds don't change in a fight, so the bond is laid once, on itself and on every other ally that wields its kind: a fallen
  // kin keeps it for its revive, and two charms on kin lay one bond.
  const name = "Kinship charm", bond = `${id(name)}_bond`;
  const effect = "While another ally wields the same weapon kind: hits deal +15%, and that ally's do too.";
  const kin = { side: "others" as const, where: { kin: true as const } };
  amulet("rare", name, {
    effect, stats: [st("max_hp", 2), st("attack", 1)],
    statuses: [
      own_(name, effect, { reactions: [reactIf(on("fight_start", { repeat: false }), kin, give(bond), give(bond, { ...kin, pick: "all" }))] }),
      { id: bond, name: "Kinship", text: "Hits deal +15%.", label: "buff", show: "sheet", stacking: "refresh", unremovable: true, survivesKO: true, boosts: hits(15) },
    ],
    serves: "general, conditional",
  });
}
{
  const name = "Lightning-glass", effect = "Abilities deal +4% per Shock on the target.";
  amulet("rare", name, {
    effect, stats: [critStep(1), sp("cast_speed", "medium"), st("attack", 1)],
    statuses: [own_(name, effect, { boosts: [{ tag: "ability", pct: stacksOf("shock", 4, "target") }] })],
    serves: "Storm 2 ●●●, Landslide ●, Snap ● ⚙ held charge (key) ◆ Storm (the reader)",
  });
}
{
  // The cap takes what's above half as the status lands, and at the cap the unit reads as under it (the engine's).
  const name = "Halved heart";
  const effect = "Starts each fight at 50% HP and can't be healed above it. Counts as below 50%. Hits deal +50%.";
  amulet("rare", name, {
    effect, stats: [st("max_hp", 2), sp("crit_damage", "medium")],
    statuses: [own_(name, effect, { healCap: 50, boosts: hits(50) })],
    serves: "Pact 2 ●●●, Toll ● ⚙ brink (key) ◆ Pact (below half)",
  });
}
{
  const name = "Crescendo charm";
  const effect = "Each cast gives that ability a Crescendo: +20% damage, healing and stacks, and +40% cost, per Crescendo (up to 10).";
  amulet("rare", name, {
    effect, stats: [st("max_mp", 2), sp("siphon", "medium")],
    statuses: [own_(name, effect, { mods: [{ damage: 20, heal: 20, stacks: { pct: 20 }, mp: 40, times: CRESCENDO }] })],
    serves: "Barrage 2 ●●● ⚙ crescendo (key) ◆ the crescendo",
  });
}
{
  // The lowest HP% of the party, itself included: when that's itself, nothing changes.
  const name = "Tethered heart", effect = `Every ${SO_OFTEN} ticks: trades HP% with the ally with the lowest HP%.`;
  amulet("rare", name, {
    effect, stats: [sp("lifesteal", "medium"), st("max_hp", 1), st("aggro", -1)],
    statuses: [own_(name, effect, { pulse: { every: SO_OFTEN, do: [{ op: "trade", to: TO.lowestAlly }] } })],
    serves: "exotic",
  });
}
{
  const name = "Hunter's mark", effect = "While no foe is Marked: Marks the foe with the least HP.";
  amulet("rare", name, {
    effect, stats: [critStep(2), sp("evasion", "medium")],
    statuses: [own_(name, effect, {
      reactions: [reactIf(on("fight_start"), NO_MARK, give("marked", TO.lowestHpFoe)), reactIf(on("status_ended", { status: "marked", whose: "foe" }), NO_MARK, give("marked", TO.lowestHpFoe))],
    })],
    serves: "Hunt 2 ●●● ⚙ judge's drum (half) ◆ Hunt (Mark)",
  });
}
{
  const name = "Shroud charm", effect = "An ally that drops below 33% HP is Hidden.";
  amulet("rare", name, {
    effect, stats: [st("aggro", -2), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("hp_low", { whose: "team", line: 33 }), give("hidden", "owner"))] })],
    serves: "Pact ●●, conditional ⚙ two in the dark (key), brink (half) ◆ the net, two in the dark",
  });
}

// ─── Legendary ──

{
  // An affliction its wearer lays on one foe (not an area's), shared at a third with every other foe; a copy is never shared
  // again. Its stats pay on an anchor (Aggro and Thorns), where what strikes it back is laid on one foe at a time.
  const name = "Heart of the many";
  const effect = "When it adds an affliction to one foe, every other foe gains 33% as much.";
  amulet("legendary", name, {
    effect, stats: [st("aggro", 1), sp("thorns", "medium"), st("max_hp", 1)],
    statuses: [own_(name, effect, {
      reactions: AFFLICTIONS.map((status) => react(on("status_gained", { status, whose: "foe", other: "holder", notTags: ["area"], repeat: false }), { op: "share", ratio: 1 / 3, to: TO.otherFoes("owner") })),
    })],
    serves: "Bonfire 3 ●●●, Snap 3 ●●●, Storm 3 ●●, Cuts 3 ●●, conditional ◆ the status roads' pack game (spread)",
  });
}
{
  // A drop under the line once it has acted: a fight it starts under the line has no ticks to go back to, and doesn't spend it.
  const name = "Sandglass", done = `${id(name)}_used`, back = 10;
  const effect = `Once a fight, below 33% HP: its HP goes back to what it was ${back} ticks before.`;
  amulet("legendary", name, {
    effect, stats: [sp("cooldown", "high"), st("max_hp", 1)],
    statuses: [
      own_(name, effect, { reactions: [reactIf(on("hp_low", { line: 33 }), { side: "self", where: { lacks: done, acted: true } }, { op: "rewind", ticks: back, to: "holder" }, give(done))] }),
      used(done, "SANDGLASS"),
    ],
    serves: "exotic",
  });
}
{
  // The dodged hit, at its raw size, from the wearer's hand: a foe other than the attacker, by draw; alone, it lands nowhere.
  const name = "Mirror charm", effect = "On a dodge: the hit lands on another foe instead.";
  amulet("legendary", name, {
    effect, stats: [sp("evasion", "medium"), sp("accuracy", "medium"), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.dodge, { op: "strike", of: "hit", to: { side: "foes", pick: "aggro", exclude: "other" } })] })],
    serves: "exotic",
  });
}
{
  const name = "Twin-knot";
  const effect = "When it gives itself a status, the other ally with the lowest HP% gains it too.";
  amulet("legendary", name, {
    effect, stats: [sp("siphon", "medium"), st("max_hp", 1), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("status_gained", { other: "holder", repeat: false }), { op: "share", to: TO.otherLowestAlly })] })],
    serves: "exotic ⚙ borrowed gift (key), brink (half), two in the dark (half)",
  });
}
{
  // Every debuff it holds rides its next hit that lands onto the foe hit; Doom stays.
  const name = "Scapegoat charm";
  const effect = "Each hit it lands moves its debuffs, all stacks, onto the target. Never Doom.";
  amulet("legendary", name, {
    effect, stats: [st("aggro", 1), st("max_hp", 1), sp("attack_speed", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.hit, { op: "pass", label: "debuff", except: ["doom"], to: "other" })] })],
    serves: "exotic ⚙ carrier (half)",
  });
}
{
  const name = "Burning heart";
  const effect = `Every 10 ticks: ${FLAT_STACKS.few} Burn on itself. While it burns: hits deal +50%.`;
  amulet("legendary", name, {
    effect, stats: [sp("lifesteal", "high"), st("max_hp", 1)],
    statuses: [own_(name, effect, { pulse: { every: 10, do: [give("burn", "holder", FLAT_STACKS.few)] }, boosts: hits(whileIt(50, { has: "burn" })) })],
    serves: "exotic ⚙ carrier (half)",
  });
}
{
  // A fallen unit can't gain a status, so its fall schedules its own return unless the marker is there; the marker is set
  // when it stands again by its own hand. As every revive, it comes back with its actions on full cooldown.
  const name = "Phoenix ember", done = `${id(name)}_used`;
  const effect = "Once a fight: rises 4 ticks after falling, at 33% HP and Hidden.";
  amulet("legendary", name, {
    effect, stats: [st("max_hp", 2), st("mp_regen", 1)],
    statuses: [
      own_(name, effect, {
        survivesKO: true,
        reactions: [
          react(on("ko"), { op: "revive", hp: share(1 / 3, "max_hp", "target"), after: 4, to: { side: "self", where: { ko: true, lacks: done } } }),
          react(on("revived", { other: "holder" }), give(done), give("hidden")),
        ],
      }),
      used(done, "PHOENIX EMBER"),
    ],
    serves: "exotic",
  });
}
{
  // Cooldown −16.7 is its shape (cooldowns ×1.2, a fifth longer), counting no step.
  const name = "Ready stance", effect = "Abilities start each fight at least 50% charged. Cooldowns 20% longer.";
  amulet("legendary", name, {
    effect, stats: [st("attack", 1), st("defense", 1), sp("evasion", "medium"), { stat: "cooldown_reduction", flat: -16.7 }],
    statuses: [own_(name, effect, { reactions: [atStart({ op: "cooldown", which: "abilities", set: { atMost: 50 }, to: "holder" })] })],
    serves: "exotic",
  });
}
{
  // The chance set after every stat; hits −50%, and the crit multiplier doubled, so a crit lands at its usual size. A gambler's
  // guard: a step of Defense given up for a second step of Attack.
  const name = "Gambler's coin";
  const effect = "Crit chance is 50%. Hits that don't crit deal −50%.";
  amulet("legendary", name, {
    effect, stats: [sp("crit_damage", "medium"), st("attack", 2), st("defense", -1), st("max_hp", 1)],
    statuses: [own_(name, effect, { set: [{ stat: "crit_chance", value: 50 }], boosts: hits(-50), stats: [{ stat: "crit_multiplier", flat: share(1, "crit_multiplier") }] })],
    serves: "exotic ⚙ emptied quiver (half)",
  });
}
{
  // Its own Defense is swapped with the rest: on its wearer it reads as Attack.
  const name = "Turncoat charm";
  const effect = "Attack and Defense swap, gear and seat counted. Statuses apply after.";
  amulet("legendary", name, {
    effect, stats: [st("defense", 2), st("aggro", -1)],
    statuses: [own_(name, effect, { swap: ["attack", "defense"] })],
    serves: "exotic",
  });
}

export const gear = S.gear;
export const statuses = S.statuses;
export const served = S.served;
