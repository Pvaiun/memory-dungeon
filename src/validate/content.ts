/** The content's checks: classes, upgrades, gear, formations, enemies and perks. */
import * as S from "../schema.js";
import type { Index, Pack, Report, Walker } from "./core.js";
import { type Combat, RELATIVE_SEATS } from "./combat.js";

// ─── Classes ─────────────────────────────────────────────────────────────────

export function checkUnits(pack: Pack, ix: Index, w: Walker, r: Report, c: Combat) {
  const d = pack.design;
  pack.classes.forEach((cl, i) => {
    const p = `classes[${i}]`;
    c.statBlock(cl.stats, `${p}.stats`);
    c.grants(cl.passive, `${p}.passive`);
    cl.weapons.forEach((k, j) => w.ref("weaponKinds", k, `${p}.weapons[${j}]`, "weapon kind"));
    if (new Set(cl.weapons).size !== cl.weapons.length) r.error("class.weapons", `${p}.weapons`, `a weapon kind is listed twice`);
    // Every class has a one-handed kind, so it can always hold an offhand.
    if (!cl.weapons.some((k) => ix.get<S.WeaponKindT>("weaponKinds", k)?.hands === 1)) r.error("class.oneHanded", `${p}.weapons`, `'${cl.id}' has no one-handed weapon kind, so it could never hold an offhand`);
    cl.armor.forEach((k, j) => w.ref("armorTypes", k, `${p}.armor[${j}]`, "armor type"));
    if (new Set(cl.armor).size !== cl.armor.length) r.error("class.armor", `${p}.armor`, `an armor type is listed twice`);
    cl.offhands.forEach((k, j) => w.ref("offhandKinds", k, `${p}.offhands[${j}]`, "offhand kind"));
    if (new Set(cl.offhands).size !== cl.offhands.length) r.error("class.offhands", `${p}.offhands`, `an offhand kind is listed twice`);
    if (cl.abilities.length !== d.abilitiesPerClass) {
      r.error("class.abilityCount", `${p}.abilities`, `'${cl.id}' has ${cl.abilities.length} abilities; every class has ${d.abilitiesPerClass}`);
    }
    if (new Set(cl.abilities).size !== cl.abilities.length) r.error("class.abilityDuplicate", `${p}.abilities`, `an ability is listed twice`);
    cl.abilities.forEach((aid, j) => {
      if (!w.ref("abilities", aid, `${p}.abilities[${j}]`, "ability")) return;
      const a = ix.get<S.AbilityT>("abilities", aid)!;
      if (a.class !== cl.id) {
        r.error("class.abilityClass", `${p}.abilities[${j}]`, `ability '${aid}' belongs to class '${a.class ?? "none"}', not '${cl.id}'; abilities don't cross classes`);
      }
    });
  });

  // An upgrade's forms are reached by training, not listed by their class.
  const forms = new Set((pack.upgrades ?? []).filter((u) => u.kind === "ability").flatMap((u) => Object.keys(S.UPGRADE_FORMS).map((f) => S.formId(u.id, f as S.UpgradeFormT))));
  pack.abilities.forEach((a, i) => {
    const used = pack.classes.some((cl) => cl.abilities.includes(a.id)) || pack.enemies.some((e) => e.abilities?.includes(a.id)) || forms.has(a.id);
    if (!used) r.warn("ability.unused", `abilities[${i}]`, `no class or enemy lists ability '${a.id}'`);
  });
}

// ─── Upgrades ────────────────────────────────────────────────────────────────

/**
 * Every upgrade names a class and one of its abilities or its passive status, at most once, and its five forms are
 * all there: abilities of that class, or statuses. Nothing else takes a form's id.
 */
