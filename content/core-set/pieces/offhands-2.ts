/**
 * Seven offhand kinds' pieces, 64 in all: tome (12), orb (9), idol (10), vial (8), trophy (9), bell (7) and cloak (9). Each
 * carries the standard budget of steps at its rarity, exactly (kit.ts piece), a step down counted against the rest; its stats
 * are its own, at most half of them on its kind's leaning above common. Statuses are at their own length, and nothing here is
 * balanced.
 *
 * `gear` joins the pack's gear and the rogue's stock; `statuses` the pack's statuses; `served` is designer data, never in the pack.
 */
import type { StatusT } from "../../../src/schema.js";
import { FLAT_STACKS, HIT, PIECE_SPECIAL, SPECIAL, SPECIAL_KEY, STATUS, crit, type SpecialStat } from "../scale.js";
import { AFFLICTIONS, COUNTER, CRESCENDO } from "./shared.js";
import { EV, SO_OFTEN, TO, atFirstStart, atStart, beatHalfway, count, countAt, critStep, give, lift, marker, ofAmount, on, onceBelow, oneUse, own, piece, pieceStatus, react, reactIf, share, shelf, sp, st, stacksOf, state, swingNow, used, whileIt, type Change, type Rarity } from "./kit.js";

const S = shelf();

/** One offhand of a kind: its card's effect, its stats, and the statuses behind it (the first is the piece's own, under its id). */
function offhand(kind: string, rarity: Rarity, name: string, o: { effect?: string; stats: Change[]; statuses?: StatusT[]; serves: string }) {
  const statuses = o.statuses ?? [];
  S.add(piece({ name, kind, slot: "offhand", rarity, effect: o.effect, stats: o.stats, statuses: statuses.filter((s) => s.id === id(name)).map((s) => s.id) }), statuses, o.serves);
}
const id = (name: string) => name.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
/** A share as a card prints it: 0.17 is 17. */
const pct = (r: number) => Math.round(r * 100);
/** The piece's own status: on the sheet, under the piece's id, saying what the card says. */
const own_ = (name: string, text: string, body: Partial<StatusT>) => pieceStatus(id(name), name, text, body);
/** A status a piece lays on others: on the sheet, unremovable, refreshed. */
const given = (sid: string, name: string, text: string, body: Partial<StatusT>): StatusT =>
  ({ id: sid, name, text, label: "buff", show: "sheet", stacking: "refresh", unremovable: true, ...body }) as StatusT;
/** A special stat a step down: its piece word given up, for one step more elsewhere. */
const down = (s: SpecialStat): Change => ({ stat: SPECIAL_KEY[s], flat: -(PIECE_SPECIAL[s] ?? SPECIAL[s]).medium });
/** Crit chance a step down. */
const critDown: Change = { stat: "crit_chance", flat: -crit(1) };
/** Its holder's own casts: an ordinary one or a paid second, not a free repeat. */
const OWN_CAST = on("action_resolve", { kind: "ability", repeat: false, counted: true });

// ─── Tome ──

offhand("tome", "common", "Ironbound codex", { stats: [st("max_hp", 2), st("attack", -1)], serves: "max HP: Blood Pact." });
offhand("tome", "common", "Antiphonary", { stats: [sp("crit_damage", "medium"), sp("double_strike", "medium"), down("attack_speed")], serves: "crits and extra strikes: Thousand Cuts and the Hunt." });

