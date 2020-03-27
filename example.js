var fmc = require("./formality_core.js");

// Base code
var code = `
  Bool : Type
    self(P : (x : Bool) -> Type;) -> (t : P(true)) -> (f : P(false)) -> P(self)

  true : Bool
    (P;) => (t) => (f) => t

  false : Bool
    (P;) => (t) => (f) => f

  elim : (b : Bool) -> (P : (x : Bool) -> Type;) -> (t : P(true)) -> (f : P(false)) -> P(b)
    (b) => (P;) => (t) => (f) => b(P;)(t)(f)
`;

// Parses module
var module = fmc.parse_mod(code, 0);

// Stringifies module
console.log(fmc.stringify_mod(module));

// Reduces `main` to normal form
var name = "elim";
console.log("term:", fmc.stringify_trm(module[name].term));
console.log("norm:", fmc.stringify_trm(fmc.normalize(module[name].term, module)));
console.log("type:", fmc.stringify_trm(fmc.typecheck(module[name].term, module[name].type, module)));
