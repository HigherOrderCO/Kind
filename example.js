var fmc = require("./formality_core.js");

// Base code
var code = `
  Bool : Type
    self(P : (x : Bool) -> Type;) ->
    (t : P(true)) ->
    (f : P(false)) ->
    P(self)

  true : Bool
    (P;) => (t) => (f) => t

  false : Bool
    (P;) => (t) => (f) => f

  Nat : Type
    self(P : (x : Nat) -> Type;) ->
    (z : P(zero)) ->
    (s : (pred : Nat) -> P(succ(pred))) ->
    P(self)

  zero : Nat
    (P;) => (z) => (s) => z

  succ : (n : Nat) -> Nat
    (n) => (P;) => (z) => (s) => s(n)
    
  double : (n : Nat) -> Nat
    (n) => n((x) => Nat;)(zero)((pred) => succ(succ(double(pred))))

  case_bool
    : (b : Bool) ->
      (P : (x : Bool) -> Type;) ->
      (t : P(true)) ->
      (f : P(false)) ->
      P(b)
    (b) => (P;) => (t) => (f) => b(P;)(t)(f)

  fold_nat
    : (n : Nat) ->
      (P : (n : Nat) -> Type) ->
      (z : P(zero)) ->
      (s : (n : Nat) -> (i : P(n)) -> P(succ(n))) ->
      P(n)
    (n) => (P) => (z) => (s) =>
      n(P;)(z)((pred) => s(pred)(fold_nat(pred)(P;)(z)(s)))

  main : Nat
    let n = succ(succ(zero))
    let f = double
    double(n)
`;

// Parses module
var module = fmc.parse_mod(code, 0);

// Normalizes and type-checks all terms
for (var name in module) {
  console.log("name:", name);
  console.log("term:", fmc.stringify_trm(module[name].term));
  try {
    console.log("norm:", fmc.stringify_trm(fmc.normalize(module[name].term, module)));
  } catch (e) {
    console.log("norm:", fmc.stringify_trm(fmc.reduce(module[name].term, module)));
  }
  try {
    console.log("type:", fmc.stringify_trm(fmc.typecheck(module[name].term, module[name].type, module)));
  } catch (e) {
    console.log("type:", e);
  }
  console.log("");
};
