/**
 * The field: 270×208 logical pixels, in colour. One scene, as the classic
 * battle screens have it: the party on the left facing right, the foes on the
 * right facing left, a backdrop per dungeon. Sprites are the packs at their
 * own pixel size. Over the sprites: HP bars under the foes, status glyphs with
 * their stacks under everyone, a wind-up bar over a head, damage numbers that
 * rise and fade, and the VFX strips.
 */
import { SUBTICKS } from "../../../src/schema.js";
import type { CUnit } from "../../../src/engine/combat/fight.js";
import { c, disp } from "../content.js";
import { manifest, VFX_FOR, type Pose } from "../art.js";
import { drawActor, drawEnemy, drawGlyph, drawText, enemyK, enemySprite, FRAME_W, OUTLINE, vfxSprite } from "../pixel.js";
import type { Driver } from "./driver.js";

export const W = FRAME_W, H = 224;
/** Party members draw at twice their art size: the packs draw heroes half the size of monsters. */
export const ACTOR_SCALE = 2;

export type UV = {
  id: string; side: "party" | "enemy"; ref: string; name: string;
  x: number; y: number; w: number; h: number; k: number;
  pose: Pose; poseUntil: number; lungeUntil: number; shakeUntil: number; flashUntil: number;
  alpha: number; gone: boolean;
  hpShown: number; shieldShown: number;
  cast: { name: string; start: number; end: number } | null;
  numberStack: number; numberAt: number;
};

export type NumOpts = { color?: string; outline?: string | null; sub?: string; subColor?: string; big?: boolean; glyph?: string; life?: number };
type Num = Required<Pick<NumOpts, "color" | "life">> & NumOpts & { x: number; y: number; text: string; born: number };
type Fx = { strip: string; x: number; y: number; size: number; born: number; fps: number; flip: boolean };

// ─── Layout ───

const LINE_X: Record<string, number> = { back: 34, middle: 52, front: 70 };
const ROWS: Record<number, number[]> = { 1: [160], 2: [120, 200], 3: [84, 148, 212] };
const rowsFor = (n: number) => ROWS[Math.max(1, Math.min(3, n))];
/** Where the party stands, by slot: feet positions. */
export function partySpots(formationId: string, count: number): { x: number; y: number }[] {
  const f = c.formations.get(formationId)!;
  const rows = rowsFor(count);
  return Array.from({ length: count }, (_, i) => {
    const pos = f.positions[i] ?? f.positions[0];
    return { x: LINE_X[pos.layout.line] ?? 46, y: rows[Math.min(i, rows.length - 1)] };
  });
}

// ─── Backdrops: flat bands of colour with a horizon and a few specks per dungeon ───