{
  const name = "Snowbound folio", effect = "At fight start: Chill on every foe.";
  offhand("tome", "uncommon", name, {
    effect, stats: [st("defense", 1), sp("cast_speed", "medium")],
    statuses: [own_(name, effect, { reactions: [atStart(give("chill", TO.everyFoe, own("few", "attack")))] })],
    serves: "Snap 1 ●● ◆ Snap (Chill)",
  });
}
{
  // A change's rule that finds nobody leaves the ability its own.
  const name = "Marginalia";
  const effect = "Single-target abilities go to a foe winding up, when there is one.";
  offhand("tome", "uncommon", name, {
    effect, stats: [sp("accuracy", "medium"), sp("cooldown", "medium")],
    statuses: [own_(name, effect, { mods: [{ of: { single: true }, target: { side: "foes", where: { casting: true }, pick: "highest", by: { stats: ["attack"] } } }] })],
    serves: "stops a cast, Snap ●, Toll ●",
  });
}
{
  // Each foe an ability's hits land on is noted; as the cast resolves, the one of them with the most Attack is Weakened, and
  // the notes are cleared. The hits' answers come before the cast's (they were made first, on the same moment).
  const name = "Curse-book", hit = `${id(name)}_hit`;
  const effect = "Abilities Weaken the foe with the most Attack they hit.";
  offhand("tome", "uncommon", name, {
    effect, stats: [sp("siphon", "medium"), st("max_mp", 1)],
    statuses: [
      own_(name, effect, {
        reactions: [
          react(on("hit_lands", { kind: "ability" }), give(hit, "other", undefined, { rider: false })),
          react(on("action_resolve", { kind: "ability" }), give("weaken", { side: "foes", where: { has: hit }, pick: "highest", by: { stats: ["attack"] } }), lift(hit, TO.everyFoe, "marker")),
        ],
      }),
      marker(hit, "Curse-book (hit)", "Hit by the Curse-book's holder's ability this moment."),
    ],
    serves: "Toll 1 ●●, foes do less ◆ Toll (Weaken)",
  });
}
{
  // Ability changes add up: the first-slotted one takes both (+60 and −20), the others the cut alone.
  const name = "Primer", effect = "Its first-slotted ability deals +40%, its others 20% less.";
  offhand("tome", "rare", name, {
    effect, stats: [st("attack", 1), critStep(1), st("defense", 1)],
    statuses: [own_(name, effect, { mods: [{ of: { first: true }, damage: 60 }, { damage: -20 }] })],
    serves: "Barrage 2 ●●, conditional ◆ Barrage (one ability)",
  });
}
{
  // The third of its own casts is cast again, free (a free repeat isn't counted, so it's never cast again).
  const name = "Twice-told tome", n = `${id(name)}_count`;
  const effect = "Every second ability it casts is cast again at once, free.";
  offhand("tome", "rare", name, {
    effect, stats: [sp("double_strike", "medium"), st("mp_regen", 1), st("max_hp", 1)],
    statuses: [
      own_(name, effect, { reactions: [reactIf(OWN_CAST, { side: "self", where: countAt(n, 1) }, { op: "recast" }), react(OWN_CAST, give(n, "holder", 1))] }),
      count(n, "TWICE-TOLD", "Every second ability is cast twice.", 2),
    ],
    serves: "Barrage 2 ●●● ⚙ crescendo (half) ◆ Barrage (the cast twice)",
  });
}
{
  // Its abilities read the highest Attack on its side, its own included; its basic attacks keep its own.
  const name = "Borrowed hand", effect = "Abilities use the Attack of the ally with the most Attack.";
  offhand("tome", "rare", name, {
    effect, stats: [st("attack", -1), st("max_hp", 2), st("aggro", -1), sp("cast_speed", "medium")],
    statuses: [own_(name, effect, { rescale: { from: "attack", best: true } })],
    serves: "exotic ⚙ borrowed hand (key)",
  });
}
{
  const name = "Accompanist's score", free = `${id(name)}_free`;
  const effect = "When the other ally with the most Attack spends MP on an ability: next ability free.";
  offhand("tome", "rare", name, {
    effect, stats: [st("max_mp", 1), sp("attack_speed", "medium"), sp("evasion", "medium")],
    statuses: [
      own_(name, effect, { reactions: [reactIf(on("action_resolve", { kind: "ability", whose: "ally", amountAtLeast: 1 }), { unit: "owner", where: { top: { stats: ["attack"], others: true } } }, give(free))] }),
      oneUse(free, "ACCOMPANIED", "Next ability free.", on("action_resolve", { kind: "ability" }), { mods: [{ mp: -100 }] }),
    ],
    serves: "Barrage 2 ●●, conditional ⚙ crescendo (half) ◆ Barrage (costs that change)",
  });
}
{
  // Untyped damage of all its HP and Shield: not a hit. Every fall it causes checks again. Its Crit damage pays only on a
  // unit that crits.
  const name = "Last page", effect = "When a foe falls, foes below 10% HP fall too.";
  offhand("tome", "legendary", name, {
    effect, stats: [sp("crit_damage", "high"), st("attack", 1)],
    statuses: [own_(name, effect, {
      reactions: [react(EV.fall, { op: "damage", type: "none", amount: { scale: [{ ratio: 1, hp: "current", of: "target" }, { ratio: 1, stacks: "shield", of: "target" }] }, to: { side: "foes", where: { hpBelow: 10 }, pick: "all" } })],
    })],
    serves: "Hunt 3 ●●, Storm ●, conditional ⚙ reaping (half) ◆ Hunt (executes)",
  });
}
{
  // Only a cast that spent MP makes a free one, so a free cast makes none; any ally's next ability spends every copy.
  const name = "Annotated grimoire", free = `${id(name)}_free`, effect = "Each ability it spends MP on makes the next one any ally casts free.";
  offhand("tome", "legendary", name, {
    effect, stats: [sp("cooldown", "medium"), critStep(1), st("aggro", -1)],
    statuses: [
      own_(name, effect, { reactions: [react(on("action_resolve", { kind: "ability", amountAtLeast: 1 }), give(free, TO.everyAlly))] }),
      marker(free, "Free cast", "Next ability free.", {
        mods: [{ mp: -100 }],
        reactions: [react(on("action_resolve", { kind: "ability" }), lift(free, TO.everyAlly, "marker"))],
      }),
    ],
    serves: "Barrage 3 ●●● ⚙ crescendo (half) ◆ Barrage (costs that change)",
  });
}
{
  const name = "Frozen tome", effect = "Each shatter halves the wait on every ally's first-slotted ability.";
  offhand("tome", "legendary", name, {
    effect, stats: [st("defense", 2), sp("cooldown", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.shatter, { op: "cooldown", which: "first", set: { times: 50 }, to: TO.everyAlly })] })],
    serves: "Snap 3 ●●, Landslide ●, Barrage ●, conditional ⚙ shatter bell (key) ◆ Snap (the opening a shatter makes)",
  });
}

