/**
 * Step 5i, step 5: the upgrades of the Knight, Cleric, Ranger, Bramble knight, Hoplite, Paladin, Valkyrie and Bard (a power step and two versions for each ability and passive, as five forms
 * each) and their mythics, from steps/05-core-set/5i-synergy/fill/upgrades-1.md with fill-rulings.md (its third round wins).
 * `upgrades` joins the pack's upgrades, `abilities` (the ability forms) its abilities, `statuses` (passive forms and helpers, and the mythics' statuses) its
 * statuses, `mythics` its gear and the rogue's stock; `builds` is designer data, never in the pack.
 *
 * Every form is built from its class's ability or passive as classes.ts has it: a form changes only what its line changes. The power step is the
 * fill's (two fifths more of an amount or stacks, one cooldown word shorter, or one rung down the MP ladder), and lands on a version as the fill says.
 * Engine additions are written in build/engine-spec.md's shapes (X1 onward); the engine acts on them once wave 2's engine shares land.
 */
import type { AbilityT, EffectT, GearT, NumT, ReactionT, StatusT, TargetRuleT, ToT, UpgradeT } from "../../../src/schema.js";
import { formId, type UpgradeFormT } from "../../../src/schema.js";
import { abilities as classAbilities, passives as classPassives, T } from "../classes.js";
import { COOLDOWN, KIND_SPEED, SPECIAL, STATUS, SWING_REF, WINDUP, from, jitter, stacks } from "../scale.js";
import { own, piece, pieceStatus, weaponHit, type Build, type Builds } from "../pieces/kit.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

type CD = keyof typeof COOLDOWN;
/** A cooldown word, moved by the base ability's id as classes.ts moves it, so every form of an ability keeps its offset. */
const cd = (word: CD, id: string) => jitter(COOLDOWN[word], id);
/** The power step on the quick word, which has none below it: a quarter off. Whole sub-ticks. */
const quarterOff = (t: number) => Math.round(t * 0.75 * 1000) / 1000;
const r6 = (x: number) => Math.round(x * 1e6) / 1e6;
/** n × k: every part of a number, for "two fifths more" (× 1.4) and "twice as much". */
const times = (n: NumT, k: number): NumT =>
  typeof n === "number" ? r6(n * k) : { ...(n.base !== undefined ? { base: r6(n.base * k) } : {}), scale: n.scale.map((t) => ({ ...t, ratio: r6(t.ratio * k) })) };
const MORE = 1.4;

const apply = (status: string, extra: Partial<Extract<EffectT, { op: "apply" }>> = {}): EffectT => ({ op: "apply", status, ...extra }) as EffectT;
const phys = (amount: NumT, extra: object = {}): EffectT => ({ op: "damage", type: "physical", amount, ...extra }) as EffectT;
const magic = (amount: NumT, extra: object = {}): EffectT => ({ op: "damage", type: "magical", amount, ...extra }) as EffectT;
const removeBuff = (status: string, to: ToT = "holder"): EffectT => ({ op: "remove", label: "buff", status, to }) as EffectT;
const removeMarker = (status: string, to: ToT = "holder"): EffectT => ({ op: "remove", label: "marker", status, to }) as EffectT;
const both = (pct: NumT) => [{ tag: "physical", pct }, { tag: "magical", pct }];
/** A status's stat read off its holder: `of: holder`, as a status must say. */
const ofHolder = (ratio: number, stat: string): NumT => ({ scale: [{ ratio, stat, of: "holder" }] });

/** The phrase "the ally foes are most drawn to" (upgrades-1.md): a Taunting ally if there is one (the most Aggro among several), otherwise the most Aggro. */
const DRAWN: TargetRuleT = { side: "allies", where: { has: "taunt" }, ifNone: "any", pick: "highest", by: { stat: "aggro" } };

const baseAbility = (id: string): AbilityT => {
  const a = classAbilities.find((x) => x.id === id);
  if (!a) throw new Error(`no class ability '${id}'`);
  return a as AbilityT;
};
const basePassive = (id: string): StatusT => {
  const s = classPassives.find((x) => x.id === id);
  if (!s) throw new Error(`no class passive '${id}'`);
  return s;
};
/** Drops keys set to undefined, so a form can take away a field its base had (a condition, Seek). */
const clean = <O extends object>(o: O): O => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as O;

type Version = { name: string; text: string };
type Changes = Partial<Omit<AbilityT, "id" | "class" | "name">> & { text?: string };
/**
 * One ability's upgrade: its card lines, and each form as the changes from the base ability. `ap` and `bp` are written in full
 * (a version with the power step), so every number in a form is visible where it's set.
 */
function abilityUpgrade(cls: string, id: string, u: { power: string; a: Version; b: Version; p: Changes; va: Changes; vb: Changes; ap: Changes; bp: Changes }) {
  const base = baseAbility(id);
  const form = (f: UpgradeFormT, name: string, text: string, ch: Changes): AbilityT =>
    clean({ ...base, ...ch, id: formId(id, f), class: cls, name, text: ch.text ?? text });
  const forms = [
    form("p", `${base.name}+`, base.text, u.p),
    form("a", u.a.name, u.a.text, u.va),
    form("b", u.b.name, u.b.text, u.vb),
    form("ap", `${u.a.name}+`, u.a.text, u.ap),
    form("bp", `${u.b.name}+`, u.b.text, u.bp),
  ];
  const up: UpgradeT = { id, class: cls, kind: "ability", power: u.power, a: u.a, b: u.b };
  return { up, forms };
}

type PassiveChanges = Partial<Omit<StatusT, "id" | "name">> & { text: string };
/** One passive's upgrade: each form a status that takes the passive status's place, as the base is (a buff on the sheet, unremovable). */
function passiveUpgrade(cls: string, id: string, u: { power: string; a: Version; b: Version; p: PassiveChanges; va: PassiveChanges; vb: PassiveChanges; ap: PassiveChanges; bp: PassiveChanges }) {
  const base = basePassive(id);
  const form = (f: UpgradeFormT, name: string, ch: PassiveChanges): StatusT =>
    clean({ label: base.label, show: base.show, stacking: base.stacking, unremovable: base.unremovable, ...ch, id: formId(id, f), name }) as StatusT;
  const forms = [form("p", `${base.name}+`, u.p), form("a", u.a.name, u.va), form("b", u.b.name, u.vb), form("ap", `${u.a.name}+`, u.ap), form("bp", `${u.b.name}+`, u.bp)];
  const up: UpgradeT = { id, class: cls, kind: "passive", power: u.power, a: u.a, b: u.b };
  return { up, forms };
}

/** A helper status a version brings or applies: a buff with an icon unless it says otherwise. */
const helper = (id: string, name: string, text: string, body: Partial<StatusT>): StatusT => ({ id, name, text, label: "buff", show: "icon", stacking: "refresh", ...body }) as StatusT;
/** Bookkeeping (X14): neither buff nor debuff, lifted only by a remove that names it. */
const marker = (id: string, name: string, text: string, body: Partial<StatusT>): StatusT => ({ id, name, text, label: "marker", show: "sheet", stacking: "refresh", ...body }) as StatusT;

const ups: ReturnType<typeof abilityUpgrade | typeof passiveUpgrade>[] = [];
const helpers: StatusT[] = [];
const buildTags: Builds = {};
/** Designer data: version A's and B's builds, on their forms with and without the power step (worth ●● each; the fill names builds, not worth). */
function tag(id: string, a: Build[], b: Build[]) {
  for (const [f, list] of [["a", a], ["ap", a], ["b", b], ["bp", b]] as const) buildTags[formId(id, f)] = list.map((build) => ({ build, worth: 2 }));
}

// ═══ Knight ══════════════════════════════════════════════════════════════════

