/**
 * The four armor types' pieces: plate, mail, leather and robes. A common or uncommon carries the standard budget of steps
 * exactly; a rare or legendary at least its step beside the effect that is its shape (kit.ts piece). Statuses are at their
 * own length, and nothing here is balanced.
 *
 * `gear` joins the pack's gear and the rogue's stock; `statuses` the pack's statuses; `served` is designer data, never in the pack.
 */
import type { StatusT } from "../../../src/schema.js";
import { HIT, SPECIAL, STATUS } from "../scale.js";
import { OVERHEAL } from "./shared.js";
import { EV, FEW_TICKS, TAUNTS_ALL_FIGHT, TO, atFirstStart, count, countAt, critStep, give, hits, lift, marker, ofAmount, on, onceBelow, oneUse, own, piece, pieceStatus, react, reactIf, share, shelf, sp, st, stacksOf, state, swingNow, used, whileHolding, whileHp, whileIt, type Change, type Rarity } from "./kit.js";

const S = shelf();

/** One armor piece of a type: its card's effect, its stats, and the statuses behind it (the first is the piece's own, under its id). */
function armor(kind: string, rarity: Rarity, name: string, o: { effect?: string; stats: Change[]; statuses?: StatusT[]; also?: string[]; serves: string }) {
  const statuses = o.statuses ?? [];
  S.add(piece({ name, kind, slot: "armor", rarity, effect: o.effect, stats: o.stats, statuses: [...statuses.filter((s) => s.id === id(name)).map((s) => s.id), ...(o.also ?? [])] }), statuses, o.serves);
}
const id = (name: string) => name.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
/** The piece's own status: on the sheet, under the piece's id, saying what the card says. */
const own_ = (name: string, text: string, body: Partial<StatusT>) => pieceStatus(id(name), name, text, body);
/** A state a piece switches on and off: shown as an icon, never lifted by anything but the piece. */
const switched = (sid: string, name: string, text: string, body: Partial<StatusT>) => state(sid, name, text, { unremovable: true, ...body });
/** "Draws far more" and "far less": two seat steps of Aggro. */
const FAR = 25;

// ─── Plate ──

armor("plate", "common", "Ironclad", { stats: [st("defense", 1)], serves: "Landslide (Defense is its stone and its damage stat); the keepers and rods of Bonfire and the Storm." });
armor("plate", "common", "Crested plate", { stats: [st("max_hp", 1)], serves: "Landslide (max HP is the Knight's bash and the size of its Shield)." });
armor("plate", "common", "Bristled plate", { stats: [sp("thorns", "medium")], serves: "the Toll." });

