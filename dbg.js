const __safeEval = function (raw) {
  const __eval = eval; /* bypass eval warnings */
  function format(value, raw) {
    const ty = typeof value;
    if (ty === "symbol") {
      return value.toString();
    } else if (Array.isArray(value)) {
      return `[${value.toString()}]`;
    } else if (ty === "function") {
      return raw;
    }

    return value;
  }

  try {
    return format(__eval(raw), raw);
  } catch {
    return raw;
  }
};

function dbg(file, line, column, args) {
  function isBrowser() {
    return typeof window === "object" && typeof document === "object";
  }
  function isNode() {
    return (
      typeof global === "object" && typeof global.process.versions === "object"
    );
  }
  function isDeno() {
    return typeof Deno === "object" && typeof Deno.version === "object";
  }

  function toPairs(arr) {
    const _arr = arr;
    const result = [];
    let tmp;
    while ((tmp = [_arr.shift(), _arr.shift()]) && tmp[0] != undefined) {
      result.push(tmp);
    }
    return result;
  }

  if (isBrowser() || isDeno()) {
    const styledOutput = toPairs(args).map(
      ([val, raw]) => `%c<${typeof val}>%c${raw}%c = ${val}`
    );

    const colors = styledOutput
      .map((_) => ["color:blud", "color: white"])
      .flat();

    console.log(
      `%c[${file}:${line}:${column}] %c[\n${styledOutput.join(",\n")}%c]`,
      "color:gray",
      "color:lightgray",
      ...colors,
      "color:lightgray"
    );
    return;
  } else if (isNode()) {
    const ansiOutput = toPairs(args)
      .map(([val, raw]) => {
        return `\t\u001b[38;5;4m<${typeof val}>\u001b[m\u001b[38;5;5m${raw}\u001b[m = \u001b[38;5;14m${val}\u001b[m`;
      })
      .join(",\n");
    let output = `\u001b[38;5;8m[${file}:${line}:${column}]\u001b[m []`;
    if (ansiOutput.length === 0) {
      output;
    } else if (ansiOutput.length === 1) {
      output = `\u001b[38;5;8m[${file}:${line}:${column}]\u001b[m [${ansiOutput}]`;
    } else {
      output = `\u001b[38;5;8m[${file}:${line}:${column}]\u001b[m [\n${ansiOutput}\n]`;
    }

    console.log(output);
    return;
  }

  console.log(`[${file}:${line}:${column}] [${s}]`);
}

module.exports = dbg;
