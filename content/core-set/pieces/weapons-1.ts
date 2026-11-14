/**
 * Six weapon kinds' pieces, 60 in all: dagger, fist weapons, wand, sword, spear and axe. Each kind's pieces carry its budget of
 * stat steps at every rarity (kit.ts budgetOf), a step down on one stat buying one more elsewhere, and every weapon swings as
 * its kind's plain weapon does unless its card or its swing trade says otherwise. Each piece's stats are its own, chosen for
 * what it is, never from the build its effect serves. Statuses are at their own length, and nothing here is balanced.
 *
 * `gear` joins the pack's gear and the rogue's stock; `statuses` the pack's statuses; `served` is designer data, never in the pack.
 */
import type { GearT, NumT, StatusT, TargetRuleT } from "../../../src/schema.js";
import { FLAT_STACKS, P, PIECE_SPECIAL, STEP } from "../scale.js";
import { EV, NO_MARK, TO, against, critStep, give, hits, lift, marker, ofAmount, on, own, piece, pieceStatus, react, reactIf, share, shelf, sp, st, stacksOf, state, swingNow, weaponHit, whileHolding, whileHp, whileIt, count, countAt, type Change, type Rarity, type Trade } from "./kit.js";
import { AFFLICTIONS } from "./shared.js";

const S = shelf();

/** One weapon of a kind: its card's effect, its stats, and the statuses behind it (the first is the piece's own, under its id). */
function weapon(kind: string, rarity: Rarity, name: string, o: { effect?: string; stats: Change[]; trade?: Trade; weapon?: GearT["weapon"]; statuses?: StatusT[]; serves: string }) {
  const statuses = o.statuses ?? [];
  S.add(piece({ name, kind, slot: "weapon", rarity, effect: o.effect, stats: o.stats, trade: o.trade, weapon: o.weapon, statuses: statuses.filter((s) => s.id === id(name) || s.id.startsWith(`${id(name)}__given`)).map((s) => s.id) }), statuses, o.serves);
}
const id = (name: string) => name.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
/** The piece's own status: on the sheet, under the piece's id, saying what the card says. */
const own_ = (name: string, text: string, body: Partial<StatusT>) => pieceStatus(id(name), name, text, body);
/** A stat a step down: what a piece gives up for one step more elsewhere (kit.ts downOf). */
const down = (c: Change): Change => ({ ...c, flat: -c.flat });
/** "Its basic attacks and extra strikes add": riders on both, so a borrower and a carried hit read them as the swing's. */
const swingRider = (status: string, stacks: NumT) => [react(EV.basic, give(status, "other", stacks)), react(EV.extra, give(status, "other", stacks))];
/** A state a piece switches on and off, shown as an icon: removable, since a lift by name skips an unremovable status. */
const switched = (sid: string, name: string, text: string, body: Partial<StatusT>) => state(sid, name, text, body);

// ─── Dagger (Ranger, Assassin, Bard, Hexer): fast, one hand; light, Attack-heavy, standard ──

weapon("dagger", "common", "Stiletto", { stats: [critStep(1)], serves: "Hunt, Cuts" });
weapon("dagger", "common", "Brawler's dirk", { stats: [st("max_hp", 2), st("defense", -1)], serves: "Pact" });

