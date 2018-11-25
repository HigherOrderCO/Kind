-- Increments a number 200m times using native Haskell Integers
-- Run with: `ghc -O2 faster_than_ghc_ex1.haskell1.hs -o run; time ./run`
-- Run time: 0m1.491s (on 2016 Macbook Pro 13")

-- Applies a function N times (there is a sugar for that in Formality)
times :: Int -> (a -> a) -> a -> a
times 0 f x = x
times n f x = times (n - 1) f (f x)

-- Increments it 200 million times
main :: IO ()
main = print $ times 200000000 (+ 1) (0 :: Integer)
