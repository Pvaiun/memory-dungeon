/** The Bard's upgrades: a power step and two versions (A and B) for each ability and the passive. Written with kit-1.ts. */
import type { NumT, ReactionT, TargetRuleT, ToT } from "../../../src/schema.js";
import { stacks, STATUS } from "../scale.js";
import { own } from "../pieces/kit.js";
import { abilityUpgrade, apply, cd, type Changes, magic, MORE, passiveUpgrade, quarterOff, r6, tag, ups } from "./kit-1.js";

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
  /** Accelerando: Haste on the ally whose basic attack comes most often now (by `swing`, lowest first). */
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