{
  // Once the foe holds the mark, the reaction's test skips it, so later hits add nothing. A marker: no Cleanse lifts it.
  const name = "Weeping kris", mark = `${id(name)}_mark`;
  const effect = "The first hit on each foe adds Bleed.";
  weapon("dagger", "uncommon", name, {
    effect, stats: [sp("siphon", "medium"), st("attack", 1)],
    statuses: [
      own_(name, effect, { reactions: [reactIf(EV.hit, { unit: "other", where: { lacks: mark } }, give("bleed", "other", own("several", "attack")), give(mark, "other", undefined, { rider: false }))] }),
      marker(mark, "Wept", "Already cut by the Weeping kris.", { perSource: {} }),
    ],
    serves: "Cuts 1 ●● ⚙ red rain (half) ◆ Cuts (Bleed)",
  });
}
{
  // Each foe an ally hits carries a marker until the wearer's next basic attack, which reads it and then lifts it from every foe.
  const name = "Follow-up dirk", mark = `${id(name)}_mark`;
  const effect = "Basic attacks on a foe an ally hit since its last basic attack deal +25%.";
  weapon("dagger", "uncommon", name, {
    effect, stats: [sp("attack_speed", "medium"), sp("cooldown", "medium")],
    statuses: [
      own_(name, effect, {
        boosts: [{ tag: "basic", pct: against(25, { has: mark }) }],
        reactions: [react(on("hit_lands", { whose: "ally" }), give(mark, "other", undefined, { rider: false })), react(EV.swing, lift(mark, TO.everyFoe, "marker"))],
      }),
      marker(mark, "Followed up", "An ally hit it since the Follow-up dirk's last basic attack."),
    ],
    serves: "Cuts 1 ●●, Hunt 1 ●● ◆ Cuts (pourers), Hunt (focus)",
  });
}
{
  // A count of basic attacks made: the third, reading two, strikes twice, and its own count fills and empties the count.
  const name = "Second thrust", n = `${id(name)}_count`;
  const effect = "Every 3rd basic attack strikes twice.";
  weapon("dagger", "uncommon", name, {
    effect, stats: [sp("evasion", "medium"), st("defense", 1)],
    statuses: [
      own_(name, effect, { strike: { to: "target", when: countAt(n, 2) }, reactions: [react(EV.swing, give(n, "holder", 1))] }),
      count(n, "SECOND THRUST", effect, 3),
    ],
    serves: "Cuts 1 ●●, Storm 1 ●● ◆ Cuts (extra strikes), Storm (quick strikes)",
  });
}
{
  const name = "Letter opener", effect = "Hits strip the foe's buffs.";
  weapon("dagger", "rare", name, {
    effect, stats: [st("max_mp", 1), sp("cast_speed", "medium"), sp("accuracy", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.hit, { op: "remove", label: "buff", to: "other" })] })],
    serves: "exotic",
  });
}
{
  // Another ally's crit, while that ally wields a dagger: the wearer's own basic attack made ready.
  const name = "Twin dirk", effect = "When another ally wielding a dagger crits: next basic attack comes at once.";
  weapon("dagger", "rare", name, {
    effect, stats: [sp("double_strike", "medium"), critStep(1), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [reactIf(on("hit_lands", { whose: "ally", tags: ["crit"] }), { unit: "owner", where: { weapon: ["dagger"] } }, swingNow())] })],
    serves: "conditional, Cuts 2 ●●●, Hunt 2 ●● ◆ Cuts (speed), Hunt (crits)",
  });
}
{
  const name = "Ambush knife";
  const effect = "Hits on a foe that hasn't acted yet crit 80% of the time.";
  weapon("dagger", "rare", name, {
    effect, stats: [st("aggro", -1), sp("crit_damage", "medium"), sp("accuracy", "medium")],
    statuses: [own_(name, effect, { crits: [{ when: { acted: false }, set: 80 }] })],
    serves: "Hunt 2 ●●● ⚙ emptied quiver (half) ◆ Hunt (first strike)",
  });
}
{
  const name = "Thousandth cut";
  const effect = "Each hit adds an Edge (up to 25). Hits deal +2% per Edge.";
  weapon("dagger", "legendary", name, {
    effect, stats: [sp("attack_speed", "medium"), sp("lifesteal", "medium"), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.hit, give("edge", "self", 1))], boosts: hits(stacksOf("edge", 2)) })],
    serves: "Cuts 3 ●●● ◆ Cuts (the count)",
  });
}
{
  const name = "Quietus", effect = "On a crit: Bewilders the target.";
  weapon("dagger", "legendary", name, {
    effect, stats: [st("aggro", -2), critStep(1)],
    statuses: [own_(name, effect, { reactions: [react(EV.crit, give("bewildered", "other"))] })],
    serves: "exotic",
  });
}

// ─── Fist weapons (Monk, Vampire, Stormcaller): fast, one hand; light, even, standard ──

weapon("fist", "common", "Sidestep claws", { stats: [sp("evasion", "medium")], serves: "Toll, Cuts" });
weapon("fist", "common", "Brazen talons", { stats: [st("aggro", 2), st("max_hp", -1)], serves: "Toll" });

