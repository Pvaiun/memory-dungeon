import { loadArt } from "./art.js";
import { h } from "./dom.js";
import { mount } from "./screens.js";

const app = document.getElementById("app")!;
app.append(h("div", { class: "screen" }, h("div", { class: "panel" }, "Loading sprites…")));
loadArt()
  .then(() => {
    app.replaceChildren();
    mount(app);
  })
  .catch((e: Error) => {
    app.replaceChildren(h("div", { class: "screen" }, h("div", { class: "panel warn" }, `Couldn't load the art: ${e.message}`)));
  });

// A hook for scripted screenshots: window.__battle("old_road~ogre_bridge") starts that fight.
import { go } from "./screens.js";
(window as unknown as { __battle: (d: string) => void }).__battle = (d: string) => go("battle", { dungeon: d });
