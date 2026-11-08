/** The bands every line is judged against, with their reasons, and each set's sheet computed from its tally, pooled and flagged. */
import type { Content } from "../../src/engine/run.js";
import { registerGear } from "../../src/rogue.js";
import { get, rogueGear, type Tally } from "./plays.js";
import { abilityShape, CASTERS, ROLE } from "./tally.js";

// ─── The sheet ──────────────────────────────────────────────────────────────

export const r1 = (x: number) => (Number.isFinite(x) ? (Math.abs(x) >= 100 ? Math.round(x).toLocaleString("en") : (Math.round(x * 10) / 10).toString()) : "–");
export const r2 = (x: number) => (Number.isFinite(x) ? (Math.round(x * 100) / 100).toString() : "–");
export const pc = (x: number) => (Number.isFinite(x) ? `${Math.round(100 * x)}%` : "–");
export const div = (a: number, b: number) => (b ? a / b : NaN);
export const mean = (xs: number[]) => { const ys = xs.filter(Number.isFinite); return ys.length ? ys.reduce((a, b) => a + b, 0) / ys.length : NaN; };
const median = (xs: number[]) => { const ys = xs.filter(Number.isFinite).sort((a, b) => a - b); return ys.length ? ys[Math.floor(ys.length / 2)] : NaN; };

/**
 * The bands, each with its reason: the core set documents say what each thing is for, and one principle sets the rest:
 * every option is a real choice, so nothing is useless, dominated or required, and nothing wins on its own.
 */
export const BANDS: Record<string, { lo: number; hi: number; unit: string; why: string; on?: string }> = {
  "class.win": { lo: -8, hi: 8, unit: "pts", why: "Every class is in about the same number of parties (the spread). A class whose parties win 8 points more than the parties without it carries them (required); 8 points less, and it's a passenger (useless). The documents: each class 'should be worth getting on its own', and every class is in at least one winning trio and has fights where it's the wrong pick." },
  "class.dmgDealer": { lo: 0.8, hi: 1.7, unit: "× an average unit", why: "A dealer's damage per unit-fight against the average unit's. The classes document names eight dealers (the three fighters, the four mages and the Ranger); one at 0.8 is outdamaged by the walls, one at 1.7 is the party's whole offence." },
  "class.dmgOther": { lo: 0.25, hi: 1.2, unit: "× an average unit", why: "A wall or support still swings (nothing is useless), but one that outdamages an average dealer (1.2) makes the dealers pointless." },
  "class.ko": { lo: 0, hi: 2.2, unit: "× the median class", why: "Knockouts per fight against the median class. The casters are fragile by design (HP 2), so up to about twice the median is their shape; past 2.2 a class is a liability nobody brings." },
  "class.takenWall": { lo: 1.1, hi: 2.4, unit: "× an average unit, per tick alive", why: "A wall's job is to be hit (Aggro 4–5, plate). Below 1.1 it isn't drawing; above 2.4 it takes everything and the draw rule's 'between a third and three times' is doing nothing for the others." },
  "class.takenOther": { lo: 0.35, hi: 1.25, unit: "× an average unit, per tick alive", why: "A dealer or support that takes more than 1.25 average units' damage per tick is the one being hit while the wall stands by; below 0.35 it can't be reached (the draw floor is a third)." },
  "class.starvedCaster": { lo: 0.03, hi: 0.3, unit: "share of time (free play)", on: "free", why: "Casters are hungry, so some time with a spell ready and no MP is the design (above 3%); past 30% the caster is a basic-attacker with a staff. Read on free play's runs, where MP carries from fight to fight." },
  "class.starvedOther": { lo: 0, hi: 0.08, unit: "share of time (free play)", on: "free", why: "Walls and fighters rarely run dry. Past 8% their cheap skills aren't cheap." },
  "class.casts": { lo: 1.6, hi: 6, unit: "casts a regular fight", why: "Three slotted abilities in a fight of 30 to 40 ticks on 24/32/42 cooldowns with slotted head starts: fewer than 1.6 casts a fight and the kit isn't playing (5c: 'those cooldowns are too long'); more than 6 and basic attacks are gone (5b's complaint)." },
  "ability.castsMob": { lo: 0.45, hi: 3, unit: "casts a regular fight owned", why: "An ability slotted by a standing member should fire in most regular fights; under 0.45 it fires in fewer than half, and the slot is dead (useless). Over 3 it's the unit's whole rhythm." },
  "ability.castsBoss": { lo: 0.9, hi: 6, unit: "casts a boss fight owned", why: "A boss fight is about one and a half regular fights long (5b); every slotted ability should come at least once, or it's a slot wasted where it matters most." },
  "ability.swings": { lo: 1.4, hi: 10, unit: "swings a cast", why: "scale.ts: a light hit is about 1.7 swings, a normal about 3, a heavy about 5 (on the same stat); a finisher that grows with stacks (Pyre) or crit (Backstab) can reach 8 or 9. Below 1.4 a basic attack does the job (dominated); above 10 the ability is the class and its other two don't matter." },
  "ability.share": { lo: 0, hi: 0.62, unit: "share of the class's damage", why: "A kit is three abilities and a passive on a basic attack. One ability over 62% of its class's damage means the rest is filler (nothing wins on its own)." },
  "ability.fail": { lo: 0, hi: 0.1, unit: "share of attempts", why: "A cast that fizzles (no MP at resolution, or no target) is a lost action and a lost cooldown. Past 10% the ability is unreliable." },
  "ability.healShare": { lo: 0.12, hi: 0.7, unit: "of an average unit's HP a cast", why: "Cure is 'a quick, small heal', Rally bigger; under 12% of a unit's HP a heal doesn't change a fight, over 70% a single cast undoes a boss's blow (nothing wins on its own)." },
  "ability.stacks": { lo: 1.5, hi: Infinity, unit: "stacks an application", why: "The scale: a few is about 2, several 4, many 7 (doubled on abilities). An application under 1.5 stacks is noise. The ceiling is the status's own cap (25 Might, 40 Shock, 8 Chill), or none (Burn, Bleed, Sunder), and its damage share is judged on the status's line." },
  "status.dmgShare": { lo: 0.05, hi: 0.35, unit: "share of its appliers' damage", why: "5c: Bleed level with Burn and Shock in their classes, 12% to 27%. Under 5% a damage status is a side dish nobody builds for; over 35% the status is the class." },
  "status.apps": { lo: 0.05, hi: Infinity, unit: "applications a fight", why: "A status nobody applies in the spread (fewer than one in twenty fights) is unreachable content; the tier check says every piece is used." },
  "enemy.acted0": { lo: 0, hi: 0.25, unit: "share killed before acting (free play)", on: "free", why: "5c put minions dying before acting at 12% ('the price of a fixed opening'). Past a quarter the foe is a number on the screen, not a fight. Read in free play, at the documents' numbers, where no knob has shrunk it." },
  "enemy.dmgRank": { lo: 0.3, hi: 3, unit: "× its rank's median (free play)", on: "free", why: "Damage dealt per appearance against the median of its rank (minion, elite, boss), at the documents' numbers. A foe at 0.3 is scenery; at 3 it's the only one that matters in its fights." },
  "enemy.lifeRank": { lo: 0.4, hi: 2.5, unit: "× its rank's median (free play)", on: "free", why: "Life in ticks against its rank's median, at the documents' numbers. Far below, it dies before its gimmick shows; far above, it's the fight's whole length." },
  "boss.signature": { lo: 0.9, hi: Infinity, unit: "casts a fight (free play)", on: "free", why: "The enemies document: a boss's signature move comes two or three times a fight (5b put it on a medium cooldown for that). A boss that casts it less than once a fight is a stat line." },
  "boss.kos": { lo: 0.15, hi: 2.5, unit: "knockouts a fight (free play)", on: "free", why: "A boss is the run's climax: one that never knocks anyone out isn't one; one that knocks out more than two and a half of three every fight decides the run on its own." },
  "gear.win": { lo: -7, hi: 7, unit: "pts against the slot's mean, probed", on: "probe", why: "The gear document: ordinary pieces are sidegrades, powerful pieces 'never a pure upgrade'. Probed alone on a bare unit beside the same companions: a piece 7 points under the mean of the pieces its wearers could have worn in that slot is dead weight; 7 over is the required piece." },
  "gear.empty": { lo: -2, hi: Infinity, unit: "pts against an empty slot, probed", on: "probe", why: "Nothing is useless: a piece of armor or an amulet should never lose to leaving the slot empty (2 points under, past noise). A weapon is probed against the class's plain one." },
  "gear.worn": { lo: 1, hi: Infinity, unit: "unit-fights", why: "Every piece must be measured; a piece never worn is a hole in the spread." },
  "formation.win": { lo: -7, hi: 7, unit: "pts against Neutral, probed", on: "probe", why: "The gear document: 'whether a slot at about one gear piece makes a formation a decision'. The same parties in every formation: one below Neutral by 7 points is dominated by doing nothing; one 7 above is the only formation." },
};

