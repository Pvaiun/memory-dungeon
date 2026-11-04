/** Party loadouts (engine input, checked against a valid pack), challenge constraints and teasers, and who can wear what. */
import * as S from "../schema.js";
import { Index, type Issue, type Pack, Report } from "./core.js";

// ─────────────────────────────────────────────────────────────────────────────
// Party loadouts and challenges (engine input, checked against a valid pack)
// ─────────────────────────────────────────────────────────────────────────────

/** What a player owns. Gear is a count per item: copies can be equipped up to that count. */
export type Owned = { classes?: string[]; formations?: string[]; gear?: Record<string, number> };

/** Can this class equip this piece? A mythic by its one class; weapons by kind, armor by type, offhands by kind; amulets always. */
export function canEquip(cls: S.ClassDefT, g: S.GearT): boolean {
  if (g.mythic) return g.mythic === cls.id;
  if (g.slot === "weapon") return !!g.weapon?.kind && cls.weapons.includes(g.weapon.kind);
  if (g.slot === "armor") return !!g.armor && cls.armor.includes(g.armor);
  if (g.slot === "offhand") return !!g.offhand && cls.offhands.includes(g.offhand);
  return true;
}

/** A weapon's hands (its own, or its kind's). A two-handed weapon empties the offhand. */
export function handsOf(pack: Pack, g: S.GearT | undefined): 1 | 2 {
  if (!g?.weapon) return 1;
  return g.weapon.hands ?? pack.weaponKinds.find((k) => k.id === g.weapon!.kind)?.hands ?? 1;
}

/** Why this class can't wear this piece, in a few words (for issues). */
function misfit(cls: S.ClassDefT, g: S.GearT): string {
  if (g.mythic) return `'${g.id}' is the ${g.mythic}'s mythic`;
  if (g.slot === "weapon") return `a ${cls.id} can't use a ${g.weapon?.kind}`;
  if (g.slot === "armor") return `a ${cls.id} wears ${cls.armor.join(" or ")}, not ${g.armor}`;
  return `a ${cls.id} holds ${cls.offhands.join(" or ")}, not ${g.offhand}`;
}

export function checkParty(pack: Pack, raw: unknown, opts: { dungeon?: string; owned?: Owned } = {}): Issue[] {
  const parsed = S.Party.safeParse(raw);
  if (!parsed.success) {
    return parsed.error.issues.map((i) => ({ level: "error" as const, code: "schema", path: i.path.join("."), message: i.message }));
  }
  const party = parsed.data;
  const r = new Report();
  const ix = new Index(pack);
  const d = pack.design;
  const formation = ix.get<S.FormationT>("formations", party.formation);
  if (!formation) r.error("ref.missing", "formation", `unknown formation '${party.formation}'`);
  if (opts.owned?.formations && !opts.owned.formations.includes(party.formation)) r.error("party.notOwned", "formation", `formation '${party.formation}' isn't owned`);

  const cap = opts.dungeon ? ix.get<S.DungeonT>("dungeons", opts.dungeon)?.partySize.max : d.partySize[1];
  if (cap !== undefined && party.units.length > cap) r.error("party.size", "units", `${party.units.length} units; this dungeon allows ${cap}`);

  const classes = new Set<string>();
  const positions = new Set<string>();
  const gearUse = new Map<string, number>();
  party.units.forEach((u, i) => {
    const p = `units[${i}]`;
    const cls = ix.get<S.ClassDefT>("classes", u.class);
    if (!cls) return r.error("ref.missing", `${p}.class`, `unknown class '${u.class}'`);
    if (classes.has(u.class)) r.error("party.uniqueClass", `${p}.class`, `'${u.class}' is already in the party; each class is one unit`);
    classes.add(u.class);
    if (opts.owned?.classes && !opts.owned.classes.includes(u.class)) r.error("party.notOwned", `${p}.class`, `'${u.class}' isn't owned`);

    if (formation && !formation.positions.some((x) => x.id === u.position)) r.error("party.position", `${p}.position`, `formation '${formation.id}' has no position '${u.position}'`);
    if (positions.has(u.position)) r.error("party.position", `${p}.position`, `position '${u.position}' is already taken`);
    positions.add(u.position);

    if (u.abilities.length !== d.abilitiesEquipped) r.error("party.abilities", `${p}.abilities`, `${u.abilities.length} abilities equipped; units equip ${d.abilitiesEquipped}`);
    // A trained form stands for its ability, so two forms of one ability are the ability twice.
    if (new Set(u.abilities.map(S.formBase)).size !== u.abilities.length) r.error("party.abilities", `${p}.abilities`, `an ability is equipped twice`);
    const upgraded = (id: string, kind: S.UpgradeT["kind"]) => (pack.upgrades ?? []).some((x) => x.id === S.formBase(id) && x.class === u.class && x.kind === kind);
    u.abilities.forEach((a, j) => {
      const base = S.formBase(a);
      if (!cls.abilities.includes(base)) r.error("party.abilityNotOwned", `${p}.abilities[${j}]`, `'${u.class}' doesn't have ability '${base}'`);
      else if (base !== a && (!upgraded(a, "ability") || !ix.has("abilities", a))) r.error("party.abilityForm", `${p}.abilities[${j}]`, `'${a}' isn't a form of an upgrade of '${base}'`);
    });
    if (u.passive !== undefined) {
      const base = S.formBase(u.passive);
      if (base === u.passive || !cls.passive?.statuses?.includes(base) || !upgraded(u.passive, "passive") || !ix.has("statuses", u.passive)) {
        r.error("party.passive", `${p}.passive`, `'${u.passive}' isn't a trained form of ${u.class}'s passive`);
      }
    }

    for (const [slot, gid] of Object.entries(u.gear)) {
      const gp = `${p}.gear.${slot}`;
      if (!(slot in S.SLOTS)) r.error("party.slot", gp, `there's no slot '${slot}': units carry a weapon, armor, an offhand and an amulet`);
      const g = ix.get<S.GearT>("gear", gid);
      if (!g) {
        r.error("ref.missing", gp, `unknown gear '${gid}'`);
        continue;
      }
      if (g.slot !== slot) r.error("party.gearSlot", gp, `'${gid}' goes in slot '${g.slot}', not '${slot}'`);
      else if (!canEquip(cls, g)) r.error("party.gearClass", gp, misfit(cls, g));
      gearUse.set(gid, (gearUse.get(gid) ?? 0) + 1);
    }
    // A two-handed weapon empties the offhand; a unit wears one mythic at most.
    if (u.gear.offhand && handsOf(pack, ix.get<S.GearT>("gear", u.gear.weapon ?? "")) === 2) r.error("party.twoHanded", `${p}.gear.offhand`, `a two-handed weapon leaves no hand for an offhand`);
    const mythics = Object.values(u.gear).filter((gid) => ix.get<S.GearT>("gear", gid)?.mythic);
    if (mythics.length > 1) r.error("party.mythics", `${p}.gear`, `a unit wears one mythic at most (${mythics.join(", ")})`);
  });
  if (opts.owned?.gear) {
    for (const [gid, n] of gearUse) {
      const have = opts.owned.gear[gid] ?? 0;
      if (n > have) r.error("party.gearCount", "units", `'${gid}' is equipped ${n} times, but ${have} ${have === 1 ? "is" : "are"} owned`);
    }
  }
  return r.issues;
}