const vanguardShield = (ratio: number): EffectT => apply("shield", { stacks: ofHolder(ratio, "max_hp"), to: "holder" });
/** Stonewall: the other ally with the lowest Aggro starts behind a Shield of the Knight's size, up to half its own max HP (the Shield's own cap). */
const stonewallShield = (ratio: number): EffectT => apply("shield", { stacks: ofHolder(ratio, "max_hp"), to: { side: "others", pick: "lowest", by: { stat: "aggro" } } });
const grudge: ReactionT = { on: { event: "status_ended", status: "shield", cause: ["stacks"] }, do: [apply("taunt", { to: "holder" }), apply("guard", { to: "holder" })] };
ups.push(passiveUpgrade("knight", "vanguard", {
  power: "A Shield two fifths bigger.",
  a: { name: "Stonewall", text: "Starts every fight behind a Shield from its max HP. The other ally with the lowest Aggro starts behind a Shield of the same size." },
  b: { name: "Grudge", text: "Starts every fight behind a Shield from its max HP. When its Shield breaks, it Taunts and is Guarded." },
  p: { text: "Starts every fight behind a bigger Shield from its max HP.", reactions: [{ on: { event: "fight_start" }, do: [vanguardShield(0.28)] }] },
  va: { text: "Starts every fight behind a Shield from its max HP; so does the other ally with the lowest Aggro.", reactions: [{ on: { event: "fight_start" }, do: [vanguardShield(0.2), stonewallShield(0.2)] }] },
  vb: { text: "Starts every fight behind a Shield from its max HP. When it breaks, it Taunts and is Guarded.", reactions: [{ on: { event: "fight_start" }, do: [vanguardShield(0.2)] }, grudge] },
  ap: { text: "Starts every fight behind a bigger Shield from its max HP; so does the other ally with the lowest Aggro.", reactions: [{ on: { event: "fight_start" }, do: [vanguardShield(0.28), stonewallShield(0.28)] }] },
  bp: { text: "Starts every fight behind a bigger Shield from its max HP. When it breaks, it Taunts and is Guarded.", reactions: [{ on: { event: "fight_start" }, do: [vanguardShield(0.28)] }, grudge] },
}));
tag("vanguard", ["landslide", "ambush"], ["toll", "lockdown"]);

{
  /** Stone guard: the other ally with the most Armor, Guarded and given a Shield of a quarter of the Knight's Armor, read when it lands. */
  const stoneGuard: Changes = { target: { side: "others", pick: "highest", by: { stat: "armor" } }, do: [apply("guard"), apply("shield", { stacks: { scale: [{ ratio: 0.25, stat: "armor", of: "self" }] } })] };
  /**
   * Cover: another ally in a wind-up; with nobody else casting, the other ally with the lowest share of HP. The fill's "the one with the most wind-up
   * left" has no `by` in the schema (no engine addition names it), so among two casters it's the one lower in HP: the rule's fallback does the rest.
   */
  const cover: Changes = { target: { side: "others", where: { casting: true }, ifNone: "any", pick: "lowest", by: "hp_share" } };
  ups.push(abilityUpgrade("knight", "fortify", {
    power: "Comes round sooner.",
    a: { name: "Stone guard", text: "Guards the other ally with the most Armor, and gives it a Shield from the Knight's Armor." },
    b: { name: "Cover", text: "Guards another ally in a wind-up. With nobody else casting, the other ally with the lowest share of HP." },
    p: { cooldown: cd("medium", "fortify") },
    va: stoneGuard,
    vb: cover,
    ap: { ...stoneGuard, cooldown: cd("medium", "fortify") },
    bp: { ...cover, cooldown: cd("medium", "fortify") },
  }));
  tag("fortify", ["landslide"], ["bonfire", "overflow", "lockdown"]);
}

{
  const rallyTheWell: Changes = { if: { side: "allies", where: { mpBelow: 50 } }, target: { side: "allies", where: { mpBelow: 50 }, pick: "all" }, do: [apply("clarity")] };
  const holdTheLine: Changes = { do: [apply("taunt"), apply("hold_the_line")] };
  helpers.push(helper("hold_the_line", "HOLD THE LINE", "Thorns up.", { duration: STATUS.taunt.duration, stats: [{ stat: "thorns", flat: SPECIAL.thorns.medium }] }));
  ups.push(abilityUpgrade("knight", "stand_fast", {
    power: "Costs less MP.",
    a: { name: "Rally the well", text: "Gives Clarity to every ally under half its MP. Waits until one is. No Taunt." },
    b: { name: "Hold the line", text: "Taunts, and has Thorns for as long as the Taunt. No Clarity." },
    p: { mp: 125 },
    va: rallyTheWell,
    vb: holdTheLine,
    ap: { ...rallyTheWell, mp: 125 },
    bp: { ...holdTheLine, mp: 125 },
  }));
  tag("stand_fast", ["overflow"], ["toll"]);
}

{
  const bash = (ratio: number, extra: object = {}) => phys(from("max_hp", ratio), extra);
  const measured = (ratio: number): Changes => ({
    if: { side: "foes", where: { casting: true } },
    target: { side: "foes", where: { casting: true, lacks: "stun" }, ifNone: "any", pick: "highest", by: { stats: ["attack", "magic"] } },
    do: [bash(ratio, { apply: [{ status: "stun" }] })],
  });
  /** Crushing bash: from max HP and its Shield together, double; it reads the Shield and doesn't spend it. A random foe: no Stun to aim. */
  const crushing = (ratio: number): Changes => ({
    target: "foe", cooldown: cd("long", "shield_bash"),
    do: [phys({ scale: [{ ratio, stat: "max_hp" }, { ratio, stacks: "shield", of: "self" }] })],
  });
  ups.push(abilityUpgrade("knight", "shield_bash", {
    power: "Deals two fifths more damage.",
    a: { name: "Measured blow", text: "Waits for a foe to start a wind-up, then bashes the casting foe with the highest Attack or Magic, scaling from max HP, and Stuns it. The Stun holds the wind-up where it is." },
    b: { name: "Crushing bash", text: "Bashes a random foe for double, scaling from max HP and its current Shield together. No Stun. A longer cooldown." },
    p: { do: [bash(0.406, { apply: [{ status: "stun" }] })] },
    va: measured(0.29),
    vb: crushing(0.58),
    ap: measured(0.406),
    bp: crushing(0.812),
  }));
  tag("shield_bash", ["lockdown"], ["landslide"]);
}

// ═══ Cleric ══════════════════════════════════════════════════════════════════

{
  const on = apply("last_rites_on", { to: "holder" });
  const off = removeBuff("last_rites_on");
  /** Today's pair, at a line: below it the cooldowns halve; healed back to it, they return. */
  const own = (line: number): ReactionT[] => [
    { on: { event: "hp_lost" }, do: [apply("last_rites_on", { to: { side: "self", where: { hpBelow: line } } })] },
    { on: { event: "healed" }, do: [removeBuff("last_rites_on", { side: "self", where: { hpAtLeast: line } })] },
  ];
  /** Shared rites (X3): the same, read off the whole side, whenever anyone's HP moves, falls or returns. */
  const shared = (line: number): ReactionT[] => {
    const low = { side: "allies" as const, where: { hpBelow: line } };
    const none = { side: "allies" as const, where: { hpBelow: line }, atMost: 0 };
    return [
      { on: { event: "hp_lost" }, if: low, do: [on] },
      { on: { event: "hp_lost", whose: "ally" }, if: low, do: [on] },
      { on: { event: "revived" }, if: low, do: [on] },
      { on: { event: "revived", whose: "ally" }, if: low, do: [on] },
      { on: { event: "healed" }, if: none, do: [off] },
      { on: { event: "healed", whose: "ally" }, if: none, do: [off] },
      { on: { event: "ko", whose: "ally" }, if: none, do: [off] },
    ];
  };
  const rite: ReactionT = { on: { event: "ko", whose: "ally" }, do: [apply("rite_of_passage", { to: "holder" })] };
  helpers.push(helper("rite_of_passage", "RITE OF PASSAGE", "Cooldowns halved.", { duration: 20, stats: [{ stat: "cooldown_reduction", flat: 100 }] }));
  ups.push(passiveUpgrade("cleric", "last_rites", {
    power: "The line is at 40% of max HP, not 30%.",
    a: { name: "Shared rites", text: "While it or any ally is below 30% of max HP, its cooldowns are halved." },
    b: { name: "Rite of passage", text: "Below 30% of its max HP, its cooldowns are halved. When an ally falls, they're halved for 20 ticks too." },
    p: { text: "Cooldowns halved below 40% HP.", reactions: own(40) },
    va: { text: "Cooldowns halved while it or any ally is below 30% HP.", reactions: shared(30) },
    vb: { text: "Cooldowns halved below 30% HP, and for 20 ticks after an ally falls.", reactions: [...own(30), rite] },
    ap: { text: "Cooldowns halved while it or any ally is below 40% HP.", reactions: shared(40) },
    bp: { text: "Cooldowns halved below 40% HP, and for 20 ticks after an ally falls.", reactions: [...own(40), rite] },
  }));
  tag("last_rites", ["toll", "phoenix", "pact"], ["phoenix"]);
}

