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

-- VALUES

-- Some natural numbers
let n0 S-zero
let n1 S-succ(S-zero)
let n2 S-succ(S-succ(S-zero))
let n3 S-succ(S-succ(S-succ(S-zero)))
let n4 S-succ(S-succ(S-succ(S-succ(S-zero))))
let n5 S-succ(S-succ(S-succ(S-succ(S-succ(S-zero)))))
let n6 S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-zero))))))
let n7 S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-zero)))))))
let n8 S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-zero))))))))
let n9 S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-zero)))))))))
let n10 S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-zero))))))))))
let n11 S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-zero)))))))))))
let n12 S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-zero))))))))))))
let n13 S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-zero)))))))))))))
let n14 S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-zero))))))))))))))
let n15 S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-zero)))))))))))))))
let n16 S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-zero))))))))))))))))
let n17 S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-zero)))))))))))))))))
let n18 S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-zero))))))))))))))))))
let n19 S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-zero)))))))))))))))))))
let n20 S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-zero))))))))))))))))))))
let n21 S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-zero)))))))))))))))))))))
let n22 S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-succ(S-zero))))))))))))))))))))))

-- A string of 32 bits, all zeroes
let u32-zero S-0(S-0(S-0(S-0(S-0(S-0(S-0(S-0(S-0(S-0(S-0(S-0(S-0(S-0(S-0(S-0(S-0(S-0(S-0(S-0(S-0(S-0(S-0(S-0(S-0(S-0(S-0(S-0(S-0(S-0(S-0(S-0(S-z)))))))))))))))))))))))))))))))) 

-- A list with 100 strings of 32 bits, all zeroes
let list-with-100-zeros
  S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, 
  S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, 
  S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, 
  S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, 
  S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, 
  S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, 
  S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, 
  S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, 
  S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, 
  S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, 
    S-nil))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))

-- CONVERSIONS

-- Converts a lambda-encoded bitstring to a native bitstring
let to-Bits(bs : S-Bits) => bs((x : S-Bits) -> Bits,
  (bs : S-Bits, f : (bs : S-Bits) -> Bits) => Bits.0(f(bs)),
  (bs : S-Bits, f : (bs : S-Bits) -> Bits) => Bits.1(f(bs)),
  (f : (bs : S-Bits) -> Bits) => Bits.z,
  to-Bits)

-- Converts a lambda-encoded list to a native list
let to-List(xs : S-List) => xs(List,
  (x : S-Bool, xs : S-List) => List.cons(to-Bits(x), to-List(xs)),
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

-- Applies a function 2^n times to a value
let apply-pow2n-times-bits(n : S-Nat) =>
  n((f : (x : S-Bits) -> S-Bits, x : S-Bits) -> S-Bits,
    (n : S-Bits, f : (x : S-Bits) -> S-Bits) => copy f as g, h in apply-pow2n-times-bits(n, (x : S-Bits) => g(h(x))),
    (f : (x : S-Bits) -> S-Bits, x : S-Bits) => f(x))

-- Doubles the size of a list
let double-size(xs : S-List) =>
  xs(S-List,
    (x : S-Bits, xs : S-List) => copy x as y, z in S-cons(y, S-cons(z, double-size(xs))),
    S-nil)

-- Computes the length of a list
let length(xs : S-List) =>
  let length-aux(xs : S-List) =>
    xs((x : S-Bits) -> S-Bits,
      (x : S-Bits, xs : S-List, r : S-Bits) => length-aux(xs, inc(r)),
      (r : S-Bits) => r)
  length-aux(xs, u32-zero)

-- Flips every bit of a bitstring. Not fusible, in order to force it
-- pattern-matches as many times as expected without being optimized away
let flip-unfusible(bs : S-Bits) => bs((x : S-Bits) -> Bits,
  (bs : S-Bits, f : (bs : S-Bits) -> S-Bits) => S-1(f(bs)),
  (bs : S-Bits, f : (bs : S-Bits) -> S-Bits) => S-0(f(bs)),
  (f : (bs : S-Bits) -> S-Bits) => S-z,
  flip-unfusible)
