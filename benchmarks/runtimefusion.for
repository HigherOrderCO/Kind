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

-- VALUES

-- Some natural numbers
let n0  Nat.zero
let n1  Nat.succ(n0)
let n2  Nat.succ(n1)
let n3  Nat.succ(n2)
let n4  Nat.succ(n3)
let n5  Nat.succ(n4)
let n6  Nat.succ(n5)
let n7  Nat.succ(n6)
let n8  Nat.succ(n6)
let n9  Nat.succ(n7)
let n10 Nat.succ(n8)
let n11 Nat.succ(n9)
let n12 Nat.succ(n10)
let n13 Nat.succ(n11)
let n14 Nat.succ(n12)
let n15 Nat.succ(n13)
let n16 Nat.succ(n14)
let n17 Nat.succ(n15)
let n18 Nat.succ(n16)
let n19 Nat.succ(n17)
let n20 Nat.succ(n18)
let n21 Nat.succ(n19)
let n22 Nat.succ(n20)
let n23 Nat.succ(n21)
let n24 Nat.succ(n22)

let main
  n24