// ─── Orb ──

offhand("orb", "common", "Glass orb", { stats: [st("attack", 2), st("max_hp", -1)], serves: "Attack: Bonfire, Cold Snap and the Storm read it." });
offhand("orb", "common", "Truesight orb", { stats: [sp("accuracy", "medium"), sp("attack_speed", "medium"), critDown], serves: "speed: Thousand Cuts." });

{
  const name = "Scrying orb", effect = "Single-target abilities deal +25%.";
  offhand("orb", "uncommon", name, {
    effect, stats: [sp("evasion", "medium"), st("max_mp", 1)],
    statuses: [own_(name, effect, { mods: [{ of: { single: true }, damage: 25 }] })],
    serves: "Barrage 1 ●, Hunt 1 ● ◆ Barrage (one ability), Hunt (focus)",
  });
}
{
  const name = "Mana pearl", effect = "On a crit: regains 5% of max MP.";
  offhand("orb", "uncommon", name, {
    effect, stats: [sp("crit_damage", "medium"), st("mp_regen", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.crit, { op: "mp", amount: share(0.05, "max_mp"), to: "holder" })] })],
    serves: "Barrage 1 ●●, Hunt ● ◆ Barrage (MP to the soloist), Hunt (crits)",
  });
}
{
  // The cut is a state, laid as a fight starts (and as anyone stands up) while another orb is held, lifted when the last other
  // orb-holder falls.
  const name = "Meltwater orb", on_ = `${id(name)}_on`;
  const effect = "While another ally holds an orb: abilities cost 25% less.";
  const pair = { side: "others" as const, where: { offhand: ["orb"] } };
  offhand("orb", "rare", name, {
    effect, stats: [st("max_hp", 1), sp("attack_speed", "medium"), sp("cast_speed", "medium")],
    statuses: [
      own_(name, effect, {
        reactions: [
          reactIf(on("fight_start"), pair, give(on_)),
          reactIf(on("revived", { whose: "team" }), pair, give(on_)),
          reactIf(EV.allyFall, { ...pair, atMost: 0 }, lift(on_, "holder", "marker")),
        ],
      }),
      // A marker, so no Dispel takes it, and removable, so the lift by name switches it off (a remove skips unremovable ones).
      marker(on_, "MELTWATER", "Abilities cost 25% less.", { mods: [{ mp: -25 }] }),
    ],
    serves: "Barrage 2 ●●, conditional ◆ Barrage (costs that change)",
  });
}
{
  // `damage: 0` changes nothing: it's there because the validator's mod.empty check doesn't yet count `spread` as a change.
  const name = "Diffusion orb", effect = "Abilities aimed at one foe hit every foe instead, splitting the damage evenly.";
  offhand("orb", "rare", name, {
    effect, stats: [sp("accuracy", "medium"), sp("siphon", "medium"), st("attack", 1)],
    statuses: [own_(name, effect, { mods: [{ of: { single: true }, spread: true }] })],
    serves: "exotic",
  });
}
{
  const name = "Orb of the deep", effect = "Damage that would reach its HP hits its MP instead.";
  offhand("orb", "rare", name, {
    effect, stats: [st("max_mp", 1), st("defense", 1), st("aggro", -1)],
    statuses: [own_(name, effect, { soak: "mp" })],
    serves: "Barrage 2 ●●●, Pact ● ⚙ mana as armour (key)",
  });
}
{
  const name = "Orb of the rising sun";
  const effect = `Each cast gives that ability a Crescendo (+${COUNTER.crescendo.pct}% damage, healing and stacks each, up to ${CRESCENDO.cap}).`;
  offhand("orb", "legendary", name, {
    effect, stats: [critStep(2), sp("cooldown", "medium")],
    statuses: [own_(name, effect, { mods: [{ damage: 20, heal: 20, stacks: { pct: 20 }, times: CRESCENDO }] })],
    serves: "Barrage 3 ●●●, Bonfire ● ⚙ crescendo (key) ◆ Barrage (one ability)",
  });
}
{
  const name = "The deep well", effect = "Abilities are free while it has Clarity.";
  offhand("orb", "legendary", name, {
    effect, stats: [sp("siphon", "high"), st("max_mp", 1)],
    statuses: [own_(name, effect, { mods: [{ mp: -100, if: { has: "clarity" } }] })],
    serves: "Barrage 3 ●●●, conditional ⚙ crescendo (half) ◆ Barrage (MP to the soloist)",
  });
}