export function checkUpgrades(pack: Pack, ix: Index, w: Walker, r: Report) {
  const seen = new Set<string>();
  const formIds = new Set<string>();
  (pack.upgrades ?? []).forEach((u, i) => {
    const p = `upgrades[${i}]`;
    if (seen.has(u.id)) r.error("upgrade.duplicate", p, `'${u.id}' is upgraded twice`);
    seen.add(u.id);
    if (!w.ref("classes", u.class, `${p}.class`, "class")) return;
    const cls = ix.get<S.ClassDefT>("classes", u.class)!;
    if (u.kind === "ability" && !cls.abilities.includes(u.id)) r.error("upgrade.base", `${p}.id`, `'${u.id}' isn't one of ${u.class}'s abilities`);
    if (u.kind === "passive" && !cls.passive?.statuses?.includes(u.id)) r.error("upgrade.base", `${p}.id`, `'${u.id}' isn't a status of ${u.class}'s passive`);
    for (const f of Object.keys(S.UPGRADE_FORMS) as S.UpgradeFormT[]) {
      const id = S.formId(u.id, f);
      formIds.add(id);
      const fp = `${p} (form ${id})`;
      if (u.kind === "ability") {
        if (!w.ref("abilities", id, fp, "ability (an upgrade's form)")) continue;
        const a = ix.get<S.AbilityT>("abilities", id)!;
        if (a.class !== u.class) r.error("upgrade.form", fp, `form '${id}' belongs to class '${a.class ?? "none"}', not '${u.class}'`);
        if (pack.classes.some((c) => c.abilities.includes(id))) r.error("upgrade.form", fp, `form '${id}' is listed as a class's own ability; forms are reached by training`);
      } else w.ref("statuses", id, fp, "status (an upgrade's form)");
    }
  });
  // A form's id belongs to its upgrade: no stray <id>__p and the rest without one.
  pack.abilities.forEach((a, i) => S.formBase(a.id) !== a.id && !formIds.has(a.id) && r.error("upgrade.stray", `abilities[${i}]`, `'${a.id}' is named as an upgrade's form, but no upgrade of '${S.formBase(a.id)}' exists`));
  pack.statuses.forEach((s, i) => S.formBase(s.id) !== s.id && !formIds.has(s.id) && r.error("upgrade.stray", `statuses[${i}]`, `'${s.id}' is named as an upgrade's form, but no upgrade of '${S.formBase(s.id)}' exists`));
}

// ─── Gear ────────────────────────────────────────────────────────────────────

export function checkGear(pack: Pack, ix: Index, w: Walker, r: Report, c: Combat) {
  pack.gear.forEach((g, i) => {
    const p = `gear[${i}]`;
    // A mythic fits one class whatever its kind, so it may have none (a mythic weapon states its own speed, type and hands).
    if (g.mythic) w.ref("classes", g.mythic, `${p}.mythic`, "class");
    // A piece's rarity is mythic exactly when it names its class.
    if (g.rarity && (g.rarity === "mythic") !== !!g.mythic) r.error("gear.rarity", `${p}.rarity`, g.mythic ? `a mythic piece's rarity is mythic` : `only a piece that names its class with 'mythic' is mythic`);
    if (g.slot === "weapon") {
      if (!g.weapon) r.error("gear.weapon", p, `a weapon sets the basic attack: give it 'weapon'`);
      else if (!g.weapon.kind && !g.mythic) r.error("gear.weapon", `${p}.weapon`, `a weapon piece belongs to a kind`);
    } else if (g.weapon) r.error("gear.weapon", `${p}.weapon`, `only the weapon slot sets a basic attack`);
    if (g.slot === "armor") {
      if (g.armor) w.ref("armorTypes", g.armor, `${p}.armor`, "armor type");
      else if (!g.mythic) r.error("gear.armor", p, `armor has an armor type`);
    } else if (g.armor) r.error("gear.armor", `${p}.armor`, `only armor has an armor type`);
    if (g.slot === "offhand") {
      if (g.offhand) w.ref("offhandKinds", g.offhand, `${p}.offhand`, "offhand kind");
      else if (!g.mythic) r.error("gear.offhand", p, `an offhand has an offhand kind`);
    } else if (g.offhand) r.error("gear.offhand", `${p}.offhand`, `only offhands have an offhand kind`);
    const okSource = g.tier === "ordinary" ? g.source !== "unlock" : g.source === "unlock";
    if (!okSource) r.error("gear.source", `${p}.source`, `${g.tier} gear can't come from '${g.source}' (ordinary: starter or drop; powerful: unlock)`);
    if (g.weapon) c.weapon(g.weapon, `${p}.weapon`);
    c.grants(g, p);
  });
  const ids = new Set(pack.gear.map((g) => g.id));
  for (const cl of pack.classes) {
    // Each class arrives with the plain weapon of its first kind: a starter piece of that kind must exist.
    const plain = pack.gear.find((g) => g.slot === "weapon" && g.source === "starter" && g.weapon?.kind === cl.weapons[0]);
    if (!plain) r.warn("gear.plain", "gear", `no starter weapon of kind '${cl.weapons[0]}' for the ${cl.id} to arrive with`);
  }
  pack.starter.gear.forEach((id, i) => {
    if (ids.has(id) && ix.get<S.GearT>("gear", id)!.source !== "starter") r.error("starter.source", `starter.gear[${i}]`, `'${id}' isn't starter gear`);
  });
  void w;
}

