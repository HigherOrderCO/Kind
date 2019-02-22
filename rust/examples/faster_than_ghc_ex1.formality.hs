-- Increments a number 200m times using Formality datatypes
-- Run with: `time formality -f main faster_than_ghc_ex1.formality.hs`
-- Run time: 0m0.013s (on 2016 Macbook Pro 13")
-- This is faster than GHC because of "runtime fusion" of `inc`

-- Arbirary precision unsigned integer
data Uint : Type
| O : (n : Uint) -> Uint
| I : (n : Uint) -> Uint
| Z : Uint

-- Increments an Uint by 1
let inc(n : Uint) => Uint{
  case n -> Uint
  | O(n) => I(n)
  | I(n) => O(inc(n))
  | Z    => Z
}

-- Recursive identity function for Uint
let id(n : Uint) =>
  case n -> Uint
  | O(n) => Uint.O(fold(n))
  | I(n) => Uint.I(fold(n))
  | Z    => Uint.Z

-- Zero
let zero
  32(Uint, Uint.O, Uint.Z)

-- Increments it 200 million times
let main
  inc(zero)
