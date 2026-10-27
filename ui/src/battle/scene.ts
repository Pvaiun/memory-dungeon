/**
 * The field: 270×228 logical pixels, in colour. One scene, as the classic
 * battle screens have it: the party on the left facing right, at the packs'
 * own pixel size with their weapons in hand; the foes on the right facing
 * left, at theirs, which is bigger; a backdrop per dungeon composed from the
 * tilesets. Over the sprites: a foe's HP bar under its feet, the pack's 16px
 * status icons with their stacks under everyone, a wind-up bar over a head,
 * damage numbers that rise and fade, and the VFX strips.
 */
import { SUBTICKS } from "../../../src/schema.js";
import type { CUnit } from "../../../src/engine/combat/fight.js";
import { c, disp } from "../content.js";
import { manifest, VFX_FOR, type Pose } from "../art.js";
import { actorSpan, backdropImage, drawActor, drawCampfire, drawChest, drawEnemy, drawStatus, drawText, enemyK, enemySprite, FRAME_W, OUTLINE, STATUS_ICON, statusIconOf, vfxSprite } from "../pixel.js";
import type { Driver } from "./driver.js";

export const W = FRAME_W, H = 228;

export type UV = {
  id: string; side: "party" | "enemy"; ref: string; name: string;
  x: number; y: number; w: number; h: number; k: number;
  pose: Pose; poseUntil: number; lungeUntil: number; shakeUntil: number; flashUntil: number;
  alpha: number; gone: boolean;
  hpShown: number; shieldShown: number;
  /** HP and knockout as the messages have told them so far: the engine settles a whole moment at once, the field follows the story. */
  hpTold: number; downTold: boolean;
  /** The statuses the messages have told it gained and not yet lost, in that order; their last stack counts. */
  stsTold: Set<string>; stsLast: Map<string, number | null>; stsGone: Map<string, number>;
  cast: { name: string; start: number; end: number } | null;
  numberStack: number; numberAt: number;
  /** When each status landed (for its pop) and statuses that just ended (for their fade). */
  pops: Map<string, number>; fades: { id: string; until: number }[];
};

export type NumOpts = { color?: string; outline?: string | null; sub?: string; subColor?: string; big?: boolean; icon?: string; life?: number };
type Num = Required<Pick<NumOpts, "color" | "life">> & NumOpts & { x: number; y: number; text: string; born: number };
type Fx = { strip: string; x: number; y: number; size: number; born: number; fps: number; flip: boolean };

// ─── Layout ───

const LINE_X: Record<string, number> = { back: 30, middle: 44, front: 58 };
const PARTY_ROWS: Record<number, number[]> = { 1: [160], 2: [124, 200], 3: [100, 152, 204] };
/** Where the party stands, by slot: feet positions. */
export function partySpots(formationId: string, count: number): { x: number; y: number }[] {
  const f = c.formations.get(formationId)!;
  const rows = PARTY_ROWS[Math.max(1, Math.min(3, count))];
  return Array.from({ length: count }, (_, i) => {
    const pos = f.positions[i] ?? f.positions[0];
    return { x: LINE_X[pos.layout.line] ?? 40, y: rows[Math.min(i, rows.length - 1)] };
  });
}
/** Where the foes stand: a boss in front with its followers to its left; a crowd in staggered front and back rows. */
export function foeSpots(n: number, boss: boolean): { x: number; y: number }[] {
  if (boss) {
    const rows = n <= 2 ? [[], [176], [140, 204]][n] ?? [] : [124, 164, 204];
    return [{ x: 206, y: 204 }, ...rows.slice(0, n - 1).map((y, i) => ({ x: 118 + (i % 2 ? 6 : -6), y }))];
  }
  if (n === 1) return [{ x: 192, y: 200 }];
  if (n === 2) return [{ x: 156, y: 204 }, { x: 232, y: 150 }];
  if (n === 3) return [{ x: 144, y: 204 }, { x: 206, y: 146 }, { x: 246, y: 204 }];
  if (n <= 6) {
    const cols = Math.ceil(n / 2);
    const shift = Math.round((252 - (140 + (cols - 1) * 56)) / 2);
    return Array.from({ length: n }, (_, i) => ({ x: (i % 2 ? 108 : 140) + Math.floor(i / 2) * 56 + shift, y: i % 2 ? 136 : 204 }));
  }
  const cols = Math.ceil(n / 3);
  const step = Math.min(56, Math.floor(150 / Math.max(1, cols - 1)));
  return Array.from({ length: n }, (_, i) => ({ x: 110 + Math.floor(i / 3) * step + (i % 3) * 14, y: [204, 170, 136][i % 3] }));
}

// ─── Backdrops: the asset tool's scenes, or flat bands of colour without them ───

const FALLBACK: Record<string, [string, string]> = {
  old_road: ["#86c0ea", "#8cba5c"], crypt: ["#171724", "#3a3a4e"], fire_mine: ["#260a0a", "#6c3222"], ice_pass: ["#bfe2ff", "#e6f2ff"],
  storm_tower: ["#0f1738", "#3a4460"], deep_crypt: ["#08060e", "#292036"], tower_top: ["#283050", "#5a6a8c"],
};
/** Backdrops for the campaign's own runs by node id, used only when their enemies don't point to one. */
const NODE_THEME: Record<string, string> = {
  road_at_night: "old_road", wildfire: "old_road", ossuary: "crypt", ogre_brothers: "old_road", deep_freeze: "fire_mine", iron_wall: "fire_mine", valhalla: "ice_pass",
  wild_hunt: "old_road", knives_out: "storm_tower", long_road: "crypt", blood_moon: "deep_crypt", judgement: "deep_crypt", royal_court: "tower_top",
};
const themes = new Map<string, string>();
/**
 * The backdrop a dungeon is fought on: its own, or for a run without one (the campaign's remixes and trials), the
 * spine run whose enemies it shares most, each foe counted per fight and a boss three times; then the table above.
 */