export type Flag = { kind: string; id: string; name: string; band: string; value: number; set: string; severity: number; text: string };

type Lines = Record<string, Record<string, number>>;
export type Sheet = {
  classes: Lines; abilities: Lines; enemyAbilities: Lines; statuses: Lines; enemies: Lines; gear: Lines; formations: Lines;
  resources: Record<string, number>; events: Record<string, number>; stats: Record<string, number>; flags: Flag[]; context: Record<string, number>;
  /** What the judge needs beyond numbers: each status's kit appliers in this set. */
  meta: { appliers: Record<string, string[]> };
};
/** Line metrics that are counts, summed when sets are pooled; everything else is a rate or a mean, averaged. */
const SUM_KEYS = new Set(["fights", "runs", "n", "ownedMob", "worn", "kit", "failMp", "failTarget", "dmg", "kills", "kos", "immune", "silentMob"]);

function keys(t: Tally, prefix: string): string[] {
  const out = new Set<string>();
  for (const k of Object.keys(t)) if (k.startsWith(prefix)) out.add(k.slice(prefix.length).split("|")[0]);
  return [...out];
}

/** The lines of one tally (one set, or both pooled). */
export function compute(c: Content, t: Tally, setName: string): Sheet {
  const appliersOf: Record<string, string[]> = {};
  const flag = (_kind: string, _id: string, _name: string, _band: string, _value: number, _text: string) => {};
  const fightsMob = get(t, "fights|mob"), fightsBoss = get(t, "fights|boss"), fights = fightsMob + fightsBoss;
  const runs = get(t, "runs"), won = get(t, "won");
  const unitHp = div(get(t, "partyHp|mob") + get(t, "partyHp|boss"), c.pack.classes.reduce((a, k) => a + get(t, `cls|${k.id}|fights|mob`) + get(t, `cls|${k.id}|fights|boss`), 0));

  // Classes.
  const classes: Lines = {};
  const cls = c.pack.classes.map((k) => k.id);
  const perFight = (k: string, m: string) => div(get(t, `cls|${k}|${m}`), get(t, `cls|${k}|fights|mob`) + get(t, `cls|${k}|fights|boss`));
  const perTick = (k: string, m: string) => div(get(t, `cls|${k}|${m}`), get(t, `cls|${k}|alive`));
  const meanDmg = mean(cls.map((k) => perFight(k, "dmg"))), meanTaken = mean(cls.map((k) => perTick(k, "taken"))), meanHits = mean(cls.map((k) => perTick(k, "hitsTaken")));
  const koRates = cls.map((k) => perFight(k, "ko")), medKo = median(koRates);
  for (const k of cls) {
    const f = get(t, `cls|${k}|fights|mob`) + get(t, `cls|${k}|fights|boss`);
    const r = get(t, `cls|${k}|runs`), w = get(t, `cls|${k}|won`);
    const withRate = div(w, r), without = div(won - w, runs - r);
    const dmg = get(t, `cls|${k}|dmg`), basics = get(t, `cls|${k}|act|basic`), abs = get(t, `cls|${k}|act|ability`);
    const swing = div(get(t, `cls|${k}|dmg|basic`), basics);
    const stDmg = Object.keys(t).filter((x) => x.startsWith(`cls|${k}|dmg|st:`)).reduce((a, x) => a + t[x], 0);
    const reDmg = Object.keys(t).filter((x) => x.startsWith(`cls|${k}|dmg|re:`)).reduce((a, x) => a + t[x], 0);
    const abDmg = Object.keys(t).filter((x) => x.startsWith(`cls|${k}|dmg|ab:`)).reduce((a, x) => a + t[x], 0);
    const line = {
      fights: f, runs: r, win: 100 * (withRate - without), winWith: 100 * withRate,
      dmgIdx: div(perFight(k, "dmg"), meanDmg), dmgPerFight: perFight(k, "dmg"), swing,
      basicShare: div(get(t, `cls|${k}|dmg|basic`), dmg), abilityShare: div(abDmg, dmg), statusShare: div(stDmg, dmg), reactionShare: div(reDmg, dmg),
      hitShare: div(get(t, `cls|${k}|dmgk|physical`), dmg), untypedShare: div(get(t, `cls|${k}|dmgk|untyped`), dmg),
      takenIdx: div(perTick(k, "taken"), meanTaken), hitsIdx: div(perTick(k, "hitsTaken"), meanHits), takenPerFight: perFight(k, "taken"), alivePerFight: div(get(t, `cls|${k}|alive`), f),
      mitigated: 1 - div(get(t, `cls|${k}|taken`), get(t, `cls|${k}|takenRaw`)), dodge: div(get(t, `cls|${k}|dodged`), get(t, `cls|${k}|hitsTaken`)),
      soakedShare: div(get(t, `cls|${k}|soaked`), get(t, `cls|${k}|taken`) + get(t, `cls|${k}|soaked`)),
      ko: perFight(k, "ko"), koIdx: div(perFight(k, "ko"), medKo), koAt: div(get(t, `cls|${k}|koAt`), get(t, `cls|${k}|ko`)),
      actsPer10: div(10 * (basics + abs), get(t, `cls|${k}|alive`)), basicActShare: div(basics, basics + abs),
      castsMob: div(c.classes.get(k)!.abilities.reduce((a, ab) => a + get(t, `ab|${ab}|casts|mob`), 0), get(t, `cls|${k}|fights|mob`)),
      castsBoss: div(c.classes.get(k)!.abilities.reduce((a, ab) => a + get(t, `ab|${ab}|casts|boss`), 0), get(t, `cls|${k}|fights|boss`)),
      starved: div(get(t, `cls|${k}|starved`), get(t, `cls|${k}|alive`)), failMp: perFight(k, "fail|mp"), failTarget: perFight(k, "fail|target"),
      mpSpent: perFight(k, "mpSpent"), mpGot: perFight(k, "mpGot"), endMp: div(get(t, `cls|${k}|endMp`), get(t, `cls|${k}|endN`)), endHp: div(get(t, `cls|${k}|endHp`), get(t, `cls|${k}|endN`)),
      healGiven: perFight(k, "healGiven"), healGot: perFight(k, "healGot"), shieldGiven: perFight(k, "shieldGiven"),
      crit: div(get(t, `cls|${k}|crit`), get(t, `cls|${k}|hits`)), critDmgShare: div(get(t, `cls|${k}|critDmg`), dmg), miss: div(get(t, `cls|${k}|miss`), get(t, `cls|${k}|hits`) + get(t, `cls|${k}|miss`)),
      kills: perFight(k, "kills"), interrupts: perFight(k, "interrupts"), stuns: perFight(k, "stuns"), interrupted: perFight(k, "interrupted"), revives: perFight(k, "revives"),
      extraPerBasic: div(get(t, `cls|${k}|extra`), basics),
    };
    classes[k] = line;
  }

  // Abilities (the party's).
  const abilities: Lines = {};
  for (const a of c.pack.abilities) {
    if (!c.pack.classes.some((k) => k.abilities.includes(a.id))) continue;
    const owner = c.pack.classes.find((k) => k.abilities.includes(a.id))!;
    const shape = abilityShape(a);
    const casts = get(t, `ab|${a.id}|casts|mob`) + get(t, `ab|${a.id}|casts|boss`);
    const fails = get(t, `ab|${a.id}|fail|mp`) + get(t, `ab|${a.id}|fail|target`);
    const swing = classes[owner.id]?.swing ?? NaN;
    const apps = Object.keys(t).filter((x) => x.startsWith(`ab|${a.id}|app|`)).map((x) => x.split("|")[3]);
    const stacksPer = Object.fromEntries(apps.map((s) => [s, div(get(t, `ab|${a.id}|stacks|${s}`), get(t, `ab|${a.id}|app|${s}`))]));
    const line = {
      kind: ["damage", "heal", "revive", "shield", "control", "cleanse", "debuff", "buff", "other"].indexOf(shape.kind),
      ownedMob: get(t, `ab|${a.id}|owned|mob`), castsMob: div(get(t, `ab|${a.id}|casts|mob`), get(t, `ab|${a.id}|owned|mob`)), castsBoss: div(get(t, `ab|${a.id}|casts|boss`), get(t, `ab|${a.id}|owned|boss`)),
      silentMob: div(get(t, `ab|${a.id}|silentMob`), get(t, `ab|${a.id}|owned|mob`)),
      first: div(get(t, `ab|${a.id}|first`), get(t, `ab|${a.id}|firstN`)),
      dmgPerCast: div(get(t, `ab|${a.id}|dmg`), casts), swings: div(div(get(t, `ab|${a.id}|dmg`), casts), swing), share: div(get(t, `ab|${a.id}|dmg`), get(t, `cls|${owner.id}|dmg`)),
      healPerCast: div(get(t, `ab|${a.id}|heal`), casts), healShare: div(div(get(t, `ab|${a.id}|heal`), casts), unitHp), shieldPerCast: div(get(t, `ab|${a.id}|shield`), casts), shieldShare: div(div(get(t, `ab|${a.id}|shield`), casts), unitHp),
      fail: div(fails, casts + fails), failMp: get(t, `ab|${a.id}|fail|mp`), failTarget: get(t, `ab|${a.id}|fail|target`), interrupted: div(get(t, `ab|${a.id}|interrupted`), casts + get(t, `ab|${a.id}|interrupted`)),
      mpPerCast: div(get(t, `ab|${a.id}|mp`), casts), targets: div(get(t, `ab|${a.id}|targets`), casts), crit: div(get(t, `ab|${a.id}|crit`), get(t, `ab|${a.id}|hits`)), miss: div(get(t, `ab|${a.id}|miss`), get(t, `ab|${a.id}|hits`) + get(t, `ab|${a.id}|miss`)),
      kills: div(get(t, `ab|${a.id}|kills`), casts), removed: div(get(t, `ab|${a.id}|removed`), casts), revives: div(get(t, `ab|${a.id}|revive`), casts),
      slot0: div(get(t, `ab|${a.id}|slot|0|casts`), get(t, `ab|${a.id}|slot|0|owned`)), slot1: div(get(t, `ab|${a.id}|slot|1|casts`), get(t, `ab|${a.id}|slot|1|owned`)), slot2: div(get(t, `ab|${a.id}|slot|2|casts`), get(t, `ab|${a.id}|slot|2|owned`)),
      ...Object.fromEntries(Object.entries(stacksPer).map(([s, v]) => [`stacks:${s}`, v])),
      ...Object.fromEntries(apps.map((s) => [`apps:${s}`, div(get(t, `ab|${a.id}|app|${s}`), casts)])),
    };
    abilities[a.id] = line;
  }

  // Enemy abilities.
  const enemyAbilities: Lines = {};
  for (const a of c.pack.abilities) {
    if (c.pack.classes.some((k) => k.abilities.includes(a.id))) continue;
    const casts = get(t, `eab|${a.id}|casts`), fts = get(t, `eab|${a.id}|fights`);
    enemyAbilities[a.id] = {
      fights: fts, castsPerFight: div(casts, fts), dmgPerCast: div(get(t, `eab|${a.id}|dmg`), casts), healPerCast: div(get(t, `eab|${a.id}|heal`), casts),
      kos: div(get(t, `eab|${a.id}|kos`), fts), interrupted: div(get(t, `eab|${a.id}|interrupted`), fts), held: div(get(t, `eab|${a.id}|held`), fts),
      failMp: div(get(t, `eab|${a.id}|fail|mp`), fts), failTarget: div(get(t, `eab|${a.id}|fail|target`), fts),
    };
  }

  // Statuses.
  const statuses: Lines = {};
  const stIds = c.pack.statuses.filter((s) => s.show === "icon").map((s) => s.id);
  // A status's appliers: the classes whose own kit (an ability or the passive) applies it, and did so here.
  const kitApplies = (k: string, s: string) => {
    const d = c.classes.get(k)!;
    if (d.abilities.some((a) => abilityShape(c.abilities.get(a)!).applies.has(s))) return true;
    return (d.passive?.statuses ?? []).some((id) => c.statuses.get(id)?.reactions?.some((r) => r.do.some((x) => x.op === "apply" && x.status === s)));
  };
  const applierClasses = (s: string) => cls.filter((k) => kitApplies(k, s) && get(t, `cls|${k}|app|${s}`) > 0);
  for (const s of stIds) {
    const d = c.statuses.get(s)!;
    const appP = get(t, `st|${s}|app|party`), appE = get(t, `st|${s}|app|enemy`), apps = appP + appE;
    const appliers = applierClasses(s);
    const applierDmg = appliers.reduce((a, k) => a + get(t, `cls|${k}|dmg`), 0);
    const applierStDmg = appliers.reduce((a, k) => a + get(t, `cls|${k}|dmg|st:${s}`) + get(t, `cls|${k}|dmg|re:${s}`), 0);
    const ends = Object.keys(t).filter((x) => x.startsWith(`st|${s}|end|`)).reduce((a, x) => a + t[x], 0);
    const line = {
      appsPerFight: div(apps, fights), onParty: div(appP, fights), onEnemy: div(appE, fights),
      stacksPerApp: div(get(t, `st|${s}|stacks|party`) + get(t, `st|${s}|stacks|enemy`), apps),
      uptimePerApp: div(get(t, `st|${s}|uptime|party`) + get(t, `st|${s}|uptime|enemy`), apps), uptimePerFight: div(get(t, `st|${s}|uptime|party`) + get(t, `st|${s}|uptime|enemy`), fights),
      dmg: get(t, `st|${s}|dmg`), dmgPerApp: div(get(t, `st|${s}|dmg`), appE), dmgShareOfAppliers: div(applierStDmg, applierDmg), dmgShareOfParty: div(get(t, `st|${s}|dmg`), get(t, "partyDmg|mob") + get(t, "partyDmg|boss")),
      dmgOnPartyPerFight: div(get(t, `st|${s}|dmgOnParty`), fights), healPerApp: div(get(t, `st|${s}|heal`), appP),
      kills: get(t, `st|${s}|kills`), kos: get(t, `st|${s}|kos`), immune: get(t, `st|${s}|immune`),
      endExpired: div(get(t, `st|${s}|end|expired`), ends), endStacks: div(get(t, `st|${s}|end|stacks`), ends), endRemoved: div(get(t, `st|${s}|end|removed`), ends), endFight: 1 - div(ends, apps),
      holdsPerApp: div(get(t, `st|${s}|holds`), apps), interruptsPerApp: div(get(t, `st|${s}|interrupts`), apps), tauntHitsPerFight: div(get(t, `st|${s}|tauntHits`), fights),
    };
    statuses[s] = line;
    appliersOf[s] = appliers;
  }

  // Enemies.
  const enemies: Lines = {};
  const ens = c.pack.enemies;
  const byRank = (rank: string, m: (e: typeof ens[number]) => number) => median(ens.filter((e) => e.rank === rank && get(t, `en|${e.id}|n`) > 0).map(m));
  const dmgPer = (e: typeof ens[number]) => div(get(t, `en|${e.id}|dmg`), get(t, `en|${e.id}|n`));
  const lifePer = (e: typeof ens[number]) => div(get(t, `en|${e.id}|life`), get(t, `en|${e.id}|n`));
  const medDmg = { minion: byRank("minion", dmgPer), elite: byRank("elite", dmgPer), boss: byRank("boss", dmgPer) };
  const medLife = { minion: byRank("minion", lifePer), elite: byRank("elite", lifePer), boss: byRank("boss", lifePer) };
  for (const e of ens) {
    const n = get(t, `en|${e.id}|n`), fts = get(t, `en|${e.id}|fights`);
    if (!n) { enemies[e.id] = { n: 0 }; continue; }
    const sig = (e.abilities ?? []).map((a) => div(get(t, `eab|${a}|casts`), fts));
    const line = {
      n, fights: fts, life: lifePer(e), lifeIdx: div(lifePer(e), medLife[e.rank]), acted0: div(get(t, `en|${e.id}|acted0`), n), killed: div(get(t, `en|${e.id}|killed`), n), survived: div(get(t, `en|${e.id}|survived`), n),
      dmg: dmgPer(e), dmgIdx: div(dmgPer(e), medDmg[e.rank]), dmgPerTick: div(get(t, `en|${e.id}|dmg`), get(t, `en|${e.id}|life`)), kos: div(get(t, `en|${e.id}|kos`), fts),
      basics: div(get(t, `en|${e.id}|act|basic`), n), casts: div(get(t, `en|${e.id}|act|ability`), n), signature: sig.length ? Math.max(...sig) : NaN,
      mitigated: 1 - div(get(t, `en|${e.id}|taken`), get(t, `en|${e.id}|takenRaw`)), dodge: div(get(t, `en|${e.id}|dodged`), get(t, `en|${e.id}|hitsTaken`)),
      takenHits: div(get(t, `en|${e.id}|taken|physical`), get(t, `en|${e.id}|taken`)), takenUntyped: div(get(t, `en|${e.id}|taken|untyped`), get(t, `en|${e.id}|taken`)),
      healGot: div(get(t, `en|${e.id}|healGot`), n), interrupted: div(get(t, `en|${e.id}|interrupted`), fts), held: div(get(t, `en|${e.id}|held`), fts),
    };
    enemies[e.id] = line;
  }

  // Gear: each piece against its slot's mean for the same class, weighted by wearings.
  const gear: Lines = {};
  registerGear(c);
  const pieces = [...c.pack.gear, ...rogueGear(c).filter((g) => !c.pack.gear.some((x) => x.id === g.id))];
  const slotOf = new Map<string, string>(pieces.map((g) => [g.id, g.slot]));
  for (const slot of ["weapon", "armor", "amulet"]) slotOf.set(`none:${slot}`, slot);
  const gearIds = keys(t, "gearc|");
  const baseline = new Map<string, { runs: number; won: number; worn: number; dmg: number; taken: number; ko: number }>(); // "slot|class"
  for (const g of gearIds) for (const k of cls) {
    const key = `${slotOf.get(g)}|${k}`, b = baseline.get(key) ?? { runs: 0, won: 0, worn: 0, dmg: 0, taken: 0, ko: 0 };
    b.runs += get(t, `gearc|${g}|${k}|runs`); b.won += get(t, `gearc|${g}|${k}|won`); b.worn += get(t, `gearc|${g}|${k}|worn`); b.dmg += get(t, `gearc|${g}|${k}|dmg`); b.taken += get(t, `gearc|${g}|${k}|taken`); b.ko += get(t, `gearc|${g}|${k}|ko`);
    baseline.set(key, b);
  }
  for (const g of [...pieces.map((x) => x.id), "none:armor", "none:amulet"]) {
    let wSum = 0, win = 0, dmg = 0, taken = 0, ko = 0, koW = 0, heal = 0;
    for (const k of cls) {
      const worn = get(t, `gearc|${g}|${k}|worn`), runsK = get(t, `gearc|${g}|${k}|runs`);
      if (!worn || !runsK) continue;
      const b = baseline.get(`${slotOf.get(g)}|${k}`)!;
      wSum += worn;
      win += worn * 100 * (div(get(t, `gearc|${g}|${k}|won`), runsK) - div(b.won, b.runs));
      dmg += worn * div(div(get(t, `gearc|${g}|${k}|dmg`), worn), div(b.dmg, b.worn));
      taken += worn * div(div(get(t, `gearc|${g}|${k}|taken`), worn), div(b.taken, b.worn));
      if (b.ko) { ko += worn * div(div(get(t, `gearc|${g}|${k}|ko`), worn), div(b.ko, b.worn)); koW += worn; }
      heal += get(t, `gearc|${g}|${k}|heal`);
    }
    const piece = pieces.find((x) => x.id === g);
    const line = {
      worn: get(t, `gear|${g}|worn`), kit: get(t, `gear|${g}|kit`), win: div(win, wSum), dmgIdx: div(dmg, wSum), takenIdx: div(taken, wSum), koIdx: div(ko, koW),
      swingDmg: div(get(t, `gear|${g}|swingDmg`), get(t, `gear|${g}|swings`)), healPerFight: div(heal, get(t, `gear|${g}|worn`)),
    };
    gear[g] = line;
  }

  // Formations.
  const formations: Lines = {};
  const neutral = div(get(t, "form|neutral|won"), get(t, "form|neutral|runs"));
  const formMeanDmg = mean(c.pack.formations.map((f) => div(get(t, `form|${f.id}|dmg`), get(t, `form|${f.id}|fights`))));
  const formMeanTaken = mean(c.pack.formations.map((f) => div(get(t, `form|${f.id}|taken`), get(t, `form|${f.id}|fights`))));
  for (const f of c.pack.formations) {
    const rr = get(t, `form|${f.id}|runs`), fts = get(t, `form|${f.id}|fights`);
    const line = {
      runs: rr, win: 100 * (div(get(t, `form|${f.id}|won`), rr) - neutral), winRate: div(get(t, `form|${f.id}|won`), rr),
      dmgIdx: div(div(get(t, `form|${f.id}|dmg`), fts), formMeanDmg), takenIdx: div(div(get(t, `form|${f.id}|taken`), fts), formMeanTaken), koPerFight: div(get(t, `form|${f.id}|ko`), fts), effectPerFight: div(get(t, `form|${f.id}|effect`), fts),
    };
    formations[f.id] = line;
  }

  // Resources and the party as a whole.
  const partyHpMob = div(get(t, "partyHp|mob"), fightsMob), partyHpBoss = div(get(t, "partyHp|boss"), fightsBoss);
  const resources = {
    "runs": runs, "runs won": div(won, runs), "fights (regular)": fightsMob, "fights (boss)": fightsBoss, "ticks a regular fight": div(get(t, "ticks|mob"), fightsMob), "ticks a boss fight": div(get(t, "ticks|boss"), fightsBoss),
    "HP: damage taken a regular fight, share of party max HP": div(div(get(t, "taken|mob"), fightsMob), partyHpMob), "HP: damage taken a boss fight, share": div(div(get(t, "taken|boss"), fightsBoss), partyHpBoss),
    "HP: healing a regular fight, share": div(div(get(t, "heal|mob"), fightsMob), partyHpMob), "HP: healing a boss fight, share": div(div(get(t, "heal|boss"), fightsBoss), partyHpBoss),
    "HP: shield soaked, share of damage": div(cls.reduce((a, k) => a + get(t, `cls|${k}|soaked`), 0), cls.reduce((a, k) => a + get(t, `cls|${k}|taken`) + get(t, `cls|${k}|soaked`), 0)),
    "HP: knockouts a regular fight": div(get(t, "ko|mob"), fightsMob), "HP: knockouts a boss fight": div(get(t, "ko|boss"), fightsBoss),
    "HP: knockouts by basic attacks, abilities, statuses": div(get(t, "koBy|basic"), get(t, "koBy|basic") + get(t, "koBy|ability") + get(t, "koBy|status")),
    "HP: knockouts by abilities": div(get(t, "koBy|ability"), get(t, "koBy|basic") + get(t, "koBy|ability") + get(t, "koBy|status")),
    "MP: spent a fight (party)": div(cls.reduce((a, k) => a + get(t, `cls|${k}|mpSpent`), 0), fights), "MP: regained a fight (party)": div(cls.reduce((a, k) => a + get(t, `cls|${k}|mpGot`), 0), fights),
    "MP: starved share of time (party)": div(cls.reduce((a, k) => a + get(t, `cls|${k}|starved`), 0), cls.reduce((a, k) => a + get(t, `cls|${k}|alive`), 0)),
    "MP: casts fizzled for MP, a fight": div(cls.reduce((a, k) => a + get(t, `cls|${k}|fail|mp`), 0), fights), "casts lost for want of a target, a fight": div(cls.reduce((a, k) => a + get(t, `cls|${k}|fail|target`), 0), fights),
    "campfire: rest": get(t, "camp|rest"), "campfire: focus": get(t, "camp|focus"), "campfire: raise": get(t, "camp|raise"),
    "fights that reached the enrage": get(t, "enrage|mob") + get(t, "enrage|boss"),
    "losses in regular fights": get(t, "lost|mob"), "losses in boss fights": get(t, "lost|boss"),
    "party damage a regular fight": div(get(t, "partyDmg|mob"), fightsMob), "party damage a boss fight": div(get(t, "partyDmg|boss"), fightsBoss),
    "runs won: the sensible kits": div(get(t, "kind|kit|won"), get(t, "kind|kit|runs")), "runs won: the gear rotation (any piece a class can wear)": div(get(t, "kind|spread|won"), get(t, "kind|spread|runs")),
  };
  const events: Record<string, number> = {};
  for (const k of Object.keys(t).filter((x) => x.startsWith("ev|")).sort()) events[k.slice(3)] = div(t[k], fights);
  // Every stat a unit carries, with what it did.
  const sumCls = (m: string) => cls.reduce((a, k) => a + get(t, `cls|${k}|${m}`), 0);
  const sumEn = (m: string) => ens.reduce((a, e) => a + get(t, `en|${e.id}|${m}`), 0);
  const stats = {
    "HP: party HP lost a fight, share of max": div(sumCls("taken") - sumCls("soaked"), get(t, "partyHp|mob") + get(t, "partyHp|boss")),
    "MP: spent a fight as a share of the party's pools": div(sumCls("mpSpent"), fights * 3 * mean(cls.map((k) => c.classes.get(k)!.stats.max_mp))),
    "MP regen: regained as a share of spent": div(sumCls("mpGot"), sumCls("mpSpent")),
    "Attack: hits' share of the party's damage": div(sumCls("dmgk|physical"), sumCls("dmg")), "untyped (statuses, Thorns) share of the party's damage": div(sumCls("dmgk|untyped"), sumCls("dmg")),
    "Defense: share of hit damage the party's Defense took off": 1 - div(sumCls("taken|physical"), sumCls("takenRaw|physical")), "Defense: share of hit damage the foes' Defense took off": 1 - div(sumEn("taken|physical"), sumEn("takenRaw|physical")),
    "Crit chance: share of the party's hits that crit": div(sumCls("crit"), sumCls("hits")), "Crit damage: crits' share of the party's damage": div(sumCls("critDmg"), sumCls("dmg")),
    "Evasion: share of hits on the party dodged": div(sumCls("dodged"), sumCls("hitsTaken")), "Evasion: share of the party's hits dodged by foes": div(sumEn("dodged"), sumEn("hitsTaken")),
    "Accuracy: the Ranger's and Hawk's eye wearers' miss rate": div(get(t, "cls|ranger|miss"), get(t, "cls|ranger|hits") + get(t, "cls|ranger|miss")),
    "Aggro: hits taken by the walls, share of hits on the party": div(["knight", "bramble_knight", "hoplite", "paladin"].reduce((a, k) => a + get(t, `cls|${k}|hitsTaken`), 0), sumCls("hitsTaken")),
    "Double strike: extra strikes per basic attack (Monk)": div(get(t, "cls|monk|extra"), get(t, "cls|monk|act|basic")),
    "Thorns: share of the party's damage": div(get(t, "st|thorns|dmg"), sumCls("dmg")), "Lifesteal: share of the party's healing": div(cls.reduce((a, k) => a + get(t, `cls|${k}|heal|lifesteal`), 0), sumCls("healGiven")),
    "Siphon: MP the Hexer regains a fight, against the Frostweaver (both MP regen 3)": div(div(get(t, "cls|hexer|mpGot"), get(t, "cls|hexer|fights|mob") + get(t, "cls|hexer|fights|boss")), div(get(t, "cls|frostweaver|mpGot"), get(t, "cls|frostweaver|fights|mob") + get(t, "cls|frostweaver|fights|boss"))),
    "Attack speed, cooldowns, cast time (Haste/Slow/Chill): Haste uptime a fight (ticks)": div(get(t, "st|haste|uptime|party"), fights), "Slow uptime on the party a fight (ticks)": div(get(t, "st|slow|uptime|party"), fights), "Chill uptime on foes a fight (ticks)": div(get(t, "st|chill|uptime|enemy"), fights),
    "Taunting: hits drawn onto a taunting unit a fight": div(get(t, "st|taunt|tauntHits"), fights), "Hidden: uptime a fight (ticks)": div(get(t, "st|hidden|uptime|party"), fights),
    "Healing received (Rot): Rot uptime on foes a fight": div(get(t, "st|rot|uptime|enemy"), fights),
    "Power (a knob's damage): foes' damage a fight to the party, share of party HP": div(sumCls("taken"), get(t, "partyHp|mob") + get(t, "partyHp|boss")),
  };
  const context = { fights, runs, won, unitHp };
  const sheet: Sheet = { classes, abilities, enemyAbilities, statuses, enemies, gear, formations, resources, events, stats, flags: [], context, meta: { appliers: appliersOf } };
  sheet.flags = judge(c, sheet, setName);
  void flag;
  return sheet;
}

