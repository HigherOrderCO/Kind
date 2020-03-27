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

  Nat : Type
    (A : Type;) -> (z : A) -> (s : (x : Nat) -> A) -> A

  succ : (n : Nat) -> Nat
    (n) => (A;) => (z) => (s) => s(n)

  zero : Nat
    (A;) => (z) => (s) => z

  main : Nat
    succ(zero)
`;


// Parses module
var module = fmc.parse_mod(code, 0);

// Stringifies module
console.log(fmc.stringify_mod(module));

// Reduces `main` to normal form
var name = "true";
console.log(fmc.stringify_trm(fmc.normalize(module[name].term, module)));
console.log(fmc.stringify_trm(fmc.typecheck(module[name].term, module[name].type, module)));