export function themeOf(dungeonId: string): string {
  const id = dungeonId.split("~")[0];
  if (manifest.backdrops[id]) return id;
  let t = themes.get(id);
  if (t) return t;
  const d = c.dungeons.get(id);
  let best = 0;
  for (const sid of c.pack.progression.dungeonOrder) {
    const spine = new Set(c.dungeons.get(sid)?.stages.flatMap((s) => (s.kind === "fight" ? s.enemies : [])) ?? []);
    let score = 0;
    for (const s of d?.stages ?? []) if (s.kind === "fight") for (const e of s.enemies) if (spine.has(e)) score += c.enemies.get(e)?.rank === "boss" ? 3 : 1;
    if (score > best && manifest.backdrops[sid]) (best = score), (t = sid);
  }
  t ??= NODE_THEME[c.pack.campaign?.nodes.find((n) => n.dungeon === id)?.id ?? ""] ?? "old_road";
  themes.set(id, t);
  return t;
}
const backdrops = new Map<string, HTMLCanvasElement>();
export function backdrop(theme: string, h = H): HTMLCanvasElement {
  const key = `${theme}|${h}`;
  let cv = backdrops.get(key);
  if (cv) return cv;
  cv = document.createElement("canvas");
  cv.width = W;
  cv.height = h;
  const g = cv.getContext("2d")!;
  const img = backdropImage(theme);
  if (img) g.drawImage(img, 0, img.height - h, W, h, 0, 0, W, h);
  else {
    const [sky, ground] = FALLBACK[theme] ?? FALLBACK.old_road;
    const horizon = Math.round((64 * h) / H);
    g.fillStyle = sky;
    g.fillRect(0, 0, W, horizon);
    g.fillStyle = ground;
    g.fillRect(0, horizon, W, h - horizon);
  }
  backdrops.set(key, cv);
  return cv;
}

const WAIT_FRAMES = [0, 1, 2, 1];
/** The backdrops with a sky, which get stars at night. */
const OUTDOOR = new Set(["old_road", "ice_pass", "tower_top"]);
/** The icon statuses a unit shows, Shield last, with the count to draw. */
export function shownStatuses(u: CUnit): { id: string; count: number | null }[] {
  const out: { id: string; count: number | null }[] = [];
  for (const s of u.statuses) {
    const d = c.statuses.get(s.id);
    if (!d || d.show !== "icon" || d.absorb) continue;
    if (out.some((o) => o.id === s.id)) continue;
    out.push({ id: s.id, count: d.stacking === "intensity" ? Math.floor(s.stacks / SUBTICKS) : null });
  }
  const sh = shieldOf(u);
  if (sh) out.push({ id: "shield", count: disp(sh) });
  return out;
}
export function shieldOf(u: CUnit): number {
  let s = 0;
  for (const st of u.statuses) if (c.statuses.get(st.id)?.absorb) s += Math.floor(st.stacks / SUBTICKS);
  return s;
}
export const hpColor = (share: number) => (share <= 0.25 ? "#f05858" : share <= 0.5 ? "#f0d050" : "#58d858");

// ─── The battle scene ───

export class Scene {
  ctx: CanvasRenderingContext2D;
  units = new Map<string, UV>();
  numbers: Num[] = [];
  fx: Fx[] = [];
  banner: { text: string; sub: string; until: number } | null = null;
  /** Draw thin HP bars under the party too (Settings → PARTY HP). */
  partyBars = false;
  wall = 0;
  /** The campfire between fights: who sits by the fire, and who lies fallen. */
  camp: { ref: string; ko: boolean }[] | null = null;

  constructor(public canvas: HTMLCanvasElement, public driver: Driver, public theme: string) {
    canvas.width = W;
    canvas.height = H;
    this.ctx = canvas.getContext("2d")!;
    this.ctx.imageSmoothingEnabled = false;
  }

  sync() {
    const crowd = this.driver.units().filter((x) => x.side === "enemy" && !x.gone).length;
    for (const u of this.driver.units()) if (!this.units.has(u.id)) this.add(u, crowd);
    this.layout();
  }

  private add(u: CUnit, crowd: number) {
    const party = u.side === "party";
    const k = party ? 3 : enemyK(u.ref, crowd);
    const s = party ? null : enemySprite(u.ref, k);
    this.units.set(u.id, {
      id: u.id, side: u.side, ref: u.ref, name: u.name, x: 0, y: 0, w: s ? s.width : 26, h: s ? s.height : 40, k,
      pose: u.ko ? "dead" : "wait", poseUntil: 0, lungeUntil: 0, shakeUntil: 0, flashUntil: 0, alpha: u.ko && !party ? 0 : 1, gone: !!u.gone,
      hpShown: u.hp, shieldShown: 0, hpTold: u.hp, downTold: u.ko, stsTold: new Set(shownStatuses(u).map((x) => x.id)), stsLast: new Map(), stsGone: new Map(), cast: null, numberStack: 0, numberAt: 0, pops: new Map(), fades: [],
    });
  }

