-- Applies map to a list 1m times using the same algorithm as Formality
-- Run with: `ghc -O2 faster_than_ghc_ex0.haskell0.hs -o run; time ./run`
-- Run time: 0m21.437s (on 2016 Macbook Pro 13")

import Prelude hiding (Bool, True, False, id, map, not)

-- Applies a function N times (there is a sugar for that in Formality)
times :: Int -> (a -> a) -> a -> a
times 0 f x = x
times n f x = times (n - 1) f (f x)

-- Booleans
data Bool
  = True
  | False
  deriving Show

-- Lists
data List a
  = Cons a (List a)
  | Nil
  deriving Show

-- Boolean negation
not :: Bool -> Bool
not b = case b of
  True  -> False
  False -> True

-- Maps a function over a list
map :: (a -> b) -> List a -> List b
map f xs = case xs of
  Cons x xs -> Cons (f x) (map f xs)
  Nil       -> Nil

-- Identity function for lists of bools
id :: List Bool -> List Bool
id xs = case xs of
  Cons x xs -> Cons (case x of { True -> True; False -> False}) (id xs)
  Nil       -> Nil

-- List with 1000 falses
list :: List Bool
list = times 100 (Cons False) Nil

main :: IO ()
main = print $ id (times 1000000 (map not) list)
