import { defineConfig } from "vite";
import Dbg from "../..";

export default defineConfig({
  mode: "development",
  plugins: [Dbg()],
  build: {
    outDir: "dist",
    lib: {
      entry: "index.js",
      name: "example",
    },
  },
});