  layout() {
    const units = this.driver.units();
    const party = units.filter((u) => u.side === "party");
    const spots = partySpots(this.driver.input.party.formation, Math.max(1, party.length));
    party.forEach((u, i) => {
      const v = this.units.get(u.id)!;
      const s = spots[Math.min(i, spots.length - 1)];
      v.x = s.x;
      v.y = s.y;
    });
    const foes = units.filter((u) => u.side === "enemy" && !u.gone);
    const boss = foes.find((u) => c.enemies.get(u.ref)?.rank === "boss");
    const ordered = boss ? [boss, ...foes.filter((u) => u !== boss)] : foes;
    const spots2 = foeSpots(ordered.length, !!boss);
    ordered.forEach((u, i) => {
      const v = this.units.get(u.id)!;
      const s = spots2[i] ?? spots2[spots2.length - 1];
      v.x = Math.max(v.w / 2 + 2, Math.min(W - v.w / 2 - 2, s.x));
      v.y = s.y;
    });
  }

  // ─── Reactions to events ───

  pose(id: string, pose: Pose, ms: number) {
    const v = this.units.get(id);
    if (!v || v.side !== "party") return;
    v.pose = pose;
    v.poseUntil = this.wall + ms;
  }
  lunge(id: string, ms = 240) {
    const v = this.units.get(id);
    if (v) v.lungeUntil = this.wall + ms;
  }
  hit(id: string) {
    const v = this.units.get(id);
    if (!v) return;
    v.shakeUntil = this.wall + 240;
    v.flashUntil = this.wall + 110;
    if (v.side === "party" && v.pose !== "dead") this.pose(id, "damage", 380);
  }
  /** The HP a message just told (each damage and heal event carries the HP after it). */
  told(id: string, hp: number) {
    const v = this.units.get(id);
    if (v) v.hpTold = hp;
  }
  /** After >>: the field catches up with the engine at once. */
  catchUp() {
    for (const u of this.driver.units()) {
      const v = this.units.get(u.id);
      if (!v) continue;
      v.hpTold = v.hpShown = u.hp;
      v.downTold = u.ko;
      v.stsTold = new Set(shownStatuses(u).map((x) => x.id));
    }
  }
  down(id: string) {
    const v = this.units.get(id);
    if (!v) return;
    v.downTold = true;
    v.cast = null;
    if (v.side === "party") {
      v.pose = "dead";
      v.poseUntil = 0;
    }
  }
  revive(id: string) {
    const v = this.units.get(id);
    if (!v) return;
    v.downTold = false;
    v.alpha = 1;
    v.pose = "wait";
    v.poseUntil = 0;
  }
  leave(id: string) {
    const v = this.units.get(id);
    if (v) (v.gone = true), (v.alpha = 0);
  }
  clearTransient() {
    this.numbers = [];
    this.fx = [];
    for (const v of this.units.values()) (v.cast = null), v.pops.clear(), (v.fades = []);
  }
  /** A status landed on a unit: its icon pops in. */
  statusPop(id: string, status: string) {
    if (c.statuses.get(status)?.absorb) status = "shield";
    this.units.get(id)?.stsTold.add(status);
    this.units.get(id)?.pops.set(status, this.wall);
  }
  /** A status ended on a unit: its icon fades out. */
  statusFade(id: string, status: string) {
    const v = this.units.get(id);
    if (!v) return;
    if (c.statuses.get(status)?.absorb) {
      const u = this.driver.unit(id);
      if (u && shieldOf(u) > 0) return;
      status = "shield";
    }
    v.stsTold.delete(status);
    v.pops.delete(status);
    v.fades = v.fades.filter((f) => f.id !== status);
    v.fades.push({ id: status, until: this.wall + 450 });
  }

  /** A number or word over a unit; stacked numbers on the same unit spread out. */
  number(id: string, text: string, o: NumOpts = {}) {
    const v = this.units.get(id);
    if (!v) return;
    if (this.wall - v.numberAt < 700) v.numberStack++;
    else v.numberStack = 0;
    v.numberAt = this.wall;
    const side = v.numberStack ? (v.numberStack % 2 ? 1 : -1) * Math.min(2, Math.ceil(v.numberStack / 2)) * 16 : 0;
    const half = (Math.max(text.length, o.sub?.length ?? 0) * 8 * (o.big ? 2 : 1)) / 2 + (o.icon ? 9 : 0);
    const x = Math.max(half + 1, Math.min(W - half - 1, v.x + side));
    const y = v.y - v.h - 12 - Math.floor(v.numberStack / 2) * 10;
    this.numbers.push({ ...o, color: o.color ?? "#ffffff", life: o.life ?? 1400, x, y: Math.max(2, y), text, born: this.wall });
  }

  effect(id: string, strip: string, size = 32, flip = false) {
    const v = this.units.get(id);
    if (!v || !manifest.vfx[strip]) return;
    this.fx.push({ strip, x: v.x, y: v.y - v.h / 2, size, born: this.wall, fps: 14, flip });
  }
  /** The VFX for an element, damage kind or effect on a unit; `big` plays the 64-pixel frame at full size. */
  effectFor(id: string, tag: string, big = false) {
    const strip = VFX_FOR[tag];
    const v = this.units.get(id);
    if (strip && v) this.effect(id, strip, big || v.h >= 50 ? 64 : 32, v.side === "party");
  }

  // ─── Drawing ───

  startCamp(members: { ref: string; ko: boolean }[]) {
    this.camp = members;
    this.numbers = [];
    this.fx = [];
    this.banner = null;
  }
  stopCamp() {
    this.camp = null;
  }

