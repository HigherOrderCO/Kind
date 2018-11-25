-- Applies map to a list 1m times using native Haskell lists
-- Run with: `ghc -O2 faster_than_ghc_ex0.haskell1.hs -o run; time ./run`
-- Run time: 0m22.159s (on 2016 Macbook Pro 13")

-- Applies a function N times (there is a sugar for that in Formality)
times :: Int -> (a -> a) -> a -> a
times 0 f x = x
times n f x = times (n - 1) f (f x)

-- List with 1000 falses
list :: [Bool]
list = times 100 (False :) []

main :: IO ()
main = print $ times 1000000 (map not) list
