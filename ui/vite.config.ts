import { defineConfig } from "vite";

// The interface: `npm run ui` serves it, `npm run ui:build` writes ui/dist (ignored by git).
// Each build has an id (the commit on GitHub, else the time), compiled in as __BUILD__ and written to version.json,
// which the app checks so a phone picks up a new build by itself (src/update.ts).
const BUILD = process.env.GITHUB_SHA?.slice(0, 8) ?? Date.now().toString(36);

export default defineConfig({
  base: "./",
  define: { __BUILD__: JSON.stringify(BUILD) },
  plugins: [{
    name: "version-json",
    apply: "build",
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "version.json", source: JSON.stringify({ build: BUILD }) });
    },
  }],
  build: { outDir: "dist", emptyOutDir: true },
  server: { port: 5173, host: true },
});
