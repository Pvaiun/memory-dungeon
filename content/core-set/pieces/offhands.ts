/**
 * Step 5i, step 5: the ten offhand kinds' 80 pieces, from steps/05-core-set/5i-synergy/fill/offhands.md with fill-rulings.md (its third round wins).
 * `gear` joins the pack's gear and the rogue's stock; `statuses` the pack's statuses; `builds` is designer data, never in the pack.
 *
 * Each kind in the spine's order: two commons, two uncommons, two rares, two legendaries. Every number is the fill's word, from
 * scale.ts. The hooks are today's primitives or build/engine-spec.md's additions (X1 onward), in its shapes, with its section 6
 * fixes: a heal given reads the healed ally as `owner`; the Vial of the last breath marks itself when it stands again, and tests
 * `lacks` on the fall. Marked, Heat and Fervor are shared.ts's.
 */
import type { ConditionT, EffectT, EventSpecT, GearT, NumT, ReactionT, StatusT, TargetRuleT, ToT } from "../../../src/schema.js";
import { COOLDOWN, FLAT_STACKS, crit } from "../scale.js";
import { critStep, idOf, own, piece, pieceStatus, sp, st, type Build, type BuildTag, type Builds, type Change, type Rarity } from "./kit.js";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** "Every so often" (G13): the short cooldown word, the first beat halfway to it. */
const SO_OFTEN = { first: COOLDOWN.short / 2, every: COOLDOWN.short } as const;

const apply = (status: string, to: ToT, stacks?: NumT): EffectT => ({ op: "apply", status, ...(stacks !== undefined ? { stacks } : {}), to });
const on = (event: EventSpecT["event"], extra: Omit<EventSpecT, "event"> = {}): EventSpecT => ({ event, ...extra });
/** A share of a unit's max HP or MP. */
const share = (ratio: number, stat: "max_hp" | "max_mp", of: "holder" | "target"): NumT => ({ scale: [{ ratio, stat, of }] });
/** A share of the event's amount (a reaction's). */
const ofAmount = (ratio: number): NumT => ({ scale: [{ ratio, amount: true }] });
/** Hits on a unit that passes `when` deal pct % more, both damage types. */
const vs = (pct: number, when: NonNullable<TargetRuleT["where"]>) => {
  const n: NumT = { scale: [{ ratio: pct, when, of: "target" }] };
  return [{ tag: "physical", pct: n }, { tag: "magical", pct: n }];
};
/** The holder hasn't spent its once-a-fight marker (dead or alive: a fallen holder reacting to its own fall asks with ko). */
const notYet = (marker: string, ko = false): ConditionT => ({ side: "self", where: { lacks: marker, ...(ko ? { ko: true } : {}) } });
/** A kill by one of the holder's hits, not by a status's tick: a `ko` it landed, of each kind a hit has (X2, X29). */
const killsByHit = (rest: Omit<ReactionT, "on">): ReactionT[] =>
  (["basic", "ability", "extra"] as const).map((kind) => ({ on: on("ko", { whose: "foe", other: "holder", kind }), ...rest }));

const R = {
  allies: { side: "allies", pick: "all" },
  foes: { side: "foes", pick: "all" },
  lowestShare: { side: "allies", pick: "lowest", by: "hp_share" },
  leastMp: { side: "allies", pick: "lowest", by: "mp_share" },
  mostDangerous: { side: "foes", pick: "highest", by: { stats: ["attack", "magic"] } },
  mostAggro: { side: "allies", pick: "highest", by: { stat: "aggro" } },
  fallen: { side: "allies", where: { ko: true }, pick: "random" },
} satisfies Record<string, TargetRuleT>;

/** Bookkeeping, neither buff nor debuff (X14): once a fight, once a foe, a timer. Kept for the fight unless it says otherwise. */
const marker = (id: string, name: string, text: string, body: Partial<StatusT> = {}): StatusT =>
  ({ id, name, text, label: "marker", show: "sheet", stacking: "refresh", ...body }) as StatusT;
/** A status a piece gives another unit: a buff on the sheet, unremovable. */
const given = (id: string, name: string, text: string, body: Partial<StatusT>): StatusT =>
  ({ id, name, text, label: "buff", show: "sheet", stacking: "refresh", unremovable: true, ...body }) as StatusT;

/**
 * "Every so often" (G13, build/engine-spec.md section 5): an 11-tick timer whose end brings the first beat and starts a pulse
 * every 22. Re-armed when its holder is revived, since a fallen holder's timers end with it and fight_start doesn't come again.
 */
function everySoOften(id: string, name: string, beat: EffectT[]): { reactions: ReactionT[]; more: StatusT[] } {
  const wait = `${id}_wait`, pulse = `${id}_beat`;
  return {
    reactions: [
      { on: on("fight_start"), do: [apply(wait, "holder")] },
      { on: on("revived"), do: [apply(wait, "holder")] },
      { on: on("status_ended", { status: wait, cause: ["expired"] }), do: [...beat, apply(pulse, "holder")] },
    ],
    more: [
      marker(wait, `${name} (waiting)`, "Its first beat comes when this runs out.", { duration: SO_OFTEN.first }),
      marker(pulse, `${name} (beating)`, "Its beat, every so often.", { pulse: { every: SO_OFTEN.every, do: beat } }),
    ],
  };
}

const BUILD: Record<string, Build> = {
  landslide: "landslide", cuts: "cuts", bonfire: "bonfire", snap: "snap", hunt: "hunt", harvest: "harvest",
  ambush: "ambush", overflow: "overflow", lockdown: "lockdown", toll: "toll", pact: "pact", phoenix: "phoenix",
};
/** The fill's Builds line, as written ("Lockdown 2 ●●●, Landslide 2 ●●, Toll ●"): a build, its rung if named, and its worth. */
function tags(line: string): BuildTag[] {
  if (!line) return [];
  return line.split(",").map((part) => {
    const m = part.trim().match(/^(\w+)(?:\s+([123]))?\s+(●{1,3})$/);
    if (!m || !BUILD[m[1].toLowerCase()]) throw new Error(`offhands: can't read the builds line '${part}'`);
    return { build: BUILD[m[1].toLowerCase()], ...(m[2] ? { rung: Number(m[2]) as 1 | 2 | 3 } : {}), worth: m[3].length as 1 | 2 | 3 };
  });
}