  frame(wall: number) {
    this.wall = wall;
    if (this.camp) return this.drawCamp();
    const ctx = this.ctx;
    const units = this.driver.units();
    ctx.drawImage(backdrop(this.theme), 0, 0);
    const order = [...this.units.values()].filter((v) => !v.gone).sort((a, b) => a.y - b.y);
    for (const v of order) {
      const u = units.find((x) => x.id === v.id);
      if (!u) continue;
      this.updateVisual(v, u);
      this.drawUnit(v, u);
    }
    for (const v of order) {
      const u = units.find((x) => x.id === v.id);
      if (u) this.drawOverlay(v, u);
    }
    this.drawFx();
    this.drawNumbers();
    this.drawBanner();
  }

  private updateVisual(v: UV, u: CUnit) {
    const dt = 1 / 60;
    v.hpShown += (v.hpTold - v.hpShown) * Math.min(1, dt * 10);
    if (Math.abs(v.hpTold - v.hpShown) < 1) v.hpShown = v.hpTold;
    const ko = v.downTold;
    const sh = shieldOf(u);
    v.shieldShown += (sh - v.shieldShown) * Math.min(1, dt * 10);
    if (v.poseUntil && this.wall > v.poseUntil) {
      v.poseUntil = 0;
      v.pose = ko ? "dead" : v.cast ? "chant" : "wait";
    }
    if (!ko && v.pose === "dead") v.pose = "wait";
    const stunned = u.statuses.some((s) => s.id === "stun" || s.id === "bulwark_broken");
    if (!ko && v.pose === "wait" && stunned) v.pose = "abnormal";
    if (!ko && v.pose === "abnormal" && !stunned) v.pose = "wait";
    if (!ko && v.pose === "wait" && u.cast) v.pose = "chant";
    if (!ko && v.pose === "chant" && !u.cast) v.pose = "wait";
    if (ko && v.side === "enemy" && v.alpha > 0) v.alpha = Math.max(0, v.alpha - dt * 2.5);
    if (!ko && v.alpha < 1) v.alpha = Math.min(1, v.alpha + dt * 3);
  }

  private drawUnit(v: UV, u: CUnit) {
    const ctx = this.ctx;
    if (v.alpha <= 0) return;
    const shaking = this.wall < v.shakeUntil ? Math.round(Math.sin(this.wall / 18) * 2) : 0;
    const lungeT = v.lungeUntil > this.wall ? 1 - (v.lungeUntil - this.wall) / 240 : 0;
    const lunge = lungeT ? Math.round(Math.sin(lungeT * Math.PI) * 10) * (v.side === "party" ? 1 : -1) : 0;
    const x = v.x + shaking + lunge;
    const hidden = u.statuses.some((s) => s.id === "hidden");
    const flash = this.wall < v.flashUntil;
    ctx.save();
    ctx.globalAlpha = v.alpha * (hidden ? 0.45 : 1);
    // The shadow follows the figure: forward with a lunge, back with a wind-up's step (the pose's own bounds).
    const poseShift = v.side === "party" && v.pose !== "dead" ? Math.round((actorSpan(v.ref, v.pose)[0] + actorSpan(v.ref, v.pose)[1]) / 2) : 0;
    this.drawShadow(v.x + lunge + poseShift, v.y, v.side === "party" ? 22 : Math.max(16, Math.min(56, Math.round(v.w * 0.7))));
    if (v.side === "party") {
      const f = v.pose === "dead" ? 2 : v.pose === "wait" || v.pose === "chant" || v.pose === "abnormal" ? WAIT_FRAMES[Math.floor(this.wall / 300) % 4] : Math.min(2, Math.floor((this.wall - (v.poseUntil - 400)) / 130));
      drawActor(ctx, v.ref, v.pose, Math.max(0, f), x, v.y, flash, 1, u.weapon);
    } else {
      const bob = v.downTold ? 0 : Math.round(Math.sin(this.wall / 520 + v.x));
      drawEnemy(ctx, v.ref, v.k, x, v.y + bob, flash);
    }
    ctx.restore();
  }

  private drawCamp() {
    drawCampScene(this.ctx, this.theme, this.camp!, this.wall);
  }

  /** A soft pixel ellipse under a unit's feet, so it stands on the floor instead of floating over it. */
  private drawShadow(cx: number, feet: number, w: number) {
    const ctx = this.ctx;
    const rx = w / 2, ry = w >= 40 ? 3 : 2;
    ctx.fillStyle = "rgba(8, 8, 16, 0.45)";
    for (let dy = -ry; dy <= ry; dy++) {
      const half = Math.round(rx * Math.sqrt(1 - (dy / (ry + 0.5)) ** 2));
      ctx.fillRect(Math.round(cx - half), Math.round(feet - 1 + dy), half * 2, 1);
    }
  }