{
  const font: Changes = { do: [{ op: "remove", label: "debuff" }, apply("regen"), apply("clarity")] };
  const anchor: Changes = { target: DRAWN };
  ups.push(abilityUpgrade("cleric", "renew", {
    power: "Costs less MP.",
    a: { name: "Font", text: "Cleanses an ally with a debuff and gives it Regen and Clarity; with nobody debuffed, the ally with the lowest share of HP." },
    b: { name: "Anchor's blessing", text: "Cleanses the ally foes are most drawn to and gives it Regen." },
    p: { mp: 450 },
    va: font,
    vb: anchor,
    ap: { ...font, mp: 450 },
    bp: { ...anchor, mp: 450 },
  }));
  tag("renew", ["overflow"], ["toll"]);
}

{
  const heal = (ratio: number): EffectT => ({ op: "heal", amount: from("magic", ratio) });
  const triage = (ratio: number): Changes => ({ if: { side: "allies", where: { hpBelow: 40 } }, do: [heal(ratio)] });
  /** Battle prayer: the next basic attack carries the heal's amount again as magical damage, once (Refresh: a second Cure doesn't add a second). */
  const prayer = (id: string, ratio: number) =>
    helper(id, "BATTLE PRAYER", "Its next basic attack deals extra magical damage.", {
      riders: [{ on: "basic", add: { type: "magical", amount: ofHolder(ratio, "magic") } }],
      reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [removeBuff(id)] }],
    });
  helpers.push(prayer("battle_prayer", 0.35), prayer("battle_prayer_plus", 0.49));
  ups.push(abilityUpgrade("cleric", "cure", {
    power: "Heals two fifths more.",
    a: { name: "Triage", text: "Waits until an ally is below 40% of its max HP, then heals it for twice as much." },
    b: { name: "Battle prayer", text: "Heals the ally with the lowest share of HP. Its next basic attack deals the same amount again as extra magical damage." },
    p: { do: [heal(0.49)] },
    va: triage(0.7),
    vb: { do: [heal(0.35), apply("battle_prayer", { to: "self" })] },
    ap: triage(0.98),
    bp: { do: [heal(0.49), apply("battle_prayer_plus", { to: "self" })] },
  }));
  tag("cure", ["pact", "phoenix"], ["pact", "landslide"]);
}

{
  const raiseHp = (ratio: number): NumT => ({ scale: [{ ratio, stat: "max_hp", of: "target" }] });
  /** Martyr's raise (X23, G12): the revive reads the Cleric's HP first, then the Cleric pays half its current HP. No MP. */
  const martyr = (ratio: number): Changes => ({
    mp: 0,
    do: [{ op: "revive", hp: { scale: [{ ratio, hp: "current", of: "self" }] } }, { op: "pay", hp: { scale: [{ ratio: 0.5, hp: "current", of: "self" }] }, to: "self" }],
  });
  /**
   * Ward of life (X41 in full): waits for a fallen ally or one below a third. Each part has its own target, and an effect has no condition of its
   * own, so when both hold it does both: it raises the fallen and shields the lowest ally below a third.
   */
  const ward = (raise: number, shield: number): Changes => ({
    cast: WINDUP.normal,
    if: { any: [{ side: "allies", where: { ko: true } }, { side: "allies", where: { hpBelow: 33 } }] },
    target: "self",
    do: [
      { op: "revive", hp: raiseHp(raise), to: T.koAlly },
      apply("shield", { stacks: { scale: [{ ratio: shield, stat: "max_hp", of: "target" }] }, to: { side: "allies", where: { hpBelow: 33 }, pick: "lowest", by: "hp_share" } }),
    ],
  });
  ups.push(abilityUpgrade("cleric", "raise", {
    power: "The raised ally comes back with two fifths more HP.",
    a: { name: "Martyr's raise", text: "Pays half its current HP to revive a random knocked-out ally with that much. Costs no MP." },
    b: { name: "Ward of life", text: "Waits until an ally is knocked out or below a third of its max HP. Revives a random knocked-out ally with half its HP, and gives the lowest ally below a third a Shield of a third of its max HP." },
    p: { do: [{ op: "revive", hp: raiseHp(0.7) }] },
    va: martyr(0.5),
    vb: ward(0.5, 1 / 3),
    ap: { ...martyr(0.7), text: "Pays half its current HP to revive a random knocked-out ally with two fifths more than that. Costs no MP." },
    bp: ward(0.7, (1 / 3) * MORE),
  }));
  tag("raise", ["pact", "phoenix"], ["toll", "pact"]);
}

// ═══ Ranger ══════════════════════════════════════════════════════════════════

{
  const notTaunting: Partial<StatusT> = { boosts: [{ tag: "basic", pct: { scale: [{ ratio: 15, when: { lacks: "taunt" }, of: "target" }] } }] };
  const quarry: Partial<StatusT> = { aim: { rule: { side: "foes", pick: "lowest", by: "hp_share" } } };
  const overwatch: Partial<StatusT> = { aim: { rule: { side: "foes", where: { casting: true }, pick: "highest", by: { stats: ["attack", "magic"] } } } };
  ups.push(passiveUpgrade("ranger", "hunters_eye", {
    power: "Its basic attacks also deal 15% more to foes that aren't Taunting.",
    a: { name: "Quarry", text: "Basic attacks ignore Taunt and go to the foe with the lowest share of its max HP." },
    b: { name: "Overwatch", text: "Basic attacks ignore Taunt, and go to a foe in a wind-up when there is one." },
    p: { text: "Basic attacks ignore Taunt, and deal 15% more to foes that aren't Taunting.", seek: "basic", ...notTaunting },
    va: { text: "Basic attacks ignore Taunt and go to the foe lowest in HP share.", seek: "basic", ...quarry },
    vb: { text: "Basic attacks ignore Taunt and go to a foe in a wind-up when there is one.", seek: "basic", ...overwatch },
    ap: { text: "Basic attacks ignore Taunt, go to the foe lowest in HP share, and deal 15% more to foes that aren't Taunting.", seek: "basic", ...quarry, ...notTaunting },
    bp: { text: "Basic attacks ignore Taunt, go to a foe in a wind-up when there is one, and deal 15% more to foes that aren't Taunting.", seek: "basic", ...overwatch, ...notTaunting },
  }));
  tag("hunters_eye", ["hunt"], ["lockdown"]);
}

{
  const arrow = (word: "several" | "many", k: number) => phys(from("attack", 0.29), { apply: [{ status: "bleed", stacks: stacks(word, "attack", k) }] });
  const deep = (k: number): Changes => ({ target: T.mostFoe("bleed"), do: [arrow("many", k)] });
  /** Scatter barbs: three different foes, a touch and a few Bleed each, as Chain lightning's two damage effects. */
  const scatter = (k: number): Changes => {
    const barb = (to?: TargetRuleT) => phys(from("attack", 0.17), { apply: [{ status: "bleed", stacks: stacks("few", "attack", k) }], ...(to ? { to } : {}) });
    return { do: [barb(), barb({ side: "foes", pick: "random", count: 2, exclude: "targets" })] };
  };
  ups.push(abilityUpgrade("ranger", "barbed_arrow", {
    power: "Adds two fifths more Bleed.",
    a: { name: "Deep barbs", text: "A barbed arrow at the foe with the most Bleed, adding many." },
    b: { name: "Scatter barbs", text: "Barbed arrows at three different foes, each a touch of damage and a few Bleed." },
    p: { do: [arrow("several", MORE)] },
    va: deep(1),
    vb: scatter(1),
    ap: deep(MORE),
    bp: scatter(MORE),
  }));
  tag("barbed_arrow", ["hunt", "cuts"], ["harvest", "toll"]);
}

{
  const pinning = (ratio: number): Changes => ({ target: T.highestAMFoe, do: [phys(from("attack", ratio), { apply: [{ status: "slow" }] })] });
  /** Hail: the arrow carries no Chill; one Chill (flat) lands on every foe. */
  const hail = (n: number): Changes => ({ do: [phys(from("attack", 0.29)), apply("chill", { stacks: n, to: T.everyFoe })] });
  ups.push(abilityUpgrade("ranger", "frost_arrow", {
    power: "Adds two fifths more Chill (Pinning arrow: deals two fifths more damage).",
    a: { name: "Pinning arrow", text: "A quick arrow at the foe with the highest Attack or Magic, which is Slowed. No Chill." },
    b: { name: "Hail", text: "A quick arrow at the foe with the most Chill, and one Chill on every foe." },
    p: { do: [phys(from("attack", 0.29), { apply: [{ status: "chill", stacks: stacks("few", "attack", 0.5 * MORE) }] })] },
    va: pinning(0.29),
    vb: hail(1),
    ap: pinning(0.406),
    bp: { ...hail(MORE), text: "A quick arrow at the foe with the most Chill, and a little more than one Chill on every foe." },
  }));
  tag("frost_arrow", ["lockdown"], ["snap"]);
}