export const gear: GearT[] = [];
export const statuses: StatusT[] = [];
export const builds: Builds = {};

/**
 * One offhand. `says` is its stats in words, `does` its effect; the card is both (its kind and wearers are the interface's).
 * `status` is the piece's own status (given at every fight's start), under the piece's id; `more` the statuses it hands out.
 */
function offhand(kind: string, rarity: Rarity, name: string, o: { stats?: Change[]; says?: string; does?: string; status?: Partial<StatusT>; more?: StatusT[]; builds: string }) {
  const id = idOf(name);
  const text = [o.says, o.does].filter(Boolean).join(" ");
  if (o.status) statuses.push(pieceStatus(id, name, o.does ?? text, o.status));
  statuses.push(...(o.more ?? []));
  gear.push(piece({ name, text, slot: "offhand", rarity, kind, stats: o.stats, statuses: o.status ? [id] : undefined }));
  builds[id] = tags(o.builds);
}

// ─── Kite shield (Knight, Paladin) ──────────────────────────────────────────

offhand("kite_shield", "common", "Pavise", { stats: [st("armor", 2)], says: "Armor +2.", builds: "Landslide 1 ●, Toll 1 ●" });
offhand("kite_shield", "common", "Banner kite", { stats: [st("max_hp", 1), st("aggro", 1)], says: "HP +1, Aggro +1.", builds: "Toll 1 ●, Landslide 1 ●" });
// G7 (second round): a tenth less damage while Taunting, in place of the Shield at the start (Carapace charm's). Read live on each hit.
offhand("kite_shield", "uncommon", "Gatekeeper's kite", {
  stats: [st("armor", 1)], says: "Armor +1.", does: "While its holder Taunts, it takes a tenth less damage.",
  status: { taken: [{ pct: { scale: [{ ratio: -10, when: { has: "taunt" }, of: "holder" }] } }] },
  builds: "Toll 1 ●, Landslide 1 ●, Bonfire 1 ●",
});
offhand("kite_shield", "uncommon", "Sheltering kite", {
  stats: [st("max_hp", 1)], says: "HP +1.", does: "At the start of every fight, the ally with the lowest share of its HP is Guarded.",
  status: { reactions: [{ on: on("fight_start"), do: [apply("guard", R.lowestShare)] }] },
  builds: "Phoenix 1 ●, Pact 1 ●, Bonfire 1 ●",
});
// X1: a Shield emptied by a foe's damage ends (cause stacks) naming that foe as its other.
offhand("kite_shield", "rare", "Rubble shield", {
  stats: [st("armor", 1)], says: "Armor +1.", does: "When its holder's Shield breaks, the foe whose blow broke it is Stunned.",
  status: { reactions: [{ on: on("status_ended", { status: "shield", cause: ["stacks"], other: "foe" }), do: [apply("stun", "other")] }] },
  builds: "Lockdown 2 ●●●, Landslide 2 ●●, Toll ●",
});
offhand("kite_shield", "rare", "Humbling shield", {
  does: "The first time each foe hits its holder, that foe is Weakened.",
  status: { reactions: [{ on: on("hit_taken"), if: { unit: "other", where: { lacks: "humbling_shield_humbled" } }, do: [apply("weaken", "other"), apply("humbling_shield_humbled", "other")] }] },
  more: [marker("humbling_shield_humbled", "Humbled", "Already Weakened by a Humbling shield this fight.")],
  builds: "Toll 2 ●●●, Lockdown ●●, Pact ●",
});
// X18: Thorns read live from Armor, so Guard counts the moment it lands.
offhand("kite_shield", "legendary", "Spiked bulwark", {
  does: "Thorns from its holder's Armor: each foe that hits it takes a twentieth of its Armor back.",
  status: { stats: [{ stat: "thorns", flat: { scale: [{ ratio: 0.05, stat: "armor", of: "holder" }] }, live: true }] },
  builds: "Toll 3 ●●●, Landslide 3 ●●●",
});
// X30.
offhand("kite_shield", "legendary", "Oathbound shield", {
  stats: [st("max_hp", 1)], says: "HP +1.", does: "When a hit would deal an ally more than a quarter of its max HP, its holder takes the hit instead.",
  status: { cover: { share: 25 } },
  builds: "Toll 2 ●●, Bonfire 2 ●●, Phoenix ●●, Lockdown ●",
});

// ─── Round shield (Hoplite, Valkyrie) ───────────────────────────────────────

