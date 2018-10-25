-- NATIVE DATATYPES

-- Bitstring
data Bits : Type
| 0 : (x : Bits) -> Bits
| 1 : (x : Bits) -> Bits
| z : Bits

-- Natural Number
data Nat  : Type
| succ    : (x : Nat) -> Nat
| zero    : Nat

-- List of Bitstrings
data List : Type
| cons    : (x : Bits, xs : List) -> List
| nil     : List

-- LAMBDA-ENCODED DATATYPES

-- Bitstring
let S-Bits (P : Type, 0 : (bs : S-Bits) -> P, 1 : (bs : S-Bits) -> P, z : P) -> P
let S-z    (P : Type, 0 : (bs : S-Bits) -> P, 1 : (bs : S-Bits) -> P, z : P) => z
let S-0    (bs : S-Bits) => (P : Type, 0 : (x : S-Bits) -> P, 1 : (x : S-Bits) -> P, z : P) => 0(bs)
let S-1    (bs : S-Bits) => (P : Type, 0 : (x : S-Bits) -> P, 1 : (x : S-Bits) -> P, z : P) => 1(bs)

-- Natural Number
let S-Nat  (P : Type, s : (x : S-Nat) -> P, z : P) -> P
let S-zero (P : Type, s : (x : S-Nat) -> P, z : P) => z
let S-succ (n : S-Nat) => (P : Type, s : (x : S-Nat) -> P, z : P) => s(n)

-- List of Bitstrings
let S-List (P : Type, c : (x : S-Bits, xs : S-List) -> P, n : P) -> P
let S-nil  (P : Type, c : (x : S-Bits, xs : S-List) -> P, n : P) => n
let S-cons (x : S-Bits, xs : S-List) => (P : Type, c : (x : S-Bits, xs : S-List) -> P, n : P) => c(x, xs)

-- CONVERSIONS

-- Converts a lambda-encoded bitstring to a native bitstring
let S-Bits-to-Bits(bs : S-Bits) => bs((x : S-Bits) -> Bits,
  (bs : S-Bits, f : (bs : S-Bits) -> Bits) => Bits.0(f(bs)),
  (bs : S-Bits, f : (bs : S-Bits) -> Bits) => Bits.1(f(bs)),
  (f : (bs : S-Bits) -> Bits) => Bits.z,
  S-Bits-to-Bits)

-- Converts a lambda-encoded list to a native list
let S-List-to-List(xs : S-List) => xs(List,
  (x : S-Bool, xs : S-List) => List.cons(S-Bits-to-Bits(x), S-List-to-List(xs)),
  List.nil)

-- FUNCTIONS

-- Increments a bitstring by 1
let inc(bs : S-Bits) =>
  (P : Type, 0 : (bs : S-Bits) -> P, 1 : (bs : S-Bits) -> P, z : P) =>
    bs(S-Bits, 1, (bs : S-Bits) => 0(inc(bs)), z)
    
-- Maps a function over a list
let map(f : (x : S-Bool) -> S-Bool, xs : S-List) =>
  (P : Type, c : (x : S-Bool, xs : S-List) -> P, n : P) =>
    xs(S-List, (x : S-Bool, xs : List) => copy f as g, h in c(g(x), map(h, xs)), n)

-- Applies a function 2^n times to a value
let apply-pow2n-times(n : S-Nat) =>
  n((f : (x : S-List) -> S-List, x : S-List) -> S-List,
    (n : S-List, f : (x : S-List) -> S-List) => copy f as g, h in apply-pow2n-times(n, (x : S-List) => g(h(x))),
    (f : (x : S-List) -> S-List, x : S-List) => f(x))