{
  const breaker = (k: number): Changes => ({ target: { side: "foes", pick: "highest", by: { stat: "armor" } }, do: [phys(from("attack", 0.5), { apply: [{ status: "sunder", stacks: stacks("several", "attack", k) }] })] });
  /** Gutting arrow: a normal hit, half again below half the target's HP, double below a quarter. `times` reads the Ranger's Attack. */
  const gutting = (k: number): Changes => ({
    target: T.lowestHpFoe,
    do: [phys({ scale: [
      { ratio: r6(0.5 * k), stat: "attack" },
      { ratio: r6(0.25 * k), when: { hpBelow: 50 }, of: "target", times: { stat: "attack", of: "self" } },
      { ratio: r6(0.25 * k), when: { hpBelow: 25 }, of: "target", times: { stat: "attack", of: "self" } },
    ] })],
  });
  ups.push(abilityUpgrade("ranger", "rending_arrow", {
    power: "Adds two fifths more Sunder (Gutting arrow: deals two fifths more damage).",
    a: { name: "Armor breaker", text: "An arrow at the foe with the most Armor, adding several Sunder." },
    b: { name: "Gutting arrow", text: "An arrow at the foe with the lowest HP. Half again as much below half its HP, double below a quarter. No Sunder." },
    p: { do: [phys(from("attack", 0.5), { apply: [{ status: "sunder", stacks: stacks("few", "attack", MORE) }] })] },
    va: breaker(1),
    vb: gutting(1),
    ap: breaker(MORE),
    bp: gutting(MORE),
  }));
  tag("rending_arrow", ["cuts", "landslide"], ["hunt"]);
}

// ═══ Bramble knight ══════════════════════════════════════════════════════════

{
  /**
   * Briar's Bleed on each blow its Thorns deal. Every form also hears Heartwood mail's strikes (the mythic's Thorns on the attackers of allies), which
   * the fill has Briar follow; the base Briar is classes.ts's, so the mythic itself bleeds for it (see Heartwood mail).
   */
  const bleedOn = (status: string, k: number, more: EffectT[] = []): ReactionT => ({ on: { event: "damage_dealt", status }, do: [apply("bleed", { stacks: own("few", "armor", k), to: "other" }), ...more] });
  const THORNS = ["thorns", "heartwood_mail"];
  const plain = (k: number) => THORNS.map((s) => bleedOn(s, k));
  /** Bloodroot: a debuff that knows its source; each action its holder takes heals the Bramble knight 1.5% of its max HP, until the Bleed ends. */
  const bloodroot = (k: number) => THORNS.map((s) => bleedOn(s, k, [apply("bloodroot", { to: "other" })]));
  helpers.push({
    id: "bloodroot", name: "BLOODROOT", text: "Each action it takes heals the one whose thorns rooted it.", label: "debuff", show: "icon", stacking: "refresh", perSource: { endsWithSource: true },
    reactions: [
      { on: { event: "action_resolve" }, actor: "source", do: [{ op: "heal", amount: { scale: [{ ratio: 0.015, stat: "max_hp", of: "source" }] }, to: "source" }] },
      { on: { event: "status_ended", status: "bleed" }, do: [{ op: "remove", label: "debuff", status: "bloodroot", to: "holder" }] },
    ],
  });
  /** Spreading thorns: each Thorns strike also strikes a random other foe for the full Thorns (X10). It's the form's own damage, so it never chains, and Briar bleeds it too. */
  const spreading = (self: string, k: number): ReactionT[] => [
    ...THORNS.map((s) => bleedOn(s, k)),
    bleedOn(self, k),
    ...THORNS.map((s): ReactionT => ({ on: { event: "damage_dealt", status: s }, do: [{ op: "damage", type: "none", amount: ofHolder(1, "thorns"), to: { side: "foes", pick: "random", exclude: "other" } }] })),
  ];
  ups.push(passiveUpgrade("bramble_knight", "briar", {
    power: "Two fifths more Bleed.",
    a: { name: "Bloodroot", text: "Foes its Thorns wound start to bleed. While a foe bleeds, each action it takes heals the Bramble knight a little." },
    b: { name: "Spreading thorns", text: "When its Thorns strike, they strike a second, random foe too, and both start to bleed." },
    p: { text: "Foes its Thorns wound start to bleed, more.", reactions: plain(MORE) },
    va: { text: "Foes its Thorns wound bleed, and heal it a little with each action while they bleed.", reactions: bloodroot(1) },
    vb: { text: "Its Thorns strike a second, random foe too, and both bleed.", reactions: spreading("briar__b", 1) },
    ap: { text: "Foes its Thorns wound bleed more, and heal it a little with each action while they bleed.", reactions: bloodroot(MORE) },
    bp: { text: "Its Thorns strike a second, random foe too, and both bleed more.", reactions: spreading("briar__bp", MORE) },
  }));
  tag("briar", ["pact", "toll"], ["harvest"]);
}

{
  /**
   * Overgrowth: Taunt, then Taunt once more when it runs out (a marker spent by the second), and Thorns doubled for both. The doubling reads the
   * Thorns when it lands, so the cast lifts any Overgrowth still held first: with the power step (37.7 ticks) it comes back before the last one
   * ends, and a doubling read on top of itself would grow with every cast.
   */
  const overgrowth: Changes = { cooldown: cd("very_long", "thicket"), mp: 325, do: [apply("taunt"), removeBuff("overgrowth", "self"), apply("overgrowth"), apply("overgrowth_again")] };
  helpers.push(
    helper("overgrowth", "OVERGROWTH", "Thorns doubled.", { duration: 2 * STATUS.taunt.duration, stats: [{ stat: "thorns", flat: ofHolder(1, "thorns") }] }),
    marker("overgrowth_again", "OVERGROWTH", "Taunts once more when its Taunt runs out.", {
      reactions: [{ on: { event: "status_ended", status: "taunt", cause: ["expired"] }, do: [apply("taunt", { to: "holder" }), removeMarker("overgrowth_again")] }],
    }),
  );
  const grove: Changes = { cooldown: cd("long", "thicket"), mp: 325, target: T.everyAlly, do: [apply("guard")] };
  ups.push(abilityUpgrade("bramble_knight", "thicket", {
    power: "Comes round sooner.",
    a: { name: "Overgrowth", text: "Taunts itself twice over, and doubles its Thorns while the Taunts last. No Guard." },
    b: { name: "Grove", text: "Guards every ally. No Taunt." },
    p: { cooldown: cd("short", "thicket") },
    va: overgrowth,
    vb: grove,
    ap: { ...overgrowth, cooldown: cd("long", "thicket") },
    bp: { ...grove, cooldown: cd("medium", "thicket") },
  }));
  tag("thicket", ["toll"], ["landslide", "bonfire", "harvest"]);
}

{
  const deepRoots: Changes = { target: "self", do: [apply("regen"), apply("deep_roots")] };
  helpers.push(helper("deep_roots", "DEEP ROOTS", "Thorns up.", { duration: STATUS.regen.duration, stats: [{ stat: "thorns", flat: SPECIAL.thorns.medium }] }));
  /** Blossom: the whole Regen on every ally (statuses are universal, so not half as long), less often and dearer. */
  const blossom: Changes = { cooldown: cd("long", "regrowth"), mp: 500, target: T.everyAlly, do: [apply("regen")] };
  ups.push(abilityUpgrade("bramble_knight", "regrowth", {
    power: "Costs less MP.",
    a: { name: "Deep roots", text: "Regen on itself, and Thorns up while it heals." },
    b: { name: "Blossom", text: "Regen on every ally." },
    p: { mp: 200 },
    va: deepRoots,
    vb: blossom,
    ap: { ...deepRoots, mp: 200 },
    bp: { ...blossom, mp: 325 },
  }));
  tag("regrowth", ["toll"], ["pact", "harvest"]);
}

{
  const lash = (ratio: number) => phys({ scale: [{ ratio, stat: "thorns" }] });
  const vines = (ratio: number): Changes => ({ cooldown: cd("short", "bramble_lash"), mp: 325, target: T.everyFoe, do: [lash(ratio)] });
  /** Rebuke: waits for five hits taken since its last lash (a count the ability brings, X40), then lashes for double and spends the count. */
  const rebuke = (ratio: number): Changes => ({
    if: { side: "self", where: { stacks: { status: "rebuke_count", atLeast: 5 } } },
    statuses: ["rebuke"],
    do: [lash(ratio), removeMarker("rebuke_count", "self")],
  });
  helpers.push(
    marker("rebuke", "REBUKE", "Counts the hits it takes.", { unremovable: true, reactions: [{ on: { event: "hit_taken" }, do: [apply("rebuke_count", { to: "holder" })] }] }),
    marker("rebuke_count", "REBUKE", "Hits taken since its last lash.", { show: "icon", stacking: "intensity" }),
  );
  ups.push(abilityUpgrade("bramble_knight", "bramble_lash", {
    power: "Deals two fifths more damage.",
    a: { name: "Whipping vines", text: "Lashes every foe with its thorns, for half." },
    b: { name: "Rebuke", text: "Waits until it's been hit five times since its last lash, then lashes a random foe for double." },
    p: { do: [lash(6.3)] },
    va: vines(2.25),
    vb: rebuke(9),
    ap: vines(3.15),
    bp: rebuke(12.6),
  }));
  tag("bramble_lash", ["harvest"], ["toll"]);
}

