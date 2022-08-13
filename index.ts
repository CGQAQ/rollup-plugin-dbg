import { parse } from "acorn";
import { simple } from "acorn-walk";
import MagicString from "magic-string";
import path, { join } from "node:path";

const safeEval = eval;

const fileRegex = /\.m?js$/;
let base: string | null = null;

function isBrowser(): boolean {
  return typeof window === "object" && typeof document === "object";
}

function isNode(): boolean {
  return typeof global === "object" && typeof require === "function";
}

declare const Deno: any;
function isDeno(): boolean {
  return typeof Deno === "object" && typeof Deno.version === "object";
}

function getInjectedString(
  file: string,
  line: number,
  column: number,
  args: string[]
): string {
  const relative = path.relative(base!, file);
  console.log("###", relative, line, column, args);
  if (isBrowser()) {
  } else if (isNode()) {
  } else if (isDeno()) {
  }

  const s = args.map((it) => `<${typeof safeEval(it)}>${it}`).join(", ");
  const b = `;console.log(\`[${relative}:${line}:${column}] [${s}]\`);`;
  console.log("b", b);
  return b;
}

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

    transform(src, id) {
      if (fileRegex.test(id)) {
        const parsed = parse(src, { ecmaVersion: "latest", locations: true });
        const m = new MagicString(src);

        simple(parsed, {
          CallExpression: (node) => {
            const { start, end, loc, callee, arguments: args } = node as any;
            const { line: startLine, column: startColumn } = loc.start;
            const { name: funcName } = callee;

            if (funcName === "dbg") {
              m.remove(start, end);
              m.appendRight(
                start,
                getInjectedString(
                  id,
                  startLine,
                  startColumn,
                  args.map(
                    (it) => it.raw || (src as string).slice(it.start, it.end)
                  )
                )
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

function inject() {}
