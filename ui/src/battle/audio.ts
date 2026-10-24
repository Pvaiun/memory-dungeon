/** Placeholder sounds: short synthesized beeps, no files. */
let ctx: AudioContext | null = null;
let enabled = true;

export function setSound(on: boolean) {
  enabled = on;
}

function ac(): AudioContext | null {
  if (!enabled) return null;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, ms: number, type: OscillatorType = "square", gain = 0.05, slide = 0) {
  const a = ac();
  if (!a) return;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, a.currentTime);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), a.currentTime + ms / 1000);
  g.gain.setValueAtTime(gain, a.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0005, a.currentTime + ms / 1000);
  o.connect(g).connect(a.destination);
  o.start();
  o.stop(a.currentTime + ms / 1000 + 0.02);
}

function noise(ms: number, gain = 0.06) {
  const a = ac();
  if (!a) return;
  const buf = a.createBuffer(1, a.sampleRate * (ms / 1000), a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const s = a.createBufferSource();
  s.buffer = buf;
  const g = a.createGain();
  g.gain.value = gain;
  s.connect(g).connect(a.destination);
  s.start();
}

export const sfx = {
  hit: () => { noise(70); tone(180, 80, "square", 0.04, -100); },
  crit: () => { noise(110, 0.08); tone(420, 120, "sawtooth", 0.05, -300); },
  miss: () => tone(900, 60, "sine", 0.03, 300),
  block: () => tone(120, 90, "triangle", 0.05),
  magic: () => tone(520, 160, "triangle", 0.04, 400),
  heal: () => { tone(660, 90, "sine", 0.04); setTimeout(() => tone(990, 140, "sine", 0.04), 90); },
  cast: () => tone(300, 160, "sine", 0.03, 200),
  status: () => tone(760, 50, "square", 0.025),
  down: () => tone(220, 400, "sawtooth", 0.05, -180),
  win: () => { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 160, "square", 0.04), i * 110)); },
  lose: () => { [392, 349, 311, 262].forEach((f, i) => setTimeout(() => tone(f, 220, "triangle", 0.05), i * 180)); },
};