type Back = { sky: string; far: string; ground: string; floor: string; speck: string; n: number; rain?: string; stars?: boolean };
const BACK: Record<string, Back> = {
  old_road: { sky: "#86c0ea", far: "#4f8f4a", ground: "#8cba5c", floor: "#6f9a46", speck: "#4a7a34", n: 44 },
  crypt: { sky: "#171724", far: "#262638", ground: "#3a3a4e", floor: "#2b2b3c", speck: "#6a6a86", n: 18 },
  fire_mine: { sky: "#260a0a", far: "#5a1a12", ground: "#6c3222", floor: "#4a2016", speck: "#ff9a3c", n: 34 },
  ice_pass: { sky: "#bfe2ff", far: "#86b8e0", ground: "#e6f2ff", floor: "#c4d8ee", speck: "#ffffff", n: 70 },
  storm_tower: { sky: "#0f1738", far: "#1f2e58", ground: "#3a4460", floor: "#2a344c", speck: "#8ea6ff", n: 30, rain: "#7f98ff" },
  deep_crypt: { sky: "#08060e", far: "#1a1226", ground: "#292036", floor: "#1a1326", speck: "#7a5aa0", n: 14 },
  tower_top: { sky: "#283050", far: "#46587e", ground: "#5a6a8c", floor: "#46567a", speck: "#e0e8ff", n: 26, rain: "#c8d4ff", stars: true },
};
const HORIZON = 72;
const backdrops = new Map<string, HTMLCanvasElement>();
export function backdrop(theme: string, h = H): HTMLCanvasElement {
  const key = `${theme}|${h}`;
  let cv = backdrops.get(key);
  if (cv) return cv;
  cv = document.createElement("canvas");
  cv.width = W;
  cv.height = h;
  const g = cv.getContext("2d")!;
  const b = BACK[theme] ?? BACK.old_road;
  const horizon = Math.round((HORIZON * h) / H);
  g.fillStyle = b.sky;
  g.fillRect(0, 0, W, horizon);
  g.fillStyle = b.far;
  g.fillRect(0, horizon - 6, W, 6);
  g.fillStyle = b.ground;
  g.fillRect(0, horizon, W, h - horizon);
  g.fillStyle = b.floor;
  g.fillRect(0, h - 10, W, 10);
  let seed = 7;
  for (const ch of theme) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  g.fillStyle = b.speck;
  for (let i = 0; i < b.n; i++) {
    const x = Math.floor(rnd() * W), y = horizon + 2 + Math.floor(rnd() * (h - horizon - 12));
    const shape = Math.floor(rnd() * 3);
    g.fillRect(x, y, 1, 1);
    if (shape >= 1) g.fillRect(x + 1, y, 1, 1);
    if (shape === 2) g.fillRect(x + 1, y - 1, 1, 1);
  }
  if (b.stars) {
    g.fillStyle = "#ffffff";
    for (let i = 0; i < 24; i++) g.fillRect(Math.floor(rnd() * W), Math.floor(rnd() * (horizon - 10)), 1, 1);
  }
  if (b.rain) {
    g.fillStyle = b.rain;
    for (let i = 0; i < 50; i++) {
      const x = Math.floor(rnd() * W), y = Math.floor(rnd() * horizon);
      g.fillRect(x, y, 1, 3);
    }
  }
  backdrops.set(key, cv);
  return cv;
}

