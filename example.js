var fmc = require("./formality_core.js");

var mod = fmc.parse_mod(`
  Bool : Type
    (A : Type;) -> (t : A) -> (f : A) -> A

  true : Bool
    (A;) => (t) => (f) => t

  false : Bool
    (A;) => (t) => (f) => f
`, 0);

console.log(fmc.stringify_mod(mod));
