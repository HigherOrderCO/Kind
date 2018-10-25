import base

-- A list with 100 strings of 32 bits, all zeroes
let list
  S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, 
  S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, 
  S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, 
  S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, 
  S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, 
  S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, 
  S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, 
  S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, 
  S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, 
  S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, S-cons(u32-zero, 
    S-nil))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))

-- MAIN

-- Maps `inc` 2^20 times to `list`
let main S-List-to-List(apply-pow2n-times(n20, map(inc), list))
