{-# LANGUAGE BangPatterns #-}

apply_n_times :: Int -> (a -> a) -> a -> a
apply_n_times 0 f x = x
apply_n_times n f x = apply_n_times (n - 1) f (f x)

list :: [Int]
list = replicate 100 0

map' :: (a -> b) -> [a] -> [b]
map' f []     = []
map' f (x:xs) = x' : xs'

   where
   !x'  = f x
   !xs' = map' f xs 

main :: IO ()
main = print $ apply_n_times (2^24) (map' (+ 1)) list