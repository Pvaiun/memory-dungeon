/**
 * The thirteen offhand kinds' 104 pieces, by the weapon rules (steps/class-identity: Offhand kinds): each kind two or three
 * classes that all read its signature stat, every class two kinds. An offhand has no swing, so a kind is its stat profile, its
 * flavour and who shares it; every piece carries the standard budget of steps at its rarity (kit.ts), leaning to the profile.
 * `gear` joins the pack's gear and the rogue's stock; `statuses` the pack's statuses; `builds` is designer data, never in the pack.
 *
 * Each kind in the vocabulary's order: two commons, two uncommons, two rares, two legendaries. Every number is a word from scale.ts.
 * The hooks are the engine's primitives (PRIMITIVES.md). A heal given reads the healed ally as `owner`; a fallen unit gains no
 * status, so the Vial of the last breath marks itself when it stands again, and tests `lacks` on the fall. Marked, Heat and
 * Fervor are shared.ts's.
 */
import type { ConditionT, EffectT, EventSpecT, GearT, NumT, ReactionT, StatusT, TargetRuleT, ToT } from "../../../src/schema.js";
import { COOLDOWN, FLAT_STACKS, crit } from "../scale.js";
import { critStep, idOf, own, piece, pieceStatus, sp, st, type Build, type BuildTag, type Builds, type Change, type Rarity } from "./kit.js";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** "Every so often": the short cooldown word, the first beat halfway to it. */
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
  return [{ tag: "physical", pct: n }];
};
/** The holder hasn't spent its once-a-fight marker (dead or alive: a fallen holder reacting to its own fall asks with ko). */
const notYet = (marker: string, ko = false): ConditionT => ({ side: "self", where: { lacks: marker, ...(ko ? { ko: true } : {}) } });
/** A kill by one of the holder's hits, not by a status's tick: a `ko` it landed, of each kind a hit has. */
const killsByHit = (rest: Omit<ReactionT, "on">): ReactionT[] =>
  (["basic", "ability", "extra"] as const).map((kind) => ({ on: on("ko", { whose: "foe", other: "holder", kind }), ...rest }));

const R = {
  allies: { side: "allies", pick: "all" },
  foes: { side: "foes", pick: "all" },
  lowestShare: { side: "allies", pick: "lowest", by: "hp_share" },
  leastMp: { side: "allies", pick: "lowest", by: "mp_share" },
  mostDangerous: { side: "foes", pick: "highest", by: { stats: ["attack"] } },
  mostAggro: { side: "allies", pick: "highest", by: { stat: "aggro" } },
  fallen: { side: "allies", where: { ko: true }, pick: "random" },
} satisfies Record<string, TargetRuleT>;

/** Bookkeeping, a marker (neither buff nor debuff): once a fight, once a foe, a timer. Kept for the fight unless it says otherwise. */
const marker = (id: string, name: string, text: string, body: Partial<StatusT> = {}): StatusT =>
  ({ id, name, text, label: "marker", show: "sheet", stacking: "refresh", ...body }) as StatusT;
/** A status a piece gives another unit: a buff on the sheet, unremovable. */
const given = (id: string, name: string, text: string, body: Partial<StatusT>): StatusT =>
  ({ id, name, text, label: "buff", show: "sheet", stacking: "refresh", unremovable: true, ...body }) as StatusT;

/**
 * "Every so often": an 11-tick timer whose end brings the first beat and starts a pulse
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
/** A Builds line, as written ("Lockdown 2 ●●●, Landslide 2 ●●, Toll ●"): a build, its rung if named, and its worth. */
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

// ─── Kite shield (Knight, Paladin, Geomancer): Defense; HP, Aggro, Thorns, Attack ──

offhand("kite_shield", "common", "Pavise", { stats: [st("defense", 2)], says: "Defense +2.", builds: "Landslide 1 ●, Toll 1 ●" });
offhand("kite_shield", "common", "Banner kite", { stats: [st("max_hp", 1), st("aggro", 1)], says: "HP +1, Aggro +1.", builds: "Toll 1 ●, Landslide 1 ●" });
// A tenth less damage while Taunting, not a Shield at the start (Carapace charm's). Read live on each hit.
offhand("kite_shield", "uncommon", "Gatekeeper's kite", {
  stats: [st("defense", 1)], says: "Defense +1.", does: "While its holder Taunts, it takes a tenth less damage.",
  status: { taken: [{ pct: { scale: [{ ratio: -10, when: { has: "taunt" }, of: "holder" }] } }] },
  builds: "Toll 1 ●, Landslide 1 ●, Bonfire 1 ●",
});
offhand("kite_shield", "uncommon", "Sheltering kite", {
  stats: [st("max_hp", 1)], says: "HP +1.", does: "At the start of every fight, the ally with the lowest share of its HP is Guarded.",
  status: { reactions: [{ on: on("fight_start"), do: [apply("guard", R.lowestShare)] }] },
  builds: "Phoenix 1 ●, Pact 1 ●, Bonfire 1 ●",
});
// A Shield emptied by a foe's damage ends (cause stacks) naming that foe as its other.
offhand("kite_shield", "rare", "Rubble shield", {
  stats: [st("defense", 1)], says: "Defense +1.", does: "When its holder's Shield breaks, the foe whose blow broke it is Stunned.",
  status: { reactions: [{ on: on("status_ended", { status: "shield", cause: ["stacks"], other: "foe" }), do: [apply("stun", "other")] }] },
  builds: "Lockdown 2 ●●●, Landslide 2 ●●, Toll ●",
});
offhand("kite_shield", "rare", "Humbling shield", {
  stats: [st("max_hp", 1)], says: "HP +1.", does: "The first time each foe hits its holder, that foe is Weakened.",
  status: { reactions: [{ on: on("hit_taken"), if: { unit: "other", where: { lacks: "humbling_shield_humbled" } }, do: [apply("weaken", "other"), apply("humbling_shield_humbled", "other")] }] },
  more: [marker("humbling_shield_humbled", "Humbled", "Already Weakened by a Humbling shield this fight.")],
  builds: "Toll 2 ●●●, Lockdown ●●, Pact ●",
});
// Thorns read live from Defense (a `live` stat change), so Guard counts the moment it lands.
offhand("kite_shield", "legendary", "Spiked bulwark", {
  stats: [st("defense", 1)], says: "Defense +1.", does: "Thorns from its holder's Defense: each foe that hits it takes a twentieth of its Defense back.",
  status: { stats: [{ stat: "thorns", flat: { scale: [{ ratio: 0.05, stat: "defense", of: "holder" }] }, live: true }] },
  builds: "Toll 3 ●●●, Landslide 3 ●●●",
});
offhand("kite_shield", "legendary", "Oathbound shield", {
  stats: [st("max_hp", 1)], says: "HP +1.", does: "When a hit would deal an ally more than a quarter of its max HP, its holder takes the hit instead.",
  status: { cover: { share: 25 } },
  builds: "Toll 2 ●●, Bonfire 2 ●●, Phoenix ●●, Lockdown ●",
});

