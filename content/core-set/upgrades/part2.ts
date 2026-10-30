/**
 * Step 5i, step 5: the upgrades of the Hexer, Monk, Assassin, Vampire, Pyromancer, Frostweaver, Stormcaller and Geomancer (a power step and two versions for each ability and passive, as five forms
 * each) and their mythics, from steps/05-core-set/5i-synergy/fill/upgrades-2.md with fill-rulings.md (its third round wins).
 * `upgrades` joins the pack's upgrades, `abilities` (the ability forms) its abilities, `statuses` (passive forms and helpers,
 * and the mythics' statuses) its statuses, `mythics` its gear and the rogue's stock; `builds` is designer data, never in the pack.
 *
 * Each form is built from the class's own ability or passive in classes.ts, so a form keeps everything of the base it doesn't
 * name. The power step is the training rule's "two fifths more" (src/rogue.ts, UPGRADE) of the amount the fill names, or a
 * cooldown a word shorter (by the base's own id, so its jitter stays), or a rung cheaper. Every number is the fill's.
 * Hooks use the engine spec's additions (build/engine-spec.md, X1 onward); the engine acts on them once wave 2's engine lands.
 */
import type { AbilityT, EffectT, GearT, NumT, ReactionT, StatusT, TargetRuleT, ToT, UpgradeT } from "../../../src/schema.js";
import { abilities as baseAbilities, classes, passives, T } from "../classes.js";
import { AGGRO_STEP, BURN_STACKS, COOLDOWN, HIT, SHOCK_STACKS, SPECIAL, STATUS, SWING_REF, WEAPON, WINDUP, from, jitter, stacks, type HitWord } from "../scale.js";
import { own, piece, pieceStatus, type Build, type BuildTag, type Builds } from "../pieces/kit.js";

// ─── Words and helpers ───────────────────────────────────────────────────────

/** The power step's "more": two fifths more (src/rogue.ts, UPGRADE.amount). */
const POWER = 1.4;
/** Cold hex's own multiplier on the few word (classes.ts): enough Chill for a Hexer to reach a shatter alone. */
const COLD_HEX = 1.3;
/** Burning fist's Burn, three fifths of the few word (classes.ts). */
const FIST_BURN = 0.6;
/** Frost lance's and Blizzard's own multipliers (classes.ts). */
const LANCE_CHILL = 0.6;
const BLIZZARD_CHILL = 0.45;
const STILLNESS_CHILL = 0.5;

type Form = "p" | "a" | "b" | "ap" | "bp";
type V = "" | "a" | "b";
const FORMS: [Form, V, boolean][] = [["p", "", true], ["a", "a", false], ["b", "b", false], ["ap", "a", true], ["bp", "b", true]];
const formId = (id: string, f: Form) => `${id}__${f}`;

const apply = (status: string, extra: { stacks?: NumT; to?: ToT } = {}): EffectT => ({ op: "apply", status, ...extra }) as EffectT;
const phys = (amount: NumT, extra: object = {}): EffectT => ({ op: "damage", type: "physical", amount, ...extra }) as EffectT;
const magic = (amount: NumT, extra: object = {}): EffectT => ({ op: "damage", type: "magical", amount, ...extra }) as EffectT;
const removeMine = (status: string, label: "buff" | "debuff" | "marker" = "buff", to: ToT = "holder"): EffectT => ({ op: "remove", label, status, to }) as EffectT;
/** An ability's hit, by its word, times k. */
const hitOf = (stat: string, word: HitWord, k = 1): NumT => from(stat, HIT[word] * k);
/** A cooldown word, moved by the base ability's id as classes.ts moves the base's, so a form keeps its ability's place in the spread. */
const cd = (word: keyof typeof COOLDOWN, baseId: string) => jitter(COOLDOWN[word], baseId);
const both = (pct: number) => [{ tag: "physical", pct }, { tag: "magical", pct }];

/** Rounds away float noise (0.40599999 → 0.406), so the pack reads cleanly. */
function tidy<T>(x: T): T {
  if (typeof x === "number") return (Number.isInteger(x) ? x : Math.round(x * 1e9) / 1e9) as T;
  if (Array.isArray(x)) return x.map(tidy) as T;
  if (x && typeof x === "object") return Object.fromEntries(Object.entries(x).filter(([, v]) => v !== undefined).map(([k, v]) => [k, tidy(v)])) as T;
  return x;
}

const baseAbility = (id: string) => {
  const a = baseAbilities.find((x) => x.id === id);
  if (!a) throw new Error(`no ability '${id}' in classes.ts`);
  return a;
};
const basePassive = (id: string) => {
  const s = passives.find((x) => x.id === id);
  if (!s) throw new Error(`no passive status '${id}' in classes.ts`);
  return s;
};
const passiveCard = (cls: string) => classes.find((c) => c.id === cls)!.passive!.text;

type Ver = {
  name: string;
  /** Its card, the fill's, word for word. */
  text: string;
  /** The builds it serves, in the fill's order: the first is worth 2 to it, the rest 1. */
  builds: Build[];
  /** What the power step adds to this version's card, where it differs from the upgrade's own power card. */
  plus?: string;
};
type Up<B> = {
  id: string;
  cls: string;
  /** The power step's card. */
  power: string;
  a: Ver;
  b: Ver;
  /** A form's body: what differs from the base, for a version (or none) with or without the power step (k is 1 or POWER). */
  form: (v: V, k: number, plus: boolean) => Partial<B>;
  note?: string;
};

export const upgrades: UpgradeT[] = [];
export const abilities: AbilityT[] = [];
export const statuses: StatusT[] = [];
export const mythics: GearT[] = [];
export const builds: Builds = {};

const tags = (bs: Build[], rung: 2 | 3): BuildTag[] => bs.map((build, i) => ({ build, rung, worth: i === 0 ? 2 : 1 }));
function record(kind: "ability" | "passive", u: Up<unknown>) {
  upgrades.push(tidy({ id: u.id, class: u.cls, kind, power: u.power, a: { name: u.a.name, text: u.a.text }, b: { name: u.b.name, text: u.b.text }, ...(u.note ? { note: u.note } : {}) }));
  for (const [f, v] of [["a", "a"], ["b", "b"], ["ap", "a"], ["bp", "b"]] as const) builds[formId(u.id, f)] = tags(u[v].builds, f.length === 1 ? 2 : 3);
}
const formName = (baseName: string, u: Up<unknown>, v: V, plus: boolean) => `${v ? u[v].name : baseName}${plus ? "+" : ""}`;
const formText = (baseText: string, u: Up<unknown>, v: V, plus: boolean) => (v ? u[v].text : baseText) + (plus ? ` ${(v && u[v].plus) || u.power}` : "");

/** An ability's upgrade: five abilities of its class, each the base with the form's changes. */
function abilityUp(u: Up<AbilityT>) {
  const base = baseAbility(u.id);
  if (base.class !== u.cls) throw new Error(`'${u.id}' is the ${base.class}'s, not the ${u.cls}'s`);
  record("ability", u);
  for (const [f, v, plus] of FORMS) {
    const body = u.form(v, plus ? POWER : 1, plus);
    abilities.push(tidy({ ...JSON.parse(JSON.stringify(base)), ...body, id: formId(u.id, f), class: u.cls, name: formName(base.name, u, v, plus), text: formText(base.text, u, v, plus) }) as AbilityT);
  }
}
/** A passive's upgrade: five statuses, each taking the passive status's place, the base with the form's changes. */
function passiveUp(u: Up<StatusT>) {
  const base = basePassive(u.id);
  record("passive", u);
  for (const [f, v, plus] of FORMS) {
    const body = u.form(v, plus ? POWER : 1, plus);
    statuses.push(tidy({ ...JSON.parse(JSON.stringify(base)), ...body, id: formId(u.id, f), name: formName(base.name, u, v, plus), text: formText(passiveCard(u.cls), u, v, plus) }) as StatusT);
  }
}

/** A kit state: a status a kit keeps on a unit, shown on its icon, never a new word for the player (it takes its version's name). */
const kit = (id: string, name: string, text: string, body: Partial<StatusT>): StatusT => ({ id, name, text, label: "buff", show: "icon", stacking: "refresh", ...body }) as StatusT;
/** Bookkeeping: neither buff nor debuff, lifted only by name (X14). */
const marker = (id: string, name: string, text: string, body: Partial<StatusT>): StatusT => ({ id, name, text, label: "marker", show: "sheet", stacking: "refresh", ...body }) as StatusT;
const helper = (s: StatusT) => statuses.push(tidy(s));