// ─── Idol ──

offhand("idol", "common", "Night mask", { stats: [sp("siphon", "medium")], serves: "Barrage (the blood-well)." });
offhand("idol", "common", "Hawk-headed idol", { stats: [sp("accuracy", "medium"), critStep(1), down("cooldown")], serves: "crits: the Hunt." });

{
  const name = "Fanged idol", mark = `${id(name)}_mark`, effect = "First hit on each foe Rots it.";
  offhand("idol", "uncommon", name, {
    effect, stats: [sp("lifesteal", "medium"), sp("crit_damage", "medium")],
    statuses: [
      own_(name, effect, { reactions: [reactIf(EV.hit, { unit: "other", where: { lacks: mark } }, give("rot", "other"), give(mark, "other", undefined, { rider: false }))] }),
      marker(mark, "Fanged", "The Fanged idol has bitten it.", { perSource: {} }),
    ],
    serves: "general, Pact ●",
  });
}
{
  const name = "Leech idol", effect = "MP it gains past full goes to the ally with the lowest MP%.";
  offhand("idol", "uncommon", name, {
    effect, stats: [st("mp_regen", 1), sp("siphon", "medium")],
    statuses: [own_(name, effect, { reactions: [react(on("mp_over"), { op: "mp", amount: ofAmount(1), to: TO.leastMpAlly })] })],
    serves: "Barrage 1 ●● ◆ Barrage (MP to the soloist)",
  });
}
{
  // The casting foe is marked, and the swing made ready aims at a marked foe past any Taunt; the swing lifts both.
  const name = "Hushing idol", mark = `${id(name)}_mark`, aim = `${id(name)}_on`;
  const effect = "When a foe winds up: attacks it at once, ignoring Taunt.";
  offhand("idol", "rare", name, {
    effect, stats: [sp("accuracy", "medium"), st("attack", 1), st("defense", 1)],
    statuses: [
      own_(name, effect, {
        reactions: [
          reactIf(on("action_start", { whose: "foe", kind: "ability" }), { unit: "owner", where: { casting: true } }, give(mark, "owner"), give(aim), swingNow()),
          react(EV.swing, lift(mark, TO.everyFoe, "marker")),
        ],
      }),
      marker(mark, "Hushed", "The Hushing idol's holder swings at it next.", { perSource: {} }),
      oneUse(aim, "HUSH", "Next basic attack goes at the foe winding up, ignoring Taunt.", EV.swing, { aim: { rule: { side: "foes", where: { has: mark } }, first: true }, seek: "basic" }),
    ],
    serves: "stops a cast, Hunt ●●, Toll ● ◆ Hunt (reach)",
  });
}
{
  // One more of each affliction the foe holds as the hit lands.
  const name = "Festering idol", effect = "Hits add 1 more of each affliction the foe holds.";
  offhand("idol", "rare", name, {
    effect, stats: [sp("thorns", "medium"), sp("attack_speed", "medium"), sp("lifesteal", "medium")],
    statuses: [own_(name, effect, { reactions: AFFLICTIONS.map((s) => reactIf(EV.hit, { unit: "other", where: { has: s } }, give(s, "other", FLAT_STACKS.one))) })],
    serves: "Bonfire 2 ●●, Snap 2 ●●, Storm 2 ●●, Cuts 2 ●●, conditional ⚙ every colour (half)",
  });
}
{
  // A Weaken the holder applied (`other: holder` on the foe's status_gained).
  const name = "Idol of binding", effect = "Foes it Weakens are Slowed too. Hits on them deal double.";
  offhand("idol", "rare", name, {
    effect, stats: [st("defense", 1), st("aggro", 1), st("attack", 1)],
    statuses: [own_(name, effect, {
      reactions: [react(on("status_gained", { whose: "foe", status: "weaken", other: "holder" }), give("slow", "owner"))],
      boosts: [{ tag: "physical", pct: { scale: [{ ratio: 100, when: { has: ["weaken", "slow"] }, of: "target" }] } }],
    })],
    serves: "Toll 2 ●●, conditional, foes do less ◆ Toll (Weaken)",
  });
}
{
  // The newest buff a foe can lose, moved with its stacks and time left; the enemy-only Bulwark stays.
  const name = "Idol of the hungry dark";
  const effect = `Every ${SO_OFTEN} ticks (the first at ${SO_OFTEN / 2}): steals a buff from a random foe, never Bulwark.`;
  const b = beatHalfway(id(name), name, [{ op: "remove", label: "buff", count: 1, move: true, except: ["bulwark"], to: { side: "foes", where: { buffs: true }, pick: "random" } }]);
  offhand("idol", "legendary", name, {
    effect, stats: [sp("evasion", "high"), sp("siphon", "medium")],
    statuses: [own_(name, effect, { reactions: b.reactions }), ...b.statuses],
    serves: "exotic",
  });
}
{
  // Its basic attack is locked out for good; Defense doubled with everything else on it, Guard included.
  const name = "Idol of stillness", effect = "Never makes a basic attack. Defense doubled.";
  offhand("idol", "legendary", name, {
    effect, stats: [sp("cooldown", "high"), st("defense", 1)],
    statuses: [own_(name, effect, { lockout: { covers: "basic" }, stats: [{ stat: "defense", pct: 100 }] })],
    serves: "exotic",
  });
}
{
  const name = "Idol of the blood-well", effect = "When it spends HP: the ally with the lowest MP% gains as much MP.";
  offhand("idol", "legendary", name, {
    effect, stats: [st("max_hp", 1), sp("cast_speed", "medium"), st("mp_regen", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("hp_paid"), { op: "mp", amount: ofAmount(1), to: TO.leastMpAlly })] })],
    serves: "Barrage ●●●, Pact ●● ⚙ blood mage (half) ◆ Pact (HP as a price), Barrage (MP to the soloist)",
  });
}