offhand("round_shield", "common", "Bronze buckler", { stats: [st("armor", 1), st("attack", 1)], says: "Armor +1, Attack +1.", builds: "Landslide 1 ●, Hunt 1 ●" });
offhand("round_shield", "common", "Linden shield", { stats: [st("max_hp", 2)], says: "HP +2.", builds: "Toll 1 ●, Pact 1 ●" });
offhand("round_shield", "uncommon", "Comrade's targe", {
  stats: [st("armor", 1)], says: "Armor +1.", does: "At the start of every fight, the other ally with the highest Aggro is Guarded.",
  status: { reactions: [{ on: on("fight_start"), do: [apply("guard", { side: "others", pick: "highest", by: { stat: "aggro" } })] }] },
  builds: "Toll 1 ●, Landslide 1 ●, Bonfire 1 ●",
});
offhand("round_shield", "uncommon", "Linebreaker", {
  stats: [st("attack", 1)], says: "Attack +1.", does: "Its holder's hits on a Taunting foe deal a fifth more.",
  status: { boosts: vs(20, { has: "taunt" }) },
  builds: "Hunt 1 ●, Ambush 1 ●, Landslide 1 ●",
});
// No ifNone: once everyone is Guarded nothing fires, so two holders can't pass a Guard back and forth.
offhand("round_shield", "rare", "Paired shields", {
  stats: [st("armor", 1)], says: "Armor +1.", does: "Whenever its holder is Guarded, so is the other ally lowest in HP share that isn't Guarded yet.",
  status: { reactions: [{ on: on("status_gained", { status: "guard" }), do: [apply("guard", { side: "others", where: { lacks: "guard" }, pick: "lowest", by: "hp_share" })] }] },
  builds: "Toll 2 ●●, Bonfire ●●, Landslide ●",
});
offhand("round_shield", "rare", "Hunter's buckler", {
  stats: [st("attack", 1)], says: "Attack +1.", does: "When its holder's hit fells a foe, it gains Haste and a Shield.",
  status: { reactions: killsByHit({ do: [apply("haste", "holder"), apply("shield", "holder", share(0.15, "max_hp", "holder"))] }) },
  builds: "Hunt 2 ●●, Ambush ●",
});
// X4 `lower`: the aura goes to allies with less Armor than the holder when the fight starts and whenever one of them (or the
// holder) is revived; it ends with the holder.
const phalanxAura: ReactionT["do"] = [apply("phalanx_shield_aura", { side: "others", where: { lower: { stat: "armor" } }, pick: "all" })];
offhand("round_shield", "legendary", "Phalanx shield", {
  does: "While its holder stands, allies with less Armor than it take a fifth less damage. Its holder deals a fifth less.",
  status: {
    boosts: [{ tag: "physical", pct: -20 }, { tag: "magical", pct: -20 }],
    reactions: [
      { on: on("fight_start"), do: phalanxAura },
      { on: on("revived"), do: phalanxAura },
      { on: on("revived", { whose: "ally" }), do: phalanxAura },
    ],
  },
  more: [given("phalanx_shield_aura", "Phalanx", "Takes a fifth less damage while the Phalanx shield's holder stands.", { perSource: { endsWithSource: true }, taken: [{ pct: -20 }] })],
  builds: "Bonfire 3 ●●●, Harvest ●●, Toll ●●",
});
// The fallen ally by rule: the validator asks a revive's rule for ko, so `to: owner` (the unit that just fell) can't be written.
// With another ally already down from an earlier fight, the raise can land on either.
offhand("round_shield", "legendary", "Shield of the chosen", {
  does: "Once a fight, when another ally falls, its holder raises it at once with a tenth of its HP.",
  status: {
    reactions: [{
      on: on("ko", { whose: "ally" }), if: notYet("shield_of_the_chosen_spent"),
      do: [{ op: "revive", hp: share(0.1, "max_hp", "target"), to: { side: "others", where: { ko: true }, pick: "random" } }, apply("shield_of_the_chosen_spent", "holder")],
    }],
  },
  more: [marker("shield_of_the_chosen_spent", "Shield of the chosen (spent)", "Its raise is spent this fight.")],
  builds: "Phoenix 3 ●●●",
});

// ─── Horn (Knight, Bard) ────────────────────────────────────────────────────

offhand("horn", "common", "Ram's horn", { stats: [st("aggro", 1), st("attack", 1)], says: "Aggro +1, Attack +1.", builds: "Toll 1 ●, Landslide 1 ●" });
offhand("horn", "common", "Ivory horn", { stats: [st("mp_regen", 1), st("magic", 1)], says: "MP regen +1, Magic +1.", builds: "Overflow 1 ●, Harvest 1 ●" });
offhand("horn", "uncommon", "Reveille", {
  stats: [st("magic", 1)], says: "Magic +1.", does: "At the start of every fight, the ally with the least MP gains Clarity.",
  status: { reactions: [{ on: on("fight_start"), do: [apply("clarity", R.leastMp)] }] },
  builds: "Overflow 1 ●, Lockdown 1 ●, Bonfire 1 ●",
});
// G7 (second round): Haste on the first kill, in place of the Taunt at the start (Clarion blade's).
offhand("horn", "uncommon", "Bull's horn", {
  stats: [st("attack", 1)], says: "Attack +1.", does: "The first time in a fight that a foe falls, every ally is Hasted.",
  status: { reactions: [{ on: on("ko", { whose: "foe" }), if: notYet("bulls_horn_rung"), do: [apply("haste", R.allies), apply("bulls_horn_rung", "holder")] }] },
  more: [marker("bulls_horn_rung", "Bull's horn (rung)", "It has rung this fight.")],
  builds: "Hunt 1 ●, Cuts 1 ●, Ambush 1 ●",
});
// X9: the slowest basic attack is the highest swing.
offhand("horn", "rare", "War horn", {
  does: "At the start of every fight, the ally with the slowest basic attack gains many Might.",
  status: { reactions: [{ on: on("fight_start"), do: [apply("might", { side: "allies", pick: "highest", by: "swing" }, FLAT_STACKS.many)] }] },
  builds: "Landslide 2 ●●●, Ambush 2 ●●",
});
const echo: EffectT[] = [{ op: "mp", amount: share(0.05, "max_mp", "target"), to: R.leastMp }];
offhand("horn", "rare", "Echo horn", {
  does: "Each time an ally finishes casting an ability, the ally with the least MP gains a little MP.",
  status: { reactions: [{ on: on("action_resolve", { kind: "ability" }), do: echo }, { on: on("action_resolve", { whose: "ally", kind: "ability" }), do: echo }] },
  builds: "Overflow 2 ●●●, Lockdown ●, Bonfire ●",
});
// X21: every ally's basic attack ready at once; the holder's abilities on their full cooldowns.
offhand("horn", "legendary", "Horn of the charge", {
  does: "At the start of every fight, every ally is Hasted and its first action comes at once. Its holder starts every fight with every ability on cooldown.",
  status: {
    reactions: [{
      on: on("fight_start"),
      do: [apply("haste", R.allies), { op: "cooldown", which: "basic", set: "ready", to: R.allies }, { op: "cooldown", which: "abilities", set: "full", to: "holder" }],
    }],
  },
  builds: "Ambush 3 ●●●, Cuts ●●",
});
// It survives its holder's fall, so it rings for that fall too.
const rally: EffectT[] = [apply("haste", R.allies), apply("shield", R.allies, share(0.2, "max_hp", "target"))];
offhand("horn", "legendary", "Rallying horn", {
  does: "When an ally falls (its holder too), every ally still standing gains Haste and a Shield. When an ally is revived, it gains many Might.",
  status: {
    survivesKO: true,
    reactions: [
      { on: on("ko"), do: rally },
      { on: on("ko", { whose: "ally" }), do: rally },
      { on: on("revived"), do: [apply("might", "owner", FLAT_STACKS.many)] },
      { on: on("revived", { whose: "ally" }), do: [apply("might", "owner", FLAT_STACKS.many)] },
    ],
  },
  builds: "Phoenix 3 ●●●, Toll ●",
});