{
  const name = "Portcullis", on_ = `${id(name)}_on`, effect = "While its wearer is above half its max HP, it draws far more (Aggro +25).";
  armor("plate", "uncommon", name, {
    effect, stats: [sp("thorns", "medium"), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: whileHp(on_, 50, false) }), switched(on_, "PORTCULLIS", "Draws far more.", { stats: [{ stat: "aggro", flat: FAR }] })],
    serves: "Toll 1 ●●, Bonfire ●, Storm ● ⚙ frozen gate (half), mirror (half), reckoning (half) ◆ draw",
  });
}
{
  const name = "Keystone cuirass", effect = "While its wearer holds a Shield, its hits deal a third more.";
  armor("plate", "uncommon", name, {
    effect, stats: [st("defense", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { boosts: hits(whileIt(33, { has: "shield" })) })],
    serves: "Landslide 1 ●●",
  });
}
{
  const name = "Holdfast", done = `${id(name)}_used`, effect = "The first time each fight its wearer drops below half its max HP, it's Guarded.";
  armor("plate", "uncommon", name, {
    effect, stats: [st("defense", 2)],
    statuses: [own_(name, effect, { reactions: [onceBelow(50, done, give("guard"))] }), used(done, "HOLDFAST")],
    serves: "Toll ●, Landslide ●, net ⚙ mirror (half)",
  });
}
{
  const name = "Urchin plate", on_ = `${id(name)}_on`, effect = "While its wearer holds a Shield, it has Thorns, high, on top of its own.";
  armor("plate", "uncommon", name, {
    effect, stats: [st("aggro", 1), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: whileHolding(on_, "shield") }), switched(on_, "URCHIN", "Thorns, high, on top of its own.", { stats: [{ stat: "thorns", flat: SPECIAL.thorns.high }] })],
    serves: "Toll 1 ●●, Landslide ● ⚙ goad (half)",
  });
}
{
  const name = "Challenger's plate", effect = "Its wearer Taunts all fight: its Taunt is laid again each time it ends.";
  armor("plate", "rare", name, {
    effect, stats: [st("defense", 1), st("max_hp", 1), sp("thorns", "medium")],
    statuses: [own_(name, effect, { reactions: TAUNTS_ALL_FIGHT })],
    serves: "Toll 2 ●●●, Bonfire ●●, Storm ●● ⚙ mirror (half), goad (half), frozen gate (half), reckoning (half), two in the dark (half) ◆ draw",
  });
}
{
  const name = "Hoarfrost plate", effect = "Foes that hit its wearer gain a few Chill (from its wearer's Defense).";
  armor("plate", "rare", name, {
    effect, stats: [st("defense", 2), st("aggro", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.struck, give("chill", "other", own("few", "defense")))] })],
    serves: "Toll 2 ●●●, Snap 2 ●●● ⚙ frozen gate (key)",
  });
}
{
  // A Shield emptied by damage ends (cause stacks) with its peak as the amount; a Dispel doesn't set it off.
  const name = "Rubble plate", effect = "When its wearer's Shield breaks, the most that Shield held is sent back to every foe.";
  armor("plate", "rare", name, {
    effect, stats: [st("defense", 1), st("max_hp", 1), st("aggro", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("status_ended", { status: "shield", cause: ["stacks"] }), { op: "damage", type: "none", amount: ofAmount(1), to: TO.everyFoe })] })],
    serves: "Landslide 2 ●●●, Toll ●● ⚙ detonation (key)",
  });
}
{
  // The Spite comes first, so the blow that adds it counts it.
  const name = "Thornheart plate";
  const effect = "Its wearer gathers Spite (a Spite for each hit it takes, kept for the fight, up to 20). A third of each blow, as it was struck, is sent back to the foe that struck it, and a twentieth more of the blow for each Spite.";
  armor("plate", "legendary", name, {
    effect, stats: [sp("thorns", "high"), st("aggro", 1), st("defense", 1)],
    statuses: [own_(name, effect, {
      reactions: [
        react(EV.struck, give("spite", "holder", 1)),
        react(EV.struck, { op: "damage", type: "none", amount: { scale: [{ ratio: 1 / 3, event: "raw" }, { ratio: 0.05, event: "raw", times: { stacks: "spite", of: "holder" } }] }, to: "other" }),
      ],
    })],
    serves: "Toll 3 ●●●, Landslide ●● ⚙ mirror (key)",
  });
}
{
  // The floor comes with the fight's true start, so neither a revive nor a start made again brings a second.
  const name = "Last bastion", floor = `${id(name)}_floor`, on_ = `${id(name)}_on`;
  const effect = "Once a fight, damage that would knock its wearer out leaves it at 1 HP and Guarded. From then until it's next healed, by anyone or anything, its hits deal double.";
  armor("plate", "legendary", name, {
    effect, stats: [st("defense", 2), st("max_hp", 2)],
    statuses: [
      own_(name, effect, {
        reactions: [
          atFirstStart(give(floor)),
          react(on("status_ended", { status: floor, cause: ["spent"] }), give("guard"), give(on_)),
          react(on("healed"), lift(on_)),
        ],
      }),
      state(floor, "LAST BASTION", "The next blow that would knock it out leaves it at 1 HP.", { show: "sheet", unremovable: true, floor: { spend: true } }),
      switched(on_, "BASTION", "Its hits deal double until it's healed.", { boosts: hits(100) }),
    ],
    serves: "net, Pact ●● ⚙ brink (half)",
  });
}
{
  const name = "The anvil";
  const effect = "Each hit its wearer takes gives a Wrath to the other ally with the slowest basic attack (its next basic attack deals a fifth more for each Wrath, up to 10, and spends them).";
  armor("plate", "legendary", name, {
    effect, stats: [st("aggro", 2), st("defense", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.struck, give("wrath", TO.otherSlowestAlly, 1))] })],
    serves: "Toll 3 ●●●, Landslide ●●● ⚙ reckoning (key)",
  });
}