{
  const name = "Live-wire knuckles", effect = "Basic attacks and extra strikes add Shock.";
  weapon("fist", "uncommon", name, {
    effect, stats: [st("attack", 1), sp("cooldown", "medium")],
    statuses: [own_(name, effect, { reactions: swingRider("shock", own("few", "attack")) })],
    serves: "Storm 1 ●● ⚙ lead's colour (half) ◆ Storm (Shock)",
  });
}
{
  const name = "Knuckle-dusters", effect = "Extra strikes deal +50%.";
  weapon("fist", "uncommon", name, {
    effect, stats: [st("attack", 2), sp("crit_damage", "medium"), down(sp("attack_speed", "medium"))],
    statuses: [own_(name, effect, { boosts: [{ tag: "extra", pct: 50 }] })],
    serves: "Cuts 1 ●● ◆ Cuts (extra strikes)",
  });
}
{
  // Double strike's second strike, replaced: the same roll, landing on another foe (with none, there is no second strike).
  const name = "Weaver's wraps", effect = "Extra strikes land on a random other foe, never the target.";
  weapon("fist", "uncommon", name, {
    effect, stats: [sp("cast_speed", "medium"), sp("evasion", "medium")],
    statuses: [own_(name, effect, { strike: { scale: "double_strike", replace: true, to: { side: "foes", pick: "random", exclude: "targets" } } })],
    serves: "Storm 1 ●●, Cuts 1 ● ◆ Storm (spread), Cuts (extra strikes)",
  });
}
{
  const name = "Lamprey claws", effect = "Each extra strike heals it for 10% of max HP.";
  weapon("fist", "uncommon", name, {
    effect, stats: [sp("siphon", "medium"), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.extra, { op: "heal", amount: share(0.1, "max_hp"), to: "holder" })] })],
    serves: "Pact 1 ●●, Cuts 1 ● ◆ Pact (staying alive by hitting), Cuts (staying alive by hitting)",
  });
}
{
  const name = "Gorged claws", on_ = `${id(name)}_on`;
  const effect = "Below half HP: basic attacks come 33% faster.";
  weapon("fist", "rare", name, {
    effect, stats: [st("max_hp", 2), sp("lifesteal", "medium")],
    statuses: [
      own_(name, effect, { reactions: whileHp(on_, 50, true) }),
      switched(on_, "GORGED", "Basic attacks come 33% faster.", { stats: [{ stat: "attack_speed", flat: 33 }] }),
    ],
    serves: "Pact 2 ●●● ⚙ brink (half) ◆ Pact (below half)",
  });
}
{
  // The Haste an ally gains, shared as a copy: a copy is a repeat, so two wearers don't pass one Haste back and forth.
  const name = "Bellows wraps", effect = "When another ally gains Haste: Hasted too.";
  weapon("fist", "rare", name, {
    effect, stats: [st("defense", 1), st("attack", 1), st("mp_regen", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("status_gained", { status: "haste", whose: "ally", repeat: false }), { op: "share", to: "holder" })] })],
    serves: "conditional, Cuts 2 ●●, Bonfire 2 ●●, Storm 2 ●● ◆ Cuts (speed), Bonfire (speed), Storm (speed)",
  });
}
{
  // Half as often is its shape (Attack speed −100 counts no step). Each landing pushes the foe's own basic attack back by its whole cooldown.
  const name = "Still hand";
  const effect = "Basic attacks come half as often, and each that lands pushes the foe's next basic attack back by a full wait.";
  weapon("fist", "rare", name, {
    effect, stats: [{ stat: "attack_speed", flat: -100 }, sp("evasion", "medium"), sp("cooldown", "medium"), st("mp_regen", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, { op: "cooldown", which: "basic", set: { lessPct: -100 }, to: "other" })] })],
    serves: "exotic ◆ foes do less",
  });
}
{
  // The leap is a bonus hit on another foe (tagged wide); every wide hit its basic attacks land gives the MP.
  const name = "Forked knuckles";
  const effect = "Basic attacks also hit a second random foe for half, effects included. Each hit past the target restores 5% of max MP.";
  weapon("fist", "rare", name, {
    effect, stats: [st("max_mp", 1), sp("attack_speed", "medium"), critStep(1)],
    statuses: [own_(name, effect, {
      strike: { to: { side: "foes", pick: "random", exclude: "targets" }, share: 50, kind: "bonus", carry: true },
      reactions: [react(on("hit_lands", { tags: ["wide"] }), { op: "mp", amount: share(0.05, "max_mp"), to: "holder" })],
    })],
    serves: "Storm 2 ●●●, Barrage 2 ●● ⚙ red rain (half), resonance (half) ◆ Storm (spread), Barrage (MP)",
  });
}
{
  // Crit damage on the classes that wear it, which crit little: conditional by its stats, on a party that makes crits.
  const name = "Flurry wraps";
  const effect = "Extra strikes roll Double strike again, up to two more, each 20% weaker.";
  weapon("fist", "legendary", name, {
    effect, stats: [sp("crit_damage", "medium"), sp("double_strike", "medium"), st("attack", 1)],
    statuses: [own_(name, effect, { strike: { scale: "double_strike", to: "target", chain: { times: 2, share: 80 } } })],
    serves: "conditional, Cuts 3 ●●● ◆ Cuts (extra strikes)",
  });
}
{
  // The basic attack waits on a cue that a foe's action gives for a tick, and aims at the foe that acted (ahead of a Mark).
  const name = "Answering thunder", cue = `${id(name)}_cue`, acted = `${id(name)}_acted`;
  const effect = "Basic attacks come only when a foe acts: once ready, each waits for one, then strikes it at once.";
  weapon("fist", "legendary", name, {
    effect, stats: [st("attack", 2), sp("cast_speed", "medium")],
    statuses: [
      own_(name, effect, {
        mods: [{ of: { basic: true }, wait: { side: "self", where: { has: cue } } }],
        aim: { rule: { side: "foes", where: { has: acted } }, first: true },
        reactions: [
          react(on("action_resolve", { whose: "foe" }), give(cue, "holder"), give(acted, "owner", undefined, { rider: false })),
          react(EV.swing, lift(cue, "holder", "marker"), lift(acted, TO.everyFoe, "marker")),
        ],
      }),
      marker(cue, "Thunder's cue", "A foe just acted: the next basic attack answers it.", { duration: 1 }),
      marker(acted, "Called the thunder", "Just acted: Answering thunder strikes it.", { duration: 1 }),
    ],
    serves: "Storm 3 ●●●, Toll 3 ●● ◆ Storm (the foes' clock), Toll (the answer)",
  });
}