// ═══ Hoplite ═════════════════════════════════════════════════════════════════

{
  const phalanx = (boost: number) => ({ stats: [{ stat: "attack_speed", flat: -100 }], boosts: [{ tag: "basic", pct: boost }] });
  /** Opening thrust: the basic attack's timer made ready at the start (X21), and +100% on the first swing, which adds to Phalanx's. */
  const opening: ReactionT = { on: { event: "fight_start" }, do: [{ op: "cooldown", which: "basic", set: "ready", to: "holder" }, apply("opening_thrust", { to: "holder" })] };
  helpers.push(helper("opening_thrust", "OPENING THRUST", "Its first basic attack deals more.", {
    boosts: [{ tag: "basic", pct: 100 }],
    reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [removeBuff("opening_thrust")] }, { on: { event: "hit_missed", kind: "basic" }, do: [removeBuff("opening_thrust")] }],
  }));
  /** Shieldbearer: a tenth of its Armor on each swing, sized by the held kind's interval as a swing is (X7 reads the kind), then Phalanx's boost. */
  const sized = (kind: string) => r6((0.1 * KIND_SPEED[kind]) / SWING_REF);
  const bearer: NonNullable<StatusT["riders"]> = [{ on: "basic", add: { type: "physical", amount: { scale: ["spear", "great_weapon"].map((kind) => ({ ratio: sized(kind), when: { weapon: [kind] }, of: "holder" as const, times: { stat: "armor", of: "holder" as const } })) } } }];
  ups.push(passiveUpgrade("hoplite", "phalanx", {
    power: "Its basic attacks deal a little more than double: × 2.4.",
    a: { name: "Opening thrust", text: "Basic attacks come half as often and deal double. The first of each fight comes at once and deals triple." },
    b: { name: "Shieldbearer", text: "Basic attacks come half as often and deal double. Armor adds to them half as much as Attack does." },
    p: { text: "Basic attacks half as often, for a little more than double damage.", ...phalanx(140) },
    va: { text: "Basic attacks half as often, for double damage; the first of each fight at once, for triple.", ...phalanx(100), reactions: [opening] },
    vb: { text: "Basic attacks half as often, for double damage, with Armor added.", ...phalanx(100), riders: bearer },
    ap: { text: "Basic attacks half as often, for a little more than double damage; the first of each fight at once, for more than triple.", ...phalanx(140), reactions: [opening] },
    bp: { text: "Basic attacks half as often, for a little more than double damage, with Armor added.", ...phalanx(140), riders: bearer },
  }));
  tag("phalanx", ["ambush", "landslide"], ["landslide"]);
}

{
  /**
   * Watch the anchor: Aegis on the ally with the most Aggro that holds none. The fill's phrase (a Taunting ally first) can't sit beside the Fizzle
   * rule in one target rule: `ifNone: any` drops the `lacks`, and the Aegis would fizzle on the anchor that already holds one.
   */
  const anchor: Changes = { target: { side: "allies", where: { lacks: "aegis" }, pick: "highest", by: { stat: "aggro" } } };
  const wall: Changes = { cooldown: cd("very_long", "aspis"), mp: 750, target: { side: "allies", where: { lacks: "aegis" }, pick: "all" } };
  ups.push(abilityUpgrade("hoplite", "aspis", {
    power: "Comes round sooner.",
    a: { name: "Watch the anchor", text: "Aegis on the ally with the most Aggro that holds none." },
    b: { name: "Shield wall", text: "Aegis on every ally." },
    p: { cooldown: cd("medium", "aspis") },
    va: anchor,
    vb: wall,
    ap: { ...anchor, cooldown: cd("medium", "aspis") },
    bp: { ...wall, cooldown: cd("long", "aspis") },
  }));
  tag("aspis", ["toll"], ["bonfire", "harvest"]);
}

{
  const line: Changes = { target: { side: "others", pick: "all" }, do: [apply("guard")] };
  const blade: Changes = { do: [apply("guard"), apply("guard", { to: { side: "others", pick: "highest", by: { stats: ["attack", "magic"] } } })] };
  ups.push(abilityUpgrade("hoplite", "paired_guard", {
    power: "Costs less MP.",
    a: { name: "Line of shields", text: "Guards both other allies. Not itself." },
    b: { name: "Guard the blade", text: "Guards itself and the other ally with the highest Attack or Magic." },
    p: { mp: 200 },
    va: line,
    vb: blade,
    ap: { ...line, mp: 200 },
    bp: { ...blade, mp: 200 },
  }));
  tag("paired_guard", ["harvest", "bonfire"], ["hunt", "ambush"]);
}

{
  const thrust = (ratio: number, extra: object = {}) => phys(from("attack", ratio), { apply: [{ status: "sunder", stacks: stacks("few", "attack") }], ...extra });
  const skewer = (ratio: number): Changes => ({ do: [thrust(ratio), thrust(ratio, { to: { side: "foes", pick: "highest", by: "hp", exclude: "targets" } })] });
  const hunters = (ratio: number): Changes => ({ seek: true, target: T.lowestHpFoe, do: [thrust(ratio)] });
  ups.push(abilityUpgrade("hoplite", "spear_thrust", {
    power: "Deals two fifths more damage.",
    a: { name: "Skewer", text: "A thrust through a random foe and on into the foe with the most HP, each for three quarters, each adding a few Sunder." },
    b: { name: "Hunter's thrust", text: "A thrust past any guard at the foe with the lowest HP, adding a few Sunder." },
    p: { do: [thrust(1.54)] },
    va: skewer(0.8),
    vb: hunters(1.1),
    ap: skewer(1.12),
    bp: hunters(1.54),
  }));
  tag("spear_thrust", ["harvest"], ["hunt"]);
}

// ═══ Paladin ═════════════════════════════════════════════════════════════════

{
  const bonus = (ratio: number, when: object) => ({ boosts: both({ scale: [{ ratio, when, of: "target" }] }) as StatusT["boosts"] });
  ups.push(passiveUpgrade("paladin", "judgement", {
    power: "The bonus is +70%, not half again.",
    a: { name: "Inquisition", text: "Its hits deal half again as much to foes with a debuff." },
    b: { name: "Sentence", text: "Its hits deal half again as much to the foe with the highest Attack or Magic." },
    p: { text: "Hits deal 70% more to foes with a buff.", ...bonus(70, { buffs: true }) },
    va: { text: "Hits deal half again as much to foes with a debuff.", ...bonus(50, { debuffs: true }) },
    vb: { text: "Hits deal half again as much to the foe with the highest Attack or Magic.", ...bonus(50, { top: { stats: ["attack", "magic"] } }) },
    ap: { text: "Hits deal 70% more to foes with a debuff.", ...bonus(70, { debuffs: true }) },
    bp: { text: "Hits deal 70% more to the foe with the highest Attack or Magic.", ...bonus(70, { top: { stats: ["attack", "magic"] } }) },
  }));
  tag("judgement", ["lockdown", "bonfire", "toll"], ["hunt"]);
}

{
  const sanctum: Changes = { mp: 1500, do: [apply("ward"), apply("shield", { stacks: { scale: [{ ratio: 0.25, stat: "magic", of: "self" }] } })] };
  const consecration: Changes = { do: [apply("ward"), apply("burn", { stacks: stacks("few", "magic"), to: T.everyFoe })] };
  ups.push(abilityUpgrade("paladin", "sanctuary", {
    power: "Comes round sooner.",
    a: { name: "Sanctum", text: "Ward and a Shield from Magic on every ally." },
    b: { name: "Consecration", text: "Ward on every ally, and a few Burn on every foe." },
    p: { cooldown: cd("medium", "sanctuary") },
    va: sanctum,
    vb: consecration,
    ap: { ...sanctum, cooldown: cd("medium", "sanctuary") },
    bp: { ...consecration, cooldown: cd("medium", "sanctuary") },
  }));
  tag("sanctuary", ["phoenix", "harvest"], ["bonfire", "harvest"]);
}

