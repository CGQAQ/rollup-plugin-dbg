import { defineConfig } from "rollup";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

import config from "./package.json";

export default defineConfig({
  input: "./index.ts",
  plugins: [typescript(), nodeResolve(), commonjs()],

  output: [
    {
      file: config.exports["."].import,
      format: "es",
    },
    {
      file: config.exports["."].require,
      format: "commonjs",
      exports: "auto",
    },
  ],
});
