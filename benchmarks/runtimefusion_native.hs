apply_n_times :: Int -> (a -> a) -> a -> a
apply_n_times 0 f x = x
apply_n_times n f x = apply_n_times (n - 1) f (f x)

list :: [Int]
list = map (const 0) [0..100]

main :: IO ()
main = print $ apply_n_times (2^20) (map (+ 1)) list
