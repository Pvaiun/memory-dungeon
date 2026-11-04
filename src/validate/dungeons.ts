/** Dungeons, their loot and challenges; the starter and the progression; the rogue block; a full set's totals; unused registry entries. */
import * as S from "../schema.js";
import type { Coll, Index, Pack, Report, Walker } from "./core.js";

// ─── Dungeons and challenges ─────────────────────────────────────────────────

function checkLoot(pack: Pack, ix: Index, w: Walker, r: Report, t: S.LootTableT, path: string) {
  const ids = [...(t.guaranteed ?? []).map((g, i) => [g, `${path}.guaranteed[${i}]`]), ...(t.table ?? []).map((e, i) => [e.gear, `${path}.table[${i}].gear`])];
  for (const [g, p] of ids) {
    if (!w.ref("gear", g, p, "gear")) continue;
    const gear = ix.get<S.GearT>("gear", g)!;
    if (gear.source !== "drop") r.error("loot.source", p, `'${g}' is ${gear.source} gear; loot tables only drop 'drop' gear`);
  }
  const rolls = t.rolls ?? 0;
  if (rolls > 0 && !t.table?.length) r.error("loot.table", path, `${rolls} roll(s) but no table`);
  if (rolls === 0 && t.table?.length) r.warn("loot.table", path, `a table with no rolls never drops`);
  if (!t.guaranteed?.length && rolls === 0) r.error("loot.empty", path, `this clear must pay gear`);
  void pack;
}