  private drawOverlay(v: UV, u: CUnit) {
    const ctx = this.ctx;
    if (v.alpha <= 0 || (v.downTold && v.side === "enemy")) return;
    const top = v.y - v.h;
    const x = Math.round(v.x);
    let iconY = v.y + 3;
    if (v.side === "enemy") {
      // HP under the feet, in the bar's colour; a light segment for a Shield
      const max = u.stats.max_hp;
      const hp = Math.max(0, Math.min(1, v.hpShown / max));
      const bw = Math.max(20, Math.min(40, Math.round(v.w * 0.6)));
      const bx = x - Math.round(bw / 2), by = v.y + 3;
      ctx.fillStyle = OUTLINE;
      ctx.fillRect(bx - 1, by - 1, bw + 2, 4);
      ctx.fillStyle = "#3a3a4a";
      ctx.fillRect(bx, by, bw, 2);
      ctx.fillStyle = hpColor(hp);
      ctx.fillRect(bx, by, Math.round(bw * hp), 2);
      const sh = Math.min(1 - hp, v.shieldShown / max);
      if (sh > 0.005) {
        ctx.fillStyle = "#a8e8ff";
        ctx.fillRect(bx + Math.round(bw * hp), by, Math.max(1, Math.round(bw * sh)), 2);
      }
      iconY = by + 5;
    }
    if (v.side === "party" && this.partyBars) iconY = v.y + 8;
    if (!v.downTold) {
      // Only what the messages have told, with the engine's live counts while the status lasts.
      const live = new Map(shownStatuses(u).map((x) => [x.id, x.count]));
      for (const [id, n] of live) if (v.stsTold.has(id)) v.stsLast.set(id, n);
      // A told status the engine dropped without a message to say so goes after a moment, rather than lingering.
      for (const id of v.stsTold) {
        if (live.has(id)) v.stsGone.delete(id);
        else if (!v.stsGone.has(id)) v.stsGone.set(id, this.wall);
        else if (this.wall - v.stsGone.get(id)! > 1500) (v.stsTold.delete(id), v.stsGone.delete(id));
      }
      const sts = [...v.stsTold].map((id) => ({ id, count: live.has(id) ? live.get(id)! : v.stsLast.get(id) ?? null })).slice(0, 4);
      v.fades = v.fades.filter((f) => f.until > this.wall);
      const fading = v.fades.filter((f) => !sts.some((s) => s.id === f.id)).slice(0, 4 - sts.length);
      const n = sts.length + fading.length;
      if (n) {
        const step = STATUS_ICON + 1;
        const gx = Math.max(0, Math.min(W - n * step, x - Math.round((n * step - 1) / 2)));
        const iy = Math.min(H - STATUS_ICON, iconY);
        sts.forEach((s, i) => {
          const born = v.pops.get(s.id);
          const age = born === undefined ? 1e9 : this.wall - born;
          if (age < 260) {
            // Landing: the icon drops in from one and a half size.
            const sc = 1.5 - (age / 260) * 0.5;
            const size = Math.round(STATUS_ICON * sc);
            ctx.drawImage(statusIconOf(s.id), gx + i * step - Math.round((size - STATUS_ICON) / 2), iy - (size - STATUS_ICON), size, size);
          } else drawStatus(ctx, s.id, gx + i * step, iy, s.count);
        });
        fading.forEach((f, i) => {
          ctx.save();
          ctx.globalAlpha = Math.max(0, (f.until - this.wall) / 450);
          ctx.drawImage(statusIconOf(f.id), gx + (sts.length + i) * step, iy - Math.round((1 - ctx.globalAlpha) * 6));
          ctx.restore();
        });
      }
    }
    if (v.cast && !v.downTold) {
      // The wind-up as a thin upright bar beside the figure, filling from the bottom: left of a party member (measured
      // from the pose it's in, so it clears the step back a wind-up takes), right of a foe. It never sits where the
      // unit above keeps its status icons.
      const p = Math.max(0, Math.min(1, (this.driver.vt - v.cast.start) / Math.max(1, v.cast.end - v.cast.start)));
      const bh = Math.min(28, Math.max(14, v.h - 10));
      const left = v.side === "party" ? x + Math.floor(actorSpan(v.ref, v.pose)[0]) - 4 : x + Math.round(v.w / 2) + 2;
      const bx = Math.max(1, Math.min(W - 3, left));
      const by = v.y - 2 - bh;
      ctx.fillStyle = OUTLINE;
      ctx.fillRect(bx - 1, by - 1, 4, bh + 2);
      ctx.fillStyle = "#3a3a4a";
      ctx.fillRect(bx, by, 2, bh);
      ctx.fillStyle = "#ffd54a";
      const fill = Math.round(bh * p);
      ctx.fillRect(bx, by + bh - fill, 2, fill);
    }
    if (v.side === "party" && !v.downTold && this.partyBars) {
      // Settings → PARTY HP: a thin HP bar under each party member too.
      const max = u.stats.max_hp;
      const hp = Math.max(0, Math.min(1, v.hpShown / max));
      const bw = 20, bx = x - 10, by = v.y + 3;
      ctx.fillStyle = OUTLINE;
      ctx.fillRect(bx - 1, by - 1, bw + 2, 4);
      ctx.fillStyle = "#3a3a4a";
      ctx.fillRect(bx, by, bw, 2);
      ctx.fillStyle = hpColor(hp);
      ctx.fillRect(bx, by, Math.round(bw * hp), 2);
    }
  }

  private drawFx() {
    const ctx = this.ctx;
    const keep: Fx[] = [];
    for (const f of this.fx) {
      const def = manifest.vfx[f.strip];
      const frame = Math.floor(((this.wall - f.born) / 1000) * f.fps);
      if (!def || frame >= def.frames) continue;
      keep.push(f);
      const k = f.size >= 64 ? 1 : 2;
      const p = vfxSprite(f.strip, k);
      const fw = p.width / def.frames;
      ctx.save();
      ctx.translate(Math.round(f.x), Math.round(f.y));
      if (f.flip) ctx.scale(-1, 1);
      ctx.drawImage(p, frame * fw, 0, fw, p.height, -f.size / 2, -f.size / 2, f.size, f.size);
      ctx.restore();
    }
    this.fx = keep;
  }

