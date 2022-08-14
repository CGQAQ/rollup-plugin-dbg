# rollup-plugin-db

## This plugin is also compatible with vite

### use with rollup

```js
import { defineConfig } from "rollup";
import config from "./package.json";
import PluginDbg from "rollup-plugin-dbg";

export default defineConfig({
  plugins: [PluginDbg({ projectRoot: __dirname })],
  input: "./index.js",
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
```

### use with vite

```js
import { defineConfig } from "vite";
import PluginDbg from "rollup-plugin-dbg";

export default defineConfig({
  mode: "development",
  plugins: [Dbg()], // do not need projectRoot when using with vite
  build: {
    outDir: "dist",
    lib: {
      entry: "index.js",
      name: "example",
    },
  },
});
```
