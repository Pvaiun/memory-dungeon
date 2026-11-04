/**
 * The validator's machinery: the report, the index of every id, the walker that checks references, validatePack (which
 * runs every check in order) and the design block's own checks.
 */
import * as S from "../schema.js";
import { Combat } from "./combat.js";
import { checkEnemies, checkFormations, checkGear, checkPerks, checkUnits, checkUpgrades } from "./content.js";
import { checkComplete, checkDungeons, checkStarterAndProgression, checkUnused } from "./dungeons.js";

export type Issue = { level: "error" | "warning"; code: string; path: string; message: string };
export type Pack = S.ContentPack;

export class Report {
  issues: Issue[] = [];
  error(code: string, path: string, message: string) {
    this.issues.push({ level: "error", code, path, message });
  }
  warn(code: string, path: string, message: string) {
    this.issues.push({ level: "warning", code, path, message });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Index
// ─────────────────────────────────────────────────────────────────────────────

const COLLECTIONS = [
  "stats", "weaponKinds", "armorTypes", "offhandKinds", "statuses", "classes", "abilities", "gear", "formations", "enemies", "perkFamilies", "perks", "dungeons",
] as const;
export type Coll = (typeof COLLECTIONS)[number];

export class Index {
  readonly maps = new Map<Coll, Map<string, any>>();
  readonly used = new Map<Coll, Set<string>>();

  constructor(readonly pack: Pack, r?: Report) {
    for (const coll of COLLECTIONS) {
      const m = new Map<string, any>();
      (pack[coll] as { id: string }[]).forEach((it, i) => {
        if (m.has(it.id)) r?.error("id.duplicate", `${coll}[${i}]`, `duplicate ${coll} id '${it.id}'`);
        m.set(it.id, it);
      });
      this.maps.set(coll, m);
      this.used.set(coll, new Set());
    }
  }

  get<T = any>(coll: Coll, id: string): T | undefined {
    return this.maps.get(coll)!.get(id);
  }
  has(coll: Coll, id: string) {
    return this.maps.get(coll)!.has(id);
  }
}

/** Resolves references, marking what's used. */
export class Walker {
  constructor(readonly ix: Index, readonly r: Report) {}
  ref(coll: Coll, id: string, path: string, what: string): boolean {
    if (!this.ix.has(coll, id)) {
      this.r.error("ref.missing", path, `unknown ${what} '${id}'`);
      return false;
    }
    this.ix.used.get(coll)!.add(id);
    return true;
  }
}

export type ValidateOptions = { complete?: boolean };
export type ValidateResult = { pack?: Pack; issues: Issue[]; errors: number; warnings: number };

export function validatePack(raw: unknown, opts: ValidateOptions = {}): ValidateResult {
  const parsed = S.ContentPack.safeParse(raw);
  if (!parsed.success) {
    const issues: Issue[] = parsed.error.issues.map((i) => ({
      level: "error",
      code: "schema",
      path: i.path.map((s) => (typeof s === "number" ? `[${s}]` : `.${String(s)}`)).join("").replace(/^\./, ""),
      message: i.message,
    }));
    return { issues, errors: issues.length, warnings: 0 };
  }
  const pack = parsed.data;
  const r = new Report();
  const ix = new Index(pack, r);
  const w = new Walker(ix, r);
  const c = new Combat(pack, ix, w, r);

  checkDesign(pack, r);
  c.registries();
  c.statuses();
  c.abilities();
  checkUnits(pack, ix, w, r, c);
  checkGear(pack, ix, w, r, c);
  checkFormations(pack, r, c);
  checkEnemies(pack, w, r, c);
  checkPerks(pack, ix, w, r, c);
  checkDungeons(pack, ix, w, r);
  checkStarterAndProgression(pack, ix, w, r);
  checkUpgrades(pack, ix, w, r);
  if (opts.complete) checkComplete(pack, r);
  checkUnused(pack, ix, r);

  const errors = r.issues.filter((i) => i.level === "error").length;
  return { pack, issues: r.issues, errors, warnings: r.issues.length - errors };
}

function checkDesign(pack: Pack, r: Report) {
  const d = pack.design;
  const rangeOk = (rg: [number, number], path: string) => {
    if (rg[0] > rg[1]) r.error("design.range", path, `range [${rg[0]}, ${rg[1]}] runs backwards`);
  };
  rangeOk(d.partySize, "design.partySize");
  rangeOk(d.perkPicksPerRun, "design.perkPicksPerRun");
  rangeOk(d.perkPoolSize, "design.perkPoolSize");
  if (d.partySize[1] > d.formationPositions) r.error("design.partySize", "design.partySize", `party size can't exceed ${d.formationPositions} formation positions`);
  if (d.abilitiesEquipped > d.abilitiesPerClass) r.error("design.abilities", "design.abilitiesEquipped", `can't equip more abilities than a class has`);
  if (pack.ruleset.run.perkOffer.options !== d.perkOptionsPerPick) {
    r.error("design.perkOptions", "ruleset.run.perkOffer.options", `perk picks offer ${d.perkOptionsPerPick} options (design.perkOptionsPerPick)`);
  }
}