// ─── Mail ──

armor("mail", "common", "Inscribed hauberk", { stats: [st("attack", 1)], serves: "Thousand Cuts; Bonfire, Cold Snap and the Storm." });
armor("mail", "common", "Lamprey mail", { stats: [sp("lifesteal", "medium")], serves: "Blood Pact (its sign, for six classes); Thousand Cuts." });
armor("mail", "common", "Thick byrnie", { stats: [st("max_hp", 1)], serves: "Blood Pact; the Toll." });

{
  const name = "Scabbed mail", effect = "Each hit its wearer lands gives it a Shield of 3% of its max HP.";
  armor("mail", "uncommon", name, {
    effect, stats: [st("max_hp", 1), sp("lifesteal", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.hit, give("shield", "holder", share(0.03, "max_hp")))] })],
    serves: "Cuts 1 ●●, Landslide ● ⚙ detonation (half), riposte (half), brink (half) ◆ shield-by-doing",
  });
}
{
  // A marker on the foe, its wearer's own: it deals the blow as it lands, and Fizzle keeps it to once a foe. The wearer acts.
  const name = "Reprisal hauberk", mark = `${id(name)}_mark`;
  const effect = "The first time each foe hits its wearer in a fight, damage equal to 17% of its wearer's max HP is sent back to that foe.";
  armor("mail", "uncommon", name, {
    effect, stats: [st("max_hp", 1), sp("thorns", "medium")],
    statuses: [
      own_(name, effect, { reactions: [react(EV.struck, give(mark, "other"))] }),
      marker(mark, "REPRISAL", "Has paid for hitting the Reprisal hauberk's wearer.", {
        stacking: "fizzle", unremovable: true, perSource: {},
        reactions: [{ on: on("status_gained", { status: mark }), actor: "source", do: [{ op: "damage", type: "none", amount: share(HIT.touch, "max_hp", "source"), to: "holder" }] }],
      }),
    ],
    serves: "Toll 1 ●●, Storm ●",
  });
}
{
  const name = "Bloodsworn mail", on_ = `${id(name)}_on`, effect = "While its wearer is below half its max HP, it has 20% Lifesteal on top of its own.";
  armor("mail", "uncommon", name, {
    effect, stats: [st("max_hp", 1), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: whileHp(on_, 50, true) }), switched(on_, "BLOODSWORN", "20% Lifesteal on top of its own.", { stats: [{ stat: "lifesteal", flat: SPECIAL.lifesteal.high }] })],
    serves: "Pact 1 ●●, Cuts ● ⚙ brink (half), blood mage (half)",
  });
}
{
  const name = "Warded mail", done = `${id(name)}_used`, effect = "The first time each fight its wearer drops below half its max HP, it gains a Shield of a quarter of its max HP.";
  armor("mail", "uncommon", name, {
    effect, stats: [st("max_hp", 2)],
    statuses: [own_(name, effect, { reactions: [onceBelow(50, done, give("shield", "holder", share(0.25, "max_hp")))] }), used(done, "WARDED")],
    serves: "Pact 1 ●, Toll ●, net ⚙ brink (half)",
  });
}
{
  const name = "Static mail", effect = "Foes that hit its wearer gain a few Shock (from its wearer's Defense).";
  armor("mail", "rare", name, {
    effect, stats: [st("max_hp", 1), st("defense", 1), st("aggro", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.struck, give("shock", "other", own("few", "defense")))] })],
    serves: "Toll 2 ●●●, Storm 2 ●●● ⚙ goad (half)",
  });
}
{
  // First in the order of healing past full: its wearer's own piece.
  const name = "Red stone mail", effect = "Healing its wearer receives past full becomes a Shield on it, a Regen's pulses included.";
  armor("mail", "rare", name, {
    effect, stats: [st("max_hp", 1), st("attack", 1), sp("lifesteal", "medium")],
    statuses: [own_(name, effect, { reactions: [react(on("overhealed"), give("shield", "holder", ofAmount(1)))] })],
    also: [OVERHEAL.own],
    serves: "Pact 2 ●●●, Cuts 2 ●●, Landslide ●● ⚙ red stone (key), detonation (half) ◆ shield-by-doing",
  });
}
{
  const name = "Sanguine mail", low = `${id(name)}_low`, high = `${id(name)}_high`;
  const effect = "While its wearer is below half its max HP, healing it receives is doubled. At half or more, it's halved.";
  armor("mail", "rare", name, {
    effect, stats: [st("max_hp", 2), sp("lifesteal", "medium")],
    statuses: [
      own_(name, effect, { reactions: [...whileHp(low, 50, true), ...whileHp(high, 50, false)] }),
      switched(low, "SANGUINE", "Healing it receives is doubled.", { stats: [{ stat: "healing_received", flat: 100 }] }),
      switched(high, "SANGUINE", "Healing it receives is halved.", { stats: [{ stat: "healing_received", flat: -50 }] }),
    ],
    serves: "Pact 2 ●●●, Toll ● ⚙ brink (half)",
  });
}
{
  const name = "Hexweave mail", effect = "Its wearer's hits deal 10% more for each different debuff their target holds.";
  armor("mail", "rare", name, {
    effect, stats: [st("attack", 2), st("max_hp", 1)],
    statuses: [own_(name, effect, { boosts: hits({ scale: [{ ratio: 10, count: "debuffs", of: "target" }] }) })],
    serves: "Bonfire ●●, Snap ●●, Storm ●●, Cuts ●●, Toll ●● ⚙ every colour (half)",
  });
}
{
  const name = "Aegis mail", effect = "Whenever an ally drops below a third of its max HP, that ally gains Aegis.";
  armor("mail", "legendary", name, {
    effect, stats: [st("max_hp", 2), st("defense", 1), sp("lifesteal", "medium")],
    statuses: [own_(name, effect, { reactions: [react(on("hp_low", { whose: "team", line: 33 }), give("aegis", "owner"))] })],
    serves: "Pact 3 ●●●, Toll ●●, net ⚙ brink (half), mirror (half)",
  });
}
{
  const name = "Tallymail", effect = "Its wearer counts Cuts (a Cut for each hit it lands, kept for the fight, up to 25), and has Lifesteal +1% for each Cut.";
  armor("mail", "legendary", name, {
    effect, stats: [st("max_hp", 1), st("attack", 2), sp("lifesteal", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.hit, give("cuts", "self", 1))], stats: [{ stat: "lifesteal", flat: stacksOf("cuts", 1), live: true }] })],
    serves: "Cuts 3 ●●●, Pact ●●",
  });
}