/** The three sets pooled: every rate and mean averaged across the sets where it exists (each mode counts once), every count summed. */
export function poolSheets(c: Content, sheets: Record<string, Sheet>): Sheet {
  const all = Object.values(sheets);
  const poolLines = (pick: (s: Sheet) => Lines): Lines => {
    const out: Lines = {};
    const ids = new Set(all.flatMap((s) => Object.keys(pick(s))));
    for (const id of ids) {
      const rows = all.map((s) => pick(s)[id]).filter(Boolean);
      const keys = new Set(rows.flatMap((r) => Object.keys(r)));
      const line: Record<string, number> = {};
      for (const k of keys) {
        const vs = rows.map((r) => r[k]).filter((v) => Number.isFinite(v));
        line[k] = SUM_KEYS.has(k) ? vs.reduce((a, b) => a + b, 0) : vs.length ? vs.reduce((a, b) => a + b, 0) / vs.length : NaN;
      }
      out[id] = line;
    }
    return out;
  };
  const poolRec = (pick: (s: Sheet) => Record<string, number>): Record<string, number> => {
    const out: Record<string, number> = {};
    for (const k of new Set(all.flatMap((s) => Object.keys(pick(s))))) { const vs = all.map((s) => pick(s)[k]).filter((v) => Number.isFinite(v)); out[k] = vs.length ? vs.reduce((a, b) => a + b, 0) / vs.length : NaN; }
    return out;
  };
  const appliers: Record<string, string[]> = {};
  for (const s of all) for (const [k, v] of Object.entries(s.meta.appliers)) appliers[k] = [...new Set([...(appliers[k] ?? []), ...v])];
  const sheet: Sheet = {
    classes: poolLines((s) => s.classes), abilities: poolLines((s) => s.abilities), enemyAbilities: poolLines((s) => s.enemyAbilities), statuses: poolLines((s) => s.statuses),
    enemies: poolLines((s) => s.enemies), gear: poolLines((s) => s.gear), formations: poolLines((s) => s.formations),
    resources: poolRec((s) => s.resources), events: poolRec((s) => s.events), stats: poolRec((s) => s.stats), flags: [],
    context: { fights: all.reduce((a, s) => a + s.context.fights, 0), runs: all.reduce((a, s) => a + s.context.runs, 0), won: all.reduce((a, s) => a + s.context.won, 0), unitHp: mean(all.map((s) => s.context.unitHp)) },
    meta: { appliers },
  };
  sheet.flags = judge(c, sheet, "pooled");
  return sheet;
}