  private drawNumbers() {
    const ctx = this.ctx;
    const keep: Num[] = [];
    for (const n of this.numbers) {
      const t = (this.wall - n.born) / n.life;
      if (t >= 1) continue;
      keep.push(n);
      const rise = t < 0.2 ? -t * 40 : -8 - (t - 0.2) * 8;
      if (t > 0.78 && Math.floor(this.wall / 70) % 2) continue;
      const y = Math.max(1, n.y + rise);
      const scale = n.big ? 2 : 1;
      const tw = n.text.length * 8 * scale;
      let x = n.x;
      if (n.icon) {
        ctx.drawImage(statusIconOf(n.icon), Math.round(x - tw / 2 - 18), Math.round(y) + (n.big ? 0 : -4));
        x += 9;
      }
      drawText(ctx, n.text, x, y, n.color, n.outline === undefined ? OUTLINE : n.outline, "center", scale);
      if (n.sub) drawText(ctx, n.sub, n.x, y + (n.big ? 17 : 9), n.subColor ?? "#ffd54a", OUTLINE, "center");
    }
    this.numbers = keep;
  }

  private drawBanner() {
    if (!this.banner || this.wall > this.banner.until) return;
    const ctx = this.ctx;
    const big = this.banner.text.length <= 12;
    const tw = this.banner.text.length * 8 * (big ? 2 : 1);
    const bw = Math.min(W - 8, Math.max(tw, this.banner.sub.length * 8) + 20);
    const bh = (big ? 20 : 12) + (this.banner.sub ? 12 : 0) + 10;
    const bx = Math.round(W / 2 - bw / 2), by = Math.round(H / 2 - bh / 2) - 10;
    ctx.fillStyle = "#f2f0e4";
    ctx.fillRect(bx - 2, by - 2, bw + 4, bh + 4);
    ctx.fillStyle = "#151b2e";
    ctx.fillRect(bx, by, bw, bh);
    drawText(ctx, this.banner.text, W / 2, by + 5, "#f2f0e4", null, "center", big ? 2 : 1);
    if (this.banner.sub) drawText(ctx, this.banner.sub, W / 2, by + (big ? 27 : 18), "#8e99b8", null, "center");
  }

  showBanner(text: string, sub = "", ms = 1500) {
    this.banner = { text, sub, until: this.wall + ms };
  }

  /** The unit under a point on the field, nearest first. */
  hitTest(px: number, py: number): string | null {
    let best: string | null = null, bestD = Infinity;
    for (const v of this.units.values()) {
      if (v.gone || v.alpha <= 0) continue;
      const top = v.y - v.h;
      if (px >= v.x - v.w / 2 - 6 && px <= v.x + v.w / 2 + 6 && py >= top - 10 && py <= v.y + 22) {
        const d = Math.abs(px - v.x) + Math.abs(py - (v.y - v.h / 2));
        if (d < bestD) (best = v.id), (bestD = d);
      }
    }
    return best;
  }
}

// ─── The campfire ───

/** A soft pixel ellipse under a unit's feet. */
function shadow(ctx: CanvasRenderingContext2D, cx: number, feet: number, w: number) {
  const rx = w / 2, ry = 2;
  ctx.fillStyle = "rgba(8, 8, 16, 0.45)";
  for (let dy = -ry; dy <= ry; dy++) {
    const half = Math.round(rx * Math.sqrt(1 - (dy / (ry + 0.5)) ** 2));
    ctx.fillRect(Math.round(cx - half), Math.round(feet - 1 + dy), half * 2, 1);
  }
}
/**
 * The campfire: a scene's backdrop at night (washed blue and dark), the fire in the middle lighting a stepped ring
 * around it, and the party kneeling at it without their weapons, facing the fire; the fallen lie beside it. The
 * battle's field draws it between fights; the rogue mode's campfire screen draws it as a strip.
 */
export function drawCampScene(ctx: CanvasRenderingContext2D, theme: string, members: { ref: string; ko: boolean }[], wall: number, h = H) {
  const fx = Math.round(W / 2), fy = h - 42;
  // A strip shorter than the field takes the scene from just above its horizon down, so the camp has a skyline behind it.
  const sy = h < H ? Math.round((H - h) * 0.45) : 0;
  ctx.drawImage(backdrop(theme), 0, sy, W, h, 0, 0, W, h);
  // Left and right of the fire, facing it; a third sits behind it.
  const spots = [{ x: fx - 42, y: fy + 12, mirror: false }, { x: fx + 42, y: fy + 12, mirror: true }, { x: fx - 8, y: fy - 18, mirror: false }];
  const order = members.slice(0, 3).map((m, i) => ({ ...m, ...spots[i] })).sort((a, b) => a.y - b.y);
  const f = [0, 1, 2, 1][Math.floor(wall / 520) % 4];
  for (const m of order) {
    shadow(ctx, m.x, m.y, 22);
    drawActor(ctx, m.ref, m.ko ? "dead" : "dying", m.ko ? 2 : f, m.x, m.y, false, 1, undefined, m.mirror);
  }
  // Night: everything washed dark blue, then the firelight in bands that breathe with the flame.
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = "#3a4478";
  ctx.fillRect(0, 0, W, h);
  ctx.globalCompositeOperation = "lighter";
  const flicker = Math.round(Math.sin(wall / 130) + Math.sin(wall / 57));
  for (const [r, a] of [[96, 0.06], [70, 0.08], [48, 0.11], [28, 0.14]] as const) {
    ctx.fillStyle = `rgba(255, 140, 50, ${a})`;
    const rx = r + flicker * 2, ry = Math.round(rx * 0.5);
    for (let dy = -ry; dy <= ry; dy++) {
      const half = Math.round(rx * Math.sqrt(1 - (dy / (ry + 0.5)) ** 2));
      ctx.fillRect(fx - half, fy - 10 + dy, half * 2, 1);
    }
  }
  ctx.restore();
  // Stars, where the backdrop has a sky.
  if (OUTDOOR.has(theme) && !sy) {
    ctx.fillStyle = "#e8ecff";
    for (let i = 0; i < 26; i++) {
      const x = (i * 97 + 31) % W, y = (i * 53 + 7) % 44;
      if ((Math.floor(wall / 700) + i) % 7) ctx.fillRect(x, y, 1, 1);
    }
  }
  drawCampfire(ctx, fx, fy + 4, wall);
}

