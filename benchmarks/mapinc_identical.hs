import Base
import Prelude hiding (map)

-- A list with 100 strings of 32 bits, all zeroes
list :: S_List
list =
  (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero 
  (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero 
  (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero 
  (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero 
  (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero 
  (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero 
  (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero 
  (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero 
  (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero 
  (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero (s_cons u32_zero 
    s_nil))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))

-- MAIN

-- Maps `inc` 2^20 times to `list`
main :: IO ()
main = print . s_List_to_Bits $ apply_pow2n_times n20 (map inc) list
