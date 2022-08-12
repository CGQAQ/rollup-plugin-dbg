import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    lib: {
      entry: "./index.ts",
      formats: ["es", "umd"],
      name: "vite-plugin-dbg",
    },
  },
});