// ─── Tome (Frostweaver, Bard) ───────────────────────────────────────────────

offhand("tome", "common", "Scholar's codex", { stats: [st("magic", 2)], says: "Magic +2.", builds: "Snap 1 ●, Harvest 1 ●" });
offhand("tome", "common", "Hymnal", { stats: [st("max_mp", 1), st("mp_regen", 1)], says: "MP +1, MP regen +1.", builds: "Overflow 1 ●" });
offhand("tome", "uncommon", "Snowbound folio", {
  stats: [st("magic", 1)], says: "Magic +1.", does: "At the start of every fight, every foe gains a few Chill.",
  status: { reactions: [{ on: on("fight_start"), do: [apply("chill", R.foes, own("few", "magic"))] }] },
  builds: "Snap 1 ●, Lockdown 1 ●, Ambush 1 ●",
});
// X22.
offhand("tome", "uncommon", "Abridged lexicon", {
  stats: [st("max_mp", 1)], says: "MP +1.", does: "Its holder's abilities cost a tenth less MP.",
  status: { mods: [{ mp: -10 }] },
  builds: "Overflow 1 ●, Lockdown 1 ●, Harvest 1 ●",
});
// X20, in the spec's shape: a boost on its Chill that reads the foe receiving it, a quarter for every four stacks held (6.25% a
// stack). The line's "one more stack for every four" is an absolute add no field gives, so the card says it as the engine does.
offhand("tome", "rare", "Primer of frost", {
  does: "Each time its holder adds Chill to a foe, it adds a quarter more for every four stacks the foe already holds.",
  status: { boosts: [{ tag: "chill", pct: { scale: [{ ratio: 6.25, stacks: "chill", of: "target" }] } }] },
  builds: "Snap 2 ●●●",
});
// X29's `area` tag: hits of a damage effect aimed at every foe. A boost names one tag, so this reaches every area hit the holder
// lands; among tome holders those are abilities (an area basic attack only comes from a formation's seat).
offhand("tome", "rare", "Treatise on the field", {
  stats: [st("magic", 1)], says: "Magic +1.", does: "Its holder's abilities that hit every foe deal half again as much to each foe above half its HP.",
  status: { boosts: [{ tag: "area", pct: { scale: [{ ratio: 50, when: { hpAtLeast: 50 }, of: "target" }] } }] },
  builds: "Harvest 2 ●●●",
});
// Untyped damage of all its HP and Shield: not a hit, and nothing reacts to it as one. Every fall it causes checks again.
offhand("tome", "legendary", "Last page", {
  does: "When a foe falls, every foe below a tenth of its HP falls too.",
  status: {
    reactions: [{
      on: on("ko", { whose: "foe" }),
      do: [{ op: "damage", type: "none", amount: { scale: [{ ratio: 1, hp: "current", of: "target" }, { ratio: 1, stacks: "shield", of: "target" }] }, to: { side: "foes", where: { hpBelow: 10 }, pick: "all" } }],
    }],
  },
  builds: "Harvest 3 ●●●, Snap ●●, Bonfire ●",
});
// X2 `amountAtLeast`: only a cast that paid MP makes a free one, so a cast it made free doesn't make another (the loop fix). The
// token is a marker, so no Dispel takes it; any ally's next ability spends every copy.
offhand("tome", "legendary", "Annotated grimoire", {
  does: "Each ability its holder pays for makes the next ability any ally casts free.",
  status: { reactions: [{ on: on("action_resolve", { kind: "ability", amountAtLeast: 1 }), do: [apply("annotated_grimoire_free", R.allies)] }] },
  more: [marker("annotated_grimoire_free", "Free cast", "Its next ability costs no MP.", {
    mods: [{ mp: -100 }],
    reactions: [{ on: on("action_resolve", { kind: "ability" }), do: [{ op: "remove", label: "marker", status: "annotated_grimoire_free", to: R.allies }] }],
  })],
  builds: "Overflow 3 ●●●, Lockdown ●●",
});

// ─── Lantern (Paladin, Pyromancer) ──────────────────────────────────────────

