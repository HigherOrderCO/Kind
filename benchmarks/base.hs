{-# LANGUAGE RankNTypes #-}

module Base where

import Prelude hiding (Bool, True, False, not, map)

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
s_Bits_to_Bits :: S_Bits -> Bits 
s_Bits_to_Bits (S_Bits bs) = (bs
  (\ bs f -> O (f bs))
  (\ bs f -> I (f bs))
  (\ f -> Z)
  s_Bits_to_Bits)

-- Converts a lambda-encoded list to a native list
s_List_to_Bits :: S_List -> List
s_List_to_Bits (S_List xs) = xs (\x xs -> Cons (s_Bits_to_Bits x) (s_List_to_Bits xs)) Nil

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