/** The bands, applied to a sheet's lines. A band is judged on the pooled sheet unless it names a set (`on`); then only that set's sheet raises it. */
export function judge(c: Content, sh: Sheet, setName: string): Flag[] {
  const flags: Flag[] = [];
  const flag = (kind: string, id: string, name: string, band: string, value: number, text: string) => {
    const b = BANDS[band];
    if (!b || !Number.isFinite(value)) return;
    if ((b.on ?? "pooled") !== setName) return;
    if (value >= b.lo && value <= b.hi) return;
    const width = Number.isFinite(b.hi) ? b.hi - b.lo : Math.max(1, Math.abs(b.lo)) || 1;
    const dist = value < b.lo ? b.lo - value : value - b.hi;
    flags.push({ kind, id, name, band, value, set: setName, severity: dist / width, text });
  };
  for (const k of c.pack.classes.map((x) => x.id)) {
    const line = sh.classes[k];
    if (!line) continue;
    const name = c.classes.get(k)!.name;
    flag("class", k, name, "class.win", line.win, `parties with the ${name} win ${r1(line.win)} points ${line.win >= 0 ? "more" : "less"} than parties without it`);
    const role = ROLE[k];
    if (role === "dealer") flag("class", k, name, "class.dmgDealer", line.dmgIdx, `a dealer dealing ${r2(line.dmgIdx)}× an average unit's damage`);
    else flag("class", k, name, "class.dmgOther", line.dmgIdx, `a ${role} dealing ${r2(line.dmgIdx)}× an average unit's damage`);
    flag("class", k, name, "class.ko", line.koIdx, `knocked out ${r2(line.koIdx)}× as often as the median class (${r1(100 * line.ko)} per 100 fights)`);
    if (role === "wall") flag("class", k, name, "class.takenWall", line.takenIdx, `a wall taking ${r2(line.takenIdx)}× an average unit's damage per tick`);
    else flag("class", k, name, "class.takenOther", line.takenIdx, `a ${role} taking ${r2(line.takenIdx)}× an average unit's damage per tick`);
    if (CASTERS.has(k)) flag("class", k, name, "class.starvedCaster", line.starved, `${pc(line.starved)} of its time with a spell ready and no MP`);
    else flag("class", k, name, "class.starvedOther", line.starved, `${pc(line.starved)} of its time with an ability ready and no MP`);
    flag("class", k, name, "class.casts", line.castsMob, `${r1(line.castsMob)} casts a regular fight`);
  }
  const kinds = ["damage", "heal", "revive", "shield", "control", "cleanse", "debuff", "buff", "other"];
  for (const a of c.pack.abilities) {
    const line = sh.abilities[a.id];
    if (!line) continue;
    const owner = c.pack.classes.find((k) => k.abilities.includes(a.id))!;
    const name = `${owner.name}'s ${a.name}`;
    const kind = kinds[line.kind];
    if (!a.if) { flag("ability", a.id, name, "ability.castsMob", line.castsMob, `cast ${r2(line.castsMob)} times a regular fight it's slotted in`); flag("ability", a.id, name, "ability.castsBoss", line.castsBoss, `cast ${r2(line.castsBoss)} times a boss fight`); }
    if (kind === "damage") { flag("ability", a.id, name, "ability.swings", line.swings, `a cast deals ${r1(line.swings)} of its class's swings`); flag("ability", a.id, name, "ability.share", line.share, `${pc(line.share)} of its class's damage`); }
    flag("ability", a.id, name, "ability.fail", line.fail, `${pc(line.fail)} of its casts fizzle (${line.failMp} for MP, ${line.failTarget} for want of a target)`);
    if (kind === "heal") flag("ability", a.id, name, "ability.healShare", line.healShare, `a cast heals ${pc(line.healShare)} of an average unit's max HP`);
    for (const [k, v] of Object.entries(line)) if (k.startsWith("stacks:")) { const d = c.statuses.get(k.slice(7)); if (d?.stacking === "intensity" && d.id !== "shield") flag("ability", a.id, name, "ability.stacks", v, `an application adds ${r1(v)} ${d.name}`); }
  }
  for (const [s, line] of Object.entries(sh.statuses)) {
    const d = c.statuses.get(s)!;
    const appliers = sh.meta.appliers[s] ?? [];
    const harms = !!(d.pulse?.do?.some((e) => e.op === "damage") || d.trigger?.do?.some((e) => e.op === "damage"));
    if (harms && d.label === "debuff" && appliers.length) flag("status", s, d.name, "status.dmgShare", line.dmgShareOfAppliers, `${pc(line.dmgShareOfAppliers)} of its appliers' damage (${appliers.map((k) => c.classes.get(k)!.name).join(", ")})`);
    if (!["doom", "bulwark", "bulwark_broken", "bedrock_on", "bloodlust_on", "lg_idol_on", "ice_crust"].includes(s)) flag("status", s, d.name, "status.apps", line.appsPerFight, `applied ${r2(line.appsPerFight)} times a fight`);
  }
  for (const e of c.pack.enemies) {
    const line = sh.enemies[e.id];
    if (!line || !line.n) continue;
    if (e.rank === "minion") flag("enemy", e.id, e.name, "enemy.acted0", line.acted0, `${pc(line.acted0)} killed before acting`);
    flag("enemy", e.id, e.name, "enemy.dmgRank", line.dmgIdx, `deals ${r2(line.dmgIdx)}× the median ${e.rank}'s damage per appearance`);
    flag("enemy", e.id, e.name, "enemy.lifeRank", line.lifeIdx, `lives ${r2(line.lifeIdx)}× the median ${e.rank}'s ticks`);
    if (e.rank === "boss") { flag("boss", e.id, e.name, "boss.signature", line.signature, `casts its signature move ${r2(line.signature)} times a fight`); flag("boss", e.id, e.name, "boss.kos", line.kos, `knocks out ${r2(line.kos)} party members a fight`); }
  }
  registerGear(c);
  for (const g of [...c.pack.gear, ...rogueGear(c)]) {
    const line = sh.gear[g.id];
    if (line) flag("gear", g.id, g.name, "gear.worn", line.worn, `worn in ${line.worn} unit-fights`);
  }
  return flags;
}
