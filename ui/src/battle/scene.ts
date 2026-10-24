/**
 * The battlefield on a canvas: party on the left facing right, foes on the
 * right facing left, in the NES Final Fantasy arrangement flipped. Draws
 * sprites with poses, HP and Shield bars, status icons with their timers,
 * wind-up bars, floating damage numbers and the sprite-sheet VFX.
 */
import { SUBTICKS } from "../../../src/schema.js";
import type { CUnit } from "../../../src/engine/combat/fight.js";
import { c, disp } from "../content.js";
import { ELEMENT_COLOR, enemyName, image, manifest, poseRect, type Pose, VFX_FOR } from "../art.js";
import type { Driver } from "./driver.js";

export const W = 1280, H = 600;

export type UV = {
  id: string; side: "party" | "enemy"; ref: string; name: string;
  x: number; y: number; scale: number; w: number; h: number;
  pose: Pose; poseUntil: number; lunge: number; lungeUntil: number; shakeUntil: number; flashUntil: number; flashColor: string;
  alpha: number; gone: boolean;
  hpShown: number; shieldShown: number;
  cast: { name: string; start: number; end: number } | null;
  numberStack: number; numberAt: number;
  glowUntil: number; glowColor: string;
};

type Num = { x: number; y: number; text: string; color: string; size: number; born: number; life: number; sub?: string; subColor?: string; icon?: string };
type Fx = { strip: string; x: number; y: number; scale: number; born: number; fps: number; flip: boolean; alpha: number };

const BACKDROPS: Record<string, [string, string, string]> = {
  old_road: ["#2a4a2c", "#5c7a3a", "#3b2a1a"], crypt: ["#17122a", "#2a2240", "#1a1424"], fire_mine: ["#2a0d0a", "#5a1d10", "#1a0806"],
  ice_pass: ["#1a2a4a", "#6f8fb8", "#d8e8f8"], storm_tower: ["#0f1030", "#2a2a6a", "#101030"], deep_crypt: ["#0a0810", "#1a1424", "#06040a"], tower_top: ["#10103a", "#3a2a7a", "#1a1a4a"],
};

export class Scene {
  ctx: CanvasRenderingContext2D;
  units = new Map<string, UV>();
  numbers: Num[] = [];
  fx: Fx[] = [];
  banner: { text: string; sub: string; until: number; color: string } | null = null;
  selected: string | null = null;
  hover: string | null = null;
  designer = true;
  showEnemyNumbers = true;
  private tint = document.createElement("canvas");
  wall = 0;

  constructor(public canvas: HTMLCanvasElement, public driver: Driver, public theme: string) {
    canvas.width = W;
    canvas.height = H;
    this.ctx = canvas.getContext("2d")!;
    this.ctx.imageSmoothingEnabled = false;
    this.tint.width = 512;
    this.tint.height = 512;
  }

  // ─── Units and layout ───

  sync() {
    const units = this.driver.units();
    for (const u of units) if (!this.units.has(u.id)) this.add(u);
    this.layout();
  }

  private add(u: CUnit) {
    const party = u.side === "party";
    let scale = 1, w = 144, h = 144;
    if (!party) {
      const art = manifest.enemies[u.ref];
      scale = art?.scale ?? 1;
      w = (art?.w ?? 120) * scale;
      h = (art?.h ?? 120) * scale;
    }
    this.units.set(u.id, {
      id: u.id, side: u.side, ref: u.ref, name: party ? u.name : enemyName(u.ref, u.name), x: 0, y: 0, scale, w, h,
      pose: u.ko ? "dead" : "wait", poseUntil: 0, lunge: 0, lungeUntil: 0, shakeUntil: 0, flashUntil: 0, flashColor: "#fff", alpha: u.ko ? 0.35 : 1, gone: !!u.gone,
      hpShown: u.hp, shieldShown: 0, cast: null, numberStack: 0, numberAt: 0, glowUntil: 0, glowColor: "#fff",
    });
  }