export function checkDungeons(pack: Pack, ix: Index, w: Walker, r: Report) {
  const d = pack.design;
  pack.dungeons.forEach((dn, i) => {
    const p = `dungeons[${i}]`;
    const cap = dn.partySize.max;
    if (cap < d.partySize[0] || cap > d.partySize[1]) r.error("dungeon.partySize", `${p}.partySize.max`, `party size ${cap} is outside ${d.partySize[0]}–${d.partySize[1]}`);

    // Stages
    const stageIds = new Set<string>();
    dn.stages.forEach((s, j) => {
      if (stageIds.has(s.id)) r.error("dungeon.stageId", `${p}.stages[${j}]`, `duplicate stage id '${s.id}'`);
      stageIds.add(s.id);
    });
    const kinds = dn.stages.map((s) => s.kind);
    const picks = kinds.filter((k) => k === "perk_pick").length;
    if (picks < d.perkPicksPerRun[0] || picks > d.perkPicksPerRun[1]) {
      r.error("dungeon.perkPicks", `${p}.stages`, `${picks} perk picks; runs have ${d.perkPicksPerRun[0]}–${d.perkPicksPerRun[1]}`);
    }
    kinds.forEach((k, j) => {
      if ((k === "perk_pick" || k === "campfire") && (kinds[j - 1] !== "fight" || kinds[j + 1] !== "fight")) {
        r.error("dungeon.stageOrder", `${p}.stages[${j}]`, `${k === "campfire" ? "a campfire sits" : "perk picks happen"} between two fights`);
      }
    });
    if (kinds.filter((k) => k === "campfire").length > 1) r.error("dungeon.campfires", `${p}.stages`, `a run has at most one campfire`);
    const bosses = dn.stages.flatMap((s, j) => (s.kind === "fight" && s.boss ? [j] : []));
    if (bosses.length !== 1 || bosses[0] !== dn.stages.length - 1) r.error("dungeon.boss", `${p}.stages`, `a run ends in exactly one boss fight, as its last stage`);

    dn.stages.forEach((s, j) => {
      if (s.kind !== "fight") return;
      const sp = `${p}.stages[${j}]`;
      if (s.enemies.length > pack.ruleset.maxEnemies) r.error("fight.size", `${sp}.enemies`, `${s.enemies.length} enemies; ruleset.maxEnemies is ${pack.ruleset.maxEnemies}`);
      s.enemies.forEach((id, k) => w.ref("enemies", id, `${sp}.enemies[${k}]`, "enemy"));
      if (s.boss && !s.enemies.some((id) => ix.get<S.EnemyT>("enemies", id)?.rank === "boss")) {
        r.error("fight.bossRank", sp, `a boss fight needs an enemy of rank boss`);
      }
    });

    // Perk pool, only where the run picks perks
    const pool = dn.perkPool;
    if (new Set(pool).size !== pool.length) r.error("dungeon.perkPoolDuplicate", `${p}.perkPool`, `a perk appears twice`);
    pool.forEach((id, j) => w.ref("perks", id, `${p}.perkPool[${j}]`, "perk"));
    if (pool.length < d.perkPoolSize[0] || pool.length > d.perkPoolSize[1]) {
      r.error("dungeon.perkPool", `${p}.perkPool`, `pool has ${pool.length} perks; pools hold ${d.perkPoolSize[0]}–${d.perkPoolSize[1]}`);
    }
    if (picks > 0) {
      const regulars = pool.filter((id) => ix.get<S.PerkT>("perks", id)?.rarity === "regular");
      if (regulars.length < d.perkOptionsPerPick) r.error("dungeon.perkPoolRegular", `${p}.perkPool`, `fewer regular perks than options per pick`);
    }
    pool.forEach((id, j) => {
      const pk = ix.get<S.PerkT>("perks", id);
      if (pk?.upgradeOf && !pool.includes(pk.upgradeOf)) r.warn("dungeon.premiumBase", `${p}.perkPool[${j}]`, `premium '${id}' upgrades '${pk.upgradeOf}', which isn't in this pool`);
    });

    // Loot
    if (dn.loot) {
      checkLoot(pack, ix, w, r, dn.loot.firstClear, `${p}.loot.firstClear`);
      checkLoot(pack, ix, w, r, dn.loot.replay, `${p}.loot.replay`);
    }

    // Challenges
    const chIds = new Set<string>();
    dn.challenges.forEach((ch, j) => {
      const cp = `${p}.challenges[${j}]`;
      if (chIds.has(ch.id)) r.error("challenge.id", cp, `duplicate challenge id '${ch.id}'`);
      chIds.add(ch.id);
      checkLoot(pack, ix, w, r, ch.loot, `${cp}.loot`);
      let minUnits = 0;
      let maxUnits = cap;
      const included = new Set<string>();
      ch.constraints.forEach((c, k) => {
        const kp = `${cp}.constraints[${k}]`;
        if ("partySize" in c) {
          const { min, max } = c.partySize;
          if (min !== undefined && max !== undefined && min > max) r.error("challenge.impossible", kp, `min is above max`);
          if (min !== undefined && min > cap) r.error("challenge.impossible", kp, `needs ${min} units, but the dungeon allows ${cap}`);
          minUnits = Math.max(minUnits, min ?? 0);
          maxUnits = Math.min(maxUnits, max ?? cap);
        } else if ("includesClass" in c) {
          if (w.ref("classes", c.includesClass, `${kp}.includesClass`, "class")) included.add(c.includesClass);
        } else if ("excludesClass" in c) {
          w.ref("classes", c.excludesClass, `${kp}.excludesClass`, "class");
        } else if ("formation" in c) {
          w.ref("formations", c.formation, `${kp}.formation`, "formation");
        }
      });
      minUnits = Math.max(minUnits, included.size);
      if (minUnits > maxUnits) r.error("challenge.impossible", cp, `constraints need at least ${minUnits} units, but allow ${maxUnits}`);
      for (const k of ch.constraints) if ("excludesClass" in k && included.has(k.excludesClass)) r.error("challenge.impossible", cp, `class '${k.excludesClass}' is both required and excluded`);
    });
  });
}

// ─── Starter and progression ─────────────────────────────────────────────────

export function checkStarterAndProgression(pack: Pack, ix: Index, w: Walker, r: Report) {
  const st = pack.starter;
  const pairs: [Coll, string[], { id: string; source: string }[], string][] = [
    ["classes", st.classes, pack.classes, "class"],
    ["formations", st.formations, pack.formations, "formation"],
    ["gear", st.gear, pack.gear, "gear"],
  ];
  for (const [coll, list, all, what] of pairs) {
    list.forEach((id, i) => {
      if (!w.ref(coll, id, `starter.${coll}[${i}]`, what)) return;
      if (ix.get<{ source: string }>(coll, id)!.source !== "starter") r.error("starter.source", `starter.${coll}[${i}]`, `'${id}' is listed as starter content but its source isn't 'starter'`);
    });
    all.forEach((x) => {
      if (x.source === "starter" && !list.includes(x.id)) r.error("starter.missing", `starter.${coll}`, `'${x.id}' has source 'starter' but isn't in the starter list`);
    });
  }

  const order = pack.progression.dungeonOrder;
  order.forEach((id, i) => w.ref("dungeons", id, `progression.dungeonOrder[${i}]`, "dungeon"));
  if (new Set(order).size !== order.length) r.error("progression.duplicate", "progression.dungeonOrder", `a dungeon appears twice`);
  pack.dungeons.forEach((dn) => {
    if (!order.includes(dn.id)) r.error("progression.missing", "progression.dungeonOrder", `dungeon '${dn.id}' isn't in the progression order`);
  });
  pack.dungeons.forEach((dn, i) => dn.foes?.statuses?.forEach((id, j) => w.ref("statuses", id, `dungeons[${i}].foes.statuses[${j}]`, "status")));
  pack.dungeons.forEach((dn, i) => dn.bossFoes?.statuses?.forEach((id, j) => w.ref("statuses", id, `dungeons[${i}].bossFoes.statuses[${j}]`, "status")));
  if (pack.rogue) checkRogue(pack, w, r, pack.rogue);
}

