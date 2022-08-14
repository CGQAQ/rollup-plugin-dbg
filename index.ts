import { simple } from "acorn-walk";
import MagicString from "magic-string";
import path, { resolve } from "node:path";
import { readFileSync } from "node:fs";

const fileRegex = /\.(m?js|ts)$/;
let base: string | null = null;

const injectedString = readFileSync(resolve(__dirname, "dbg.js"))
  .toString()
  .replace("module.exports = dbg;", "");

export type DbgOptions = {
  projectRoot?: string;
};

export default function vitePluginDbg(config: DbgOptions) {
  const { projectRoot } = config || {};

  if (typeof projectRoot === "string") {
    base = projectRoot;
  }

  return {
    name: "vite-plugin-dbg",

    configResolved(resolved) {
      // vite only
      const { root } = resolved;
      if (typeof root === "string" && base == null) {
        base = root;
      }
    },

    banner() {
      return injectedString;
    },

    transform(src, id) {
      if (fileRegex.test(id)) {
        const parsed = this.parse(src, {
          locations: true,
        });
        const m = new MagicString(src);

        simple(parsed, {
          CallExpression: (node) => {
            const { start, end, loc, callee, arguments: args } = node as any;
            const { line: startLine, column: startColumn } = loc.start;
            const { name: funcName } = callee;

            if (funcName === "dbg") {
              const relative = path.relative(base!, id);

              const argPairs = [];
              args.forEach((it) => {
                const rawQuoted: string =
                  it.raw || '"' + (src as string).slice(it.start, it.end) + '"';
                const raw = rawQuoted.substring(1, rawQuoted.length - 1);

                if (it.type === "Identifier") {
                  argPairs.push(raw, rawQuoted);
                } else {
                  argPairs.push(`__safeEval(${rawQuoted})`, rawQuoted);
                }
              });

              m.remove(start, end);
              m.appendRight(
                start,
                `dbg("${relative}",${startLine},${startColumn},[${argPairs}])`
              );
            }
          },
        });

        return {
          code: m.toString(),
        };
      }
    },
  };
}
