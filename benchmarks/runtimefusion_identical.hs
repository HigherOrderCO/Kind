import Base
import Prelude hiding (map)

main :: IO ()
main = print . to_List $ apply_pow2n_times n20 (map inc) list_with_100_zeros
