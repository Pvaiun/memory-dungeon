import { defineConfig } from "vite";

// The interface: `npm run ui` serves it, `npm run ui:build` writes ui/dist (ignored by git).
export default defineConfig({
  base: "./",
  build: { outDir: "dist", emptyOutDir: true },
  server: { port: 5173, host: true },
});