offhand("lantern", "common", "Brass lantern", { stats: [st("magic", 1), st("max_hp", 1)], says: "Magic +1, HP +1.", builds: "Bonfire 1 ●, Harvest 1 ●" });
offhand("lantern", "common", "Hooded lantern", { stats: [st("max_mp", 2)], says: "MP +2.", builds: "Overflow 1 ●, Bonfire 1 ●" });
offhand("lantern", "uncommon", "Pitch lantern", {
  stats: [st("magic", 1)], says: "Magic +1.", does: "At the start of every fight, every foe gains a few Burn.",
  status: { reactions: [{ on: on("fight_start"), do: [apply("burn", R.foes, own("few", "magic"))] }] },
  builds: "Bonfire 1 ●, Harvest 1 ●, Ambush 1 ●",
});
// G7: a Weaken at the start, in place of the Ward at the start (the rune sword's and the mace's).
offhand("lantern", "uncommon", "Dazzling lantern", {
  stats: [st("max_hp", 1)], says: "HP +1.", does: "At the start of every fight, the foe with the highest Attack or Magic is Weakened.",
  status: { reactions: [{ on: on("fight_start"), do: [apply("weaken", R.mostDangerous)] }] },
  builds: "Bonfire 1 ●, Toll 1 ●, Lockdown 1 ●",
});
// Reads the foe's Burn: under one stack on a foe that holds none, nothing lands, so it needs no test.
offhand("lantern", "rare", "Bellows lantern", {
  does: "Each hit its holder lands on a burning foe adds Burn: a tenth of what the foe holds.",
  status: { reactions: [{ on: on("hit_lands"), do: [apply("burn", "other", { scale: [{ ratio: 0.1, stacks: "burn", of: "target" }] })] }] },
  builds: "Bonfire 2 ●●●",
});
// X2 `notTags: [area]`: an ability aimed at every foe would mark them all, which marks nothing.
offhand("lantern", "rare", "Signal lantern", {
  does: "A foe its holder hits with an ability is Marked. Abilities that hit every foe don't Mark.",
  status: { reactions: [{ on: on("hit_lands", { kind: "ability", notTags: ["area"] }), do: [apply("marked", "other")] }] },
  builds: "Hunt 2 ●●, Bonfire ●●",
});
// X1: a foe's statuses end (cause ko) just before its ko, carrying the stacks they held.
offhand("lantern", "legendary", "Wick", {
  does: "When a burning foe falls, all its Burn passes to the foe with the most HP, and its holder gains Heat.",
  status: {
    reactions: [{
      on: on("status_ended", { whose: "foe", status: "burn", cause: ["ko"] }),
      do: [apply("burn", { side: "foes", pick: "highest", by: "hp" }, ofAmount(1)), apply("heat", "holder", FLAT_STACKS.few)],
    }],
  },
  builds: "Bonfire 3 ●●●",
});
// X36. Only a standing holder's lamp acts: its status doesn't survive a fall.
offhand("lantern", "legendary", "Lamp of vigil", {
  does: "After each won fight, one fallen ally stands up with a quarter of its HP.",
  status: { reactions: [{ on: on("fight_won"), do: [{ op: "revive", hp: share(0.25, "max_hp", "target"), to: R.fallen }] }] },
  builds: "Phoenix 2 ●●●, Pact ●",
});

// ─── Relic (Cleric, Valkyrie) ───────────────────────────────────────────────

offhand("relic", "common", "Shrine token", { stats: [st("mp_regen", 2)], says: "MP regen +2.", builds: "Overflow 1 ●, Phoenix 1 ●" });
offhand("relic", "common", "Blessed knot", { stats: [st("magic", 1), st("max_hp", 1)], says: "Magic +1, HP +1.", builds: "Pact 1 ●, Phoenix 1 ●" });
// A heal given (X2): `healed` with the holder as its other; the healed ally is the owner (the spec's section 6 fix).
const healGiven = (extra: Omit<EventSpecT, "event"> = {}) => on("healed", { whose: "any", other: "holder", ...extra });
offhand("relic", "uncommon", "Holy water", {
  stats: [st("magic", 1)], says: "Magic +1.", does: "Each time one of its holder's abilities heals an ally, it also lifts one debuff from that ally.",
  status: { reactions: [{ on: healGiven({ kind: "ability" }), do: [{ op: "remove", label: "debuff", count: 1, to: "owner" }] }] },
  builds: "Pact 1 ●, Toll 1 ●, Phoenix 1 ●",
});
// G7 (second round): a mend on each fall, in place of the Regen at the start (Mender's mace's), and a name that isn't its twin's.
offhand("relic", "uncommon", "Charnel icon", {
  stats: [st("mp_regen", 1)], says: "MP regen +1.", does: "Each time a foe falls, the ally with the lowest share of its HP is healed a little.",
  status: { reactions: [{ on: on("ko", { whose: "foe" }), do: [{ op: "heal", amount: share(0.06, "max_hp", "target"), to: R.lowestShare }] }] },
  builds: "Hunt 1 ●, Pact 1 ●, Phoenix 1 ●",
});
offhand("relic", "rare", "Saint's knucklebone", {
  does: "Each time one of its holder's abilities heals an ally, that ally gains a few Might.",
  status: { reactions: [{ on: healGiven({ kind: "ability" }), do: [apply("might", "owner", own("few", "magic"))] }] },
  builds: "Pact 2 ●●●, Phoenix ●, Toll ●",
});
// X22 and X24: its abilities that revive.
offhand("relic", "rare", "Reliquary of mercy", {
  does: "Its holder's revives cost half their MP and wind up in a moment.",
  status: { mods: [{ of: { does: ["revive"] }, mp: -50, cast: 1 }] },
  builds: "Phoenix 2 ●●●, Ambush ●",
});
// X32: every heal the holder gives, its Lifesteal and the Regens it applied included.
offhand("relic", "legendary", "Phylactery", {
  does: "The part of its holder's heals that would go past full becomes a Shield on the healed ally.",
  status: { reactions: [{ on: on("overhealed", { whose: "any", other: "holder" }), do: [apply("shield", "owner", ofAmount(1))] }] },
  builds: "Pact 3 ●●●, Landslide ●●, Phoenix ●●",
});
// X35: wins over Einherjar's readiness.
offhand("relic", "legendary", "Bones of the returned", {
  does: "Allies its holder revives come back with all their HP, and with every ability on full cooldown.",
  status: { revives: { ready: false, hp: share(1, "max_hp", "target") } },
  builds: "Phoenix 3 ●●, Pact ●",
});

