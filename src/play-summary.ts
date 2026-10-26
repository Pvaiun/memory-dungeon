/**
 * A fight as a player remembers it, for the AI playtesters' command lines (src/campaign-play.ts, src/rogue-play.ts):
 * per fight, how it went, who fell, what the foes did, what the party dealt and took. Enemy stats stay hidden; foes'
 * HP shows as a share, as their bars do on screen.
 */
import type { Entry } from "./engine/log.js";

/** A player's memory of a run: per fight, how it went, who fell, what the foes did, what the party dealt and took. */
export function summary(log: Entry[], nameOf: (src: string) => string = (x) => x.replace(/_/g, " ")): string {
  const out: string[] = [];
  const names = new Map<string, string>();
  const side = new Map<string, string>();
  const max = new Map<string, number>();
  // MP shows as a bar on screen; here, what's left at each fight's end.
  const mp = new Map<string, number>();
  // The last blow each unit took, and the damage taken by kind, so a knockout can say what did it.
  const last = new Map<string, string>();
  const kinds = new Map<string, Map<string, number>>();
  let f: { dealt: Map<string, number>; taken: Map<string, number>; pulses: Map<string, number>; healed: Map<string, number>; acts: Map<string, number>; status: Map<string, number>; foeStatus: Map<string, number>; words: Map<string, number>; down: string[]; hp: Map<string, number>; n: number; name: string; boss: boolean } | null = null;
  let n = 0;
  const add = (m: Map<string, number>, k: string, v: number) => m.set(k, (m.get(k) ?? 0) + v);
  const t = (at: unknown) => `t${Math.round((at as number) / 1000)}`;
  for (const e of log) {
    if (e.t === "fight_start") {
      n++;
      kinds.clear();
      f = { dealt: new Map(), taken: new Map(), pulses: new Map(), healed: new Map(), acts: new Map(), status: new Map(), foeStatus: new Map(), words: new Map(), down: [], hp: new Map(), n, name: String(e.stage), boss: !!e.boss };
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
      // Damage counts up to the HP the target had left: overkill on a dying bat isn't damage dealt (a playtester's 21,881 on four bats).
      const real = Math.min(e.amount, Math.max(0, f.hp.get(tg) ?? e.amount));
      f.hp.set(tg, e.hp as number);
      // A status's damage (a pulse, or a reaction such as Doom's toll) names who laid it, not its holder: "doom from Valkyrie" read as suicide.
      const laid = e.from && names.has(String(e.from)) ? `, laid by ${names.get(String(e.from))}` : "";
      if (e.amount > 0) last.set(tg, `${e.part === "pulse" || e.part === "reaction" ? `${nameOf(String(e.src))} (a status${laid})` : `${nameOf(String(e.src))} from ${e.by ? names.get(String(e.by)) ?? "?" : "?"}`}, ${e.amount}${e.kind ? ` ${e.kind}` : ""}`);
      if (side.get(tg) === "party") {
        add(f.taken, names.get(tg)!, e.amount);
        if (e.kind) { const k = kinds.get(names.get(tg)!) ?? new Map<string, number>(); add(k, String(e.kind), e.amount); kinds.set(names.get(tg)!, k); }
        // A status's damage on the party (Bleed, Burn, Shock) shows on screen as its own message: name it here too.
        if (e.part === "pulse") add(f.pulses, String(e.src), e.amount);
      }
      else if (e.by && side.get(String(e.by)) === "party") add(f.dealt, names.get(String(e.by))!, real);
      else if (e.part === "pulse") add(f.dealt, `(statuses on foes: ${String(e.src)})`, real);
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
      f.down.push(`${names.get(String(e.unit))} ${t(e.at)}${last.has(String(e.unit)) ? ` (last blow: ${last.get(String(e.unit))})` : ""}`);
      f.hp.set(String(e.unit), 0);
    } else if (e.t === "leave") f.hp.set(String(e.unit), 0);
    else if (e.t === "mp" && side.get(String(e.target)) === "party") mp.set(String(e.target), e.mp as number);
    else if (e.t === "enrage") out.push(`  ${t(e.at)} The fight drags on: from now on every blow lands harder, and harder still as it goes.`);
    else if (e.t === "revive") {
      out.push(`  ${t(e.at)} ${names.get(String(e.unit))} is raised by ${names.get(String(e.by))}.`);
      f.hp.set(String(e.unit), e.hp as number);
    } else if (e.t === "fight_end") {
      const foesLeft = [...f.hp].filter(([id, hp]) => side.get(id) === "enemy" && hp > 0).map(([id, hp]) => { const p = (100 * hp) / max.get(id)!; return `${names.get(id)} at ${p < 1 ? "under 1" : Math.round(p)}%`; });
      const party = [...f.hp].filter(([id]) => side.get(id) === "party").map(([id, hp]) => `${names.get(id)} ${hp}/${max.get(id)}`);
      const mpLeft = [...mp].map(([id, v]) => `${names.get(id)} ${v}`);
      out.push(`  ${e.result === "won" ? "WON" : "LOST"} at t${e.rounds}. Party after: ${party.join(", ")}.${mpLeft.length ? ` MP left: ${mpLeft.join(", ")}.` : ""}${foesLeft.length ? ` Foes still standing: ${foesLeft.join(", ")}.` : ""}`);
      const sideOf = (x: string) => side.get([...names].find(([, nm]) => x.startsWith(`${nm} `))?.[0] ?? "");
      const down = f.down.filter((x) => sideOf(x) !== "enemy");
      if (down.length) out.push(`  Knocked out: ${down.join(", ")}.`);
      // How each foe fell, so a win reads as more than a tick count (an AI playtester's ask).
      const felled = f.down.filter((x) => sideOf(x) === "enemy");
      if (felled.length) out.push(`  Foes felled: ${felled.join(", ")}.`);
      const fmt = (m: Map<string, number>) => [...m].map(([k, v]) => `${k} ${v}`).join(", ");
      if (f.dealt.size) out.push(`  Damage dealt: ${fmt(f.dealt)}.`);
      if (f.taken.size) out.push(`  Damage taken: ${[...f.taken].map(([k, v]) => `${k} ${v}${kinds.get(k)?.size ? ` (${[...kinds.get(k)!].sort((a, b) => b[1] - a[1]).map(([kk, vv]) => `${kk} ${vv}`).join(", ")})` : ""}`).join(", ")}.`);
      if (f.pulses.size) out.push(`  Of the damage the party took, statuses dealt: ${fmt(f.pulses)}.`);
      if (f.healed.size) out.push(`  Healing received: ${fmt(f.healed)}.`);
      if (f.acts.size) out.push(`  Abilities used: ${fmt(f.acts)}.`);
      if (f.foeStatus.size) out.push(`  Statuses on foes (peak stacks): ${[...f.foeStatus].map(([k, v]) => `${k}${v > 1 ? ` ${Math.round(v)}` : ""}`).join(", ")}.`);
      if (f.words.size) out.push(`  Your hits that showed a word: ${fmt(f.words)}.`);
      if (f.status.size) out.push(`  Statuses on your party (peak stacks): ${[...f.status].map(([k, v]) => `${k.replace(" on your party", "")}${v > 1 ? ` ${Math.round(v)}` : ""}`).join(", ")}.`);
    }
  }
  return out.join("\n");
}
