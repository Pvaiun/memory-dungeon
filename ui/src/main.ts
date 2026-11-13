import { loadArt } from "./art.js";
import { h, initBack } from "./dom.js";
import { buildFont, fitScale, FONT } from "./pixel.js";
import { setNumberScale } from "./content.js";
import { setup } from "./state.js";
import { go, mount, screen, setTheme } from "./screens.js";
import { checkForUpdate } from "./update.js";

fitScale();
setTheme(setup.settings.theme);
setNumberScale(setup.settings.numbers);
window.addEventListener("resize", fitScale);

initBack();

const app = document.getElementById("app")!;
app.append(h("div", { class: "frame" }, h("div", { class: "screen" }, h("div", { class: "win" }, "LOADING…"))));
Promise.all([loadArt(), document.fonts.load(`8px ${FONT}`)])
  .then(() => {
    buildFont();
    app.replaceChildren();
    mount(app);
  })
  .catch((e: Error) => {
    app.replaceChildren(h("div", { class: "frame" }, h("div", { class: "screen" }, h("div", { class: "win text" }, `Couldn't load the art: ${e.message}`))));
  });

// A newer build on the site: reload onto it, at start and whenever the app comes back to the front, but not mid-fight.
// Coming back, the check waits for the window to settle: a reload while the phone is still bringing the app up can be
// handed the wrong screen height (the page ran under the navigation bar until the app was restarted).
const notFighting = () => screen() !== "battle";
const SETTLE_MS = 1500;
void checkForUpdate(notFighting);
let settle: ReturnType<typeof setTimeout> | undefined;
document.addEventListener("visibilitychange", () => {
  clearTimeout(settle);
  if (!document.hidden) settle = setTimeout(() => { if (!document.hidden) void checkForUpdate(notFighting); }, SETTLE_MS);
});

// Hooks for scripted screenshots: window.__battle("old_road~ogre_bridge") starts that fight; window.__go("party") opens a screen.
(window as unknown as { __battle: (d: string, seed?: number) => void }).__battle = (d: string, seed?: number) => go("battle", { dungeon: d, seed });
(window as unknown as { __go: (s: string, arg?: unknown) => void }).__go = (s: string, arg?: unknown) => go(s as Parameters<typeof go>[0], arg);

// A gallery of every sprite as drawn, for checking the art: window.__gallery().
import { classes, enemies } from "./content.js";
import { actorEl, enemyEl, faceEl, statusEl } from "./pixel.js";
import { manifest } from "./art.js";
import { gearFor } from "./state.js";
(window as unknown as { __gallery: () => void }).__gallery = () => {
  const grid = h("div", { style: "display:flex;flex-wrap:wrap;gap:.5rem;align-items:flex-end;background:#8cba5c;padding:.5rem" });
  for (const k of classes) grid.append(h("div", { style: "display:flex;flex-direction:column;align-items:center" }, actorEl(k.id, "wait", 1, gearFor(k.id).weapon), faceEl(k.id)));
  for (const e of enemies) grid.append(enemyEl(e.id));
  for (const id of Object.keys(manifest.statuses)) grid.append(statusEl(id, 7, 2));
  document.body.style.height = "auto";
  app.style.height = "auto";
  app.replaceChildren(h("div", { class: "frame", style: "overflow:visible;height:auto" }, grid));
};