// ─── Leather ──

armor("leather", "common", "Tumbler's vest", { stats: [sp("evasion", "medium")], serves: "Thousand Cuts; the Storm; the Toll's dancer." });
armor("leather", "common", "Footpad's jerkin", { stats: [critStep(1)], serves: "the Hunt." });
armor("leather", "common", "Spotter's coat", { stats: [sp("accuracy", "medium")], serves: "the Hunt." });

{
  const name = "Gleaner's leathers", effect = "Each hit its wearer lands heals it for 2% of its max HP.";
  armor("leather", "uncommon", name, {
    effect, stats: [sp("evasion", "medium"), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.hit, { op: "heal", amount: share(0.02, "max_hp"), to: "holder" })] })],
    serves: "Cuts 1 ●●, Pact 1 ● ⚙ riposte (half), blood mage (half)",
  });
}
{
  const name = "Tracker's coat", effect = "Its wearer's abilities have Seek.";
  armor("leather", "uncommon", name, {
    effect, stats: [critStep(1), sp("accuracy", "medium")],
    statuses: [own_(name, effect, { seek: "ability" })],
    serves: "Hunt 1 ●●",
  });
}
{
  const name = "Mottled hide", on_ = `${id(name)}_on`, effect = "While its wearer is below half its max HP, it draws far less (Aggro −25).";
  armor("leather", "uncommon", name, {
    effect, stats: [sp("evasion", "medium"), critStep(1)],
    statuses: [own_(name, effect, { reactions: whileHp(on_, 50, true) }), switched(on_, "MOTTLED", "Draws far less.", { stats: [{ stat: "aggro", flat: -FAR }] })],
    serves: "net, Pact ●",
  });
}
{
  const name = "Quickstep leathers", effect = "Each time its wearer dodges a hit, it's Hasted.";
  armor("leather", "uncommon", name, {
    effect, stats: [sp("evasion", "medium"), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.dodge, give("haste"))] })],
    serves: "Cuts 1 ●●, Toll ● ⚙ riposte (half)",
  });
}
{
  const name = "Duelist's leathers", effect = "Each time its wearer dodges a hit, it strikes the attacker with its weapon.";
  armor("leather", "rare", name, {
    effect, stats: [sp("evasion", "medium"), st("aggro", 1), st("attack", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.dodge, { op: "strike", carry: true, to: "other" })] })],
    serves: "Toll 2 ●●●, Cuts 2 ●● ⚙ riposte (key)",
  });
}
{
  const name = "Shadow mantle", effect = "While its wearer is Hidden, its hits deal double.";
  armor("leather", "rare", name, {
    effect, stats: [critStep(2), st("attack", 1)],
    statuses: [own_(name, effect, { boosts: hits(whileIt(100, { has: "hidden" })) })],
    serves: "Hunt 2 ●●● ⚙ two in the dark (half)",
  });
}
{
  const name = "Pack leader's coat", effect = "When its wearer lands a killing blow, every ally's next basic attack comes at once.";
  armor("leather", "rare", name, {
    effect, stats: [st("attack", 1), critStep(1), sp("accuracy", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.kill, swingNow(TO.everyAlly))] })],
    serves: "Hunt 2 ●●●, Landslide ●●, Bonfire ●● ⚙ judge's drum (key) ◆ kill-pays",
  });
}
{
  const name = "Frostwalker's furs", on_ = `${id(name)}_on`;
  const effect = "When a foe's Chill shatters, its wearer is Hasted, and its next hit adds a few Chill (from its wearer's Attack) to every foe.";
  armor("leather", "rare", name, {
    effect, stats: [sp("evasion", "medium"), st("attack", 1), sp("attack_speed", "medium")],
    statuses: [
      own_(name, effect, { reactions: [react(EV.shatter, give("haste"), give(on_))] }),
      switched(on_, "FROSTWALK", "Its next hit adds a few Chill to every foe.", {
        stacking: "refresh", reactions: [react(EV.hit, give("chill", TO.everyFoe, own("few", "attack"), { rider: false }), lift(on_))],
      }),
    ],
    serves: "Snap 2 ●●●, Cuts ● ⚙ firecracker (key), frozen gate (half)",
  });
}
{
  const name = "Overture coat", effect = "Each time its wearer lands a killing blow, the start-of-fight effects of its gear and its seat happen again, once for each kill.";
  armor("leather", "rare", name, {
    effect, stats: [st("attack", 2), critStep(1)],
    statuses: [own_(name, effect, { reactions: [react(EV.kill, { op: "restart", to: "holder" })] })],
    serves: "Hunt 2 ●●● ⚙ opening again (key) ◆ kill-pays",
  });
}
{
  const name = "Windrunner's garb";
  const effect = "Each time its wearer dodges a hit, it gains 3 Heat (it acts 5% faster in everything for each Heat it holds, up to 10). Each hit it takes spends half its Heat.";
  armor("leather", "legendary", name, {
    effect, stats: [sp("evasion", "high"), st("attack", 1), st("aggro", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.dodge, give("heat", "holder", 3)), react(EV.struck, { op: "spend", status: "heat", share: 50, to: "holder" })] })],
    serves: "Cuts 3 ●●, Toll 3 ●● ⚙ riposte (half)",
  });
}
{
  // A stack of each affliction the wearer holds, read off the wearer as each hit lands; its own stay.
  const name = "Carrier's coat";
  const effect = "Each hit its wearer lands gives its target one stack of every affliction its wearer holds: Burn, Chill, Shock, Bleed and Sunder. The wearer keeps its own.";
  armor("leather", "legendary", name, {
    effect, stats: [sp("attack_speed", "high"), st("max_hp", 2)],
    statuses: [own_(name, effect, {
      reactions: ["burn", "chill", "shock", "bleed", "sunder"].map((s) => reactIf(EV.hit, { side: "self", where: { has: s } }, give(s, "other", 1))),
    })],
    serves: "exotic ⚙ carrier (key)",
  });
}

