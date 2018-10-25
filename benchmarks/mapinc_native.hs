list :: [Int]
list = map (const 0) [0..100]

apply_n_times :: Int -> ([Int] -> [Int]) -> [Int] -> [Int]
apply_n_times 0 f x = x
apply_n_times n f x = apply_n_times (n - 1) f (f x)

main :: IO ()
main = print $ apply_n_times (2^20) (map (+ 1)) list
