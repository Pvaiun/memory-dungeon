/**
 * Six weapon kinds' pieces: dagger, fist weapons, wand, sword, spear and axe. Each kind's pieces carry its budget of stat
 * steps at every rarity (kit.ts budgetOf), and every weapon swings as its kind's plain weapon does unless its card says
 * otherwise. Statuses are at their own length, and nothing here is balanced.
 *
 * `gear` joins the pack's gear and the rogue's stock; `statuses` the pack's statuses; `served` is designer data, never in the pack.
 */
import type { GearT, StatusT } from "../../../src/schema.js";
import { COUNTER } from "./shared.js";
import { EV, NO_MARK, against, atStart, critStep, give, hits, lift, marker, on, oneUse, own, piece, pieceStatus, react, reactIf, shelf, sp, stacksOf, swingNow, type Change, type Rarity, type Trade } from "./kit.js";

const S = shelf();

/** One weapon of a kind: its card's effect, its stats, and the statuses behind it (the first is the piece's own, under its id). */
function weapon(kind: string, rarity: Rarity, name: string, o: { effect?: string; stats: Change[]; trade?: Trade; weapon?: GearT["weapon"]; statuses?: StatusT[]; serves: string }) {
  const statuses = o.statuses ?? [];
  S.add(piece({ name, kind, slot: "weapon", rarity, effect: o.effect, stats: o.stats, trade: o.trade, weapon: o.weapon, statuses: statuses.filter((s) => s.id === id(name) || s.id.startsWith(`${id(name)}__given`)).map((s) => s.id) }), statuses, o.serves);
}
const id = (name: string) => name.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
/** The piece's own status: on the sheet, under the piece's id, saying what the card says. */
const own_ = (name: string, text: string, body: Partial<StatusT>) => pieceStatus(id(name), name, text, body);

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

void COUNTER; void against; void lift; void on;

export const gear = S.gear;
export const statuses = S.statuses;
export const served = S.served;
