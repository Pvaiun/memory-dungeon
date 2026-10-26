/**
 * The journey from the command line, for an AI playtester: what a node shows a player, what's owned on reaching
 * it, and one run of a chosen party, told as a short summary of what a player would have watched (enemy stats
 * stay hidden; foes' HP shows as a share, as their bars do on screen).
 *
 *   npx tsx src/campaign-play.ts show <node>                 the node's page
 *   npx tsx src/campaign-play.ts owned <node>                what's owned on reaching it
 *   npx tsx src/campaign-play.ts glossary 1                  what every status shown in a fight does
 *   npx tsx src/campaign-play.ts play <node> --formation vanguard \
 *       --party "knight:oathblade,plate,heartstone;cleric:plain_light_staff,robes;ranger:warbow" [--seed N] [--full]
 *       A member is class:weapon,armor,amulet (ids; leave a slot out to leave it empty). Abilities fire in the
 *       order given after a slash: "knight:oathblade,plate/protect,fortify,shield_bash" (the first starts a fight most
 *       charged). --campfire rest|focus|raise:<class> picks at the campfire halfway through the run (HP back, MP back,
 *       or that fallen member back); left out, the simulations' choice (raise if anyone is down, else whichever the
 *       party is shorter of). A raise of a member who's standing falls back to the simulations' choice.
 */
import { readFileSync } from "node:fs";
import { campaign, foesText, needText, ownedAt, rewardsOf, simPick, unmet } from "./campaign.js";
import { combat } from "./engine/combat/rules.js";
import { playerView, type Entry } from "./engine/log.js";
import { loadContent, play } from "./engine/run.js";
import type { Party } from "./schema.js";
import { readingPack } from "./sim/feel.js";
import { checkParty } from "./validate.js";

const c = loadContent(JSON.parse(readFileSync("content/core-set.pack.json", "utf8")));
const cp = campaign(c);
const [cmd, nodeArg, ...rest] = process.argv.slice(2);
const opt = (name: string) => {
  const i = rest.indexOf(name);
  return i >= 0 ? rest[i + 1] : undefined;
};
const i = Number(nodeArg) - 1;
const node = cp.nodes[i];
if (!node) throw new Error(`no node ${nodeArg}: there are ${cp.nodes.length}`);
const d = c.dungeons.get(node.dungeon)!;
const KIND: Record<string, string> = { dungeon: "RUN", remix: "REMIX", trial: "TRIAL" };
const codes = (stats: { stat: string; flat?: number }[] = []) =>
  stats.map((s) => `${s.stat} ${(s.flat ?? 0) > 0 ? "+" : ""}${s.stat.match(/crit|evasion|accuracy|double|lifesteal|siphon|resist/) ? s.flat : Math.round((s.flat ?? 0) / 100) / 10}`).join(", ");