// ─── Formations ──────────────────────────────────────────────────────────────

export function checkFormations(pack: Pack, r: Report, c: Combat) {
  pack.formations.forEach((f, i) => {
    const p = `formations[${i}]`;
    if (f.positions.length !== pack.design.formationPositions) {
      r.error("formation.positions", `${p}.positions`, `'${f.id}' has ${f.positions.length} positions; formations always have ${pack.design.formationPositions}`);
    }
    const ids = new Set<string>();
    const cells = new Set<string>();
    f.positions.forEach((pos, j) => {
      const pp = `${p}.positions[${j}]`;
      if (ids.has(pos.id)) r.error("formation.positionId", pp, `duplicate position id '${pos.id}'`);
      if (RELATIVE_SEATS.includes(pos.id)) r.error("formation.positionId", pp, `'${pos.id}' names a relative seat; a position needs another id`);
      ids.add(pos.id);
      const cell = `${pos.layout.line}:${pos.layout.column}`;
      if (cells.has(cell)) r.error("formation.layout", `${pp}.layout`, `two slots are drawn in the same place (${pos.layout.line}, column ${pos.layout.column})`);
      cells.add(cell);
      c.grants(pos, pp);
      if ((pos.stats?.length || pos.statuses?.length) && !pos.text) r.warn("formation.slotText", pp, `slot '${pos.id}' has effects but no text telling the player what it does`);
    });
    c.grants(f, p);
  });
}

// ─── Enemies ─────────────────────────────────────────────────────────────────

export function checkEnemies(pack: Pack, w: Walker, r: Report, c: Combat) {
  pack.enemies.forEach((e, i) => {
    const p = `enemies[${i}]`;
    c.statBlock(e.stats, `${p}.stats`);
    if (e.weapon) c.weapon(e.weapon, `${p}.weapon`);
    e.abilities?.forEach((a, j) => w.ref("abilities", a, `${p}.abilities[${j}]`, "ability"));
    e.statuses?.forEach((s, j) => w.ref("statuses", s, `${p}.statuses[${j}]`, "status"));
  });
  void r;
}

// ─── Perks ───────────────────────────────────────────────────────────────────

export function checkPerks(pack: Pack, ix: Index, w: Walker, r: Report, c: Combat) {
  pack.perks.forEach((pk, i) => {
    const p = `perks[${i}]`;
    w.ref("perkFamilies", pk.family, `${p}.family`, "perk family");
    if (pk.upgradeOf) {
      if (pk.rarity !== "premium") r.error("perk.upgradeOf", `${p}.upgradeOf`, `only premium perks upgrade another perk`);
      if (w.ref("perks", pk.upgradeOf, `${p}.upgradeOf`, "perk")) {
        const base = ix.get<S.PerkT>("perks", pk.upgradeOf)!;
        if (base.rarity !== "regular") r.error("perk.upgradeOf", `${p}.upgradeOf`, `'${pk.upgradeOf}' must be a regular perk`);
        if (base.family !== pk.family) r.warn("perk.upgradeFamily", `${p}.upgradeOf`, `upgrades a perk from another family`);
      }
    }
    if (!pk.stats?.length && !pk.statuses?.length) r.error("perk.empty", p, `perk '${pk.id}' gives no stats and no statuses`);
    pk.for?.classes?.forEach((cl, j) => w.ref("classes", cl, `${p}.for.classes[${j}]`, "class"));
    c.grants(pk, p);
    if (!pack.dungeons.some((dn) => dn.perkPool.includes(pk.id))) r.warn("perk.unused", p, `perk '${pk.id}' isn't in any dungeon's pool`);
  });
}