// ─── Hexer ───────────────────────────────────────────────────────────────────

passiveUp({
  id: "cold_hex", cls: "hexer",
  power: "Its basic attacks add 40% more.",
  a: { name: "Hex of flames", text: "Its basic attacks add a few Burn, whatever weapon it carries; stacks scale from Magic.", builds: ["bonfire"] },
  b: { name: "Deep cold", text: "Its basic attacks add Chill only to the foe with the most Chill, twice as many; stacks scale from Magic.", builds: ["snap"] },
  form: (v, k) => ({
    reactions: [{
      on: { event: "hit_lands", kind: "basic" },
      do: [
        v === "a" ? apply("burn", { stacks: own("few", "magic", BURN_STACKS * k), to: "other" }) // Kindling's own size: the Pyromancer's stays the bigger.
          : v === "b" ? apply("chill", { stacks: own("few", "magic", COLD_HEX * 2 * k), to: T.mostFoe("chill") }) // Wherever the swing landed; with none chilled, a random foe.
            : apply("chill", { stacks: own("few", "magic", COLD_HEX * k), to: "other" }),
      ],
    }],
  }),
});

abilityUp({
  id: "malison", cls: "hexer",
  power: "40% more of every status it adds.",
  a: { name: "Plague", text: "Adds a few Burn, a few Shock and a few Bleed to every foe; stacks scale from Magic.", builds: ["cuts", "harvest", "toll"] },
  b: { name: "Focused curse", text: "Adds Burn and Shock to the foe with the highest Attack or Magic, three times as many; stacks scale from Magic.", builds: ["bonfire", "lockdown"] },
  form: (v, k) =>
    v === "b"
      ? { target: T.highestAMFoe, do: [apply("burn", { stacks: stacks("few", "magic", 3 * k) }), apply("shock", { stacks: stacks("few", "magic", 3 * k) })] } // No Seek: a Taunting foe catches it first.
      : {
        ...(v === "a" ? { mp: 650 } : {}), // A rung up, for the third status.
        do: [apply("burn", { stacks: stacks("few", "magic", k) }), apply("shock", { stacks: stacks("few", "magic", k) }), ...(v === "a" ? [apply("bleed", { stacks: stacks("few", "magic", k) })] : [])],
      },
});

abilityUp({
  id: "unmake", cls: "hexer",
  power: "A shorter cooldown.",
  a: { name: "Silence all", text: "Silences every foe in a wind-up and strips their buffs. Waits until a foe is in a wind-up.", builds: ["lockdown"] },
  b: {
    name: "Broken spell", builds: ["overflow"],
    text: "Silences the casting foe with the highest Attack or Magic and strips its buffs. For each buff stripped, that foe takes light magical damage that scales from Magic, and the Hexer regains 200 MP. Waits until a foe is in a wind-up.",
  },
  form: (v, _k, plus) => ({
    ...(plus ? { cooldown: cd("short", "unmake") } : {}),
    ...(v === "a" ? { target: { side: "foes", where: { casting: true }, pick: "all" } as TargetRuleT } : {}), // An all-pick: the Taunt and Hidden rules don't apply.
    ...(v === "b"
      ? {
        do: [
          // Read before the strip: a light hit for each buff the target holds (X8), and a marker holding the count, which pays the Hexer.
          magic({ scale: [{ ratio: HIT.light, count: "buffs", of: "target", times: { stat: "magic", of: "self" } }] }),
          apply("broken_spell", { stacks: { scale: [{ ratio: 1, count: "buffs", of: "target" }] } }),
          apply("silence"),
          { op: "remove", label: "buff" } as EffectT,
        ],
        note: "Fix (the fill's hook can't reach it): in an action, a number read `of: target` reads the unit the effect lands on, so an `mp` effect to the Hexer can't count the foe's buffs. The count rides a one-tick marker on the foe (broken_spell), whose reaction pays its source 200 MP a stack.",
      }
      : {}),
  }),
});
helper(marker("broken_spell", "BROKEN SPELL", "The Hexer that broke its spell regains MP for each buff it stripped.", {
  stacking: "intensity", perSource: {}, duration: 1,
  reactions: [{ on: { event: "status_gained", status: "broken_spell" }, actor: "source", do: [{ op: "mp", amount: { scale: [{ ratio: 200, stacks: "broken_spell", of: "holder" }] }, to: "source" }] }],
}));

abilityUp({
  id: "enfeeble", cls: "hexer",
  power: "40% more Sunder; if it adds none, it costs less MP.",
  a: { name: "Wither", text: "Weakens every foe.", builds: ["toll", "lockdown"], plus: "It costs less MP." },
  b: { name: "Expose", text: "Adds many Sunder to the foe with the lowest HP; stacks scale from Magic.", builds: ["hunt", "cuts"], plus: "40% more Sunder." },
  form: (v, k, plus) =>
    v === "a" ? { target: T.everyFoe, cooldown: cd("medium", "enfeeble"), mp: plus ? 450 : 650, do: [apply("weaken")] }
      : v === "b" ? { target: T.lowestHpFoe, do: [apply("sunder", { stacks: stacks("many", "magic", k) })] } // The lowest current HP, no Seek.
        : { do: [apply("weaken"), apply("sunder", { stacks: stacks("few", "magic", k) })] },
});

// ─── Monk ────────────────────────────────────────────────────────────────────

const sunderOn = (kind: "basic" | "extra" | "ability", k: number): ReactionT => ({ on: { event: "hit_lands", kind }, do: [apply("sunder", { stacks: own("few", "attack", k), to: "other" })] });
passiveUp({
  id: "iron_palm", cls: "monk",
  power: "40% more Sunder.",
  a: { name: "Hundred hands", text: "Every hit it lands adds a few Sunder: its basic attacks, Double strike's second strike, and its abilities' hits; stacks scale from Attack.", builds: ["cuts"] },
  b: { name: "Drinking palm", text: "Its basic attacks, and the second strike of its Double strike, add a few Sunder; stacks scale from Attack. Its hits on a Sundered foe heal it for a tenth of the damage.", builds: ["pact"] },
  form: (v, k) => ({
    reactions: [
      // First, so its test reads the foe as the hit found it, before this hit's own Sunder lands (X3).
      ...(v === "b" ? [{ on: { event: "hit_lands" }, if: { unit: "other", where: { has: "sunder" } }, do: [{ op: "heal", amount: { scale: [{ ratio: SPECIAL.lifesteal.medium / 100, amount: true }] }, to: "self" }] } as ReactionT] : []),
      sunderOn("basic", k),
      sunderOn("extra", k),
      ...(v === "a" ? [sunderOn("ability", k)] : []),
    ],
  }),
});

// Flow state: two renewals a cast (each cast sets them back to two); while Hasted, each hit it lands counts, and the fifth renews the Haste.
const FLOW_RENEWALS = 2;
abilityUp({
  id: "flow", cls: "monk",
  power: "A shorter cooldown.",
  a: { name: "Flow state", text: "Applies Haste to itself. While that Haste lasts, every fifth hit it lands renews it, at most twice a cast.", builds: ["cuts"] },
  b: { name: "Stillness of mind", text: "Taunts, and raises its Evasion by 35 for as long as the Taunt. No Haste.", builds: ["toll"] },
  form: (v, _k, plus) => ({
    ...(plus ? { cooldown: cd("medium", "flow") } : {}),
    ...(v === "a" ? { do: [apply("haste"), apply("flow_state", { stacks: FLOW_RENEWALS })] } : {}),
    ...(v === "b" ? { do: [apply("taunt"), apply("stillness_of_mind")] } : {}),
  }),
});
helper(kit("flow_state", "FLOW STATE", "While Hasted, every fifth hit it lands renews its Haste.", {
  show: "sheet", stacking: "intensity", cap: FLOW_RENEWALS,
  reactions: [
    { on: { event: "hit_lands" }, if: { side: "self", where: { has: "haste" } }, do: [apply("flow_state_count", { stacks: 1, to: "self" })] },
    { on: { event: "status_capped", status: "flow_state_count" }, do: [apply("haste", { to: "holder" })] },
  ],
  trigger: { on: { event: "status_capped", status: "flow_state_count" } }, drop: { count: 1 },
}));
helper(kit("flow_state_count", "FLOW STATE", "Hits landed while Hasted; the fifth renews the Haste.", {
  stacking: "intensity", cap: 5, trigger: { on: { event: "status_capped", status: "flow_state_count" } }, drop: "all",
}));
// Statuses are universal: the Taunt at its own 20 ticks, and the Evasion beside it for as long.
helper(kit("stillness_of_mind", "STILLNESS OF MIND", "Evasion up.", { duration: STATUS.taunt.duration, stats: [{ stat: "evasion", flat: SPECIAL.evasion.high }] }));