{
  const heal = (ratio: number, to?: TargetRuleT): EffectT => ({ op: "heal", amount: from("magic", ratio), ...(to ? { to } : {}) });
  const absolve = (ratio: number): Changes => ({ do: [{ op: "remove", label: "debuff" }, heal(ratio), { op: "remove", label: "debuff", to: T.otherLowestShareAlly }, heal(ratio, T.otherLowestShareAlly)] });
  /** Penance: both other allies, cleansed and healed for twice as much; the Paladin pays a fifth of each heal in HP (X23, G12), so the price counts the allies healed (X8). */
  const penance = (ratio: number): Changes => ({
    if: [{ side: "others", where: { hpBelow: 100 } }, { side: "self", where: { hpAtLeast: 35 } }],
    target: { side: "others", pick: "all" },
    do: [{ op: "remove", label: "debuff" }, heal(ratio), { op: "pay", hp: { scale: [{ ratio: r6(ratio / 5), count: "targets", times: { stat: "magic", of: "self" } }] }, to: "self" }],
  });
  const absolution = (ratio: number): Changes => ({
    cooldown: cd("very_long", "absolve"), if: { side: "allies", where: { ko: true } }, target: T.koAlly,
    do: [{ op: "revive", hp: { scale: [{ ratio, stat: "max_hp", of: "target" }] } }],
  });
  ups.push(abilityUpgrade("paladin", "absolve", {
    power: "Heals two fifths more (Absolution: raises with two fifths more HP).",
    a: { name: "Penance", text: "Cleanses and heals both other allies for twice as much, and pays a fifth of each heal in its own HP. Not itself." },
    b: { name: "Absolution", text: "Waits until an ally falls, then revives a random knocked-out ally with a fifth of its HP." },
    p: absolve(0.56),
    va: penance(0.8),
    vb: absolution(0.2),
    ap: penance(1.12),
    bp: absolution(0.28),
  }));
  tag("absolve", ["pact"], ["phoenix"]);
}

{
  const hammer = (ratio: number): Changes => ({ target: { ...T.highestAMFoe, where: { lacks: "stun" }, ifNone: "any" }, do: [magic(from("magic", ratio), { apply: [{ status: "stun" }] })] });
  const pyre = (ratio: number): Changes => ({
    if: { side: "foes", where: { has: "burn" } }, target: { side: "foes", where: { has: "burn" }, pick: "all" },
    do: [magic(from("magic", ratio), { apply: [{ status: "burn", stacks: stacks("few", "magic") }] })],
  });
  ups.push(abilityUpgrade("paladin", "smite", {
    power: "Deals two fifths more damage.",
    a: { name: "Hammer of dawn", text: "Magical damage to the foe with the highest Attack or Magic, which is Stunned. No Burn." },
    b: { name: "Pyre of judgement", text: "Magical damage to every burning foe, half as hard, adding a few Burn to each. Waits until a foe burns." },
    p: { do: [magic(from("magic", 0.7), { apply: [{ status: "burn", stacks: stacks("several", "magic") }] })] },
    va: hammer(0.5),
    vb: pyre(0.25),
    ap: hammer(0.7),
    bp: pyre(0.35),
  }));
  tag("smite", ["lockdown", "landslide"], ["bonfire", "harvest"]);
}

// ═══ Valkyrie ════════════════════════════════════════════════════════════════

{
  const READY = { revives: { ready: true } } as const;
  /** The power step: a Shield of 15% of the revived ally's max HP, on every revive the Valkyrie gives (X2's `other: holder`). */
  const small: ReactionT = { on: { event: "revived", whose: "ally", other: "holder" }, do: [apply("shield", { stacks: { scale: [{ ratio: 0.15, stat: "max_hp", of: "target" }] }, to: "owner" })] };
  const chosen: ReactionT = { on: { event: "revived", whose: "ally", other: "holder" }, do: [apply("guard", { to: "owner" })] };
  /** Chooser of the slain: an aura on every ally while the Valkyrie stands (Per source, ends with it), given again when it or an ally stands up. */
  const aura = (to: ToT) => apply("chooser_of_the_slain", { to });
  const chooser: ReactionT[] = [
    { on: { event: "fight_start" }, do: [aura(T.everyAlly)] },
    { on: { event: "revived" }, do: [aura(T.everyAlly)] },
    { on: { event: "revived", whose: "ally" }, do: [aura("owner")] },
  ];
  helpers.push(helper("chooser_of_the_slain", "CHOOSER", "Deals a fifth more to foes below half their HP.", {
    perSource: { endsWithSource: true }, boosts: both({ scale: [{ ratio: 20, when: { hpBelow: 50 }, of: "target" }] }) as StatusT["boosts"],
  }));
  ups.push(passiveUpgrade("valkyrie", "einherjar", {
    power: "Allies it revives also come back with a small Shield.",
    a: { name: "Chosen", text: "Allies it revives come back with all their actions ready, and Guarded." },
    b: { name: "Chooser of the slain", text: "While it stands, every ally deals a fifth more to foes below half their HP. Allies it revives come back on cooldown, as anyone's do." },
    p: { text: "Allies it revives come back with every action ready, and a small Shield.", ...READY, reactions: [small] },
    va: { text: "Allies it revives come back with every action ready, and Guarded.", ...READY, reactions: [chosen] },
    vb: { text: "While it stands, every ally deals a fifth more to foes below half their HP.", reactions: chooser },
    ap: { text: "Allies it revives come back with every action ready, Guarded, and a small Shield.", ...READY, reactions: [chosen, small] },
    bp: { text: "While it stands, every ally deals a fifth more to foes below half their HP. Allies it revives come back with a small Shield.", reactions: [...chooser, small] },
  }));
  tag("einherjar", ["phoenix"], ["hunt", "harvest"]);
}

{
  const shock = { status: "shock", stacks: stacks("few", "attack", 0.5) };
  const spear = (ratio: number, extra: object = {}) => magic(from("attack", ratio), { apply: [shock], ...extra });
  /** Gale storm: one hit past any guard, then one each on two other random foes; fewer foes, fewer hits. */
  const storm = (ratio: number): Changes => ({ do: [spear(ratio), spear(ratio, { to: { side: "foes", pick: "random", count: 2, exclude: "targets" } })] });
  const hunt = (ratio: number): Changes => ({ target: T.lowestHpFoe, do: [spear(ratio, { hits: 3 })] });
  ups.push(abilityUpgrade("valkyrie", "gale_spear", {
    power: "Deals two fifths more damage.",
    a: { name: "Gale storm", text: "Three quick magical hits on three different foes, the first past any guard, each adding a few Shock." },
    b: { name: "Spear of the hunt", text: "Three quick magical hits past any guard on the foe with the lowest HP, each adding a few Shock." },
    p: { do: [spear(0.126, { hits: 3 })] },
    va: storm(0.09),
    vb: hunt(0.09),
    ap: storm(0.126),
    bp: hunt(0.126),
  }));
  tag("gale_spear", ["harvest", "cuts"], ["hunt"]);
}

{
  const heal = (ratio: number): EffectT => ({ op: "heal", amount: from("magic", ratio) });
  const hymn = (ratio: number): Changes => ({ do: [heal(ratio), apply("haste")] });
  const stand = (ratio: number): Changes => ({ if: { side: "allies", where: { hpBelow: 30 } }, do: [heal(ratio), apply("taunt", { to: "self" })] });
  ups.push(abilityUpgrade("valkyrie", "rally", {
    power: "Heals two fifths more.",
    a: { name: "Battle hymn", text: "Heals the ally with the lowest share of HP, and Hastes it." },
    b: { name: "Last stand", text: "Waits until an ally is below 30% of its max HP, then heals it for double, and the Valkyrie Taunts." },
    p: { do: [heal(0.63)] },
    va: hymn(0.45),
    vb: stand(0.9),
    ap: hymn(0.63),
    bp: stand(1.26),
  }));
  tag("rally", ["cuts", "pact"], ["phoenix", "pact"]);
}