/** Which of a challenge's constraints a party misses. Empty: the party qualifies. */
export function unmetConstraints(pack: Pack, party: S.Party, dungeonId: string, challengeId: string): string[] {
  const ix = new Index(pack);
  const ch = ix.get<S.DungeonT>("dungeons", dungeonId)?.challenges.find((c) => c.id === challengeId);
  if (!ch) return [`unknown challenge '${dungeonId}/${challengeId}'`];
  const out: string[] = [];
  for (const c of ch.constraints) {
    if ("partySize" in c) {
      const n = party.units.length;
      if ((c.partySize.min !== undefined && n < c.partySize.min) || (c.partySize.max !== undefined && n > c.partySize.max)) out.push(`party size ${n}`);
    } else if ("includesClass" in c) {
      if (!party.units.some((u) => u.class === c.includesClass)) out.push(`no ${c.includesClass}`);
    } else if ("excludesClass" in c) {
      if (party.units.some((u) => u.class === c.excludesClass)) out.push(`includes a ${c.excludesClass}`);
    } else if ("formation" in c) {
      if (party.formation !== c.formation) out.push(`formation is ${party.formation}`);
    }
  }
  return out;
}

export type Teaser = { teased: boolean; needs: string[] };

/** Is this challenge a teaser for a player who owns `owned`? Lists the unlocks they'd need. */
export function teaser(pack: Pack, dungeonId: string, challengeId: string, owned: Owned): Teaser {
  const ix = new Index(pack);
  const ch = ix.get<S.DungeonT>("dungeons", dungeonId)?.challenges.find((c) => c.id === challengeId);
  if (!ch) return { teased: false, needs: [`unknown challenge '${dungeonId}/${challengeId}'`] };
  const ownedClasses = new Set(owned.classes ?? []);
  const needs: string[] = [];
  for (const c of ch.constraints) {
    if ("includesClass" in c && !ownedClasses.has(c.includesClass)) needs.push(`class ${c.includesClass}`);
    if ("formation" in c && owned.formations && !owned.formations.includes(c.formation)) needs.push(`formation ${c.formation}`);
  }
  return { teased: needs.length > 0, needs };
}