// ─── Wand (Cleric, Bard, Hexer, Pyromancer): fast, one hand; light, base-heavy, rich ──

weapon("wand", "common", "Leechwood wand", { stats: [sp("cooldown", "medium"), sp("lifesteal", "medium")], serves: "Pact, Barrage" });
weapon("wand", "common", "Lifewood wand", { stats: [st("max_hp", 2)], serves: "Pact" });

{
  const name = "Spark wand", effect = "Basic attacks add Burn.";
  weapon("wand", "uncommon", name, {
    effect, stats: [sp("cast_speed", "medium"), critStep(1), sp("evasion", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, give("burn", "other", own("few", "attack")))] })],
    serves: "Bonfire 1 ●● ⚙ lead's colour (half) ◆ Bonfire (Burn)",
  });
}
{
  const name = "Hushing wand", effect = "Basic attacks on a foe winding up deal triple.";
  weapon("wand", "uncommon", name, {
    effect, stats: [st("aggro", -1), st("max_mp", 1), sp("cooldown", "medium")],
    statuses: [own_(name, effect, { boosts: [{ tag: "basic", pct: against(200, { casting: true }) }] })],
    serves: "Hunt 1 ●● ◆ Hunt (the back row), stops a cast",
  });
}
{
  const name = "Tithe wand", effect = "Basic attacks give the ally with the lowest MP% 10% of Attack as MP.";
  weapon("wand", "uncommon", name, {
    effect, stats: [st("mp_regen", 1), st("defense", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, { op: "mp", amount: share(0.1, "attack"), to: TO.leastMpAlly })] })],
    serves: "Barrage 1 ●● ◆ Barrage (MP)",
  });
}
{
  // An ally's damaging ability, as it starts, leaves the wearer a note; the first of its hits to land clears every echo and
  // takes the note, so the echo is the last ability cast, not one still winding up. Each of its hits leaves a fifth of its raw
  // size (before Defense) on the foe it hit, as the echo's stacks; each basic attack strikes every foe holding an echo for its
  // stacks, as a hit of its own (a bonus hit, so it never feeds the echo).
  const name = "Echoing wand", echo = `${id(name)}_echo`, fresh = `${id(name)}_fresh`;
  const effect = "Basic attacks also strike each foe the party's last damaging ability hit, for 20% of that hit.";
  const abilityHit = on("hit_lands", { whose: "team", kind: "ability" });
  weapon("wand", "rare", name, {
    effect, stats: [sp("cooldown", "medium"), st("max_mp", 1), sp("thorns", "medium"), st("aggro", 1)],
    statuses: [
      own_(name, effect, {
        reactions: [
          react(on("action_start", { whose: "team", kind: "ability", does: ["damage"] }), give(fresh, "holder")),
          reactIf(abilityHit, { side: "self", where: { has: fresh } }, lift(echo, TO.everyFoe, "marker"), lift(fresh, "holder", "marker")),
          react(abilityHit, give(echo, "other", { scale: [{ ratio: 0.2, event: "raw" }] }, { rider: false })),
          react(EV.swing, { op: "strike", amount: stacksOf(echo, 1, "target"), tag: "echo", to: { side: "foes", pick: "all", where: { has: echo } } }),
        ],
      }),
      { id: echo, name: "Echo", text: "What the Echoing wand's basic attacks strike it for, until the party's next damaging ability lands.", label: "marker", show: "sheet", stacking: "intensity" } as StatusT,
      marker(fresh, "Echo to come", "An ally's damaging ability is on its way: its first hit replaces the echo."),
    ],
    serves: "exotic",
  });
}
{
  const name = "Mimic wand";
  const effect = "Basic attacks copy what the basic attacks of the other ally with the most Attack add, from its own stats.";
  weapon("wand", "rare", name, {
    effect, stats: [sp("evasion", "medium"), sp("double_strike", "medium"), st("attack", 1), critStep(1)],
    statuses: [own_(name, effect, { borrow: { from: TO.otherTopAttack } })],
    serves: "conditional, Bonfire 2 ●●, Snap 2 ●●, Storm 2 ●●, Cuts 2 ● ⚙ lead's colour (key) ◆ the lead's colour",
  });
}
{
  const name = "Wildmagic wand", effect = "Basic attacks add a random affliction.";
  weapon("wand", "legendary", name, {
    effect, stats: [sp("cast_speed", "high"), st("max_mp", 2), critStep(1), st("defense", -1)],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, { op: "one", of: AFFLICTIONS.map((status) => ({ status, stacks: own("few", "attack") })), to: "other" })] })],
    serves: "Bonfire ●, Snap ●, Storm ●, Cuts ● ⚙ every colour (key) ◆ every colour (the Hexer)",
  });
}
{
  const name = "Baton", effect = "Basic attacks take 20% off the wait left on its first-slotted ability.";
  weapon("wand", "legendary", name, {
    effect, stats: [sp("cooldown", "medium"), sp("cast_speed", "medium"), st("aggro", 1), st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, { op: "cooldown", which: "first", set: { times: 80 }, to: "holder" })] })],
    serves: "Barrage 3 ●●● ⚙ spell on the swing (key) ◆ Barrage (the spell on the swing)",
  });
}