abilityUp({
  id: "burning_fist", cls: "monk",
  power: "Its hits add 40% more of their status.",
  a: { name: "Frost fist", text: "Three quick hits on the foe with the most Chill; each deals physical damage that scales from Attack and adds a little Chill; stacks scale from Attack.", builds: ["snap"] },
  b: { name: "Fanned flames", text: "Five quick, light hits on the foe with the most Burn; each deals physical damage that scales from Attack and adds a little Burn; stacks scale from Attack.", builds: ["bonfire", "cuts"] },
  form: (v, k) =>
    v === "a" ? { target: T.mostFoe("chill"), do: [phys(from("attack", 0.11), { hits: 3, apply: [{ status: "chill", stacks: stacks("few", "attack", 0.3 * k) }] })] } // Three tenths of the word: under a Frost lance.
      : v === "b" ? { do: [phys(from("attack", 0.07), { hits: 5, apply: [{ status: "burn", stacks: stacks("few", "attack", 0.4 * k) }] })] }
        : { do: [phys(from("attack", 0.11), { hits: 3, apply: [{ status: "burn", stacks: stacks("few", "attack", FIST_BURN * k) }] })] },
});

abilityUp({
  id: "pressure_point", cls: "monk",
  power: "40% more damage.",
  a: { name: "Lingering point", text: "Has Seek. Deals physical damage that scales from Attack to the foe with the highest Attack or Magic, and applies Stun. When that Stun ends, the foe is Slowed.", builds: ["lockdown"] },
  b: { name: "Vital strike", text: "Has Seek. Deals triple physical damage that scales from Attack to the foe with the lowest HP. No Stun.", builds: ["hunt"] },
  form: (v, k) =>
    v === "b" ? { target: T.lowestHpFoe, do: [phys(from("attack", HIT.normal * 3 * k))] }
      : { do: [phys(hitOf("attack", "normal", k), { apply: [{ status: "stun" }, ...(v === "a" ? [{ status: "lingering_point" }] : [])] })] },
});
// The Stun's own length; when it runs out, its holder is Slowed (if the Stun is lifted early, the Slow still comes when this ends).
helper(marker("lingering_point", "LINGERING POINT", "Slowed when this ends.", {
  duration: STATUS.stun.duration,
  reactions: [{ on: { event: "status_ended", status: "lingering_point", cause: ["expired"] }, do: [apply("slow", { to: "holder" })] }],
}));

// ─── Assassin ────────────────────────────────────────────────────────────────

passiveUp({
  id: "lacerate", cls: "assassin",
  power: "Its crits add 40% more Bleed.",
  a: { name: "Opening wound", text: "Its first hit on each foe always crits. Each of its crits adds several Bleed to the foe; stacks scale from Attack.", builds: ["ambush"] },
  b: { name: "Rupture", text: "Each of its crits sets off the foe's Bleed once more, for each stack, and the Bleed closes; then it adds several Bleed; stacks scale from Attack.", builds: ["hunt"] },
  form: (v, k) => ({
    // Opening wound: hits on a foe it hasn't yet landed a hit on always crit (X25: chance after every stat change, so Gambler's coin too).
    ...(v === "a" ? { crits: [{ when: { lacks: "opening_wound" }, chance: 100 }] } : {}),
    reactions: [
      {
        on: { event: "hit_lands", tags: ["crit"] },
        do: [
          // Rupture: Bleed's own per-hit damage for each stack left after the crit's own hit, then the Bleed closes, then Lacerate's Bleed.
          ...(v === "b" ? [
            { op: "damage", type: "none", amount: { scale: [{ ratio: STATUS.bleed.perStack, stacks: "bleed", of: "target" }] }, to: "other" } as EffectT,
            removeMine("bleed", "debuff", "other"),
          ] : []),
          apply("bleed", { stacks: own("several", "attack", k), to: "other" }),
        ],
      },
      ...(v === "a" ? [{ on: { event: "hit_lands" }, do: [apply("opening_wound", { to: "other" })] } as ReactionT] : []),
    ],
  }),
});
// On each foe the Assassin has landed a hit on, all fight; a summoned foe is a new foe.
helper(marker("opening_wound", "OPENING WOUND", "The Assassin's first hit on it has landed.", { stacking: "fizzle" }));

abilityUp({
  id: "vanish", cls: "assassin",
  power: "A shorter cooldown.",
  a: { name: "Smoke screen", text: "Hides the ally with the lowest share of HP that isn't Taunting. Waits until an ally is below 80% of its HP.", builds: ["phoenix", "toll"] },
  b: { name: "Shadow step", text: "Applies Hidden to itself. Waits until it isn't Hidden. Its first hit after that Hidden ends deals triple damage.", builds: ["ambush"] },
  form: (v, _k, plus) => ({
    // A quarter off (22 → 16): one word down would hide it about 70% of a fight.
    ...(plus ? { cooldown: Math.round(baseAbility("vanish").cooldown * 0.75 * 10) / 10 } : {}),
    ...(v === "a" ? { if: { side: "allies", where: { hpBelow: 80 } }, target: { side: "allies", where: { lacks: ["taunt", "hidden"] }, pick: "lowest", by: "hp_share" } as TargetRuleT } : {}),
    ...(v === "b" ? { do: [apply("hidden"), apply("shadow_step")] } : {}),
  }),
});
helper(marker("shadow_step", "SHADOW STEP", "When its Hidden runs out, its next hit deals triple damage.", {
  reactions: [{ on: { event: "status_ended", status: "hidden", cause: ["expired"] }, do: [apply("shadow_step_strike", { to: "holder" }), removeMine("shadow_step", "marker")] }],
}));
helper(kit("shadow_step_strike", "SHADOW STEP", "Its next hit deals triple damage.", {
  stacking: "fizzle", boosts: both(200),
  reactions: [{ on: { event: "hit_lands" }, do: [removeMine("shadow_step_strike")] }],
}));

abilityUp({
  id: "backstab", cls: "assassin",
  power: "40% more damage.",
  a: { name: "Coup de grâce", text: "Has Seek. Deals physical damage that scales from Crit chance to the foe with the lowest current HP. When it knocks that foe out, Backstab is ready again.", builds: ["hunt"] },
  b: { name: "From the shadows", text: "Has Seek. Waits until the Assassin is Hidden. Deals double physical damage that scales from Crit chance to the foe with the lowest current HP.", builds: ["ambush"] },
  form: (v, k) => ({
    ...(v === "a" ? { statuses: ["coup_de_grace"], note: "A kill the Assassin lands with any ability readies Backstab (Garrote's too): the ko event names the killer and the hit's kind (X2, X29), not which ability." } : {}),
    ...(v === "b" ? { if: { side: "self", where: { has: "hidden" } }, do: [phys(from("crit_chance", HIT.normal * 2 * k))] } : { do: [phys(hitOf("crit_chance", "normal", k))] }),
  }),
});
// Brought by the ability (X40): a kill the Assassin lands with an ability (X2, X29) makes Backstab ready (X21). No limit but MP.
helper(kit("coup_de_grace", "COUP DE GRÂCE", "A kill with an ability makes Backstab ready again.", {
  show: "sheet", unremovable: true,
  reactions: [{ on: { event: "ko", whose: "foe", other: "holder", kind: "ability" }, do: [{ op: "cooldown", which: { ability: ["backstab"] }, set: "ready", to: "self" }] }],
}));

abilityUp({
  id: "garrote", cls: "assassin",
  power: "It costs less MP.",
  a: { name: "Choke", text: "Has Seek. Waits until a foe is in a wind-up. Deals physical damage that scales from Attack to the casting foe with the highest Attack or Magic, and applies Silence.", builds: ["lockdown"] },
  b: { name: "Garrote wire", text: "Has Seek. Deals physical damage that scales from Attack to a random foe that isn't Taunting, applies Rot, and adds many Bleed; stacks scale from Attack. No Silence.", builds: ["hunt"] },
  form: (v, _k, plus) => ({
    ...(plus ? { mp: 200 } : {}),
    ...(v === "a" ? { if: { side: "foes", where: { casting: true } }, target: T.castingFoe } : {}),
    // No longer skips Silenced foes.
    ...(v === "b" ? { target: T.notTauntingFoe, do: [phys(hitOf("attack", "normal"), { apply: [{ status: "rot" }, { status: "bleed", stacks: stacks("many", "attack") }] })] } : {}),
  }),
});

