import Base
import Prelude hiding (map)

main :: IO ()
main = print . to_List $ apply_pow2n_times n24 (map inc) list_with_100_zeros
