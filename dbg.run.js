const dbg = require("./dbg");

const a = () => {
  console.log("hello");
};

// dbg("index.js", 1, 5, ["1 + 1", "() => { console.log(hello) }", "Symbol()"]);
// dbg("index.js", 1, 5, ["1 + 1", "[]", "a"]);
dbg("index.js", 1, 5, [a, "a"]);