// ─── Bell (Monk, Cleric, Stormcaller) ───────────────────────────────────────

offhand("bell", "common", "Temple bell", { stats: [sp("evasion", "medium"), st("attack", 1)], says: "Evasion medium, Attack +1.", builds: "Cuts 1 ●, Toll 1 ●" });
offhand("bell", "common", "Prayer bell", { stats: [st("mp_regen", 1), st("magic", 1)], says: "MP regen +1, Magic +1.", builds: "Overflow 1 ●, Harvest 1 ●" });
// G7: a dodge that pays, in place of the Haste at the start (the fist weapons'). X21.
offhand("bell", "uncommon", "Quickening chime", {
  stats: [sp("evasion", "medium")], says: "Evasion medium.", does: "Each time its holder dodges a hit, its next basic attack comes a little sooner.",
  status: { reactions: [{ on: on("hit_evaded"), do: [{ op: "cooldown", which: "basic", set: { less: 2 }, to: "holder" }] }] },
  builds: "Cuts 1 ●, Toll 1 ●",
});
const wake: EffectT[] = [{ op: "remove", label: "debuff", status: "silence", to: "owner" }, apply("waking_bell_rung", "holder")];
offhand("bell", "uncommon", "Waking bell", {
  stats: [st("mp_regen", 1)], says: "MP regen +1.", does: "The first time in a fight that an ally is Silenced, the Silence is lifted at once. A cast it broke is still lost.",
  status: {
    reactions: [
      { on: on("status_gained", { status: "silence" }), if: notYet("waking_bell_rung"), do: wake },
      { on: on("status_gained", { status: "silence", whose: "ally" }), if: notYet("waking_bell_rung"), do: wake },
    ],
  },
  more: [marker("waking_bell_rung", "Waking bell (rung)", "It has rung this fight.")],
  builds: "Overflow 1 ●, Lockdown 1 ●, Phoenix 1 ●",
});
// X9. No fallback when every other ally is Hasted, so two Tempo bells can't pass Haste back and forth.
offhand("bell", "rare", "Tempo bell", {
  does: "Each time its holder gains Haste, the other ally with the slowest basic attack that isn't Hasted gains it too.",
  status: { reactions: [{ on: on("status_gained", { status: "haste" }), do: [apply("haste", { side: "others", where: { lacks: "haste" }, pick: "highest", by: "swing" })] }] },
  builds: "Cuts 2 ●●●, Overflow ●",
});
const warding = everySoOften("warding_bell", "Warding bell", [{ op: "remove", label: "debuff", count: 1, to: { side: "allies", where: { debuffs: true }, pick: "highest", by: "debuffs" } }]);
offhand("bell", "rare", "Warding bell", {
  does: "Every so often, it lifts one debuff from the ally holding the most.",
  status: { reactions: warding.reactions }, more: warding.more,
  builds: "Toll 2 ●●, Lockdown ●, Pact ●",
});
// X21 `longest`: 5 ticks closer each beat.
const hour = everySoOften("bell_of_the_hour", "Bell of the hour", [{ op: "cooldown", which: "longest", set: { less: 5 }, to: "holder" }]);
offhand("bell", "legendary", "Bell of the hour", {
  does: "Every so often, its holder's ability with the longest cooldown left comes a few ticks closer.",
  status: { reactions: hour.reactions }, more: hour.more,
  builds: "Overflow 3 ●●, Lockdown 3 ●●, Cuts ●",
});
// It survives its holder's fall, so it rings for that fall too; once down, it's silent until its holder is revived.
offhand("bell", "legendary", "Funeral bell", {
  does: "When any unit falls, friend or foe, every ally still standing gains Fervor. It rings for its holder's own fall too.",
  status: { survivesKO: true, reactions: [{ on: on("ko", { whose: "any" }), do: [apply("fervor", R.allies, FLAT_STACKS.one)] }] },
  builds: "Phoenix 3 ●●●, Hunt ●●, Harvest ●",
});

// ─── Totem (Bramble knight, Ranger, Geomancer) ──────────────────────────────

