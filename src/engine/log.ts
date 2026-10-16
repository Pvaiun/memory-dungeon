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

/** A plain printout for debugging. Hidden numbers are shown in brackets unless `hidden` is false. */
export function printLog(log: readonly Entry[], opts: { hidden?: boolean } = {}): string {
  const showHidden = opts.hidden ?? true;
  const names = new Map<string, string>();
  const name = (id: unknown) => names.get(String(id)) ?? String(id);
  const out: string[] = [];
  let pendingHidden = "";
  for (const e of log) {
    if (e.vis === "hidden") {
      if (!showHidden) continue;
      if (e.t === "roll") pendingHidden = `  [roll ${fmt(e.roll)} vs ${fmt(e.chance)}, ${e.attack} atk vs ${e.defence} def]`;
      else if (e.t === "run") {
        const c = e.content as { id: string; fingerprint: string };
        out.push(`[run ${e.dungeon}, seed ${e.seed}, engine ${e.engine}, rules ${e.rules}, content ${c.id}#${c.fingerprint}]`);
      } else if (e.t === "dice") out.push(`[dice for ${e.label}]`);
      else out.push(`[${e.t} ${JSON.stringify(strip(e))}]`);
      continue;
    }
    const line = describe(e, name, names);
    out.push(line + pendingHidden);
    pendingHidden = "";
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
    case "round":
      return `  Round ${e.n}`;
    case "attack":
      return e.hit
        ? `    ${name(e.by)} hits ${name(e.target)} for ${e.dmg} (${e.hp} left)`
        : `    ${name(e.by)} misses ${name(e.target)}`;
    case "down":
      return `    ${name(e.unit)} is down.`;
    case "fight_end":
      return `${e.result === "won" ? "Won" : "Lost"} ${e.stage} after ${e.rounds} rounds.`;
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
const fmt = (n: unknown) => (typeof n === "number" ? n.toFixed(2) : String(n));