// ─── Sword (Knight, Hoplite, Paladin, Valkyrie, Hexer): medium, one hand; full, even, standard ──

weapon("sword", "common", "Arming sword", { stats: [st("attack", 1)], serves: "Hunt, Storm" });
weapon("sword", "common", "Ceremonial sword", { stats: [st("max_mp", 2), down(sp("attack_speed", "medium"))], serves: "Barrage" });

{
  // An offhand held or not is fixed for the fight, so the state reads it once, as the piece's status lands.
  const name = "Duellist's sword", eva = PIECE_SPECIAL.evasion!.medium;
  const effect = `With no offhand: +${eva}% Evasion, and basic attacks deal +25%.`;
  weapon("sword", "uncommon", name, {
    effect, stats: [sp("accuracy", "medium"), critStep(1)],
    statuses: [own_(name, effect, {
      stats: [{ stat: "evasion", flat: whileIt(eva, { offhand: false }) }],
      boosts: [{ tag: "basic", pct: whileIt(25, { offhand: false }) }],
    })],
    serves: "conditional, Toll 1 ●●, Cuts 1 ● ◆ Toll (the dancer), Cuts (the dodge)",
  });
}
{
  // The marker on each foe it has hit; the boost reads its absence, and the marker lands after the hit.
  const name = "Drawn steel", mark = `${id(name)}_mark`, effect = "The first hit on each foe deals double.";
  weapon("sword", "uncommon", name, {
    effect, stats: [sp("attack_speed", "medium"), st("attack", 1)],
    statuses: [
      own_(name, effect, { boosts: hits(against(100, { lacks: mark })), reactions: [reactIf(EV.hit, { unit: "other", where: { lacks: mark } }, give(mark, "other", undefined, { rider: false }))] }),
      marker(mark, "Drawn on", "Drawn steel has hit it.", { perSource: {} }),
    ],
    serves: "Hunt 1 ●● ◆ Hunt (first strike)",
  });
}
{
  const name = "Mercy's edge", effect = "Basic attacks heal the ally with the lowest HP% for 33% of the damage.";
  weapon("sword", "uncommon", name, {
    effect, stats: [st("mp_regen", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, { op: "heal", amount: ofAmount(1 / 3), to: TO.lowestAlly })] })],
    serves: "Pact 1 ●● ⚙ brink (half) ◆ Pact (life passed on)",
  });
}
{
  const name = "Gravemark";
  const effect = "Hits on a Marked foe deal +50%. When a Marked foe falls, Marks the foe with the least HP.";
  weapon("sword", "rare", name, {
    effect, stats: [sp("crit_damage", "medium"), sp("siphon", "medium"), st("attack", 1)],
    statuses: [own_(name, effect, {
      boosts: hits(against(50, { has: "marked" })),
      reactions: [reactIf(on("status_ended", { status: "marked", cause: ["ko"], whose: "foe" }), NO_MARK, give("marked", TO.lowestHpFoe))],
    })],
    serves: "conditional, Hunt 2 ●●● ◆ Hunt (Mark)",
  });
}
{
  // Thorns on a wearer nobody strikes pays nothing: conditional by its stats, on a party that makes it the one struck.
  const name = "Provoking blade", effect = "A foe hit by its basic attack takes its own next basic attack at once.";
  weapon("sword", "rare", name, {
    effect, stats: [sp("thorns", "medium"), st("defense", 1), st("max_mp", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, swingNow("other"))] })],
    serves: "conditional, Storm 2 ●●●, Toll 2 ●●● ⚙ goad (key) ◆ Storm (the goad), Toll (the goad)",
  });
}
{
  const name = "Oathkeeper", on_ = `${id(name)}_on`, effect = "While Taunting: basic attacks also hit every other foe, effects included.";
  weapon("sword", "rare", name, {
    effect, stats: [st("mp_regen", 1), sp("cooldown", "medium"), st("defense", 1)],
    statuses: [
      own_(name, effect, { reactions: whileHolding(on_, "taunt") }),
      switched(on_, "OATH", "Basic attacks also hit every other foe.", { strike: { to: { side: "foes", pick: "all", exclude: "targets" }, kind: "bonus", carry: true } }),
    ],
    serves: "conditional, Toll 2 ●●● ⚙ red rain (half), reaping (half) ◆ Toll (its pack game)",
  });
}
{
  // The price is the swing's own (an HP price of the basic attack); the swing reads what it paid.
  const name = "Bloodletter";
  const effect = "Basic attacks pay 5% of max HP and deal 4× what they paid as extra damage.";
  const hit = weaponHit("sword") as Exclude<NumT, number>;
  weapon("sword", "rare", name, {
    effect, stats: [st("max_hp", 1), sp("lifesteal", "medium"), sp("attack_speed", "medium")],
    weapon: { kind: "sword", amount: { ...hit, scale: [...hit.scale, { ratio: FLAT_STACKS.several, cost: "hp" }] } },
    statuses: [own_(name, effect, { mods: [{ of: { basic: true }, pay: { scale: [{ ratio: 0.05, stat: "max_hp", of: "self" }] } }] })],
    serves: "Pact 2 ●●● ⚙ brink (key) ◆ Pact (price)",
  });
}
{
  // At the fight's true start only (a restart doesn't give it again): the crown reads the wearer's Attack as it lands, then the
  // wearer gives up two thirds of the Attack it had, so the crowned ally gains the whole of it and the wearer keeps a third.
  const name = "Kingmaker", crown = `${id(name)}_crown`, kept = `${id(name)}_kept`;
  const KING: TargetRuleT = { side: "others", pick: "lowest", by: { stat: "attack" } };
  const effect = "At fight start: the other ally with the least Attack gains the wearer's Attack, and the wearer keeps only a third.";
  weapon("sword", "legendary", name, {
    effect, stats: [st("attack", 1), st("max_mp", 1), sp("cast_speed", "medium")],
    statuses: [
      own_(name, effect, { reactions: [reactIf(on("fight_start", { repeat: false }), { side: "others", where: {} }, give(crown, KING), give(kept, "holder"))] }),
      { id: crown, name: "CROWNED", text: "Holds the Kingmaker's wearer's Attack, for the fight.", label: "buff", show: "icon", stacking: "refresh", unremovable: true, stats: [{ stat: "attack", flat: share(1, "attack", "source") }] } as StatusT,
      { id: kept, name: "KINGMAKER", text: "Keeps a third of its Attack, for the fight.", label: "marker", show: "sheet", stacking: "refresh", unremovable: true, stats: [{ stat: "attack", flat: share(-2 / 3, "attack", "holder") }] } as StatusT,
    ],
    serves: "exotic",
  });
}

