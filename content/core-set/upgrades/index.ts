/**
 * Every class's upgrades and mythics, gathered for the pack (pieces/index.ts) and the tools. Each class's file adds its
 * upgrades (a power step and two versions for each ability and passive, as five forms each) to its half's lists, so the
 * files are imported here in order, for that: the first eight classes are written with kit-1.ts, the other eight with
 * kit-2.ts, and each half's mythics follow its classes.
 *
 * `upgrades` joins the pack's upgrades, `abilities` (the ability forms) its abilities, `statuses` (passive forms and helpers,
 * and the mythics' statuses) its statuses, `mythics` its gear and the rogue's stock; `builds` is designer data, never in the pack.
 */
import "./knight.js";
import "./cleric.js";
import "./ranger.js";
import "./bramble-knight.js";
import "./hoplite.js";
import "./paladin.js";
import "./valkyrie.js";
import "./bard.js";
import "./mythics-1.js";
import "./hexer.js";
import "./monk.js";
import "./assassin.js";
import "./vampire.js";
import "./pyromancer.js";
import "./frostweaver.js";
import "./stormcaller.js";
import "./geomancer.js";
import "./mythics-2.js";
import type { AbilityT, GearT, StatusT, UpgradeT } from "../../../src/schema.js";
import type { Builds } from "../pieces/kit.js";
import { buildTags, helpers, ups } from "./kit-1.js";
import { mythicBuilds, mythicGear, mythicStatuses } from "./mythics-1.js";
import * as kit2 from "./kit-2.js";

type Half = { upgrades: UpgradeT[]; abilities: AbilityT[]; statuses: StatusT[]; mythics: GearT[]; builds: Builds };

/** Knight to Bard. */
export const first: Half = {
  upgrades: ups.map((u) => u.up),
  abilities: ups.filter((u) => u.up.kind === "ability").flatMap((u) => u.forms as AbilityT[]),
  statuses: [...ups.filter((u) => u.up.kind === "passive").flatMap((u) => u.forms as StatusT[]), ...helpers, ...mythicStatuses],
  mythics: mythicGear,
  builds: { ...buildTags, ...mythicBuilds },
};
/** Hexer to Geomancer. */
export const second: Half = { upgrades: kit2.upgrades, abilities: kit2.abilities, statuses: kit2.statuses, mythics: kit2.mythics, builds: kit2.builds };
