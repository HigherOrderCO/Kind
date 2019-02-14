-- Increments a number 200m times using the same algorithm as Formality
-- Run with: `ghc -O2 faster_than_ghc_ex1.haskell0.hs -o run; time ./run`
-- Run time: 2m7.295s (on 2016 Macbook Pro 13")

import Prelude hiding (id)

-- Applies a function N times (there is a sugar for that in Formality)
times :: Int -> (a -> a) -> a -> a
times 0 f x = x
times n f x = times (n - 1) f (f x)

-- Arbirary precision unsigned integer
data Uint
  = O Uint
  | I Uint
  | Z
  deriving Show

-- Increments an Uint by 1
inc :: Uint -> Uint
inc bs = case bs of
  (O bs) -> I bs
  (I bs) -> O (inc bs) 
  Z      -> Z

-- Recursive identity function for Uint
id :: Uint -> Uint
id bs = case bs of
  (O bs) -> O (id bs)
  (I bs) -> I (id bs)
  Z      -> Z
  
-- Zero
zero :: Uint
zero = times 32 O Z

-- Increments it 200 million times
main :: IO ()
main = print $ id (times 200000000 inc zero)