// ─── Vampire ─────────────────────────────────────────────────────────────────

/** Bloodlust's doubling (classes.ts bloodlust_on), and the power step's two and a half times, as on-states that Bloodlust's reactions keep. */
const lustOn = (id: string, name: string, times: number, extra: Partial<StatusT> = {}): StatusT =>
  kit(id, name, times === 1 ? "Lifesteal doubled." : "Lifesteal two and a half times its own.", { stacking: "fizzle", stats: [{ stat: "lifesteal", flat: { scale: [{ ratio: times, stat: "lifesteal", of: "holder" }] } }], ...extra });
const feast: ReactionT = {
  // The other ally lowest in HP share gets as much as the Vampire drinks: Lifesteal's own shape (X3's times, read live).
  on: { event: "hit_lands" },
  do: [{ op: "heal", amount: { scale: [{ ratio: 0.01, amount: true, times: { stat: "lifesteal", of: "holder" } }] }, to: T.otherLowestShareAlly }],
};
helper(lustOn("bloodlust_on_plus", "BLOODLUST", 1.5));
helper(lustOn("shared_feast_on", "SHARED FEAST", 1, { text: "Lifesteal doubled; each hit it lands heals the ally lowest in HP as much as it drank.", reactions: [feast] }));
helper(lustOn("shared_feast_on_plus", "SHARED FEAST", 1.5, { text: "Lifesteal two and a half times its own; each hit it lands heals the ally lowest in HP as much as it drank.", reactions: [feast] }));
// Undying thirst: for 5 ticks, an HP floor (X31) and Lifesteal three times its own in place of the doubling (or of the power step's two and a
// half): read once as it lands, on top of the on-state Bloodlust has just given it (half again of 40, or a fifth of 50).
const UNDYING = 5;
const thirst = (id: string, ratio: number): StatusT =>
  kit(id, "UNDYING THIRST", "Can't fall below 1 HP; Lifesteal three times its own.", { stacking: "fizzle", duration: UNDYING, floor: {}, stats: [{ stat: "lifesteal", flat: { scale: [{ ratio, stat: "lifesteal", of: "holder" }] } }] });
helper(thirst("undying_thirst", 0.5));
helper(thirst("undying_thirst_plus", 0.2));
// Once a fight, through a knockout too.
helper(marker("undying_thirst_spent", "UNDYING THIRST", "Spent this fight.", { stacking: "fizzle", survivesKO: true }));

passiveUp({
  id: "bloodlust", cls: "vampire",
  power: "Below half of its max HP, its Lifesteal is two and a half times its own, not doubled.",
  a: { name: "Shared feast", text: "While it's below half of its max HP, its Lifesteal is doubled, and each hit it lands heals the other ally with the lowest share of HP as much as it drank.", builds: ["pact"] },
  b: { name: "Undying thirst", text: "While it's below half of its max HP, its Lifesteal is doubled. Once a fight, when it falls below a tenth of its max HP, for 5 ticks it can't fall below 1 HP and its Lifesteal is tripled.", builds: ["phoenix", "pact"] },
  form: (v, _k, plus) => {
    const on = v === "a" ? (plus ? "shared_feast_on_plus" : "shared_feast_on") : plus ? "bloodlust_on_plus" : "bloodlust_on";
    return {
      reactions: [
        { on: { event: "hp_lost" }, do: [apply(on, { to: { side: "self", where: { hpBelow: 50 } } })] },
        { on: { event: "healed" }, do: [{ op: "remove", label: "buff", status: on, to: { side: "self", where: { hpAtLeast: 50 } } } as EffectT] },
        ...(v === "b" ? [{
          on: { event: "hp_lost" }, if: { side: "self", where: { hpBelow: 10, lacks: "undying_thirst_spent" } },
          do: [apply(plus ? "undying_thirst_plus" : "undying_thirst", { to: "self" }), apply("undying_thirst_spent", { to: "self" })],
        } as ReactionT] : []),
      ],
    };
  },
});

abilityUp({
  id: "blood_drain", cls: "vampire",
  power: "40% more damage.",
  a: { name: "Bloodletting", text: "Deals physical damage that scales from max HP to a random foe, and adds many Bleed; stacks scale from max HP. No Weaken.", builds: ["pact", "cuts"] },
  b: { name: "Drain the well", text: "Deals physical damage that scales from max HP to a random foe, and drains MP from it: a quarter of the damage dealt, given to the ally with the least MP. No Weaken.", builds: ["overflow"] },
  form: (v, k) =>
    v === "a" ? { do: [phys(from("max_hp", 0.4 * k), { apply: [{ status: "bleed", stacks: stacks("many", "max_hp") }] })] }
      // A one-tick marker on the Vampire hears the cast's own hit and drains as Siphon does.
      : v === "b" ? { do: [apply("drain_the_well", { to: "self" }), phys(from("max_hp", 0.4 * k))] }
        : { do: [phys(from("max_hp", 0.4 * k), { apply: [{ status: "weaken" }] })] },
});
helper(marker("drain_the_well", "DRAIN THE WELL", "Its ability's hit drains MP for the ally with the least.", {
  duration: 1,
  reactions: [{
    on: { event: "hit_lands", kind: "ability" },
    do: [
      { op: "mp", amount: { scale: [{ ratio: -0.25, amount: true }] }, to: "other" },
      { op: "mp", amount: { scale: [{ ratio: 0.25, amount: true }] }, to: { side: "allies", pick: "lowest", by: "mp_share" } },
    ],
  }],
}));

/** Blood gift's price (G12, X23): a fifth of its max HP, paid, not damage. */
const PRICE = 0.2;
const price: EffectT = { op: "pay", hp: from("max_hp", PRICE), to: "self" };
abilityUp({
  id: "blood_gift", cls: "vampire",
  power: "It gives 40% more than it pays.",
  a: { name: "Blood for mana", text: "Spends a fifth of its max HP to give the other ally with the least MP as much MP, and gives it Clarity. Waits until another ally is under half its MP and the Vampire is at 35% of its max HP or more.", builds: ["overflow", "pact"] },
  b: { name: "Lifeblood", text: "Waits until an ally is knocked out. Spends a fifth of its max HP to revive it with as much HP. Waits too until the Vampire is at 35% of its max HP or more.", builds: ["phoenix"] },
  form: (v, k) =>
    v === "a" ? {
      if: [{ side: "others", where: { mpBelow: 50 } }, { side: "self", where: { hpAtLeast: 35 } }],
      target: { side: "others", pick: "lowest", by: "mp_share" },
      do: [price, { op: "mp", amount: from("max_hp", PRICE * k) }, apply("clarity")],
    }
      : v === "b" ? {
        // The revives' word and price; every action on its full cooldown (G10).
        cooldown: cd("very_long", "blood_gift"), mp: 650,
        if: [{ side: "allies", where: { ko: true } }, { side: "self", where: { hpAtLeast: 35 } }],
        target: T.koAlly,
        do: [price, { op: "revive", hp: { scale: [{ ratio: PRICE * k, stat: "max_hp", of: "self" }] } }],
      }
        : { do: [price, { op: "heal", amount: from("max_hp", PRICE * k) }, apply("clarity")] },
});

abilityUp({
  id: "frenzy", cls: "vampire",
  power: "40% more Might.",
  a: { name: "Feeding frenzy", text: "Adds several Might to itself; stacks scale from Attack. While it holds Might, its Lifesteal is 10 higher.", builds: ["pact"] },
  b: { name: "Blood rage", text: "Adds several Might to the other ally with the highest Attack or Magic; stacks scale from the Vampire's Attack.", builds: ["landslide", "cuts"] },
  form: (v, k) =>
    v === "b" ? { target: { side: "others", pick: "highest", by: { stats: ["attack", "magic"] } }, do: [apply("might", { stacks: stacks("several", "attack", k) })] }
      : { do: [apply("might", { stacks: stacks("several", "attack", k) }), ...(v === "a" ? [apply("feeding_frenzy", { to: "self" })] : [])] },
});
helper(kit("feeding_frenzy", "FEEDING FRENZY", "Lifesteal up while it holds Might.", {
  stats: [{ stat: "lifesteal", flat: SPECIAL.lifesteal.medium }],
  reactions: [{ on: { event: "status_ended", status: "might" }, do: [removeMine("feeding_frenzy")] }],
}));