  layout() {
    const units = this.driver.units();
    const party = units.filter((u) => u.side === "party");
    const f = c.formations.get(this.driver.input.party.formation)!;
    const lineX: Record<string, number> = { front: 340, middle: 250, back: 160 };
    party.forEach((u) => {
      const v = this.units.get(u.id)!;
      const pos = f.positions[u.slot] ?? f.positions[0];
      v.x = lineX[pos.layout.line] ?? 250;
      v.y = 235 + pos.layout.column * 165;
    });
    const foes = units.filter((u) => u.side === "enemy" && !u.gone);
    const boss = foes.find((u) => c.enemies.get(u.ref)?.rank === "boss");
    const rest = foes.filter((u) => u !== boss);
    if (boss) {
      const v = this.units.get(boss.id)!;
      const art = manifest.enemies[boss.ref];
      let sc = art?.scale ?? 1;
      if ((art?.w ?? 100) * sc > 330) sc = 330 / (art?.w ?? 100);
      if ((art?.h ?? 100) * sc > 330) sc = Math.min(sc, 330 / (art?.h ?? 100));
      v.w = (art?.w ?? 120) * sc;
      v.h = (art?.h ?? 120) * sc;
      v.x = 1070 - Math.max(0, v.w / 2 - 170);
      v.y = Math.min(565, 330 + v.h / 2);
    }
    const cols = rest.length <= 3 ? 1 : rest.length <= 6 ? 2 : 3;
    const perCol = Math.ceil(rest.length / cols) || 1;
    const x0 = boss ? 860 : 1090;
    const OVERLAY = 72, TOP = 60, BOTTOM = 565;
    for (let col = 0; col < cols; col++) {
      const group = rest.slice(col * perCol, (col + 1) * perCol);
      const natural = group.map((u) => {
        const art = manifest.enemies[u.ref];
        return (art?.h ?? 120) * (art?.scale ?? 1);
      });
      const sumH = natural.reduce((a, h) => a + h, 0);
      const s = Math.min(1, (BOTTOM - TOP - OVERLAY * group.length) / Math.max(1, sumH));
      const total = natural.reduce((a, h) => a + h * s + OVERLAY, 0);
      let y = Math.max(TOP, (TOP + BOTTOM) / 2 - total / 2);
      group.forEach((u, row) => {
        const v = this.units.get(u.id)!;
        const art = manifest.enemies[u.ref];
        const sc = (art?.scale ?? 1) * s;
        v.w = (art?.w ?? 120) * sc;
        v.h = (art?.h ?? 120) * sc;
        v.x = x0 - col * 200 + (row % 2 ? -34 : 34) * (group.length > 1 ? 1 : 0);
        y += OVERLAY + v.h;
        v.y = y;
      });
    }
  }

  // ─── Reactions to events ───