/** The rogue mode: every enemy, class, ability, status and piece it names exists, and every region's act is one the config has. */
function checkRogue(pack: Pack, w: Walker, r: Report, rg: S.RogueT) {
  const acts = rg.config.knobs.length;
  rg.regions.forEach((reg, i) => {
    if (reg.act > acts) r.error("rogue.act", `rogue.regions[${i}]`, `region '${reg.id}' is in act ${reg.act}, but the config has ${acts} acts`);
    for (const tier of ["easy", "normal", "elite", "bosses"] as const)
      reg[tier].forEach((f, j) => f.enemies.forEach((e, k) => w.ref("enemies", e, `rogue.regions[${i}].${tier}[${j}].enemies[${k}]`, "enemy")));
  });
  for (let a = 1; a <= acts; a++) if (!rg.regions.some((reg) => reg.act === a)) r.error("rogue.act", "rogue.regions", `no region for act ${a}`);
  Object.entries(rg.config.firstAbility ?? {}).forEach(([cls, ab]) => {
    w.ref("classes", cls, `rogue.config.firstAbility.${cls}`, "class");
    if (!pack.classes.find((k) => k.id === cls)?.abilities.includes(ab)) r.error("rogue.ability", `rogue.config.firstAbility.${cls}`, `'${ab}' isn't one of ${cls}'s abilities`);
  });
  // The act odds cover every act. A formation's rarity is its own (Formation.rarity), and the rogue has no loot of
  // its own: its stock is the pack's pieces, each fixed at its rarity.
  if (rg.config.formationOdds && rg.config.formationOdds.length < acts) r.error("rogue.act", "rogue.config.formationOdds", `odds for ${rg.config.formationOdds.length} acts, but the config has ${acts}`);
  if (rg.config.recruits && rg.config.recruits.known.length < acts) r.error("rogue.act", "rogue.config.recruits.known", `odds for ${rg.config.recruits.known.length} acts, but the config has ${acts}`);
  (rg.config.boon.mythic ?? []).forEach((a, i) => (a < 2 || a > acts) && r.error("rogue.act", `rogue.config.boon.mythic[${i}]`, `act ${a} opens with no boss's boon before it (acts 2 to ${acts} do)`));
}

// ─── Totals for a full content set ───────────────────────────────────────────

export function checkComplete(pack: Pack, r: Report) {
  const c = pack.design.complete;
  const inRange = (n: number, rg: [number, number]) => n >= rg[0] && n <= rg[1];
  if (!inRange(pack.classes.length, c.classes)) r.error("complete.classes", "classes", `${pack.classes.length} classes; a full set has ${c.classes[0]}–${c.classes[1]}`);
}

// ─── Unused registry entries ─────────────────────────────────────────────────

export function checkUnused(pack: Pack, ix: Index, r: Report) {
  const used = (c: Coll) => ix.used.get(c)!;
  pack.statuses.forEach((s, i) => !used("statuses").has(s.id) && r.warn("status.unused", `statuses[${i}]`, `nothing applies or reads status '${s.id}'`));
  pack.weaponKinds.forEach((k, i) => !used("weaponKinds").has(k.id) && r.warn("weaponKind.unused", `weaponKinds[${i}]`, `no class or weapon uses kind '${k.id}'`));
  pack.perkFamilies.forEach((f, i) => !pack.perks.some((p) => p.family === f.id) && r.warn("perkFamily.unused", `perkFamilies[${i}]`, `family '${f.id}' has no perks`));
}