// ─── Pyromancer ──────────────────────────────────────────────────────────────

const burnTo = (to: ToT, mult: number): EffectT => apply("burn", { stacks: own("few", "magic", BURN_STACKS * mult), to });
passiveUp({
  id: "kindling", cls: "pyromancer",
  power: "Its basic attacks add 40% more Burn.",
  a: { name: "Wildfire", text: "Its basic attacks add a few Burn to their target and to a random other foe; stacks scale from Magic.", builds: ["harvest"] },
  b: { name: "Searing", text: "Its basic attacks add Burn only to the foe with the most Burn, twice as many; stacks scale from Magic.", builds: ["bonfire"] },
  form: (v, k) => ({
    reactions: [{
      on: { event: "hit_lands", kind: "basic" },
      do: v === "a" ? [burnTo("other", k), burnTo({ side: "foes", pick: "random", exclude: "other" }, k)] // X10: a random foe other than the one it hit.
        : v === "b" ? [burnTo(T.mostFoe("burn"), 2 * k)]
          : [burnTo("other", k)],
    }],
  }),
});

const fireboltBurn = (mult: number) => [{ status: "burn", stacks: stacks("several", "magic", BURN_STACKS * mult) }];
abilityUp({
  id: "firebolt", cls: "pyromancer",
  power: "40% more Burn.",
  a: { name: "Slow burn", text: "Deals half the magical damage, scaling from Magic, to the foe with the most Burn, and adds twice the Burn; stacks scale from Magic.", builds: ["bonfire"] },
  b: { name: "Flash bolt", text: "A quick bolt: deals magical damage that scales from Magic to the foe with the most Burn, and adds a few Burn; stacks scale from Magic.", builds: ["overflow", "cuts"] },
  form: (v, k) =>
    v === "a" ? { do: [magic(from("magic", HIT.light / 2), { apply: fireboltBurn(2 * k) })] }
      // Half the cost, off the ladder (as Blood drain's 125), and half the Burn; the hit is the base's.
      : v === "b" ? { cast: WINDUP.quick, mp: 225, do: [magic(hitOf("magic", "light"), { apply: fireboltBurn(0.5 * k) })] }
        : { do: [magic(hitOf("magic", "light"), { apply: fireboltBurn(k) })] },
});

abilityUp({
  id: "fireball", cls: "pyromancer",
  power: "40% more damage.",
  a: { name: "Conflagration", text: "Deals magical damage that scales from Magic to every foe, and adds many Burn to each; stacks scale from Magic. A longer cooldown.", builds: ["bonfire", "harvest"] },
  b: { name: "Flashfire", text: "A quick blast: deals magical damage that scales from Magic to every foe, smaller, and adds a little Burn to each; stacks scale from Magic.", builds: ["cuts", "overflow"] },
  form: (v, k) =>
    v === "a" ? { cooldown: cd("long", "fireball"), do: [magic(hitOf("magic", "touch", k), { apply: [{ status: "burn", stacks: stacks("many", "magic", BURN_STACKS) }] })] }
      : v === "b" ? { cooldown: cd("short", "fireball"), cast: WINDUP.quick, mp: 650, do: [magic(from("magic", 0.1 * k), { apply: [{ status: "burn", stacks: stacks("few", "magic", BURN_STACKS * 0.6) }] })] }
        : { do: [magic(hitOf("magic", "touch", k), { apply: [{ status: "burn", stacks: stacks("few", "magic", BURN_STACKS) }] })] },
});

/** Pyre: a heavy hit plus 200 a Burn stack on its target; Funeral pyre half of both on every foe, each by its own Burn. */
const PYRE_PER_STACK = 200;
const pyreHit = (share: number, k: number): NumT => ({ scale: [{ ratio: HIT.heavy * share * k, stat: "magic" }, { ratio: PYRE_PER_STACK * share * k, stacks: "burn", of: "target" }] });
abilityUp({
  id: "pyre", cls: "pyromancer",
  power: "40% more damage.",
  a: { name: "Funeral pyre", text: "Deals magical damage to every foe; the damage scales from Magic and rises by 100 with each Burn stack on that foe. The Burn stays.", builds: ["harvest"] },
  b: { name: "Pyre of the fallen", text: "Deals heavy magical damage to the foe with the most Burn; the damage scales from Magic and rises by 200 with each Burn stack on that foe. The Burn stays. Whenever a burning foe falls, Pyre comes 4 ticks closer.", builds: ["bonfire"] },
  form: (v, k) =>
    v === "a" ? { target: T.everyFoe, do: [magic(pyreHit(0.5, k))] }
      : { ...(v === "b" ? { statuses: ["pyre_of_the_fallen"] } : {}), do: [magic(pyreHit(1, k))] },
});
// Brought by the ability (X40): a foe's Burn ending with its holder's knockout (section 5: status_ended, cause ko), whoever killed it, brings Pyre 4 ticks closer (X21).
helper(kit("pyre_of_the_fallen", "PYRE OF THE FALLEN", "Whenever a burning foe falls, Pyre comes closer.", {
  show: "sheet", unremovable: true,
  reactions: [{ on: { event: "status_ended", status: "burn", cause: ["ko"], whose: "foe" }, do: [{ op: "cooldown", which: { ability: ["pyre"] }, set: { less: 4 }, to: "self" }] }],
}));

// ─── Frostweaver ─────────────────────────────────────────────────────────────

/** Splinters: a third of a shatter's damage at the cap (12 × 250). */
const SPLINTERS = (STATUS.chill.shatter * STATUS.chill.cap) / 3;
passiveUp({
  id: "shatterpoint", cls: "frostweaver",
  power: "A shatter adds 40% more Sunder.",
  a: { name: "Brittle", text: "When a foe's Chill shatters, that foe takes several Sunder and is Silenced; stacks scale from Magic.", builds: ["lockdown"] },
  b: { name: "Splinters", text: "When a foe's Chill shatters, that foe takes several Sunder, and every other foe takes a third of the shatter's damage; stacks scale from Magic.", builds: ["harvest", "snap"] },
  form: (v, k) => ({
    reactions: [{
      on: { event: "status_capped", status: "chill", whose: "foe" },
      do: [
        apply("sunder", { stacks: own("several", "magic", k), to: "owner" }),
        ...(v === "a" ? [apply("silence", { to: "owner" })] : []),
        ...(v === "b" ? [{ op: "damage", type: "none", amount: SPLINTERS, to: { side: "foes", pick: "all", exclude: "owner" } } as EffectT] : []),
      ],
    }],
  }),
});

const lanceChill = (word: "few" | "several", mult: number) => [{ status: "chill", stacks: stacks(word, "magic", mult) }];
abilityUp({
  id: "frost_lance", cls: "frostweaver",
  power: "40% more Chill.",
  a: { name: "Ice spear", text: "Deals magical damage that scales from Magic to the foe with the highest Attack or Magic, adds several Chill and Slows it; stacks scale from Magic.", builds: ["lockdown"] },
  b: { name: "Icicles", text: "Three lances at the three foes with the most Chill: each deals smaller magical damage that scales from Magic and adds a few Chill; stacks scale from Magic.", builds: ["snap"] },
  form: (v, k) =>
    v === "a" ? { target: T.highestAMFoe, do: [magic(hitOf("magic", "light"), { apply: [...lanceChill("several", LANCE_CHILL * k), { status: "slow" }] })] } // No Seek.
      : v === "b" ? { target: { side: "foes", pick: "highest", by: { stacks: "chill" }, count: 3 }, do: [magic(hitOf("magic", "touch"), { apply: lanceChill("few", LANCE_CHILL * k) })] }
        : { do: [magic(hitOf("magic", "light"), { apply: lanceChill("several", LANCE_CHILL * k) })] },
});

