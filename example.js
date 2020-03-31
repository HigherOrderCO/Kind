var fmc = require("./FormalityCore.js");
var code = `
Bool : Type
  self{P : (x : Bool) -> Type} ->
  (t : P(true)) ->
  (f : P(false)) ->
  P(self)

true : Bool
  {P} => (t) => (f) => t

false : Bool
  {P} => (t) => (f) => f

Nat : Type
  self{P : (x : Nat) -> Type} ->
  (z : P(zero)) ->
  (s : (pred : Nat) -> P(succ(pred))) ->
  P(self)

zero : Nat
  {P} => (z) => (s) => z

succ : (n : Nat) -> Nat
  (n) => {P} => (z) => (s) => s(n)

Bits : Type
  self{P : (x : Bits) -> Type} ->
  (be : P(be)) ->
  (b0 : (pred : Bits) -> P(b0(pred))) ->
  (b1 : (pred : Bits) -> P(b1(pred))) ->
  P(self)

be : Bits
  {P} => (be) => (b0) => (b1) => be

b0 : (bs : Bits) -> Bits
  (bs) => {P} => (be) => (b0) => (b1) => b0(bs)

b1 : (bs : Bits) -> Bits
  (bs) => {P} => (be) => (b0) => (b1) => b1(bs)

Word : (size : Nat) -> Type
  (size) =>
  self{P : (size: Nat) -> (x : Word(size)) -> Type} ->
  (we : P(zero)(we)) ->
  (w0 : (size : Nat) -> (pred : Word(size)) -> P(succ(size))(w0(size)(pred))) ->
  (w1 : (size : Nat) -> (pred : Word(size)) -> P(succ(size))(w1(size)(pred))) ->
  P(size)(self)

we : Word(zero)
  {P} => (we) => (w0) => (w1) =>
  we

w0 : (size : Nat) -> (ws : Word(size)) -> Word(succ(size))
  (size) => (ws) => {P} => (we) => (w0) => (w1) =>
  w0(size)(ws)

w1 : (size : Nat) -> (ws : Word(size)) -> Word(succ(size))
  (size) => (ws) => {P} => (we) => (w0) => (w1) =>
  w1(size)(ws)

double : (n : Nat) -> Nat
  (n) => n{(x) => Nat}(zero)((pred) => succ(succ(double(pred))))

case_bool
  : (b : Bool) ->
    (P : (x : Bool) -> Type;) ->
    (t : P(true)) ->
    (f : P(false)) ->
    P(b)
  (b) => {P} => (t) => (f) => b{P}(t)(f)

fold_nat
  : (n : Nat) ->
    (P : (n : Nat) -> Type;) ->
    (z : P(zero)) ->
    (s : (n : Nat) -> (i : P(n)) -> P(succ(n))) ->
    P(n)
  (n) => (P;) => (z) => (s) =>
  n{P}(z)((pred) => s(pred)(fold_nat(pred){P}(z)(s)))

main : Word(succ(succ(zero)))
  w0(succ(zero))(w1(zero)(we))
`;

process.argv.forEach((val,index) => {
   console.log(`${index}: ${val}`);
});

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
