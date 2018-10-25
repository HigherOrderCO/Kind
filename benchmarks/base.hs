{-# LANGUAGE RankNTypes #-}

module Base where

import Prelude hiding (Bool, True, False, not, map, id)

-- NATIVE DATATYPES

-- Bitstring
data Bits
  = O Bits
  | I Bits
  | Z
  deriving Show

-- Natural Number
data Nat
  = Succ Nat 
  | Zero
  deriving Show

-- List of Bitstrings
data List 
  = Cons Bits List
  | Nil
  deriving Show

-- LAMBDA-ENCODED DATATYPES

-- Bitstring
newtype S_Bits = S_Bits (forall p . (S_Bits -> p) -> (S_Bits -> p) -> p -> p)
s_o bs         = S_Bits (\ o i z -> o bs)
s_i bs         = S_Bits (\ o i z -> i bs)
s_z            = S_Bits (\ o i z -> z)

-- Natural Number
newtype S_Nat = S_Nat (forall p . (S_Nat -> p) -> p -> p)
s_zero        = S_Nat (\ s z -> z)
s_succ n      = S_Nat (\ s z -> s n) 

-- List of Bitstrings
newtype S_List = S_List (forall p . (S_Bits -> S_List -> p) -> p -> p)
s_nil          = S_List (\ c n -> n)
s_cons x xs    = S_List (\ c n -> c x xs)

-- CONVERSIONS

-- Converts a lambda-encoded bitstring to a native bitstring
to_Bits :: S_Bits -> Bits 
to_Bits (S_Bits bs) = (bs
  (\ bs f -> O (f bs))
  (\ bs f -> I (f bs))
  (\ f -> Z)
  to_Bits)

-- Converts a lambda-encoded list to a native list
to_List :: S_List -> List
to_List (S_List xs) = xs (\x xs -> Cons (to_Bits x) (to_List xs)) Nil

-- VALUES

-- Some natural numbers
n0 = s_zero
n1 = (s_succ s_zero)
n2 = (s_succ (s_succ s_zero))
n3 = (s_succ (s_succ (s_succ s_zero)))
n4 = (s_succ (s_succ (s_succ (s_succ s_zero))))
n5 = (s_succ (s_succ (s_succ (s_succ (s_succ s_zero)))))
n6 = (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ s_zero))))))
n7 = (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ s_zero)))))))
n8 = (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ s_zero))))))))
n9 = (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ s_zero)))))))))
n10 = (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ s_zero))))))))))
n11 = (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ s_zero)))))))))))
n12 = (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ s_zero))))))))))))
n13 = (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ s_zero)))))))))))))
n14 = (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ s_zero))))))))))))))
n15 = (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ s_zero)))))))))))))))
n16 = (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ s_zero))))))))))))))))
n17 = (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ s_zero)))))))))))))))))
n18 = (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ s_zero))))))))))))))))))
n19 = (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ s_zero)))))))))))))))))))
n20 = (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ s_zero))))))))))))))))))))
n21 = (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ s_zero)))))))))))))))))))))
n22 = (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ (s_succ s_zero))))))))))))))))))))))

-- A string of 32 bits, all zeroes
u32_zero :: S_Bits
u32_zero = (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o (s_o s_z)))))))))))))))))))))))))))))))) 

-- A list with 100 strings of 32 bits, all zeroes
list_with_100_zeros :: S_List
list_with_100_zeros =
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

-- FUNCTIONS

-- Increments a bitstring by 1
inc :: S_Bits -> S_Bits
inc (S_Bits bs) = S_Bits $ \ o i z ->
  bs i (\ bs -> o(inc(bs))) z

-- Maps a function over a list
map :: (S_Bits -> S_Bits) -> S_List -> S_List
map f (S_List xs) =
  S_List (\ c n ->
    xs (\x xs -> c (f x) (map f xs)) n)

-- Applies a function 2^n times to a value
apply_pow2n_times :: S_Nat -> (S_List -> S_List) -> S_List -> S_List
apply_pow2n_times (S_Nat n) = n
  (\ n f -> apply_pow2n_times n (\ x -> f (f x)))
  (\ f x -> f x)

-- Applies a function 2^n times to a value
apply_pow2n_times_bits :: S_Nat -> (S_Bits -> S_Bits) -> S_Bits -> S_Bits
apply_pow2n_times_bits (S_Nat n) = n
  (\ n f -> apply_pow2n_times_bits n (\ x -> f (f x)))
  (\ f x -> f x)

-- Doubles the size of a list
double_size :: S_List -> S_List
double_size (S_List xs) = xs (\x xs -> s_cons x (s_cons x (double_size xs))) s_nil

-- Computes the length of a list
length :: S_List -> S_Bits
length xs = length_aux xs u32_zero where
  length_aux :: S_List -> S_Bits -> S_Bits
  length_aux (S_List xs) = xs (\ x xs r -> length_aux xs (inc r)) (\ r -> r)

-- Flips every bit of a bitstring. Not fusible, in order to force it
-- pattern-matches as many times as expected without being optimized away
flip_unfusible :: S_Bits -> S_Bits 
flip_unfusible (S_Bits bs) = (bs
  (\ bs f -> s_i (f bs))
  (\ bs f -> s_o (f bs))
  (\ f -> s_z)
  flip_unfusible)
