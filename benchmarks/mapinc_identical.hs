import Base
import Prelude hiding (map)

-- TEST VALUES

-- The natural number 20
n :: S_Nat
n = (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ s_zero))))))))))))))))))))

-- A string of 32 bits, all zeroes
zero :: S_Bits
zero = (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o s_z)))))))))))))))))))))))))))))))) 

-- A list with 100 strings of 32 bits, all zeroes
list :: S_List
list =
  (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero 
  (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero 
  (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero 
  (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero 
  (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero 
  (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero 
  (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero 
  (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero 
  (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero 
  (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero (s_cons zero 
    s_nil))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))

-- MAIN

-- Maps `inc` 2^20 times to `list`
main :: IO ()
main = print . s_List_to_Bits $ apply_pow2n_times n (map inc) list
