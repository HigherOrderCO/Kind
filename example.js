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

  main : Test
    ((A) => (B) => (C) => (x) => (y) => (z) => y)
    :: (A : Type) -> (B : Type) -> (C : Type) -> (x : A) -> (y : B) -> (z : C) -> A
`;

// Parses module
var module = fmc.parse_mod(code, 0);

// Stringifies module
console.log(fmc.stringify_mod(module));

// Reduces `main` to normal form
var main = fmc.find(module, x => x.name === "main").value.term;

console.log(fmc.stringify_trm(fmc.normalize(main)));
console.log(fmc.stringify_trm(fmc.typecheck(main)));