// ─── Vial ──

offhand("vial", "common", "Stoneskin tonic", { stats: [st("defense", 2), st("attack", -1)], serves: "Defense: Landslide." });
offhand("vial", "common", "Bracing salts", { stats: [sp("accuracy", "medium"), st("defense", 1), down("cooldown")], serves: "the Toll's wall." });

{
  // A heal, not a Regen's pulse: Lifesteal's heals count.
  const name = "Crimson dregs", effect = "Each heal it receives takes 1 tick off the wait on each of its abilities.";
  offhand("vial", "uncommon", name, {
    effect, stats: [sp("lifesteal", "medium"), sp("cast_speed", "medium")],
    statuses: [own_(name, effect, { reactions: [react(on("healed", { notTags: ["pulse"] }), { op: "cooldown", which: "abilities", set: { less: 1 }, to: "holder" })] })],
    serves: "Pact 1 ●●, Barrage 1 ● ◆ Pact (Lifesteal), Barrage (cooldowns)",
  });
}
{
  const name = "Lancet phial", effect = "Crits heal the ally with the lowest HP% for 10% of the damage.";
  offhand("vial", "uncommon", name, {
    effect, stats: [critStep(1), st("mp_regen", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.crit, { op: "heal", amount: ofAmount(0.1), to: TO.lowestAlly })] })],
    serves: "Hunt 1 ●, Pact 1 ●● ◆ Hunt (crits), Pact (life passed)",
  });
}
{
  // The HP price is a share of the cost as it stands after the half: twice that is the full cost.
  const name = "Blood vial", effect = "Abilities cost half their MP, plus HP equal to their full cost.";
  offhand("vial", "rare", name, {
    effect, stats: [st("max_hp", 1), st("max_mp", 1), sp("cooldown", "medium")],
    statuses: [own_(name, effect, { mods: [{ mp: -50, hp: { pct: 200 } }] })],
    serves: "Pact 2 ●●●, Barrage ● ⚙ brink (key), blood mage (half) ◆ Pact (HP as a price)",
  });
}
{
  // What the wound closes under its holder's hit is put back: d/(1−d) of what the foe holds, the same whichever reads first.
  const name = "Venom vial";
  // Each hit's third closes, then a fifth of what's left goes back on: 2/3 × 6/5 = 4/5 stays, so the wound closes a fifth. Fresh
  // Bleed the hit itself lays is in what's left, so the share back stays well under a half (at a half the wound grows without end).
  const effect = `Its hits close a foe's Bleed by 20%, not the usual ${pct(STATUS.bleed.drop)}%.`;
  const back = 0.2;
  offhand("vial", "rare", name, {
    effect, stats: [sp("accuracy", "medium"), sp("attack_speed", "medium"), sp("crit_damage", "medium")],
    statuses: [own_(name, effect, { reactions: [reactIf(EV.hit, { unit: "other", where: { has: "bleed" } }, give("bleed", "other", stacksOf("bleed", back, "target"), { rider: false }))] })],
    serves: "Cuts 2 ●●●, Hunt ● ◆ Cuts (Bleed)",
  });
}
{
  // Stun and Hidden at their own lengths as every fight starts (a restart included); the wake is its own marker, as long as
  // the Hidden, so a Hidden from anywhere else doesn't set it off.
  const name = "Drowsy draught", wake = `${id(name)}_wake`;
  const effect = `At fight start: Stunned and Hidden. After ${STATUS.hidden.duration} ticks: every ability is ready, and Hasted.`;
  offhand("vial", "rare", name, {
    effect, stats: [down("attack_speed"), st("defense", 2), sp("cooldown", "medium"), st("max_hp", 1)],
    statuses: [
      own_(name, effect, {
        reactions: [
          atStart(give("stun"), give("hidden"), give(wake)),
          react(on("status_ended", { status: wake, cause: ["expired"] }), { op: "cooldown", which: "abilities", set: "ready", to: "holder" }, give("haste")),
        ],
      }),
      marker(wake, "Drowsy", "Wakes when this runs out.", { duration: STATUS.hidden.duration }),
    ],
    serves: "exotic",
  });
}
{
  // Half its own Lifesteal, healed and past full, given to every other ally as healing that goes no further. At the same amount,
  // one drinker kept a whole party full. Its Thorns and Aggro pay only on the party's anchor.
  const name = "Heartsblood";
  const effect = "Its Lifesteal also heals every other ally for half, even past full.";
  const pass = { op: "heal" as const, amount: ofAmount(0.5), final: true as const, to: TO.otherAllies };
  offhand("vial", "legendary", name, {
    effect, stats: [sp("lifesteal", "medium"), sp("thorns", "medium"), st("aggro", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("healed", { status: "lifesteal" }), pass), react(on("overhealed", { status: "lifesteal" }), pass)] })],
    serves: "Pact 3 ●●●, Cuts ●, conditional ◆ Pact (life passed)",
  });
}