abilityUp({
  id: "blizzard", cls: "frostweaver",
  power: "40% more damage; if it deals none, 40% more Chill.",
  a: { name: "Whiteout", text: "Adds a few Chill to every foe, twice as many as Blizzard's; stacks scale from Magic. Deals no damage.", builds: ["snap", "lockdown"], plus: "40% more Chill." },
  b: { name: "Avalanche", text: "Deals magical damage that scales from Magic to every foe, rising by 150 with each Chill stack on that foe. Adds no Chill.", builds: ["snap", "harvest"], plus: "40% more damage." },
  form: (v, k) =>
    v === "a" ? { do: [apply("chill", { stacks: stacks("few", "magic", BLIZZARD_CHILL * 2 * k) })] }
      : v === "b" ? { do: [magic({ scale: [{ ratio: HIT.touch * k, stat: "magic" }, { ratio: 150 * k, stacks: "chill", of: "target" }] })] }
        : { do: [magic(hitOf("magic", "touch", k), { apply: [{ status: "chill", stacks: stacks("few", "magic", BLIZZARD_CHILL) }] })] },
});

abilityUp({
  id: "stillness", cls: "frostweaver",
  power: "It costs less MP.",
  a: { name: "Deep calm", text: "Applies Clarity to the ally with the least MP, and the Frostweaver's next ability costs nothing. No Chill.", builds: ["overflow"] },
  b: { name: "Frozen moment", text: "Waits until a foe is in a wind-up. Applies Clarity as before, and adds Chill only to foes in a wind-up, three times as many; stacks scale from Magic.", builds: ["lockdown", "snap"] },
  form: (v, _k, plus) => ({
    ...(plus ? { mp: 450 } : {}),
    ...(v === "a" ? { target: T.lowestMpAlly, do: [apply("clarity"), apply("deep_calm", { to: "self" })] } : {}),
    ...(v === "b" ? {
      if: { side: "foes", where: { casting: true } },
      target: { side: "foes", where: { casting: true }, pick: "all" } as TargetRuleT,
      do: [apply("chill", { stacks: stacks("few", "magic", STILLNESS_CHILL * 3) }), apply("clarity", { to: T.needsMpAlly })],
    } : {}),
  }),
});
// The free cast lands a sub-tick after Deep calm resolves (a cue), so the cast that gave it doesn't spend it.
helper(marker("deep_calm", "DEEP CALM", "Its next ability costs nothing.", {
  duration: 1,
  reactions: [{ on: { event: "status_gained", status: "deep_calm" }, do: [apply("deep_calm_free", { stacks: 1, to: "holder" })] }],
}));
helper(kit("deep_calm_free", "DEEP CALM", "Its next ability costs nothing.", {
  stacking: "intensity", cap: 1, mods: [{ mp: -100 }],
  trigger: { on: { event: "action_resolve", kind: "ability" } }, drop: "all",
}));

// ─── Stormcaller ─────────────────────────────────────────────────────────────

const shockOn = (kind: "basic" | "extra", k: number): ReactionT => ({ on: { event: "hit_lands", kind }, do: [apply("shock", { stacks: own("few", "magic", SHOCK_STACKS * k), to: "other" })] });
passiveUp({
  id: "arc", cls: "stormcaller",
  power: "40% more Shock.",
  a: { name: "Forked arc", text: "Each of its basic attacks also hits two other random foes, and adds a few Shock to all three; stacks scale from Magic.", builds: ["harvest"] },
  b: { name: "Static grip", text: "Each of its basic attacks strikes its target twice, and adds a few Shock with each; stacks scale from Magic.", builds: ["cuts", "hunt"] },
  form: (v, k) => ({
    // X26: a strike rule that picks several foes strikes each of them.
    strike: { to: v === "a" ? { side: "foes", pick: "random", count: 2, exclude: "targets" } : v === "b" ? "target" : T.secondFoe },
    reactions: [shockOn("basic", k), shockOn("extra", k)],
  }),
});

const chainShock = [{ status: "shock", stacks: stacks("few", "magic", SHOCK_STACKS) }];
abilityUp({
  id: "chain_lightning", cls: "stormcaller",
  power: "40% more damage on every strike.",
  a: { name: "Ball lightning", text: "Lightning strikes the foe with the lowest HP four times: once hard, adding a few Shock, then three smaller strikes. If it falls, the strikes left go to the next lowest; stacks scale from Magic.", builds: ["hunt"] },
  b: { name: "Recharge", text: "Deals magical damage that scales from Magic to a random foe, then to up to three other random foes, and adds a few Shock to each; stacks scale from Magic. The Stormcaller regains 120 MP for each foe it hits.", builds: ["overflow"] },
  form: (v, k) => {
    const first = magic(hitOf("magic", "light", k), { apply: chainShock });
    if (v === "a") {
      // Shock on the first strike only; each strike picks the lowest again (the first under the Taunt rule, the rest past it).
      const again = magic(hitOf("magic", "touch", k), { to: T.lowestHpFoe });
      return { target: T.lowestHpFoe, do: [first, again, again, again] };
    }
    const rest = magic(hitOf("magic", "touch", k), { apply: chainShock, to: T.threeOtherFoes });
    // X8: 120 MP for each foe its hits landed on, read after the hits.
    return { do: [first, rest, ...(v === "b" ? [{ op: "mp", amount: { scale: [{ ratio: 120, count: "hit" }] }, to: "self" } as EffectT] : [])] };
  },
});

const stormShock = [{ status: "shock", stacks: stacks("few", "magic", SHOCK_STACKS) }];
abilityUp({
  id: "thunderstorm", cls: "stormcaller",
  power: "40% more damage; if it deals none, its bolts deal 40% more.",
  a: { name: "Supercell", text: "Deals magical damage that scales from Magic to every foe, 12% more for each foe it hits, and adds a few Shock to each; stacks scale from Magic.", builds: ["harvest"], plus: "40% more damage." },
  b: { name: "Static field", text: "For 20 ticks, every foe that lands a hit on an ally takes a bolt of magical damage that scales from Magic. Deals no damage itself and adds no Shock.", builds: ["toll"], plus: "Its bolts deal 40% more." },
  form: (v, k, plus) =>
    // X8: +12% of the hit for each of the action's targets (uncapped).
    v === "a" ? { do: [magic({ scale: [{ ratio: HIT.touch * k, stat: "magic" }, { ratio: 0.12 * HIT.touch * k, count: "targets", times: { stat: "magic", of: "self" } }] }, { apply: stormShock })] }
      : v === "b" ? { target: T.everyAlly, do: [apply(plus ? "static_field_plus" : "static_field")] }
        : { do: [magic(hitOf("magic", "touch", k), { apply: stormShock })] },
});
/** Static field's bolt: a tenth of the Stormcaller's Magic (400 at Magic 4), read as it lands. */
const field = (id: string, k: number): StatusT => kit(id, "STATIC FIELD", "Every foe that lands a hit on it takes a bolt.", {
  perSource: {}, duration: 20,
  reactions: [{ on: { event: "hit_taken" }, do: [{ op: "damage", type: "magical", amount: { scale: [{ ratio: 0.1 * k, stat: "magic", of: "source" }] }, to: "other" }] }],
});
helper(field("static_field", 1));
helper(field("static_field_plus", POWER));

abilityUp({
  id: "static_charge", cls: "stormcaller",
  power: "A shorter cooldown.",
  a: { name: "Overcharge", text: "Applies Haste to itself. While that Haste lasts, its next three abilities cost no MP.", builds: ["overflow"] },
  b: { name: "Storm shield", text: "Raises its Thorns by 150 and its Aggro by 40 for 20 ticks. No Haste.", builds: ["toll", "harvest"] },
  form: (v, _k, plus) => ({
    ...(plus ? { cooldown: cd("medium", "static_charge") } : {}),
    ...(v === "a" ? { do: [apply("haste"), apply("overcharge")] } : {}),
    ...(v === "b" ? { do: [apply("storm_shield")] } : {}),
  }),
});
// The charges land a sub-tick after the cast resolves (a cue), so Static charge itself doesn't spend one; they end with the Haste.
helper(marker("overcharge", "OVERCHARGE", "Its next three abilities cost no MP.", {
  duration: 1,
  reactions: [{ on: { event: "status_gained", status: "overcharge" }, do: [apply("overcharge_charges", { stacks: 3, to: "holder" })] }],
}));
helper(kit("overcharge_charges", "OVERCHARGE", "Its next abilities cost no MP while its Haste lasts.", {
  stacking: "intensity", cap: 3, mods: [{ mp: -100 }],
  trigger: { on: { event: "action_resolve", kind: "ability" } }, drop: { count: 1 },
  reactions: [{ on: { event: "status_ended", status: "haste" }, do: [removeMine("overcharge_charges")] }],
}));
helper(kit("storm_shield", "STORM SHIELD", "Thorns and Aggro up.", { duration: 20, stats: [{ stat: "thorns", flat: SPECIAL.thorns.medium }, { stat: "aggro", flat: 4 * AGGRO_STEP }] }));

