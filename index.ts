import { relative } from "node:path";
import { fileURLToPath as fromFileUrl } from "node:url";
import chalk from "chalk";
const { yellow, blue, gray } = chalk;

const fileRegex = /\.(m?js|ts|jsx|tsx)$/;

export default function vitePluginDbg() {
  return {
    name: "vite-plugin-dbg",

    transform(src, id) {
      if (fileRegex.test(id)) {
        console.log("src", src);

        return {
          code: "123",
          map: null, // provide source map if available
        };
      }
    },
  };
}

function inject() {}

let warn = (msg: string) => {
  console.warn(msg);
  warn = () => {};
};

export function dbg<T>(value: T): T {
  try {
    throw new Error();
  } catch (err) {
    const stackFrames = (err as Error).stack!.split("\n");
    let fn = "";
    let file: string;
    let line: string;
    let col: string;

    if (stackFrames.length > 3) {
      [, fn, file, line, col] = stackFrames[2].match(
        /at (\S*) \((.*?)\:(\d+)\:(\d+)\)/
      )!;
    } else if (stackFrames.length === 3) {
      [, file, line, col] = stackFrames[2].match(/at (.*?)\:(\d+)\:(\d+)/)!;
    } else {
      // unreachable
      throw new Error("Could not find stack frame");
    }

    if (file.startsWith("file://")) {
      file = fromFileUrl(file);
      try {
        file = relative(".", file);
      } catch (err) {
        if ((err as Error).name === "PermissionDenied") {
          warn(
            yellow(
              `No read access to <CWD>, use full path. Or run again with ${blue(
                "--allow-read"
              )}. See https://github.com/justjavac/deno_dbg#read-permission`
            )
          );
        }
      }
    }

    console.debug(
      "%s %s %s",
      gray(`[${file}:${line}:${col}${fn ? ` (${fn})` : ""}]`),
      value,
      blue(`(${typeof value})`)
    );

    return value;
  }
}