const WAIT_FRAMES = [0, 1, 2, 1];
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
  selected: string | null = null;
  wall = 0;

  constructor(public canvas: HTMLCanvasElement, public driver: Driver, public theme: string) {
    canvas.width = W;
    canvas.height = H;
    this.ctx = canvas.getContext("2d")!;
    this.ctx.imageSmoothingEnabled = false;
  }

  sync() {
    for (const u of this.driver.units()) if (!this.units.has(u.id)) this.add(u);
    this.layout();
  }

  private add(u: CUnit) {
    const party = u.side === "party";
    const crowd = this.driver.units().filter((x) => x.side === "enemy" && !x.gone).length;
    const k = party ? 3 : enemyK(u.ref, crowd);
    const s = party ? null : enemySprite(u.ref, k);
    this.units.set(u.id, {
      id: u.id, side: u.side, ref: u.ref, name: u.name, x: 0, y: 0, w: s ? s.width : 22 * ACTOR_SCALE, h: s ? s.height : 30 * ACTOR_SCALE, k,
      pose: u.ko ? "dead" : "wait", poseUntil: 0, lungeUntil: 0, shakeUntil: 0, flashUntil: 0, alpha: u.ko && !party ? 0 : 1, gone: !!u.gone,
      hpShown: u.hp, shieldShown: 0, cast: null, numberStack: 0, numberAt: 0,
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
    const rest = foes.filter((u) => u !== boss);
    if (boss) {
      const v = this.units.get(boss.id)!;
      v.x = 198;
      v.y = 212;
    }
    const cols = boss ? 1 : rest.length <= 3 ? 1 : rest.length <= 6 ? 2 : 3;
    const perCol = Math.ceil(rest.length / cols) || 1;
    const colX = boss ? [124] : cols === 1 ? [204] : cols === 2 ? [224, 164] : [238, 190, 142];
    for (let col = 0; col < cols; col++) {
      const group = rest.slice(col * perCol, (col + 1) * perCol);
      const rows = rowsFor(group.length);
      group.forEach((u, i) => {
        const v = this.units.get(u.id)!;
        v.x = colX[col] + (group.length > 1 ? (i % 2 ? -5 : 5) : 0);
        v.y = rows[Math.min(i, rows.length - 1)];
      });
    }
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
  down(id: string) {
    const v = this.units.get(id);
    if (!v) return;
    v.cast = null;
    if (v.side === "party") {
      v.pose = "dead";
      v.poseUntil = 0;
    }
  }
  revive(id: string) {
    const v = this.units.get(id);
    if (!v) return;
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
    for (const v of this.units.values()) v.cast = null;
  }

  /** A number or word over a unit; stacked numbers on the same unit spread out. */
  number(id: string, text: string, o: NumOpts = {}) {
    const v = this.units.get(id);
    if (!v) return;
    if (this.wall - v.numberAt < 700) v.numberStack++;
    else v.numberStack = 0;
    v.numberAt = this.wall;
    const side = v.numberStack ? (v.numberStack % 2 ? 1 : -1) * Math.min(2, Math.ceil(v.numberStack / 2)) * 16 : 0;
    const half = (Math.max(text.length, o.sub?.length ?? 0) * 8 * (o.big ? 2 : 1)) / 2 + (o.glyph ? 5 : 0);
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
    if (strip && v) this.effect(id, strip, big || v.h >= 56 ? 64 : 32, v.side === "party");
  }

  // ─── Drawing ───

  frame(wall: number) {
    this.wall = wall;
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
    v.hpShown += (u.hp - v.hpShown) * Math.min(1, dt * 10);
    if (Math.abs(u.hp - v.hpShown) < 1) v.hpShown = u.hp;
    const sh = shieldOf(u);
    v.shieldShown += (sh - v.shieldShown) * Math.min(1, dt * 10);
    if (v.poseUntil && this.wall > v.poseUntil) {
      v.poseUntil = 0;
      v.pose = u.ko ? "dead" : v.cast ? "chant" : "wait";
    }
    if (!u.ko && v.pose === "dead") v.pose = "wait";
    const stunned = u.statuses.some((s) => s.id === "stun" || s.id === "bulwark_broken");
    if (!u.ko && v.pose === "wait" && stunned) v.pose = "abnormal";
    if (!u.ko && v.pose === "abnormal" && !stunned) v.pose = "wait";
    if (!u.ko && v.pose === "wait" && u.cast) v.pose = "chant";
    if (!u.ko && v.pose === "chant" && !u.cast) v.pose = "wait";
    if (u.ko && v.side === "enemy" && v.alpha > 0) v.alpha = Math.max(0, v.alpha - dt * 2.5);
    if (!u.ko && v.alpha < 1) v.alpha = Math.min(1, v.alpha + dt * 3);
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
    if (v.side === "party") {
      const f = v.pose === "dead" ? 2 : v.pose === "wait" || v.pose === "chant" || v.pose === "abnormal" ? WAIT_FRAMES[Math.floor(this.wall / 300) % 4] : Math.min(2, Math.floor((this.wall - (v.poseUntil - 400)) / 130));
      drawActor(ctx, v.ref, v.pose, Math.max(0, f), x, v.y, flash, ACTOR_SCALE);
    } else {
      const bob = u.ko ? 0 : Math.round(Math.sin(this.wall / 520 + v.x));
      drawEnemy(ctx, v.ref, v.k, x, v.y + bob, flash);
    }
    ctx.restore();
  }

  private drawOverlay(v: UV, u: CUnit) {
    const ctx = this.ctx;
    if (v.alpha <= 0 || (u.ko && v.side === "enemy")) return;
    const top = v.y - v.h;
    const x = Math.round(v.x);
    let glyphY = v.y + 3;
    if (v.side === "enemy") {
      // HP under the feet, in the bar's colour; a light segment for a Shield
      const max = u.stats.max_hp;
      const hp = Math.max(0, Math.min(1, v.hpShown / max));
      const bw = Math.max(18, Math.min(36, Math.round(v.w * 0.7)));
      const bx = x - bw / 2, by = v.y + 2;
      ctx.fillStyle = OUTLINE;
      ctx.fillRect(bx - 1, by - 1, bw + 2, 5);
      ctx.fillStyle = "#3a3a4a";
      ctx.fillRect(bx, by, bw, 3);
      ctx.fillStyle = hpColor(hp);
      ctx.fillRect(bx, by, Math.round(bw * hp), 3);
      const sh = Math.min(1 - hp, v.shieldShown / max);
      if (sh > 0.005) {
        ctx.fillStyle = "#a8e8ff";
        ctx.fillRect(bx + Math.round(bw * hp), by, Math.max(1, Math.round(bw * sh)), 3);
      }
      glyphY = by + 6;
    }
    if (!u.ko) {
      const sts = shownStatuses(u).slice(0, 4);
      if (sts.length) {
        const gx = x - Math.round((sts.length * 10 - 2) / 2);
        sts.forEach((s, i) => drawGlyph(ctx, s.id, gx + i * 10, glyphY, s.count));
      }
    }
    if (v.cast && !u.ko) {
      const p = Math.max(0, Math.min(1, (this.driver.vt - v.cast.start) / Math.max(1, v.cast.end - v.cast.start)));
      ctx.fillStyle = OUTLINE;
      ctx.fillRect(x - 12, top - 8, 24, 5);
      ctx.fillStyle = "#3a3a4a";
      ctx.fillRect(x - 11, top - 7, 22, 3);
      ctx.fillStyle = "#ffd54a";
      ctx.fillRect(x - 11, top - 7, Math.round(22 * p), 3);
    }
    if (this.selected === v.id) drawText(ctx, "▼", x, top - 18 + Math.round(Math.sin(this.wall / 150)), "#ffd54a", OUTLINE, "center");
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
      if (n.glyph) {
        drawGlyph(ctx, n.glyph, Math.round(x - tw / 2 - 10), Math.round(y) + (n.big ? 4 : 0));
        x += 5;
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
      if (px >= v.x - v.w / 2 - 6 && px <= v.x + v.w / 2 + 6 && py >= top - 10 && py <= v.y + 14) {
        const d = Math.abs(px - v.x) + Math.abs(py - (v.y - v.h / 2));
        if (d < bestD) (best = v.id), (bestD = d);
      }
    }
    return best;
  }
}

// ─── The party strip: the party standing in its formation, for the menus ───

export const STRIP_H = 56;
export class Strip {
  private timer = 0;
  private tick = 0;
  ctx: CanvasRenderingContext2D;
  constructor(public canvas: HTMLCanvasElement, public party: string[], public formation: string, public pick: number | null = null) {
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
    ctx.drawImage(backdrop("old_road", STRIP_H), 0, 0);
    const f = WAIT_FRAMES[this.tick % 4];
    const n = this.party.length;
    const fm = c.formations.get(this.formation);
    this.party.forEach((ref, i) => {
      const line = fm?.positions[i]?.layout.line ?? "middle";
      const dy = line === "front" ? 0 : line === "middle" ? -3 : -6;
      const x = n === 1 ? W / 2 : 46 + (i * (W - 92)) / (n - 1);
      drawActor(ctx, ref, "wait", f, x, STRIP_H - 6 + dy, false);
      if (this.pick === i) drawText(ctx, "▼", x, STRIP_H - 6 + dy - 44, "#ffd54a", OUTLINE, "center");
    });
    if (!n) drawText(ctx, "NO PARTY", W / 2, STRIP_H / 2 - 4, "#f2f0e4", OUTLINE, "center");
  }
}
