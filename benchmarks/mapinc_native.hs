list :: [Int]
list = map (const 0) [0..100]

apply_pow2n_times :: Int -> ([Int] -> [Int]) -> [Int] -> [Int]
apply_pow2n_times 0 f x = f x
apply_pow2n_times n f x = apply_pow2n_times (n - 1) (\ x -> f (f x)) x

main :: IO ()
main = print $ apply_pow2n_times 20 (map (+ 1)) list
