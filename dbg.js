function __safeEval(raw) {
  const __eval = eval; /* bypass eval warnings */

  try {
    return __eval(raw);
  } catch {
    return raw;
  }
}

function __format(value, raw) {
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
    const _arr = [...arr];
    const result = [];
    let tmp;
    while ((tmp = [_arr.shift(), _arr.shift()]) && tmp[1] != undefined) {
      result.push(tmp);
    }
    return result;
  }

  let pairs = toPairs(args);

  if (isBrowser() || isDeno()) {
    const styledOutput = pairs.map(
      ([val, raw]) =>
        `\t%c<${typeof val}>%c${raw}%c = %c${__format(val, raw)}%c`
    );

    const colors = styledOutput
      .map((_) => [
        "color:blue",
        "color:purple",
        "color:lightgray",
        "color:green",
        "color:lightgray",
      ])
      .flat();

    if (styledOutput.length === 0) {
      console.log(
        `%c[${file}:${line}:${column}] %c[]`,
        "color:gray",
        "color:lightgray"
      );
    } else if (styledOutput.length === 1) {
      const pair = styledOutput[0];
      console.log(
        `%c[${file}:${line}:${column}] %c[${pair.trimStart()}%c]`,
        "color:gray",
        "color:lightgray",
        ...colors,
        "color:lightgray"
      );
    } else {
      console.log(
        `%c[${file}:${line}:${column}] %c[\n${styledOutput.join(",\n")}%c\n]`,
        "color:gray",
        "color:lightgray",
        ...colors,
        "color:lightgray"
      );
    }

    return;
  } else if (isNode()) {
    const ansiOutput = pairs.map(([val, raw]) => {
      return `\t\u001b[38;5;4m<${typeof val}>\u001b[m\u001b[38;5;5m${raw}\u001b[m = \u001b[38;5;14m${__format(
        val,
        raw
      )}\u001b[m`;
    });
    let output = "";
    if (ansiOutput.length === 0) {
      output = `\u001b[38;5;8m[${file}:${line}:${column}]\u001b[m []`;
    } else if (ansiOutput.length === 1) {
      const pair = ansiOutput[0];
      output = `\u001b[38;5;8m[${file}:${line}:${column}]\u001b[m [${pair.trimStart()}]`;
    } else {
      output = `\u001b[38;5;8m[${file}:${line}:${column}]\u001b[m [\n${ansiOutput.join(
        ",\n"
      )}\n]`;
    }

    console.log(output);
    return;
  }

  // fallback NOCOLOR
  console.log(
    `[${file}:${line}:${column}] [${pairs.map(
      ([val, raw]) => `<${typeof val}>${raw} = ${__format(val, raw)}`
    )}]`
  );
}

module.exports = dbg;