{
  const raise = (ratio: number): EffectT => ({ op: "revive", hp: { scale: [{ ratio, stat: "max_hp", of: "target" }] } });
  /** Flight of the valkyries: every fallen ally, on a cooldown a quarter past very long (70 ticks, moved by Valhalla's id as every cooldown is). */
  const flight = (ratio: number): Changes => ({ cooldown: jitter(70, "valhalla"), target: { side: "allies", where: { ko: true }, pick: "all" }, do: [raise(ratio)] });
  /** Dawn muster: the ability brings a listener (X40) that makes Valhalla ready at a fight's start while an ally is down (X3, X21). */
  const dawn = (ratio: number): Changes => ({ statuses: ["dawn_muster"], do: [raise(ratio)] });
  helpers.push(marker("dawn_muster", "DAWN MUSTER", "At a fight's start, if an ally is down, Valhalla is ready at once.", {
    unremovable: true,
    reactions: [{ on: { event: "fight_start" }, if: { side: "allies", where: { ko: true } }, do: [{ op: "cooldown", which: { ability: ["valhalla"] }, set: "ready", to: "holder" }] }],
  }));
  ups.push(abilityUpgrade("valkyrie", "valhalla", {
    power: "The raised ally comes back with two fifths more HP.",
    a: { name: "Flight of the valkyries", text: "Revives every knocked-out ally with a tenth of its HP." },
    b: { name: "Dawn muster", text: "Revives a random knocked-out ally with a tenth of its HP. At a fight's start, if an ally is down from an earlier fight, it's ready at once, whatever its cooldown." },
    p: { do: [raise(0.14)] },
    va: flight(0.1),
    vb: dawn(0.1),
    ap: flight(0.14),
    bp: dawn(0.14),
  }));
  tag("valhalla", ["phoenix"], ["ambush", "phoenix"]);
}

// ═══ Bard ════════════════════════════════════════════════════════════════════

{
  const share = (k: number): NumT => ({ scale: [{ ratio: r6(STATUS.refrain.share * k), amount: true }] });
  const RANDOM: TargetRuleT = { side: "allies", pick: "random" };
  const refrain = (heal: ToT, mp: ToT, k: number): ReactionT[] => [{ on: { event: "hit_lands", kind: "basic" }, do: [{ op: "heal", amount: share(k), to: heal }, { op: "mp", amount: share(k), to: mp }] }];
  const harmony = (k: number) => refrain({ side: "allies", pick: "lowest", by: "hp_share" }, { side: "allies", pick: "lowest", by: "mp_share" }, k);
  const song = (k: number): ReactionT[] => [{ on: { event: "hit_lands", kind: "basic" }, do: [apply("might", { stacks: own("few", "magic", k), to: RANDOM }), { op: "mp", amount: share(k), to: RANDOM }] }];
  ups.push(passiveUpgrade("bard", "refrain", {
    power: "A bigger share: 42% of the damage dealt, not 30% (Battle song: two fifths more Might too).",
    a: { name: "Harmony", text: "Each basic attack that lands heals the ally with the lowest share of its HP and gives MP to the ally with the lowest share of its MP, each 30% of the damage dealt." },
    b: { name: "Battle song", text: "Each basic attack that lands gives a random ally a few Might, and gives a random ally MP, 30% of the damage dealt." },
    p: { text: "Basic attacks heal a random ally and give a random ally MP, each a bigger share of the damage dealt.", reactions: refrain(RANDOM, RANDOM, MORE) },
    va: { text: "Basic attacks heal the ally lowest in HP and give MP to the ally lowest in MP, each a share of the damage dealt.", reactions: harmony(1) },
    vb: { text: "Basic attacks give a random ally a few Might, and a random ally MP, a share of the damage dealt.", reactions: song(1) },
    ap: { text: "Basic attacks heal the ally lowest in HP and give MP to the ally lowest in MP, each a bigger share of the damage dealt.", reactions: harmony(MORE) },
    bp: { text: "Basic attacks give a random ally Might, and a random ally MP, a bigger share of the damage dealt.", reactions: song(MORE) },
  }));
  tag("refrain", ["overflow", "pact"], ["landslide", "cuts"]);
}

{
  const might = (k: number) => apply("might", { stacks: stacks("few", "magic", k) });
  const lament = (k: number): Changes => ({ if: { side: "allies", where: { hpBelow: 50 } }, target: { side: "allies", where: { hpBelow: 50 }, pick: "all" }, do: [might(k)] });
  const marching: Changes = { do: [{ op: "cooldown", which: "basic", set: "ready" }] };
  ups.push(abilityUpgrade("bard", "war_ballad", {
    power: "Two fifths more Might (Marching song: comes round sooner).",
    a: { name: "Lament", text: "Might to every ally below half its HP, twice as many. Waits until an ally is below half." },
    b: { name: "Marching song", text: "Every ally's next basic attack comes at once. No Might." },
    p: { do: [might(MORE)] },
    va: lament(2),
    vb: marching,
    ap: lament(2 * MORE),
    bp: { ...marching, cooldown: quarterOff(cd("quick", "war_ballad")) },
  }));
  tag("war_ballad", ["pact", "phoenix"], ["cuts", "ambush"]);
}

{
  const rubato: Changes = { do: [apply("haste"), { op: "cooldown", which: "longest", set: { less: 4 } }] };
  /** Accelerando: Haste on the ally whose basic attack comes most often now (X9's `swing`, lowest first). */
  const accelerando: Changes = { cooldown: cd("short", "allegro"), mp: 450, target: { side: "allies", pick: "lowest", by: "swing" } };
  ups.push(abilityUpgrade("bard", "allegro", {
    power: "Comes round sooner.",
    a: { name: "Rubato", text: "Haste on every ally, and each ally's ability with the longest cooldown left comes 4 ticks closer." },
    b: { name: "Accelerando", text: "Haste on the ally that attacks fastest." },
    p: { cooldown: cd("medium", "allegro") },
    va: rubato,
    vb: accelerando,
    ap: { ...rubato, cooldown: cd("medium", "allegro") },
    bp: { ...accelerando, cooldown: cd("quick", "allegro") },
  }));
  tag("allegro", ["overflow", "lockdown"], ["cuts"]);
}

{
  /** Resonance: magical damage for each Shock a foe holds, read off the foe, on every foe that holds some. The Shock stays. */
  const resonance = (perStack: number): Changes => ({
    if: { side: "foes", where: { has: "shock" } }, target: { side: "foes", where: { has: "shock" }, pick: "all" },
    do: [magic({ scale: [{ ratio: perStack, stacks: "shock", of: "target" }] })],
  });
  const lullaby: Changes = { cooldown: cd("long", "thunder_chord"), do: [apply("slow")] };
  ups.push(abilityUpgrade("bard", "thunder_chord", {
    power: "Two fifths more Shock (Resonance: two fifths more damage a stack; Lullaby: comes round sooner).",
    a: { name: "Resonance", text: "Magical damage to every foe for each Shock it holds. Adds no Shock. Waits until a foe holds Shock." },
    b: { name: "Lullaby", text: "Slows every foe. No Shock." },
    p: { do: [apply("shock", { stacks: stacks("several", "magic", MORE) })] },
    va: resonance(60),
    vb: lullaby,
    ap: resonance(84),
    bp: { ...lullaby, cooldown: cd("medium", "thunder_chord") },
  }));
  tag("thunder_chord", ["harvest"], ["lockdown", "toll"]);
}

// ═══ Mythics ═════════════════════════════════════════════════════════════════
// One per class, no stat steps (G15). A piece's text is its effect only: the interface shows its slot and its one class.

const mythicStatuses: StatusT[] = [];
const mythicGear: GearT[] = [];
const mythicBuilds: Builds = {};
function mythic(o: Omit<Parameters<typeof piece>[0], "rarity"> & { mythic: string }, own: StatusT[], tags: Builds[string]) {
  const g = piece({ ...o, rarity: "mythic" });
  mythicGear.push(g);
  mythicStatuses.push(...own);
  mythicBuilds[g.id] = tags;
}

// Knight: Horn of the keep. Section 6 of the spec: a status doesn't know which ability applied it, so any Taunt the Knight loses while another ally casts comes back.
mythic(
  { name: "Horn of the keep", slot: "offhand", kind: "horn", mythic: "knight", statuses: ["horn_of_the_keep"],
    text: "Every hit the Knight takes gives the other ally with the least MP a tenth of the hit's damage as MP. When the Knight's Taunt runs out while another ally is in a wind-up, it Taunts again." },
  [pieceStatus("horn_of_the_keep", "Horn of the keep", "Hits taken give an ally MP; a Taunt that runs out during an ally's wind-up comes back.", {
    reactions: [
      { on: { event: "hit_taken" }, do: [{ op: "mp", amount: { scale: [{ ratio: 0.1, amount: true }] }, to: { side: "others", pick: "lowest", by: "mp_share" } }] },
      { on: { event: "status_ended", status: "taunt", cause: ["expired"] }, if: { side: "others", where: { casting: true } }, do: [apply("taunt", { to: "holder" })] },
    ],
  })],
  [{ build: "overflow", rung: 3, worth: 3 }, { build: "toll", worth: 2 }],
);