// ─── Geomancer ───────────────────────────────────────────────────────────────

helper(kit("bedrock_on_plus", "BEDROCK", "Crit chance doubled, and Crit damage up.", {
  stacking: "fizzle", stats: [{ stat: "crit_chance", flat: { scale: [{ ratio: 1, stat: "crit_chance", of: "holder" }] } }, { stat: "crit_multiplier", flat: SPECIAL.crit_damage.medium }],
}));
// Faultline: the next hit always crits (X25, so Gambler's coin too), at three times (the Geomancer's own crit is twice).
helper(kit("faultline", "FAULTLINE", "Its next hit crits for triple damage.", {
  stacking: "fizzle", stats: [{ stat: "crit_multiplier", flat: 100 }], crits: [{ chance: 100 }],
  reactions: [{ on: { event: "hit_lands" }, do: [removeMine("faultline")] }],
}));
passiveUp({
  id: "bedrock", cls: "geomancer",
  power: "While its Shield pool is above zero, its Crit damage rises by 25.",
  a: { name: "Stunning crits", text: "While its Shield pool is above zero, its crit chance is doubled and its crits Stun.", builds: ["lockdown"] },
  b: { name: "Faultline", text: "While its Shield pool is above zero, its crit chance is doubled. When its Shield breaks, its next hit crits for triple damage.", builds: ["landslide"] },
  form: (v, _k, plus) => {
    const on = plus ? "bedrock_on_plus" : "bedrock_on";
    return {
      reactions: [
        { on: { event: "status_gained", status: "shield" }, do: [apply(on, { to: "holder" })] },
        { on: { event: "status_ended", status: "shield" }, do: [removeMine(on)] },
        ...(v === "a" ? [{ on: { event: "hit_lands", tags: ["crit"] }, if: { side: "self", where: { has: on } }, do: [apply("stun", { to: "other" })] } as ReactionT] : []),
        ...(v === "b" ? [{ on: { event: "status_ended", status: "shield", cause: ["stacks"] }, do: [apply("faultline", { to: "holder" })] } as ReactionT] : []),
      ],
    };
  },
});

abilityUp({
  id: "earthen_shell", cls: "geomancer",
  power: "A shorter cooldown.",
  a: { name: "Stone skin", text: "Applies a smaller Shield to every ally; the amount scales from Armor.", builds: ["landslide", "phoenix"] },
  b: { name: "Rampart", text: "Applies Shield and Guard to itself. While that Guard lasts, the first time its Shield breaks it's rebuilt at once. No Shield for an ally.", builds: ["landslide", "toll"] },
  form: (v, _k, plus) => ({
    ...(plus ? { cooldown: cd("short", "earthen_shell") } : {}),
    ...(v === "a" ? { target: { side: "allies", where: { belowCap: "shield" }, pick: "all" } as TargetRuleT, do: [apply("shield", { stacks: from("armor", 0.35) })] } : {}),
    ...(v === "b" ? { target: "self" as const, do: [apply("shield", { stacks: from("armor", 1.0) }), apply("guard"), apply("rampart")] } : {}),
  }),
});
// One use, for the Guard's length: the first time the Shield breaks, it's built again from Armor (Guard's included), the cap untouched.
helper(kit("rampart", "RAMPART", "The first time its Shield breaks, it's rebuilt at once.", {
  duration: STATUS.guard.duration,
  reactions: [{ on: { event: "status_ended", status: "shield", cause: ["stacks"] }, do: [apply("shield", { stacks: { scale: [{ ratio: 1.0, stat: "armor", of: "holder" }] }, to: "holder" }), removeMine("rampart")] }],
}));

abilityUp({
  id: "rockfall", cls: "geomancer",
  power: "40% more damage.",
  a: { name: "Boulder", text: "Deals double magical damage that scales from Armor to the foe with the most HP, with a longer wind-up.", builds: ["landslide"] },
  b: { name: "Rockslide", text: "Deals magical damage that scales from Armor to every foe, half as much.", builds: ["harvest", "snap"] },
  form: (v, k) =>
    // Both take the medium cooldown and 650 MP, so a double hit or an Area one doesn't double the spell's output.
    v === "a" ? { cast: WINDUP.very_long, cooldown: cd("medium", "rockfall"), mp: 650, target: { side: "foes", pick: "highest", by: "hp" }, do: [magic(from("armor", HIT.normal * 2 * k))] }
      : v === "b" ? { cooldown: cd("medium", "rockfall"), mp: 650, target: T.everyFoe, do: [magic(from("armor", (HIT.normal / 2) * k))] }
        : { do: [magic(hitOf("armor", "normal", k))] },
});

abilityUp({
  id: "tremor", cls: "geomancer",
  power: "40% more damage.",
  a: { name: "Aftershock", text: "Deals magical damage that scales from Armor to a random foe, and Stuns every foe.", builds: ["lockdown", "snap"] },
  b: { name: "Fissure", text: "Deals magical damage that scales from Armor to a Stunned foe, triple; with no foe Stunned, to a random foe. A shorter wind-up. No Stun.", builds: ["landslide", "snap"] },
  form: (v, k) =>
    // Statuses are universal: the Stun at its own 8 ticks on every foe (Fizzle skips those already Stunned).
    v === "a" ? { do: [magic(hitOf("armor", "normal", k)), apply("stun", { to: T.everyFoe })] }
      : v === "b" ? {
        cast: WINDUP.normal, target: { side: "foes", where: { has: "stun" }, ifNone: "any" },
        do: [magic({ scale: [{ ratio: HIT.normal * k, stat: "armor" }, { ratio: HIT.normal * 2 * k, when: { has: "stun" }, of: "target", times: { stat: "armor", of: "self" } }] })],
      }
        : { do: [magic(hitOf("armor", "normal", k), { apply: [{ status: "stun" }] })] },
});

// ─── Mythics ─────────────────────────────────────────────────────────────────

/** A mythic weapon's hit at its own speed: a plain weapon's medium base and ratio, sized by its interval as every kind's is (kit.ts weaponHit). */
const ownHit = (cooldown: number, stat: string): NumT => {
  const f = cooldown / SWING_REF;
  return { base: Math.round(f * WEAPON.base.medium), scale: [{ ratio: f * WEAPON.ratio.medium, stat }] };
};
const mythic = (m: Parameters<typeof piece>[0], pulls: BuildTag[]) => {
  const g = tidy(piece(m));
  mythics.push(g);
  builds[g.id] = pulls;
};
const pull = (build: Build, worth: BuildTag["worth"], rung?: 3): BuildTag => ({ build, worth, ...(rung ? { rung } : {}) });

// Hexer: after each ability, three swings that hit every foe holding a debuff (X12: an all-pick aim, each hit a basic attack's).
const WITCH_SWINGS = 3;
mythic({
  name: "The witch-blade", slot: "weapon", rarity: "mythic", mythic: "hexer",
  text: "After each ability the Hexer casts, its next three basic attacks hit every foe that holds a debuff.",
  weapon: { type: "magical", hands: 1, cooldown: 5.8, amount: ownHit(5.8, "magic") },
  statuses: ["the_witch_blade"],
}, [pull("snap", 3, 3), pull("harvest", 2)]);
helper(pieceStatus("the_witch_blade", "The witch-blade", "After each ability it casts, its next three basic attacks hit every foe that holds a debuff.", {
  // Each cast sets the count back to three; it doesn't add.
  reactions: [{ on: { event: "action_resolve", kind: "ability" }, do: [apply("the_witch_blade_swings", { stacks: WITCH_SWINGS, to: "self" })] }],
}));
helper(kit("the_witch_blade_swings", "THE WITCH-BLADE", "Its basic attacks hit every foe that holds a debuff.", {
  stacking: "intensity", cap: WITCH_SWINGS,
  aim: { rule: { side: "foes", where: { debuffs: true }, pick: "all" }, first: true },
  trigger: { on: { event: "action_resolve", kind: "basic" } }, drop: { count: 1 },
}));

