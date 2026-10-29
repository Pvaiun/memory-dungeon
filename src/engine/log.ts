/**
 * The log: everything that happened in a run, in order, as data for code to
 * count. Each entry is either something a player could see, or a hidden number
 * (rolls, chances, seeds), so a player-facing log is just a filter.
 *
 * Logs are optional: bulk runs switch them off, and a run worth a look is
 * replayed with them on. Nothing is stored.
 */

export type Vis = "player" | "hidden";
export type Entry = { t: string; vis: Vis; [k: string]: unknown };

export const playerView = (log: readonly Entry[]): Entry[] => log.filter((e) => e.vis === "player");

/** Sub-ticks as ticks, for display: "t14.75". */
export const tick = (at: unknown) => `t${Number(((at as number) / 1000).toFixed(3))}`;

/** A plain printout for debugging. Hidden numbers are shown in brackets unless `hidden` is false. */
export function printLog(log: readonly Entry[], opts: { hidden?: boolean } = {}): string {
  const showHidden = opts.hidden ?? true;
  const names = new Map<string, string>();
  const name = (id: unknown) => names.get(String(id)) ?? String(id);
  const out: string[] = [];
  for (const e of log) {
    if (e.vis === "hidden") {
      if (!showHidden) continue;
      if (e.t === "run") {
        const c = e.content as { id: string; fingerprint: string };
        out.push(`[run ${e.dungeon}, seed ${e.seed}, engine ${e.engine}, rules ${e.rules}, content ${c.id}#${c.fingerprint}]`);
      } else if (e.t === "dice") out.push(`[dice for ${e.label}]`);
      else if (e.t === "cap") out.push(`      [${tick(e.at)} ${name(e.by)} can't summon ${e.enemy}: the fight is full]`);
      else if (e.t === "roll") out.push(`      [${name(e.by)} rolls ${e.what}: ${fmt(e.roll)}${e.chance !== undefined ? ` against ${fmt(e.chance)}` : ` of ${fmt(e.of)}`}]`);
      else if (e.t === "mp") out.push(`      [${tick(e.at)} ${name(e.target)} MP ${(e.amount as number) >= 0 ? "+" : ""}${e.amount} → ${e.mp}]`);
      else out.push(`      [${describe(e, name, names)}]`);
      continue;
    }
    out.push(describe(e, name, names));
  }
  return out.join("\n");
}

function describe(e: Entry, name: (id: unknown) => string, names: Map<string, string>): string {
  switch (e.t) {
    case "fight_start": {
      const units = e.units as { id: string; name: string; side: string; hp: number; max: number }[];
      units.forEach((u) => names.set(u.id, u.name));
      const side = (s: string) => units.filter((u) => u.side === s).map((u) => `${u.name} ${u.hp}/${u.max}`).join(", ");
      return `\n${e.boss ? "Boss fight" : "Fight"} ${e.stage}: ${side("party")}  vs  ${side("enemy")}`;
    }
    case "join": {
      const u = e.unit as { id: string; name: string; hp: number; max: number };
      names.set(u.id, u.name);
      return `    ${u.name} joins the fight (${u.hp}/${u.max})`;
    }
    case "leave":
      return `    ${name(e.unit)} leaves the fight`;
    case "revive":
      return `    ${name(e.unit)} is raised by ${name(e.by)} (${e.hp} HP${e.ready ? ", ready" : ""})`;
    case "strike":
      return `    ${name(e.by)} strikes again (${e.name}) at ${name(e.target)}`;
    case "cast":
      return `  ${tick(e.at)} ${name(e.by)} begins ${e.name}`;
    case "act":
      return `  ${tick(e.at)} ${name(e.by)} ${e.act === "basic" ? "attacks" : `uses ${e.name} on`} ${(e.targets as string[]).map(name).join(", ")}`;
    case "fail":
      return `  ${tick(e.at)} ${name(e.by)}'s ${e.name} fails (${e.why === "mp" ? "not enough MP" : "no target"})`;
    case "dmg": {
      const what = e.part === "pulse" || e.part === "reaction" ? ` from ${String(e.src).toUpperCase()}` : e.part === "rider" ? " (rider)" : e.part === "extra" ? " (extra strike)" : "";
      if (e.word === "MISS") return `    ${name(e.target)}: MISS${what}`;
      const word = e.word ? ` ${e.word}` : "";
      const soak = e.soaked ? `, ${e.soaked} soaked` : "";
      return `    ${name(e.target)} takes ${e.crit ? "CRIT " : ""}${e.amount}${word}${what}${soak} (${e.hp} HP${e.shield ? `, ${e.shield} shield` : ""})`;
    }
    case "heal":
      return `    ${name(e.target)} heals ${e.crit ? "CRIT " : ""}${e.amount} from ${name(e.by)} (${e.hp} HP)`;
    case "status":
      return `    ${name(e.unit)} gains ${e.name}${e.total !== null ? ` ${fmt(e.total)}` : ""}`;
    case "status_end":
      return `    ${name(e.unit)}'s ${e.name} ends (${e.cause})`;
    case "immune":
      return `    ${name(e.unit)}: IMMUNE to ${e.name}`;
    case "interrupt":
      return `    ${name(e.unit)} is interrupted: ${e.name} is lost`;
    case "hold":
      return `    ${name(e.unit)} is stunned: ${e.name} has to wait`;
    case "down":
      return `    ${name(e.unit)} is down.`;
    case "stop":
      return `  ${tick(e.at)} the fight stops: ${e.why}`;
    case "fight_end":
      return `${e.result === "won" ? "Won" : "Lost"} ${e.stage} at tick ${e.rounds}.`;
    case "offer":
      return `\nDecision ${e.at} (${e.kind}): ${(e.options as string[]).join(", ")}`;
    case "pick":
      return `  Picked ${e.pick}.`;
    case "loot":
      return `Loot: ${(e.items as string[]).join(", ") || "nothing"}.`;
    case "run_end":
      return `\nRun ${e.outcome}.`;
    default:
      return `${e.t} ${JSON.stringify(strip(e))}`;
  }
}

const strip = ({ t: _t, vis: _v, ...rest }: Entry) => rest;
const fmt = (n: unknown) => (typeof n === "number" ? String(Number(n.toFixed(2))) : String(n));
