var fmc = require("./formality_core.js");

// Base code
var code = `
  Bool : Type
    (A : Type;) -> (t : A) -> (f : A) -> A

  true : Bool
    (A;) => (t) => (f) => t

  false : Bool
    (A;) => (t) => (f) => f

  not : (b : Bool) -> Bool
    (A;) => (t) => (f) => b(Bool;)(f)(t)

  main : TempTest
    ((f) => (x) => f(f(x)))((f) => (x) => f(f(x)))
`;

// Parses module
var module = fmc.parse_mod(code, 0);

// Stringifies module
console.log(fmc.stringify_mod(module));

// Reduces `main` to normal form
console.log(fmc.stringify_trm(fmc.normalize(fmc.find("main", module).term)));