offhand("totem", "common", "Standing stone", { stats: [st("armor", 2)], says: "Armor +2.", builds: "Landslide 1 ●, Toll 1 ●" });
offhand("totem", "common", "Hawthorn fetish", { stats: [st("attack", 1), sp("thorns", "medium")], says: "Attack +1, Thorns medium.", builds: "Toll 1 ●, Hunt 1 ●" });
// The Thorns are the fight's: they survive the ally's fall, so a revived ally still has them.
offhand("totem", "uncommon", "Spinebark pole", {
  stats: [st("armor", 1)], says: "Armor +1.", does: "At the start of every fight, the ally with the highest Aggro gains Thorns for the fight.",
  status: { reactions: [{ on: on("fight_start"), do: [apply("spinebark_pole_thorns", R.mostAggro)] }] },
  more: [given("spinebark_pole_thorns", "Spinebark", "Thorns up for the fight.", { survivesKO: true, stats: [{ stat: "thorns", flat: sp("thorns", "medium").flat }] })],
  builds: "Toll 1 ●, Landslide 1 ●, Harvest 1 ●",
});
// G7: Plate keeps the holder's own Guard below half; the totem's goes to the first ally to drop below half. X3 tests the owner.
const bear: Omit<ReactionT, "on"> = { if: [{ unit: "owner", where: { hpBelow: 50 } }, notYet("bear_fetish_spent")], do: [apply("guard", "owner"), apply("bear_fetish_spent", "holder")] };
offhand("totem", "uncommon", "Bear fetish", {
  stats: [st("attack", 1)], says: "Attack +1.", does: "The first ally to drop below half its HP each fight is Guarded.",
  status: { reactions: [{ on: on("hp_lost"), ...bear }, { on: on("hp_lost", { whose: "ally" }), ...bear }] },
  more: [marker("bear_fetish_spent", "Bear fetish (spent)", "Its Guard is spent this fight.")],
  builds: "Toll 1 ●, Pact 1 ●, Phoenix 1 ●",
});
offhand("totem", "rare", "Briar totem", {
  does: "Foes that hit its holder gain a few Bleed.",
  status: { reactions: [{ on: on("hit_taken"), do: [apply("bleed", "other", own("few", "armor"))] }] },
  builds: "Toll 2 ●●●, Cuts ●",
});
offhand("totem", "rare", "Stone totem", {
  does: "Its holder starts every fight behind a Shield from its Armor.",
  status: { reactions: [{ on: on("fight_start"), do: [apply("shield", "holder", { scale: [{ ratio: 0.5, stat: "armor", of: "holder" }] })] }] },
  builds: "Landslide 2 ●●●, Ambush ●●",
});
/**
 * The spine's addition 16 (Shields received) isn't in build/engine-spec.md, so the third larger is today's primitive: an aura on
 * every ally, ending with the holder, whose boost on Shield makes the Shields that ally gives a third larger. Every Shield the party
 * gains is given by one of its own, so it reads as the card says. The Shield keeps its own cap (the offhands ruling).
 */
const earthmotherAura: ReactionT["do"] = [apply("earthmother_totem_aura", R.allies)];
const brokenShield = (whose: "holder" | "ally"): ReactionT => ({ on: on("status_ended", { whose, status: "shield", cause: ["stacks"] }), do: [apply("might", "owner", FLAT_STACKS.few)] });
offhand("totem", "legendary", "Earthmother totem", {
  does: "While its holder stands, every Shield an ally gains is a third larger. When an ally's Shield breaks, that ally gains a few Might.",
  status: {
    reactions: [
      { on: on("fight_start"), do: earthmotherAura },
      { on: on("revived"), do: earthmotherAura },
      { on: on("revived", { whose: "ally" }), do: earthmotherAura },
      brokenShield("holder"),
      brokenShield("ally"),
    ],
  },
  more: [given("earthmother_totem_aura", "Earthmother", "The Shields it gives are a third larger while the Earthmother totem's holder stands.", { perSource: { endsWithSource: true }, boosts: [{ tag: "shield", pct: 33 }] })],
  builds: "Landslide 3 ●●●, Phoenix ●●, Toll ●",
});
offhand("totem", "legendary", "Wild hunt totem", {
  does: "Its holder's basic attacks Mark their target. Each time a foe falls, every ally gains a few Might.",
  status: {
    reactions: [
      { on: on("hit_lands", { kind: "basic" }), do: [apply("marked", "other")] },
      { on: on("ko", { whose: "foe" }), do: [apply("might", R.allies, FLAT_STACKS.few)] },
    ],
  },
  builds: "Hunt 3 ●●●, Ambush ●",
});

// ─── Vial (Assassin, Vampire) ───────────────────────────────────────────────

offhand("vial", "common", "Red tincture", { stats: [sp("lifesteal", "medium"), st("attack", 1)], says: "Lifesteal medium, Attack +1.", builds: "Pact 1 ●, Cuts 1 ●" });
offhand("vial", "common", "Hemlock phial", { stats: [critStep(1), st("attack", 1)], says: "Crit +1, Attack +1.", builds: "Ambush 1 ●, Hunt 1 ●, Cuts 1 ●" });
offhand("vial", "uncommon", "Clotting salve", {
  stats: [critStep(1)], says: "Crit +1.", does: "Its holder's crits heal it for a fifth of the damage they deal.",
  status: { reactions: [{ on: on("hit_lands", { tags: ["crit"] }), do: [{ op: "heal", amount: ofAmount(0.2), to: "self" }] }] },
  builds: "Pact 1 ●, Ambush 1 ●, Hunt 1 ●",
});
// The offhands ruling: Lifesteal medium on hits against a bleeding foe, on top of any Lifesteal. X3 tests the foe hit.
offhand("vial", "uncommon", "Crimson dregs", {
  stats: [st("attack", 1)], says: "Attack +1.", does: "Its holder's hits on a bleeding foe heal it for a share of their damage.",
  status: { reactions: [{ on: on("hit_lands"), if: { unit: "other", where: { has: "bleed" } }, do: [{ op: "heal", amount: ofAmount(sp("lifesteal", "medium").flat / 100), to: "self" }] }] },
  builds: "Pact 1 ●, Cuts 1 ●, Toll 1 ●",
});
// X22 and X23 (G12): half the MP, and HP equal to the full cost, never below 1.
offhand("vial", "rare", "Blood vial", {
  does: "Its holder's abilities cost half their MP, plus HP equal to their full cost. The HP price never takes it below 1 HP.",
  status: { mods: [{ mp: -50, hp: { pct: 100 } }] },
  builds: "Pact 2 ●●●, Phoenix ●",
});
// X25: two crit steps on a bleeding foe.
offhand("vial", "rare", "Venom vial", {
  does: "Its holder's crits add several Bleed, and it crits more often on a bleeding foe.",
  status: { reactions: [{ on: on("hit_lands", { tags: ["crit"] }), do: [apply("bleed", "other", own("several", "attack"))] }], crits: [{ when: { has: "bleed" }, chance: crit(2) }] },
  builds: "Cuts 2 ●●, Hunt ●●, Ambush ●",
});
// X34, with the spec's section 6 fix: a fallen unit gains no status, so it marks itself when its own return stands it up (a revive
// it gave itself, not an ally's Raise), and tests `lacks` on the fall.
offhand("vial", "legendary", "Vial of the last breath", {
  does: "Once a fight, when its holder falls, it stands up a few ticks later with a third of its HP.",
  status: {
    survivesKO: true,
    reactions: [
      { on: on("ko"), if: notYet("vial_of_the_last_breath_spent", true), do: [{ op: "revive", hp: share(0.33, "max_hp", "target"), after: 4, to: { side: "self", where: { ko: true } } }] },
      { on: on("revived", { other: "holder" }), do: [apply("vial_of_the_last_breath_spent", "holder")] },
    ],
  },
  more: [marker("vial_of_the_last_breath_spent", "Vial of the last breath (spent)", "Its return is spent this fight.")],
  builds: "Phoenix 3 ●●●",
});
// X23 (G12): it pays down to half at the fight's start. The doubling is Bloodlust's own pattern, so on the Vampire the two multiply.
offhand("vial", "legendary", "Bloodlust draught", {
  does: "Its holder starts every fight at half its HP (it pays), and its Lifesteal is doubled until it's full.",
  status: {
    reactions: [{
      on: on("fight_start"),
      do: [
        { op: "pay", hp: { scale: [{ ratio: 1, hp: "current", of: "holder" }, { ratio: -0.5, stat: "max_hp", of: "holder" }] }, to: "holder" },
        apply("bloodlust_draught_thirst", "holder"),
      ],
    }],
  },
  more: [{
    id: "bloodlust_draught_thirst", name: "THIRST", text: "Lifesteal doubled until it's healed to full.", label: "buff", show: "sheet", stacking: "fizzle",
    stats: [{ stat: "lifesteal", flat: { scale: [{ ratio: 1, stat: "lifesteal", of: "holder" }] } }],
    reactions: [{ on: on("healed"), do: [{ op: "remove", label: "buff", status: "bloodlust_draught_thirst", to: { side: "self", where: { hpAtLeast: 100 } } }] }],
  }],
  builds: "Pact 3 ●●●, Cuts ●",
});