/** The campfire as a strip for a menu screen, animated. */
export class CampStrip {
  private timer = 0;
  private wall = 0;
  ctx: CanvasRenderingContext2D;
  constructor(public canvas: HTMLCanvasElement, public theme: string, public members: { ref: string; ko: boolean }[], public h = 96) {
    canvas.width = W;
    canvas.height = h;
    this.ctx = canvas.getContext("2d")!;
    this.ctx.imageSmoothingEnabled = false;
  }
  start() {
    const t0 = performance.now();
    const tick = () => { this.wall = performance.now() - t0; drawCampScene(this.ctx, this.theme, this.members, this.wall, this.h); };
    tick();
    this.timer = window.setInterval(() => { if (!this.canvas.isConnected) return this.stop(); tick(); }, 110);
    return this;
  }
  stop() {
    clearInterval(this.timer);
  }
}

// ─── Stages: a moment of the run drawn for a menu screen ───

/** What stands on a stage: a party member (in a pose, with its weapon, facing right or left), a foe, a chest, a fire, loot on the ground. */
export type StageActor =
  | { kind: "hero"; ref: string; x: number; y: number; pose?: Pose; weapon?: string; mirror?: boolean }
  | { kind: "foe"; ref: string; x: number; y: number; k: number }
  | { kind: "chest"; x: number; y: number; color?: string }
  | { kind: "fire"; x: number; y: number }
  | { kind: "loot"; x: number; y: number; art: HTMLCanvasElement };
/**
 * A stage: a scene's backdrop (the part just above its horizon when it's shorter than the field), what stands on it,
 * and optionally night, a chest that opens `openAt` ms in, and a sparkle looping over a point.
 */
export type StageOpts = { theme: string; h: number; actors: StageActor[]; night?: boolean; openAt?: number; sparkle?: { x: number; y: number; strip: string }; t0?: number };

/** Pose frames on a stage: the idle poses breathe, walking steps, a cheer bounces, the fallen lie still. */
function stageFrame(pose: Pose, wall: number): number {
  if (pose === "dead") return 2;
  if (pose === "walk") return [0, 1, 2, 1][Math.floor(wall / 180) % 4];
  if (pose === "victory") return [0, 1, 2, 1][Math.floor(wall / 240) % 4];
  return WAIT_FRAMES[Math.floor(wall / 300) % 4];
}
export function drawStage(ctx: CanvasRenderingContext2D, o: StageOpts, wall: number) {
  const h = o.h;
  const sy = h < H ? Math.round((H - h) * 0.45) : 0;
  ctx.drawImage(backdrop(o.theme), 0, sy, W, h, 0, 0, W, h);
  for (const a of [...o.actors].sort((p, q) => p.y - q.y)) {
    if (a.kind === "hero") {
      const pose = a.pose ?? "wait";
      shadow(ctx, a.x, a.y, 22);
      drawActor(ctx, a.ref, pose, stageFrame(pose, wall), a.x, a.y, false, 1, pose === "dead" ? undefined : a.weapon, a.mirror);
    } else if (a.kind === "foe") {
      const s = enemySprite(a.ref, a.k);
      shadow(ctx, a.x, a.y, Math.max(16, Math.min(56, Math.round(s.width * 0.7))));
      drawEnemy(ctx, a.ref, a.k, a.x, a.y + Math.round(Math.sin(wall / 520 + a.x)), false);
    } else if (a.kind === "chest") {
      shadow(ctx, a.x, a.y, 18);
      drawChest(ctx, a.x, a.y, o.openAt === undefined || wall < o.openAt ? 0 : Math.floor((wall - o.openAt) / 110), a.color);
    } else if (a.kind === "loot") {
      shadow(ctx, a.x, a.y, Math.max(10, Math.round(a.art.width * 0.8)));
      ctx.drawImage(a.art, Math.round(a.x - a.art.width / 2), a.y - a.art.height);
    } else drawCampfire(ctx, a.x, a.y, wall);
  }
  if (o.night) {
    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = "#3a4478";
    ctx.fillRect(0, 0, W, h);
    ctx.restore();
  }
  const sp = o.sparkle && manifest.vfx[o.sparkle.strip];
  if (o.sparkle && sp && (o.openAt === undefined || wall > o.openAt + 300)) {
    const img = vfxSprite(o.sparkle.strip, 2);
    const fw = img.width / sp.frames;
    ctx.drawImage(img, (Math.floor(wall / 70) % sp.frames) * fw, 0, fw, img.height, Math.round(o.sparkle.x - 16), Math.round(o.sparkle.y - 16), 32, 32);
  }
}