// Monk: a Burn on every hit; every 5 ticks a Heat for each burning foe, up to three (the spec's shape, X3: three pulses, at one, two and three).
const EMBER_EVERY = 5;
const emberHeat = (atLeast: number) => ({ every: EMBER_EVERY, if: { side: "foes" as const, where: { has: "burn" }, ...(atLeast > 1 ? { atLeast } : {}) }, do: [apply("heat", { stacks: 1, to: "holder" })] });
mythic({
  name: "Ember palms", slot: "weapon", rarity: "mythic", mythic: "monk",
  text: "Every hit the Monk lands adds a Burn. Every 5 ticks, it gains a Heat for each burning foe, up to three at a time.",
  weapon: { type: "physical", hands: 1, cooldown: 6.0, amount: ownHit(6.0, "attack") },
  statuses: ["ember_palms", "ember_palms_two", "ember_palms_three"],
}, [pull("bonfire", 3, 3), pull("cuts", 2)]);
helper(pieceStatus("ember_palms", "Ember palms", "Every hit it lands adds a Burn. Every 5 ticks, a Heat for each burning foe, up to three.", {
  reactions: [{ on: { event: "hit_lands" }, do: [apply("burn", { stacks: 1, to: "other" })] }],
  pulse: emberHeat(1),
}));
helper(pieceStatus("ember_palms_two", "Ember palms", "A second Heat while two foes burn.", { pulse: emberHeat(2) }));
helper(pieceStatus("ember_palms_three", "Ember palms", "A third Heat while three foes burn.", { pulse: emberHeat(3) }));

// Assassin: a killing blow it lands (X2, X29) hides it, at Hidden's own length if it isn't Hidden already, and doubles its next hit.
mythic({
  name: "Night's edge", slot: "armor", rarity: "mythic", mythic: "assassin",
  text: "When the Assassin lands a killing blow, it's Hidden for a moment, and its next hit deals double damage.",
  statuses: ["nights_edge"],
}, [pull("hunt", 3, 3), pull("ambush", 2)]);
helper(pieceStatus("nights_edge", "Night's edge", "When it lands a killing blow, it's Hidden, and its next hit deals double damage.", {
  reactions: [{ on: { event: "ko", whose: "foe", other: "holder" }, do: [apply("hidden", { to: { side: "self", where: { lacks: "hidden" } } }), apply("nights_edge_strike", { to: "self" })] }],
}));
helper(kit("nights_edge_strike", "NIGHT'S EDGE", "Its next hit deals double damage.", {
  stacking: "fizzle", boosts: both(100),
  reactions: [{ on: { event: "hit_lands" }, do: [removeMine("nights_edge_strike")] }],
}));

// Vampire: each ally's fall heals it to full and adds a debt; each killing blow it lands while in debt raises a fallen ally (G10: on cooldown).
mythic({
  name: "Thrall's chalice", slot: "offhand", rarity: "mythic", mythic: "vampire",
  text: "When an ally falls, the Vampire heals to full. The next time the Vampire lands a killing blow, a fallen ally rises with a quarter of its max HP.",
  statuses: ["thralls_chalice"],
}, [pull("phoenix", 3, 3), pull("pact", 2)]);
helper(pieceStatus("thralls_chalice", "Thrall's chalice", "When an ally falls, it heals to full, and the next killing blow it lands raises a fallen ally.", {
  reactions: [{
    on: { event: "ko", whose: "ally" },
    do: [{ op: "heal", amount: { scale: [{ ratio: 1, stat: "max_hp", of: "holder" }] }, to: "holder" }, apply("thralls_chalice_debt", { stacks: 1, to: "holder" })],
  }],
}));
const killBlow = { event: "ko" as const, whose: "foe" as const, other: "holder" as const };
helper(kit("thralls_chalice_debt", "THRALL'S CHALICE", "The next killing blow it lands raises a fallen ally.", {
  stacking: "intensity", unremovable: true,
  // The rise is a reaction (one a kill, at a quarter, never scaled by the debt); the trigger spends one debt on the same kill.
  reactions: [{ on: killBlow, do: [{ op: "revive", hp: { scale: [{ ratio: 0.25, stat: "max_hp", of: "target" }] }, to: T.koAlly }] }],
  trigger: { on: killBlow }, drop: { count: 1 },
}));

// Pyromancer: an aura on every ally that ends with the Pyromancer's knockout, given again when it or an ally is revived.
mythic({
  name: "Crown of embers", slot: "amulet", rarity: "mythic", mythic: "pyromancer",
  text: "While the Pyromancer stands, every ally's hits add a Burn.",
  statuses: ["crown_of_embers"],
}, [pull("bonfire", 3, 3)]);
helper(pieceStatus("crown_of_embers", "Crown of embers", "While it stands, every ally's hits add a Burn.", {
  reactions: [
    { on: { event: "fight_start" }, do: [apply("crown_of_embers_aura", { to: T.everyAlly })] },
    { on: { event: "revived" }, do: [apply("crown_of_embers_aura", { to: T.everyAlly })] },
    { on: { event: "revived", whose: "ally" }, do: [apply("crown_of_embers_aura", { to: "owner" })] },
  ],
}));
helper(kit("crown_of_embers_aura", "CROWN OF EMBERS", "Its hits add a Burn while the Pyromancer stands.", {
  perSource: { endsWithSource: true }, unremovable: true,
  reactions: [{ on: { event: "hit_lands" }, do: [apply("burn", { stacks: 1, to: "other" })] }],
}));

// Frostweaver: after a shatter spends a foe's Chill, half the cap goes back on (it listens for the end, cause removed, not the cap).
mythic({
  name: "Glacier's heart", slot: "armor", rarity: "mythic", mythic: "frostweaver",
  text: "Whenever a foe's Chill shatters, the Frostweaver puts half of it back: 6 Chill on that foe.",
  statuses: ["glaciers_heart"],
}, [pull("snap", 3, 3)]);
helper(pieceStatus("glaciers_heart", "Glacier's heart", "Whenever a foe's Chill shatters, 6 Chill go back on that foe.", {
  reactions: [{ on: { event: "status_ended", status: "chill", cause: ["removed"], whose: "foe" }, do: [apply("chill", { stacks: STATUS.chill.cap / 2, to: "owner" })] }],
}));

// Stormcaller: each basic attack's and ability's hit strikes one more random foe for half its raw damage (X28); the jump, an extra
// hit, doesn't jump again. A foe dying with Shock gives every other foe half of it (spec section 6: status_ended, cause ko, its amount, X1).
mythic({
  name: "Eye of the tempest", slot: "weapon", rarity: "mythic", mythic: "stormcaller",
  text: "Every hit the Stormcaller lands jumps to one more random foe for half its damage. When a foe falls holding Shock, every other foe gains half of it.",
  weapon: { type: "magical", hands: 1, cooldown: 6.6, amount: ownHit(6.6, "magic") },
  statuses: ["eye_of_the_tempest"],
  note: "Only basic attacks' and abilities' hits jump. A jump is an extra hit (X28), and a reaction to extra hits would hear its own jumps and loop, so Arc's and Double strike's extra strikes don't jump either.",
}, [pull("harvest", 3, 3)]);
const jump = (kind: "basic" | "ability"): ReactionT => ({ on: { event: "hit_lands", kind }, do: [{ op: "strike", share: 50, of: "hit", to: { side: "foes", pick: "random", exclude: "other" } }] });
helper(pieceStatus("eye_of_the_tempest", "Eye of the tempest", "Every hit it lands jumps to one more foe for half; a foe that falls with Shock gives every other foe half of it.", {
  reactions: [
    jump("basic"),
    jump("ability"),
    { on: { event: "status_ended", status: "shock", cause: ["ko"], whose: "foe" }, do: [apply("shock", { stacks: { scale: [{ ratio: 0.5, amount: true }] }, to: { side: "foes", pick: "all", exclude: "owner" } })] },
  ],
}));

// Geomancer: each crit it lands rebuilds its Shield by the damage dealt, up to the Shield's own cap.
mythic({
  name: "Mountain's crown", slot: "amulet", rarity: "mythic", mythic: "geomancer",
  text: "Each crit the Geomancer lands rebuilds its own Shield by the damage the crit dealt.",
  statuses: ["mountains_crown"],
}, [pull("landslide", 3, 3)]);
helper(pieceStatus("mountains_crown", "Mountain's crown", "Each crit it lands rebuilds its Shield by the damage dealt.", {
  reactions: [{ on: { event: "hit_lands", tags: ["crit"] }, do: [apply("shield", { stacks: { scale: [{ ratio: 1, amount: true }] }, to: "self" })] }],
}));
