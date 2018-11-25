-- Applies map to a list 1m times using Formality datatypes
-- Run with: `time formality -f main faster_than_ghc_ex0.formality.hs`
-- Run time: 0m0.026s (on 2016 Macbook Pro 13")
-- This is faster than GHC because of "runtime fusion" of `map`

-- Booleans
data Bool : Type
| true  : Bool
| false : Bool

-- Lists
data List<A : Type> : Type
| cons : (x : A, xs : List) -> List
| nil  : List

-- Boolean negation
let not(b : Bool) => Bool{
  case b -> Bool
  | true  => false
  | false => true
}

-- Maps a function over a list
let map(A : Type, B : Type, f : (x : A) -> B, xs : List<A>) => List<B>{
  case xs       -> List<B>
  | cons(x, xs) => copy f as f_a, f_b in cons(f_a(x), map(A, B, f_b, xs))
  | nil         => nil
}

-- Identity function for lists of bools
let id(xs : List<Bool>) =>
  case xs       -> List<Bool>
  | cons(x, xs) => List<Bool>.cons((case x -> Bool | true => Bool.true | false => Bool.false), fold(xs))
  | nil         => List<Bool>.nil

-- List with 100 falses
let list
  100(List<Bool>, List<Bool>.cons(Bool.false), List<Bool>.nil)

let main
  id(1000000000(List<Bool>, map(Bool, Bool, not), list))