if (cmd === "show") {
  const out = [`Node ${i + 1} of ${cp.nodes.length}: ${node.name} (${KIND[node.kind]})`, node.text];
  const ft = foesText(d);
  if (ft) out.push(`Foes: ${ft}`);
  out.push(node.needs.length ? `Needs: ${node.needs.map((nd) => needText(c, nd)).join("; ")}.` : "Needs: none.");
  out.push("", "Fights:");
  // Fights numbered as the run summary numbers them; the campfire shows where it falls.
  let k = 0;
  d.stages.forEach((s) => {
    if (s.kind === "campfire") return void out.push("  (campfire)");
    if (s.kind !== "fight") return;
    const counts = new Map<string, number>();
    for (const e of s.enemies) counts.set(e, (counts.get(e) ?? 0) + 1);
    out.push(`  ${++k}. ${s.boss ? "BOSS " : ""}${(s.name ?? s.id).replace(/^\d+\. /, "")}: ${[...counts].map(([e, n]) => `${c.enemies.get(e)!.name}${n > 1 ? ` x${n}` : ""}`).join(", ")}`);
  });
  const seen = new Set<string>();
  out.push("", "The foes, as the bestiary describes them:");
  for (const s of d.stages) if (s.kind === "fight") for (const e of s.enemies) {
    if (seen.has(e)) continue;
    seen.add(e);
    const en = c.enemies.get(e)!;
    const acts = (en.abilities ?? []).map((a) => `${c.abilities.get(a)!.name} (${c.abilities.get(a)!.text})`);
    const res = Object.entries(en.stats).filter(([k]) => k.startsWith("resist:")).map(([k, v]) => `${v > 100 ? "absorbs" : v > 0 ? "resists" : "weak to"} ${k.slice(7)}`);
    out.push(`  ${en.name}${en.rank === "boss" ? " (boss)" : ""}: ${en.text}${acts.length ? ` Abilities: ${acts.join("; ")}.` : ""}${res.length ? ` ${res.join(", ")}.` : ""}`);
  }
  const r = rewardsOf(c, i);
  out.push("", `Reward (first clear only): ${[r.classes.length ? "a new class" : "", r.formations.length ? `${r.formations.length > 1 ? `${r.formations.length} new formations` : "a new formation"}` : "", r.gear.length ? `${r.gear.length} gear` : ""].filter(Boolean).join(", ") || "nothing"}.`);
  console.log(out.join("\n"));
} else if (cmd === "owned") {
  const o = ownedAt(c, i);
  const out = [`Owned on reaching node ${i + 1}:`, "", "Classes:"];
  for (const id of o.classes) {
    const k = c.classes.get(id)!;
    out.push(`  ${id} (${k.name}): ${k.text} Weapons: ${k.weapons.join(", ")}. Heaviest armor: ${k.armor}. Passive: ${k.passive?.name ?? "Einherjar"}: ${k.passive?.text ?? "revives with actions ready"}.`);
    // The stat line in the run summary's units (HP 5000 is the sheet's 5), MP regen as what it restores.
    const st = k.stats, pulse = c.statuses.get("mp_regen")?.pulse;
    const amt = pulse?.do?.[0] && "amount" in pulse.do[0] ? pulse.do[0].amount : 0;
    const share = typeof amt === "object" ? (amt.scale[0]?.ratio ?? 0) : 0;
    const every = pulse?.every ?? 4, regen = Math.round(((st.mp_regen ?? 0) * share) / 10) * 10;
    out.push(`    Stats: HP ${st.max_hp}, MP ${st.max_mp ?? 0} (+${regen} every ${every} ticks), Attack ${st.attack ?? 0}, Magic ${st.magic ?? 0}, Armor ${st.armor ?? 0}, Crit ${st.crit_chance ?? 0}%, Aggro ${st.aggro ?? 0}.`);
    for (const a of k.abilities) {
      const ab = c.abilities.get(a)!;
      out.push(`    ${a}: ${ab.name} (MP ${ab.mp ?? 0}, every ${ab.cooldown} ticks): ${ab.text}`);
    }
  }
  out.push("", "Formations:");
  for (const id of o.formations) {
    const f = c.formations.get(id)!;
    out.push(`  ${id} (${f.name}): ${f.text}${f.positions.map((p, k) => ` Slot ${k + 1} ${p.name}: ${codes(p.stats) || "no change"}.`).join("")}`);
  }
  out.push("", "Gear (any number of members can wear a piece):");
  for (const id of o.gear) {
    const g = c.gear.get(id)!;
    out.push(`  ${id} (${g.name}, ${g.slot}${g.weapon?.kind ? `, ${g.weapon.kind}` : ""}${g.weight ? `, ${g.weight}` : ""}${g.tier === "powerful" ? ", powerful" : ""}): ${g.text}${g.stats?.length ? ` [${codes(g.stats)}]` : ""}`);
  }
  console.log(out.join("\n"));
} else if (cmd === "play") {
  const o = ownedAt(c, i);
  const formation = opt("--formation") ?? "neutral";
  const f = c.formations.get(formation);
  if (!f || !o.formations.includes(formation)) throw new Error(`formation '${formation}' isn't owned`);
  const units = (opt("--party") ?? "").split(";").filter(Boolean).map((spec, k) => {
    const [head, order] = spec.split("/");
    const [cls, gearList = ""] = head.split(":");
    const k2 = c.classes.get(cls);
    if (!k2 || !o.classes.includes(cls)) throw new Error(`class '${cls}' isn't owned`);
    const gear: Record<string, string> = {};
    for (const g of gearList.split(",").filter(Boolean)) {
      const x = c.gear.get(g);
      if (!x || !o.gear.includes(g)) throw new Error(`gear '${g}' isn't owned`);
      gear[x.slot] = g;
    }
    const abilities = order ? order.split(",") : k2.abilities.slice();
    return { class: cls, position: f.positions[k].id, abilities, gear };
  });
  const party: Party = { formation, units };
  const issues = checkParty(c.pack, party, { dungeon: node.dungeon }).filter((x) => x.level === "error");
  if (issues.length) throw new Error(issues.map((x) => x.message).join("; "));
  const missing = unmet(c, node, party);
  if (missing.length) throw new Error(`can't start: ${missing.join("; ")}`);
  const seed = Number(opt("--seed") ?? 1);
  // The campfire halfway through: --campfire rest (HP back), focus (MP back) or raise:<class>; left out, the simulations' choice.
  const camp = opt("--campfire");
  const campPick = (d: { options: string[] }, r: Parameters<typeof simPick>[1]) => {
    if (!camp) return null;
    if (!camp.startsWith("raise:")) return camp;
    const m = (r.party as unknown as { id: string; ref: string }[]).find((x) => x.ref === camp.slice(6));
    return m && d.options.includes(`raise:${m.id}`) ? `raise:${m.id}` : null;
  };
  const run = play(c, combat, { dungeon: node.dungeon, party, seed, firstClear: true }, (d, r) => (d.kind === "campfire" ? campPick(d, r) ?? simPick(d, r) : simPick(d, r)), { log: true });
  if (rest.includes("--full")) {
    console.log(readingPack(c, combat, { why: "", target: { key: node.id, dungeon: node.dungeon, name: node.name }, party, seed, won: run.outcome === "won" }, 1));
  } else console.log(summary((run.log as Entry[]).filter((e) => e.vis === "player" || e.t === "mp")));
  console.log(run.outcome === "won" ? `\nRUN CLEARED (node ${i + 1}, seed ${seed}).` : `\nRUN LOST (node ${i + 1}, seed ${seed}).`);
} else if (cmd === "glossary") {
  // What the interface's inspect window says about each status a fight can show.
  for (const st of c.pack.statuses) if (st.show === "icon") console.log(`${st.name}: ${st.text ?? ""}`);
} else throw new Error("commands: show <node>, owned <node>, play <node> ..., glossary 1");