// ─── Spear (Knight, Hoplite, Valkyrie, Monk, Frostweaver): medium, one hand; full, even, standard ──

weapon("spear", "common", "Pennon spear", { stats: [st("aggro", 1)], serves: "Toll" });
weapon("spear", "common", "Bident", { stats: [sp("double_strike", "medium"), st("max_mp", 1), down(sp("attack_speed", "medium"))], serves: "Cuts, Barrage" });

{
  const name = "Jolt spear", effect = "Every hit adds Shock, abilities included.";
  weapon("spear", "uncommon", name, {
    effect, stats: [sp("attack_speed", "medium"), sp("cast_speed", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.hit, give("shock", "other", own("few", "attack")))] })],
    serves: "Storm 1 ●● ⚙ lead's colour (half) ◆ Storm (Shock)",
  });
}
{
  // The foe that last hit the ally, marked for the called swing to aim at (ahead of a Mark); the swing lifts the mark.
  const name = "Avenger's spear", foe = `${id(name)}_foe`;
  const effect = "When another ally drops below half HP: next basic attack comes at once, at the foe that last hit it.";
  weapon("spear", "uncommon", name, {
    effect, stats: [sp("crit_damage", "medium"), st("max_hp", 1)],
    statuses: [
      own_(name, effect, {
        aim: { rule: { side: "foes", where: { has: foe } }, first: true },
        reactions: [react(on("hp_low", { line: 50, whose: "ally" }), give(foe, "assailant", undefined, { rider: false }), swingNow()), react(EV.swing, lift(foe, TO.everyFoe, "marker"))],
      }),
      marker(foe, "Avenged", "Hurt an ally: the Avenger's spear's next basic attack comes for it."),
    ],
    serves: "Toll 1 ●●, Pact 1 ● ◆ Toll (the free seat), Pact (the net)",
  });
}
{
  const name = "Long spear", effect = "Basic attacks ignore Taunt.";
  weapon("spear", "uncommon", name, {
    effect, stats: [sp("accuracy", "medium"), st("defense", 1)],
    statuses: [own_(name, effect, { seek: "basic" })],
    serves: "Hunt 1 ●● ◆ Hunt (reach)",
  });
}
{
  // Crit damage on the classes that wear it, which crit little: conditional by its stats, on a party that makes crits.
  const name = "Hunting spear";
  const effect = "Hits on a foe below half HP land twice.";
  weapon("spear", "rare", name, {
    effect, stats: [sp("crit_damage", "medium"), sp("evasion", "medium"), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("hit_lands", { notTags: ["bare"], wasBelow: 50 }), { op: "strike", of: "dealt", to: "other" })] })],
    serves: "conditional, Hunt 2 ●●● ◆ Hunt (executes)",
  });
}
{
  const name = "Parrying spear", effect = "On a dodge: the other ally with the most Attack strikes the attacker with its weapon.";
  weapon("spear", "rare", name, {
    effect, stats: [sp("evasion", "medium"), st("defense", 1), sp("cooldown", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.dodge, { op: "strike", carry: true, by: TO.otherTopAttack, to: "other" })] })],
    serves: "Toll 2 ●●●, Cuts 2 ●● ⚙ riposte (key) ◆ Toll (the riposte), Cuts (the riposte)",
  });
}
{
  // Every ally holding either shield counts, the wearer included.
  const name = "Phalanx pike", effect = "Hits deal +10% for each ally holding a kite shield or round shield.";
  weapon("spear", "rare", name, {
    effect, stats: [sp("accuracy", "medium"), st("mp_regen", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { boosts: hits({ scale: [{ ratio: 10, count: { side: "allies", where: { offhand: ["kite_shield", "round_shield"] } } }] }) })],
    serves: "conditional, Landslide 2 ●●, Toll 2 ●● ⚙ shield party (key) ◆ Landslide (Defense), Toll (the wall)",
  });
}
{
  // A per-source marker on each foe that hits the wearer; the swing's strike finds them, and the swing's end lifts them.
  const name = "Sarissa", mark = `${id(name)}_mark`;
  const effect = "Basic attacks also hit every foe that has hit it since its last basic attack, at full damage.";
  weapon("spear", "legendary", name, {
    effect, stats: [sp("cooldown", "medium"), sp("crit_damage", "medium"), st("max_hp", 1)],
    statuses: [
      own_(name, effect, {
        strike: { to: { side: "foes", pick: "all", where: { has: mark }, exclude: "targets" }, kind: "bonus" },
        reactions: [react(EV.struck, give(mark, "other")), react(EV.swing, lift(mark, TO.everyFoe, "marker"))],
      }),
      marker(mark, "Answered", "Hit the Sarissa's wearer since its last swing.", { perSource: {} }),
    ],
    serves: "conditional, Toll 3 ●●● ◆ Toll (retaliation)",
  });
}

