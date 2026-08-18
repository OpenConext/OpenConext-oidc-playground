import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

const rootDir = import.meta.dirname;

export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: "**/*.svg",
      svgrOptions: {
        exportType: "named",
        namedExport: "ReactComponent"
      }
    })
  ],
  resolve: {
    alias: {
      api: path.resolve(rootDir, "src/api"),
      components: path.resolve(rootDir, "src/components"),
      images: path.resolve(rootDir, "src/images"),
      pages: path.resolve(rootDir, "src/pages"),
      store: path.resolve(rootDir, "src/store.js"),
      utils: path.resolve(rootDir, "src/utils")
    }
  },
  server: {
    port: 3006,
    proxy: {
      "/oidc": "http://localhost:8079"
    }
  },
  build: {
    outDir: "dist",
    // Single-page settings tool with no route-based split points; the whole
    // UI is needed up front, so one ~160kB gzipped bundle is the right shape.
    chunkSizeWarningLimit: 600
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
    include: ["src/__tests__/**/*.jsx"]
  }
});