  pose(id: string, pose: Pose, ms: number) {
    const v = this.units.get(id);
    if (!v) return;
    v.pose = pose;
    v.poseUntil = this.wall + ms;
  }
  lunge(id: string, ms = 220) {
    const v = this.units.get(id);
    if (!v) return;
    v.lungeUntil = this.wall + ms;
  }
  hit(id: string, color = "#fff") {
    const v = this.units.get(id);
    if (!v) return;
    v.shakeUntil = this.wall + 220;
    v.flashUntil = this.wall + 140;
    v.flashColor = color;
    if (v.side === "party" && v.pose !== "dead") this.pose(id, "damage", 350);
  }
  glow(id: string, color: string, ms: number) {
    const v = this.units.get(id);
    if (!v) return;
    v.glowUntil = this.wall + ms;
    v.glowColor = color;
  }
  down(id: string) {
    const v = this.units.get(id);
    if (!v) return;
    v.cast = null;
    if (v.side === "party") {
      v.pose = "dead";
      v.poseUntil = 0;
    }
    v.alpha = v.side === "party" ? 0.85 : 0.0;
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

  number(id: string, text: string, color: string, size = 26, sub?: string, subColor?: string, icon?: string) {
    const v = this.units.get(id);
    if (!v) return;
    if (this.wall - v.numberAt < 600) v.numberStack++;
    else v.numberStack = 0;
    v.numberAt = this.wall;
    const popup = text.startsWith("+") && size <= 16;
    const side = popup ? Math.min(v.w * 0.45 + 30, 90) : v.numberStack ? (v.numberStack % 2 ? 1 : -1) * Math.min(2, Math.ceil(v.numberStack / 2)) * 34 : 0;
    const base = v.side === "party" ? v.y - 50 : v.y - v.h * 0.4;
    const x = Math.max(60, Math.min(W - 70, v.x + side));
    this.numbers.push({ x, y: popup ? base + 20 : base - Math.floor(v.numberStack / 2) * 20, text, color, size, born: this.wall, life: 1400, sub, subColor, icon });
  }

  effect(id: string, strip: string, scaleMul = 1, flip = false) {
    const v = this.units.get(id);
    if (!v || !manifest.vfx[strip]) return;
    const s = Math.max(1.6, Math.min(4, v.h / 56)) * scaleMul;
    this.fx.push({ strip, x: v.x, y: v.y - v.h / 2, scale: s, born: this.wall, fps: 14, flip, alpha: 1 });
  }
  effectFor(id: string, tag: string, mul = 1) {
    const strip = VFX_FOR[tag];
    if (strip) this.effect(id, strip, mul, this.units.get(id)?.side === "party");
  }

  // ─── Drawing ───

  frame(wall: number) {
    this.wall = wall;
    const ctx = this.ctx;
    const units = this.driver.units();
    this.drawBackdrop();
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

  private drawBackdrop() {
    const ctx = this.ctx;
    const [sky, mid, ground] = BACKDROPS[this.theme] ?? BACKDROPS.old_road;
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, sky);
    g.addColorStop(0.62, mid);
    g.addColorStop(0.63, ground);
    g.addColorStop(1, "#000");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 380 + i * 30);
      ctx.lineTo(W, 380 + i * 30);
      ctx.stroke();
    }
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
    const sub = u.statuses.map((s) => s.id);
    if (!u.ko && v.pose === "wait" && (sub.includes("stun") || sub.includes("bulwark_broken"))) v.pose = "abnormal";
    if (!u.ko && v.pose === "abnormal" && !(sub.includes("stun") || sub.includes("bulwark_broken"))) v.pose = "wait";
    if (!u.ko && v.pose === "wait" && u.cast) v.pose = "chant";
    if (!u.ko && v.pose === "chant" && !u.cast) v.pose = "wait";
    if (u.ko && v.side === "enemy" && v.alpha > 0) v.alpha = Math.max(0, v.alpha - dt * 3);
    if (!u.ko && v.alpha < 1) v.alpha = Math.min(1, v.alpha + dt * 3);
  }

  private drawUnit(v: UV, u: CUnit) {
    const ctx = this.ctx;
    if (v.alpha <= 0) return;
    const shaking = this.wall < v.shakeUntil ? Math.sin(this.wall / 18) * 5 : 0;
    const lungeT = v.lungeUntil > this.wall ? 1 - (v.lungeUntil - this.wall) / 220 : 0;
    const lunge = lungeT ? Math.sin(lungeT * Math.PI) * 36 * (v.side === "party" ? 1 : -1) : 0;
    const bob = u.ko ? 0 : Math.sin(this.wall / 500 + v.x) * 2;
    const x = v.x + shaking + lunge, y = v.y + (v.side === "enemy" ? bob : 0);
    const hidden = u.statuses.some((s) => s.id === "hidden");
    ctx.save();
    ctx.globalAlpha = v.alpha * (hidden ? 0.45 : 1);
    if (this.wall < v.glowUntil) {
      ctx.save();
      ctx.globalAlpha = 0.35 + 0.25 * Math.sin(this.wall / 60);
      ctx.fillStyle = v.glowColor;
      ctx.beginPath();
      ctx.ellipse(x, y - 4, v.w * 0.45, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    // shadow
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(x, y, v.w * 0.35, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    const flash = this.wall < v.flashUntil;
    if (v.side === "party") {
      const sheet = image(manifest.classes[v.ref]);
      if (sheet) {
        const frame = Math.floor(this.wall / 180) % 3;
        const f = v.pose === "dead" ? 2 : v.pose === "wait" || v.pose === "chant" || v.pose === "abnormal" ? [0, 1, 2, 1][Math.floor(this.wall / 260) % 4] : Math.min(2, Math.floor((this.wall - (v.poseUntil - 400)) / 130));
        const [sx, sy, fw, fh] = poseRect(sheet, v.pose, v.pose === "dead" ? 2 : Math.max(0, f ?? frame));
        const s = 1;
        this.blit(sheet, sx, sy, fw, fh, x, y + 10, fw * s, fh * s, true, flash ? v.flashColor : null);
      }
    } else {
      const img = image(manifest.enemies[v.ref]?.file ?? "");
      if (img) this.blit(img, 0, 0, img.width, img.height, x, y, v.w, v.h, false, flash ? v.flashColor : null);
    }
    ctx.restore();
    if (this.selected === v.id || this.hover === v.id) {
      ctx.save();
      ctx.strokeStyle = this.selected === v.id ? "#ffd85a" : "rgba(255,255,255,0.6)";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(x - v.w / 2 - 4, y - v.h - 4, v.w + 8, v.h + 10);
      ctx.restore();
    }
  }

  /** Draws an image with its feet at (x, y), optionally flipped and tinted. */
  private blit(img: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, x: number, y: number, w: number, h: number, flip: boolean, tint: string | null) {
    const ctx = this.ctx;
    let src: CanvasImageSource = img;
    if (tint) {
      const t = this.tint.getContext("2d")!;
      t.clearRect(0, 0, 512, 512);
      t.imageSmoothingEnabled = false;
      t.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      t.globalCompositeOperation = "source-atop";
      t.fillStyle = tint;
      t.globalAlpha = 0.75;
      t.fillRect(0, 0, sw, sh);
      t.globalCompositeOperation = "source-over";
      t.globalAlpha = 1;
      src = this.tint;
      sx = 0;
      sy = 0;
    }
    ctx.save();
    ctx.translate(x, y);
    if (flip) ctx.scale(-1, 1);
    ctx.drawImage(src, sx, sy, sw, sh, -w / 2, -h, w, h);
    ctx.restore();
  }

  private drawOverlay(v: UV, u: CUnit) {
    const ctx = this.ctx;
    const boss = c.enemies.get(u.ref)?.rank === "boss";
    const bw = boss ? 170 : v.side === "party" ? 120 : 110;
    const x = v.x - bw / 2;
    let y = v.y - v.h - 44;
    if (v.side === "party") y = v.y - 126;
    ctx.save();
    // wind-up bar, above the name, so nothing below hides it
    if (v.cast && !u.ko) {
      const cy = y - 26;
      const p = Math.max(0, Math.min(1, (this.driver.vt - v.cast.start) / Math.max(1, v.cast.end - v.cast.start)));
      ctx.fillStyle = "#000";
      ctx.fillRect(x - 1, cy - 1, bw + 2, 15);
      ctx.fillStyle = "#4a3a10";
      ctx.fillRect(x, cy, bw, 13);
      ctx.fillStyle = v.side === "party" ? "#ffd85a" : "#ff9a3a";
      ctx.fillRect(x, cy, bw * p, 13);
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#111";
      const left = Math.max(0, (v.cast.end - this.driver.vt) / SUBTICKS);
      ctx.fillText(`${v.cast.name} ${left.toFixed(1)}t`, v.x, cy + 10);
    }
    if (u.ko && v.side === "enemy") {
      ctx.font = "bold 13px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#000";
      ctx.fillStyle = "#8a8a9a";
      ctx.strokeText(`${v.name} (down)`, v.x, v.y - 8);
      ctx.fillText(`${v.name} (down)`, v.x, v.y - 8);
      ctx.restore();
      return;
    }
    ctx.font = "bold 14px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000";
    ctx.fillStyle = u.ko ? "#ff8080" : "#fff";
    const label = u.ko ? `${v.name} (down)` : v.name;
    ctx.strokeText(label, v.x, y);
    ctx.fillText(label, v.x, y);
    y += 5;
    // HP bar, with the shield as a bar above it
    const max = u.stats.max_hp;
    const hp = Math.max(0, v.hpShown) / max;
    const shield = Math.min(1, v.shieldShown / max);
    ctx.fillStyle = "#000";
    ctx.fillRect(x - 1, y - 1, bw + 2, 10);
    ctx.fillStyle = "#3a1010";
    ctx.fillRect(x, y, bw, 8);
    ctx.fillStyle = hp > 0.5 ? "#58d35a" : hp > 0.25 ? "#e8c23a" : "#ff5a5a";
    ctx.fillRect(x, y, bw * hp, 8);
    if (shield > 0) {
      ctx.fillStyle = "#9ad0ff";
      ctx.fillRect(x, y - 4, bw * shield, 3);
    }
    if (v.side === "party" || (this.designer && this.showEnemyNumbers)) {
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.textAlign = "left";
      const txt = `${disp(Math.round(v.hpShown))}/${disp(max)}${v.shieldShown >= 5 ? ` +${disp(Math.round(v.shieldShown))}` : ""}`;
      ctx.strokeText(txt, x + bw + 4, y + 8);
      ctx.fillStyle = "#fff";
      ctx.fillText(txt, x + bw + 4, y + 8);
    }
    y += 12;
    // statuses: icon, stacks, remaining time as a shrinking line under the icon
    const shown = u.statuses.filter((s) => c.statuses.get(s.id)?.show === "icon");
    let ix = x;
    for (const s of shown) {
      const img = image(manifest.statuses[s.id] ?? "");
      const d = c.statuses.get(s.id)!;
      if (img) ctx.drawImage(img, ix, y, 20, 20);
      else {
        ctx.fillStyle = "#444";
        ctx.fillRect(ix, y, 20, 20);
      }
      if (d.stacking === "intensity") {
        const n = s.id === "shield" ? disp(Math.floor(s.stacks / SUBTICKS)) : Math.floor(s.stacks / SUBTICKS);
        ctx.font = "bold 11px system-ui, sans-serif";
        ctx.textAlign = "right";
        ctx.strokeText(String(n), ix + 22, y + 21);
        ctx.fillStyle = "#fff";
        ctx.fillText(String(n), ix + 22, y + 21);
      }
      if (s.end !== -1) {
        const total = (d.duration ?? 1) * SUBTICKS;
        const left = Math.max(0, Math.min(1, (s.end - this.driver.vt) / total));
        ctx.fillStyle = "#000";
        ctx.fillRect(ix, y + 20, 20, 3);
        ctx.fillStyle = s.id === "doom" ? "#ff4060" : "#ffd85a";
        ctx.fillRect(ix, y + 20, 20 * left, 3);
        if (s.id === "doom") {
          const t = Math.ceil((s.end - this.driver.vt) / SUBTICKS);
          ctx.font = "bold 12px system-ui, sans-serif";
          ctx.textAlign = "left";
          ctx.strokeText(`${t}`, ix + 22, y + 12);
          ctx.fillStyle = "#ff8090";
          ctx.fillText(`${t}`, ix + 22, y + 12);
          ix += 12;
        }
      }
      ix += 24;
    }
    if (!u.ko && !v.cast && u.busy > this.driver.vt) {
      // recovery: a thin grey bar where the wind-up bar goes
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillRect(x, y - 18, bw, 3);
    }
    ctx.restore();
  }

  private drawFx() {
    const ctx = this.ctx;
    const keep: Fx[] = [];
    for (const f of this.fx) {
      const def = manifest.vfx[f.strip];
      const img = image(def.file);
      const frame = Math.floor(((this.wall - f.born) / 1000) * f.fps);
      if (!img || frame >= def.frames) continue;
      keep.push(f);
      const s = 64 * f.scale;
      ctx.save();
      ctx.globalAlpha = f.alpha;
      ctx.translate(f.x, f.y);
      if (f.flip) ctx.scale(-1, 1);
      ctx.drawImage(img, frame * 64, 0, 64, 64, -s / 2, -s / 2, s, s);
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
      const rise = t < 0.15 ? -t * 160 : -24 - (t - 0.15) * 30;
      const pop = t < 0.12 ? 1 + (0.12 - t) * 4 : 1;
      ctx.save();
      ctx.globalAlpha = t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;
      ctx.textAlign = "center";
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#000";
      ctx.font = `bold ${Math.round(n.size * pop)}px system-ui, sans-serif`;
      ctx.strokeText(n.text, n.x, n.y + rise);
      ctx.fillStyle = n.color;
      ctx.fillText(n.text, n.x, n.y + rise);
      if (n.sub) {
        ctx.font = "bold 12px system-ui, sans-serif";
        ctx.lineWidth = 3;
        ctx.strokeText(n.sub, n.x, n.y + rise + 14);
        ctx.fillStyle = n.subColor ?? "#ddd";
        ctx.fillText(n.sub, n.x, n.y + rise + 14);
      }
      ctx.restore();
    }
    this.numbers = keep;
  }

  private drawBanner() {
    if (!this.banner || this.wall > this.banner.until) return;
    const ctx = this.ctx;
    const t = Math.min(1, (this.banner.until - this.wall) / 300);
    ctx.save();
    ctx.globalAlpha = Math.min(1, t * 1.5);
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 230, W, 110);
    ctx.textAlign = "center";
    ctx.font = "bold 40px system-ui, sans-serif";
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#000";
    ctx.strokeText(this.banner.text, W / 2, 285);
    ctx.fillStyle = this.banner.color;
    ctx.fillText(this.banner.text, W / 2, 285);
    if (this.banner.sub) {
      ctx.font = "bold 18px system-ui, sans-serif";
      ctx.lineWidth = 3;
      ctx.strokeText(this.banner.sub, W / 2, 318);
      ctx.fillStyle = "#fff";
      ctx.fillText(this.banner.sub, W / 2, 318);
    }
    ctx.restore();
  }

  showBanner(text: string, sub = "", ms = 1500, color = "#ffd85a") {
    this.banner = { text, sub, until: this.wall + ms, color };
  }

  /** The unit under a canvas point, nearest first. */
  hitTest(px: number, py: number): string | null {
    let best: string | null = null, bestD = Infinity;
    for (const v of this.units.values()) {
      if (v.gone || v.alpha <= 0) continue;
      const top = v.side === "party" ? v.y - 150 : v.y - v.h;
      if (px >= v.x - v.w / 2 - 8 && px <= v.x + v.w / 2 + 8 && py >= top - 40 && py <= v.y + 10) {
        const d = Math.abs(px - v.x) + Math.abs(py - (v.y - v.h / 2));
        if (d < bestD) (best = v.id), (bestD = d);
      }
    }
    return best;
  }
}

export function shieldOf(u: CUnit): number {
  let s = 0;
  for (const st of u.statuses) if (c.statuses.get(st.id)?.absorb) s += Math.floor(st.stacks / SUBTICKS);
  return s;
}

export const colorFor = (tag: string | undefined) => ELEMENT_COLOR[tag ?? "physical"] ?? "#fff";
