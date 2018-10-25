import Base
import Prelude hiding (length)

main :: IO ()
main = print $ s_Bits_to_Bits (length (apply_pow2n_times n20 (s_cons s_z) s_nil))
