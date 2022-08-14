dbg();
dbg("hello");
dbg(1 + 1, () => {}, Symbol());
/** */ dbg(undefined);

let a = 5;
let b = Symbol();

dbg(a, b);