// ─── Trophy ──

offhand("trophy", "common", "Wolf pelt", { stats: [sp("cooldown", "medium"), sp("double_strike", "medium"), st("defense", -1)], serves: "Thousand Cuts and Barrage." });
offhand("trophy", "common", "Geode", { stats: [st("mp_regen", 1), sp("thorns", "medium"), down("attack_speed")], serves: "the Toll and Barrage." });

{
  // The most Crit chance on its side, ties included.
  const name = "Hunter's skull", effect = "While it has the most Crit chance in the party: basic attacks deal +30%.";
  offhand("trophy", "uncommon", name, {
    effect, stats: [critStep(1), st("max_hp", 1)],
    statuses: [own_(name, effect, { boosts: [{ tag: "basic", pct: whileIt(30, { top: { stats: ["crit_chance"] } }) }] })],
    serves: "Hunt 1 ●●, Landslide ● ◆ Hunt (crits), Landslide (loading)",
  });
}
{
  const name = "Eagle feather", effect = "Crits Slow their target.";
  offhand("trophy", "uncommon", name, {
    effect, stats: [sp("evasion", "medium"), sp("accuracy", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.crit, give("slow", "other"))] })],
    serves: "foes do less, Hunt ●, Snap ● ◆ Snap (the slow)",
  });
}
{
  const name = "Vulture's skull", effect = "When another ally crits: gains Might.";
  offhand("trophy", "rare", name, {
    effect, stats: [sp("lifesteal", "medium"), st("max_hp", 1), sp("crit_damage", "medium")],
    statuses: [own_(name, effect, { reactions: [react(on("hit_lands", { whose: "ally", tags: ["crit"] }), give("might", "holder", own("few", "attack")))] })],
    serves: "Landslide 2 ●●, Hunt ●, conditional ◆ Landslide (loading)",
  });
}
{
  // Added before boosts, crit and Defense, read off the foe as it's hit.
  const name = "Ogre's tusk", effect = "Hits deal extra damage equal to 10% of the foe's current HP.";
  offhand("trophy", "rare", name, {
    effect, stats: [down("attack_speed"), st("max_hp", 2), st("attack", 1), st("aggro", 1)],
    statuses: [own_(name, effect, { adds: [{ on: "physical", amount: { scale: [{ ratio: 0.1, hp: "current", of: "target" }] } }] })],
    serves: "Landslide 2 ●●● ◆ Landslide (the boss game)",
  });
}
{
  const name = "Dragon's tooth";
  const effect = "Each crit lands again for 33% of its damage.";
  offhand("trophy", "rare", name, {
    effect, stats: [critStep(1), st("mp_regen", 1), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(on("hit_lands", { tags: ["crit"], notTags: ["bare"] }), { op: "strike", of: "dealt", share: 100 / 3, to: "other" })] })],
    serves: "Landslide ●●, Hunt ●●, Cuts ●● ◆ Landslide (loading), Hunt (crits), Cuts (the opener)",
  });
}
{
  // Brittle on what its basic attacks land on, while it isn't the top of its side in Crit damage (an ally has strictly more):
  // the next hit on that foe, anyone's, crits. A crack for the party's big crits to break.
  const name = "Woodpecker's crest", effect = "While an ally has more Crit damage: basic attacks make their target Brittle.";
  offhand("trophy", "rare", name, {
    effect, stats: [sp("accuracy", "medium"), sp("attack_speed", "medium"), sp("cooldown", "medium")],
    statuses: [own_(name, effect, { reactions: [reactIf(EV.basic, { side: "self", where: { top: { stats: ["crit_multiplier"] } }, atMost: 0 }, give("brittle", "other"))] })],
    serves: "Hunt 2 ●●, Landslide 2 ●●, Cuts 2 ●, conditional ◆ Hunt (crits), Landslide (loading), Cuts (the opener)",
  });
}
{
  // Its Aggro pays only on the party's anchor.
  const name = "The king's head", crowned = `${id(name)}_on`;
  const effect = "On a kill: every ally's Crit chance doubles for 20 ticks (up to 80%).";
  offhand("trophy", "legendary", name, {
    effect, stats: [st("aggro", 2), sp("crit_damage", "medium")],
    statuses: [
      own_(name, effect, { reactions: [react(EV.kill, give(crowned, TO.everyAlly))] }),
      given(crowned, "CROWNED", "Crit chance doubled, up to 80%.", { show: "icon", unremovable: undefined, duration: 20, crits: [{ times: 2, cap: 80 }] }),
    ],
    serves: "Hunt 3 ●●●, Landslide ●●, conditional ⚙ emptied quiver (half) ◆ Hunt (the kill as a trigger)",
  });
}