// ─── Axe (Ranger, Assassin, Vampire, Geomancer): medium, one hand; heavy, Attack-heavy, lean ──

weapon("axe", "common", "Stout hatchet", { stats: [st("max_hp", 1)], serves: "Pact, Landslide" });
weapon("axe", "common", "Cleaver", { stats: [critStep(2), down(sp("cooldown", "medium"))], serves: "Hunt, Cuts" });

{
  const name = "Woodsman's axe", effect = "Basic attacks give Might to the ally with the slowest basic attack.";
  weapon("axe", "uncommon", name, {
    effect, stats: [st("defense", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.basic, give("might", TO.slowestAlly, own("few", "attack")))] })],
    serves: "Landslide 1 ●● ◆ Landslide (loading)",
  });
}
{
  // Its own Lifesteal again: a heal of the damage at the wearer's Lifesteal, on a foe that was below half as the hit landed.
  const name = "Hungry axe", effect = "Lifesteal doubles on hits against a foe below half HP.";
  weapon("axe", "uncommon", name, {
    effect, stats: [sp("attack_speed", "medium")],
    statuses: [own_(name, effect, { reactions: [react(on("hit_lands", { wasBelow: 50 }), { op: "heal", amount: { scale: [{ ratio: 0.01, amount: true, times: { stat: "lifesteal", of: "holder" } }] }, to: "holder" })] })],
    serves: "Pact 1 ●● ◆ Pact (Lifesteal)",
  });
}
{
  const name = "Ragged axe", effect = "Every hit adds Bleed.";
  weapon("axe", "uncommon", name, {
    effect, stats: [critStep(1)],
    statuses: [own_(name, effect, { reactions: [react(EV.hit, give("bleed", "other", own("few", "attack")))] })],
    serves: "Cuts 1 ●● ⚙ lead's colour (half) ◆ Cuts (Bleed)",
  });
}
{
  const name = "Executioner's axe", effect = "Hits on a foe below 25% HP deal double.";
  weapon("axe", "rare", name, {
    effect, stats: [sp("crit_damage", "medium"), sp("accuracy", "medium")],
    statuses: [own_(name, effect, { boosts: hits(against(100, { hpBelow: 25 })) })],
    serves: "Hunt 2 ●●● ◆ Hunt (executes)",
  });
}
{
  // Each landing moves a step of Defense, for the fight: a debuff on the foe and a buff on the wearer, until the wearer holds
  // five, and only from a foe with Defense left (its Defense above a sliver of its max HP: above none).
  const name = "Miner's pick", mined = `${id(name)}_mined`, ore = `${id(name)}_ore`, most = 5;
  const effect = `Basic attacks that land steal ${STEP / P} Defense from the foe for the fight, up to ${most}.`;
  const hasDefense = { unit: "other" as const, where: { above: { stat: "defense", over: "max_hp", ratio: 1e-6 } } };
  weapon("axe", "rare", name, {
    effect, stats: [st("max_hp", 1), st("mp_regen", 1)],
    statuses: [
      own_(name, effect, { reactions: [reactIf(EV.basic, [{ side: "self", where: { belowCap: ore } }, hasDefense], give(mined, "other", 1), give(ore, "holder", 1))] }),
      { id: mined, name: "MINED", text: `${STEP / P} Defense less for each stack, for the fight.`, label: "debuff", show: "icon", stacking: "intensity", cap: most, stats: [{ stat: "defense", flat: -STEP }] } as StatusT,
      { id: ore, name: "ORE", text: `${STEP / P} Defense more for each stack, for the fight.`, label: "buff", show: "icon", stacking: "intensity", cap: most, unremovable: true, stats: [{ stat: "defense", flat: STEP }] } as StatusT,
    ],
    serves: "Landslide 2 ●●, Toll 2 ● ◆ Landslide (Defense as damage), Toll (the wall)",
  });
}
{
  // The left-over is bare: a kill by it carries nothing on. Two pieces that carry one blow's left-over share it.
  const name = "Overkill axe";
  const effect = "On a kill: the damage left over hits the foe with the least HP.";
  weapon("axe", "rare", name, {
    effect, stats: [st("attack", 1), st("aggro", 1)],
    statuses: [own_(name, effect, { reactions: [{ on: on("ko", { whose: "foe", other: "holder", tags: ["physical"], notTags: ["bare"] }), split: "over", do: [{ op: "strike", of: "over", to: TO.lowestHpFoe }] }] })],
    serves: "Hunt 2 ●●●, Landslide 2 ●● ⚙ avalanche (key) ◆ the avalanche",
  });
}
{
  const name = "The Red Feast", on_ = `${id(name)}_on`;
  // Half again, not double, on the hits: a Pact party holds its wearer below half all fight (the brink).
  const effect = "Below half HP: hits deal +50% and Lifesteal doubles. After a won fight, heals up to half HP.";
  weapon("axe", "legendary", name, {
    effect, stats: [st("max_hp", 1), sp("siphon", "medium")],
    statuses: [
      own_(name, effect, {
        reactions: [
          ...whileHp(on_, 50, true),
          reactIf(on("fight_won"), { side: "self", where: { hpBelow: 50 } }, { op: "heal", amount: { scale: [{ ratio: 0.5, stat: "max_hp", of: "holder" }, { ratio: -1, hp: "current", of: "holder" }] }, to: "holder" }),
        ],
      }),
      switched(on_, "FEAST", "Hits deal +50% and Lifesteal is doubled.", {
        boosts: hits(50), stats: [{ stat: "lifesteal", flat: share(1, "lifesteal"), live: true }],
      }),
    ],
    serves: "Pact 3 ●●● ⚙ brink (half) ◆ Pact (below half), Pact (the last drink)",
  });
}
{
  // Half as often is its shape (Attack speed −100 counts no step); the boost doubles its basic attacks.
  const name = "Headsman's axe", effect = "Basic attacks come half as often and deal double. On a kill: next basic attack comes at once.";
  weapon("axe", "legendary", name, {
    effect, stats: [{ stat: "attack_speed", flat: -100 }, sp("crit_damage", "medium"), st("defense", 1)],
    statuses: [own_(name, effect, { boosts: [{ tag: "basic", pct: 100 }], reactions: [react(EV.kill, swingNow())] })],
    serves: "Hunt 3 ●●●, Landslide 3 ●● ◆ Hunt (the heavy swing), Landslide (the heavy swing)",
  });
}

export const gear = S.gear;
export const statuses = S.statuses;
export const served = S.served;