// ─── Round shield (Hoplite, Bramble knight, Valkyrie): HP; Defense, Attack, Aggro, Crit chance ──

offhand("round_shield", "common", "Bronze buckler", { stats: [st("defense", 1), st("attack", 1)], says: "Defense +1, Attack +1.", builds: "Landslide 1 ●, Hunt 1 ●" });
offhand("round_shield", "common", "Linden shield", { stats: [st("max_hp", 2)], says: "HP +2.", builds: "Toll 1 ●, Pact 1 ●" });
offhand("round_shield", "uncommon", "Comrade's targe", {
  stats: [st("defense", 1)], says: "Defense +1.", does: "At the start of every fight, the other ally with the highest Aggro is Guarded.",
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
  stats: [st("defense", 1)], says: "Defense +1.", does: "Whenever its holder is Guarded, so is the other ally lowest in HP share that isn't Guarded yet.",
  status: { reactions: [{ on: on("status_gained", { status: "guard" }), do: [apply("guard", { side: "others", where: { lacks: "guard" }, pick: "lowest", by: "hp_share" })] }] },
  builds: "Toll 2 ●●, Bonfire ●●, Landslide ●",
});
offhand("round_shield", "rare", "Hunter's buckler", {
  stats: [st("attack", 1)], says: "Attack +1.", does: "When its holder's hit fells a foe, it gains Haste and a Shield.",
  status: { reactions: killsByHit({ do: [apply("haste", "holder"), apply("shield", "holder", share(0.15, "max_hp", "holder"))] }) },
  builds: "Hunt 2 ●●, Ambush ●",
});
// A `lower` test: the aura goes to allies with less Defense than the holder when the fight starts and whenever one of them (or the
// holder) is revived; it ends with the holder.
const phalanxAura: ReactionT["do"] = [apply("phalanx_shield_aura", { side: "others", where: { lower: { stat: "defense" } }, pick: "all" })];
offhand("round_shield", "legendary", "Phalanx shield", {
  stats: [st("max_hp", 1)], says: "HP +1.", does: "While its holder stands, allies with less Defense than it take a fifth less damage. Its holder deals a fifth less.",
  status: {
    boosts: [{ tag: "physical", pct: -20 }],
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
  stats: [st("max_hp", 1)], says: "HP +1.", does: "Once a fight, when another ally falls, its holder raises it at once with a tenth of its HP.",
  status: {
    reactions: [{
      on: on("ko", { whose: "ally" }), if: notYet("shield_of_the_chosen_spent"),
      do: [{ op: "revive", hp: share(0.1, "max_hp", "target"), to: { side: "others", where: { ko: true }, pick: "random" } }, apply("shield_of_the_chosen_spent", "holder")],
    }],
  },
  more: [marker("shield_of_the_chosen_spent", "Shield of the chosen (spent)", "Its raise is spent this fight.")],
  builds: "Phoenix 3 ●●●",
});

// ─── Horn (Knight, Hoplite): Aggro; HP, Defense, Attack, MP regen ────────────

offhand("horn", "common", "Ram's horn", { stats: [st("aggro", 1), st("attack", 1)], says: "Aggro +1, Attack +1.", builds: "Toll 1 ●, Landslide 1 ●" });
offhand("horn", "common", "Ivory horn", { stats: [st("mp_regen", 1), st("attack", 1)], says: "MP regen +1, Attack +1.", builds: "Overflow 1 ●, Harvest 1 ●" });
offhand("horn", "uncommon", "Reveille", {
  stats: [st("attack", 1)], says: "Attack +1.", does: "At the start of every fight, the ally with the least MP gains Clarity.",
  status: { reactions: [{ on: on("fight_start"), do: [apply("clarity", R.leastMp)] }] },
  builds: "Overflow 1 ●, Lockdown 1 ●, Bonfire 1 ●",
});
// Haste on the first kill, not a Taunt at the start (Clarion blade's).
offhand("horn", "uncommon", "Bull's horn", {
  stats: [st("attack", 1)], says: "Attack +1.", does: "The first time in a fight that a foe falls, every ally is Hasted.",
  status: { reactions: [{ on: on("ko", { whose: "foe" }), if: notYet("bulls_horn_rung"), do: [apply("haste", R.allies), apply("bulls_horn_rung", "holder")] }] },
  more: [marker("bulls_horn_rung", "Bull's horn (rung)", "It has rung this fight.")],
  builds: "Hunt 1 ●, Cuts 1 ●, Ambush 1 ●",
});
// By `swing`: the slowest basic attack is the highest.
offhand("horn", "rare", "War horn", {
  stats: [st("aggro", 1)], says: "Aggro +1.", does: "At the start of every fight, the ally with the slowest basic attack gains many Might.",
  status: { reactions: [{ on: on("fight_start"), do: [apply("might", { side: "allies", pick: "highest", by: "swing" }, FLAT_STACKS.many)] }] },
  builds: "Landslide 2 ●●●, Ambush 2 ●●",
});
const echo: EffectT[] = [{ op: "mp", amount: share(0.05, "max_mp", "target"), to: R.leastMp }];
offhand("horn", "rare", "Echo horn", {
  stats: [st("mp_regen", 1)], says: "MP regen +1.", does: "Each time an ally finishes casting an ability, the ally with the least MP gains a little MP.",
  status: { reactions: [{ on: on("action_resolve", { kind: "ability" }), do: echo }, { on: on("action_resolve", { whose: "ally", kind: "ability" }), do: echo }] },
  builds: "Overflow 2 ●●●, Lockdown ●, Bonfire ●",
});
// Every ally's basic attack ready at once; the holder's abilities on their full cooldowns.
offhand("horn", "legendary", "Horn of the charge", {
  stats: [st("max_hp", 1)], says: "HP +1.", does: "At the start of every fight, every ally is Hasted and its first action comes at once. Its holder starts every fight with every ability on cooldown.",
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
  stats: [st("defense", 1)], says: "Defense +1.", does: "When an ally falls (its holder too), every ally still standing gains Haste and a Shield. When an ally is revived, it gains many Might.",
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

// ─── Tome (Bard, Hexer, Frostweaver): Cooldown; Attack, MP, MP regen, Cast speed ──

offhand("tome", "common", "Scholar's codex", { stats: [st("attack", 2)], says: "Attack +2.", builds: "Snap 1 ●, Harvest 1 ●" });
offhand("tome", "common", "Hymnal", { stats: [sp("cooldown", "medium"), st("mp_regen", 1)], says: "Cooldown medium, MP regen +1.", builds: "Overflow 1 ●" });
offhand("tome", "uncommon", "Snowbound folio", {
  stats: [st("attack", 1)], says: "Attack +1.", does: "At the start of every fight, every foe gains a few Chill.",
  status: { reactions: [{ on: on("fight_start"), do: [apply("chill", R.foes, own("few", "attack"))] }] },
  builds: "Snap 1 ●, Lockdown 1 ●, Ambush 1 ●",
});
offhand("tome", "uncommon", "Abridged lexicon", {
  stats: [st("max_mp", 1)], says: "MP +1.", does: "Its holder's abilities cost a tenth less MP.",
  status: { mods: [{ mp: -10 }] },
  builds: "Overflow 1 ●, Lockdown 1 ●, Harvest 1 ●",
});
// A boost on its Chill that reads the foe receiving it, a quarter for every four stacks held (6.25% a stack). "One more stack
// for every four" would be an absolute add, which no field gives, so the card says it as the engine does.
offhand("tome", "rare", "Primer of frost", {
  stats: [sp("cooldown", "medium")], says: "Cooldown medium.", does: "Each time its holder adds Chill to a foe, it adds a quarter more for every four stacks the foe already holds.",
  status: { boosts: [{ tag: "chill", pct: { scale: [{ ratio: 6.25, stacks: "chill", of: "target" }] } }] },
  builds: "Snap 2 ●●●",
});
// The `area` tag: hits of a damage effect aimed at every foe. A boost names one tag, so this reaches every area hit the holder
// lands; among tome holders those are abilities (an area basic attack only comes from a formation's seat).
offhand("tome", "rare", "Treatise on the field", {
  stats: [st("attack", 1)], says: "Attack +1.", does: "Its holder's abilities that hit every foe deal half again as much to each foe above half its HP.",
  status: { boosts: [{ tag: "area", pct: { scale: [{ ratio: 50, when: { hpAtLeast: 50 }, of: "target" }] } }] },
  builds: "Harvest 2 ●●●",
});
// Untyped damage of all its HP and Shield: not a hit, and nothing reacts to it as one. Every fall it causes checks again.
offhand("tome", "legendary", "Last page", {
  stats: [st("attack", 1)], says: "Attack +1.", does: "When a foe falls, every foe below a tenth of its HP falls too.",
  status: {
    reactions: [{
      on: on("ko", { whose: "foe" }),
      do: [{ op: "damage", type: "none", amount: { scale: [{ ratio: 1, hp: "current", of: "target" }, { ratio: 1, stacks: "shield", of: "target" }] }, to: { side: "foes", where: { hpBelow: 10 }, pick: "all" } }],
    }],
  },
  builds: "Harvest 3 ●●●, Snap ●●, Bonfire ●",
});
// The `amountAtLeast` filter: only a cast that paid MP makes a free one, so a cast it made free doesn't make another. The
// token is a marker, so no Dispel takes it; any ally's next ability spends every copy.
offhand("tome", "legendary", "Annotated grimoire", {
  stats: [sp("cooldown", "medium")], says: "Cooldown medium.", does: "Each ability its holder pays for makes the next ability any ally casts free.",
  status: { reactions: [{ on: on("action_resolve", { kind: "ability", amountAtLeast: 1 }), do: [apply("annotated_grimoire_free", R.allies)] }] },
  more: [marker("annotated_grimoire_free", "Free cast", "Its next ability costs no MP.", {
    mods: [{ mp: -100 }],
    reactions: [{ on: on("action_resolve", { kind: "ability" }), do: [{ op: "remove", label: "marker", status: "annotated_grimoire_free", to: R.allies }] }],
  })],
  builds: "Overflow 3 ●●●, Lockdown ●●",
});

// ─── Lantern (Cleric, Pyromancer): Cast speed; Attack, MP, HP, Cooldown ────────

offhand("lantern", "common", "Brass lantern", { stats: [st("attack", 1), st("max_hp", 1)], says: "Attack +1, HP +1.", builds: "Bonfire 1 ●, Harvest 1 ●" });
offhand("lantern", "common", "Hooded lantern", { stats: [st("max_mp", 1), sp("cast_speed", "medium")], says: "MP +1, Cast speed medium.", builds: "Overflow 1 ●, Bonfire 1 ●" });
offhand("lantern", "uncommon", "Pitch lantern", {
  stats: [st("attack", 1)], says: "Attack +1.", does: "At the start of every fight, every foe gains a few Burn.",
  status: { reactions: [{ on: on("fight_start"), do: [apply("burn", R.foes, own("few", "attack"))] }] },
  builds: "Bonfire 1 ●, Harvest 1 ●, Ambush 1 ●",
});
// A Weaken at the start, not a Ward at the start (the rune sword's and the mace's).
offhand("lantern", "uncommon", "Dazzling lantern", {
  stats: [st("max_hp", 1)], says: "HP +1.", does: "At the start of every fight, the foe with the highest Attack is Weakened.",
  status: { reactions: [{ on: on("fight_start"), do: [apply("weaken", R.mostDangerous)] }] },
  builds: "Bonfire 1 ●, Toll 1 ●, Lockdown 1 ●",
});
// Reads the foe's Burn: under one stack on a foe that holds none, nothing lands, so it needs no test.
offhand("lantern", "rare", "Bellows lantern", {
  stats: [sp("cast_speed", "medium")], says: "Cast speed medium.", does: "Each hit its holder lands on a burning foe adds Burn: a tenth of what the foe holds.",
  status: { reactions: [{ on: on("hit_lands"), do: [apply("burn", "other", { scale: [{ ratio: 0.1, stacks: "burn", of: "target" }] })] }] },
  builds: "Bonfire 2 ●●●",
});
// The `notTags: [area]` filter: an ability aimed at every foe would mark them all, which marks nothing.
offhand("lantern", "rare", "Signal lantern", {
  stats: [st("attack", 1)], says: "Attack +1.", does: "A foe its holder hits with an ability is Marked. Abilities that hit every foe don't Mark.",
  status: { reactions: [{ on: on("hit_lands", { kind: "ability", notTags: ["area"] }), do: [apply("marked", "other")] }] },
  builds: "Hunt 2 ●●, Bonfire ●●",
});
// A foe's statuses end (cause ko) just before its ko, carrying the stacks they held.
offhand("lantern", "legendary", "Wick", {
  stats: [sp("cast_speed", "medium")], says: "Cast speed medium.", does: "When a burning foe falls, all its Burn passes to the foe with the most HP, and its holder gains Heat.",
  status: {
    reactions: [{
      on: on("status_ended", { whose: "foe", status: "burn", cause: ["ko"] }),
      do: [apply("burn", { side: "foes", pick: "highest", by: "hp" }, ofAmount(1)), apply("heat", "holder", FLAT_STACKS.few)],
    }],
  },
  builds: "Bonfire 3 ●●●",
});
// Only a standing holder's lamp acts: its status doesn't survive a fall.
offhand("lantern", "legendary", "Lamp of vigil", {
  stats: [st("max_hp", 1)], says: "HP +1.", does: "After each won fight, one fallen ally stands up with a quarter of its HP.",
  status: { reactions: [{ on: on("fight_won"), do: [{ op: "revive", hp: share(0.25, "max_hp", "target"), to: R.fallen }] }] },
  builds: "Phoenix 2 ●●●, Pact ●",
});

// ─── Relic (Cleric, Paladin): MP regen; HP, Attack, Cast speed, Defense ─────────

offhand("relic", "common", "Shrine token", { stats: [st("mp_regen", 2)], says: "MP regen +2.", builds: "Overflow 1 ●, Phoenix 1 ●" });
offhand("relic", "common", "Blessed knot", { stats: [st("attack", 1), st("max_hp", 1)], says: "Attack +1, HP +1.", builds: "Pact 1 ●, Phoenix 1 ●" });
// A heal given: `healed` with the holder as its other; the healed ally is the owner.
const healGiven = (extra: Omit<EventSpecT, "event"> = {}) => on("healed", { whose: "any", other: "holder", ...extra });
offhand("relic", "uncommon", "Holy water", {
  stats: [st("attack", 1)], says: "Attack +1.", does: "Each time one of its holder's abilities heals an ally, it also lifts one debuff from that ally.",
  status: { reactions: [{ on: healGiven({ kind: "ability" }), do: [{ op: "remove", label: "debuff", count: 1, to: "owner" }] }] },
  builds: "Pact 1 ●, Toll 1 ●, Phoenix 1 ●",
});
// A mend on each fall, not a Regen at the start (Mender's mace's).
offhand("relic", "uncommon", "Charnel icon", {
  stats: [st("mp_regen", 1)], says: "MP regen +1.", does: "Each time a foe falls, the ally with the lowest share of its HP is healed a little.",
  status: { reactions: [{ on: on("ko", { whose: "foe" }), do: [{ op: "heal", amount: share(0.06, "max_hp", "target"), to: R.lowestShare }] }] },
  builds: "Hunt 1 ●, Pact 1 ●, Phoenix 1 ●",
});
offhand("relic", "rare", "Saint's knucklebone", {
  stats: [st("mp_regen", 1)], says: "MP regen +1.", does: "Each time one of its holder's abilities heals an ally, that ally gains a few Might.",
  status: { reactions: [{ on: healGiven({ kind: "ability" }), do: [apply("might", "owner", own("few", "attack"))] }] },
  builds: "Pact 2 ●●●, Phoenix ●, Toll ●",
});
// An MP and wind-up change on its abilities that revive.
offhand("relic", "rare", "Reliquary of mercy", {
  stats: [sp("cast_speed", "medium")], says: "Cast speed medium.", does: "Its holder's revives cost half their MP and wind up in a moment.",
  status: { mods: [{ of: { does: ["revive"] }, mp: -50, cast: 1 }] },
  builds: "Phoenix 2 ●●●, Ambush ●",
});
// Overhealing from every heal the holder gives, its Lifesteal and the Regens it applied included.
offhand("relic", "legendary", "Phylactery", {
  stats: [st("max_hp", 1)], says: "HP +1.", does: "The part of its holder's heals that would go past full becomes a Shield on the healed ally.",
  status: { reactions: [{ on: on("overhealed", { whose: "any", other: "holder" }), do: [apply("shield", "owner", ofAmount(1))] }] },
  builds: "Pact 3 ●●●, Landslide ●●, Phoenix ●●",
});
// A reviver's rule: it wins over the Einherjar version's readiness.
offhand("relic", "legendary", "Bones of the returned", {
  stats: [st("mp_regen", 1)], says: "MP regen +1.", does: "Allies its holder revives come back with all their HP, and with every ability on full cooldown.",
  status: { revives: { ready: false, hp: share(1, "max_hp", "target") } },
  builds: "Phoenix 3 ●●, Pact ●",
});

// ─── Bell (Bard, Monk, Stormcaller): Attack speed; Attack, Evasion, Double strike, MP regen ──

offhand("bell", "common", "Temple bell", { stats: [sp("evasion", "medium"), st("attack", 1)], says: "Evasion medium, Attack +1.", builds: "Cuts 1 ●, Toll 1 ●" });
offhand("bell", "common", "Prayer bell", { stats: [sp("attack_speed", "medium"), st("attack", 1)], says: "Attack speed medium, Attack +1.", builds: "Cuts 1 ●, Harvest 1 ●" });
// A dodge that pays, not a Haste at the start (the fist weapons').
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
// By `swing`, the slowest first. No fallback when every other ally is Hasted, so two Tempo bells can't pass Haste back and forth.
offhand("bell", "rare", "Tempo bell", {
  stats: [sp("attack_speed", "medium")], says: "Attack speed medium.", does: "Each time its holder gains Haste, the other ally with the slowest basic attack that isn't Hasted gains it too.",
  status: { reactions: [{ on: on("status_gained", { status: "haste" }), do: [apply("haste", { side: "others", where: { lacks: "haste" }, pick: "highest", by: "swing" })] }] },
  builds: "Cuts 2 ●●●, Overflow ●",
});
const warding = everySoOften("warding_bell", "Warding bell", [{ op: "remove", label: "debuff", count: 1, to: { side: "allies", where: { debuffs: true }, pick: "highest", by: "debuffs" } }]);
offhand("bell", "rare", "Warding bell", {
  stats: [st("mp_regen", 1)], says: "MP regen +1.", does: "Every so often, it lifts one debuff from the ally holding the most.",
  status: { reactions: warding.reactions }, more: warding.more,
  builds: "Toll 2 ●●, Lockdown ●, Pact ●",
});
// The ability with the `longest` cooldown left: 5 ticks closer each beat.
const hour = everySoOften("bell_of_the_hour", "Bell of the hour", [{ op: "cooldown", which: "longest", set: { less: 5 }, to: "holder" }]);
offhand("bell", "legendary", "Bell of the hour", {
  stats: [sp("attack_speed", "medium")], says: "Attack speed medium.", does: "Every so often, its holder's ability with the longest cooldown left comes a few ticks closer.",
  status: { reactions: hour.reactions }, more: hour.more,
  builds: "Overflow 3 ●●, Lockdown 3 ●●, Cuts ●",
});
// It survives its holder's fall, so it rings for that fall too; once down, it's silent until its holder is revived.
offhand("bell", "legendary", "Funeral bell", {
  stats: [st("attack", 1)], says: "Attack +1.", does: "When any unit falls, friend or foe, every ally still standing gains Fervor. It rings for its holder's own fall too.",
  status: { survivesKO: true, reactions: [{ on: on("ko", { whose: "any" }), do: [apply("fervor", R.allies, FLAT_STACKS.one)] }] },
  builds: "Phoenix 3 ●●●, Hunt ●●, Harvest ●",
});

// ─── Totem (Bramble knight, Stormcaller): Thorns; Defense, Aggro, HP, Attack ────

offhand("totem", "common", "Standing stone", { stats: [st("defense", 2)], says: "Defense +2.", builds: "Landslide 1 ●, Toll 1 ●" });
offhand("totem", "common", "Hawthorn fetish", { stats: [st("attack", 1), sp("thorns", "medium")], says: "Attack +1, Thorns medium.", builds: "Toll 1 ●, Hunt 1 ●" });
// The Thorns are the fight's: they survive the ally's fall, so a revived ally still has them.
offhand("totem", "uncommon", "Spinebark pole", {
  stats: [st("defense", 1)], says: "Defense +1.", does: "At the start of every fight, the ally with the highest Aggro gains Thorns for the fight.",
  status: { reactions: [{ on: on("fight_start"), do: [apply("spinebark_pole_thorns", R.mostAggro)] }] },
  more: [given("spinebark_pole_thorns", "Spinebark", "Thorns up for the fight.", { survivesKO: true, stats: [{ stat: "thorns", flat: sp("thorns", "medium").flat }] })],
  builds: "Toll 1 ●, Landslide 1 ●, Harvest 1 ●",
});
// Plate keeps the holder's own Guard below half; the totem's goes to the first ally to drop below half. A reaction's `if` tests the owner.
const bear: Omit<ReactionT, "on"> = { if: [{ unit: "owner", where: { hpBelow: 50 } }, notYet("bear_fetish_spent")], do: [apply("guard", "owner"), apply("bear_fetish_spent", "holder")] };
offhand("totem", "uncommon", "Bear fetish", {
  stats: [st("attack", 1)], says: "Attack +1.", does: "The first ally to drop below half its HP each fight is Guarded.",
  status: { reactions: [{ on: on("hp_lost"), ...bear }, { on: on("hp_lost", { whose: "ally" }), ...bear }] },
  more: [marker("bear_fetish_spent", "Bear fetish (spent)", "Its Guard is spent this fight.")],
  builds: "Toll 1 ●, Pact 1 ●, Phoenix 1 ●",
});
offhand("totem", "rare", "Briar totem", {
  stats: [sp("thorns", "medium")], says: "Thorns medium.", does: "Foes that hit its holder gain a few Bleed.",
  status: { reactions: [{ on: on("hit_taken"), do: [apply("bleed", "other", own("few", "defense"))] }] },
  builds: "Toll 2 ●●●, Cuts ●",
});
offhand("totem", "rare", "Stone totem", {
  stats: [st("defense", 1)], says: "Defense +1.", does: "Its holder starts every fight behind a Shield from its Defense.",
  status: { reactions: [{ on: on("fight_start"), do: [apply("shield", "holder", { scale: [{ ratio: 0.5, stat: "defense", of: "holder" }] })] }] },
  builds: "Landslide 2 ●●●, Ambush ●●",
});
/**
 * No stat changes the Shields a unit receives, so the third larger is an aura on every ally, ending with the holder, whose boost
 * on Shield makes the Shields that ally gives a third larger. Every Shield the party gains is given by one of its own, so it reads
 * as the card says. The Shield keeps its own cap.
 */
const earthmotherAura: ReactionT["do"] = [apply("earthmother_totem_aura", R.allies)];
const brokenShield = (whose: "holder" | "ally"): ReactionT => ({ on: on("status_ended", { whose, status: "shield", cause: ["stacks"] }), do: [apply("might", "owner", FLAT_STACKS.few)] });
offhand("totem", "legendary", "Earthmother totem", {
  stats: [st("max_hp", 1)], says: "HP +1.", does: "While its holder stands, every Shield an ally gains is a third larger. When an ally's Shield breaks, that ally gains a few Might.",
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
// The live wire: a hit on its holder shocks the whole field (one stack each, flat, so a swarm pays as a boss does).
offhand("totem", "legendary", "Thunderhead totem", {
  stats: [st("aggro", 1)], says: "Aggro +1.", does: "Each hit its holder takes adds a Shock to every foe.",
  status: { reactions: [{ on: on("hit_taken"), do: [apply("shock", R.foes, FLAT_STACKS.one)] }] },
  builds: "Toll 3 ●●●, Harvest ●●",
});

// ─── Vial (Vampire, Assassin): Lifesteal; Attack, Crit chance, Crit damage, HP ──

offhand("vial", "common", "Red tincture", { stats: [sp("lifesteal", "medium"), st("attack", 1)], says: "Lifesteal medium, Attack +1.", builds: "Pact 1 ●, Cuts 1 ●" });
offhand("vial", "common", "Hemlock phial", { stats: [critStep(1), st("attack", 1)], says: "Crit +1, Attack +1.", builds: "Ambush 1 ●, Hunt 1 ●, Cuts 1 ●" });
offhand("vial", "uncommon", "Clotting salve", {
  stats: [critStep(1)], says: "Crit +1.", does: "Its holder's crits heal it for a fifth of the damage they deal.",
  status: { reactions: [{ on: on("hit_lands", { tags: ["crit"] }), do: [{ op: "heal", amount: ofAmount(0.2), to: "self" }] }] },
  builds: "Pact 1 ●, Ambush 1 ●, Hunt 1 ●",
});
// Lifesteal medium on hits against a bleeding foe, on top of any Lifesteal. A reaction's `if` tests the foe hit.
offhand("vial", "uncommon", "Crimson dregs", {
  stats: [st("attack", 1)], says: "Attack +1.", does: "Its holder's hits on a bleeding foe heal it for a share of their damage.",
  status: { reactions: [{ on: on("hit_lands"), if: { unit: "other", where: { has: "bleed" } }, do: [{ op: "heal", amount: ofAmount(sp("lifesteal", "medium").flat / 100), to: "self" }] }] },
  builds: "Pact 1 ●, Cuts 1 ●, Toll 1 ●",
});
// Half the MP, and an HP price equal to the full cost, never below 1.
offhand("vial", "rare", "Blood vial", {
  stats: [st("max_hp", 1)], says: "HP +1.", does: "Its holder's abilities cost half their MP, plus HP equal to their full cost. The HP price never takes it below 1 HP.",
  status: { mods: [{ mp: -50, hp: { pct: 100 } }] },
  builds: "Pact 2 ●●●, Phoenix ●",
});
// A crit rule: two crit steps on a bleeding foe.
offhand("vial", "rare", "Venom vial", {
  stats: [sp("crit_damage", "medium")], says: "Crit damage medium.", does: "Its holder's crits add several Bleed, and it crits more often on a bleeding foe.",
  status: { reactions: [{ on: on("hit_lands", { tags: ["crit"] }), do: [apply("bleed", "other", own("several", "attack"))] }], crits: [{ when: { has: "bleed" }, chance: crit(2) }] },
  builds: "Cuts 2 ●●, Hunt ●●, Ambush ●",
});
// A revive on a timer. A fallen unit gains no status, so it marks itself when its own return stands it up (a revive it gave
// itself, not an ally's Raise), and tests `lacks` on the fall.
offhand("vial", "legendary", "Vial of the last breath", {
  stats: [st("max_hp", 1)], says: "HP +1.", does: "Once a fight, when its holder falls, it stands up a few ticks later with a third of its HP.",
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
// It pays down to half at the fight's start (an HP price, not damage). The doubling is Bloodlust's own pattern, so on the Vampire the two multiply.
offhand("vial", "legendary", "Bloodlust draught", {
  stats: [sp("lifesteal", "medium")], says: "Lifesteal medium.", does: "Its holder starts every fight at half its HP (it pays), and its Lifesteal is doubled until it's full.",
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

// ─── Idol (Hexer, Vampire): Siphon; Attack, HP, MP, Lifesteal ──────────────────

offhand("idol", "common", "Night mask", { stats: [sp("siphon", "medium"), st("attack", 1)], says: "Siphon medium, Attack +1.", builds: "Overflow 1 ●, Pact 1 ●" });
offhand("idol", "common", "Carved effigy", { stats: [st("max_hp", 2)], says: "HP +2.", builds: "Pact 1 ●, Toll 1 ●" });
offhand("idol", "uncommon", "Carrion idol", {
  stats: [st("attack", 1)], says: "Attack +1.", does: "When its holder's hit fells a foe, it regains MP.",
  status: { reactions: killsByHit({ do: [{ op: "mp", amount: share(0.15, "max_mp", "holder"), to: "holder" }] }) },
  builds: "Hunt 1 ●, Overflow 1 ●",
});
// Rot on crits, not a small Siphon on crits (that would be a small Leech idol).
offhand("idol", "uncommon", "Fanged idol", {
  stats: [sp("lifesteal", "medium")], says: "Lifesteal medium.", does: "Its holder's crits Rot their target.",
  status: { reactions: [{ on: on("hit_lands", { tags: ["crit"] }), do: [apply("rot", "other")] }] },
  builds: "Hunt 1 ●, Pact 1 ●",
});
// The Weaken on swings is the Hexer's own now (Withering hex); the idol pays for a Weakened foe.
offhand("idol", "rare", "Withering idol", {
  stats: [st("attack", 1)], says: "Attack +1.", does: "Its holder's hits on a Weakened foe deal a third more.",
  status: { boosts: vs(33, { has: "weaken" }) },
  builds: "Toll 2 ●●, Lockdown 2 ●●, Pact ●",
});
/**
 * While its holder's MP is full (a reaction's `if`), what its Siphon drains goes to the ally with the least MP. Siphon's
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
// A Weaken the holder applied (`other: holder` on the foe's status_gained). Slow at its own length outlasts the Weaken by 4.
offhand("idol", "legendary", "Idol of binding", {
  stats: [sp("siphon", "medium")], says: "Siphon medium.", does: "Foes its holder Weakens are also Slowed, and its hits on a foe that's both deal double.",
  status: {
    reactions: [{ on: on("status_gained", { whose: "foe", status: "weaken", other: "holder" }), do: [apply("slow", "owner")] }],
    boosts: vs(100, { has: ["weaken", "slow"] }),
  },
  builds: "Lockdown 3 ●●●, Toll ●●",
});
// The newest buff a foe can lose, moved (`move`) with its stacks and time left. Unremovable buffs (passives, Hidden) stay.
const hungry = everySoOften("idol_of_the_hungry_dark", "Idol of the hungry dark", [{ op: "remove", label: "buff", count: 1, move: true, to: { side: "foes", where: { buffs: true }, pick: "random" } }]);
offhand("idol", "legendary", "Idol of the hungry dark", {
  stats: [st("max_mp", 1)], says: "MP +1.", does: "Every so often, it takes one buff from a foe and gives it to its holder.",
  status: { reactions: hungry.reactions }, more: hungry.more,
  builds: "",
});

// ─── Orb (Pyromancer, Frostweaver): MP; Attack, MP regen, Cast speed, Cooldown ─────
// The mages' MP: for the dearest spells in the set.

offhand("orb", "common", "Glass orb", { stats: [st("max_mp", 2)], says: "MP +2.", builds: "Overflow 1 ●, Bonfire 1 ●" });
offhand("orb", "common", "Ember orb", { stats: [st("attack", 1), sp("cast_speed", "medium")], says: "Attack +1, Cast speed medium.", builds: "Bonfire 1 ●, Snap 1 ●" });
// `soonest`: the ability with the least cooldown left that isn't ready yet.
offhand("orb", "uncommon", "Scrying orb", {
  stats: [st("max_mp", 1)], says: "MP +1.", does: "At the start of every fight, its holder's ability nearest to ready comes at once.",
  status: { reactions: [{ on: on("fight_start"), do: [{ op: "cooldown", which: "soonest", set: "ready", to: "holder" }] }] },
  builds: "Ambush 1 ●, Overflow 1 ●, Snap 1 ●",
});
offhand("orb", "uncommon", "Mana pearl", {
  stats: [st("mp_regen", 1)], says: "MP regen +1.", does: "Each time a foe falls, its holder regains 8% of its max MP.",
  status: { reactions: [{ on: on("ko", { whose: "foe" }), do: [{ op: "mp", amount: share(0.08, "max_mp", "holder"), to: "holder" }] }] },
  builds: "Overflow 1 ●, Harvest 1 ●, Bonfire 1 ●",
});
offhand("orb", "rare", "Orb of the long winter", {
  stats: [sp("cooldown", "medium")], says: "Cooldown medium.", does: "When a foe's Chill shatters, its holder's ability with the longest cooldown left comes 8 ticks closer.",
  status: { reactions: [{ on: on("status_capped", { status: "chill", whose: "foe" }), do: [{ op: "cooldown", which: "longest", set: { less: 8 }, to: "holder" }] }] },
  builds: "Snap 2 ●●●, Lockdown ●",
});
offhand("orb", "rare", "Smouldering orb", {
  stats: [st("attack", 1)], says: "Attack +1.", does: "When a burning foe falls, every other foe gains a few Burn (from its holder's Attack).",
  status: { reactions: [{ on: on("status_ended", { whose: "foe", status: "burn", cause: ["ko"] }), do: [apply("burn", { side: "foes", pick: "all", exclude: "owner" }, own("few", "attack"))] }] },
  builds: "Bonfire 2 ●●●, Harvest ●●",
});
// Free while it holds Clarity: the deep calm's far end.
offhand("orb", "legendary", "The deep well", {
  stats: [st("max_mp", 1)], says: "MP +1.", does: "While its holder holds Clarity, its abilities cost no MP.",
  status: { mods: [{ mp: -100, if: { has: "clarity" } }] },
  builds: "Overflow 3 ●●●, Snap ●●",
});
// Once a fight: the first ordinary cast resolves again (a recast); the marker is spent by it.
offhand("orb", "legendary", "Orb of the second sun", {
  stats: [sp("cast_speed", "medium")], says: "Cast speed medium.", does: "The first ability its holder casts each fight is cast twice; the second cast is free.",
  status: { reactions: [{ on: on("fight_start"), do: [apply("orb_of_the_second_sun_ready", "holder")] }] },
  more: [marker("orb_of_the_second_sun_ready", "Second sun", "Its next ability is cast twice.", {
    reactions: [{ on: on("action_resolve", { kind: "ability", repeat: false }), do: [{ op: "recast" }, { op: "remove", label: "marker", status: "orb_of_the_second_sun_ready", to: "holder" }] }],
  })],
  builds: "Bonfire 3 ●●, Harvest 3 ●●, Overflow ●●",
});

// ─── Trophy (Ranger, Assassin, Geomancer): Crit damage; Crit chance, Attack, Accuracy, Defense ──
// A pelt, a skull, a geode: the crit hunters'.

offhand("trophy", "common", "Wolf pelt", { stats: [sp("crit_damage", "medium"), critStep(1)], says: "Crit damage medium, Crit chance +1.", builds: "Hunt 1 ●, Ambush 1 ●" });
offhand("trophy", "common", "Geode", { stats: [st("defense", 1), st("attack", 1)], says: "Defense +1, Attack +1.", builds: "Landslide 1 ●, Hunt 1 ●" });
offhand("trophy", "uncommon", "Hunter's skull", {
  stats: [critStep(1)], says: "Crit chance +1.", does: "Each killing blow its holder lands adds a Heat (+3% damage a stack, up to 15) for the rest of the fight.",
  status: { reactions: killsByHit({ do: [apply("heat", "holder", FLAT_STACKS.one)] }) },
  builds: "Hunt 1 ●, Ambush 1 ●",
});
offhand("trophy", "uncommon", "Eagle feather", {
  stats: [sp("accuracy", "medium")], says: "Accuracy medium.", does: "Its holder's crits Slow their target.",
  status: { reactions: [{ on: on("hit_lands", { tags: ["crit"] }), do: [apply("slow", "other")] }] },
  builds: "Lockdown 1 ●, Hunt 1 ●",
});
offhand("trophy", "rare", "Ogre's tusk", {
  stats: [sp("crit_damage", "medium")], says: "Crit damage medium.", does: "Its holder's hits on a foe above half its HP deal a third more.",
  status: { boosts: vs(33, { hpAtLeast: 50 }) },
  builds: "Ambush 2 ●●●, Landslide ●●",
});
offhand("trophy", "rare", "Giant's knucklebone", {
  stats: [st("defense", 1)], says: "Defense +1.", does: "Its holder's crits Guard it.",
  status: { reactions: [{ on: on("hit_lands", { tags: ["crit"] }), do: [apply("guard", "holder")] }] },
  builds: "Landslide 2 ●●●, Toll ●",
});
// The crit's follow-through is untyped: past Defense.
offhand("trophy", "legendary", "Dragon's tooth", {
  stats: [sp("crit_damage", "medium")], says: "Crit damage medium.", does: "Its holder's crits strike again for a third of their damage, past Defense.",
  status: { reactions: [{ on: on("hit_lands", { tags: ["crit"] }), do: [{ op: "damage", type: "none", amount: ofAmount(1 / 3), to: "other" }] }] },
  builds: "Landslide 3 ●●●, Hunt ●●, Ambush ●●",
});
offhand("trophy", "legendary", "The king's head", {
  stats: [critStep(1)], says: "Crit chance +1.", does: "When its holder lands a killing blow, every ally's crit chance is doubled for a while.",
  status: { reactions: killsByHit({ do: [apply("kings_head_on", R.allies)] }) },
  more: [given("kings_head_on", "CROWNED", "Crit chance doubled.", { duration: 10, stats: [{ stat: "crit_chance", flat: { scale: [{ ratio: 1, stat: "crit_chance", of: "holder" }] } }] })],
  builds: "Hunt 3 ●●●, Ambush ●●",
});

// ─── Cloak (Valkyrie, Monk, Ranger): Evasion; Attack, Crit chance, Attack speed, Defense ──
// Evasion for the quick: the Valkyrie's is a swan-feather cloak, the Ranger's and Monk's their own.

offhand("cloak", "common", "Traveller's cloak", { stats: [sp("evasion", "medium"), st("attack", 1)], says: "Evasion medium, Attack +1.", builds: "Cuts 1 ●, Hunt 1 ●" });
offhand("cloak", "common", "Swan-feather cloak", { stats: [sp("evasion", "medium"), st("defense", 1)], says: "Evasion medium, Defense +1.", builds: "Toll 1 ●, Cuts 1 ●" });
offhand("cloak", "uncommon", "Hooded cloak", {
  stats: [sp("attack_speed", "medium")], says: "Attack speed medium.", does: "Each time its holder dodges a hit, it gains a few Might (from Attack).",
  status: { reactions: [{ on: on("hit_evaded"), do: [apply("might", "holder", own("few", "attack"))] }] },
  builds: "Cuts 1 ●, Toll 1 ●",
});
offhand("cloak", "uncommon", "Feathered cloak", {
  stats: [sp("evasion", "medium")], says: "Evasion medium.", does: "The first time each fight its holder drops below half its HP, it's Hidden.",
  status: { reactions: [{ on: on("hp_lost"), if: [{ side: "self", where: { hpBelow: 50, lacks: "feathered_cloak_spent" } }], do: [apply("hidden", "holder"), apply("feathered_cloak_spent", "holder")] }] },
  more: [marker("feathered_cloak_spent", "Feathered cloak (spent)", "Its Hidden is spent this fight.")],
  builds: "Cuts 1 ●, Phoenix 1 ●, Hunt 1 ●",
});
offhand("cloak", "rare", "Dancer's cloak", {
  stats: [st("attack", 1)], says: "Attack +1.", does: "Each time its holder dodges a hit, its ability nearest to ready comes 3 ticks closer.",
  status: { reactions: [{ on: on("hit_evaded"), do: [{ op: "cooldown", which: "soonest", set: { less: 3 }, to: "holder" }] }] },
  builds: "Cuts 2 ●●●, Toll ●●",
});
// Bloodlust's pattern, the other way round: more Evasion while its holder is above three quarters.
offhand("cloak", "rare", "Cloak of leaves", {
  stats: [sp("evasion", "medium")], says: "Evasion medium.", does: "While its holder is above three quarters of its HP, its Evasion is 15 higher.",
  status: {
    reactions: [
      { on: on("fight_start"), do: [apply("cloak_of_leaves_on", { side: "self", where: { hpAtLeast: 75 } })] },
      { on: on("revived"), do: [apply("cloak_of_leaves_on", { side: "self", where: { hpAtLeast: 75 } })] },
      { on: on("healed"), do: [apply("cloak_of_leaves_on", { side: "self", where: { hpAtLeast: 75 } })] },
      { on: on("hp_lost"), do: [{ op: "remove", label: "buff", status: "cloak_of_leaves_on", to: { side: "self", where: { hpBelow: 75 } } }] },
    ],
  },
  more: [{ id: "cloak_of_leaves_on", name: "LEAVES", text: "Evasion up.", label: "buff", show: "icon", stacking: "fizzle", stats: [{ stat: "evasion", flat: 15 }] }],
  builds: "Cuts 2 ●●, Hunt ●",
});
// An HP floor spent on the first blow it holds; the holder goes Hidden as it's spent.
offhand("cloak", "legendary", "Swan's grace", {
  stats: [sp("evasion", "medium")], says: "Evasion medium.", does: "Once a fight, the blow that would knock its holder out leaves it at 1 HP and Hidden.",
  status: {
    reactions: [
      { on: on("fight_start"), do: [apply("swans_grace_floor", "holder")] },
      { on: on("status_ended", { status: "swans_grace_floor", cause: ["spent"] }), do: [apply("hidden", "holder")] },
    ],
  },
  more: [{ id: "swans_grace_floor", name: "SWAN'S GRACE", text: "The next blow that would knock it out leaves it at 1 HP.", label: "buff", show: "sheet", stacking: "fizzle", unremovable: true, floor: { spend: true } }],
  builds: "Phoenix 3 ●●●, Cuts ●●, Toll ●",
});
// Each dodge: the next swing at once, and it strikes twice (a one-shot strike rule, spent by the swing).
offhand("cloak", "legendary", "Tempest cloak", {
  stats: [sp("attack_speed", "medium")], says: "Attack speed medium.", does: "Each time its holder dodges a hit, its next basic attack comes at once and strikes twice.",
  status: { reactions: [{ on: on("hit_evaded"), do: [{ op: "cooldown", which: "basic", set: "ready", to: "holder" }, apply("tempest_cloak_on", "holder")] }] },
  more: [{
    id: "tempest_cloak_on", name: "TEMPEST", text: "Its next basic attack strikes twice.", label: "buff", show: "icon", stacking: "fizzle",
    strike: { to: "target" }, reactions: [{ on: on("action_resolve", { kind: "basic" }), do: [{ op: "remove", label: "buff", status: "tempest_cloak_on", to: "holder" }] }],
  }],
  builds: "Cuts 3 ●●●, Toll ●●",
});