// ─── Bell ──

offhand("bell", "common", "Twin-clapper bell", { stats: [sp("double_strike", "medium")], serves: "extra strikes: Thousand Cuts." });
offhand("bell", "common", "Tenor bell", { stats: [sp("crit_damage", "medium"), st("defense", 1), critDown], serves: "Landslide's crits." });

{
  // The fourth landed basic attack rings before the count takes it; the ring's hits are bonus hits, which the count never hears.
  const name = "Ringing bell", n = `${id(name)}_count`;
  const effect = `Every 4th basic attack landed also hits every foe (${pct(HIT.light)}% of Attack), effects included.`;
  offhand("bell", "uncommon", name, {
    effect, stats: [sp("attack_speed", "medium"), sp("accuracy", "medium")],
    statuses: [
      own_(name, effect, {
        reactions: [
          reactIf(EV.basic, { side: "self", where: countAt(n, 3) }, { op: "strike", amount: share(HIT.light, "attack"), carry: true, tag: "ring", to: TO.everyFoe }),
          react(EV.basic, give(n, "holder", 1)),
        ],
      }),
      count(n, "RING", "Every 4th basic attack rings.", 4),
    ],
    serves: "Storm 1 ●●, Cuts 1 ●● ⚙ red rain (half), reaping (half) ◆ Storm (spread), Cuts (spread)",
  });
}
{
  const name = "Pacer's bell", effect = "After each ability: gains Haste.";
  offhand("bell", "uncommon", name, {
    effect, stats: [sp("cooldown", "medium"), sp("evasion", "medium")],
    statuses: [own_(name, effect, { reactions: [react(EV.cast, give("haste"))] })],
    serves: "Cuts 1 ●●, Storm ● ◆ Cuts (speed)",
  });
}
{
  const name = "Bell of the hour", n = `${id(name)}_count`;
  const effect = "Every 4th landed basic attack casts its first-slotted ability, cooldown or not, at its MP cost.";
  offhand("bell", "rare", name, {
    effect, stats: [st("mp_regen", 1), st("max_mp", 1), critStep(1)],
    statuses: [
      own_(name, effect, { reactions: [reactIf(EV.basic, { side: "self", where: countAt(n, 3) }, { op: "recast", which: "first", paid: true }), react(EV.basic, give(n, "holder", 1))] }),
      count(n, "HOUR", "Every 4th basic attack casts its first-slotted ability.", 4),
    ],
    serves: "Cuts 2 ●●●, Barrage 2 ●●● ⚙ spell on the swing (key)",
  });
}
{
  // Each beat rings once: with no ally Silenced it lifts a debuff from the ally with the most; with one Silenced, that Silence.
  // The order of the two answers keeps it to one: the first can't make a Silence, and the second waits on one.
  const name = "Warding bell", ring = `${id(name)}_ring`;
  const effect = `Every ${SO_OFTEN} ticks (the first at ${SO_OFTEN / 2}): lifts a debuff from the ally with the most debuffs, Silence first.`;
  const b = beatHalfway(id(name), name, [give(ring)]);
  const silenced = { side: "allies" as const, where: { has: "silence" } };
  offhand("bell", "rare", name, {
    effect, stats: [st("defense", 1), st("max_hp", 1), sp("evasion", "medium")],
    statuses: [
      own_(name, effect, {
        reactions: [
          ...b.reactions,
          reactIf(on("status_gained", { status: ring }), { ...silenced, atMost: 0 }, { op: "remove", label: "debuff", count: 1, to: { side: "allies", where: { debuffs: true }, pick: "highest", by: "debuffs" } }),
          reactIf(on("status_gained", { status: ring }), silenced, { op: "remove", label: "debuff", status: "silence", to: { side: "allies", where: { has: "silence" }, pick: "random" } }),
        ],
      }),
      ...b.statuses,
      marker(ring, "Warding bell (ring)", "Its beat."),
    ],
    serves: "general, Barrage ●, Toll ●",
  });
}
{
  const name = "Tireless bell", effect = "Keeps swinging through its abilities' wind-ups and recoveries.";
  offhand("bell", "legendary", name, {
    effect, stats: [sp("cooldown", "high"), sp("attack_speed", "medium")],
    statuses: [own_(name, effect, { tireless: true })],
    serves: "exotic",
  });
}

