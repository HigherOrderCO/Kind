-- This is just a quick example to address a feedback on /r/haskell and point
-- that using native ints and lists does NOT make a difference! The reason I
-- used Scott encodings in both is that I believe we should test identical
-- programs, otherwise we'd not be evaluating how well compilers deal with the
-- same programs! We can have other benchmarks to test different things, but
-- they should always be identical.

list :: [Int]
list = map (const 0) [0..1000]

apply_pow2n_times :: Int -> ([Int] -> [Int]) -> [Int] -> [Int]
apply_pow2n_times 0 f x = f x
apply_pow2n_times n f x = apply_pow2n_times (n - 1) (\ x -> f (f x)) x

main :: IO ()
main = print $ apply_pow2n_times 20 (map (+ 1)) list