/** A player's memory of a run: per fight, how it went, who fell, what the foes did, what the party dealt and took. */
function summary(log: Entry[]): string {
  const out: string[] = [];
  const names = new Map<string, string>();
  const side = new Map<string, string>();
  const max = new Map<string, number>();
  // MP shows as a bar on screen; here, what's left at each fight's end.
  const mp = new Map<string, number>();
  let f: { dealt: Map<string, number>; taken: Map<string, number>; healed: Map<string, number>; acts: Map<string, number>; status: Map<string, number>; foeStatus: Map<string, number>; words: Map<string, number>; down: string[]; hp: Map<string, number>; n: number; name: string; boss: boolean } | null = null;
  let n = 0;
  const add = (m: Map<string, number>, k: string, v: number) => m.set(k, (m.get(k) ?? 0) + v);
  const t = (at: unknown) => `t${Math.round((at as number) / 1000)}`;
  for (const e of log) {
    if (e.t === "fight_start") {
      n++;
      f = { dealt: new Map(), taken: new Map(), healed: new Map(), acts: new Map(), status: new Map(), foeStatus: new Map(), words: new Map(), down: [], hp: new Map(), n, name: String(e.stage), boss: !!e.boss };
      const us = e.units as { id: string; name: string; side: string; hp: number; max: number }[];
      for (const u of us) names.set(u.id, u.name), side.set(u.id, u.side), max.set(u.id, u.max), f.hp.set(u.id, u.hp);
      out.push("", `Fight ${n}${e.boss ? " (boss)" : ""}: ${String(e.stage).replace(/_/g, " ")}. Party: ${us.filter((u) => u.side === "party").map((u) => `${u.name} ${u.hp}/${u.max}`).join(", ")}. Foes: ${us.filter((u) => u.side === "enemy").map((u) => u.name).join(", ")}.`);
      continue;
    }
    if (e.t === "pick" && e.kind === "campfire") {
      const pk = String(e.pick);
      out.push("", pk === "rest" ? "Campfire: you REST (everyone standing gets HP back)." : pk === "focus" ? "Campfire: you FOCUS (everyone standing gets MP back)." : `Campfire: you RAISE ${names.get(pk.slice(6)) ?? pk.slice(6)} (back on its feet with some HP).`);
      continue;
    }
    if (!f) continue;
    if (e.t === "join") {
      const u = e.unit as { id: string; name: string; side: string; hp: number; max: number };
      names.set(u.id, u.name), side.set(u.id, u.side), max.set(u.id, u.max), f.hp.set(u.id, u.hp);
      out.push(`  ${t(e.at)} ${u.name} joins the fight.`);
    } else if (e.t === "act" && side.get(String(e.by)) === "enemy" && e.act !== "basic") add(f.acts, `${names.get(String(e.by))!.replace(/ [A-Z]$/, "")}: ${e.name}`, 1);
    else if (e.t === "act" && side.get(String(e.by)) === "party" && e.act !== "basic") add(f.acts, `${names.get(String(e.by))}: ${e.name}`, 1);
    else if (e.t === "interrupt") out.push(`  ${t(e.at)} ${names.get(String(e.unit))} is interrupted: ${e.name} is lost.`);
    else if (e.t === "hold") out.push(`  ${t(e.at)} ${names.get(String(e.unit))} is stunned: ${e.name} has to wait.`);
    else if (e.t === "dmg" && typeof e.amount === "number") {
      const tg = String(e.target);
      if (e.word && e.by && side.get(String(e.by)) === "party") add(f.words, `${String(e.word)} on ${names.get(tg)!.replace(/ [A-Z]$/, "")}`, 1);
      f.hp.set(tg, e.hp as number);
      if (side.get(tg) === "party") {
        add(f.taken, names.get(tg)!, e.amount);
        // A status's damage on the party (Bleed, Burn, Shock) shows on screen as its own message: name it here too.
        if (e.part === "pulse") add(f.taken, `(of which ${String(e.src)})`, e.amount);
      }
      else if (e.by && side.get(String(e.by)) === "party") add(f.dealt, names.get(String(e.by))!, e.amount);
      else if (e.part === "pulse") add(f.dealt, `(statuses on foes: ${String(e.src)})`, e.amount);
    } else if (e.t === "heal") {
      f.hp.set(String(e.target), e.hp as number);
      if (side.get(String(e.target)) === "party") add(f.healed, names.get(String(e.target))!, e.amount as number);
    } else if (e.t === "status" && side.get(String(e.unit)) === "enemy") {
      const k = `${names.get(String(e.unit))!.replace(/ [A-Z]$/, "")}: ${e.name}`;
      f.foeStatus.set(k, Math.max(f.foeStatus.get(k) ?? 0, typeof e.total === "number" ? (e.total as number) : 1));
    } else if (e.t === "status" && side.get(String(e.unit)) === "party" && typeof e.total === "number") {
      const k = `${e.name} on your party`;
      f.status.set(k, Math.max(f.status.get(k) ?? 0, e.total as number));
    } else if (e.t === "status" && side.get(String(e.unit)) === "party") f.status.set(`${e.name} on your party`, Math.max(f.status.get(`${e.name} on your party`) ?? 0, 1));
    else if (e.t === "down") {
      f.down.push(`${names.get(String(e.unit))} ${t(e.at)}`);
      f.hp.set(String(e.unit), 0);
    } else if (e.t === "leave") f.hp.set(String(e.unit), 0);
    else if (e.t === "mp" && side.get(String(e.target)) === "party") mp.set(String(e.target), e.mp as number);
    else if (e.t === "enrage") out.push(`  ${t(e.at)} The fight drags on: from now on every blow lands harder, and harder still as it goes.`);
    else if (e.t === "revive") {
      out.push(`  ${t(e.at)} ${names.get(String(e.unit))} is raised by ${names.get(String(e.by))}.`);
      f.hp.set(String(e.unit), e.hp as number);
    } else if (e.t === "fight_end") {
      const foesLeft = [...f.hp].filter(([id, hp]) => side.get(id) === "enemy" && hp > 0).map(([id, hp]) => `${names.get(id)} at ${Math.round((100 * hp) / max.get(id)!)}%`);
      const party = [...f.hp].filter(([id]) => side.get(id) === "party").map(([id, hp]) => `${names.get(id)} ${hp}/${max.get(id)}`);
      const mpLeft = [...mp].map(([id, v]) => `${names.get(id)} ${v}`);
      out.push(`  ${e.result === "won" ? "WON" : "LOST"} at t${e.rounds}. Party after: ${party.join(", ")}.${mpLeft.length ? ` MP left: ${mpLeft.join(", ")}.` : ""}${foesLeft.length ? ` Foes still standing: ${foesLeft.join(", ")}.` : ""}`);
      const down = f.down.filter((x) => side.get([...names].find(([, nm]) => x.startsWith(nm))?.[0] ?? "") !== "enemy");
      if (down.length) out.push(`  Knocked out: ${down.join(", ")}.`);
      const fmt = (m: Map<string, number>) => [...m].map(([k, v]) => `${k} ${v}`).join(", ");
      if (f.dealt.size) out.push(`  Damage dealt: ${fmt(f.dealt)}.`);
      if (f.taken.size) out.push(`  Damage taken: ${fmt(f.taken)}.`);
      if (f.healed.size) out.push(`  Healing received: ${fmt(f.healed)}.`);
      if (f.acts.size) out.push(`  Abilities used: ${fmt(f.acts)}.`);
      if (f.foeStatus.size) out.push(`  Statuses on foes (peak stacks): ${[...f.foeStatus].map(([k, v]) => `${k}${v > 1 ? ` ${Math.round(v)}` : ""}`).join(", ")}.`);
      if (f.words.size) out.push(`  Your hits that showed a word: ${fmt(f.words)}.`);
      if (f.status.size) out.push(`  Statuses on your party (peak stacks): ${[...f.status].map(([k, v]) => `${k.replace(" on your party", "")}${v > 1 ? ` ${Math.round(v)}` : ""}`).join(", ")}.`);
    }
  }
  return out.join("\n");
}