// Cleric: Halo of the saint. Section 6 of the spec: a fallen unit can't hold a status, so the count is the Cleric's, filled by `overhealed` (X32) while an ally is down (X3).
mythic(
  { name: "Halo of the saint", slot: "amulet", mythic: "cleric", statuses: ["halo_of_the_saint"],
    text: "While an ally is knocked out, the part of the Cleric's heals that would go past full is kept. When it reaches a quarter of the Cleric's max HP, a fallen ally stands with that much." },
  [
    pieceStatus("halo_of_the_saint", "Halo of the saint", "Keeps its overhealing while an ally is down, to raise it.", {
      reactions: [
        { on: { event: "overhealed", whose: "any", other: "holder" }, if: { side: "allies", where: { ko: true } }, do: [apply("halo_of_the_saint_kept", { stacks: { scale: [{ ratio: 1, amount: true }] }, to: "holder" })] },
        { on: { event: "status_capped", status: "halo_of_the_saint_kept" }, do: [
          { op: "revive", hp: { scale: [{ ratio: 1, stacks: "halo_of_the_saint_kept", of: "holder" }] }, to: T.koAlly },
          removeMarker("halo_of_the_saint_kept"),
        ] },
      ],
    }),
    marker("halo_of_the_saint_kept", "HALO", "Healing kept for a fallen ally.", { show: "icon", stacking: "intensity", cap: ofHolder(0.25, "max_hp") }),
  ],
  [{ build: "phoenix", rung: 3, worth: 3 }],
);

// Ranger: Huntmaster's quiver. Its abilities re-aimed past any guard at the lowest HP (X24, every ability the Ranger has), marking what they hit; a marked foe's fall halves the Ranger's cooldowns left (X21).
mythic(
  { name: "Huntmaster's quiver", slot: "armor", kind: "leather", mythic: "ranger", statuses: ["huntmasters_quiver"],
    text: "All the Ranger's abilities aim past any guard at the foe with the lowest HP. When a foe one of them hit falls, the cooldowns left on its abilities are halved." },
  [
    pieceStatus("huntmasters_quiver", "Huntmaster's quiver", "Its abilities aim past any guard at the lowest foe; a kill on a foe they hit halves its cooldowns left.", {
      mods: [{ target: T.lowestHpFoe, seek: true, apply: [{ status: "huntmasters_quiver_mark" }] }],
    }),
    marker("huntmasters_quiver_mark", "QUARRY", "Hit by the Huntmaster's quiver: its fall halves the hunter's cooldowns left.", {
      perSource: {}, survivesKO: true,
      reactions: [{ on: { event: "ko" }, actor: "source", do: [{ op: "cooldown", which: "abilities", set: { times: 50 }, to: "source" }] }],
    }),
  ],
  [{ build: "hunt", rung: 3, worth: 3 }],
);

// Bramble knight: Heartwood mail. Its Thorns on every attacker of an ally; the base Briar's Bleed follows them from here (the passive forms hear this status's damage themselves).
mythic(
  { name: "Heartwood mail", slot: "armor", kind: "mail", mythic: "bramble_knight", statuses: ["heartwood_mail"],
    text: "Whenever a hit lands on any ally, the Bramble knight's Thorns strike the attacker too." },
  [pieceStatus("heartwood_mail", "Heartwood mail", "Its Thorns strike whoever hits an ally.", {
    reactions: [
      { on: { event: "hit_taken", whose: "ally" }, do: [{ op: "damage", type: "none", amount: ofHolder(1, "thorns"), to: "other" }] },
      { on: { event: "damage_dealt", status: "heartwood_mail" }, if: { side: "self", where: { has: "briar" } }, do: [apply("bleed", { stacks: own("few", "armor"), to: "other" })] },
    ],
  })],
  [{ build: "toll", rung: 3, worth: 3 }],
);

// Hoplite: The last wall. An Aegis it gave that's spent (X1: the blocked amount and the attacker; X2: `source: holder`) strikes back in full, and Aspis is ready (X21).
mythic(
  { name: "The last wall", slot: "offhand", kind: "round_shield", mythic: "hoplite", statuses: ["the_last_wall"],
    text: "When an Aegis the Hoplite gave blocks a blow, the attacker takes the blocked damage, and Aspis is ready again at once." },
  [pieceStatus("the_last_wall", "The last wall", "A blow its Aegis blocks is struck back, and Aspis is ready.", {
    reactions: [{ on: { event: "status_ended", status: "aegis", cause: ["spent"], whose: "any", source: "holder" }, do: [
      { op: "damage", type: "none", amount: { scale: [{ ratio: 1, amount: true }] }, to: "other" },
      { op: "cooldown", which: { ability: ["aspis"] }, set: "ready", to: "holder" },
    ] }],
  })],
  [{ build: "toll", rung: 3, worth: 2 }, { build: "bonfire", rung: 3, worth: 2 }],
);

// Paladin: Chains of light. Smite (every form) Silences what it hits (X24 by name); hits on a Stunned or Silenced foe heal the lowest ally for half (X3, X4).
mythic(
  { name: "Chains of light", slot: "offhand", kind: "lantern", mythic: "paladin", statuses: ["chains_of_light"],
    text: "Smite also Silences its target. The Paladin's hits on a Stunned or Silenced foe heal the ally with the lowest share of HP for half the damage dealt." },
  [pieceStatus("chains_of_light", "Chains of light", "Smite Silences; hits on a Stunned or Silenced foe heal the lowest ally.", {
    mods: [{ of: { ability: ["smite"] }, apply: [{ status: "silence" }] }],
    reactions: [{ on: { event: "hit_lands" }, if: { unit: "other", where: { hasAny: ["stun", "silence"] } }, do: [{ op: "heal", amount: { scale: [{ ratio: 0.5, amount: true }] }, to: T.lowestShareAlly }] }],
  })],
  [{ build: "lockdown", rung: 3, worth: 3 }, { build: "pact", worth: 1 }],
);

// Valkyrie: Stormspear. A weapon of its own: the rune sword's speed, magical, one hand; damage at medium from Attack; a Gale spear hit's Shock; Seek on basic attacks.
mythic(
  { name: "Stormspear", slot: "weapon", mythic: "valkyrie", statuses: ["stormspear"],
    text: "A medium, magical, one-handed spear. Its basic attacks scale from Attack, ignore Taunt, and add a few Shock.",
    weapon: { type: "magical", hands: 1, cooldown: KIND_SPEED.rune_sword, amount: weaponHit("rune_sword", "medium", "medium", "attack"), apply: [{ status: "shock", stacks: stacks("few", "attack", 0.5) }] } },
  [pieceStatus("stormspear", "Stormspear", "Basic attacks ignore Taunt.", { seek: "basic" })],
  [{ build: "cuts", rung: 3, worth: 2 }, { build: "hunt", rung: 3, worth: 2 }],
);

// Bard: Metronome. A count of the party's hits (extra strikes and each hit of a multi-hit ability included); at 20 the three songs are ready (X21 by name) and the count is spent.
mythic(
  { name: "Metronome", slot: "offhand", kind: "horn", mythic: "bard", statuses: ["metronome"],
    text: "Counts every hit the party lands. At 20, War ballad, Allegro and Thunder chord are ready at once, and the count starts again." },
  [
    pieceStatus("metronome", "Metronome", "Counts the party's hits; at 20, its songs are ready.", {
      reactions: [
        { on: { event: "hit_lands" }, do: [apply("metronome_count", { to: "holder" })] },
        { on: { event: "hit_lands", whose: "ally" }, do: [apply("metronome_count", { to: "holder" })] },
        { on: { event: "status_capped", status: "metronome_count" }, do: [{ op: "cooldown", which: { ability: ["war_ballad", "allegro", "thunder_chord"] }, set: "ready", to: "holder" }, removeMarker("metronome_count")] },
      ],
    }),
    marker("metronome_count", "BEAT", "The party's hits, counted to 20.", { show: "icon", stacking: "intensity", cap: 20 }),
  ],
  [{ build: "cuts", rung: 3, worth: 3 }],
);

// ─── Exports ─────────────────────────────────────────────────────────────────

export const upgrades: UpgradeT[] = ups.map((u) => u.up);
export const abilities: AbilityT[] = ups.filter((u) => u.up.kind === "ability").flatMap((u) => u.forms as AbilityT[]);
export const statuses: StatusT[] = [...ups.filter((u) => u.up.kind === "passive").flatMap((u) => u.forms as StatusT[]), ...helpers, ...mythicStatuses];
export const mythics: GearT[] = mythicGear;
export const builds: Builds = { ...buildTags, ...mythicBuilds };
