import { loadArt } from "./art.js";
import { h, initBack } from "./dom.js";
import { buildFont, fitScale, FONT } from "./pixel.js";
import { setDisplayDiv } from "./content.js";
import { setup } from "./state.js";
import { go, mount, setTheme } from "./screens.js";

fitScale();
setTheme(setup.settings.theme);
setDisplayDiv(setup.settings.bigNumbers ? 10 : 100);
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
