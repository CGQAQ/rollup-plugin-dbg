# vite-plugin-db

```js
dbg();
dbg("hello");
dbg(1 + 1, () => {}, Symbol());
/** */ dbg(undefined);
```

will compile to

```js
console.log("[index.js:1:0] []");
console.log('[index.js:2:0] [<string>"hello"]');
console.log("[index.js:3:0] [<number>1 + 1, <function>() => {}, <symbol>Symbol()]");
console.log("[index.js:4:7] [<undefined>undefined]");
```