// ─── Cloak ──

offhand("cloak", "common", "Courier's cloak", { stats: [sp("attack_speed", "medium")], serves: "speed: Thousand Cuts and the Storm." });
offhand("cloak", "common", "Swallowtail cloak", { stats: [st("aggro", 1), sp("double_strike", "medium"), st("max_hp", -1)], serves: "the Toll's dancer." });

{
  const name = "Hooded cloak", effect = `On a dodge: gains a Shield (${pct(HIT.touch)}% of Attack).`;
  offhand("cloak", "uncommon", name, {
    effect, stats: [sp("evasion", "medium"), st("max_hp", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.dodge, give("shield", "holder", share(HIT.touch, "attack")))] })],
    serves: "Toll 1 ●●, Cuts ● ⚙ riposte (half) ◆ Toll (the dodge)",
  });
}
{
  const name = "Feathered cloak", done = `${id(name)}_used`, effect = "Once a fight, below half HP: goes Hidden.";
  offhand("cloak", "uncommon", name, {
    effect, stats: [sp("attack_speed", "medium"), st("mp_regen", 1)],
    statuses: [own_(name, effect, { reactions: [onceBelow(50, done, give("hidden"))] }), used(done, "FEATHERED CLOAK")],
    serves: "net, Pact ● ⚙ two in the dark (half) ◆ Pact (nets)",
  });
}
{
  const name = "Matador's cape", effect = "On a dodge: Taunts.";
  offhand("cloak", "uncommon", name, {
    effect, stats: [st("defense", -1), sp("evasion", "medium"), sp("crit_damage", "medium"), st("aggro", 1)],
    statuses: [own_(name, effect, { reactions: [react(EV.dodge, give("taunt"))] })],
    serves: "Toll 1 ●● ⚙ riposte (half) ◆ Toll (the dancer)",
  });
}
{
  // Evasion in percent against Defense in points, as the sheet shows them both; read live, so a Guard can turn it off. No
  // Evasion of its own: with a piece's step on it, even a Hoplite's body passed, so the light body is the class's or other gear's.
  const name = "Cloak of the dunes", effect = "While its Evasion is above its Defense: Aggro +25.";
  offhand("cloak", "rare", name, {
    effect, stats: [st("attack", 1), st("max_hp", 1), sp("accuracy", "medium")],
    statuses: [own_(name, effect, { stats: [{ stat: "aggro", flat: whileIt(25, { above: { stat: "evasion", over: "defense", ratio: 0.001 } }), live: true }] })],
    serves: "Toll 2 ●●, conditional ◆ Toll (the dancer)",
  });
}
{
  // The swing made ready carries a state whose basic hits land a second time (bare, so nothing repeats them); the swing spends it.
  const name = "Tempest cloak", on_ = `${id(name)}_on`;
  const effect = "On a dodge: next basic attack comes at once and lands twice.";
  offhand("cloak", "rare", name, {
    effect, stats: [sp("attack_speed", "medium"), sp("double_strike", "medium"), sp("cooldown", "medium")],
    statuses: [
      own_(name, effect, { reactions: [react(EV.dodge, swingNow(), give(on_))] }),
      oneUse(on_, "TEMPEST", "Next basic attack lands twice.", EV.swing, { reactions: [react(on("hit_lands", { kind: "basic", notTags: ["bare"] }), { op: "strike", of: "dealt", to: "other" })] }),
    ],
    serves: "Toll 2 ●●●, Cuts 2 ●●● ⚙ riposte (key) ◆ Toll (the dancer), Cuts (Evasion)",
  });
}
{
  const name = "Shadow cloak", effect = "Hidden at fight start and whenever a foe falls.";
  offhand("cloak", "rare", name, {
    effect, stats: [critStep(1), sp("crit_damage", "medium"), st("aggro", -1)],
    statuses: [own_(name, effect, { reactions: [atStart(give("hidden")), react(EV.fall, give("hidden"))] })],
    serves: "Hunt 2 ●●, Toll ● ⚙ two in the dark (key) ◆ Hunt (the kill as a trigger)",
  });
}
{
  // An HP floor from the fight's true start, spent on the first blow it holds; the holder goes Hidden as it's spent.
  const name = "Swan's grace", floor = `${id(name)}_floor`, effect = "Once a fight: survives a knockout at 1 HP, Hidden.";
  offhand("cloak", "legendary", name, {
    effect, stats: [sp("evasion", "medium"), st("max_hp", 2)],
    statuses: [
      own_(name, effect, { reactions: [atFirstStart(give(floor)), react(on("status_ended", { status: floor, cause: ["spent"] }), give("hidden"))] }),
      state(floor, "SWAN'S GRACE", "Next knockout leaves it at 1 HP.", { show: "sheet", unremovable: true, floor: { spend: true } }),
    ],
    serves: "exotic ⚙ two in the dark (half)",
  });
}

export const gear = S.gear;
export const statuses = S.statuses;
export const served = S.served;
