function APPLY(f, x) {
  switch (x.length) {
    case 0: return f;
    case 1: console.log("a"); return f(x.x0);
    case 2: return f(x.x0)(x.x1);
    case 3: return f(x.x0)(x.x1)(x.x2);
    case 4: return f(x.x0)(x.x1)(x.x2)(x.x3);
    case 5: return f(x.x0)(x.x1)(x.x2)(x.x3)(x.x4);
    case 6: return f(x.x0)(x.x1)(x.x2)(x.x3)(x.x4)(x.x5);
    case 7: return f(x.x0)(x.x1)(x.x2)(x.x3)(x.x4)(x.x5)(x.x6);
    case 8: return f(x.x0)(x.x1)(x.x2)(x.x3)(x.x4)(x.x5)(x.x6)(x.x7);
    default:
      for (let i = 0; i < x.length; i++) {
        f = f(x['x' + i]);
      }
      return f;
  }
}

Nat = null;
Nat_double = (x => {
  switch (x.$) {
    case "zero":
      return APPLY({$: "zero", length: 0}, x);
    case "succ":
      return APPLY((pred$0 => ({$: "succ", length: 1, x0: {$: "succ", length: 1, x0: (Nat_double)(pred$0)}})), x);
  }
});

main = (Nat_double)({$: "succ", length: 1, x0: {$: "succ", length: 1, x0: {$: "zero", length: 0}}});

console.log(JSON.stringify(main));