/** A party for a stage: who, with what weapon, in which formation. */
export type StageParty = { refs: string[]; weapons: Record<string, string | undefined>; formation: string };
/** Where a party stands on a strip `h` tall: its formation's lines, its rows squeezed to fit. */
export function partyOnStage(p: StageParty, h: number, pose: Pose = "wait"): StageActor[] {
  const f = c.formations.get(p.formation);
  const rows = ({ 1: [h - 14], 2: [h - 34, h - 6], 3: [h - 52, h - 28, h - 4] } as Record<number, number[]>)[Math.max(1, Math.min(3, p.refs.length))];
  return p.refs.slice(0, 3).map((ref, i) => ({ kind: "hero", ref, x: LINE_X[f?.positions[i]?.layout.line ?? "middle"] ?? 44, y: rows[i], pose, weapon: p.weapons[ref] }));
}
/** The party side by side around `cx` (a cheer, a walk, a chest), front-liners a step nearer. */
export function partyInLine(p: StageParty, h: number, pose: Pose = "wait", cx = W / 2, gap = 40): StageActor[] {
  const f = c.formations.get(p.formation);
  const n = Math.min(3, p.refs.length);
  return p.refs.slice(0, 3).map((ref, i) => {
    const line = f?.positions[i]?.layout.line ?? "middle";
    return { kind: "hero", ref, x: Math.round(cx + (i - (n - 1) / 2) * gap), y: h - 6 - (line === "back" ? 6 : line === "middle" ? 3 : 0), pose, weapon: p.weapons[ref] };
  });
}
/** Where a fight's foes stand on a strip `h` tall: as the battle stands them (a boss in front), squeezed to fit. */
export function foesOnStage(enemies: string[], h: number): StageActor[] {
  const bossAt = enemies.findIndex((e) => c.enemies.get(e)?.rank === "boss");
  const ordered = bossAt >= 0 ? [enemies[bossAt], ...enemies.filter((_, i) => i !== bossAt)] : enemies;
  const spots = foeSpots(ordered.length, bossAt >= 0);
  const squeeze = Math.min(1, (h - 64) / 80);
  return ordered.map((ref, i) => {
    const s = spots[i] ?? spots[spots.length - 1];
    const k = enemyK(ref, ordered.length);
    const w = enemySprite(ref, k).width;
    return { kind: "foe", ref, k, x: Math.max(w / 2 + 2, Math.min(W - w / 2 - 2, s.x)), y: Math.round(h - 4 - (204 - s.y) * squeeze) };
  });
}

/** A stage on a canvas, animated while it's on screen. */
export class Stage {
  private timer = 0;
  ctx: CanvasRenderingContext2D;
  constructor(public canvas: HTMLCanvasElement, public o: StageOpts) {
    canvas.width = W;
    canvas.height = o.h;
    this.ctx = canvas.getContext("2d")!;
    this.ctx.imageSmoothingEnabled = false;
  }
  /** `o.t0`: when the moment began, so a screen redrawn mid-way (a card tapped) carries on rather than starting over. */
  start() {
    const t0 = this.o.t0 ?? performance.now();
    const tick = () => drawStage(this.ctx, this.o, performance.now() - t0);
    tick();
    this.timer = window.setInterval(() => { if (!this.canvas.isConnected) return this.stop(); tick(); }, 70);
    return this;
  }
  stop() {
    clearInterval(this.timer);
  }
}
/** A stage as a DOM element: a canvas on the pixel grid, `h` logical pixels tall. */
export function stageEl(o: StageOpts): HTMLCanvasElement {
  const cv = document.createElement("canvas");
  cv.className = "strip";
  cv.style.height = `${o.h / 8}rem`;
  new Stage(cv, o).start();
  return cv;
}
/** The campfire as a DOM element. */
export function campEl(theme: string, members: { ref: string; ko: boolean }[], h = 176): HTMLCanvasElement {
  const cv = document.createElement("canvas");
  cv.className = "strip";
  cv.style.height = `${h / 8}rem`;
  new CampStrip(cv, theme, members, h).start();
  return cv;
}

// ─── The party strip: the party standing in its formation, for the menus ───

export const STRIP_H = 72;
export class Strip {
  private timer = 0;
  private tick = 0;
  ctx: CanvasRenderingContext2D;
  constructor(public canvas: HTMLCanvasElement, public party: string[], public formation: string, public weapons: Record<string, string | undefined>, public pick: number | null = null) {
    canvas.width = W;
    canvas.height = STRIP_H;
    this.ctx = canvas.getContext("2d")!;
    this.ctx.imageSmoothingEnabled = false;
  }
  start() {
    this.draw();
    this.timer = window.setInterval(() => {
      this.tick++;
      this.draw();
    }, 320);
    return this;
  }
  stop() {
    clearInterval(this.timer);
  }
  draw() {
    const ctx = this.ctx;
    ctx.drawImage(backdrop("strip", STRIP_H), 0, 0);
    const f = WAIT_FRAMES[this.tick % 4];
    const n = this.party.length;
    const fm = c.formations.get(this.formation);
    this.party.forEach((ref, i) => {
      const line = fm?.positions[i]?.layout.line ?? "middle";
      const dy = line === "front" ? 0 : line === "middle" ? -4 : -8;
      const x = n === 1 ? W / 2 : 56 + (i * (W - 112)) / (n - 1);
      drawActor(ctx, ref, "wait", f, x, STRIP_H - 6 + dy, false, 1, this.weapons[ref]);
      if (this.pick === i) drawText(ctx, "▼", x, STRIP_H - 6 + dy - 50, "#ffd54a", OUTLINE, "center");
    });
    if (!n) drawText(ctx, "NO PARTY", W / 2, STRIP_H / 2 - 4, "#f2f0e4", OUTLINE, "center");
  }
}