// ─── Robes ──

armor("robes", "common", "Wayfarer's habit", { stats: [st("max_mp", 1)], serves: "Barrage (the pool its soloist spends, and the one mana as armour reads)." });
armor("robes", "common", "Rainwater robe", { stats: [st("mp_regen", 1)], serves: "Barrage (mana inside a fight)." });
armor("robes", "common", "Hermit's cowl", { stats: [st("aggro", -1)], serves: "every caster; Barrage's soloist, who draws little." });

{
  // A count of its wearer's own casts (a free repeat isn't one): at two, the next is free, and that cast empties the count.
  const name = "Matins robe", n = `${id(name)}_count`, effect = "Every second ability its wearer casts in a fight is free.";
  armor("robes", "uncommon", name, {
    effect, stats: [st("max_mp", 1), st("attack", 1)],
    statuses: [
      own_(name, effect, { mods: [{ mp: -100, if: countAt(n, 1) }], reactions: [react(on("action_resolve", { kind: "ability", counted: true }), give(n, "holder", 1))] }),
      count(n, "MATINS", "Every second ability it casts is free.", 2),
    ],
    serves: "Barrage 1 ●● ⚙ crescendo (half) ◆ free-cast",
  });
}
{
  const name = "Banked robe", effect = "Its wearer's abilities add half again as many stacks of Burn, Chill and Shock.";
  armor("robes", "uncommon", name, {
    effect, stats: [st("attack", 1), sp("cast_speed", "medium")],
    statuses: [own_(name, effect, { mods: [{ stacks: { pct: 50, statuses: ["burn", "chill", "shock"] } }] })],
    serves: "Bonfire 1 ●●, Snap 1 ●●, Storm 1 ●●",
  });
}
{
  const name = "Glyphed robe", effect = "Each ability its wearer casts gives it a Shield of a tenth of its max MP.";
  armor("robes", "uncommon", name, {
    effect, stats: [st("max_mp", 1), st("aggro", -1)],
    statuses: [own_(name, effect, { reactions: [react(EV.cast, give("shield", "holder", share(0.1, "max_mp")))] })],
    serves: "Barrage 1 ●, Landslide ● ⚙ detonation (half), mana as armour (half) ◆ shield-by-doing",
  });
}
{
  const name = "Acolyte's robe", effect = "Each time another ally casts an ability, its wearer regains a twentieth of its max MP.";
  armor("robes", "uncommon", name, {
    effect, stats: [st("max_mp", 1), st("mp_regen", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("action_resolve", { kind: "ability", whose: "ally" }), { op: "mp", amount: share(0.05, "max_mp"), to: "holder" })] })],
    serves: "Barrage 1 ●● ◆ free-cast",
  });
}
{
  const name = "Kindled robes";
  const effect = "While any foe burns, its wearer gains a Heat every 4 ticks (it acts 5% faster in everything for each Heat, up to 10, for the rest of the fight).";
  armor("robes", "rare", name, {
    effect, stats: [st("attack", 1), sp("cast_speed", "medium"), st("mp_regen", 1)],
    statuses: [own_(name, effect, { pulse: { every: FEW_TICKS, if: { side: "foes", where: { has: "burn" } }, do: [give("heat", "holder", 1)] } })],
    serves: "Bonfire 2 ●●●, Barrage ●",
  });
}
{
  const name = "Quiet robes", effect = "Its wearer can't be Silenced.";
  armor("robes", "rare", name, {
    effect, stats: [st("max_mp", 1), st("mp_regen", 1), st("aggro", -1)],
    statuses: [own_(name, effect, { stats: [{ stat: "immune:status:silence", flat: 1 }] })],
    serves: "Barrage 2 ●●, Bonfire ●●, stops a cast",
  });
}
{
  const name = "Resonant robes", effect = "Each ability its wearer casts comes round a tenth sooner for each foe it hit.";
  armor("robes", "rare", name, {
    effect, stats: [st("max_mp", 1), st("mp_regen", 1), sp("cast_speed", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.cast, { op: "cooldown", which: "event", set: { lessPct: { scale: [{ ratio: 10, count: "hit" }] } }, to: "holder" })] })],
    serves: "Barrage 2 ●●●, Storm 2 ●●●, Bonfire ●●, Snap ●● ⚙ resonance (key)",
  });
}
{
  const name = "Flagellant's vestments";
  const effect = "Its wearer's abilities cost HP in place of MP: half the share of its max HP that they'd cost of its max MP. It won't cast one that would leave it below a tenth of its max HP.";
  armor("robes", "rare", name, {
    effect, stats: [st("max_mp", 2), st("aggro", -1)],
    statuses: [own_(name, effect, { mods: [{ hp: { pct: 50, share: true, floor: 10, instead: true } }] })],
    serves: "Pact 2 ●●●, Barrage 2 ●● ⚙ blood mage (key), brink (key)",
  });
}
{
  const name = "Glimmer robe", on_ = `${id(name)}_on`;
  const effect = "Each time an ally gives its wearer MP, the next ability its wearer casts that deals damage deals half again as much.";
  const next = on("action_resolve", { kind: "ability", does: ["damage"] });
  armor("robes", "rare", name, {
    effect, stats: [st("attack", 1), st("max_mp", 1), st("aggro", -1)],
    statuses: [
      own_(name, effect, { reactions: [react(on("mp_gained", { other: "ally" }), give(on_))] }),
      oneUse(on_, "GLIMMER", "Its next ability that deals damage deals half again as much.", next, { mods: [{ of: { does: ["damage"] }, damage: 50 }] }),
    ],
    serves: "Barrage 2 ●● ⚙ mana as armour (half)",
  });
}
{
  const name = "Archmage's mantle";
  const effect = "Its wearer's abilities cost half again as much MP, deal half again as much damage, heal half again as much, and add half again as many stacks.";
  armor("robes", "legendary", name, {
    effect, stats: [st("max_mp", 2), st("mp_regen", 1), st("attack", 1)],
    statuses: [own_(name, effect, { mods: [{ mp: 50, damage: 50, heal: 50, stacks: { pct: 50 } }] })],
    serves: "Barrage 3 ●●●, Bonfire ●●, Snap ●●",
  });
}
{
  const name = "Vestments of return", effect = "While its wearer stands, every ally revived comes back behind a Shield of half that ally's max HP.";
  armor("robes", "legendary", name, {
    effect, stats: [st("max_mp", 2), st("mp_regen", 1), st("aggro", -1)],
    statuses: [own_(name, effect, { reactions: [react(on("revived", { whose: "ally" }), give("shield", "owner", share(STATUS.shield.capShare, "max_hp", "target")))] })],
    serves: "net",
  });
}
{
  const name = "Motley robe", effect = "Its wearer casts its abilities in a random order, whatever order they're slotted in, and each costs half its MP.";
  armor("robes", "legendary", name, {
    effect, stats: [st("attack", 2), sp("cast_speed", "medium"), st("aggro", -1)],
    statuses: [own_(name, effect, { order: "random", mods: [{ mp: -50 }] })],
    serves: "exotic",
  });
}

export const gear = S.gear;
export const statuses = S.statuses;
export const served = S.served;