// ─── Idol (Hexer, Vampire) ──────────────────────────────────────────────────

offhand("idol", "common", "Night mask", { stats: [sp("siphon", "medium"), st("magic", 1)], says: "Siphon medium, Magic +1.", builds: "Overflow 1 ●, Pact 1 ●" });
offhand("idol", "common", "Carved effigy", { stats: [st("max_hp", 2)], says: "HP +2.", builds: "Pact 1 ●, Toll 1 ●" });
offhand("idol", "uncommon", "Carrion idol", {
  stats: [st("magic", 1)], says: "Magic +1.", does: "When its holder's hit fells a foe, it regains MP.",
  status: { reactions: killsByHit({ do: [{ op: "mp", amount: share(0.15, "max_mp", "holder"), to: "holder" }] }) },
  builds: "Hunt 1 ●, Overflow 1 ●",
});
// The offhands ruling: Rot on crits, in place of a small Siphon on crits (a small Leech idol).
offhand("idol", "uncommon", "Fanged idol", {
  stats: [critStep(1)], says: "Crit +1.", does: "Its holder's crits Rot their target.",
  status: { reactions: [{ on: on("hit_lands", { tags: ["crit"] }), do: [apply("rot", "other")] }] },
  builds: "Hunt 1 ●, Pact 1 ●",
});
offhand("idol", "rare", "Withering idol", {
  does: "Its holder's basic attacks Weaken their target, and its hits on a Weakened foe deal a little more.",
  status: { reactions: [{ on: on("hit_lands", { kind: "basic" }), do: [apply("weaken", "other")] }], boosts: vs(15, { has: "weaken" }) },
  builds: "Toll 2 ●●, Lockdown 2 ●●, Pact ●",
});
/**
 * The spec's simpler shape (X3): while its holder's MP is full, what its Siphon drains goes to the ally with the least MP. Siphon's
 * own gain is lost past full, so this sends on what the holder can't keep (on the hit that fills it, the share may go both ways).
 */
offhand("idol", "rare", "Leech idol", {
  stats: [sp("siphon", "medium")], says: "Siphon medium.", does: "MP it drains past its holder's full pool goes to the ally with the least MP.",
  status: {
    reactions: [{
      on: on("hit_lands"), if: { side: "self", where: { mpAtLeast: 100 } },
      do: [{ op: "mp", amount: { scale: [{ ratio: 0.01, amount: true, times: { stat: "siphon", of: "holder" } }] }, to: { side: "others", pick: "lowest", by: "mp_share" } }],
    }],
  },
  builds: "Overflow 2 ●●●, Pact ●",
});
// X2: a Weaken the holder applied (`other: holder` on the foe's status_gained). Slow at its own length outlasts the Weaken by 4.
offhand("idol", "legendary", "Idol of binding", {
  does: "Foes its holder Weakens are also Slowed, and its hits on a foe that's both deal double.",
  status: {
    reactions: [{ on: on("status_gained", { whose: "foe", status: "weaken", other: "holder" }), do: [apply("slow", "owner")] }],
    boosts: vs(100, { has: ["weaken", "slow"] }),
  },
  builds: "Lockdown 3 ●●●, Toll ●●",
});
// X37: the newest buff a foe can lose, moved with its stacks and time left. Unremovable buffs (passives, Hidden) stay.
const hungry = everySoOften("idol_of_the_hungry_dark", "Idol of the hungry dark", [{ op: "remove", label: "buff", count: 1, move: true, to: { side: "foes", where: { buffs: true }, pick: "random" } }]);
offhand("idol", "legendary", "Idol of the hungry dark", {
  does: "Every so often, it takes one buff from a foe and gives it to its holder.",
  status: { reactions: hungry.reactions }, more: hungry.more,
  builds: "",
});
